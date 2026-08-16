import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import i18n from '../../i18n';
import { logAppEvent } from '../../firebase';
import type { RoadmapState } from '../useRoadmapStore';
import { islem } from '../gecmis';
import { bugununMetni, buyukOlan, gunEkle, kucukOlan } from '../../utils/ganttTarih';

/**
 * Gantt (zaman çizelgesi).
 *
 * Görevler düz bir listede duruyor, hiyerarşi `ustId` ile kuruluyor — tıpkı
 * bir proje planı gibi. Ağaç yapısı yerine düz liste seçilmesinin sebebi sıra:
 * kullanıcı satırları yukarı aşağı taşıyor, düz listede bu tek bir dizi
 * işlemi; iç içe dizilerde her seferinde ağacı gezmek gerekirdi.
 *
 * Üst görevlerin kendi tarihleri YOK sayılıyor: bir üst görev alt görevlerinin
 * en erken başlangıcından en geç bitişine uzanır ve ilerlemesi onların
 * ortalamasıdır (bkz. ozetHesapla). Klasik Gantt davranışı budur; kullanıcı
 * üst satırın tarihini elle tutturmaya çalışmaz.
 */

export type GanttDurum = 'bekliyor' | 'devam' | 'bitti' | 'riskli';

export interface GanttGorev {
  id: string;
  ad: string;
  /** 'YYYY-MM-DD'. Kilometre taşında bitiş başlangıca eşittir. */
  baslangic: string;
  /** 'YYYY-MM-DD', bitiş günü dahildir. */
  bitis: string;
  /** Yüzde 0-100. Üst görevlerde okunmaz, alt görevlerden hesaplanır. */
  ilerleme: number;
  durum: GanttDurum;
  /** Üst görevin kimliği; en üst seviyede null. */
  ustId: string | null;
  /** Süresi olmayan işaret (teslim, onay, açılış...). */
  kilometreTasi?: boolean;
  /** Bu görev başlamadan önce bitmesi gereken görevler (bitiş-başlangıç). */
  oncekiler?: string[];
  sorumlu?: string;
  aciklama?: string;
  /** Alt görevleri gizli mi? */
  kapali?: boolean;
}

export interface GanttPlani {
  id: string;
  name: string;
  gorevler: GanttGorev[];
  createdAt: number;
}

/** Üst görevin alt görevlerinden türeyen tarih ve ilerlemesi. */
export interface GanttOzet {
  baslangic: string;
  bitis: string;
  ilerleme: number;
}

export interface GanttSlice {
  ganttPlans: GanttPlani[];
  activeGanttId: string | null;
  setActiveGantt: (id: string) => void;
  addGanttPlan: (name: string) => void;
  renameGanttPlan: (id: string, name: string) => void;
  deleteGanttPlan: (id: string) => void;
  /** Yeni görev; `ustId` verilirse alt görev olarak, kaynak satırın altına. */
  addGanttGorev: (planId: string, ustId?: string | null, komsuId?: string | null) => void;
  updateGanttGorev: (planId: string, gorevId: string, deger: Partial<GanttGorev>) => void;
  deleteGanttGorev: (planId: string, gorevId: string) => void;
  /** Satırı bir alt seviyeye indirir (bir üstündeki satırın altına). */
  ganttGoreviIcerial: (planId: string, gorevId: string) => void;
  /** Satırı bir seviye yukarı çıkarır. */
  ganttGoreviDisarial: (planId: string, gorevId: string) => void;
  /** Satırı listede yukarı/aşağı taşır (kendi alt ağacıyla birlikte). */
  ganttGoreviTasi: (planId: string, gorevId: string, yon: -1 | 1) => void;
  ganttGoreviKapat: (planId: string, gorevId: string) => void;
  ganttBagimlilikDegistir: (planId: string, gorevId: string, oncekiId: string) => void;
  loadGanttExample: (planId: string) => void;
}

export const yeniGanttPlani = (name: string): GanttPlani => ({
  id: uuidv4(),
  name,
  gorevler: [],
  createdAt: Date.now()
});

/** Bir görevin bütün alt görevleri (torunlar dahil). */
export const altGorevler = (gorevler: GanttGorev[], id: string): GanttGorev[] => {
  const dogrudan = gorevler.filter((g) => g.ustId === id);
  return dogrudan.flatMap((g) => [g, ...altGorevler(gorevler, g.id)]);
};

export const ustGorevMu = (gorevler: GanttGorev[], id: string) =>
  gorevler.some((g) => g.ustId === id);

/**
 * Üst görevin alt görevlerinden hesaplanan tarih aralığı ve ilerlemesi.
 * Alt görevi olmayan görevde kendi değerleri döner.
 */
export function ozetHesapla(gorevler: GanttGorev[], gorev: GanttGorev): GanttOzet {
  const altlar = altGorevler(gorevler, gorev.id).filter((g) => !ustGorevMu(gorevler, g.id));
  if (altlar.length === 0) {
    return { baslangic: gorev.baslangic, bitis: gorev.bitis, ilerleme: gorev.ilerleme };
  }
  let basla = altlar[0].baslangic;
  let bit = altlar[0].bitis;
  let toplam = 0;
  altlar.forEach((a) => {
    basla = kucukOlan(basla, a.baslangic);
    bit = buyukOlan(bit, a.bitis);
    toplam += a.ilerleme;
  });
  return { baslangic: basla, bitis: bit, ilerleme: Math.round(toplam / altlar.length) };
}

/**
 * Görevleri ekrandaki sıraya dizer: her görevin hemen ardından alt görevleri.
 * Kapalı görevlerin altları listeye hiç girmez.
 *
 * Derinlik de burada hesaplanıyor; satırın soldaki girintisi ondan geliyor.
 */
export function siraliGorevler(
  gorevler: GanttGorev[]
): { gorev: GanttGorev; derinlik: number }[] {
  const sonuc: { gorev: GanttGorev; derinlik: number }[] = [];
  const gez = (ustId: string | null, derinlik: number) => {
    gorevler
      .filter((g) => (g.ustId ?? null) === ustId)
      .forEach((g) => {
        sonuc.push({ gorev: g, derinlik });
        if (!g.kapali) gez(g.id, derinlik + 1);
      });
  };
  gez(null, 0);
  return sonuc;
}

/** Bir görev ile alt ağacını diziden çıkarır; ikisini ayrı ayrı döner. */
const altAgaciAyir = (gorevler: GanttGorev[], id: string) => {
  const altlar = altGorevler(gorevler, id).map((g) => g.id);
  const tasinan = gorevler.filter((g) => g.id === id || altlar.includes(g.id));
  const kalan = gorevler.filter((g) => g.id !== id && !altlar.includes(g.id));
  return { tasinan, kalan };
};

export const createGanttSlice: StateCreator<RoadmapState, [], [], GanttSlice> = (set, get) => ({
  ganttPlans: [],
  activeGanttId: null,

  setActiveGantt: (id) => set({ activeGanttId: id }),

  addGanttPlan: (name) => islem(() => {
    const plan = yeniGanttPlani(name);
    set({ ganttPlans: [...(get().ganttPlans || []), plan], activeGanttId: plan.id });
    logAppEvent('gantt_plan_created');
  }),

  renameGanttPlan: (id, name) => islem(() => {
    set({ ganttPlans: (get().ganttPlans || []).map((p) => (p.id === id ? { ...p, name } : p)) });
  }),

  deleteGanttPlan: (id) => islem(() => {
    const kalan = (get().ganttPlans || []).filter((p) => p.id !== id);
    set({
      ganttPlans: kalan,
      activeGanttId: get().activeGanttId === id ? (kalan[0]?.id ?? null) : get().activeGanttId
    });
  }),

  addGanttGorev: (planId, ustId = null, komsuId = null) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        const bugun = bugununMetni();
        // Yeni görev bugünden başlayıp üç gün sürüyor. Sıfır süreli bir çubuk
        // takvimde görünmüyor, kullanıcı da eklediğini sanıp bulamıyordu.
        const yeni: GanttGorev = {
          id: uuidv4(),
          ad: i18n.t('gantt_new_task'),
          baslangic: bugun,
          bitis: gunEkle(bugun, 2),
          ilerleme: 0,
          durum: 'bekliyor',
          ustId
        };
        // Komşu verildiyse onun (ve alt ağacının) hemen ardına giriyor;
        // yoksa listenin sonuna.
        if (!komsuId) return { ...p, gorevler: [...p.gorevler, yeni] };
        const altlar = altGorevler(p.gorevler, komsuId).map((g) => g.id);
        const sonIndeks = Math.max(
          p.gorevler.findIndex((g) => g.id === komsuId),
          ...p.gorevler.map((g, i) => (altlar.includes(g.id) ? i : -1))
        );
        const gorevler = [...p.gorevler];
        gorevler.splice(sonIndeks + 1, 0, yeni);
        return { ...p, gorevler };
      })
    });
  }),

  updateGanttGorev: (planId, gorevId, deger) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          gorevler: p.gorevler.map((g) => {
            if (g.id !== gorevId) return g;
            const yeni = { ...g, ...deger };
            // Bitiş başlangıcın önüne düşemez. Kullanıcı başlangıcı ileri
            // taşıdığında çubuk ters dönüyordu.
            if (yeni.bitis < yeni.baslangic) yeni.bitis = yeni.baslangic;
            if (yeni.kilometreTasi) yeni.bitis = yeni.baslangic;
            yeni.ilerleme = Math.min(100, Math.max(0, Math.round(yeni.ilerleme)));
            // Durum ile ilerleme birbirini takip ediyor: "bitti" işaretlenen
            // bir işin çubuğu yarı dolu kalırsa çizelge yalan söyler.
            if (deger.durum === 'bitti') yeni.ilerleme = 100;
            if (deger.ilerleme === 100 && g.durum !== 'riskli') yeni.durum = 'bitti';
            if (deger.ilerleme !== undefined && deger.ilerleme < 100 && g.durum === 'bitti') {
              yeni.durum = 'devam';
            }
            return yeni;
          })
        };
      })
    });
  }),

  deleteGanttGorev: (planId, gorevId) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        const { kalan } = altAgaciAyir(p.gorevler, gorevId);
        // Silinen göreve bağımlı olanlar öksüz kalmasın.
        const silinenler = [gorevId, ...altGorevler(p.gorevler, gorevId).map((g) => g.id)];
        return {
          ...p,
          gorevler: kalan.map((g) => ({
            ...g,
            oncekiler: g.oncekiler?.filter((o) => !silinenler.includes(o))
          }))
        };
      })
    });
  }),

  ganttGoreviIcerial: (planId, gorevId) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        const sirali = siraliGorevler(p.gorevler);
        const indeks = sirali.findIndex((s) => s.gorev.id === gorevId);
        if (indeks <= 0) return p;
        // Yeni üst, bir üstteki satırdır — ama ancak aynı ya da daha üst
        // seviyedeyse. Kendinden derin bir satırın altına girmek sırayı bozar.
        const ustAday = sirali
          .slice(0, indeks)
          .reverse()
          .find((s) => s.derinlik === sirali[indeks].derinlik);
        if (!ustAday) return p;
        return {
          ...p,
          gorevler: p.gorevler.map((g) => (g.id === gorevId ? { ...g, ustId: ustAday.gorev.id } : g))
        };
      })
    });
  }),

  ganttGoreviDisarial: (planId, gorevId) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        const gorev = p.gorevler.find((g) => g.id === gorevId);
        if (!gorev?.ustId) return p;
        const ust = p.gorevler.find((g) => g.id === gorev.ustId);
        return {
          ...p,
          gorevler: p.gorevler.map((g) => (g.id === gorevId ? { ...g, ustId: ust?.ustId ?? null } : g))
        };
      })
    });
  }),

  ganttGoreviTasi: (planId, gorevId, yon) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        // Yalnız kardeşler arasında yer değiştiriyor: taşınan satır alt
        // ağacıyla birlikte gidiyor, seviyesi değişmiyor.
        const kardesler = p.gorevler.filter((g) => (g.ustId ?? null) === (p.gorevler.find((x) => x.id === gorevId)?.ustId ?? null));
        const sira = kardesler.findIndex((g) => g.id === gorevId);
        const hedef = kardesler[sira + yon];
        if (!hedef) return p;
        const { tasinan, kalan } = altAgaciAyir(p.gorevler, gorevId);
        if (yon === -1) {
          const hedefIndeks = kalan.findIndex((g) => g.id === hedef.id);
          const gorevler = [...kalan];
          gorevler.splice(hedefIndeks, 0, ...tasinan);
          return { ...p, gorevler };
        }
        const hedefAltlari = altGorevler(kalan, hedef.id).map((g) => g.id);
        const sonIndeks = Math.max(
          kalan.findIndex((g) => g.id === hedef.id),
          ...kalan.map((g, i) => (hedefAltlari.includes(g.id) ? i : -1))
        );
        const gorevler = [...kalan];
        gorevler.splice(sonIndeks + 1, 0, ...tasinan);
        return { ...p, gorevler };
      })
    });
  }),

  ganttGoreviKapat: (planId, gorevId) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) =>
        p.id !== planId
          ? p
          : { ...p, gorevler: p.gorevler.map((g) => (g.id === gorevId ? { ...g, kapali: !g.kapali } : g)) }
      )
    });
  }),

  ganttBagimlilikDegistir: (planId, gorevId, oncekiId) => islem(() => {
    set({
      ganttPlans: (get().ganttPlans || []).map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          gorevler: p.gorevler.map((g) => {
            if (g.id !== gorevId) return g;
            const mevcut = g.oncekiler || [];
            return {
              ...g,
              oncekiler: mevcut.includes(oncekiId)
                ? mevcut.filter((o) => o !== oncekiId)
                : [...mevcut, oncekiId]
            };
          })
        };
      })
    });
  }),

  loadGanttExample: (planId) => islem(() => {
    const plan = (get().ganttPlans || []).find((p) => p.id === planId);
    if (!plan || plan.gorevler.length > 0) return;
    logAppEvent('example_loaded', { tool: 'gantt' });

    const bugun = bugununMetni();
    const kimlikler = Array.from({ length: 9 }, () => uuidv4());
    const [hazirlik, arastirma, sozlesme, kurulum, tadilat, ekipman, acilis, egitim, kutlama] = kimlikler;

    // Örnek, diğer araçlardaki kahve dükkanı senaryosunun devamı: kullanıcı
    // aynı işi WBS'te parçalayıp burada takvime yayıyor.
    const gorevler: GanttGorev[] = [
      { id: hazirlik, ad: i18n.t('gantt_example_prep'), baslangic: bugun, bitis: gunEkle(bugun, 13), ilerleme: 0, durum: 'devam', ustId: null },
      { id: arastirma, ad: i18n.t('gantt_example_research'), baslangic: bugun, bitis: gunEkle(bugun, 6), ilerleme: 100, durum: 'bitti', ustId: hazirlik },
      { id: sozlesme, ad: i18n.t('gantt_example_contract'), baslangic: gunEkle(bugun, 7), bitis: gunEkle(bugun, 13), ilerleme: 40, durum: 'devam', ustId: hazirlik, oncekiler: [arastirma] },
      { id: kurulum, ad: i18n.t('gantt_example_setup'), baslangic: gunEkle(bugun, 14), bitis: gunEkle(bugun, 34), ilerleme: 0, durum: 'bekliyor', ustId: null },
      { id: tadilat, ad: i18n.t('gantt_example_renovation'), baslangic: gunEkle(bugun, 14), bitis: gunEkle(bugun, 27), ilerleme: 0, durum: 'bekliyor', ustId: kurulum, oncekiler: [sozlesme] },
      { id: ekipman, ad: i18n.t('gantt_example_equipment'), baslangic: gunEkle(bugun, 24), bitis: gunEkle(bugun, 34), ilerleme: 0, durum: 'riskli', ustId: kurulum },
      { id: acilis, ad: i18n.t('gantt_example_launch'), baslangic: gunEkle(bugun, 35), bitis: gunEkle(bugun, 45), ilerleme: 0, durum: 'bekliyor', ustId: null },
      { id: egitim, ad: i18n.t('gantt_example_training'), baslangic: gunEkle(bugun, 35), bitis: gunEkle(bugun, 44), ilerleme: 0, durum: 'bekliyor', ustId: acilis, oncekiler: [ekipman] },
      { id: kutlama, ad: i18n.t('gantt_example_opening_day'), baslangic: gunEkle(bugun, 45), bitis: gunEkle(bugun, 45), ilerleme: 0, durum: 'bekliyor', ustId: acilis, kilometreTasi: true, oncekiler: [egitim] }
    ];

    set({
      ganttPlans: (get().ganttPlans || []).map((p) => (p.id === planId ? { ...p, gorevler } : p))
    });
  })
});

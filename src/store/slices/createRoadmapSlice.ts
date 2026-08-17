import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { NodeChange, EdgeChange, Edge, Node } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { islem, gecmisiTemizle } from '../gecmis';

/**
 * Yol haritası: bir konuyu baştan sona sıralı duraklara bölen, her durağın
 * yanına yan konuların takıldığı harita.
 *
 * Zihin haritasından farkı, ortada bir kök değil bir HAT olması: duraklar
 * birbirini takip eder, yan konular o hattın sağına soluna asılır. Kırılım
 * ağacından farkı ise ilerleme tutması: her kutunun bir durumu var ve harita
 * "yüzde kaçı bitti" sorusuna cevap veriyor.
 */

/** Kutunun ilerleme durumu. Kaydedilmemişse "bekliyor" sayılır. */
export type RoadmapDurum = 'bekliyor' | 'ogreniyor' | 'bitti' | 'atlandi';

/**
 * Kutunun türü.
 *  - `bolum`: hat üzerindeki seviye başlığı (Başlangıç / Orta / İleri).
 *    Kendisi bir iş değil, o yüzden ilerlemeye sayılmaz.
 *  - `adim`: hat üzerindeki durak.
 *  - `konu`: bir durağa (ya da başka bir konuya) asılan yan konu.
 */
export type RoadmapKutuTuru = 'bolum' | 'adim' | 'konu';

export type RoadmapKaynakTuru = 'yazi' | 'video' | 'kurs' | 'kitap' | 'arac' | 'diger';

/** Kutuya iliştirilen dış bağlantı. */
export interface RoadmapKaynak {
  id: string;
  baslik: string;
  url: string;
  tur: RoadmapKaynakTuru;
  /** Ücretli kaynaklar listede işaretleniyor; roadmap.sh'teki ayrımın eşi. */
  ucretli?: boolean;
}

export type RoadmapNodeData = {
  label: string;
  tur: RoadmapKutuTuru;
  durum?: RoadmapDurum;
  /**
   * Seçmeli konu. Hattın zorunlu iskeletine dahil değil: kesik çizgiyle
   * bağlanır ve ilerleme yüzdesinin paydasına girmez.
   */
  secmeli?: boolean;
  description?: string;
  kaynaklar?: RoadmapKaynak[];
  /** Tahmini süre, saat. Toplamı üstteki şeritte gösteriliyor. */
  sure?: number;
  /** Durağın yan konuları gizli mi. */
  collapsed?: boolean;
  /** Yan konu hattın hangi yanında duruyor. Boşsa yerleşim kendi seçer. */
  taraf?: 'sag' | 'sol';
};

export type RoadmapNode = Node<RoadmapNodeData>;

/** Hattın akış yönü. Kullanıcı tek düğmeyle 90 derece çeviriyor. */
export type RoadmapYon = 'dikey' | 'yatay';

export type Roadmap = {
  id: string;
  name: string;
  nodes: RoadmapNode[];
  edges: Edge[];
  /** Kaydedilmemiş eski haritalar dikey sayılır. */
  yon?: RoadmapYon;
  createdAt: number;
};

export interface RoadmapSlice {
  roadmaps: Roadmap[];
  /** Ekranda açık harita. Kişisel bir tercih; projeye kaydedilmez. */
  activeRoadmapId: string | null;
  roadmapSelectedId: string | null;
  setRoadmapSelected: (id: string | null) => void;
  /** Adı yerinde düzenlenen kutu. */
  roadmapEditingLabelId: string | null;
  setRoadmapEditingLabel: (id: string | null) => void;
  /** Sağdaki ayrıntı paneli hangi kutu için açık. */
  roadmapDetayId: string | null;
  setRoadmapDetayId: (id: string | null) => void;

  setActiveRoadmap: (id: string) => void;
  addRoadmap: (name: string, ilkAdim: string) => void;
  renameRoadmap: (id: string, name: string) => void;
  deleteRoadmap: (id: string) => void;
  setRoadmapYon: (yon: RoadmapYon) => void;

  onRoadmapNodesChange: (changes: NodeChange[]) => void;
  onRoadmapEdgesChange: (changes: EdgeChange[]) => void;

  /**
   * Hatta yeni durak ya da bölüm başlığı ekler. `sonrakiId` verilirse o
   * kutunun hemen ardına, verilmezse hattın sonuna girer.
   */
  addRoadmapStep: (label: string, tur: 'adim' | 'bolum', sonrakiId?: string) => string | null;
  /** Bir durağa (ya da konuya) yan konu asar. */
  addRoadmapTopic: (parentId: string, label: string) => string | null;
  updateRoadmapNode: (id: string, data: Partial<RoadmapNodeData>) => void;
  /** Kutuyu ve altındaki yan konuları siler; hat kopmadan kapanır. */
  deleteRoadmapNode: (id: string) => void;
  /** Durumu sırayla çevirir: bekliyor → öğreniyor → bitti → atlandı → ... */
  cycleRoadmapStatus: (id: string) => void;
  setRoadmapStatus: (id: string, durum: RoadmapDurum) => void;
  toggleRoadmapSecmeli: (id: string) => void;
  toggleRoadmapCollapse: (id: string) => void;
  /** Durağı hat üzerinde bir sıra yukarı (-1) ya da aşağı (+1) taşır. */
  moveRoadmapStep: (id: string, yon: -1 | 1) => void;

  /**
   * Açık haritanın içeriğini toptan değiştirir. Hazır örneği yüklemek için
   * var; örnek metinleri dile bağlı olduğu için depoda değil, çağıran tarafta
   * kuruluyor (bkz. roadmapOrnek.ts).
   */
  replaceRoadmapContent: (nodes: RoadmapNode[], edges: Edge[]) => void;

  addRoadmapKaynak: (id: string, kaynak: Omit<RoadmapKaynak, 'id'>) => void;
  updateRoadmapKaynak: (id: string, kaynakId: string, kaynak: Partial<Omit<RoadmapKaynak, 'id'>>) => void;
  deleteRoadmapKaynak: (id: string, kaynakId: string) => void;
}

/** Açık harita; kimlik eskimişse listenin ilki. */
export function getActiveRoadmap(state: { roadmaps: Roadmap[]; activeRoadmapId: string | null }): Roadmap | undefined {
  return state.roadmaps.find((h) => h.id === state.activeRoadmapId) || state.roadmaps[0];
}

/** Kutu hattın üzerinde mi (durak ya da bölüm başlığı). */
export const hattaMi = (n: RoadmapNode) => n.data.tur !== 'konu';

/**
 * Hattın sırası.
 *
 * Sıra dizideki yerden değil kenarlardan okunuyor: kutular arasına araya
 * ekleme yapılabiliyor ve dizinin kendisi o sırayı taşımıyor. Başlangıç,
 * kendisine hattan gelen kenarı olmayan kutu.
 */
export function roadmapHatti(nodes: RoadmapNode[], edges: Edge[]): RoadmapNode[] {
  const hat = nodes.filter(hattaMi);
  if (hat.length === 0) return [];
  const kimlikler = new Set(hat.map((n) => n.id));
  const hatKenarlari = edges.filter((e) => kimlikler.has(e.source) && kimlikler.has(e.target));

  const hedefler = new Set(hatKenarlari.map((e) => e.target));
  const sonraki = new Map(hatKenarlari.map((e) => [e.source, e.target]));

  const bas = hat.find((n) => !hedefler.has(n.id)) || hat[0];
  const sonuc: RoadmapNode[] = [];
  const gorulen = new Set<string>();
  let su: string | undefined = bas.id;
  while (su && !gorulen.has(su)) {
    gorulen.add(su);
    const kutu = hat.find((n) => n.id === su);
    if (kutu) sonuc.push(kutu);
    su = sonraki.get(su);
  }
  // Kenarı kopmuş kutular kaybolmasın; sona ekleniyorlar.
  hat.forEach((n) => { if (!gorulen.has(n.id)) sonuc.push(n); });
  return sonuc;
}

/** Bir kutunun altındaki bütün yan konular (kendisi hariç). */
export function roadmapAltKonular(id: string, nodes: RoadmapNode[], edges: Edge[]): string[] {
  const konu = new Set(nodes.filter((n) => n.data.tur === 'konu').map((n) => n.id));
  const sonuc: string[] = [];
  const sira = [id];
  while (sira.length > 0) {
    const su = sira.pop()!;
    edges.filter((e) => e.source === su && konu.has(e.target)).forEach((e) => {
      if (sonuc.includes(e.target)) return;
      sonuc.push(e.target);
      sira.push(e.target);
    });
  }
  return sonuc;
}

/**
 * Haritanın ilerlemesi.
 *
 * Paydaya bölüm başlıkları girmiyor (onlar iş değil, etiket) ve seçmeli
 * konular da girmiyor: seçmeli olanı yapmayan kullanıcı haritayı bitirmemiş
 * sayılmamalı. Ama seçmeli bir konuyu bitirmişse o sayıya EKLENİYOR, yoksa
 * yüzde yüzü geçen bir ilerleme çıkardı — bu yüzden bitmiş sayısı payda ile
 * sınırlanıyor.
 */
export function roadmapIlerleme(nodes: RoadmapNode[]) {
  const sayilanlar = nodes.filter((n) => n.data.tur !== 'bolum' && !n.data.secmeli);
  const toplam = sayilanlar.length;
  const bitti = sayilanlar.filter((n) => n.data.durum === 'bitti').length;
  const atlandi = sayilanlar.filter((n) => n.data.durum === 'atlandi').length;
  const ogreniyor = sayilanlar.filter((n) => n.data.durum === 'ogreniyor').length;
  // Atlanan konu "yapılmayacak" demek; ilerlemeyi sonsuza kadar eksik
  // bırakmaması için bitmiş sayılıyor.
  const tamamlanan = bitti + atlandi;
  const yuzde = toplam === 0 ? 0 : Math.round((tamamlanan / toplam) * 100);

  // Kalan süre yalnızca daha yapılacak işlerden; seçmeli olanlar da dahil,
  // çünkü kullanıcı onları da yapmayı planlıyor olabilir.
  const kalanSure = nodes
    .filter((n) => n.data.tur !== 'bolum' && n.data.durum !== 'bitti' && n.data.durum !== 'atlandi')
    .reduce((acc, n) => acc + (Number(n.data.sure) || 0), 0);
  const toplamSure = nodes
    .filter((n) => n.data.tur !== 'bolum')
    .reduce((acc, n) => acc + (Number(n.data.sure) || 0), 0);

  return { toplam, bitti, atlandi, ogreniyor, tamamlanan, yuzde, kalanSure, toplamSure };
}

const SIRA: RoadmapDurum[] = ['bekliyor', 'ogreniyor', 'bitti', 'atlandi'];

export function sonrakiDurum(durum: RoadmapDurum | undefined): RoadmapDurum {
  const i = SIRA.indexOf(durum || 'bekliyor');
  return SIRA[(i + 1) % SIRA.length];
}

/** Yeni haritanın ilk durağı. */
export function yeniRoadmapAdimi(label: string, tur: RoadmapKutuTuru = 'adim'): RoadmapNode {
  return { id: uuidv4(), type: 'roadmapNode', position: { x: 0, y: 0 }, data: { label, tur } };
}

/** Yeni bir yol haritası kaydı. */
export function yeniRoadmap(name: string, ilkAdim: string): Roadmap {
  return {
    id: uuidv4(),
    name,
    nodes: [yeniRoadmapAdimi(ilkAdim)],
    edges: [],
    yon: 'dikey',
    createdAt: Date.now()
  };
}

export const createRoadmapSlice: StateCreator<RoadmapState, [], [], RoadmapSlice> = (set, get) => {
  /** Açık haritayı değiştirir, ötekilere dokunmaz. */
  const aktifiGuncelle = (state: RoadmapState, degistir: (harita: Roadmap) => Roadmap) => {
    const aktif = getActiveRoadmap(state);
    if (!aktif) return state;
    return {
      ...state,
      roadmaps: state.roadmaps.map((h) => (h.id === aktif.id ? degistir(h) : h))
    };
  };

  const kenar = (source: string, target: string): Edge => ({ id: uuidv4(), source, target });

  return {
    roadmaps: [],
    activeRoadmapId: null,
    roadmapSelectedId: null,
    roadmapEditingLabelId: null,
    roadmapDetayId: null,

    setRoadmapSelected: (id) => set({ roadmapSelectedId: id } as Partial<RoadmapState>),
    setRoadmapEditingLabel: (id) => set({ roadmapEditingLabelId: id } as Partial<RoadmapState>),
    setRoadmapDetayId: (id) => set({ roadmapDetayId: id } as Partial<RoadmapState>),

    // Geçmiş açık haritaya ait; harita değişince yığındaki kayıtlar ekranda
    // olmayan bir şeye ait olur ve geri tuşu görünürde hiçbir şey yapmazdı.
    setActiveRoadmap: (id) => {
      gecmisiTemizle();
      set({
        activeRoadmapId: id,
        roadmapSelectedId: null,
        roadmapEditingLabelId: null,
        roadmapDetayId: null
      } as Partial<RoadmapState>);
    },

    addRoadmap: (name, ilkAdim) => {
      gecmisiTemizle();
      set((state) => {
        const yeni = yeniRoadmap(name, ilkAdim);
        return {
          ...state,
          roadmaps: [...state.roadmaps, yeni],
          activeRoadmapId: yeni.id,
          roadmapSelectedId: null,
          roadmapEditingLabelId: null,
          roadmapDetayId: null
        };
      });
    },

    renameRoadmap: (id, name) => {
      set((state) => ({
        ...state,
        roadmaps: state.roadmaps.map((h) => (h.id === id ? { ...h, name } : h))
      }));
    },

    deleteRoadmap: (id) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = state.roadmaps.filter((h) => h.id !== id);
        return {
          ...state,
          roadmaps: kalan,
          activeRoadmapId: state.activeRoadmapId === id ? (kalan[0]?.id ?? null) : state.activeRoadmapId,
          roadmapSelectedId: null,
          roadmapEditingLabelId: null,
          roadmapDetayId: null
        };
      });
    },

    // Yön haritanın kendi ayarı, kişisel bir görünüm tercihi değil: aynı
    // haritaya bakan iki kişi aynı şekli görmeli.
    setRoadmapYon: (yon) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({ ...harita, yon })));
    }),

    onRoadmapNodesChange: (changes) => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: applyNodeChanges(changes, harita.nodes) as RoadmapNode[]
      })));
    },

    onRoadmapEdgesChange: (changes) => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        edges: applyEdgeChanges(changes, harita.edges) as Edge[]
      })));
    },

    addRoadmapStep: (label, tur, sonrakiId) => islem(() => {
      const aktif = getActiveRoadmap(get());
      if (!aktif) return null;
      const dugum: RoadmapNode = { id: uuidv4(), type: 'roadmapNode', position: { x: 0, y: 0 }, data: { label, tur } };
      const hat = roadmapHatti(aktif.nodes, aktif.edges);

      set((state) => aktifiGuncelle(state, (harita) => {
        const nodes = [...harita.nodes, dugum];
        if (hat.length === 0) return { ...harita, nodes };

        // Araya ekleme: eski kenar kesilir, yeni kutu ikisinin ortasına girer.
        const oncekiId = sonrakiId ?? hat[hat.length - 1].id;
        const oncekininSonrasi = harita.edges.find((e) =>
          e.source === oncekiId && harita.nodes.some((n) => n.id === e.target && hattaMi(n))
        );

        const edges = harita.edges.filter((e) => e.id !== oncekininSonrasi?.id);
        edges.push(kenar(oncekiId, dugum.id));
        if (oncekininSonrasi) edges.push(kenar(dugum.id, oncekininSonrasi.target));
        return { ...harita, nodes, edges };
      }));
      return dugum.id;
    }),

    addRoadmapTopic: (parentId, label) => islem(() => {
      const aktif = getActiveRoadmap(get());
      const ebeveyn = aktif?.nodes.find((n) => n.id === parentId);
      // Bölüm başlığı bir iş değil; altına konu asılmıyor.
      if (!aktif || !ebeveyn || ebeveyn.data.tur === 'bolum') return null;

      const dugum: RoadmapNode = { id: uuidv4(), type: 'roadmapNode', position: { x: 0, y: 0 }, data: { label, tur: 'konu' } };
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        // Kapalı bir durağa ekleme yapılırsa yeni konu görünmezdi; açılıyor.
        nodes: [
          ...harita.nodes.map((n) => (n.id === parentId && n.data.collapsed ? { ...n, data: { ...n.data, collapsed: false } } : n)),
          dugum
        ],
        edges: [...harita.edges, kenar(parentId, dugum.id)]
      })));
      return dugum.id;
    }),

    updateRoadmapNode: (id, data) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
      })));
    }),

    deleteRoadmapNode: (id) => islem(() => {
      set((state) => {
        const aktif = getActiveRoadmap(state);
        if (!aktif) return state;
        const kutu = aktif.nodes.find((n) => n.id === id);
        if (!kutu) return state;

        const silinecek = new Set([id, ...roadmapAltKonular(id, aktif.nodes, aktif.edges)]);

        // Hattan bir durak silinince önü ve arkası birbirine bağlanmalı;
        // yoksa hat ikiye ayrılır ve sıra kaybolur.
        let edges = aktif.edges;
        if (hattaMi(kutu)) {
          const hatKimlik = new Set(aktif.nodes.filter(hattaMi).map((n) => n.id));
          const onceki = edges.find((e) => e.target === id && hatKimlik.has(e.source));
          const sonra = edges.find((e) => e.source === id && hatKimlik.has(e.target));
          edges = edges.filter((e) => e.id !== onceki?.id && e.id !== sonra?.id);
          if (onceki && sonra) edges = [...edges, kenar(onceki.source, sonra.target)];
        }

        return {
          ...aktifiGuncelle(state, (harita) => ({
            ...harita,
            nodes: harita.nodes.filter((n) => !silinecek.has(n.id)),
            edges: edges.filter((e) => !silinecek.has(e.source) && !silinecek.has(e.target))
          })),
          roadmapSelectedId: silinecek.has(state.roadmapSelectedId || '') ? null : state.roadmapSelectedId,
          roadmapEditingLabelId: silinecek.has(state.roadmapEditingLabelId || '') ? null : state.roadmapEditingLabelId,
          roadmapDetayId: silinecek.has(state.roadmapDetayId || '') ? null : state.roadmapDetayId
        };
      });
    }),

    cycleRoadmapStatus: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, durum: sonrakiDurum(n.data.durum) } } : n))
      })));
    }),

    setRoadmapStatus: (id, durum) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, durum } } : n))
      })));
    }),

    toggleRoadmapSecmeli: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, secmeli: !n.data.secmeli } } : n))
      })));
    }),

    toggleRoadmapCollapse: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } } : n))
      })));
    }),

    // Hat üzerinde yer değiştirme. Kenarlar sırayı taşıdığı için hat baştan
    // kuruluyor: iki kutunun yerini takas edip zinciri yeniden bağlamak, tek
    // tek kenar düzeltmekten hem kısa hem de kopma riski olmayan yol.
    moveRoadmapStep: (id, yon) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => {
        const hat = roadmapHatti(harita.nodes, harita.edges);
        const i = hat.findIndex((n) => n.id === id);
        const j = i + yon;
        if (i < 0 || j < 0 || j >= hat.length) return harita;

        const yeniSira = [...hat];
        [yeniSira[i], yeniSira[j]] = [yeniSira[j], yeniSira[i]];

        const hatKimlik = new Set(hat.map((n) => n.id));
        const digerKenarlar = harita.edges.filter((e) => !(hatKimlik.has(e.source) && hatKimlik.has(e.target)));
        const yeniHatKenarlari = yeniSira.slice(0, -1).map((n, k) => kenar(n.id, yeniSira[k + 1].id));
        return { ...harita, edges: [...digerKenarlar, ...yeniHatKenarlari] };
      }));
    }),

    replaceRoadmapContent: (nodes, edges) => islem(() => {
      set((state) => ({
        ...aktifiGuncelle(state, (harita) => ({ ...harita, nodes, edges })),
        roadmapSelectedId: null,
        roadmapEditingLabelId: null,
        roadmapDetayId: null
      }));
    }),

    addRoadmapKaynak: (id, kaynak) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, kaynaklar: [...(n.data.kaynaklar || []), { ...kaynak, id: uuidv4() }] } } : n
        )
      })));
    }),

    updateRoadmapKaynak: (id, kaynakId, kaynak) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, kaynaklar: (n.data.kaynaklar || []).map((k) => (k.id === kaynakId ? { ...k, ...kaynak } : k)) } }
            : n
        )
      })));
    }),

    deleteRoadmapKaynak: (id, kaynakId) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, kaynaklar: (n.data.kaynaklar || []).filter((k) => k.id !== kaynakId) } } : n
        )
      })));
    })
  };
};

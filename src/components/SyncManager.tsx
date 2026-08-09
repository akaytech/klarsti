import { useEffect, useRef } from 'react';
import { useRoadmapStore, TOOL_STATE_KEYS, isRemoteUpdate } from '../store/useRoadmapStore';
import type { Project } from '../store/useRoadmapStore';
import { useAuthStore } from '../store/useAuthStore';
import { doc, setDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';
import i18n from '../i18n';
import { stripUndefined } from '../utils/firestoreSafe';
import { bekleyenYazmalariBildir } from '../store/bekleyenYazmalar';
import { projeCalismalariniEsitle, anahtarlardanAraclar } from '../store/calismaYazma';

const SAVE_DEBOUNCE_MS = 1000;

// Senkron patlayan yazmalar da sessiz kalmasin diye tek kapidan gecirilir.
// Hata yutuldugu icin cagiran taraf sonucu ayirt edemiyordu; artik yazmanin
// gercekten basarili olup olmadigini dondurur (bkz. gun sonu gostergesi).
const safeWrite = (run: () => Promise<unknown>, label: string): Promise<boolean> => {
  const fail = (err: unknown) => {
    console.error(label, err);
    toast.error(i18n.t('save_failed', { defaultValue: 'Failed to save to cloud' }), { id: 'save-failed' });
    return false;
  };
  try {
    return run().then(() => true).catch(fail);
  } catch (err) {
    fail(err);
    return Promise.resolve(false);
  }
};

// Projenin araç verisi dışındaki alanları (ad, paylaşım, sahip). Nesne kimliği
// her uzak snapshot'ta değiştiği için üst bilginin gerçekten değişip
// değişmediğine buradan bakılıyor. Anahtar sırası farklı gelirse imza da farklı
// çıkar; bu yalnızca gereksiz bir tam yazma demektir, veri kaybettirmez.
const metaImzasi = (p: Project) => JSON.stringify({ ...p, toolData: undefined, updatedAt: undefined });

// Oturum kapanmadan önce bekleyenleri göndermek için dışarı açılan tek kapı.
// SyncManager takılıyken doludur, sökülünce boşalır.
let flushHandler: (() => Promise<boolean>) | null = null;

export type FlushSonucu = 'ok' | 'failed' | 'timeout';

// Bekleyen bütün yazmaları hemen gönderir ve sunucu onayını bekler.
// Süre sınırı şart: projede Firestore kalıcı önbelleği açık değil, çevrimdışı
// bir kullanıcıda setDoc promise'i hiç çözülmüyor ve çıkış ekranda asılı kalır.
export const flushPendingSaves = (timeoutMs = 3000): Promise<FlushSonucu> => {
  if (!flushHandler) return Promise.resolve('ok');
  return Promise.race([
    flushHandler().then((ok): FlushSonucu => (ok ? 'ok' : 'failed')),
    new Promise<FlushSonucu>((resolve) => setTimeout(() => resolve('timeout'), timeoutMs)),
  ]);
};

export default function SyncManager() {
  const pendingSaves = useRef(new Map<string, { project: Project; degisenAraclar: Set<string>; metaDegisti: boolean; timer: ReturnType<typeof setTimeout> }>());
  const pendingPersonal = useRef<{ uid: string; notepad: unknown; timer: ReturnType<typeof setTimeout> } | null>(null);
  const pendingJournal = useRef(new Map<string, { uid: string; text: string; timer: ReturnType<typeof setTimeout> }>());
  const lastSynced = useRef(new Map<string, Project>());
  const isSyncing = useRef(false);
  // Kuyruktan çıkıp sunucuya doğru yola çıkmış ama daha onaylanmamış araçlar.
  // Sayaçla tutuluyor: aynı araç için iki yazma üst üste binerse ilki
  // tamamlandığında ikincisi hâlâ yolda olabilir.
  const ucusanAraclar = useRef(new Map<string, Map<string, number>>());
  const ucusanKisisel = useRef(0);

  useEffect(() => {
    const ucusanEkle = (projectId: string, anahtarlar: Set<string>) => {
      const sayac = ucusanAraclar.current.get(projectId) ?? new Map<string, number>();
      anahtarlar.forEach((anahtar) => sayac.set(anahtar, (sayac.get(anahtar) ?? 0) + 1));
      ucusanAraclar.current.set(projectId, sayac);
    };

    const ucusanCikar = (projectId: string, anahtarlar: Set<string>) => {
      const sayac = ucusanAraclar.current.get(projectId);
      if (!sayac) return;
      anahtarlar.forEach((anahtar) => {
        const kalan = (sayac.get(anahtar) ?? 0) - 1;
        if (kalan > 0) sayac.set(anahtar, kalan);
        else sayac.delete(anahtar);
      });
      if (sayac.size === 0) ucusanAraclar.current.delete(projectId);
    };

    // Üst bilgi değiştiyse dokümanın tamamı yazılır; bu nadir (ad değişikliği,
    // paylaşım). Sıradan bir araç düzenlemesinde yalnızca değişen aracın alanı
    // gönderilir: eskiden tek bir kutu sürüklenince on yedi aracın verisi birden
    // yükleniyor ve doküman boyut sınırına doğru şişiyordu. setDoc merge iç içe
    // haritaları alan alan birleştirip dizileri komple değiştiriyor; araç
    // verilerinin hepsi dizi olduğu için istediğimiz davranış tam olarak bu.
    const writeProject = (projectId: string, project: Project, degisenAraclar: Set<string>, metaDegisti: boolean) => {
      const govde: Record<string, any> = metaDegisti
        ? project
        : {
            updatedAt: project.updatedAt,
            toolData: Object.fromEntries(
              Array.from(degisenAraclar).map((anahtar) => [anahtar, project.toolData[anahtar]])
            ),
          };
      // Tam doküman gidiyorsa bütün araçların verisi yazılıyor demektir.
      const yoldakiler = metaDegisti ? new Set<string>(TOOL_STATE_KEYS) : new Set(degisenAraclar);
      ucusanEkle(projectId, yoldakiler);
      return safeWrite(
        () => Promise.all([
          setDoc(doc(db, 'projects', projectId), govde, { merge: true }),
          calismalariDaYaz(project, yoldakiler)
        ]),
        "Firestore Save Error:"
      )
        .then((ok) => {
          ucusanCikar(projectId, yoldakiler);
          return ok;
        });
    };

    // GEÇİŞ DÖNEMİ: aynı veri bir de 'works' koleksiyonuna yazılıyor.
    //
    // Okuma hâlâ projenin toolData'sından yapılıyor, yani buranın bir hatası
    // kullanıcıya yansımaz ve eski kopya güncel kalır. Okuma yeni kayıtlara
    // çevrildiğinde geri dönülebilecek sağlam bir nokta olsun diye böyle.
    //
    // Yalnızca klasörün sahibi yazıyor: kurallar yeni bir çalışmayı ancak
    // klasörün sahibine bağlı olarak kuruyor, ortak çalışanın kurulum yazması
    // reddedilirdi. Ortakların düzenlemeleri şimdilik yalnızca eski yere
    // gidiyor; okuma çevrildiğinde bu dal da açılacak.
    const calismalariDaYaz = (project: Project, degisenAnahtarlar: ReadonlySet<string>) => {
      const user = useAuthStore.getState().user;
      if (!user || project.userId !== user.uid) return Promise.resolve();

      const mevcutKayitlar = useRoadmapStore.getState().works.filter((w) => w.projectId === project.id);
      const araclar = anahtarlardanAraclar(degisenAnahtarlar);
      if (araclar.size === 0) return Promise.resolve();

      // Hatalar yutuluyor: bu yazma henüz kimseye görünmüyor, başarısız olması
      // kullanıcıya "kaydedilemedi" dedirtmemeli. Asıl kayıt yukarıda.
      return Promise.all(projeCalismalariniEsitle(project, mevcutKayitlar, araclar))
        .then(() => undefined)
        .catch((err) => {
          console.error('Works mirror write failed:', err);
        });
    };

    // İlk doldurma. Yukarıdaki ayna yazması yalnızca DEĞİŞEN araçları
    // gönderiyor; hiç dokunulmayan çalışmalar yeni yerine kendiliğinden
    // geçmezdi. Bu, proje başına bir kez, yalnızca eksik olanları yazar.
    const doldurulan = new Set<string>();
    const eksikleriDoldur = () => {
      const durum = useRoadmapStore.getState();
      const user = useAuthStore.getState().user;
      // İki liste de gelmeden çalışmaz: works listesi eksikken "yok" sanıp
      // her şeyi baştan kurmaya kalkardı.
      if (!user || !durum.projectsLoaded || !durum.worksLoaded) return;

      durum.projects.forEach((project) => {
        if (project.userId !== user.uid) return;
        if (doldurulan.has(project.id)) return;
        doldurulan.add(project.id);

        const mevcutKayitlar = durum.works.filter((w) => w.projectId === project.id);
        // Fazlalık kayıtlar da burada temizleniyor: hiç dokunulmamış
        // başlangıç çalışmalarının kaydı ve silinmiş çalışmalardan kalanlar.
        const yazmalar = projeCalismalariniEsitle(project, mevcutKayitlar, undefined, true);
        if (yazmalar.length === 0) return;
        Promise.all(yazmalar).catch((err) => {
          console.error('Works backfill failed:', err);
          // Bir dahaki denemeye kapı açık kalsın.
          doldurulan.delete(project.id);
        });
      });
    };

    const flushProjectSave = (projectId: string): Promise<boolean> => {
      const pending = pendingSaves.current.get(projectId);
      if (!pending) return Promise.resolve(true);
      clearTimeout(pending.timer);
      pendingSaves.current.delete(projectId);
      return writeProject(projectId, pending.project, pending.degisenAraclar, pending.metaDegisti);
    };

    // Yazmaların sonucu döndürülür: çıkışta oturum kapatılmadan önce gerçekten
    // sunucuya ulaştıklarını beklemek gerekiyor (bkz. flushPendingSaves).
    const flushAllSaves = (): Promise<boolean> =>
      Promise.all([
        ...Array.from(pendingSaves.current.keys()).map(flushProjectSave),
        flushPersonalSave(),
        flushJournalSaves(),
      ]).then((sonuclar) => sonuclar.every(Boolean));

    // Sayfa kapanırken/arka plana alınırken bekleyen yazmalar gönderilir.
    // DİKKAT: İkisi de cleanup'ta kaldırılmalı. visibilitychange eskiden
    // isimsiz bir fonksiyonla bağlanıyordu, yani kaldırılması imkânsızdı;
    // bileşen her yeniden bağlandığında (çıkış/giriş) bir öncekinin
    // dinleyicisi ayakta kalıyor ve o oturumun eski verisine kapanıyordu.
    const handlePageHide = () => flushAllSaves();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushAllSaves();
    };

    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    flushHandler = flushAllSaves;

    // Uzak snapshot, yazması hâlâ bekleyen araçların üstüne yazmasın.
    bekleyenYazmalariBildir(
      (projectId) => {
        const kuyruktakiler = pendingSaves.current.get(projectId)?.degisenAraclar ?? new Set<string>();
        const yoldakiler = ucusanAraclar.current.get(projectId);
        if (!yoldakiler || yoldakiler.size === 0) return kuyruktakiler;
        return new Set<string>([...Array.from(kuyruktakiler), ...Array.from(yoldakiler.keys())]);
      },
      () => pendingPersonal.current !== null || ucusanKisisel.current > 0
    );

    // Kişisel ajanda projeden bağımsız, users/{uid} dokümanına yazılır.
    const writePersonal = (uid: string, notepad: unknown) => {
      ucusanKisisel.current += 1;
      // stripUndefined sart: ajanda kaydinda linkedWbsNodeId gibi alanlar undefined olabiliyor.
      return safeWrite(
        () => setDoc(doc(db, 'users', uid), stripUndefined({ notepad, updatedAt: Date.now() }), { merge: true }),
        "Personal save error:"
      ).then((ok) => {
        ucusanKisisel.current -= 1;
        return ok;
      });
    };

    const flushPersonalSave = (): Promise<boolean> => {
      const pending = pendingPersonal.current;
      if (!pending) return Promise.resolve(true);
      clearTimeout(pending.timer);
      pendingPersonal.current = null;
      return writePersonal(pending.uid, pending.notepad);
    };

    const unsubscribePersonal = useRoadmapStore.subscribe((state, prevState) => {
      if (isRemoteUpdate) return;
      if (state.notepad === prevState.notepad) return;
      // İlk yükleme sunucudan gelmeden yazmayalım; yoksa boş liste kayıtları ezer.
      if (!state.personalLoaded) return;
      const user = useAuthStore.getState().user;
      if (!user) return;

      if (pendingPersonal.current) clearTimeout(pendingPersonal.current.timer);
      pendingPersonal.current = {
        uid: user.uid,
        notepad: state.notepad,
        timer: setTimeout(() => {
          const pending = pendingPersonal.current;
          pendingPersonal.current = null;
          if (pending) writePersonal(pending.uid, pending.notepad);
        }, SAVE_DEBOUNCE_MS)
      };
    });

    // Gün sonu değerlendirmesi: her gün ayrı doküman. Boşaltılan gün silinir,
    // takvim işareti için tutulan gün listesi de kullanıcı dokümanında güncellenir.
    // Bu liste eskiden istemcideki haliyle KOMPLE yazılıyordu: iki cihaz farklı
    // günleri düzenlediğinde son yazan kazanıyor ve diğerinin işareti listeden
    // düşüyordu (metin sunucuda duruyor ama takvimde görünmez oluyordu).
    // arrayUnion/arrayRemove sunucu tarafında yalnızca ilgili günü ekleyip
    // çıkardığı için diğer cihazın eklediği günlere dokunmaz.
    const writeJournalDay = (uid: string, dateKey: string, text: string): Promise<boolean> => {
      const ref = doc(db, 'users', uid, 'journal', dateKey);
      const isEmpty = text.trim() === '';
      return safeWrite(() => {
        const write = isEmpty
          ? deleteDoc(ref)
          : setDoc(ref, stripUndefined({ text, updatedAt: Date.now() }), { merge: true });
        return write.then(() => setDoc(doc(db, 'users', uid), {
          journalDates: isEmpty ? arrayRemove(dateKey) : arrayUnion(dateKey)
        }, { merge: true }));
      }, "Journal save error:").then((ok) => {
        // Gösterge gün bazlı: yalnızca bu günün kaydı kapanır, başka bir gün
        // hâlâ beklemedeyse onun "kaydediliyor" durumu bozulmaz.
        useRoadmapStore.getState().setJournalSaving(dateKey, false, ok);
        return ok;
      });
    };

    const flushJournalSaves = (): Promise<boolean> =>
      Promise.all(
        Array.from(pendingJournal.current.entries()).map(([dateKey, pending]) => {
          clearTimeout(pending.timer);
          pendingJournal.current.delete(dateKey);
          return writeJournalDay(pending.uid, dateKey, pending.text);
        })
      ).then((sonuclar) => sonuclar.every(Boolean));

    const unsubscribeJournal = useRoadmapStore.subscribe((state, prevState) => {
      if (isRemoteUpdate) return;
      if (state.journal === prevState.journal) return;
      const user = useAuthStore.getState().user;
      if (!user) return;

      Object.keys(state.journal).forEach((dateKey) => {
        const next = state.journal[dateKey];
        const prev = prevState.journal[dateKey];
        if (next === prev) return;
        // Sunucudan yüklemenin kendisi değişiklik sayılmaz: o gün bu geçişte
        // "yüklendi" listesine girdiyse, metin kullanıcıdan değil sunucudan geldi.
        const justLoaded = !prevState.journalLoadedDates.includes(dateKey) && state.journalLoadedDates.includes(dateKey);
        if (justLoaded) return;

        const existing = pendingJournal.current.get(dateKey);
        if (existing) clearTimeout(existing.timer);
        useRoadmapStore.getState().setJournalSaving(dateKey, true);
        pendingJournal.current.set(dateKey, {
          uid: user.uid,
          text: next.text,
          timer: setTimeout(() => {
            const pending = pendingJournal.current.get(dateKey);
            pendingJournal.current.delete(dateKey);
            if (pending) writeJournalDay(pending.uid, dateKey, pending.text);
          }, SAVE_DEBOUNCE_MS)
        });
      });
    });

    const unsubscribe = useRoadmapStore.subscribe((state, prevState) => {
      // Sunucudan liste geldikçe denenir; proje başına bir kez iş yapar.
      eksikleriDoldur();

      // Proje değiştiyse, önceki projenin bekleyen kaydını iptal etmeden gönder.
      if (prevState.currentProjectId && prevState.currentProjectId !== state.currentProjectId) {
        flushProjectSave(prevState.currentProjectId);
      }

      if (isRemoteUpdate) return;
      if (isSyncing.current) return;
      if (!state.currentProjectId || !useAuthStore.getState().user) return;

      const projectId = state.currentProjectId;
      const currentProj = state.projects.find((p) => p.id === projectId);
      if (!currentProj) return;

      const stateRecord = state as unknown as Record<string, unknown>;

      const mergedToolData: Record<string, any> = { ...currentProj.toolData };
      const degisenAraclar = new Set<string>();
      TOOL_STATE_KEYS.forEach((key) => {
        const value = stateRecord[key];
        if (value !== undefined && value !== mergedToolData[key]) {
           mergedToolData[key] = value;
           degisenAraclar.add(key);
        }
      });

      const oncekiSenkron = lastSynced.current.get(projectId);
      const projectObjectChanged = oncekiSenkron !== currentProj;
      if (degisenAraclar.size === 0 && !projectObjectChanged) return;

      // Bu oturumda projeyi ilk kez yazıyorsak dokümanın tamamı gider; böylece
      // eksik alanla açılmış bir proje de tek seferde tamamlanır.
      const metaDegisti = !oncekiSenkron || metaImzasi(oncekiSenkron) !== metaImzasi(currentProj);

      // Buraya bir uzak snapshot sonrası da gelinir: proje nesnesinin kimliği
      // değişmiştir ama içerik aynıdır. Yazacak bir şey yok, sadece elimizdeki
      // nesneyi senkron kabul edip çıkıyoruz.
      if (degisenAraclar.size === 0 && !metaDegisti) {
        lastSynced.current.set(projectId, currentProj);
        return;
      }

      isSyncing.current = true;

      const rawProject = { ...currentProj, toolData: mergedToolData, updatedAt: Date.now() };
      const updatedProject = stripUndefined(rawProject);

      lastSynced.current.set(projectId, updatedProject);
      useRoadmapStore.setState({ projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)) });

      const existing = pendingSaves.current.get(projectId);
      if (existing) clearTimeout(existing.timer);
      // Gecikme penceresinde biriken düzenlemeler tek yazmada gidiyor; hangi
      // araçların değiştiği de birikmeli, yoksa penceredeki ilk düzenlemenin
      // aracı yazmanın dışında kalır.
      const birikenAraclar = new Set<string>([
        ...Array.from(existing?.degisenAraclar ?? []),
        ...Array.from(degisenAraclar),
      ]);
      const birikenMeta = (existing?.metaDegisti ?? false) || metaDegisti;
      pendingSaves.current.set(projectId, {
        project: updatedProject,
        degisenAraclar: birikenAraclar,
        metaDegisti: birikenMeta,
        timer: setTimeout(() => {
          pendingSaves.current.delete(projectId);
          writeProject(projectId, updatedProject, birikenAraclar, birikenMeta);
        }, SAVE_DEBOUNCE_MS),
      });
      isSyncing.current = false;
    });

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
      unsubscribePersonal();
      unsubscribeJournal();
      // Çıkışta bekleyenler zaten signOut'tan önce gönderiliyor; buradaki flush
      // ağaçtan başka bir sebeple sökülme ihtimaline karşı duran ağ.
      flushAllSaves();
      flushHandler = null;
      bekleyenYazmalariBildir(null, null);
    };
  }, []);

  return null;
}

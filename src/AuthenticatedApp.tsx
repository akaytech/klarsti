import { useEffect, Suspense, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Navbar from './components/Navbar';
import SyncManager from './components/SyncManager';
import TopRightUserMenu from './components/TopRightUserMenu';
import TopRightProjectsMenu from './components/TopRightProjectsMenu';
import TopRightMobileMoreMenu from './components/TopRightMobileMoreMenu';
import TopRightAgendaButton from './components/TopRightAgendaButton';
import NewFolderModal from './components/NewFolderModal';
import { useRoadmapStore, type ToolId } from './store/useRoadmapStore';
import { aracSecimEylemi, aracAktifAlan, aracAnahtari } from './config/toolWorks';
import { PROJECT_TOOLS } from './config/tools';
import { KLASORSUZ_ONEK, hedefKlasorBul, klasorsuzAracAdi, adresiCoz, hedefAdres, klasorListesiGerekir } from './utils/aracAdresi';
import { useAuthStore } from './store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';
import { gecikmeliEkran } from './utils/surumTazeleme';
import { denemeyiHesabaTasi } from './store/denemeDevri';

const Workspace = gecikmeliEkran(() => import('./components/Workspace'));

// Adres çubuğundaki proje soğuk açılışta hemen çözülemeyebilir: proje listesi
// gecikir, Firestore'un auth/App Check jetonu bir tık geç bağlanır, ya da link
// gerçekten paylaşılmış bir projeyi gösterir ve önce katılmak gerekir. Bu yüzden
// tek denemeyle pes edilmiyor.
const PROJE_COZUM_DENEME = 3;

/** Bu ad gerçekten var olan bir araç mı? adresiCoz'a dışarıdan veriliyor. */
const aracVarMi = (ad: string) => PROJECT_TOOLS.some((x) => x.id === ad);
const PROJE_COZUM_ARALIK_MS = 1200;

// Adresteki çalışma seçili gelsin. Bazı araçlar bütün çalışmalarını tek
// sayfada listeliyor (SWOT, kılçık, PDCA...); orada seçilecek bir şey yok,
// aracı açmak yetiyor.
//
// Kimliğin gerçekten var olup olmadığına bakılmıyor: silinmiş bir çalışmanın
// linki açıldığında getActiveXxx zaten listenin ilkine düşüyor. Burada
// eleseydik, çalışma listesi henüz gelmemişken açılan linkler de elenirdi.
const calismayiAc = (tool: string, workId?: string) => {
  if (!workId) return;
  const eylem = aracSecimEylemi(tool as ToolId);
  if (eylem) useRoadmapStore.getState()[eylem](workId);
};

/** Bir aracın o an açık çalışmasının kimliği; seçimi olmayan araçlarda yok. */
const acikCalismaId = (tool: string | null): string | undefined => {
  if (!tool) return undefined;
  const alan = aracAktifAlan(tool as ToolId);
  if (!alan) return undefined;
  return (useRoadmapStore.getState() as Record<string, any>)[alan] || undefined;
};

/**
 * Adresteki kimlik gerçekten o araçta duruyor mu?
 *
 * Silinmiş bir çalışmanın linki açıldığında ekran zaten ilk çalışmaya düşüyor
 * ama adres çubuğunda olmayan bir kimlik asılı kalıyordu: ekran bir şeyi,
 * adres başka bir şeyi söylüyordu. Yalnızca çalışma listesinin geldiğinden
 * emin olunan yerde çağrılmalı; liste henüz boşken her kimlik "yok" görünür.
 */
const calismaListedeVar = (tool: string, workId: string): boolean => {
  const anahtar = aracAnahtari(tool as ToolId);
  if (!anahtar) return false;
  const liste = (useRoadmapStore.getState() as Record<string, any>)[anahtar];
  return Array.isArray(liste) && liste.some((c: { id?: string } | null) => c?.id === workId);
};

export default function AuthenticatedApp() {
  const user = useAuthStore(state => state.user);
  const { t } = useTranslation();
  
  const { fetchProjects, fetchPersonalData, fetchWorks, currentProjectId, loadProject, activeTool, setActiveTool, projects, joinSharedProject, projectsLoaded } = useRoadmapStore(useShallow((state) => ({
    fetchProjects: state.fetchProjects,
    fetchPersonalData: state.fetchPersonalData,
    fetchWorks: state.fetchWorks,
    currentProjectId: state.currentProjectId,
    loadProject: state.loadProject,
    activeTool: state.activeTool,
    setActiveTool: state.setActiveTool,
    projects: state.projects,
    joinSharedProject: state.joinSharedProject,
    projectsLoaded: state.projectsLoaded
  })));

  // Açık çalışma değişince adres de değişmeli, o yüzden bu değere abone
  // olunuyor. Alan araçtan araca değiştiği için tek tek yazmak yerine
  // toolWorks'ten okunuyor.
  const acikCalisma = useRoadmapStore((state) => {
    const alan = state.activeTool ? aracAktifAlan(state.activeTool) : undefined;
    return alan ? ((state as Record<string, any>)[alan] as string | null) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Adres /new/{arac} mi, ve oradaki araç gerçekten var mı?
  //
  // Tek yerden hesaplanıyor: adres çözücü, adresi koruyan kural ve klasör adını
  // soran pencere üçü de buna bakıyor. Tanınmayan bir araç adı (elle yazılmış
  // adres) null dönüyor; o zaman adres korunmuyor ve '/' ile temizleniyor.
  const klasorsuzArac = useMemo(() => {
    const ad = klasorsuzAracAdi(location.pathname);
    return ad && aracVarMi(ad) ? (ad as ToolId) : null;
  }, [location.pathname]);

  useEffect(() => {
    // Clear undo/redo history when active tool or project changes
    useRoadmapStore.temporal.getState().clear();
  }, [activeTool, currentProjectId]);

  useEffect(() => {
    if (user) {
      // Fetch latest cloud data when app opens on any device
      fetchProjects(user.uid).then(() => {
        // The URL sync effect below will handle any required routing
      });
      // Kişisel ajanda projelerden ayrı bir dokümanda, ayrı dinleniyor.
      fetchPersonalData(user.uid);
      // Çalışma kayıtları. İçeriğin doğrusu burası; tek başına paylaşılan
      // çalışmalar da yalnızca buradan geliyor (bkz. calismaOkuma.ts).
      fetchWorks(user.uid);
    }
  }, [user, user?.uid, fetchProjects, fetchPersonalData, fetchWorks]);

  // Hesapsız denemede çizilenler, giriş yapılır yapılmaz hesaba taşınıyor.
  // Klasör listesi gelmeden çalışmamalı: taşıma yeni bir klasör açıyor ve
  // liste henüz boşken açılan klasör, gelen snapshot'ın altında kalabilir.
  useEffect(() => {
    if (!user || !projectsLoaded) return;
    denemeyiHesabaTasi();
  }, [user, projectsLoaded]);

  const isFirstSyncRef = useRef(true);
  const lastPathnameRef = useRef(location.pathname);
  // Adreste duran ama henüz açılamamış proje. Doluyken adres çubuğuna
  // dokunulmuyor; yoksa link silinir ve kullanıcı yenileyip tekrar deneyemez.
  const bekleyenProjeRef = useRef<string | null>(null);
  // Aynı proje için ikinci bir çözüm turu başlatılmasın.
  const cozumDevamRef = useRef<Set<string>>(new Set());

  // Listede olmayan bir proje kimliğini açmayı dener: önce liste güncellenmiş mi
  // diye bakar, olmadıysa paylaşılmış proje olabileceği için katılmayı dener ve
  // birkaç tur boyunca bunu tekrarlar. Yalnızca gerçekten açılamadığında konuşur.
  // tool/workId yalnızca adreste yazıyorsa veriliyor: proje geç açıldığında
  // adresteki çalışma da açılsın diye. Olmadan, proje listeye düştüğü anda
  // adres çubuğu çalışmasız hale yeniden yazılıyor ve link hedefini kaybediyordu.
  const cozBekleyenProjeyi = useCallback(async (pId: string, tool?: string, workId?: string) => {
    if (cozumDevamRef.current.has(pId)) return;
    cozumDevamRef.current.add(pId);

    try {
      for (let deneme = 0; deneme < PROJE_COZUM_DENEME; deneme++) {
        const durum = useRoadmapStore.getState();

        // Kullanıcı bu arada başka bir yere gittiyse uğraşmayı bırak.
        if (bekleyenProjeRef.current !== pId) return;

        if (durum.projects.some((p) => p.id === pId)) {
          bekleyenProjeRef.current = null;
          durum.loadProject(pId);
          if (tool) calismayiAc(tool, workId);
          return;
        }

        // Katılma başarılıysa doküman anlık dinleyiciyle listeye düşecek;
        // bir sonraki turda yukarıdaki kontrol onu yakalar.
        await durum.joinSharedProject(pId);
        await new Promise((r) => setTimeout(r, PROJE_COZUM_ARALIK_MS));
      }

      if (bekleyenProjeRef.current !== pId) return;

      const son = useRoadmapStore.getState();
      if (son.projects.some((p) => p.id === pId)) {
        bekleyenProjeRef.current = null;
        son.loadProject(pId);
        if (tool) calismayiAc(tool, workId);
        return;
      }

      // Buraya gelindiyse proje gerçekten açılamıyor: silinmiş ya da erişim yok.
      bekleyenProjeRef.current = null;
      son.setActiveTool(null);
      toast.error(t('project_unavailable'), { id: 'project-unavailable' });
    } finally {
      cozumDevamRef.current.delete(pId);
    }
  }, [t]);

  // Paylaşılan ÇALIŞMA linkini çözer. Klasör linkinden ayrı bir yol: burada
  // klasörün kaydı karşı tarafa hiç açılmıyor, yalnızca linki verilen
  // çalışmalar açılıyor. Katıldıktan sonra klasör satırı "Çalışmalarım"
  // ağacında kendiliğinden beliriyor; adı çalışma kaydındaki kopyadan geliyor.
  const cozBekleyenCalismayi = useCallback(async (pId: string, tool: string, workId?: string) => {
    if (cozumDevamRef.current.has(pId)) return;
    cozumDevamRef.current.add(pId);

    try {
      for (let deneme = 0; deneme < PROJE_COZUM_DENEME; deneme++) {
        const durum = useRoadmapStore.getState();
        if (bekleyenProjeRef.current !== pId) return;

        if (durum.projects.some((p) => p.id === pId)) {
          bekleyenProjeRef.current = null;
          durum.loadProject(pId);
          durum.setActiveTool(tool as any);
          calismayiAc(tool, workId);
          return;
        }

        await durum.joinSharedWorks(pId, tool as any, workId);
        await new Promise((r) => setTimeout(r, PROJE_COZUM_ARALIK_MS));
      }

      if (bekleyenProjeRef.current !== pId) return;

      const son = useRoadmapStore.getState();
      if (son.projects.some((p) => p.id === pId)) {
        bekleyenProjeRef.current = null;
        son.loadProject(pId);
        son.setActiveTool(tool as any);
        calismayiAc(tool, workId);
        return;
      }

      bekleyenProjeRef.current = null;
      son.setActiveTool(null);
      toast.error(t('project_unavailable'), { id: 'project-unavailable' });
    } finally {
      cozumDevamRef.current.delete(pId);
    }
  }, [t]);

  // Unified URL <-> State Synchronization
  useEffect(() => {
    if (!user) return;

    const path = location.pathname;
    const niyet = adresiCoz(path, aracVarMi);

    // Klasör listesi HER adres için beklenmiyor: ajandanın klasörle işi yok.
    // Beklerse liste gelene kadar ekranda karşılama ekranı duruyor ve ajanda
    // ancak ondan sonra açılıyor (bkz. klasorListesiGerekir).
    if (!projectsLoaded && klasorListesiGerekir(niyet)) return;

    const urlChanged = path !== lastPathnameRef.current;
    lastPathnameRef.current = path;

    // Bekleme sürerken kullanıcı başka bir proje açtıysa onun kararı geçerlidir:
    // eski linki çözmeye çalışmaya devam edersek kullanıcıyla çekişiriz.
    if (bekleyenProjeRef.current && currentProjectId && currentProjectId !== bekleyenProjeRef.current) {
      bekleyenProjeRef.current = null;
    }

    let isUrlSyncRunning = false;

    // 1. ADRES -> EKRAN
    //
    // Adresin ne istediğine `adresiCoz` karar veriyor (saf, sınanabilir);
    // burada yalnızca o kararın gereği yapılıyor. Bekleyen bir proje varsa
    // blok her liste güncellemesinde yeniden çalışır: tek atışta çözülemeyen
    // link eskiden kalıcı olarak kayboluyordu.
    if (urlChanged || isFirstSyncRef.current || bekleyenProjeRef.current !== null) {
      // Araçsız duraklar: karşılama, çalışma listesi, ajanda. Üçünde de
      // bekleyen bir link kalmıyor.
      const aracsizHedef =
        niyet.tur === 'ajanda' ? 'notepad' :
        niyet.tur === 'kok' || niyet.tur === 'calismalar' ? null :
        undefined;

      if (aracsizHedef !== undefined) {
        bekleyenProjeRef.current = null;
        if (activeTool !== aracsizHedef) {
          setActiveTool(aracsizHedef as ToolId | null);
          isUrlSyncRunning = true;
        }
      } else if (niyet.tur === 'klasorsuz') {
        // /new/{arac} — araç seçildi ama tıklandığı anda hiç klasör yoktu.
        // Adresi açan kişinin bu arada klasörü olmuş olabilir (başka sekmede
        // açmış, ya da linki başka bir hesapta açıyor); o zaman soru sormaya
        // gerek yok, doğrudan klasöre giriliyor.
        bekleyenProjeRef.current = null;
        const hedef = hedefKlasorBul(projects, currentProjectId);
        if (hedef) {
          if (hedef !== currentProjectId) loadProject(hedef);
          setActiveTool(niyet.arac as ToolId);
        } else if (activeTool !== null) {
          // Klasör gerçekten yok: karşılama ekranı kalıyor, aşağıdaki pencere
          // klasörün adını soruyor.
          setActiveTool(null);
        }
        // Her iki durumda da adres çubuğuna bu turda dokunulmuyor: aşağıdaki
        // adım henüz eski değerleri görüyor ve "araç yok" sanıp adresi '/'
        // ile ezerdi. Depo güncellenince etki yeniden çalışıp doğrusunu yazar.
        isUrlSyncRunning = true;
      } else if (niyet.tur === 'klasor') {
        const { klasorId, arac, calismaId } = niyet;
        let durumDegisti = false;

        if (klasorId !== currentProjectId) {
          if (projects.some((p) => p.id === klasorId)) {
            loadProject(klasorId);
            bekleyenProjeRef.current = null;
          } else {
            bekleyenProjeRef.current = klasorId;
            cozBekleyenProjeyi(klasorId, arac, calismaId);
          }
          durumDegisti = true;
        } else {
          bekleyenProjeRef.current = null;
        }

        if (arac && arac !== activeTool) {
          setActiveTool(arac as ToolId);
          durumDegisti = true;
        }

        // Açık çalışma yalnızca hafızada duruyordu; sayfa yenilenince
        // unutuluyor ve listenin ilkine dönülüyordu. Artık adresten okunuyor.
        // Klasör bu noktada yüklenmiş oluyor, o yüzden listede arama güvenli.
        if (arac && calismaId && calismaId !== acikCalismaId(arac) && calismaListedeVar(arac, calismaId)) {
          calismayiAc(arac, calismaId);
          durumDegisti = true;
        }

        if (durumDegisti) isUrlSyncRunning = true;
      } else if (niyet.tur === 'paylasik') {
        // Paylaşılan çalışma linki. Klasör linkinden ayrı bir yol: klasörün
        // kaydı karşı tarafa hiç açılmıyor, yalnızca linki verilen çalışma.
        const { klasorId, arac, calismaId } = niyet;

        if (klasorId !== currentProjectId) {
          if (projects.some((p) => p.id === klasorId)) {
            loadProject(klasorId);
            bekleyenProjeRef.current = null;
          } else {
            bekleyenProjeRef.current = klasorId;
            cozBekleyenCalismayi(klasorId, arac, calismaId);
          }
        } else {
          bekleyenProjeRef.current = null;
        }

        if (arac !== activeTool) setActiveTool(arac as ToolId);
        // Klasör zaten bizdeyken link hedefi ıskalıyordu: yalnızca
        // cozBekleyenCalismayi çalışmayı açıyordu, o da klasör bizde
        // değilken devreye giriyor.
        if (calismaId && calismaId !== acikCalismaId(arac)) calismayiAc(arac, calismaId);
        isUrlSyncRunning = true;
      }
      // 'taninmaz': elle yazılmış adres. Ekrana dokunulmuyor; aşağıdaki adım
      // adresi duruma göre düzeltiyor.
    }

    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
    }

    // 2. State -> URL (Priority 2: Sync URL from state if state changed via UI interaction)
    // We only execute this if we didn't just trigger a state update to match the URL.
    // Bekleyen proje varken adres çubuğuna dokunulmaz: proje henüz açılmadığı
    // için burası linki '/' ile ezer ve kullanıcının elinden tek tutamağı alırdı.
    if (!isUrlSyncRunning && bekleyenProjeRef.current === null) {
      // '/new/...' bir yer değil, bir talimat: "şu aracı aç". Adres asıl
      // haline dönerken geçmişe kayıt DÜŞMEMELİ, üzerine yazılmalı. Yoksa
      // geri düğmesi kullanıcıyı /new/... adresine döndürüyor, orası da onu
      // anında ileri fırlatıyor; yani geri düğmesi hiç çalışmıyor.
      const gecmiseEkleme = path.startsWith(KLASORSUZ_ONEK);

      const yeniAdres = hedefAdres({
        activeTool,
        currentProjectId,
        acikCalismaId: acikCalisma,
        mevcutAdres: path,
        klasorsuzAracGecerli: klasorsuzArac !== null
      });

      if (yeniAdres) navigate(yeniAdres, { replace: gecmiseEkleme });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, klasorsuzArac, user, currentProjectId, activeTool, acikCalisma, projects, loadProject, joinSharedProject, projectsLoaded, navigate, setActiveTool, cozBekleyenProjeyi, cozBekleyenCalismayi]);

  // Klasörün adını soran pencere buradan çiziliyor, sol menüden değil: sorunun
  // kaynağı artık adres (/new/{arac}), yani yeni bir sekmede açılan link de
  // aynı pencereyi getiriyor.
  //
  // Klasör listesi gelmeden sorulmuyor: liste bir an boş görünüyor ve klasörü
  // olan kullanıcıya da "klasör aç" penceresi açılırdı.
  const klasorSoruluyor = klasorsuzArac !== null && projectsLoaded && projects.length === 0;

  return (
    <>
      <SyncManager />
      <Navbar />
      <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        <TopRightUserMenu />
        <TopRightAgendaButton />
        <TopRightProjectsMenu />
        <TopRightMobileMoreMenu />
        <Suspense fallback={
          <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }>
          <Workspace />
        </Suspense>
      </div>

      <NewFolderModal
        acik={klasorSoruluyor}
        // Vazgeçildiğinde adres de temizleniyor; yoksa /new/... adreste asılı
        // kalır ve sayfa yenilenince pencere yeniden açılırdı.
        onKapat={() => navigate('/')}
        onOlustur={(ad) => {
          if (!klasorsuzArac) return;
          // createProject klasörü açıp aracı da seçiyor; adres çubuğunu
          // yukarıdaki eşitleme /project/{yeniKlasor}/{arac} olarak yazıyor.
          useRoadmapStore.getState().createProject(ad, klasorsuzArac);
        }}
      />
    </>
  );
}

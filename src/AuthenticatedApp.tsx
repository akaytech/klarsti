import React, { useEffect, Suspense, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Navbar from './components/Navbar';
import SyncManager from './components/SyncManager';
import TopRightUserMenu from './components/TopRightUserMenu';
import TopRightProjectsMenu from './components/TopRightProjectsMenu';
import TopRightMobileMoreMenu from './components/TopRightMobileMoreMenu';
import TopRightAgendaButton from './components/TopRightAgendaButton';
import { useRoadmapStore } from './store/useRoadmapStore';
import { useAuthStore } from './store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';

const Workspace = React.lazy(() => import('./components/Workspace'));

// Adres çubuğundaki proje soğuk açılışta hemen çözülemeyebilir: proje listesi
// gecikir, Firestore'un auth/App Check jetonu bir tık geç bağlanır, ya da link
// gerçekten paylaşılmış bir projeyi gösterir ve önce katılmak gerekir. Bu yüzden
// tek denemeyle pes edilmiyor.
const PROJE_COZUM_DENEME = 3;
const PROJE_COZUM_ARALIK_MS = 1200;

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

  const navigate = useNavigate();
  const location = useLocation();

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
  const cozBekleyenProjeyi = useCallback(async (pId: string) => {
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
    if (!user || !projectsLoaded) return;

    const path = location.pathname;
    const urlChanged = path !== lastPathnameRef.current;
    lastPathnameRef.current = path;

    // Bekleme sürerken kullanıcı başka bir proje açtıysa onun kararı geçerlidir:
    // eski linki çözmeye çalışmaya devam edersek kullanıcıyla çekişiriz.
    if (bekleyenProjeRef.current && currentProjectId && currentProjectId !== bekleyenProjeRef.current) {
      bekleyenProjeRef.current = null;
    }

    let isUrlSyncRunning = false;

    // 1. URL -> State (Priority 1: Sync state from URL if URL changed or initial load)
    // Bekleyen bir proje varsa blok her liste güncellemesinde yeniden çalışır:
    // tek atışta çözülemeyen link eskiden kalıcı olarak kayboluyordu.
    if (urlChanged || isFirstSyncRef.current || bekleyenProjeRef.current !== null) {
      if (path === '/') {
        bekleyenProjeRef.current = null;
        if (activeTool !== null) {
          setActiveTool(null);
          isUrlSyncRunning = true;
        }
      } else if (path === '/agenda') {
        // Ajanda kişisel: proje seçili olmasa da açılır, kendi adresi vardır.
        bekleyenProjeRef.current = null;
        if (activeTool !== 'notepad') {
          setActiveTool('notepad');
          isUrlSyncRunning = true;
        }
      } else if (path.startsWith('/project/')) {
        const parts = path.split('/');
        const pId = parts[2];
        const tId = parts[3];

        let needsStateUpdate = false;
        if (pId && pId !== currentProjectId) {
           const exists = projects.find(p => p.id === pId);
           if (exists) {
             loadProject(pId);
             bekleyenProjeRef.current = null;
           } else {
             bekleyenProjeRef.current = pId;
             cozBekleyenProjeyi(pId);
           }
           needsStateUpdate = true;
        } else if (pId) {
           bekleyenProjeRef.current = null;
        }
        if (tId && tId !== activeTool) {
           setActiveTool(tId as any);
           needsStateUpdate = true;
        }

        if (needsStateUpdate) {
           isUrlSyncRunning = true;
        }
      } else if (path.startsWith('/work/')) {
        // /work/{klasorId}/{arac}[/{calismaId}] — paylaşılan çalışma linki.
        const [, , pId, tId, wId] = path.split('/');
        if (pId && tId) {
          if (pId !== currentProjectId) {
            const exists = projects.find((p) => p.id === pId);
            if (exists) {
              loadProject(pId);
              bekleyenProjeRef.current = null;
            } else {
              bekleyenProjeRef.current = pId;
              cozBekleyenCalismayi(pId, tId, wId);
            }
          } else {
            bekleyenProjeRef.current = null;
          }
          if (tId !== activeTool) setActiveTool(tId as any);
          isUrlSyncRunning = true;
        }
      }
    }

    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
    }

    // 2. State -> URL (Priority 2: Sync URL from state if state changed via UI interaction)
    // We only execute this if we didn't just trigger a state update to match the URL.
    // Bekleyen proje varken adres çubuğuna dokunulmaz: proje henüz açılmadığı
    // için burası linki '/' ile ezer ve kullanıcının elinden tek tutamağı alırdı.
    if (!isUrlSyncRunning && bekleyenProjeRef.current === null) {
      if (activeTool === 'notepad') {
        if (path !== '/agenda') navigate('/agenda');
      } else if (!activeTool) {
        if (path !== '/') navigate('/');
      } else if (currentProjectId && activeTool) {
        const newPath = `/project/${currentProjectId}/${activeTool}`;
        if (path !== newPath) navigate(newPath);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user, currentProjectId, activeTool, projects, loadProject, joinSharedProject, projectsLoaded, navigate, setActiveTool, cozBekleyenProjeyi, cozBekleyenCalismayi]);

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
    </>
  );
}

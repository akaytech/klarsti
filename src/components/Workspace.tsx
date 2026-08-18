import React, { Suspense } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useUIStore } from '../store/useUIStore';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import { ajandaDugmesiGorunurMu } from '../utils/ajandaDugmesi';

import UndoRedoControls from './UndoRedoControls';
import GlobalExportButton from './GlobalExportButton';
import GlobalShareButton from './GlobalShareButton';
import ToolGuideButton from './ToolGuideButton';
import TamEkranDugmesi from './TamEkranDugmesi';
import DenemeHesapDugmesi from './DenemeHesapDugmesi';
import WelcomeScreen from './WelcomeScreen';
import { gecikmeliEkran } from '../utils/surumTazeleme';
import { GUIDE_TOOLS } from '../content/toolGuides/available';
import { kilavuzGosterildiMi, kilavuzuGosterildiIsaretle } from '../utils/kilavuzGosterimi';
import { denemeKipindeMi } from '../utils/denemeKipi';
import { tamEkranKapat, tamEkrandaMi } from '../utils/tamEkran';

// Kılavuz metinleri ve paneli ayrı bir parçada: kullanıcı kılavuzu
// açmadıkça indirilmiyor.
const ToolGuidePanel = gecikmeliEkran(() => import('./ToolGuidePanel'));
const WorksPage = gecikmeliEkran(() => import('./WorksPage'));

const WbsCanvas = gecikmeliEkran(() => import('./WbsCanvas'));
const RoadmapCanvas = gecikmeliEkran(() => import('./RoadmapCanvas'));
const FiveWhysCanvas = gecikmeliEkran(() => import('./FiveWhysCanvas'));
const SwotCanvas = gecikmeliEkran(() => import('./SwotCanvas'));
const IshikawaCanvas = gecikmeliEkran(() => import('./IshikawaCanvas'));
const PdcaCanvas = gecikmeliEkran(() => import('./PdcaCanvas'));
const WaterfallCanvas = gecikmeliEkran(() => import('./WaterfallCanvas'));
const FtaCanvas = gecikmeliEkran(() => import('./FtaCanvas'));
const DecisionMatrixCanvas = gecikmeliEkran(() => import('./DecisionMatrixCanvas').then(m => ({ default: m.DecisionMatrixCanvas })));
const FlowchartCanvas = gecikmeliEkran(() => import('./FlowchartCanvas'));
const OrgchartCanvas = gecikmeliEkran(() => import('./OrgchartCanvas'));
const MindmapCanvas = gecikmeliEkran(() => import('./MindmapCanvas'));
const ParetoCanvas = gecikmeliEkran(() => import('./ParetoCanvas'));
const HistogramCanvas = gecikmeliEkran(() => import('./HistogramCanvas'));
const NotepadCanvas = gecikmeliEkran(() => import('./NotepadCanvas'));
const VsmCanvas = gecikmeliEkran(() => import('./VsmCanvas'));
const GanttCanvas = gecikmeliEkran(() => import('./GanttCanvas'));

function DecisionMatrixWrapper() {
  const { currentProjectId, projects, addDecisionProject } = useRoadmapStore(useShallow((state) => ({
    currentProjectId: state.currentProjectId,
    projects: state.projects,
    addDecisionProject: state.addDecisionProject
  })));
  const { t } = useTranslation();

  const proj = projects.find(p => p.id === currentProjectId);
  if (!proj) return null;
  const dProject = proj.toolData?.decision?.[0];
  if (!dProject) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <button 
          onClick={() => addDecisionProject(proj.name + ' - ' + t('decision_title'))}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold"
        >
          {t('app_start')}
        </button>
      </div>
    );
  }
  return <DecisionMatrixCanvas project={dProject} />;
}

const TOOL_COMPONENTS: Record<string, React.ElementType> = {
  wbs: () => <WbsCanvas onNodeSelect={() => {}} />,
  roadmap: RoadmapCanvas,
  '5whys': FiveWhysCanvas,
  swot: SwotCanvas,
  ishikawa: IshikawaCanvas,
  pdca: PdcaCanvas,
  waterfall: WaterfallCanvas,
  fta: FtaCanvas,
  flowchart: FlowchartCanvas,
  orgchart: OrgchartCanvas,
  mindmap: MindmapCanvas,
  vsm: VsmCanvas,
  pareto: ParetoCanvas,
  histogram: HistogramCanvas,
  gantt: GanttCanvas,
  notepad: NotepadCanvas,
  decision: DecisionMatrixWrapper
};

export default function Workspace() {
  const { activeTool, projectsLoaded } = useRoadmapStore(useShallow((state) => ({
    activeTool: state.activeTool,
    projectsLoaded: state.projectsLoaded
  })));
  const location = useLocation();
  const guideOpen = useUIStore((s) => s.guideOpen);
  const setGuideOpen = useUIStore((s) => s.setGuideOpen);

  // Bir araç bu tarayıcıda ilk kez açıldığında kılavuzu bir kez kendiliğinden
  // aç. Kılavuz ürünün en iyi parçası ama sağ üstteki düğmeyi ilk kez giren
  // kullanıcı aramıyordu. İkinci açılışta çıkmıyor; kapatıldığında da bir daha
  // gelmiyor (işaret açılışta konuyor).
  //
  // Denemede kural farklı: kılavuz araca her girişte açılıyor, aynı tarayıcıda
  // aynı araç bile olsa. Ziyaretçi aracı tanımadan geliyor ve dar ekranda
  // kılavuzu elle açacak düğme yok (ToolGuideButton yalnız geniş ekranda,
  // üç nokta menüsü de yalnız hesaplı ekranda). Kapatınca o girişte geri
  // gelmiyor. Denemede işaret hiç konmuyor: hesap açan kullanıcı kılavuzu
  // kendi hesabında bir kez daha görsün.
  React.useEffect(() => {
    if (!activeTool || !GUIDE_TOOLS.includes(activeTool)) return;
    if (denemeKipindeMi()) {
      setGuideOpen(true);
      return;
    }
    if (kilavuzGosterildiMi(activeTool)) return;
    kilavuzuGosterildiIsaretle(activeTool);
    setGuideOpen(true);
  }, [activeTool, setGuideOpen]);

  // Araçtan çıkınca tam ekran da kapanıyor. Tam ekran tuvale odaklanmak için
  // açılıyor; ana ekranda ya da çalışmalar listesinde karşılığı yok ve
  // kullanıcı oradan çıkmanın tek yolunun Esc olduğunu bilmiyor.
  //
  // Araçtan araca geçişte kapanmıyor: burada bakılan tek şey bir aracın açık
  // olup olmadığı, hangisi olduğu değil. Ajanda da araç sayılıyor, ona geçerken
  // ekranın bir açılıp bir kapanmasının anlamı yok.
  React.useEffect(() => {
    if (activeTool) return;
    if (!tamEkrandaMi()) return;
    void tamEkranKapat();
  }, [activeTool]);

  // Panel bir kez açıldıktan sonra DOM'da kalıyor; kapanış animasyonu ancak
  // böyle görünüyor (anında unmount edilirse panel kayarak değil, yok olarak
  // gidiyordu).
  const guideMounted = React.useRef(false);
  if (guideOpen) guideMounted.current = true;

  return (
    <ReactFlowProvider>
      <div className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col">
        {/* Ajandada geri alma yok: notepad zaten temporal partialize dışında, yani
            ajanda değişiklikleri geçmişe hiç yazılmıyor, düğmeler orada işlevsizdi. */}
        {activeTool && activeTool !== 'notepad' && <UndoRedoControls />}
        {/* Denemede küme araç seçilmeden de çiziliyor: "Hesap Aç" düğmesi
            karşılama ekranında da duruyor, kılavuz düğmesi orada kendini zaten
            gizliyor. */}
        {(activeTool || denemeKipindeMi()) && (
          <div
            className={clsx(
              "absolute top-4 z-[100] flex items-center gap-2 transition-transform duration-300 ease-out",
              // Denemede sağ üstte hesaba bağlı hiçbir düğme yok (bkz. DenemeApp)
              // ve kümede "Hesap Aç" ile kılavuz kalıyor; boşluk bırakmaya gerek
              // yok, küme sağ kenara yaslanıyor.
              denemeKipindeMi()
                ? "end-4"
                : [
                    "end-36",
                    // Ajanda düğmesi göründüğünde "Çalışmalarım" bir sıra sola
                    // kayıyor; bu küme de kaymazsa ajandada kılavuz düğmesi
                    // onun üstüne biniyor.
                    ajandaDugmesiGorunurMu(activeTool) ? "sm:end-56" : "sm:end-40"
                  ],
              // Kılavuz paneli açıkken bu küme panelin altında kalırdı; paylaş
              // ve dışa aktar düğmelerine erişilemesin diye küme sola kayıyor.
              guideOpen && "max-sm:opacity-0 sm:-translate-x-[400px] sm:rtl:translate-x-[400px]"
            )}
          >
            <DenemeHesapDugmesi />
            <ToolGuideButton />
            <GlobalShareButton />
            <GlobalExportButton />
            <TamEkranDugmesi />
          </div>
        )}

        {guideMounted.current && (
          <Suspense fallback={null}>
            <ToolGuidePanel />
          </Suspense>
        )}

        {/* Bekleme göstergesi geç beliriyor (bkz. index.css .gec-belir): araç
            zaten indiyse çember hiç görünmüyor, eskiden bir an parlayıp
            kayboluyordu ve göz bunu takılma olarak okuyordu. */}
        <Suspense fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="gec-belir animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }>
          {/* `key` araç adında: araç değişince bu kutu yeniden kuruluyor ve
              belirme animasyonu baştan çalışıyor. Olmadan yeni ekran sert
              giriyordu. */}
          <div key={activeTool ?? location.pathname} className="icerik-gir flex min-h-0 w-full flex-1 flex-col">
          {!activeTool && (
            (!projectsLoaded && location.pathname.startsWith('/project/')) ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="gec-belir animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : location.pathname === '/works' ? (
              <WorksPage />
            ) : (
              <WelcomeScreen />
            )
          )}
          {activeTool && (() => {
            const Canvas = TOOL_COMPONENTS[activeTool];
            return Canvas ? <Canvas /> : null;
          })()}
          </div>
        </Suspense>
      </div>
    </ReactFlowProvider>
  );
}

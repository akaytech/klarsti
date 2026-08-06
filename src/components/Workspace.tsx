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
import WelcomeScreen from './WelcomeScreen';

// Kılavuz metinleri ve paneli ayrı bir parçada: kullanıcı kılavuzu
// açmadıkça indirilmiyor.
const ToolGuidePanel = React.lazy(() => import('./ToolGuidePanel'));

const RoadmapCanvas = React.lazy(() => import('./RoadmapCanvas'));
const FiveWhysCanvas = React.lazy(() => import('./FiveWhysCanvas'));
const SwotCanvas = React.lazy(() => import('./SwotCanvas'));
const IshikawaCanvas = React.lazy(() => import('./IshikawaCanvas'));
const PdcaCanvas = React.lazy(() => import('./PdcaCanvas'));
const WaterfallCanvas = React.lazy(() => import('./WaterfallCanvas'));
const FtaCanvas = React.lazy(() => import('./FtaCanvas'));
const DecisionMatrixCanvas = React.lazy(() => import('./DecisionMatrixCanvas').then(m => ({ default: m.DecisionMatrixCanvas })));
const FlowchartCanvas = React.lazy(() => import('./FlowchartCanvas'));
const OrgchartCanvas = React.lazy(() => import('./OrgchartCanvas'));
const MindmapCanvas = React.lazy(() => import('./MindmapCanvas'));
const ParetoCanvas = React.lazy(() => import('./ParetoCanvas'));
const HistogramCanvas = React.lazy(() => import('./HistogramCanvas'));
const NotepadCanvas = React.lazy(() => import('./NotepadCanvas'));
const VsmCanvas = React.lazy(() => import('./VsmCanvas'));

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
  wbs: () => <RoadmapCanvas onNodeSelect={() => {}} />,
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
        {activeTool && (
          <div
            className={clsx(
              "absolute top-4 end-36 z-[100] flex items-center gap-2 transition-transform duration-300 ease-out",
              // Ajanda düğmesi göründüğünde "Çalışmalarım" bir sıra sola kayıyor;
              // bu küme de kaymazsa ajandada kılavuz düğmesi onun üstüne biniyor.
              ajandaDugmesiGorunurMu(activeTool) ? "sm:end-56" : "sm:end-40",
              // Kılavuz paneli açıkken bu küme panelin altında kalırdı; paylaş
              // ve dışa aktar düğmelerine erişilemesin diye küme sola kayıyor.
              guideOpen && "max-sm:opacity-0 sm:-translate-x-[400px] sm:rtl:translate-x-[400px]"
            )}
          >
            <ToolGuideButton />
            <GlobalShareButton />
            <GlobalExportButton />
          </div>
        )}

        {guideMounted.current && (
          <Suspense fallback={null}>
            <ToolGuidePanel />
          </Suspense>
        )}

        <Suspense fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }>
          {!activeTool && (
            (!projectsLoaded && location.pathname.startsWith('/project/')) ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <WelcomeScreen />
            )
          )}
          {activeTool && (() => {
            const Canvas = TOOL_COMPONENTS[activeTool];
            return Canvas ? <Canvas /> : null;
          })()}
        </Suspense>
      </div>
    </ReactFlowProvider>
  );
}

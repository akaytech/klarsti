import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRoadmapStore, getActiveFiveWhys } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

import { useTheme } from '../theme';
import CanvasBackdrop from './CanvasBackdrop';
import FiveWhysNode from './FiveWhysNode';
import FiveWhysContextMenu from './FiveWhysContextMenu';
import PaneContextMenu from './PaneContextMenu';
import AnalysisMenu from './AnalysisMenu';

const nodeTypes = {
  fiveWhysNode: FiveWhysNode,
};

// Sabit boş diziler: her boyamada yenisi üretilirse ona bağlı useMemo'lar
// boşuna yeniden hesaplanır.
const BOS_NODES: any[] = [];
const BOS_EDGES: any[] = [];


function FiveWhysCanvasInner() {
  const { t } = useTranslation();
  const themeColors = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const [paneMenu, setPaneMenu] = useState<{ top: number; left: number; clientX: number; clientY: number } | null>(null);

  const {
    onFiveWhysNodesChange,
    onFiveWhysEdgesChange,
    onFiveWhysConnect,
    addFiveWhysNode,
    updateFiveWhysNode,
    deleteFiveWhysNode,
    loadFiveWhysExample,
    fiveWhysAnalyses,
    setActiveFiveWhys,
    addFiveWhysAnalysis,
    renameFiveWhysAnalysis,
    deleteFiveWhysAnalysis
  } = useRoadmapStore(useShallow((state) => ({
    onFiveWhysNodesChange: state.onFiveWhysNodesChange,
    onFiveWhysEdgesChange: state.onFiveWhysEdgesChange,
    onFiveWhysConnect: state.onFiveWhysConnect,
    addFiveWhysNode: state.addFiveWhysNode,
    updateFiveWhysNode: state.updateFiveWhysNode,
    deleteFiveWhysNode: state.deleteFiveWhysNode,
    loadFiveWhysExample: state.loadFiveWhysExample,
    fiveWhysAnalyses: state.fiveWhysAnalyses,
    setActiveFiveWhys: state.setActiveFiveWhys,
    addFiveWhysAnalysis: state.addFiveWhysAnalysis,
    renameFiveWhysAnalysis: state.renameFiveWhysAnalysis,
    deleteFiveWhysAnalysis: state.deleteFiveWhysAnalysis
  })));

  // Kutular ve çizgiler açık analizin içinde duruyor.
  const aktifAnaliz = useRoadmapStore(getActiveFiveWhys);
  const fiveWhysNodes = aktifAnaliz?.nodes ?? BOS_NODES;
  const fiveWhysEdges = aktifAnaliz?.edges ?? BOS_EDGES;

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();
      // Durdurulmazsa olay sarmalayıcıya kadar çıkıp kanvas menüsünü de
      // tetikliyor, o da kutu menüsünü kapatıyordu: sağ tık hep aynı menüyü
      // açıyor gibi görünüyordu.
      event.stopPropagation();
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
      setPaneMenu(null);
    },
    []
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setPaneMenu({
        top: event.clientY,
        left: event.clientX,
        clientX: event.clientX,
        clientY: event.clientY,
      });
      setMenu(null);
    },
    []
  );

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    setMenu(null);
    setPaneMenu(null);
    
    if (event.ctrlKey || event.metaKey) {
      const pos = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addFiveWhysNode(null, 'problem', t('whys_placeholder') || 'Neden?', pos);
    }
  }, [addFiveWhysNode, screenToFlowPosition, t]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      // Kök neden (solution) kutusuna çocuk eklenmesini engelle
      if (node.data.type === 'solution') return;

      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        addFiveWhysNode(node.id, 'why', t('whys_placeholder') || 'Neden?');
      } else if (event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        addFiveWhysNode(node.id, 'solution', t('whys_solution_placeholder'));
      }
    },
    [addFiveWhysNode, t]
  );

  return (
    <div className="h-full w-full relative bg-slate-50 dark:bg-slate-900 transition-colors" ref={reactFlowWrapper} onContextMenu={onPaneContextMenu as any}>
      <ReactFlow
          nodes={fiveWhysNodes}
          edges={fiveWhysEdges}
          onNodesChange={onFiveWhysNodesChange}
          onEdgesChange={onFiveWhysEdgesChange}
          onConnect={onFiveWhysConnect}
          nodeTypes={nodeTypes}
          nodesConnectable={false}
          onNodeContextMenu={onNodeContextMenu}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          deleteKeyCode={['Delete']}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 3, stroke: themeColors.canvasEdge },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap position="bottom-right" className="!w-48 !h-48 !rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-2xl dark:bg-slate-800 bg-white" maskColor={themeColors.minimapMask} nodeColor={themeColors.minimapNode} zoomable pannable />
          <CanvasBackdrop />

          {aktifAnaliz && (
            <Panel position="top-left" style={{ marginTop: 68 }}>
              <AnalysisMenu
                Simge={Activity}
                aktifId={aktifAnaliz.id}
                ogeler={fiveWhysAnalyses.map((a) => ({ id: a.id, name: a.name, sayac: a.nodes.length }))}
                onSec={setActiveFiveWhys}
                onEkle={() => addFiveWhysAnalysis(t('whys_analysis_name_n', { sira: fiveWhysAnalyses.length + 1 }))}
                onYenidenAdlandir={renameFiveWhysAnalysis}
                onSil={deleteFiveWhysAnalysis}
                metinler={{
                  baslik: t('whys_analyses'),
                  yeni: t('whys_new_analysis'),
                  yenidenAdlandir: t('whys_rename_analysis'),
                  ad: t('whys_analysis_name'),
                  sil: t('whys_delete_analysis'),
                  silMesaji: 'whys_delete_analysis_msg',
                }}
              />
            </Panel>
          )}
          
          {fiveWhysNodes.length === 0 && (
             <Panel position="top-center" className="mt-20">
               <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-2xl text-center max-w-md">
                 <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Activity size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                   {t('whys_empty')}
                 </h3>
                 <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                   {t('whys_empty_hint')}
                 </p>
                 <div className="flex flex-col gap-3">
                   <button
                     onClick={() => addFiveWhysNode(null, 'problem', t('whys_placeholder'))}
                     className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                   >
                     {t('whys_add_root')}
                   </button>
                   <button
                     onClick={() => loadFiveWhysExample()}
                     className="w-full py-3 px-6 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold transition-all active:scale-95"
                   >
                     {t('load_example')}
                   </button>
                 </div>
               </div>
             </Panel>
          )}
        </ReactFlow>

        {menu && (
          <FiveWhysContextMenu
            x={menu.left}
            y={menu.top}
            node={fiveWhysNodes.find((n) => n.id === menu.id)!}
            onClose={() => setMenu(null)}
            onAddNode={(type, label) => {
              addFiveWhysNode(menu.id, type, label);
              setMenu(null);
            }}
            onUpdate={(data) => updateFiveWhysNode(menu.id, data)}
            onDelete={() => {
              deleteFiveWhysNode(menu.id);
              setMenu(null);
            }}
          />
        )}

        {paneMenu && (
          <PaneContextMenu
            x={paneMenu.left}
            y={paneMenu.top}
            onClose={() => setPaneMenu(null)}
            addLabel={t('whys_add_root') || 'Yeni Problem Ekle'}
            onAddRootGoal={() => {
              const pos = screenToFlowPosition({
                x: paneMenu.clientX,
                y: paneMenu.clientY,
              });
              addFiveWhysNode(null, 'problem', t('whys_placeholder') || 'Neden?', pos);
              setPaneMenu(null);
            }}
          />
        )}
    </div>
  );
}

export default function FiveWhysCanvas() {
  return (
    <ReactFlowProvider>
      <FiveWhysCanvasInner />
    </ReactFlowProvider>
  );
}

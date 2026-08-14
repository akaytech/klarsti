import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import { Network, LayoutGrid } from 'lucide-react';
import type { NodeMouseHandler, Edge } from '@xyflow/react';
import type { GoalNode as GoalNodeType } from '../store/useRoadmapStore';
import '@xyflow/react/dist/style.css';
import { useRoadmapStore, getDescendants, getActiveWbsTree, isPristineWbs, WBS_NODE_W, WBS_NODE_H } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { islemBasla, islemBitir } from '../store/gecmis';
import { getDepth } from '../utils/layout';
import { useTheme } from '../theme';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import GoalNode from './GoalNode';
import PaneContextMenu from './PaneContextMenu';
import WbsTreesMenu from './WbsTreesMenu';
import { useTranslation } from 'react-i18next';

const nodeTypes = {
  goalNode: GoalNode,
};

// Sabit boş diziler: her boyamada yenisi üretilirse React Flow her seferinde
// listeyi değişmiş sayar.
const EMPTY_NODES: GoalNodeType[] = [];
const EMPTY_EDGES: Edge[] = [];

export default function RoadmapCanvas({ onNodeSelect }: { onNodeSelect: (id: string | null) => void }) {
  const themeColors = useTheme();
  const { t } = useTranslation();
  const {  aktifAgac, onNodesChange, onEdgesChange, onConnect, toggleExpand, addGoal, loadWbsExample, nudgeGoals, realignAllGoals, normalizeWbsLayout  } = useRoadmapStore(useShallow((state) => ({
      aktifAgac: getActiveWbsTree(state),
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      toggleExpand: state.toggleExpand,
      addGoal: state.addGoal,
      loadWbsExample: state.loadWbsExample,
      nudgeGoals: state.nudgeGoals,
      realignAllGoals: state.realignAllGoals,
      normalizeWbsLayout: state.normalizeWbsLayout
    })));

  // Ağaç henüz kurulmadıysa (proje yükleniyor) boş listelerle çalışılır;
  // aşağıdaki kancalar koşulsuz çalışmak zorunda.
  const nodes = aktifAgac?.nodes ?? EMPTY_NODES;
  const edges = aktifAgac?.edges ?? EMPTY_EDGES;

  const { setCenter, getZoom, screenToFlowPosition } = useReactFlow();
  const [paneMenu, setPaneMenu] = useState<{ top: number; left: number; clientX: number; clientY: number } | null>(null);
  // Kullanıcı "kendim oluşturacağım" derse panel bu oturum boyunca geri gelmez.
  const [starterDismissed, setStarterDismissed] = useState(false);
  const isEmptyCanvas = nodes.length === 0;
  const showStarterPanel = !starterDismissed && isPristineWbs(nodes, edges);
  const kaydirilmisVar = nodes.some((n) => n.data.offsetX || n.data.offsetY);
  const setEditingDescriptionId = useRoadmapStore((s) => s.setEditingDescriptionId);
  const setContextMenuNodeId = useRoadmapStore((s) => s.setContextMenuNodeId);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [isShiftPressed, setIsShiftPressed] = useState(false);
  // Sürüklemenin başladığı yer; bitişte ne kadar taşındığını buradan çıkarıyoruz.
  const surukleBaslangici = useRef<{ id: string; x: number; y: number } | null>(null);
  // Geçmişte açık bir sürükleme işlemi var mı? (bkz. onNodeDragStart)
  const surukleAcik = useRef(false);

  // Dizilim kuralları değiştiğinde (kutu ölçüsü, aralıklar) eski projelerin
  // kayıtlı konumları eskimiş oluyor. Dizilim yalnızca bir düzenleme yapılınca
  // çalıştığı için, araç açılırken bir kez düzeltiyoruz. React Flow kutuları
  // ölçtükten sonra çalışsın diye ilk boyanmayı bekliyoruz; yoksa uzun
  // başlıklı kutuların gerçek yüksekliği hesaba katılmıyor.
  useEffect(() => {
    const zamanlayici = setTimeout(() => normalizeWbsLayout(), 300);
    return () => clearTimeout(zamanlayici);
  }, [normalizeWbsLayout, aktifAgac?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Shift') setIsShiftPressed(true); };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === 'Shift') setIsShiftPressed(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    document.dispatchEvent(new Event('close-menus'));
    if (event.ctrlKey || event.metaKey) {
       const depth = getDepth(node.id, edges);
       const label = depth === 0 ? t('new_task') : t('new_subtask');
       addGoal(node.id, label);
       return;
    }
    
    onNodeSelect(node.id);

    // Kutunun ismine tıklamak "kutuya tıklandı" sayılmıyor. İsim değiştirmek
    // için çift tıklandığında araya iki tek tıklama giriyor; alt kutular
    // açılıp hemen kapanıyor ve kamera her seferinde kutuya yaklaşıyordu.
    // Yalnızca yazının kendisi kapsam dışı: ismin durduğu blok kutunun
    // neredeyse tamamını kapladığı için kısa isimli kutularda tıklanacak yer
    // kalmazdı.
    if ((event.target as HTMLElement)?.closest?.('[data-kutu-basligi]')) return;

    toggleExpand(node.id);

    // Kutunun ortasına yaklaş. Eskiden yarım kutu boyu sağa kaçıyordu: burada
    // kutu genişliği 440 varsayılıyordu, gerçekte 220.
    const genislik = node.measured?.width || WBS_NODE_W;
    const yukseklik = node.measured?.height || WBS_NODE_H;
    setCenter(node.position.x + genislik / 2, node.position.y + yukseklik / 2, { zoom: getZoom(), duration: 800 });
  }, [addGoal, onNodeSelect, toggleExpand, setCenter, getZoom, t, edges]);

  const onNodeDragStart = useCallback((_event: any, node: any) => {
    // Sürükleme tek bir işlem: burada açılıyor, bırakılınca kapanıyor. Arada
    // olup biten (seçim, her karede güncellenen konum) geçmişe ayrı ayrı
    // girmiyor; geri alındığında kutu sürüklemeden ÖNCEKİ yerine dönüyor.
    islemBasla();
    surukleAcik.current = true;
    surukleBaslangici.current = { id: node.id, x: node.position.x, y: node.position.y };
    if (isShiftPressed) {
      const descendants = getDescendants(node.id, edges);
      const changes: any[] = descendants.map(id => ({ id, type: 'select', selected: true }));
      // Also select the node itself just in case
      changes.push({ id: node.id, type: 'select', selected: true });
      onNodesChange(changes);
    }
  }, [edges, isShiftPressed, onNodesChange]);

  // Sapma sürükleme bitince tek seferde yazılır. Taşınan kutuların hepsi aynı
  // mesafeyi kat ettiği için tek bir fark yetiyor.
  const onNodeDragStop = useCallback((_event: any, node: any, tasinanlar?: any[]) => {
    const baslangic = surukleBaslangici.current;
    surukleBaslangici.current = null;
    try {
      if (!baslangic || baslangic.id !== node.id) return;

      const dx = node.position.x - baslangic.x;
      const dy = node.position.y - baslangic.y;
      const idler = (tasinanlar && tasinanlar.length > 0 ? tasinanlar : [node]).map((n: any) => n.id);
      nudgeGoals(idler, dx, dy);
    } finally {
      // Erken çıkışta da kapanmalı; açık kalan bir işlem sonraki bütün
      // yazmaları kendine yutar ve geçmiş yine tek dev adıma döner.
      surukleAcik.current = false;
      islemBitir();
    }
  }, [nudgeGoals]);

  // Bırakma olayı hiç gelmeden bileşen sökülürse (araç değişimi, proje
  // değişimi) açık işlem kapatılır.
  useEffect(() => () => {
    if (surukleAcik.current) {
      surukleAcik.current = false;
      islemBitir();
    }
  }, []);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      // Açıklama kutusu gibi yazı alanlarında sağ tık tarayıcının kendi
      // menüsüne bırakılıyor: kullanıcı orada Kes/Kopyala/Yapıştır bekliyor.
      if (metinAlaninda(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      setContextMenuNodeId(node.id);
      setPaneMenu(null);
    },
    [setContextMenuNodeId]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      if (metinAlaninda(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      setPaneMenu({
        top: event.clientY,
        left: event.clientX,
        clientX: event.clientX,
        clientY: event.clientY,
      });
      setContextMenuNodeId(null);
    },
    [setContextMenuNodeId]
  );

  // Kanvas kaydırılınca/yakınlaştırılınca menü düğümle birlikte sürükleniyor ve
  // ekran dışına çıkabiliyordu; hareket başlar başlamaz kapatıyoruz.
  const onMoveStart = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setContextMenuNodeId(null);
    setPaneMenu(null);
    setEditingDescriptionId(null);
  }, [setContextMenuNodeId, setEditingDescriptionId]);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    document.dispatchEvent(new Event('close-menus'));
    if (event.ctrlKey || event.metaKey) {
       const pos = screenToFlowPosition({
         x: event.clientX,
         y: event.clientY,
       });
       addGoal(null, t('new_project_node'), pos);
    }
    setContextMenuNodeId(null);
    setPaneMenu(null);
    setEditingDescriptionId(null);
    onNodeSelect(null);
  }, [onNodeSelect, screenToFlowPosition, addGoal, t, setEditingDescriptionId, setContextMenuNodeId]);

  return (
    <div className="h-full w-full relative bg-slate-50 dark:bg-slate-900 transition-colors" ref={reactFlowWrapper} onContextMenu={onPaneContextMenu as any}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={onMoveStart}
        fitView
        deleteKeyCode={['Delete']}
        fitViewOptions={{ duration: 1000 }}
        minZoom={0.1}
        defaultEdgeOptions={{
          type: 'smoothstep',
          // Animasyon kapalı: yüzden fazla kutulu bir ağaçta yüzlerce çizgi
          // sürekli yeniden çiziliyor, hem ekran huzursuz hem işlemci boşuna
          // meşguldü. Çizgi de inceldi, kutular yaklaşınca 4px kalabalık yapıyordu.
          animated: false,
          style: { strokeWidth: 2, stroke: themeColors.canvasEdge },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* React Flow'un kendi .react-flow__panel kuralı margin: 15px veriyor
            ve Tailwind'in mt-* sınıfını eziyor; menü geri al/ileri al
            düğmelerinin üstüne biniyordu. Satır içi stil ikisini de geçer. */}
        <Panel position="top-left" className="flex flex-col items-start gap-2" style={{ marginTop: 72 }}>
          {aktifAgac && <WbsTreesMenu aktif={aktifAgac} />}

          {/* Elle kaydırılmış kutu varken çıkar; hepsini otomatik dizilime geri
              döndürür. Eskiden bu düğme kaydırılan kutunun EBEVEYNİNİN üstünde
              küçücük bir simge olarak duruyordu, kimse bulamıyordu. */}
          {kaydirilmisVar && (
            <button
              onClick={() => realignAllGoals()}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={t('goal_realign')}
            >
              <LayoutGrid size={16} className="text-indigo-500" />
              <span>{t('goal_realign')}</span>
            </button>
          )}
        </Panel>

        <MiniMap position="bottom-right" className="!w-48 !h-48 !rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-2xl dark:bg-slate-800 bg-white" maskColor={themeColors.minimapMask} nodeColor={themeColors.minimapNode} zoomable pannable />
        <CanvasBackdrop />

        {showStarterPanel && (
          <Panel position="top-center" className="mt-20">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-2xl text-center max-w-md">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Network size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {t('wbs_empty')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                {t('wbs_empty_hint')}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // Tuval boşsa kök düğüm gerekiyor; varsayılan kök zaten duruyorsa paneli kapatmak yeterli.
                    if (isEmptyCanvas) addGoal(null, t('new_project_node'));
                    setStarterDismissed(true);
                  }}
                  className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                >
                  {isEmptyCanvas ? t('wbs_add_root') : t('start_from_scratch')}
                </button>
                <button
                  onClick={() => loadWbsExample()}
                  className="w-full py-3 px-6 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold transition-all active:scale-95"
                >
                  {t('load_example')}
                </button>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {paneMenu && (
        <PaneContextMenu
          x={paneMenu.left}
          y={paneMenu.top}
          onClose={() => setPaneMenu(null)}
          onAddRootGoal={() => {
            const pos = screenToFlowPosition({
              x: paneMenu.clientX,
              y: paneMenu.clientY,
            });
            addGoal(null, t('new_project_node'), pos);
            setPaneMenu(null);
          }}
        />
      )}

    </div>
  );
}

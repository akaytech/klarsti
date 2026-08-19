import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import type { NodeMouseHandler, Edge } from '@xyflow/react';
// Tip ile bileşen aynı adı taşıyor (aşağıda FtaNode diye bir bileşen de
// içe aktarılıyor); tip takma adla alınıyor.
import type { FtaNode as FtaNodeTipi } from '../store/useRoadmapStore';
import '@xyflow/react/dist/style.css';
import { GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, isPristineFta, getActiveFta } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from '../theme';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import FtaNode from './FtaNode';
import FtaContextMenu from './FtaContextMenu';
import CanvasAddButton from './CanvasAddButton';
import CanvasKarsilama from './CanvasKarsilama';
import { useEkranaSigdir } from '../utils/ekranaSigdir';
import { calculateProbability, FtaProbabilityContext } from '../utils/ftaProbability';
import CalismaMenusu from './CalismaMenusu';
import CanvasMiniMap from './CanvasMiniMap';
import CanvasControls from './CanvasControls';
import { useSilTusu } from '../utils/useSilTusu';
import { islem } from '../store/gecmis';

const nodeTypes = {
  ftaNode: FtaNode,
};

// Sabit boş diziler: her boyamada yenisi üretilirse ona bağlı useMemo'lar
// boşuna yeniden hesaplanır.
const BOS_NODES: FtaNodeTipi[] = [];
const BOS_EDGES: Edge[] = [];


export default function FtaCanvas() {
  const themeColors = useTheme();
  const {  onFtaNodesChange, onFtaEdgesChange, onFtaConnect, addFtaNode, updateFtaNode, deleteFtaNode, addFtaRoot, loadFtaExample,
    ftaAnalyses, setActiveFta, addFtaAnalysis, renameFtaAnalysis, deleteFtaAnalysis, moveFtaTo  } = useRoadmapStore(useShallow((state) => ({
      onFtaNodesChange: state.onFtaNodesChange,
      onFtaEdgesChange: state.onFtaEdgesChange,
      onFtaConnect: state.onFtaConnect,
      addFtaNode: state.addFtaNode,
      updateFtaNode: state.updateFtaNode,
      deleteFtaNode: state.deleteFtaNode,
      addFtaRoot: state.addFtaRoot,
      loadFtaExample: state.loadFtaExample,
      ftaAnalyses: state.ftaAnalyses,
      setActiveFta: state.setActiveFta,
      addFtaAnalysis: state.addFtaAnalysis,
      renameFtaAnalysis: state.renameFtaAnalysis,
      moveFtaTo: state.moveFtaTo,
      deleteFtaAnalysis: state.deleteFtaAnalysis
    })));

  // Kutular ve çizgiler açık ağacın içinde duruyor.
  const aktifAgac = useRoadmapStore(getActiveFta);
  const ftaNodes = aktifAgac?.nodes ?? BOS_NODES;
  const ftaEdges = aktifAgac?.edges ?? BOS_EDGES;
  const { t } = useTranslation();
  const { setCenter, getZoom } = useReactFlow();

  // Delete tuşu depo üzerinden siliyor; React Flow'un kendi silmesi kapalı,
  // çünkü o kutuyu silmeden önce çizgileri kaldırıp alt olayları öksüz
  // bırakıyordu (bkz. useSilTusu).
  useSilTusu(useCallback((idler: string[]) => {
    islem(() => idler.forEach((id) => useRoadmapStore.getState().deleteFtaNode(id)));
  }, []));
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Kullanıcı "kendim oluşturacağım" derse panel bu oturum boyunca geri gelmez.
  const [starterDismissed, setStarterDismissed] = useState(false);
  const isEmptyCanvas = ftaNodes.length === 0;
  const showStarterPanel = !starterDismissed && isPristineFta(ftaNodes, ftaEdges);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    document.dispatchEvent(new Event('close-menus'));
    // Smooth pan to clicked node
    setCenter(node.position.x + 90, node.position.y + 40, { zoom: getZoom(), duration: 800 });
  }, [setCenter, getZoom]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: FtaNodeTipi) => {
      // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor:
      // kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü değil.
      if (metinAlaninda(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
    },
    []
  );

  const onPaneClick = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
  }, []);

  // Ağaç değişince ya da örnek yüklenince kamera içeriğe sığdırılıyor.
  useEkranaSigdir(aktifAgac?.id, ftaNodes.length, { padding: 0.2 });

  /**
   * Alttaki "kutu ekle" düğmesi. Hata ağacında yeni kutunun türü (olay, temel
   * neden, VE/VEYA kapısı...) seçilmek zorunda; o yüzden düğme doğrudan
   * eklemiyor, sağ tıkla açılan menünün aynısını düğmenin üstünde açıyor.
   * Seçili kutu yoksa altına ekleyecek bir yer de yok: düğme pasif kalıyor.
   */
  const secili = ftaNodes.filter((n) => n.selected);
  const seciliKutu = secili.length === 1 ? secili[0] : null;

  const dugmeIleEkle = useCallback((yer: { x: number; y: number }) => {
    if (!seciliKutu) return;
    document.dispatchEvent(new Event('close-menus'));
    setMenu({ id: seciliKutu.id, top: yer.y, left: yer.x });
  }, [seciliKutu]);

  const probabilityMap = useMemo(() => {
    const cache = new Map<string, number | undefined>();
    ftaNodes.forEach(n => calculateProbability(n.id, ftaNodes, ftaEdges, cache));
    return cache;
  }, [ftaNodes, ftaEdges]);

  return (
    <FtaProbabilityContext.Provider value={probabilityMap}>
    <div className="h-full w-full relative bg-slate-50 dark:bg-slate-900 transition-colors" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={ftaNodes}
        edges={ftaEdges}
        onNodesChange={onFtaNodesChange}
        onEdgesChange={onFtaEdgesChange}
        onConnect={onFtaConnect}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        fitView
        // Silme React Flow'a bırakılmıyor: o, kutuyu silmeden ÖNCE çizgileri
        // kaldırıyor ve ağacı çizgilerden okuyan bu araçta çocuklar
        // öksüz kalıyor (bkz. useSilTusu).
        deleteKeyCode={null}
        fitViewOptions={{ duration: 1000, maxZoom: 1.2 }}
        minZoom={0.1}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 3, stroke: themeColors.canvasEdge },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasControls />
        <CanvasMiniMap nodeColor={themeColors.minimapNode} maskColor={themeColors.minimapMask} />
        {aktifAgac && (
          <Panel position="top-left" style={{ marginTop: 68 }}>
            <CalismaMenusu
              Simge={GitBranch}
              aktifId={aktifAgac.id}
              ogeler={ftaAnalyses.map((a) => ({ id: a.id, name: a.name, rozet: a.nodes.length }))}
              onSec={setActiveFta}
              onEkle={() => addFtaAnalysis(t('fta_analysis_name_n', { sira: ftaAnalyses.length + 1 }))}
              onYenidenAdlandir={renameFtaAnalysis}
              onSil={deleteFtaAnalysis}
              onSirala={moveFtaTo}
              metinler={{
                baslik: t('fta_analyses'),
                yeni: t('fta_new_analysis'),
                yenidenAdlandir: t('fta_rename_analysis'),
                ad: t('fta_analysis_name'),
                sil: t('fta_delete_analysis'),
                silMesaji: 'fta_delete_analysis_msg',
              }}
            />
          </Panel>
        )}

        <CanvasBackdrop />

        {!showStarterPanel && ftaNodes.length > 0 && (
          <CanvasAddButton
            etiket={t('canvas_add_generic')}
            ipucu={seciliKutu ? t('canvas_add_hint_menu') : t('canvas_add_select_first')}
            pasif={!seciliKutu}
            onClick={dugmeIleEkle}
          />
        )}

        {showStarterPanel && (
          <Panel position="top-center" className="mt-20">
            <CanvasKarsilama
              simge={<GitBranch size={18} />}
              baslik={t('fta_empty')}
              aciklama={t('fta_empty_hint')}
              birincil={{
                etiket: isEmptyCanvas ? t('fta_add_root') : t('start_from_scratch'),
                onClick: () => {
                  if (isEmptyCanvas) addFtaRoot();
                  setStarterDismissed(true);
                }
              }}
              ikincil={{ etiket: t('load_example'), onClick: () => loadFtaExample() }}
              onKapat={() => setStarterDismissed(true)}
            />
          </Panel>
        )}
      </ReactFlow>

      {menu && (
        <FtaContextMenu
          x={menu.left}
          y={menu.top}
          node={ftaNodes.find((n) => n.id === menu.id)!}
          onClose={() => setMenu(null)}
          onAddNode={(type, label) => {
             addFtaNode(menu.id, type, label);
             setMenu(null);
          }}
          onUpdate={(data) => updateFtaNode(menu.id, data)}
          onDelete={() => {
             deleteFtaNode(menu.id);
             setMenu(null);
          }}
        />
      )}
    </div>
    </FtaProbabilityContext.Provider>
  );
}

import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Panel,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRoadmapStore, getActiveFiveWhys } from '../store/useRoadmapStore';
// Tip ile bileşen aynı adı taşıyor (aşağıda FiveWhysNode diye bir bileşen de
// içe aktarılıyor); tip takma adla alınıyor.
import type { FiveWhysNode as FiveWhysNodeType } from '../store/useRoadmapStore';
import type { Edge } from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

import { useTheme } from '../theme';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import FiveWhysNode from './FiveWhysNode';
import FiveWhysContextMenu from './FiveWhysContextMenu';
import CalismaMenusu from './CalismaMenusu';
import CanvasKarsilama from './CanvasKarsilama';
import KarsilamaPaneli from './KarsilamaPaneli';
import { useEkranaSigdir } from '../utils/ekranaSigdir';
import CanvasMiniMap from './CanvasMiniMap';
import { useSilTusu } from '../utils/useSilTusu';
import { islem } from '../store/gecmis';

const nodeTypes = {
  fiveWhysNode: FiveWhysNode,
};

// Sabit boş diziler: her boyamada yenisi üretilirse ona bağlı useMemo'lar
// boşuna yeniden hesaplanır.
const BOS_NODES: FiveWhysNodeType[] = [];
const BOS_EDGES: Edge[] = [];


function FiveWhysCanvasInner() {
  const { t } = useTranslation();
  const themeColors = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Delete tuşu depo üzerinden siliyor; React Flow'un kendi silmesi kapalı,
  // çünkü o kutuyu silmeden önce çizgileri kaldırıp alt nedenleri öksüz
  // bırakıyordu (bkz. useSilTusu).
  useSilTusu(useCallback((idler: string[]) => {
    islem(() => idler.forEach((id) => useRoadmapStore.getState().deleteFiveWhysNode(id)));
  }, []));
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  // Karşılama şeridi kapatılabilsin diye: eskiden kaldırmanın tek yolu
  // düğmelerden birine basmaktı, sadece tuvale bakmak isteyen sıkışıyordu.
  const [karsilamaKapandi, setKarsilamaKapandi] = useState(false);

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
    moveFiveWhysTo,
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
    moveFiveWhysTo: state.moveFiveWhysTo,
    deleteFiveWhysAnalysis: state.deleteFiveWhysAnalysis
  })));

  // Kutular ve çizgiler açık analizin içinde duruyor.
  const aktifAnaliz = useRoadmapStore(getActiveFiveWhys);
  const fiveWhysNodes = aktifAnaliz?.nodes ?? BOS_NODES;
  const fiveWhysEdges = aktifAnaliz?.edges ?? BOS_EDGES;

  // Analiz değişince ya da örnek yüklenince kamera içeriğe sığdırılıyor.
  useEkranaSigdir(aktifAnaliz?.id, fiveWhysNodes.length, { padding: 0.2 });

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: FiveWhysNodeType) => {
      // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor:
      // kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü değil.
      if (metinAlaninda(event.target)) return;
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
    },
    []
  );

  // Boş alana Ctrl+tık ve boş alan sağ tık menüsü kaldırıldı: ikisi de aynı
  // kanvasa ikinci, üçüncü bir ana sorun kutusu koyuyordu. Bir 5 Neden
  // analizinin tek bir problemi olur; ikinci problem ayrı bir analizdir
  // (sol üstteki menüden "Yeni analiz"). Ana sorun artık yalnızca kanvas
  // bomboşken çıkan karşılama şeridinden ekleniyor.
  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: FiveWhysNodeType) => {
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
    <div className="h-full w-full relative bg-slate-50 dark:bg-slate-900 transition-colors" ref={reactFlowWrapper}>
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
          fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
          minZoom={0.1}
          // Silme React Flow'a bırakılmıyor: o, kutuyu silmeden ÖNCE çizgileri
        // kaldırıyor ve ağacı çizgilerden okuyan bu araçta çocuklar
        // öksüz kalıyor (bkz. useSilTusu).
        deleteKeyCode={null}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 3, stroke: themeColors.canvasEdge },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <CanvasMiniMap nodeColor={themeColors.minimapNode} maskColor={themeColors.minimapMask} />
          <CanvasBackdrop />

          {aktifAnaliz && (
            <Panel position="top-left" style={{ marginTop: 68 }}>
              <CalismaMenusu
                Simge={Activity}
                aktifId={aktifAnaliz.id}
                ogeler={fiveWhysAnalyses.map((a) => ({ id: a.id, name: a.name, rozet: a.nodes.length }))}
                onSec={setActiveFiveWhys}
                onEkle={() => addFiveWhysAnalysis(t('whys_analysis_name_n', { sira: fiveWhysAnalyses.length + 1 }))}
                onYenidenAdlandir={renameFiveWhysAnalysis}
                onSil={deleteFiveWhysAnalysis}
                onSirala={moveFiveWhysTo}
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
          
          {fiveWhysNodes.length === 0 && !karsilamaKapandi && (
             <KarsilamaPaneli>
               <CanvasKarsilama
                 simge={<Activity size={18} />}
                 baslik={t('whys_empty')}
                 aciklama={t('whys_empty_hint')}
                 birincil={{ etiket: t('whys_add_root'), onClick: () => addFiveWhysNode(null, 'problem', t('whys_placeholder')) }}
                 ikincil={{ etiket: t('load_example'), onClick: () => loadFiveWhysExample() }}
                 onKapat={() => setKarsilamaKapandi(true)}
               />
             </KarsilamaPaneli>
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

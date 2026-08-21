import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import { Network, LayoutGrid } from 'lucide-react';
import type { NodeMouseHandler, OnNodeDrag, Edge, NodeChange } from '@xyflow/react';
import type { GoalNode as GoalNodeType, GoalStatus } from '../store/useRoadmapStore';
import '@xyflow/react/dist/style.css';
import { useRoadmapStore, getDescendants, getActiveWbsTree, isPristineWbs, WBS_NODE_W, WBS_NODE_H } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { islem, islemBasla, islemBitir } from '../store/gecmis';
import { getDepth } from '../utils/layout';
import { altKutuAdi } from '../utils/wbsSeviye';
import { useTheme } from '../theme';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import GoalNode from './GoalNode';
import CanvasKarsilama from './CanvasKarsilama';
import KarsilamaPaneli from './KarsilamaPaneli';
import { useEkranaSigdir } from '../utils/ekranaSigdir';
import PaneContextMenu from './PaneContextMenu';
import SelectionContextMenu from './SelectionContextMenu';
import WbsTreesMenu from './WbsTreesMenu';
import { useTranslation } from 'react-i18next';
import CanvasMiniMap from './CanvasMiniMap';
import { useSilTusu } from '../utils/useSilTusu';

const nodeTypes = {
  goalNode: GoalNode,
};

// Sabit boş diziler: her boyamada yenisi üretilirse React Flow her seferinde
// listeyi değişmiş sayar.
const EMPTY_NODES: GoalNodeType[] = [];
const EMPTY_EDGES: Edge[] = [];

export default function WbsCanvas({ onNodeSelect }: { onNodeSelect: (id: string | null) => void }) {
  const themeColors = useTheme();
  const { t } = useTranslation();
  const {  aktifAgac, onNodesChange, onEdgesChange, onConnect, toggleExpand, addGoal, updateGoal, deleteGoal, loadWbsExample, nudgeGoals, realignAllGoals, normalizeWbsLayout  } = useRoadmapStore(useShallow((state) => ({
      aktifAgac: getActiveWbsTree(state),
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      toggleExpand: state.toggleExpand,
      addGoal: state.addGoal,
      updateGoal: state.updateGoal,
      deleteGoal: state.deleteGoal,
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
  // Seçili kimlikler menü açılırken dondurularak saklanıyor: menüdeki bir
  // seçeneğe tıklamak seçimi bozarsa işlem yine doğru kutulara uygulanmalı.
  const [secimMenusu, setSecimMenusu] = useState<{ top: number; left: number; idler: string[] } | null>(null);
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

  // Ağaç değişince ya da örnek şablon yüklenince kamera içeriğe sığdırılıyor.
  // Gecikme yukarıdaki dizilim düzeltmesinden (300 ms) sonraya ayarlı; daha
  // erken sığdırılırsa kutuların düzeltilmemiş konumlarına göre hesaplanıyor.
  useEkranaSigdir(aktifAgac?.id, nodes.length, { padding: 0.18, duration: 500, gecikme: 380 });

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
       addGoal(node.id, altKutuAdi(t, getDepth(node.id, edges)));
       return;
    }
    
    onNodeSelect(node.id);
  }, [addGoal, onNodeSelect, t, edges]);

  // Alt kutuları açıp kapatmak ÇİFT tıkla. Eskiden tek tıktaydı: kutuyu
  // seçmek isteyen kullanıcı istemeden dalı kapatıyor, kamera da her
  // seçimde kutuya yaklaşıyordu. Tek tık artık yalnızca seçiyor.
  //
  // Kamera ortalama bu harekete bağlı kaldı: "kutuyu aç" ile "kutuya bak"
  // aynı jestin iki yarısı.
  const onNodeDoubleClick: NodeMouseHandler<GoalNodeType> = useCallback((event, node) => {
    // Kutunun ismine çift tıklamak ismi düzenlemeye açıyor (bkz. GoalNode);
    // orada dalın da açılıp kapanması istenmiyor. Yalnızca yazının kendisi
    // kapsam dışı: ismin durduğu blok kutunun neredeyse tamamını kapladığı
    // için kısa isimli kutularda çift tıklanacak yer kalmazdı.
    if ((event.target as HTMLElement)?.closest?.('[data-kutu-basligi]')) return;

    toggleExpand(node.id);

    // Kutunun ortasına yaklaş. Eskiden yarım kutu boyu sağa kaçıyordu: burada
    // kutu genişliği 440 varsayılıyordu, gerçekte 220.
    const genislik = node.measured?.width || WBS_NODE_W;
    const yukseklik = node.measured?.height || WBS_NODE_H;
    setCenter(node.position.x + genislik / 2, node.position.y + yukseklik / 2, { zoom: getZoom(), duration: 800 });
  }, [toggleExpand, setCenter, getZoom]);

  const onNodeDragStart: OnNodeDrag<GoalNodeType> = useCallback((_event, node) => {
    // Sürükleme tek bir işlem: burada açılıyor, bırakılınca kapanıyor. Arada
    // olup biten (seçim, her karede güncellenen konum) geçmişe ayrı ayrı
    // girmiyor; geri alındığında kutu sürüklemeden ÖNCEKİ yerine dönüyor.
    islemBasla();
    surukleAcik.current = true;
    surukleBaslangici.current = { id: node.id, x: node.position.x, y: node.position.y };
    if (isShiftPressed) {
      const descendants = getDescendants(node.id, edges);
      const changes: NodeChange<GoalNodeType>[] = descendants.map((id) => ({ id, type: 'select', selected: true }));
      // Also select the node itself just in case
      changes.push({ id: node.id, type: 'select', selected: true });
      onNodesChange(changes);
    }
  }, [edges, isShiftPressed, onNodesChange]);

  // Sapma sürükleme bitince tek seferde yazılır. Taşınan kutuların hepsi aynı
  // mesafeyi kat ettiği için tek bir fark yetiyor.
  const onNodeDragStop: OnNodeDrag<GoalNodeType> = useCallback((_event, node, tasinanlar) => {
    const baslangic = surukleBaslangici.current;
    surukleBaslangici.current = null;
    try {
      if (!baslangic || baslangic.id !== node.id) return;

      const dx = node.position.x - baslangic.x;
      const dy = node.position.y - baslangic.y;
      const idler = (tasinanlar && tasinanlar.length > 0 ? tasinanlar : [node]).map((n) => n.id);
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

  /**
   * Toplu seçim menüsü mü açılmalı?
   *
   * Sağ tık şimdiye kadar iki duruma bakıyordu: kutuya mı geldi, boşluğa mı.
   * Shift ile birden fazla kutu seçildiğinde ikisi de yanlış cevap veriyordu —
   * seçimin içindeki boşluk "boş kanvas" sayılıyor ve kutu ekleme menüsü
   * açılıyordu. İki kutudan itibaren üçüncü menü devreye giriyor.
   */
  const secilenler = useCallback(() => nodes.filter((n) => n.selected).map((n) => n.id), [nodes]);

  const topluMenuAc = useCallback((event: React.MouseEvent | MouseEvent, idler: string[]) => {
    event.preventDefault();
    event.stopPropagation();
    setSecimMenusu({ top: event.clientY, left: event.clientX, idler });
    setPaneMenu(null);
    setContextMenuNodeId(null);
  }, [setContextMenuNodeId]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: GoalNodeType) => {
      // Açıklama kutusu gibi yazı alanlarında sağ tık tarayıcının kendi
      // menüsüne bırakılıyor: kullanıcı orada Kes/Kopyala/Yapıştır bekliyor.
      if (metinAlaninda(event.target)) return;

      // Seçili kutulardan birine sağ tıklamak da "bu seçimle iş yapacağım"
      // demek; tek kutu menüsü açılsaydı seçim yok sayılmış olurdu.
      const secili = secilenler();
      if (secili.length > 1 && secili.includes(node.id)) {
        topluMenuAc(event, secili);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setContextMenuNodeId(node.id);
      setPaneMenu(null);
      setSecimMenusu(null);
    },
    [setContextMenuNodeId, secilenler, topluMenuAc]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      if (metinAlaninda(event.target)) return;

      const secili = secilenler();
      if (secili.length > 1) {
        topluMenuAc(event, secili);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      // Boş alan menüsünün tek işi projeyi açmak. Proje zaten varsa menüyü
      // açmıyoruz: bir ağaçta ikinci proje olmaz, yeni proje soldaki menüden
      // yeni bir ağaç açılarak kuruluyor.
      if (nodes.length > 0) {
        setContextMenuNodeId(null);
        setSecimMenusu(null);
        return;
      }
      setPaneMenu({
        top: event.clientY,
        left: event.clientX,
        clientX: event.clientX,
        clientY: event.clientY,
      });
      setContextMenuNodeId(null);
      setSecimMenusu(null);
    },
    [setContextMenuNodeId, secilenler, topluMenuAc, nodes.length]
  );

  /**
   * Toplu işlemler. Hepsi tek `islem` sınırı içinde: yedi kutunun durumu
   * değiştirilip geri alındığında yedisi birden dönüyor, yedi kez geri almak
   * gerekmiyor. İç içe işlemleri gecmis.ts tek kayda indiriyor.
   *
   * Tek kutuluk eylemler olduğu gibi çağrılıyor; durum değişiminin ebeveyne
   * yansıması, yeniden dizilim ve ajanda eşleşmesi orada zaten çözülmüş.
   */
  const topluDurum = useCallback((idler: string[], status: GoalStatus) => {
    islem(() => idler.forEach((id) => updateGoal(id, { status })));
  }, [updateGoal]);

  const topluAcKapa = useCallback((idler: string[], acik: boolean) => {
    // Karar tıklama anındaki duruma göre veriliyor: yalnızca istenen halde
    // olmayanlar çevriliyor, böylece karışık seçimde hepsi aynı hale geliyor.
    const cevrilecek = idler.filter((id) => {
      const kutu = nodes.find((n) => n.id === id);
      return kutu && !!kutu.data.isExpanded !== acik;
    });
    if (cevrilecek.length === 0) return;
    islem(() => cevrilecek.forEach((id) => toggleExpand(id)));
  }, [nodes, toggleExpand]);

  const topluSil = useCallback((idler: string[]) => {
    // Bir ebeveyn silinince altındakiler de gidiyor; sonradan gelen kimlik
    // ağaçta bulunamıyor ve sessizce atlanıyor.
    islem(() => idler.forEach((id) => deleteGoal(id)));
  }, [deleteGoal]);

  // Delete tuşu da aynı yoldan gidiyor. React Flow'un kendi silmesi kapalı;
  // o, kutuyu silmeden önce çizgileri kaldırıp ağacı bozuyordu.
  useSilTusu(topluSil);

  // Kanvas kaydırılınca/yakınlaştırılınca menü düğümle birlikte sürükleniyor ve
  // ekran dışına çıkabiliyordu; hareket başlar başlamaz kapatıyoruz.
  const onMoveStart = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setContextMenuNodeId(null);
    setPaneMenu(null);
    setSecimMenusu(null);
    setEditingDescriptionId(null);
  }, [setContextMenuNodeId, setEditingDescriptionId]);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    document.dispatchEvent(new Event('close-menus'));
    // Ctrl+tık yalnızca ağaç bomboşken projeyi açıyor. Proje varsa sessizce
    // görmezden geliniyor: ikinci bir kök ağaç kurulmasın diye.
    if ((event.ctrlKey || event.metaKey) && nodes.length === 0) {
      const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addGoal(null, t('new_project_node'), pos);
    }
    setContextMenuNodeId(null);
    setPaneMenu(null);
    setSecimMenusu(null);
    setEditingDescriptionId(null);
    onNodeSelect(null);
  }, [onNodeSelect, screenToFlowPosition, addGoal, t, nodes.length, setEditingDescriptionId, setContextMenuNodeId]);

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
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={onMoveStart}
        fitView
        // Silme React Flow'a bırakılmıyor: o, kutuyu silmeden ÖNCE çizgileri
        // kaldırıyor ve ağacı çizgilerden okuyan bu araçta çocuklar
        // öksüz kalıyor (bkz. useSilTusu).
        deleteKeyCode={null}
        // maxZoom: tek kutulu bir ağaçta sığdırma varsayılan üst sınıra (2 kat)
        // kadar yaklaşıyor ve sonradan gelen kutular o yakınlıkta kalıyordu.
        fitViewOptions={{ duration: 1000, maxZoom: 1.2 }}
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

        <CanvasMiniMap nodeColor={themeColors.minimapNode} maskColor={themeColors.minimapMask} />
        <CanvasBackdrop />

        {showStarterPanel && (
          <KarsilamaPaneli>
            <CanvasKarsilama
              simge={<Network size={18} />}
              baslik={t('wbs_empty')}
              aciklama={t('wbs_empty_hint')}
              birincil={{
                etiket: isEmptyCanvas ? t('wbs_add_project') : t('start_from_scratch'),
                onClick: () => {
                  // Tuval boşsa kök düğüm gerekiyor; varsayılan kök zaten duruyorsa paneli kapatmak yeterli.
                  if (isEmptyCanvas) addGoal(null, t('new_project_node'));
                  setStarterDismissed(true);
                }
              }}
              ikincil={{ etiket: t('load_example'), onClick: () => loadWbsExample() }}
              onKapat={() => setStarterDismissed(true)}
            />
          </KarsilamaPaneli>
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

      {secimMenusu && (
        <SelectionContextMenu
          x={secimMenusu.left}
          y={secimMenusu.top}
          sayi={secimMenusu.idler.length}
          onClose={() => setSecimMenusu(null)}
          onStatus={(status) => topluDurum(secimMenusu.idler, status)}
          onExpand={() => topluAcKapa(secimMenusu.idler, true)}
          onCollapse={() => topluAcKapa(secimMenusu.idler, false)}
          onDelete={() => topluSil(secimMenusu.idler)}
        />
      )}

    </div>
  );
}

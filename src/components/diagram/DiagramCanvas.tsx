import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  useReactFlow,
  Panel
} from '@xyflow/react';
import type { NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTranslation } from 'react-i18next';
import CanvasBackdrop from '../CanvasBackdrop';
import { metinAlaninda } from '../../utils/metinAlaninda';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { edgeStyle } from '../../config/diagramShared';
import { getActiveChart } from '../../store/slices/diagramOps';
import DiagramNode from './DiagramNode';
import DiagramContextMenu from './DiagramContextMenu';
import DiagramTypePicker from './DiagramTypePicker';
import DiagramChartsMenu from './DiagramChartsMenu';
import CanvasAddButton from '../CanvasAddButton';
import { useDiagram } from './useDiagram';
import { islemBasla, islemBitir } from '../../store/gecmis';
import CanvasMiniMap from '../CanvasMiniMap';
import CanvasControls from '../CanvasControls';

// Akış diyagramları ve organizasyon şemaları bu kanvası paylaşıyor; hangi
// katalogla çalışacağını `kind` belirliyor (bkz. config/diagramKinds.ts).
export default function DiagramCanvas({ kind }: { kind: DiagramKind }) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const { charts, activeId, onNodesChange, onEdgesChange, onConnect, addNode, updateNode, deleteNode } = useDiagram(kind);
  const { setCenter, getZoom } = useReactFlow();
  // `duzenle`: menü doğrudan ad yazma kutusuyla mı açılsın (çift tıklama ve
  // yeni eklenen kutu) yoksa satır listesiyle mi (sağ tık).
  const [menu, setMenu] = useState<{ id: string; top: number; left: number; duzenle?: boolean } | null>(null);
  const [yeniSemaAcik, setYeniSemaAcik] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Geçmişte açık bir sürükleme işlemi var mı? (bkz. onNodeDragStart)
  const surukleAcik = useRef(false);

  // Sürükleme tek bir işlem: burada açılıyor, bırakılınca kapanıyor. Kutunun
  // her karede güncellenen konumu geçmişe ayrı ayrı girmiyor; geri alındığında
  // kutu sürüklemeden ÖNCEKİ yerine dönüyor.
  const onNodeDragStart = useCallback(() => {
    islemBasla();
    surukleAcik.current = true;
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (!surukleAcik.current) return;
    surukleAcik.current = false;
    islemBitir();
  }, []);

  // Bırakma olayı hiç gelmeden bileşen sökülürse açık işlem kapatılır; yoksa
  // sonraki bütün yazmaları kendine yutar.
  useEffect(() => () => {
    if (surukleAcik.current) {
      surukleAcik.current = false;
      islemBitir();
    }
  }, []);

  // React Flow düğüm tipini her renderda yeniden kurmak kutuların sökülüp
  // yeniden takılmasına yol açıyor; araç değişmedikçe aynı nesne kalıyor.
  const nodeTypes = useMemo(
    () => ({ [k.nodeType]: (props: any) => <DiagramNode kind={kind} {...props} /> }),
    [kind, k.nodeType]
  );

  const aktif = getActiveChart(charts, activeId);

  // Kutuya tıklayınca kanvas o kutuyu ortalıyor. Çift tıklamanın ikinci
  // vuruşunda ortalanmıyor: kutu ad yazma kutusunun altından kayıp gidiyordu.
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    document.dispatchEvent(new Event('close-menus'));
    if (event.detail > 1) return;
    setCenter(node.position.x + 90, node.position.y + 40, { zoom: getZoom(), duration: 800 });
  }, [setCenter, getZoom]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor:
      // kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü değil.
      if (metinAlaninda(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      document.dispatchEvent(new Event('close-menus'));
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
    },
    []
  );

  // Kutuya çift tıklamak doğrudan adını değiştirmeye açar: kullanıcının
  // kutuyla ilk işi zaten adını yazmak, sağ tık menüsünden geçmesi gereksiz.
  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      document.dispatchEvent(new Event('close-menus'));
      setMenu({ id: node.id, top: event.clientY, left: event.clientX, duzenle: true });
    },
    []
  );

  const onPaneClick = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
  }, []);

  // Kanvası KULLANICI kaydırırsa menüler kapanır (kutuya yapışık menü kanvasla
  // birlikte ekran dışına çıkıyordu). Kodun kendi başlattığı kaydırmada
  // (kutuyu ortalama) olay nesnesi gelmez; o zaman menü açık kalır, yoksa
  // çift tıklamayla açılan ad yazma kutusu daha görünmeden kapanıyordu.
  const onMoveStart = useCallback((event: any) => {
    if (!event) return;
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
  }, []);

  /**
   * Alttaki "kutu ekle" düğmesi. Şemada yeni kutunun şekli (adım, karar,
   * başlangıç...) seçilmek zorunda; düğme doğrudan eklemiyor, kutuya sağ
   * tıkınca açılan menünün aynısını düğmenin üstünde açıyor. Yeni kutu seçili
   * kutunun altına iniyor, o yüzden seçim yokken düğme pasif.
   */
  const secili = aktif?.nodes.filter((n) => n.selected) ?? [];
  const seciliKutu = secili.length === 1 ? secili[0] : null;

  const dugmeIleEkle = useCallback((yer: { x: number; y: number }) => {
    if (!seciliKutu) return;
    document.dispatchEvent(new Event('close-menus'));
    setMenu({ id: seciliKutu.id, top: yer.y, left: yer.x });
  }, [seciliKutu]);

  // Projede hiç şema yoksa doğrudan tür seçim ekranı çıkar.
  if (!aktif) {
    return <DiagramTypePicker kind={kind} />;
  }

  const tur = k.getType(aktif.type);

  return (
    <div className="flex-1 h-full w-full relative transition-colors bg-slate-50 dark:bg-slate-900" ref={reactFlowWrapper}>
      <ReactFlow
        key={aktif.id}
        nodes={aktif.nodes}
        edges={aktif.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        onMoveStart={onMoveStart}
        fitView
        deleteKeyCode={['Delete']}
        fitViewOptions={{ duration: 1000, maxZoom: 1.2 }}
        minZoom={0.1}
        defaultEdgeOptions={{
          type: tur.edge.type,
          animated: tur.edge.animated,
          style: edgeStyle(tur.edge),
        }}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasBackdrop />
        <CanvasControls />

        {/* Şema menüsü. React Flow'un kendi stil dosyası panele margin veriyor
            ve Tailwind sınıfı ona yeniliyor, o yüzden satır içi stil: geri al /
            ileri al düğmelerinin altına iniyor. */}
        <Panel position="top-left" style={{ marginTop: 68 }}>
          <DiagramChartsMenu kind={kind} aktif={aktif} onYeniSema={() => setYeniSemaAcik(true)} />

          {/* Kesik çizgili ikincil hattı olan türlerde bunun nasıl çizileceği
              kendiliğinden anlaşılmıyor; küçük bir ipucu bırakılıyor. */}
          {tur.secondaryEdge && k.text.secondaryHint && (
            <p className="mt-2 max-w-[240px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400 shadow-sm">
              {t(k.text.secondaryHint)}
            </p>
          )}
        </Panel>

        <CanvasMiniMap nodeColor={(n) => k.getShape((n.data as any)?.shape).minimapColor} />

        {aktif.nodes.length > 0 && (
          <CanvasAddButton
            etiket={t('canvas_add_generic')}
            ipucu={seciliKutu ? t('canvas_add_hint_menu') : t('canvas_add_select_first')}
            pasif={!seciliKutu}
            onClick={dugmeIleEkle}
          />
        )}
      </ReactFlow>

      {menu && aktif.nodes.some((n) => n.id === menu.id) && (
        <DiagramContextMenu
          // Menü açıkken başka bir kutuya geçilebiliyor (yeni kutu eklenince);
          // anahtar olmadan içerideki yazı eski kutununki kalırdı.
          key={`${menu.id}-${menu.duzenle ? 'd' : 'l'}`}
          kind={kind}
          x={menu.left}
          y={menu.top}
          duzenleBaslat={menu.duzenle}
          node={aktif.nodes.find((n) => n.id === menu.id)!}
          onClose={() => setMenu(null)}
          onAddNode={(shape, label) => {
             // Yeni kutu üst kutunun altına konur.
             const parentNode = aktif.nodes.find(n => n.id === menu.id);
             const pos = parentNode ? { x: parentNode.position.x, y: parentNode.position.y + 150 } : { x: 0, y: 0 };
             const yeniId = addNode(menu.id, shape, label, pos);
             // Kutu eklenir eklenmez adı yazılsın diye menü yeni kutunun
             // üstünde, yazma kipinde açık kalıyor.
             setMenu({ id: yeniId, top: menu.top, left: menu.left, duzenle: true });
          }}
          onUpdate={(data) => updateNode(menu.id, data)}
          onDelete={() => {
             deleteNode(menu.id);
             setMenu(null);
          }}
        />
      )}

      {yeniSemaAcik && (
        <div className="absolute inset-0 z-[200] bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <DiagramTypePicker kind={kind} onKapat={() => setYeniSemaAcik(false)} />
        </div>
      )}
    </div>
  );
}

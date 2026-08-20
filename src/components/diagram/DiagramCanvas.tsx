import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  useReactFlow,
  Panel
} from '@xyflow/react';
import type { NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CanvasBackdrop from '../CanvasBackdrop';
import CanvasKarsilama from '../CanvasKarsilama';
import { useEkranaSigdir } from '../../utils/ekranaSigdir';
import { metinAlaninda } from '../../utils/metinAlaninda';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { edgeStyle } from '../../config/diagramShared';
import { getActiveChart } from '../../store/slices/diagramOps';
import DiagramNode from './DiagramNode';
import DiagramContextMenu from './DiagramContextMenu';
import DiagramTypePicker from './DiagramTypePicker';
import DiagramChartsMenu from './DiagramChartsMenu';
import DiagramShapeStrip from './DiagramShapeStrip';
import { useDiagram } from './useDiagram';
import { DiagramEditingContext } from './diagramEditing';
import { islemBasla, islemBitir } from '../../store/gecmis';
import CanvasMiniMap from '../CanvasMiniMap';
import CanvasControls from '../CanvasControls';

// Akış diyagramları ve organizasyon şemaları bu kanvası paylaşıyor; hangi
// katalogla çalışacağını `kind` belirliyor (bkz. config/diagramKinds.ts).
export default function DiagramCanvas({ kind }: { kind: DiagramKind }) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const { charts, activeId, onNodesChange, onEdgesChange, onConnect, addNode, updateNode, deleteNode, autoLayout, loadExample, normalizeLayout } = useDiagram(kind);
  const { setCenter, getZoom, fitView } = useReactFlow();
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  // Adı yazılan kutu. Ad değiştirme kutunun içinde oluyor (bkz. DiagramNode),
  // ama hangi kutunun yazma kipinde olduğunu kanvas biliyor: yeni eklenen kutu
  // da doğrudan yazma kipinde açılıyor.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [yeniSemaAcik, setYeniSemaAcik] = useState(false);
  // Kullanıcı "kendim oluşturacağım" derse karşılama bu oturum boyunca gelmez.
  const [karsilamaKapandi, setKarsilamaKapandi] = useState(false);
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

  // Örnek şablon yüklenince ya da başka bir şemaya geçilince kamera içeriğe
  // sığdırılıyor; yoksa on kutuluk örnek ekranın dışında açılıyor. Gecikme
  // aşağıdaki dizilime pay bırakıyor: daha erken sığdırılırsa kutuların henüz
  // düzeltilmemiş yerlerine göre hesaplanıyor.
  useEkranaSigdir(aktif?.id, aktif?.nodes.length ?? 0, { padding: 0.2, gecikme: 150 });

  // Örnek şablonu yükleyip hizaya sokar.
  //
  // Şablon yazılırken kutuların gerçek eni bilinmiyor: en, içindeki yazıya ve
  // yazı tipine göre değişiyor ve kutu daha ekrana çizilmedi. Şablondaki
  // konumlar bu yüzden kabataslak; hepsi eşit enliymiş gibi duruyor ve kutular
  // birbirine göre kayık çıkıyor.
  //
  // Dizilim, kutuların ölçüsü belli olur olmaz çalışıyor. Ölçü beklemenin
  // SÜREYLE yapılması yanlıştı: sabit bir bekleme hem gereksiz uzun, hem de
  // yavaş makinede yetersiz. Şimdi kutuların ölçülmesi bekleniyor (React Flow
  // ölçtükçe depoya yazıyor, bkz. kutuDegisiklikleri 'dimensions'); ölçüm ilk
  // boyamayla birlikte geldiği için şablon zaten hizalı açılıyor, kullanıcı
  // kutuların yerine oturmasını izlemiyor.
  const [ornekBekliyor, setOrnekBekliyor] = useState(false);

  // Hızlı yol: kutuların hepsi ölçülür ölçülmez dizilim çalışır ve kutular
  // görünür olur. Olağan halde ölçüm ilk boyamayla geldiği için bu bir kare
  // sürüyor, kullanıcı bekleme fark etmiyor.
  useEffect(() => {
    if (!ornekBekliyor) return;
    const kutular = aktif?.nodes ?? [];
    if (kutular.length === 0 || !kutular.every((n) => n.measured?.width)) return;
    setOrnekBekliyor(false);
    normalizeLayout();
  }, [ornekBekliyor, aktif?.nodes, normalizeLayout]);

  // Emniyet süresi: ölçüm gelmezse kutular sonsuza kadar saydam kalmasın.
  //
  // Bu zamanlayıcı BİLEREK yalnızca bayrağa bağlı. Kutulara da bağlıyken her
  // kutu yazmasında sıfırlanıyor ve hiç dolmuyordu: şablon yükleniyor ama
  // kutular hiç görünmüyordu.
  useEffect(() => {
    if (!ornekBekliyor) return;
    const zamanlayici = setTimeout(() => {
      setOrnekBekliyor(false);
      normalizeLayout();
    }, 500);
    return () => clearTimeout(zamanlayici);
  }, [ornekBekliyor, normalizeLayout]);

  const ornekYukle = useCallback(() => {
    loadExample?.();
    setOrnekBekliyor(true);
  }, [loadExample]);

  // Başka bir şemaya geçilince yarım kalan ad yazma kipi kapanır; yoksa yeni
  // şemada aynı kimlikli kutu varsa onun içinde açılıyor.
  useEffect(() => {
    setEditingId(null);
  }, [aktif?.id]);

  // Otomatik hizalama iki iş yapıyor (bkz. store/slices/diagramOps.autoLayout):
  // seçili kutu varsa yalnızca o kutu yerine oturuyor, yoksa bütün şema baştan
  // diziliyor. Bütün şema dizilince kamera da şemaya sığdırılıyor; yeni
  // dizilim eskisinden geniş olabiliyor ve sonucu göremeden bakakalıyordun.
  // Tek kutu hizalanırken kamera oynamıyor: kullanıcı zaten oraya bakıyor.
  const seciliVar = aktif?.nodes.some((n) => n.selected) ?? false;
  const hizala = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
    autoLayout();
    if (seciliVar) return;
    // Kutuların yeni yerleri React Flow'a işlensin diye bir karelik gecikme;
    // aynı anda çağrılınca kamera ESKİ dizilime sığdırıyor.
    setTimeout(() => fitView({ duration: 600, maxZoom: 1.2 }), 60);
  }, [autoLayout, seciliVar, fitView]);

  // Kutuya tıklayınca kanvas o kutuyu ortalıyor. Çift tıklamanın ikinci
  // vuruşunda ortalanmıyor: kutu ad yazma kutusunun altından kayıp gidiyordu.
  //
  // Kutunun yazısına tıklamak da kamerayı oynatmıyor: adını değiştirmek için
  // çift tıklayan kullanıcının altından kutu kayıp gidiyordu.
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    document.dispatchEvent(new Event('close-menus'));
    if (event.detail > 1) return;
    if ((event.target as HTMLElement)?.closest?.('[data-kutu-basligi]')) return;
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

  // Kutuya çift tıklamak adını kutunun içinde değiştirmeye açar: kullanıcının
  // kutuyla ilk işi zaten adını yazmak, sağ tık menüsünden geçmesi gereksiz.
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      document.dispatchEvent(new Event('close-menus'));
      setMenu(null);
      setEditingId(node.id);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
    setEditingId(null);
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
   * Yeni kutu: verilen kutunun altına iner, bağlantısı çizilir ve adı
   * doğrudan yazma kipinde açılır. Kardeşler üst üste binmesin diye her yeni
   * kutu bir öncekinin sağına konuyor.
   */
  const kutuEkle = useCallback((parentId: string, shape: string, label: string) => {
    const ebeveyn = aktif?.nodes.find((n) => n.id === parentId);
    const kardesSayisi = aktif?.edges.filter((e) => e.source === parentId).length ?? 0;
    const yer = ebeveyn
      ? { x: ebeveyn.position.x + kardesSayisi * 220, y: ebeveyn.position.y + 150 }
      : { x: 0, y: 0 };
    const yeniId = addNode(parentId, shape, label, yer);
    setMenu(null);
    setEditingId(yeniId);
  }, [aktif, addNode]);

  // Kutular bağlamı tüketiyor; bağlam her kutu taşındığında değişirse bütün
  // kutular yeniden çiziliyor. İşlev sabit kalıyor, güncel hâli ref'te.
  const kutuEkleRef = useRef(kutuEkle);
  kutuEkleRef.current = kutuEkle;
  const kutuEkleSabit = useCallback(
    (parentId: string, shape: string, label: string) => kutuEkleRef.current(parentId, shape, label),
    []
  );

  const duzenleme = useMemo(
    () => ({ editingId, setEditingId, kutuEkle: kutuEkleSabit, hazirlaniyor: ornekBekliyor }),
    [editingId, kutuEkleSabit, ornekBekliyor]
  );

  // Projede hiç şema yoksa doğrudan tür seçim ekranı çıkar.
  if (!aktif) {
    return <DiagramTypePicker kind={kind} />;
  }

  const tur = k.getType(aktif.type);
  const TurIkonu = tur.icon;
  // Şemaya el değmemiş mi? Aynı ölçü depoda da var (bkz. diagramOps): örnek
  // şablon yalnızca bu haldeki şemaya yükleniyor.
  const elDegmemis = aktif.edges.length === 0 && aktif.nodes.length <= 1;

  return (
    <DiagramEditingContext.Provider value={duzenleme}>
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

          {/* Kutuları düzene sokan düğme. Yazısı seçime göre değişiyor: aynı
              düğmenin iki ayrı iş yaptığı yoksa hiç anlaşılmıyor. Boş şemada
              hizalanacak bir şey yok, düğme de çıkmıyor. */}
          {aktif.nodes.length > 0 && (
            <button
              onClick={hizala}
              className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={t(seciliVar ? 'diagram_autolayout_selected' : 'diagram_autolayout')}
            >
              <LayoutGrid size={16} className="text-indigo-500" />
              <span>{t(seciliVar ? 'diagram_autolayout_selected' : 'diagram_autolayout')}</span>
            </button>
          )}

          {/* Kesik çizgili ikincil hattı olan türlerde bunun nasıl çizileceği
              kendiliğinden anlaşılmıyor; küçük bir ipucu bırakılıyor. */}
          {tur.secondaryEdge && k.text.secondaryHint && (
            <p className="mt-2 max-w-[240px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400 shadow-sm">
              {t(k.text.secondaryHint)}
            </p>
          )}
        </Panel>

        <CanvasMiniMap nodeColor={(n) => k.getShape((n.data as any)?.shape).minimapColor} />

{/* El değmemiş şemada karşılama şeridi: ya kendin çizersin ya da hazır
            bir örnekle başlarsın. Yalnızca örneği olan araçta (akış şeması)
            çıkıyor; organizasyon şeması zaten dolu bir iskeletle açılıyor. */}
        {loadExample && elDegmemis && !karsilamaKapandi ? (
          <Panel position="top-center" style={{ marginTop: 96 }}>
            <CanvasKarsilama
              simge={<TurIkonu size={18} />}
              baslik={t('flowchart_empty')}
              aciklama={t('flowchart_empty_hint')}
              birincil={{ etiket: t('start_from_scratch'), onClick: () => setKarsilamaKapandi(true) }}
              ikincil={{ etiket: t('load_example'), onClick: ornekYukle }}
              onKapat={() => setKarsilamaKapandi(true)}
            />
          </Panel>
        ) : aktif.nodes.length === 0 && (
          /* Şema bomboşsa eklemeyi başlatacak bir kutu da yok; şerit ortada
             duruyor, seçilen şekil ilk kutu oluyor. */
          <Panel position="top-center" style={{ marginTop: 96 }}>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t(k.text.addBox)}</p>
              <DiagramShapeStrip
                kind={kind}
                chartType={aktif.type}
                onSec={(sekil, ad) => {
                  const yeniId = addNode(null, sekil, ad, { x: 0, y: 0 });
                  setEditingId(yeniId);
                }}
              />
            </div>
          </Panel>
        )}
      </ReactFlow>

      {menu && aktif.nodes.some((n) => n.id === menu.id) && (
        <DiagramContextMenu
          key={menu.id}
          kind={kind}
          x={menu.left}
          y={menu.top}
          node={aktif.nodes.find((n) => n.id === menu.id)!}
          onClose={() => setMenu(null)}
          // Menüdeki "Düzenle" de çift tıklamayla aynı yere çıkıyor: yazı
          // kutunun içinde düzenleniyor, menü kapanıyor.
          onEdit={() => {
            setMenu(null);
            setEditingId(menu.id);
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
    </DiagramEditingContext.Provider>
  );
}

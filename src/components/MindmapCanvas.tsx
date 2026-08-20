import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Panel,
  useReactFlow
} from '@xyflow/react';
import type { Edge, NodeChange, NodeMouseHandler } from '@xyflow/react';
import type { MindmapNode as MindmapNodeTipi } from '../store/useRoadmapStore';
import '@xyflow/react/dist/style.css';
import { Brain } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { getActiveMindmap, getMindmapDescendants, getMindmapRoot } from '../store/slices/createMindmapSlice';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import MindmapNode from './MindmapNode';
import MindmapContextMenu from './MindmapContextMenu';
import MindmapMapsMenu from './MindmapMapsMenu';
import { DAL_RENKLERI, mindmapYerlesimi } from '../utils/mindmapLayout';
import CanvasMiniMap from './CanvasMiniMap';
import CanvasControls from './CanvasControls';
import CanvasKarsilama from './CanvasKarsilama';

const nodeTypes = {
  mindmapNode: MindmapNode,
};

const BOS_DUGUMLER: MindmapNodeTipi[] = [];
const BOS_KENARLAR: Edge[] = [];

export default function MindmapCanvas() {
  const { t } = useTranslation();
  const {
    mindmaps, activeMindmapId, onMindmapNodesChange, onMindmapEdgesChange,
    addMindmap, addMindmapChild, addMindmapSibling, deleteMindmapNode, toggleMindmapCollapse,
    setMindmapEditingLabel, setMindmapDescriptionId, toggleMindmapDone, setMindmapSelected,
    toggleMindmapHideDone, moveMindmapNode, resetMindmapLayout
  } = useRoadmapStore(useShallow((s) => ({
    mindmaps: s.mindmaps,
    activeMindmapId: s.activeMindmapId,
    mindmapSelectedId: s.mindmapSelectedId,
    onMindmapNodesChange: s.onMindmapNodesChange,
    onMindmapEdgesChange: s.onMindmapEdgesChange,
    addMindmap: s.addMindmap,
    addMindmapChild: s.addMindmapChild,
    addMindmapSibling: s.addMindmapSibling,
    deleteMindmapNode: s.deleteMindmapNode,
    toggleMindmapCollapse: s.toggleMindmapCollapse,
    setMindmapEditingLabel: s.setMindmapEditingLabel,
    setMindmapDescriptionId: s.setMindmapDescriptionId,
    toggleMindmapDone: s.toggleMindmapDone,
    setMindmapSelected: s.setMindmapSelected,
    toggleMindmapHideDone: s.toggleMindmapHideDone,
    moveMindmapNode: s.moveMindmapNode,
    resetMindmapLayout: s.resetMindmapLayout
  })));

  // Bir projede birden çok harita olabiliyor; kanvas hep açık olanı çiziyor.
  const aktifHarita = getActiveMindmap({ mindmaps, activeMindmapId });
  // Sabit boş diziler: her render'da yenisi üretilirse aşağıdaki useMemo'lar
  // boşuna yeniden hesaplanır.
  const mindmapNodes = aktifHarita?.nodes ?? BOS_DUGUMLER;
  const mindmapEdges = aktifHarita?.edges ?? BOS_KENARLAR;

  const { fitView } = useReactFlow();
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  // "İlk dalı ekle" şeridi kapatılabilsin; harita zaten açık, kullanıcı
  // dalı klavyeden de ekleyebiliyor.
  const [karsilamaKapandi, setKarsilamaKapandi] = useState(false);

  // Harita değişince yeni haritanın tamamı ekrana sığsın; yoksa öncekinin
  // kamera konumu kalıyor ve kullanıcı boş bir alana bakıyor.
  const aktifHaritaId = aktifHarita?.id;
  useEffect(() => {
    if (!aktifHaritaId) return;
    const zaman = setTimeout(() => fitView({ duration: 300, padding: 0.25 }), 60);
    return () => clearTimeout(zaman);
  }, [aktifHaritaId, fitView]);

  // Daraltılmış dalların ve gizlenmiş biten dalların altı hiç çizilmiyor.
  const gorunur = useMemo(() => {
    const kok = getMindmapRoot(mindmapNodes, mindmapEdges);
    if (!kok) return { nodes: [], edges: [] };
    const kutular = new Map(mindmapNodes.map((n) => [n.id, n]));
    const acikKimlikler = new Set<string>([kok.id]);
    const sira = [kok.id];
    while (sira.length > 0) {
      const su = sira.pop()!;
      const kutu = kutular.get(su);
      if (kutu?.data.collapsed) continue;
      mindmapEdges.filter((e) => e.source === su).forEach((e) => {
        const cocuk = kutular.get(e.target);
        if (!cocuk) return;
        // "Biteni gizle" açıksa tiklenmiş alt dal ve altındaki her şey çizilmiyor.
        if (kutu?.data.hideDone && cocuk.data.done) return;
        acikKimlikler.add(e.target);
        sira.push(e.target);
      });
    }
    return {
      nodes: mindmapNodes.filter((n) => acikKimlikler.has(n.id)),
      edges: mindmapEdges.filter((e) => acikKimlikler.has(e.source) && acikKimlikler.has(e.target))
    };
  }, [mindmapNodes, mindmapEdges]);

  const yerlesim = useMemo(() => mindmapYerlesimi(gorunur.nodes, gorunur.edges), [gorunur]);

  const kutuHaritasi = useMemo(() => new Map(mindmapNodes.map((n) => [n.id, n])), [mindmapNodes]);

  /**
   * Elle taşıma payları. Pay kökten aşağı toplanarak iniyor: bir dal
   * taşındığında altındaki her şey onunla birlikte kayıyor, dal bütün kalıyor.
   */
  const kaydirmalar = useMemo(() => {
    const sonuc = new Map<string, { x: number; y: number }>();
    const kokId = getMindmapRoot(gorunur.nodes, gorunur.edges)?.id;
    if (!kokId) return sonuc;
    const kutular = new Map(gorunur.nodes.map((n) => [n.id, n]));
    const sira = [{ id: kokId, x: 0, y: 0 }];
    while (sira.length > 0) {
      const su = sira.pop()!;
      const veri = kutular.get(su.id)?.data;
      const x = su.x + (veri?.dx ?? 0);
      const y = su.y + (veri?.dy ?? 0);
      sonuc.set(su.id, { x, y });
      gorunur.edges.filter((e) => e.source === su.id).forEach((e) => sira.push({ id: e.target, x, y }));
    }
    return sonuc;
  }, [gorunur]);

  /**
   * Süren sürükleme. Kutuların yeri depodan değil yerleşimden geldiği için
   * React Flow'un kendi konum değişimleri yok sayılıyor; sürüklenen kutu ile
   * altındaki dallar bu geçici durumdan çiziliyor. Depoya ancak fare
   * bırakıldığında tek bir kayıt yazılıyor, yoksa her fare kıpırtısı geçmişe
   * ve buluta ayrı bir değişiklik olarak giderdi.
   */
  type Surukleme = {
    id: string;
    taban: { x: number; y: number };
    su: { x: number; y: number };
    yalnizKendisi: boolean;
    altlar: Set<string>;
  };
  const [surukleme, setSurukleme] = useState<Surukleme | null>(null);
  // Aynı değerin ref'i: sürükleme biterken güncel durum okunacak, state'in
  // güncelleyicisi içinde depoya yazmak StrictMode'da iki kez çalışırdı.
  const suruklemeRef = useRef<Surukleme | null>(null);
  const suruklemeYaz = useCallback((yeni: Surukleme | null) => {
    suruklemeRef.current = yeni;
    setSurukleme(yeni);
  }, []);

  // Ctrl (Mac'te Cmd) basılıyken yalnızca tutulan kutu kayıyor, alt dalları
  // yerinde kalıyor. Mac'te Ctrl+tık sağ tık sayıldığı için orada Cmd geçerli.
  // Dokunmatikte değiştirici tuş yok; orada dal hep bütün taşınıyor.
  const yalnizKendisiMi = (e: MouseEvent | TouchEvent) => 'ctrlKey' in e && (e.ctrlKey || e.metaKey);

  // Sürükleme işleyicileri React Flow'un kendi düğüm tipini bekliyor; burada
  // yalnız kimlik ve konum kullanıldığı için dar bir tip yeterli.
  type SuruklenenKutu = { id: string; position: { x: number; y: number } };

  const onNodeDragStart = useCallback((e: MouseEvent | TouchEvent, node: SuruklenenKutu) => {
    setMenu(null);
    suruklemeYaz({
      id: node.id,
      taban: { x: node.position.x, y: node.position.y },
      su: { x: node.position.x, y: node.position.y },
      yalnizKendisi: yalnizKendisiMi(e),
      altlar: new Set(getMindmapDescendants(node.id, mindmapEdges))
    });
  }, [mindmapEdges, suruklemeYaz]);

  const onNodeDrag = useCallback((e: MouseEvent | TouchEvent, node: SuruklenenKutu) => {
    const su = suruklemeRef.current;
    if (!su || su.id !== node.id) return;
    suruklemeYaz({ ...su, su: { x: node.position.x, y: node.position.y }, yalnizKendisi: yalnizKendisiMi(e) });
  }, [suruklemeYaz]);

  const onNodeDragStop = useCallback((e: MouseEvent | TouchEvent, node: SuruklenenKutu) => {
    const durum = suruklemeRef.current;
    suruklemeYaz(null);
    if (!durum || durum.id !== node.id) return;
    const farkX = node.position.x - durum.taban.x;
    const farkY = node.position.y - durum.taban.y;
    // Sürüklemeden sayılmayacak kadar küçük oynamalar yazılmıyor: tıklamak
    // isteyen kullanıcının eli titrediğinde harita kaymasın.
    if (Math.abs(farkX) < 1 && Math.abs(farkY) < 1) return;
    const veri = kutuHaritasi.get(node.id)?.data;
    moveMindmapNode(node.id, (veri?.dx ?? 0) + farkX, (veri?.dy ?? 0) + farkY, yalnizKendisiMi(e) || durum.yalnizKendisi);
  }, [kutuHaritasi, moveMindmapNode, suruklemeYaz]);

  // Konum değişimleri depoya yazılmıyor: kutuların yeri yerleşimden geliyor,
  // sürükleme ayrıca kaydırma payı olarak saklanıyor (yukarıda).
  const nodesChange = useCallback((changes: NodeChange[]) => {
    const kalan = changes.filter((c) => c.type !== 'position');
    if (kalan.length > 0) onMindmapNodesChange(kalan);
  }, [onMindmapNodesChange]);

  const cizilecekNodes = useMemo(() => gorunur.nodes.map((n) => {
    const yer = yerlesim.get(n.id);
    const kaydirma = kaydirmalar.get(n.id);
    // Daralt düğmesi görünen çocuklara bakıyor: hepsi "biteni gizle" ile
    // gizlendiyse daraltacak bir şey kalmıyor. Daraltılmışken görünen çocuk
    // zaten olmadığı için orada bütün dallara bakılıyor, yoksa düğme kaybolur
    // ve dal bir daha açılamazdı.
    const cocukVar = n.data.collapsed
      ? mindmapEdges.some((e) => e.source === n.id)
      : gorunur.edges.some((e) => e.source === n.id);
    // Gizle düğmesi yalnızca gizlenecek bir şey varsa çiziliyor; yoksa her
    // kutunun yanında işlevsiz bir düğme dururdu.
    const bitmisCocukVar = mindmapEdges.some((e) => e.source === n.id && kutuHaritasi.get(e.target)?.data.done);

    let x = (yer?.x ?? 0) + (kaydirma?.x ?? 0);
    let y = (yer?.y ?? 0) + (kaydirma?.y ?? 0);
    if (surukleme) {
      if (surukleme.id === n.id) {
        // Sürüklenen kutu React Flow'un verdiği yerde duruyor; aynı değeri geri
        // vermezsek kutu farenin altından kaçıyor.
        x = surukleme.su.x;
        y = surukleme.su.y;
      } else if (!surukleme.yalnizKendisi && surukleme.altlar.has(n.id)) {
        x += surukleme.su.x - surukleme.taban.x;
        y += surukleme.su.y - surukleme.taban.y;
      }
    }

    return {
      ...n,
      position: { x, y },
      data: { ...n.data, derinlik: yer?.derinlik ?? 0, taraf: yer?.taraf ?? 1, cocukVar, bitmisCocukVar }
    };
  }), [gorunur, yerlesim, kaydirmalar, mindmapEdges, kutuHaritasi, surukleme]);

  const cizilecekEdges = useMemo(() => gorunur.edges.map((e) => {
    const hedef = gorunur.nodes.find((n) => n.id === e.target);
    const derinlik = yerlesim.get(e.target)?.derinlik ?? 1;
    const renk = DAL_RENKLERI[(hedef?.data.branch ?? 0) % DAL_RENKLERI.length];
    // Kök hem sağa hem sola dal attığı için, kaynak kökse hangi taraf handle'ı
    // kullanılacağı hedefin hangi yanda durduğuna göre seçiliyor.
    const kaynakKok = (yerlesim.get(e.source)?.derinlik ?? 1) === 0;
    const hedefTaraf = yerlesim.get(e.target)?.taraf ?? 1;
    return {
      ...e,
      type: 'default' as const,
      sourceHandle: kaynakKok ? (hedefTaraf === 1 ? 'right' : 'left') : undefined,
      style: { stroke: renk, strokeWidth: Math.max(1.5, 4 - derinlik) },
      selectable: false
    };
  }), [gorunur, yerlesim]);

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setMindmapSelected(node.id);
    setMenu(null);
  }, [setMindmapSelected]);

  const onPaneClick = useCallback(() => {
    setMindmapSelected(null);
    setMenu(null);
    setMindmapEditingLabel(null);
    setMindmapDescriptionId(null);
  }, [setMindmapEditingLabel, setMindmapDescriptionId, setMindmapSelected]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: MindmapNodeTipi) => {
    // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor:
    // kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü değil.
    if (metinAlaninda(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    setMindmapSelected(node.id);
    setMenu({ id: node.id, top: event.clientY, left: event.clientX });
  }, [setMindmapSelected]);

  // Klavyeyle büyüme: zihin haritasının asıl çalışma biçimi bu.
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      const hedef = e.target as HTMLElement;
      if (hedef.tagName === 'INPUT' || hedef.tagName === 'TEXTAREA' || hedef.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Kılavuz artık yan panel: açıkken de harita çizilebiliyor. Sadece odak
      // panelin içindeyken tuşlar haritaya gitmemeli.
      if (hedef.closest('[data-tool-guide]')) return;

      const durum = useRoadmapStore.getState();
      const harita = getActiveMindmap(durum);
      if (!harita) return;
      const kok = getMindmapRoot(harita.nodes, harita.edges);
      const aktif = durum.mindmapSelectedId || kok?.id;
      if (!aktif) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        const yeni = durum.addMindmapChild(aktif, t('mindmap_new_node'));
        if (yeni) { durum.setMindmapSelected(yeni); durum.setMindmapEditingLabel(yeni); }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const yeni = durum.addMindmapSibling(aktif, t('mindmap_new_node'));
        if (yeni) { durum.setMindmapSelected(yeni); durum.setMindmapEditingLabel(yeni); }
      } else if (e.key === 'F2') {
        e.preventDefault();
        durum.setMindmapEditingLabel(aktif);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (kok?.id === aktif) return;
        e.preventDefault();
        durum.deleteMindmapNode(aktif);
      }
    };
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [t]);

  const kok = getMindmapRoot(mindmapNodes, mindmapEdges);

  return (
    <div className="flex-1 h-full w-full relative transition-colors bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={cizilecekNodes}
        edges={cizilecekEdges}
        onNodesChange={nodesChange}
        onEdgesChange={onMindmapEdgesChange}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onMoveStart={() => setMenu(null)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.1}
        deleteKeyCode={null}
        // Ctrl/Cmd sürüklemede kullanılıyor, Shift'in de haritada bir işi yok:
        // React Flow'un çoklu seçimi araya girmesin.
        multiSelectionKeyCode={null}
        selectionKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasBackdrop />

        {/* Zoom paneli kaldırıldı: sol altta kısayol ipucunun üstüne biniyordu
            ve zihin haritası zaten açılışta kendini sığdırıyor. Yakınlaştırma
            tekerlekle, mobilde iki parmakla yapılıyor. */}

        {/* Harita menüsü. React Flow'un kendi stil dosyası panele margin
            veriyor ve Tailwind sınıfı ona yeniliyor, o yüzden satır içi stil:
            geri al / ileri al düğmelerinin altına iniyor. */}
        {aktifHarita && (
          <Panel position="top-left" style={{ marginTop: 68 }}>
            <MindmapMapsMenu aktif={aktifHarita} />
          </Panel>
        )}

        {/* Bütün haritalar silinmişse kanvas boş kalır; buradan yenisi kurulur. */}
        {!aktifHarita && (
          <Panel position="top-center" className="mt-24">
            {/* Harita yokken kapatma yok: kapatılınca ekranda hiçbir şey
                kalmıyor ve kullanıcının harita açmak için tutunacağı yer
                olmuyor. */}
            <CanvasKarsilama
              simge={<Brain size={18} />}
              aciklama={t('mindmap_no_map_hint')}
              tema="purple"
              birincil={{
                etiket: t('mindmap_new_map'),
                onClick: () => addMindmap(t('mindmap_map_name_n', { sira: 1 }), t('mindmap_root'))
              }}
            />
          </Panel>
        )}

        {aktifHarita && mindmapNodes.length <= 1 && !karsilamaKapandi && (
          <Panel position="top-center" className="mt-24">
            <CanvasKarsilama
              simge={<Brain size={18} />}
              aciklama={t('mindmap_start_hint')}
              tema="purple"
              birincil={{
                etiket: t('mindmap_add_child'),
                onClick: () => {
                  if (!kok) return;
                  const yeni = addMindmapChild(kok.id, t('mindmap_new_node'));
                  if (yeni) { setMindmapSelected(yeni); setMindmapEditingLabel(yeni); }
                  setTimeout(() => fitView({ duration: 400, padding: 0.25 }), 60);
                }
              }}
              onKapat={() => setKarsilamaKapandi(true)}
            />
          </Panel>
        )}

        <CanvasControls />
        <CanvasMiniMap nodeColor={(n) => DAL_RENKLERI[((n.data as any)?.branch ?? 0) % DAL_RENKLERI.length]} />
      </ReactFlow>

      {menu && (
        <MindmapContextMenu
          x={menu.left}
          y={menu.top}
          nodeId={menu.id}
          kok={kok?.id === menu.id}
          cocukVar={mindmapEdges.some((e) => e.source === menu.id)}
          daraltilmis={!!mindmapNodes.find((n) => n.id === menu.id)?.data.collapsed}
          bitti={!!mindmapNodes.find((n) => n.id === menu.id)?.data.done}
          bitmisCocukVar={mindmapEdges.some((e) => e.source === menu.id && kutuHaritasi.get(e.target)?.data.done)}
          bitenGizli={!!mindmapNodes.find((n) => n.id === menu.id)?.data.hideDone}
          elleTasinmisVar={mindmapNodes.some((n) => n.data.dx !== undefined || n.data.dy !== undefined)}
          onClose={() => setMenu(null)}
          onAltDal={() => {
            const yeni = addMindmapChild(menu.id, t('mindmap_new_node'));
            if (yeni) { setMindmapSelected(yeni); setMindmapEditingLabel(yeni); }
            setMenu(null);
          }}
          onKardes={() => {
            const yeni = addMindmapSibling(menu.id, t('mindmap_new_node'));
            if (yeni) { setMindmapSelected(yeni); setMindmapEditingLabel(yeni); }
            setMenu(null);
          }}
          onDuzenle={() => { setMindmapEditingLabel(menu.id); setMenu(null); }}
          onAciklama={() => { setMindmapDescriptionId(menu.id); setMenu(null); }}
          onTikle={() => { toggleMindmapDone(menu.id); setMenu(null); }}
          onDaralt={() => { toggleMindmapCollapse(menu.id); setMenu(null); }}
          onBiteniGizle={() => { toggleMindmapHideDone(menu.id); setMenu(null); }}
          onYerlesimiSifirla={() => { resetMindmapLayout(); setMenu(null); }}
          onSil={() => { deleteMindmapNode(menu.id); setMenu(null); }}
        />
      )}
    </div>
  );
}

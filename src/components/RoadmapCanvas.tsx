import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlow, Panel, useReactFlow } from '@xyflow/react';
import type { Edge, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Route } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import {
  getActiveRoadmap, hattaMi, roadmapHatti, roadmapAltKonular
} from '../store/slices/createRoadmapSlice';
import type { RoadmapNode as RoadmapNodeTipi, RoadmapYon } from '../store/slices/createRoadmapSlice';
import { yolHaritasiYerlesimi } from '../utils/yolHaritasiYerlesimi';
import { roadmapOrnegi } from '../utils/roadmapOrnek';
import { metinAlaninda } from '../utils/metinAlaninda';
import CanvasBackdrop from './CanvasBackdrop';
import CanvasMiniMap from './CanvasMiniMap';
import CanvasKarsilama from './CanvasKarsilama';
import KarsilamaPaneli from './KarsilamaPaneli';
import RoadmapNode from './RoadmapNode';
import RoadmapMapsMenu from './RoadmapMapsMenu';
import RoadmapContextMenu from './RoadmapContextMenu';
import RoadmapDetayPaneli from './RoadmapDetayPaneli';
import RoadmapIlerlemeSeridi from './RoadmapIlerlemeSeridi';

const nodeTypes = { roadmapNode: RoadmapNode };

const BOS_DUGUMLER: RoadmapNodeTipi[] = [];
const BOS_KENARLAR: Edge[] = [];

const HAT_RENGI = '#84cc16';
const KONU_RENGI = '#94a3b8';

export default function RoadmapCanvas() {
  const { t } = useTranslation();
  const {
    roadmaps, activeRoadmapId, roadmapSelectedId, roadmapDetayId,
    onRoadmapNodesChange, onRoadmapEdgesChange, addRoadmap, addRoadmapStep, addRoadmapTopic,
    deleteRoadmapNode, setRoadmapStatus, toggleRoadmapSecmeli, toggleRoadmapCollapse,
    moveRoadmapStep, setRoadmapYon, replaceRoadmapContent, renameRoadmap,
    setRoadmapSelected, setRoadmapEditingLabel, setRoadmapDetayId
  } = useRoadmapStore(useShallow((s) => ({
    roadmaps: s.roadmaps,
    activeRoadmapId: s.activeRoadmapId,
    roadmapSelectedId: s.roadmapSelectedId,
    roadmapDetayId: s.roadmapDetayId,
    onRoadmapNodesChange: s.onRoadmapNodesChange,
    onRoadmapEdgesChange: s.onRoadmapEdgesChange,
    addRoadmap: s.addRoadmap,
    addRoadmapStep: s.addRoadmapStep,
    addRoadmapTopic: s.addRoadmapTopic,
    deleteRoadmapNode: s.deleteRoadmapNode,
    setRoadmapStatus: s.setRoadmapStatus,
    toggleRoadmapSecmeli: s.toggleRoadmapSecmeli,
    toggleRoadmapCollapse: s.toggleRoadmapCollapse,
    moveRoadmapStep: s.moveRoadmapStep,
    setRoadmapYon: s.setRoadmapYon,
    replaceRoadmapContent: s.replaceRoadmapContent,
    renameRoadmap: s.renameRoadmap,
    setRoadmapSelected: s.setRoadmapSelected,
    setRoadmapEditingLabel: s.setRoadmapEditingLabel,
    setRoadmapDetayId: s.setRoadmapDetayId
  })));

  const aktifHarita = getActiveRoadmap({ roadmaps, activeRoadmapId });
  const nodes = aktifHarita?.nodes ?? BOS_DUGUMLER;
  const edges = aktifHarita?.edges ?? BOS_KENARLAR;
  const yon: RoadmapYon = aktifHarita?.yon ?? 'dikey';

  const { fitView } = useReactFlow();
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const [karsilamaKapandi, setKarsilamaKapandi] = useState(false);

  // Harita ya da yön değişince yeni şekil ekrana sığsın; yoksa öncekinin
  // kamera konumu kalıyor ve kullanıcı boş bir alana bakıyor. Yön değişimi
  // özellikle önemli: dikeyden yataya geçen harita bambaşka bir yerde çıkıyor.
  const aktifHaritaId = aktifHarita?.id;
  useEffect(() => {
    if (!aktifHaritaId) return;
    const zaman = setTimeout(() => fitView({ duration: 300, padding: 0.2 }), 60);
    return () => clearTimeout(zaman);
  }, [aktifHaritaId, yon, fitView]);

  // Kapalı durakların altındaki konular hiç çizilmiyor.
  const gorunur = useMemo(() => {
    const kapali = nodes.filter((n) => n.data.collapsed);
    if (kapali.length === 0) return { nodes, edges };
    const gizli = new Set<string>();
    kapali.forEach((n) => roadmapAltKonular(n.id, nodes, edges).forEach((id) => gizli.add(id)));
    return {
      nodes: nodes.filter((n) => !gizli.has(n.id)),
      edges: edges.filter((e) => !gizli.has(e.source) && !gizli.has(e.target))
    };
  }, [nodes, edges]);

  const yerlesim = useMemo(
    () => yolHaritasiYerlesimi(gorunur.nodes, gorunur.edges, yon),
    [gorunur, yon]
  );

  const cizilecekNodes = useMemo(() => gorunur.nodes.map((n) => {
    const yer = yerlesim.get(n.id);
    const cocukVar = edges.some((e) => e.source === n.id && nodes.find((k) => k.id === e.target)?.data.tur === 'konu');
    return {
      ...n,
      position: yer ? { x: yer.x, y: yer.y } : { x: 0, y: 0 },
      // Kutular elle taşınmıyor: harita her değişiklikten sonra kendini diziyor.
      draggable: false,
      selected: n.id === roadmapSelectedId,
      data: { ...n.data, derinlik: yer?.derinlik ?? 0, hatTarafi: yer?.taraf ?? 1, cocukVar, yon }
    };
  }), [gorunur.nodes, yerlesim, edges, nodes, roadmapSelectedId, yon]);

  const cizilecekEdges = useMemo(() => {
    const kutular = new Map(gorunur.nodes.map((n) => [n.id, n]));
    const dikey = yon === 'dikey';

    return gorunur.edges.map((e) => {
      const hedef = kutular.get(e.target);
      const kaynak = kutular.get(e.source);
      if (!hedef || !kaynak) return { ...e, type: 'smoothstep' as const, selectable: false };

      const hatKenari = hattaMi(hedef) && hattaMi(kaynak);
      const hedefYer = yerlesim.get(e.target);
      const taraf = hedefYer?.taraf ?? 1;
      const bitmis = hedef.data.durum === 'bitti' || hedef.data.durum === 'atlandi';

      // Tutamak seçimi dizilimi izliyor (bkz. yolHaritasiYerlesimi):
      // dikeyde konular hattın yanına, yatayda durağın altına asılıyor; alt
      // konular ise iki yönde de yana doğru büyüyor.
      let sourceHandle: string;
      let targetHandle: string;
      if (hatKenari) {
        sourceHandle = dikey ? 'kaynak-alt' : 'kaynak-sag';
        targetHandle = dikey ? 'hedef-ust' : 'hedef-sol';
      } else if (dikey) {
        sourceHandle = taraf === 1 ? 'kaynak-sag' : 'kaynak-sol';
        targetHandle = taraf === 1 ? 'hedef-sol' : 'hedef-sag';
      } else if ((hedefYer?.derinlik ?? 1) === 1) {
        // Hattan aşağı (ya da yukarı) inen ilk bağlantı.
        sourceHandle = taraf === 1 ? 'kaynak-alt' : 'kaynak-ust';
        targetHandle = 'hedef-sol';
      } else {
        sourceHandle = 'kaynak-sag';
        targetHandle = 'hedef-sol';
      }

      return {
        ...e,
        type: 'smoothstep' as const,
        sourceHandle,
        targetHandle,
        selectable: false,
        style: {
          stroke: hatKenari ? HAT_RENGI : KONU_RENGI,
          strokeWidth: hatKenari ? 3 : 2,
          // Seçmeli konu kesik çizgiyle bağlanıyor; roadmap.sh'teki ayrımın eşi.
          strokeDasharray: hedef.data.secmeli ? '6 5' : undefined,
          opacity: bitmis ? 0.45 : 1
        }
      };
    });
  }, [gorunur, yerlesim, yon]);

  const hat = useMemo(() => roadmapHatti(nodes, edges), [nodes, edges]);
  const seciliKutu = nodes.find((n) => n.id === roadmapSelectedId);
  const detayKutusu = nodes.find((n) => n.id === roadmapDetayId);

  /** Yeni kutu eklendikten sonra seçilip adı yazılmaya hazır hale gelsin. */
  const yeniyeGec = useCallback((id: string | null) => {
    if (!id) return;
    setRoadmapSelected(id);
    setRoadmapEditingLabel(id);
    setTimeout(() => fitView({ duration: 300, padding: 0.2 }), 80);
  }, [setRoadmapSelected, setRoadmapEditingLabel, fitView]);

  /** Yeni durak: seçili kutu hattaysa onun ardına, değilse hattın sonuna. */
  const durakEkle = useCallback((tur: 'adim' | 'bolum' = 'adim') => {
    const hedef = seciliKutu && hattaMi(seciliKutu) ? seciliKutu.id : undefined;
    yeniyeGec(addRoadmapStep(t(tur === 'bolum' ? 'roadmap_new_section' : 'roadmap_new_step'), tur, hedef));
  }, [seciliKutu, addRoadmapStep, yeniyeGec, t]);

  /** Yeni yan konu: seçili kutunun altına. */
  const konuEkle = useCallback((parentId?: string) => {
    const hedef = parentId || seciliKutu?.id || hat[hat.length - 1]?.id;
    if (!hedef) return;
    yeniyeGec(addRoadmapTopic(hedef, t('roadmap_new_topic')));
  }, [seciliKutu, hat, addRoadmapTopic, yeniyeGec, t]);

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setRoadmapSelected(node.id);
    setMenu(null);
    // Panel bir kez açıldıysa tıklanan kutuyu izliyor: kullanıcı haritada
    // gezinirken her kutu için paneli yeniden açmak zorunda kalmasın.
    if (roadmapDetayId) setRoadmapDetayId(node.id);
  }, [setRoadmapSelected, setRoadmapDetayId, roadmapDetayId]);

  const onPaneClick = useCallback(() => {
    setRoadmapSelected(null);
    setMenu(null);
    setRoadmapEditingLabel(null);
    setRoadmapDetayId(null);
  }, [setRoadmapSelected, setRoadmapEditingLabel, setRoadmapDetayId]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: { id: string }) => {
    // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor.
    if (metinAlaninda(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    setRoadmapSelected(node.id);
    setMenu({ id: node.id, top: event.clientY, left: event.clientX });
  }, [setRoadmapSelected]);

  // Klavyeyle büyüme: haritayı hızlı kuran yol bu.
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      const hedef = e.target as HTMLElement;
      if (hedef.tagName === 'INPUT' || hedef.tagName === 'TEXTAREA' || hedef.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // closest'a soru işaretiyle: olayın hedefi her zaman bir element olmuyor
      // (odakta hiçbir şey yokken document'a düşebiliyor).
      if (hedef?.closest?.('[data-tool-guide]')) return;

      const durum = useRoadmapStore.getState();
      const harita = getActiveRoadmap(durum);
      if (!harita) return;
      const sira = roadmapHatti(harita.nodes, harita.edges);
      const aktifId = durum.roadmapSelectedId || sira[sira.length - 1]?.id;
      const aktif = harita.nodes.find((n) => n.id === aktifId);
      if (!aktif) return;

      const sec = (id: string | null) => {
        if (!id) return;
        durum.setRoadmapSelected(id);
        durum.setRoadmapEditingLabel(id);
      };

      if (e.key === 'Tab') {
        e.preventDefault();
        if (aktif.data.tur === 'bolum') return;
        sec(durum.addRoadmapTopic(aktif.id, t('roadmap_new_topic')));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (hattaMi(aktif)) {
          sec(durum.addRoadmapStep(t('roadmap_new_step'), 'adim', aktif.id));
        } else {
          // Yan konuda Enter kardeş konu açar; üstü kim ise ona asılıyor.
          const ustu = harita.edges.find((k) => k.target === aktif.id)?.source;
          if (ustu) sec(durum.addRoadmapTopic(ustu, t('roadmap_new_topic')));
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        durum.setRoadmapEditingLabel(aktif.id);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Hattaki tek kutu silinmiyor; harita tutunacak hiçbir kutusu
        // olmadan boş kalırdı.
        if (hattaMi(aktif) && sira.length <= 1) return;
        e.preventDefault();
        durum.deleteRoadmapNode(aktif.id);
      }
    };
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [t]);

  const menuKutusu = menu ? nodes.find((n) => n.id === menu.id) : undefined;
  const menuHatSirasi = menuKutusu && hattaMi(menuKutusu) ? hat.findIndex((n) => n.id === menuKutusu.id) : -1;

  const ornegiYukle = () => {
    const ornek = roadmapOrnegi();
    replaceRoadmapContent(ornek.nodes, ornek.edges);
    if (aktifHarita) renameRoadmap(aktifHarita.id, ornek.ad);
    setKarsilamaKapandi(true);
    setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 80);
  };

  return (
    <div className="relative h-full w-full flex-1 bg-slate-50 transition-colors dark:bg-slate-900">
      <ReactFlow
        nodes={cizilecekNodes}
        edges={cizilecekEdges}
        onNodesChange={onRoadmapNodesChange}
        onEdgesChange={onRoadmapEdgesChange}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={() => setMenu(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasBackdrop />

        {/* Harita menüsü ve ilerleme şeridi TEK panelde, alt alta.
            İkisi ayrı Panel'ken şerit sonra çiziliyordu ve menünün açılır
            listesi onun altında kalıyordu; katman sırası artık burada, kendi
            aralarında belli. Satır içi marginTop, React Flow'un panele verdiği
            kendi boşluk kuralını geçmek için (Tailwind'in mt-* sınıfını o kural
            eziyor). */}
        {aktifHarita && (
          <Panel position="top-left" style={{ marginTop: 68 }}>
            <div className="flex flex-col items-start gap-2">
              <div className="relative z-20">
                <RoadmapMapsMenu aktif={aktifHarita} />
              </div>
              <div className="relative z-10">
                <RoadmapIlerlemeSeridi
                  harita={aktifHarita}
                  onYonDegistir={() => setRoadmapYon(yon === 'dikey' ? 'yatay' : 'dikey')}
                />
              </div>
            </div>
          </Panel>
        )}

        {/* Bütün haritalar silinmişse kanvas boş kalır; buradan yenisi kurulur. */}
        {!aktifHarita && (
          <KarsilamaPaneli ekBosluk={52}>
            <CanvasKarsilama
              simge={<Route size={18} />}
              aciklama={t('roadmap_no_map_hint')}
              birincil={{
                etiket: t('roadmap_new_map'),
                onClick: () => addRoadmap(t('roadmap_map_name_n', { sira: 1 }), t('roadmap_first_step'))
              }}
            />
          </KarsilamaPaneli>
        )}

        {aktifHarita && nodes.length <= 1 && !karsilamaKapandi && (
          <KarsilamaPaneli ekBosluk={52}>
            <CanvasKarsilama
              simge={<Route size={18} />}
              aciklama={t('roadmap_start_hint')}
              birincil={{ etiket: t('roadmap_add_step'), onClick: () => durakEkle('adim') }}
              ikincil={{ etiket: t('roadmap_load_example'), onClick: ornegiYukle }}
              onKapat={() => setKarsilamaKapandi(true)}
            />
          </KarsilamaPaneli>
        )}

        <CanvasMiniMap nodeColor={(n) => ((n.data as { tur?: string })?.tur === 'konu' ? KONU_RENGI : HAT_RENGI)} />
      </ReactFlow>

      {detayKutusu && (
        <RoadmapDetayPaneli node={detayKutusu} onClose={() => setRoadmapDetayId(null)} />
      )}

      {menu && menuKutusu && (
        <RoadmapContextMenu
          x={menu.left}
          y={menu.top}
          veri={menuKutusu.data}
          yon={yon}
          ilkHatKutusu={menuHatSirasi === 0}
          sonHatKutusu={menuHatSirasi === hat.length - 1}
          cocukVar={edges.some((e) => e.source === menu.id && nodes.find((k) => k.id === e.target)?.data.tur === 'konu')}
          onClose={() => setMenu(null)}
          onDurum={(durum) => { setRoadmapStatus(menu.id, durum); setMenu(null); }}
          onSonrakiDurak={() => { yeniyeGec(addRoadmapStep(t('roadmap_new_step'), 'adim', menu.id)); setMenu(null); }}
          onBolum={() => { yeniyeGec(addRoadmapStep(t('roadmap_new_section'), 'bolum', menu.id)); setMenu(null); }}
          onYanKonu={() => { konuEkle(menu.id); setMenu(null); }}
          onTasi={(taraf) => { moveRoadmapStep(menu.id, taraf); setMenu(null); }}
          onDuzenle={() => { setRoadmapEditingLabel(menu.id); setMenu(null); }}
          onDetay={() => { setRoadmapDetayId(menu.id); setMenu(null); }}
          onSecmeli={() => { toggleRoadmapSecmeli(menu.id); setMenu(null); }}
          onDaralt={() => { toggleRoadmapCollapse(menu.id); setMenu(null); }}
          onSil={() => { deleteRoadmapNode(menu.id); setMenu(null); }}
        />
      )}
    </div>
  );
}

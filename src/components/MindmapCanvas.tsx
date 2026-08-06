import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Background,
  MiniMap,
  Panel,
  useReactFlow
} from '@xyflow/react';
import type { Edge, NodeMouseHandler } from '@xyflow/react';
import type { MindmapNode as MindmapNodeTipi } from '../store/useRoadmapStore';
import '@xyflow/react/dist/style.css';
import { Brain } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { getActiveMindmap, getMindmapRoot } from '../store/slices/createMindmapSlice';
import { useTheme } from '../theme';
import MindmapNode from './MindmapNode';
import MindmapContextMenu from './MindmapContextMenu';
import MindmapMapsMenu from './MindmapMapsMenu';
import { DAL_RENKLERI, mindmapYerlesimi } from '../utils/mindmapLayout';

const nodeTypes = {
  mindmapNode: MindmapNode,
};

const BOS_DUGUMLER: MindmapNodeTipi[] = [];
const BOS_KENARLAR: Edge[] = [];

export default function MindmapCanvas() {
  const themeColors = useTheme();
  const { t } = useTranslation();
  const {
    mindmaps, activeMindmapId, onMindmapNodesChange, onMindmapEdgesChange,
    addMindmap, addMindmapChild, addMindmapSibling, deleteMindmapNode, toggleMindmapCollapse,
    setMindmapEditingLabel, setMindmapDescriptionId, toggleMindmapDone, setMindmapSelected
  } = useRoadmapStore(useShallow((s) => ({
    mindmaps: s.mindmaps,
    activeMindmapId: s.activeMindmapId,
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
    setMindmapSelected: s.setMindmapSelected
  })));

  // Bir projede birden çok harita olabiliyor; kanvas hep açık olanı çiziyor.
  const aktifHarita = getActiveMindmap({ mindmaps, activeMindmapId });
  // Sabit boş diziler: her render'da yenisi üretilirse aşağıdaki useMemo'lar
  // boşuna yeniden hesaplanır.
  const mindmapNodes = aktifHarita?.nodes ?? BOS_DUGUMLER;
  const mindmapEdges = aktifHarita?.edges ?? BOS_KENARLAR;

  const { fitView } = useReactFlow();
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);

  // Harita değişince yeni haritanın tamamı ekrana sığsın; yoksa öncekinin
  // kamera konumu kalıyor ve kullanıcı boş bir alana bakıyor.
  const aktifHaritaId = aktifHarita?.id;
  useEffect(() => {
    if (!aktifHaritaId) return;
    const zaman = setTimeout(() => fitView({ duration: 300, padding: 0.25 }), 60);
    return () => clearTimeout(zaman);
  }, [aktifHaritaId, fitView]);

  // Daraltılmış dalların altı hiç çizilmiyor.
  const gorunur = useMemo(() => {
    const kok = getMindmapRoot(mindmapNodes, mindmapEdges);
    if (!kok) return { nodes: [], edges: [] };
    const kutular = new Map(mindmapNodes.map((n) => [n.id, n]));
    const acikKimlikler = new Set<string>([kok.id]);
    const sira = [kok.id];
    while (sira.length > 0) {
      const su = sira.pop()!;
      if (kutular.get(su)?.data.collapsed) continue;
      mindmapEdges.filter((e) => e.source === su).forEach((e) => {
        if (!kutular.has(e.target)) return;
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

  const cizilecekNodes = useMemo(() => gorunur.nodes.map((n) => {
    const yer = yerlesim.get(n.id);
    const cocukVar = mindmapEdges.some((e) => e.source === n.id);
    return {
      ...n,
      position: yer ? { x: yer.x, y: yer.y } : { x: 0, y: 0 },
      // Kutular elle taşınmıyor: zihin haritası her zaman kendini diziyor.
      draggable: false,
      data: { ...n.data, derinlik: yer?.derinlik ?? 0, taraf: yer?.taraf ?? 1, cocukVar }
    };
  }), [gorunur.nodes, yerlesim, mindmapEdges]);

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

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
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
        onNodesChange={onMindmapNodesChange}
        onEdgesChange={onMindmapEdgesChange}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={() => setMenu(null)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.1}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={themeColors.canvasDot} gap={24} size={2} />

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
            <div className="max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-6 text-center shadow-2xl">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                <Brain size={24} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('mindmap_no_map_hint')}</p>
              <button
                onClick={() => addMindmap(t('mindmap_map_name_n', { sira: 1 }), t('mindmap_root'))}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-700"
              >
                {t('mindmap_new_map')}
              </button>
            </div>
          </Panel>
        )}

        {aktifHarita && mindmapNodes.length <= 1 && (
          <Panel position="top-center" className="mt-24">
            <div className="max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-6 text-center shadow-2xl">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                <Brain size={24} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('mindmap_start_hint')}</p>
              <button
                onClick={() => {
                  if (!kok) return;
                  const yeni = addMindmapChild(kok.id, t('mindmap_new_node'));
                  if (yeni) { setMindmapSelected(yeni); setMindmapEditingLabel(yeni); }
                  setTimeout(() => fitView({ duration: 400, padding: 0.25 }), 60);
                }}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-700"
              >
                {t('mindmap_add_child')}
              </button>
            </div>
          </Panel>
        )}

        <MiniMap zoomable pannable position="bottom-right"
          className="!w-40 !h-40 !rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-2xl dark:bg-slate-800 bg-white"
          nodeColor={(n) => DAL_RENKLERI[((n.data as any)?.branch ?? 0) % DAL_RENKLERI.length]}
        />
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
          onSil={() => { deleteMindmapNode(menu.id); setMenu(null); }}
        />
      )}
    </div>
  );
}

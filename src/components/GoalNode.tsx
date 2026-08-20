import { Handle, Position, useNodeId, NodeToolbar, useReactFlow } from '@xyflow/react';
import { CheckCircle2, CircleDashed, PlayCircle, Plus, Eye, EyeOff, XCircle, AlignLeft } from 'lucide-react';
import clsx from 'clsx';
import type { GoalNodeData, GoalNode as GoalNodeType } from '../store/useRoadmapStore';
import type { Edge } from '@xyflow/react';
import { useRoadmapStore, getActiveWbsTree } from '../store/useRoadmapStore';
import InlineDescriptionMenu from './InlineDescriptionMenu';
import ContextMenu from './ContextMenu';
import { getDepth } from '../utils/layout';
import { altKutuAdi, altKutuEkleEtiketi } from '../utils/wbsSeviye';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { formatDateKey, isWbsTargetPast } from '../utils/notepadTime';

// Sabit boş diziler: her boyamada yenisi üretilirse bileşen boşuna yeniden çizilir.
const EMPTY_NODES: GoalNodeType[] = [];
const EMPTY_EDGES: Edge[] = [];

export default function GoalNode({ data, selected }: { data: GoalNodeData; selected: boolean }) {
  const { t } = useTranslation();
  const isDone = data.status === 'Done';
  const isInProgress = data.status === 'In Progress';
  const isFailed = data.status === 'Failed';

  const nodeId = useNodeId()!;
  // Kutu her zaman açık ağacın içinde çizilir; kardeşlerini ve kenarlarını da
  // oradan okur.
  const aktifAgac = useRoadmapStore((s) => getActiveWbsTree(s));
  const edges = aktifAgac?.edges ?? EMPTY_EDGES;
  const nodes = aktifAgac?.nodes ?? EMPTY_NODES;
  const toggleHideCompleted = useRoadmapStore((s) => s.toggleHideCompleted);
  const updateGoal = useRoadmapStore((s) => s.updateGoal);
  const addGoal = useRoadmapStore((s) => s.addGoal);
  const deleteGoal = useRoadmapStore((s) => s.deleteGoal);
  const startFiveWhysFromWbs = useRoadmapStore((s) => s.startFiveWhysFromWbs);
  const addOrMergeNotepadNoteFromWbs = useRoadmapStore((s) => s.addOrMergeNotepadNoteFromWbs);
  const setActiveTool = useRoadmapStore((s) => s.setActiveTool);
  
  const childrenIds = edges.filter((e) => e.source === nodeId).map((e) => e.target);
  const completedChildrenCount = childrenIds.filter((cid) => {
     const child = nodes.find((n) => n.id === cid);
     return child?.data.status === 'Done';
  }).length;
  const hasCompletedChildren = completedChildrenCount > 0;

  const editingDescriptionId = useRoadmapStore((s) => s.editingDescriptionId);
  const setEditingDescriptionId = useRoadmapStore((s) => s.setEditingDescriptionId);
  const isEditingDescription = editingDescriptionId === nodeId;
  const contextMenuNodeId = useRoadmapStore((s) => s.contextMenuNodeId);
  const setContextMenuNodeId = useRoadmapStore((s) => s.setContextMenuNodeId);
  const isContextMenuOpen = contextMenuNodeId === nodeId;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const { flowToScreenPosition } = useReactFlow();

  // Durum artık kutunun tamamını boyamıyor: nötr bir kart, solunda durum
  // renginde kalın bir kenar ve zeminde o rengin çok hafif tonu. Yetmiş
  // kutuluk bir ağaçta dört ayrı doygun dolgu ekranı mozaiğe çeviriyordu;
  // rengi kenara alınca durum yine bir bakışta okunuyor ama yazı okunur,
  // ekran sakin kalıyor.
  const durumStili = isFailed
    ? { kenar: 'border-slate-200 border-s-rose-500 dark:border-slate-700 dark:border-s-rose-500', zemin: 'bg-rose-50 dark:bg-rose-950/40', simge: 'bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300', vurgu: 'text-rose-600 dark:text-rose-400' }
    // Tamamlandı mavi, devam ediyor yeşil. Eskiden de böyleydi; yeni palette
    // ikisi ters düşmüştü.
    : isDone
    ? { kenar: 'border-slate-200 border-s-sky-500 dark:border-slate-700 dark:border-s-sky-500', zemin: 'bg-sky-50 dark:bg-sky-950/40', simge: 'bg-sky-100 text-sky-600 dark:bg-sky-900/60 dark:text-sky-300', vurgu: 'text-sky-600 dark:text-sky-400' }
    : isInProgress
    ? { kenar: 'border-slate-200 border-s-emerald-500 dark:border-slate-700 dark:border-s-emerald-500', zemin: 'bg-emerald-50 dark:bg-emerald-950/40', simge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300', vurgu: 'text-emerald-600 dark:text-emerald-400' }
    : { kenar: 'border-slate-200 border-s-amber-400 dark:border-slate-700 dark:border-s-amber-400', zemin: 'bg-white dark:bg-slate-800', simge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300', vurgu: 'text-amber-500 dark:text-amber-400' };

  // Menüler her zaman sağa açılıyordu; sağ kenara yakın düğümlerde ekran
  // dışında kalıyorlardı. Sağda yer yoksa sola açılırlar. (Menü kanvas
  // hareketinde kapandığı için bu hesabın açılış anında yapılması yeterli.)
  const menuTarafi = (menuGenisligi: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return Position.Right;
    const NODE_GENISLIK = 220; // kutunun flow koordinatındaki genişliği
    const sagKenar = flowToScreenPosition({ x: node.position.x + NODE_GENISLIK, y: node.position.y });
    // menü genişliği + NodeToolbar offset'i + kenar boşluğu
    return sagKenar.x + menuGenisligi + 15 + 8 > window.innerWidth ? Position.Left : Position.Right;
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      setEditValue(data.label);
    }
  }, [isEditing, data.label]);

  const handleSave = () => {
    if (editValue.trim()) {
      updateGoal(nodeId, { label: editValue.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        // Büyüterek vurgulama (hover:scale) kaldırıldı: kutular birbirine
        // yaklaştığı için büyüyen kutu komşusunun üstüne biniyordu.
        'group relative flex w-[240px] min-h-[84px] items-center rounded-2xl border border-s-[6px] py-3 pe-3 ps-3.5 shadow-md transition-shadow duration-200 hover:shadow-lg text-slate-800 dark:text-slate-100',
        durumStili.kenar,
        durumStili.zemin,
        selected ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      )}
    >
      {/* "1/3" rozeti. Üstüne gelince sayının ne anlama geldiği yazıyor:
          eskiden yalnızca düğmenin ne yaptığı yazıyordu, sayının alt kutu
          sayısı mı yoksa biten sayısı mı olduğu hiçbir yerde söylenmiyordu. */}
      {hasCompletedChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleHideCompleted(nodeId);
          }}
          className={clsx(
            "absolute -top-3 end-3 flex h-6 items-center justify-center gap-1 rounded-full px-2.5 shadow-sm border transition-colors text-[11px] font-bold z-10",
            data.hideCompleted
              ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700"
          )}
          title={`${t('node_progress_hint', { biten: completedChildrenCount, toplam: childrenIds.length, count: childrenIds.length })} — ${data.hideCompleted ? t('show_hidden') : t('hide_completed')}`}
          aria-label={`${t('node_progress_hint', { biten: completedChildrenCount, toplam: childrenIds.length, count: childrenIds.length })} — ${data.hideCompleted ? t('show_hidden') : t('hide_completed')}`}
        >
          {data.hideCompleted ? <EyeOff size={12} /> : <Eye size={12} />}
          {/* Kaç alt görev bitti: sayı tek başına ne kadarın kaldığını
              söylemiyordu, toplamla birlikte veriliyor. */}
          <span>{completedChildrenCount}/{childrenIds.length}</span>
        </button>
      )}
      {/* Açıklaması olan kutuda küçük bir işaret; tıklayınca açıklama açılıyor. */}
      {data.description && data.description.trim() !== '' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setContextMenuNodeId(null);
            setEditingDescriptionId(isEditingDescription ? null : nodeId);
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={t('has_description')}
          title={t('has_description')}
          className="nodrag nopan absolute -bottom-3 end-3 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-600 z-10 transition-colors hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500"
        >
          <AlignLeft size={12} />
        </button>
      )}

      {isEditingDescription && (
        <NodeToolbar isVisible={isEditingDescription} position={menuTarafi(288)} align="start" offset={15}>
          <InlineDescriptionMenu
            description={nodes.find((n) => n.id === nodeId)?.data.description}
            onClose={() => setEditingDescriptionId(null)}
            onSave={(text) => updateGoal(nodeId, { description: text })}
          />
        </NodeToolbar>
      )}

      {isContextMenuOpen && (
        <NodeToolbar isVisible={isContextMenuOpen} position={menuTarafi(256)} align="start" offset={15}>
          <ContextMenu
            node={nodes.find((n) => n.id === nodeId)!}
            onClose={() => setContextMenuNodeId(null)}
            addLabel={altKutuEkleEtiketi(t, getDepth(nodeId, edges))}
            onAddSubGoal={() => {
              addGoal(nodeId, altKutuAdi(t, getDepth(nodeId, edges)));
              setContextMenuNodeId(null);
            }}
            onUpdate={(data) => updateGoal(nodeId, data)}
            onOpenDescription={() => {
              setEditingDescriptionId(nodeId);
              setContextMenuNodeId(null);
            }}
            onAnalyzeRootCause={() => {
              // 5 Neden artık çoklu analiz: açık analize ikinci bir problem
              // eklemek yerine bu iş için yeni bir analiz açılıyor.
              startFiveWhysFromWbs(data.label);
              setActiveTool('5whys');
              setContextMenuNodeId(null);
            }}
            onAddToAgenda={() => {
              const now = new Date();
              const todayStr = formatDateKey(now);
              const targetDate = data.targetDate || todayStr;
              // Ajanda geçmişe planlamaya izin vermiyor; bu yol da aynı kurala uymalı.
              // Saat için ajandadaki ölçüt kullanılır: bitiş anı geçmişse geçmiş sayılır.
              if (isWbsTargetPast(data.targetDate, data.targetTime, data.targetEndTime, now)) {
                // Menü açık bırakılır ki kullanıcı tarihi hemen düzeltebilsin.
                toast.warning(t('wbs_agenda_past_target'), { id: 'wbs-agenda-past-target' });
                return;
              }

              addOrMergeNotepadNoteFromWbs(
                targetDate,
                data.label,
                data.description || '',
                data.targetTime || null,
                data.targetEndTime || null,
                nodeId
              );
              setActiveTool('notepad');
              setContextMenuNodeId(null);
            }}
            onDelete={() => {
              deleteGoal(nodeId);
              setContextMenuNodeId(null);
            }}
          />
        </NodeToolbar>
      )}

      {/* Görüntüde gizli tuttuğumuz ama çizgilerin merkeze gelmesini sağlayan noktalar */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <div className="flex w-full items-center gap-3">
        <div className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', durumStili.simge)}>
          {isFailed ? <XCircle size={18} /> : isDone ? <CheckCircle2 size={18} /> : isInProgress ? <PlayCircle size={18} /> : <CircleDashed size={18} />}
        </div>
        {/* Çift tıklama artık bu blokta değil, ismin kendisinde: blok kutunun
            kalan genişliğinin tamamını kaplıyor ve yazının sağındaki boşluğa
            çift tıklamak da isim düzenlemeyi açıyordu. */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              // İsim kutusu da başlık sayılıyor: işaret olmayınca içine
              // tıklamak "kutuya tıklandı" oluyor, alt kutular açılıp kapanıyor
              // ve kamera kutuya yaklaşıyordu (bkz. WbsCanvas onNodeClick).
              data-kutu-basligi
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              // nodrag/nopan: yazıyı fareyle seçerken kutu sürükleniyordu.
              className="nodrag nopan w-full bg-slate-100 dark:bg-slate-900/60 text-[13px] font-semibold leading-snug outline-none ring-1 ring-slate-300 dark:ring-slate-600 px-2 py-1 rounded-lg text-inherit"
              placeholder={t('double_click_edit')}
              aria-label={t('double_click_edit')}
            />
          ) : (
            <div className="flex flex-col gap-1">
              {/* data-kutu-basligi: kanvas, tıklamanın buraya gelip gelmediğine
                  bakıp alt kutuları açıp kapamayı atlıyor (bkz. WbsCanvas
                  onNodeClick). İsim değiştirmek için çift tıklarken alt kutular
                  açılıp kapanıyordu.

                  w-fit şart: blok öğe olarak kutunun kalan genişliğini baştan
                  sona kaplıyordu, yani kısa isimli bir kutuda "isme tıklama"
                  kapsamı kutunun neredeyse tamamıydı ve alt kutuları açıp
                  kapatacak yer kalmıyordu. Artık kapsam yazının kendisi kadar.
                  min-w: ismi bir şekilde boş kalan kutuda çift tıklanacak bir
                  hedef kalsın. */}
              <h3
                data-kutu-basligi
                onDoubleClick={() => setIsEditing(true)}
                className="w-fit min-w-8 max-w-full text-[13px] font-semibold leading-snug line-clamp-2 cursor-text select-none"
                title={t('double_click_edit')}
              >
                {data.label}
              </h3>
              {(data.targetDate || data.targetTime) && (
                <div className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 w-fit px-1.5 py-0.5 rounded-md">
                  {data.targetDate} {data.targetTime}{data.targetEndTime ? ` - ${data.targetEndTime}` : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Yaprakların açılıp kapandığını gösteren tatlı animasyonlu buton */}
      <div
        className={clsx(
          'absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm transition-transform duration-500 ease-in-out',
          data.isExpanded ? 'rotate-45' : 'rotate-0',
          durumStili.vurgu
        )}
      >
        <Plus size={14} className="stroke-[3]" />
      </div>
    </div>
  );
}

import { memo, useEffect, useRef, useState } from 'react';
import { Handle, NodeToolbar, Position, useNodeId } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Check, AlignLeft } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import type { MindmapNodeData } from '../store/slices/createMindmapSlice';
import { DAL_RENKLERI } from '../utils/mindmapLayout';
import InlineDescriptionMenu from './InlineDescriptionMenu';

type Ekstra = MindmapNodeData & {
  /** Yerleşimden gelenler; veriye kaydedilmez. */
  derinlik: number;
  taraf: 1 | -1;
  cocukVar: boolean;
};

export default memo(function MindmapNode({ data, selected }: { data: Ekstra; selected?: boolean }) {
  const { t } = useTranslation();
  const nodeId = useNodeId()!;
  const updateMindmapNode = useRoadmapStore((s) => s.updateMindmapNode);
  const toggleMindmapCollapse = useRoadmapStore((s) => s.toggleMindmapCollapse);
  const toggleMindmapDone = useRoadmapStore((s) => s.toggleMindmapDone);
  const editingId = useRoadmapStore((s) => s.mindmapEditingLabelId);
  const setEditingId = useRoadmapStore((s) => s.setMindmapEditingLabel);
  const descriptionId = useRoadmapStore((s) => s.mindmapDescriptionId);
  const setDescriptionId = useRoadmapStore((s) => s.setMindmapDescriptionId);

  const duzenleniyor = editingId === nodeId;
  const aciklamaAcik = descriptionId === nodeId;
  const [metin, setMetin] = useState(data.label);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (duzenleniyor) {
      setMetin(data.label);
      setTimeout(() => inputRef.current?.select(), 10);
    }
  }, [duzenleniyor, data.label]);

  const kaydet = () => {
    const temiz = metin.trim();
    if (temiz && temiz !== data.label) updateMindmapNode(nodeId, { label: temiz });
    setEditingId(null);
  };

  /**
   * Yazarken Tab / Enter: önce yazılan metin kaydedilir, hemen ardından yeni
   * dal açılıp yazmaya devam edilir. Eskiden yazmayı bitirmek için ayrıca
   * Enter'a basmak gerekiyordu, bu da akışı her dalda bir kez kesiyordu.
   */
  const kaydetVeYeniDal = (tur: 'alt' | 'kardes') => {
    const temiz = metin.trim();
    if (temiz && temiz !== data.label) updateMindmapNode(nodeId, { label: temiz });

    const durum = useRoadmapStore.getState();
    const yeni = tur === 'alt'
      ? durum.addMindmapChild(nodeId, t('mindmap_new_node'))
      : durum.addMindmapSibling(nodeId, t('mindmap_new_node'));

    if (yeni) {
      durum.setMindmapSelected(yeni);
      setEditingId(yeni);
    } else {
      // Kökün kardeşi olmaz; o durumda yazma biter.
      setEditingId(null);
    }
  };

  const renk = DAL_RENKLERI[(data.branch ?? 0) % DAL_RENKLERI.length];
  const kok = data.derinlik === 0;
  const anaDal = data.derinlik === 1;
  // Kök, haritanın konusu; bir "iş" değil, o yüzden tikleyecek bir şey yok.
  const tikVar = !kok;
  const bitti = !!data.done;

  return (
    <div
      onDoubleClick={() => setEditingId(nodeId)}
      className="relative flex items-center justify-center gap-2 rounded-2xl transition-shadow bg-white dark:bg-slate-800"
      style={{
        background: kok ? renk : undefined,
        color: kok ? '#ffffff' : undefined,
        border: kok ? 'none' : `${anaDal ? 3 : 2}px solid ${renk}`,
        boxShadow: selected ? `0 0 0 4px ${renk}33` : '0 1px 3px rgba(15,23,42,0.12)',
        padding: kok ? '14px 22px' : '9px 15px',
        fontSize: kok ? 16 : anaDal ? 14 : 13,
        opacity: bitti ? 0.55 : 1,
      }}
    >
      <Handle type="target" position={data.taraf === 1 ? Position.Left : Position.Right} className="!opacity-0 !w-1 !h-1 !border-none" />
      {/* Kök hem sağa hem sola dal attığı için tek taraflı handle yetmiyor: iki yana da kaynak lazım. */}
      {kok && (
        <>
          <Handle type="source" id="right" position={Position.Right} className="!opacity-0 !w-1 !h-1 !border-none" />
          <Handle type="source" id="left" position={Position.Left} className="!opacity-0 !w-1 !h-1 !border-none" />
        </>
      )}

      {tikVar && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMindmapDone(nodeId); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={bitti ? t('mindmap_mark_undone') : t('mindmap_mark_done')}
          title={bitti ? t('mindmap_mark_undone') : t('mindmap_mark_done')}
          className="nodrag nopan flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors"
          style={{
            borderColor: renk,
            background: bitti ? renk : 'transparent',
            color: '#ffffff',
          }}
        >
          {bitti && <Check size={10} strokeWidth={4} />}
        </button>
      )}

      {duzenleniyor ? (
        <textarea
          ref={inputRef}
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          onBlur={kaydet}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Tab') { e.preventDefault(); kaydetVeYeniDal('alt'); }
            else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); kaydetVeYeniDal('kardes'); }
            else if (e.key === 'Escape') setEditingId(null);
          }}
          rows={1}
          className="nodrag nopan nowheel w-40 resize-none bg-transparent text-center font-bold outline-none"
          style={{ color: kok ? '#ffffff' : undefined }}
        />
      ) : (
        <span
          className={`text-center font-bold text-slate-800 dark:text-slate-100 max-w-[240px] break-words ${bitti ? 'line-through' : ''}`}
          style={{ color: kok ? '#ffffff' : undefined }}
        >
          {data.label}
        </span>
      )}

      {/* Açıklaması olan dalda küçük bir işaret; tıklayınca kutu açılıyor. */}
      {!duzenleniyor && data.description && (
        <button
          onClick={(e) => { e.stopPropagation(); setDescriptionId(aciklamaAcik ? null : nodeId); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={t('has_description')}
          title={t('has_description')}
          className="nodrag nopan shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          style={{ color: kok ? '#ffffffcc' : undefined }}
        >
          <AlignLeft size={13} />
        </button>
      )}

      {aciklamaAcik && (
        <NodeToolbar isVisible position={data.taraf === 1 ? Position.Right : Position.Left} align="start" offset={15}>
          <InlineDescriptionMenu
            description={data.description}
            onClose={() => setDescriptionId(null)}
            onSave={(text) => updateMindmapNode(nodeId, { description: text })}
          />
        </NodeToolbar>
      )}

      {/* Daraltılmış dalın ucunda kaç dal gizlendiğini gösteren düğme */}
      {data.cocukVar && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMindmapCollapse(nodeId); }}
          className="absolute flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-800 shadow-sm"
          style={{
            borderColor: renk,
            color: renk,
            top: 'calc(50% - 10px)',
            ...(data.taraf === 1 ? { right: -10 } : { left: -10 })
          }}
          aria-label={data.collapsed ? 'genislet' : 'daralt'}
        >
          {data.collapsed ? <Plus size={12} /> : <Minus size={12} />}
        </button>
      )}

      {!kok && (
        <Handle type="source" position={data.taraf === 1 ? Position.Right : Position.Left} className="!opacity-0 !w-1 !h-1 !border-none" />
      )}
    </div>
  );
});

import { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useNodeId } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Link2, AlignLeft, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useRoadmapStore } from '../store/useRoadmapStore';
import type { RoadmapNodeData, RoadmapYon } from '../store/slices/createRoadmapSlice';
import { durumGorunumu } from '../config/roadmapDurum';

type Ekstra = RoadmapNodeData & {
  /**
   * Yerleşimden gelenler; veriye kaydedilmez. Adı `taraf` değil çünkü veride
   * zaten o adla bir alan var ve orada değer 'sag'/'sol', burada 1/-1.
   */
  derinlik: number;
  hatTarafi: 1 | -1;
  cocukVar: boolean;
  yon: RoadmapYon;
};

/** Tutamaklar dört yanda da duruyor; hangisinin kullanılacağına kenar karar veriyor. */
const TUTAMAK = '!h-1 !w-1 !border-none !opacity-0';

export default memo(function RoadmapNode({ data, selected }: { data: Ekstra; selected?: boolean }) {
  const { t } = useTranslation();
  const nodeId = useNodeId()!;
  const updateRoadmapNode = useRoadmapStore((s) => s.updateRoadmapNode);
  const cycleRoadmapStatus = useRoadmapStore((s) => s.cycleRoadmapStatus);
  const toggleRoadmapCollapse = useRoadmapStore((s) => s.toggleRoadmapCollapse);
  const setDetayId = useRoadmapStore((s) => s.setRoadmapDetayId);
  const editingId = useRoadmapStore((s) => s.roadmapEditingLabelId);
  const setEditingId = useRoadmapStore((s) => s.setRoadmapEditingLabel);

  const duzenleniyor = editingId === nodeId;
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
    if (temiz && temiz !== data.label) updateRoadmapNode(nodeId, { label: temiz });
    setEditingId(null);
  };

  const bolum = data.tur === 'bolum';
  const adim = data.tur === 'adim';
  const gorunum = durumGorunumu(data.durum);
  const bitmis = data.durum === 'bitti' || data.durum === 'atlandi';
  const DurumIcon = gorunum.icon;
  const kaynakSayisi = data.kaynaklar?.length ?? 0;

  // Daraltma düğmesi gizlenecek konuların olduğu yana bakıyor. Dikeyde konular
  // hep yana asılı; yatayda durağın altına iniyor ama alt konular yine yana
  // gidiyor (bkz. yolHaritasiYerlesimi).
  const dikey = data.yon === 'dikey';
  const daraltKonum = dikey
    ? { top: 'calc(50% - 10px)', ...(data.hatTarafi === 1 ? { right: -10 } : { left: -10 }) }
    : data.derinlik === 0
      ? { left: 'calc(50% - 10px)', ...(data.hatTarafi === 1 ? { bottom: -10 } : { top: -10 }) }
      : { top: 'calc(50% - 10px)', right: -10 };

  const yaziAlani = (
    <textarea
      ref={inputRef}
      value={metin}
      onChange={(e) => setMetin(e.target.value)}
      onBlur={kaydet}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); kaydet(); }
        else if (e.key === 'Escape') setEditingId(null);
      }}
      rows={1}
      className="nodrag nopan nowheel w-full resize-none bg-transparent text-start font-bold outline-none"
    />
  );

  if (bolum) {
    return (
      <div
        onDoubleClick={() => setEditingId(nodeId)}
        className={clsx(
          'flex items-center gap-3 rounded-xl border-s-4 border-lime-500 bg-lime-50 px-4 py-2.5 shadow-sm transition-shadow dark:bg-lime-900/25',
          selected && 'ring-4 ring-lime-500/25'
        )}
      >
        <Handle type="target" id="hedef-ust" position={Position.Top} className={TUTAMAK} />
        <Handle type="target" id="hedef-sol" position={Position.Left} className={TUTAMAK} />
        <Handle type="source" id="kaynak-alt" position={Position.Bottom} className={TUTAMAK} />
        <Handle type="source" id="kaynak-sag" position={Position.Right} className={TUTAMAK} />

        {duzenleniyor ? yaziAlani : (
          <span className="text-sm font-extrabold uppercase tracking-wide text-lime-700 dark:text-lime-300">
            {data.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setEditingId(nodeId)}
      className={clsx(
        'relative flex items-center gap-2 rounded-xl border-2 shadow-sm transition-shadow',
        adim ? 'px-3.5 py-2.5' : 'px-3 py-2',
        // Seçmeli konu kesik çerçeveyle çiziliyor: bağlantı çizgisiyle aynı dil.
        data.secmeli && 'border-dashed',
        gorunum.kutu,
        selected && 'ring-4 ring-lime-500/25'
      )}
      style={{ opacity: data.durum === 'atlandi' ? 0.6 : 1 }}
    >
      <Handle type="target" id="hedef-ust" position={Position.Top} className={TUTAMAK} />
      <Handle type="target" id="hedef-alt" position={Position.Bottom} className={TUTAMAK} />
      <Handle type="target" id="hedef-sol" position={Position.Left} className={TUTAMAK} />
      <Handle type="target" id="hedef-sag" position={Position.Right} className={TUTAMAK} />
      <Handle type="source" id="kaynak-ust" position={Position.Top} className={TUTAMAK} />
      <Handle type="source" id="kaynak-alt" position={Position.Bottom} className={TUTAMAK} />
      <Handle type="source" id="kaynak-sol" position={Position.Left} className={TUTAMAK} />
      <Handle type="source" id="kaynak-sag" position={Position.Right} className={TUTAMAK} />

      {/* Durum düğmesi: her tıklamada bir sonraki duruma geçer. Haritanın en
          sık kullanılan hareketi bu, o yüzden kutunun üstünde duruyor. */}
      <button
        onClick={(e) => { e.stopPropagation(); cycleRoadmapStatus(nodeId); }}
        onDoubleClick={(e) => e.stopPropagation()}
        aria-label={t('roadmap_change_status')}
        title={t(gorunum.etiket)}
        className={clsx('nodrag nopan shrink-0 transition-transform hover:scale-110', gorunum.metin)}
      >
        <DurumIcon size={adim ? 19 : 17} strokeWidth={2.4} />
      </button>

      {duzenleniyor ? yaziAlani : (
        <span
          className={clsx(
            'min-w-0 flex-1 break-words text-start font-bold text-slate-800 dark:text-slate-100',
            adim ? 'text-[13.5px]' : 'text-[12.5px]',
            bitmis && 'line-through decoration-2'
          )}
        >
          {data.label}
        </span>
      )}

      {!duzenleniyor && !!data.sure && (
        <span
          className="nodrag flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300"
          title={t('roadmap_duration_hours')}
        >
          <Clock size={10} />
          {data.sure}
        </span>
      )}

      {!duzenleniyor && !!data.description && (
        <button
          onClick={(e) => { e.stopPropagation(); setDetayId(nodeId); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={t('has_description')}
          title={t('has_description')}
          className="nodrag nopan shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
        >
          <AlignLeft size={13} />
        </button>
      )}

      {!duzenleniyor && kaynakSayisi > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setDetayId(nodeId); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={t('roadmap_resources')}
          title={t('roadmap_resource_count', { sayi: kaynakSayisi, count: kaynakSayisi })}
          className="nodrag nopan flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-sky-500 transition-colors hover:text-sky-600"
        >
          <Link2 size={12} />
          {kaynakSayisi}
        </button>
      )}

      {data.cocukVar && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleRoadmapCollapse(nodeId); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={data.collapsed ? t('roadmap_expand') : t('roadmap_collapse')}
          title={data.collapsed ? t('roadmap_expand') : t('roadmap_collapse')}
          className="nodrag nopan absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-lime-500 bg-white text-lime-600 shadow-sm dark:bg-slate-800 dark:text-lime-400"
          style={daraltKonum}
        >
          {data.collapsed ? <Plus size={12} /> : <Minus size={12} />}
        </button>
      )}
    </div>
  );
});

import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { DiagramNodeData } from '../../store/slices/diagramOps';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useDiagramEditing } from './diagramEditing';

interface DiagramNodeProps {
  id: string;
  data: DiagramNodeData;
  selected?: boolean;
  kind: DiagramKind;
}

export default memo(function DiagramNode({ id, data, selected, kind }: DiagramNodeProps) {
  const { t } = useTranslation();
  const { label, shape, subtitle } = data;
  const k = getDiagramKind(kind);
  const bicim = k.getShape(shape);

  // Veri akış şemasında kutular numaralı anılır. Numara veride tutulmuyor,
  // aynı biçimdeki kutular arasındaki sıradan hesaplanıyor.
  const numara = useRoadmapStore((state) => {
    const liste = kind === 'orgchart' ? state.orgcharts : state.flowcharts;
    const aktifId = kind === 'orgchart' ? state.activeOrgchartId : state.activeFlowchartId;
    const sema = liste.find((x) => x.id === aktifId) || liste[0];
    if (!sema) return null;
    const onEk = k.getType(sema.type).numbered?.[bicim.id];
    if (onEk === undefined) return null;
    const sira = sema.nodes.filter((n) => n.data.shape === bicim.id).findIndex((n) => n.id === id);
    return sira < 0 ? null : `${onEk}${sira + 1}`;
  });

  // Ad değiştirme kutunun İÇİNDE oluyor (kırılım ağacındaki gibi): çift
  // tıklayınca yazının yerini bir yazma alanı alıyor. Eskiden imlecin yanında
  // ayrı bir menü kutusu açılıyordu; kullanıcı adını değiştirdiği kutuya
  // bakarken yazıyı bambaşka bir yerde yazıyordu.
  const updateNode = useRoadmapStore((s) => (kind === 'orgchart' ? s.updateOrgchartNode : s.updateFlowchartNode));
  const { editingId, setEditingId } = useDiagramEditing();
  const duzenleniyor = editingId === id;
  const [taslak, setTaslak] = useState(label);
  const girdiRef = useRef<HTMLInputElement>(null);
  // Esc ile çıkılınca yazma alanı ekrandan kalkıyor; arkasından gelebilecek
  // blur'un yazılanı kaydetmemesi için.
  const vazgecildi = useRef(false);

  // Yazı hazır seçili geliyor: yeni kutudaki varsayılan ad ("Yeni işlem") ilk
  // tuşta silinsin, kullanıcı elle temizlemesin diye.
  useEffect(() => {
    if (!duzenleniyor) return;
    vazgecildi.current = false;
    setTaslak(label);
    const el = girdiRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [duzenleniyor, label]);

  const kaydet = () => {
    if (vazgecildi.current) return;
    const yeni = taslak.trim();
    if (yeni && yeni !== label) updateNode(id, { label: yeni });
    setEditingId(null);
  };

  const Ikon = bicim.icon;

  /**
   * Tutamağın yerini katalog düzeltiyorsa (bkz. karar baklavası) React Flow'un
   * kendi yerleştirmesi tamamen devre dışı bırakılıyor: sağ/alt dayamaları
   * sıfırlanıp tutamak verilen noktaya ortalanıyor.
   */
  const tutamak = (yon: 'top' | 'right' | 'bottom' | 'left'): CSSProperties | undefined => {
    const duzeltme = bicim.handleStyles?.[yon];
    if (!duzeltme) return undefined;
    return { right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', ...duzeltme };
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-[56px] transition-all ${bicim.boxClass} ${selected ? 'ring-4 ring-indigo-500/30' : ''}`}
    >
      <Handle type="target" position={Position.Top} style={tutamak('top')} className="w-3 h-3 bg-slate-300 dark:bg-slate-600 border-none" />
      <Handle type="target" position={Position.Left} id="left" style={tutamak('left')} className="w-3 h-3 bg-slate-300 dark:bg-slate-600 border-none" />

      {/* Yazı boyu ve iç boşluk satır içi stille veriliyor: sınıf olarak
          verilince temel sınıflarla çakışıp hangisinin kazanacağı belirsiz
          kalıyor ve şekillerin dışına taşan yazılar çıkıyordu. */}
      <div
        className={`flex items-center justify-center text-center font-bold outline-none break-words w-full h-full gap-2 ${bicim.innerClass || ''}`}
        style={{ fontSize: 14, lineHeight: 1.25, padding: 8, ...bicim.innerStyle }}
      >
        {bicim.withIcon && <Ikon size={16} className="shrink-0 opacity-70" />}
        <div className="flex flex-col items-center leading-tight">
          {numara && <span className="text-[10px] font-black opacity-60">{numara}</span>}
          {duzenleniyor ? (
            <input
              ref={girdiRef}
              // nodrag/nopan: yazıyı fareyle seçerken kutu sürükleniyor,
              // kanvas kayıyordu.
              // data-kutu-basligi: kanvas tıklamanın yazıya gelip gelmediğine
              // bakıyor (bkz. DiagramCanvas onNodeClick).
              className="nodrag nopan text-center font-bold text-inherit bg-white/85 dark:bg-slate-900/80 rounded px-1 outline-none ring-1 ring-indigo-500"
              data-kutu-basligi
              style={{
                // Yazma alanı kutuyu şişirmesin diye genişlik yazı kadar,
                // en fazla kutunun içi kadar (baklava gibi sabit ölçülü
                // kutularda taşmasın).
                width: `${Math.max(8, taslak.length + 1)}ch`,
                maxWidth: '100%',
                fontSize: 'inherit',
                lineHeight: 'inherit',
              }}
              value={taslak}
              onChange={(e) => setTaslak(e.target.value)}
              onBlur={kaydet}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  kaydet();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  vazgecildi.current = true;
                  setEditingId(null);
                }
              }}
              placeholder={t(k.text.inputPlaceholder)}
              aria-label={t(k.text.inputPlaceholder)}
            />
          ) : (
            <span
              data-kutu-basligi
              onDoubleClick={() => setEditingId(id)}
              className="cursor-text"
              title={t('double_click_edit')}
            >
              {label}
            </span>
          )}
          {bicim.withSubtitle && subtitle && (
            <span className="text-xs font-medium opacity-60 mt-0.5">{subtitle}</span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={tutamak('bottom')} className="w-3 h-3 bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-800" />
      <Handle type="source" position={Position.Right} id="right" style={tutamak('right')} className="w-3 h-3 bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-800" />
    </div>
  );
});

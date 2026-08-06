import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

/**
 * Ok uçları. React Flow'un hazır markerEnd'i tek renk verdiği için VSM'in üç
 * ayrı akış diline (malzeme, çekme, bilgi) yetmiyordu; kanvasa bir kez basılıp
 * id ile kullanılıyorlar.
 */
export function VsmEdgeMarkers() {
  const ok = (id: string, renk: string, dolu = true) => (
    <marker id={id} key={id} markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L9,4 L0,8 z" fill={dolu ? renk : 'none'} stroke={renk} strokeWidth="1.5" />
    </marker>
  );

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
      <defs>
        {ok('vsm-ok-malzeme', '#334155')}
        {ok('vsm-ok-cekme', '#0ea5e9')}
        {ok('vsm-ok-bilgi', '#e11d48', false)}
        {/* İtme okunun çizgili gövdesi: standart VSM'de itme akışı taralı gösterilir. */}
        <pattern id="vsm-itme-tarama" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#334155" />
          <rect width="4" height="8" fill="#94a3b8" />
        </pattern>
      </defs>
    </svg>
  );
}

function Etiket({ x, y, children, className }: { x: number; y: number; children: React.ReactNode; className?: string }) {
  return (
    <EdgeLabelRenderer>
      <div
        style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${x}px,${y}px)`, pointerEvents: 'all' }}
        className={`nodrag nopan rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className ?? ''}`}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

/** İtme akışı: üretim planına göre bir sonraki işleme itilen malzeme. */
export function VsmPushEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd="url(#vsm-ok-malzeme)" style={{ ...style, strokeWidth: 7, stroke: 'url(#vsm-itme-tarama)' }} />
      {label ? <Etiket x={labelX} y={labelY}>{label}</Etiket> : null}
    </>
  );
}

/** Çekme: sonraki işlem ihtiyacı kadarını alır. */
export function VsmPullEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd="url(#vsm-ok-cekme)" style={{ ...style, strokeWidth: 3, stroke: '#0ea5e9', strokeDasharray: '8 4' }} />
      {label ? <Etiket x={labelX} y={labelY} className="text-sky-600 dark:text-sky-400">{label}</Etiket> : null}
    </>
  );
}

/** FIFO şeridi: sırayı bozmadan sınırlı miktarda ara stok. */
export function VsmFifoEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd="url(#vsm-ok-malzeme)" style={{ ...style, strokeWidth: 2, stroke: '#334155' }} />
      <Etiket x={labelX} y={labelY} className="text-slate-600 dark:text-slate-300">{label || 'FIFO'}</Etiket>
    </>
  );
}

/** Elle taşınan bilgi: çizelge, sözlü talimat, kâğıt. */
export function VsmInfoEdge({ sourceX, sourceY, targetX, targetY, style = {}, label }: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd="url(#vsm-ok-bilgi)" style={{ ...style, strokeWidth: 1.5, stroke: '#e11d48' }} />
      {label ? <Etiket x={labelX} y={labelY} className="text-rose-600 dark:text-rose-400">{label}</Etiket> : null}
    </>
  );
}

/**
 * Elektronik bilgi: standart VSM'de zikzak çizilir. Elle taşınan bilgiden
 * ayırt edilmesi önemli, çünkü ikisinin gecikmesi bambaşka.
 */
export function VsmInfoElectronicEdge({ sourceX, sourceY, targetX, targetY, style = {}, label }: EdgeProps) {
  const orta = (sourceX + targetX) / 2;
  const ortaY = (sourceY + targetY) / 2;
  const genlik = 8;
  const parca = 6;
  const noktalar: string[] = [`M ${sourceX} ${sourceY}`];
  for (let i = 1; i < parca; i += 1) {
    const oran = i / parca;
    const x = sourceX + (targetX - sourceX) * oran;
    const y = sourceY + (targetY - sourceY) * oran + (i % 2 === 0 ? genlik : -genlik);
    noktalar.push(`L ${x} ${y}`);
  }
  noktalar.push(`L ${targetX} ${targetY}`);

  return (
    <>
      <BaseEdge path={noktalar.join(' ')} markerEnd="url(#vsm-ok-bilgi)" style={{ ...style, strokeWidth: 1.5, stroke: '#e11d48' }} />
      {label ? <Etiket x={orta} y={ortaY} className="text-rose-600 dark:text-rose-400">{label}</Etiket> : null}
    </>
  );
}

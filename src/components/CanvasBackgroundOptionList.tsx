import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { CANVAS_BACKGROUNDS, setCanvasBg, useCanvasBg, type CanvasBgId } from '../canvasBackground';

/**
 * Zemin deseni seçenekleri. Yanlarındaki küçük kare, desenin kendisini
 * gösteriyor: "kareli" yazısını okumadan da hangisi olduğu görülüyor.
 *
 * Önizlemeler elle çizilen SVG; React Flow'un kendi Background'ı burada
 * kullanılamazdı, o bileşen bir çizim alanının içinde olmayı bekliyor.
 * Ayrıca menü bu yüzden ağır çizim paketini yüklemek zorunda kalmıyor.
 */
function Onizleme({ id }: { id: CanvasBgId }) {
  const ortak = 'h-5 w-5 shrink-0 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500';

  if (id === 'none') {
    return <span aria-hidden className={ortak} />;
  }

  return (
    <svg aria-hidden viewBox="0 0 20 20" className={ortak}>
      {id === 'dots' &&
        [5, 10, 15].map((y) =>
          [5, 10, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill="currentColor" />)
        )}
      {id === 'grid' && (
        <g stroke="currentColor" strokeWidth={0.6}>
          <path d="M6.5 0v20M13.5 0v20M0 6.5h20M0 13.5h20" />
          <path d="M10 0v20M0 10h20" strokeWidth={1.1} />
        </g>
      )}
      {id === 'cross' &&
        [5, 10, 15].map((y) =>
          [5, 10, 15].map((x) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 1.6} ${y}h3.2M${x} ${y - 1.6}v3.2`}
              stroke="currentColor"
              strokeWidth={0.7}
            />
          ))
        )}
    </svg>
  );
}

export default function CanvasBackgroundOptionList({ onPick }: { onPick?: () => void }) {
  const { t } = useTranslation();
  const activeId = useCanvasBg();

  return (
    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
      {CANVAS_BACKGROUNDS.map((desen) => {
        const isActive = desen.id === activeId;
        return (
          <button
            key={desen.id}
            onClick={() => {
              setCanvasBg(desen.id);
              onPick?.();
            }}
            className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Onizleme id={desen.id} />
              <span>{t(desen.labelKey, { defaultValue: desen.defaultLabel })}</span>
            </span>
            {isActive && <Check size={16} className="text-indigo-500" />}
          </button>
        );
      })}
    </div>
  );
}

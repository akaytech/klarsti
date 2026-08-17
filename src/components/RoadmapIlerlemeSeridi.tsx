import { useTranslation } from 'react-i18next';
import { RotateCw, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { Roadmap } from '../store/slices/createRoadmapSlice';
import { roadmapIlerleme } from '../store/slices/createRoadmapSlice';

/**
 * Haritanın ilerleme şeridi ve yön düğmesi.
 *
 * Yön düğmesi burada duruyor çünkü ikisi de "haritanın bütünü" hakkında:
 * biri ne kadarının bittiğini, öteki hattın nereye aktığını söylüyor. Uzun
 * bir harita dikeyde ekrandan taşıyor; tek tuşla yatıya çevirmek onu geniş
 * ekranda okunur hale getiriyor.
 */
export default function RoadmapIlerlemeSeridi({
  harita,
  onYonDegistir
}: {
  harita: Roadmap;
  onYonDegistir: () => void;
}) {
  const { t } = useTranslation();
  const { toplam, tamamlanan, yuzde, kalanSure } = roadmapIlerleme(harita.nodes);
  const dikey = (harita.yon ?? 'dikey') === 'dikey';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
      <div className="min-w-[130px]">
        <div className="flex items-baseline gap-1.5">
          {/* Yüzde işaretinin yeri dile göre değişiyor: Türkçede sayının
              önünde, İngilizcede arkasında. */}
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{t('roadmap_percent', { yuzde })}</span>
          <span className="text-[11px] font-bold text-slate-400">
            {t('roadmap_progress_count', { biten: tamamlanan, toplam })}
          </span>
        </div>
        <div
          className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="progressbar"
          aria-valuenow={yuzde}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('roadmap_progress')}
        >
          <div
            className="h-full rounded-full bg-lime-500 transition-[width] duration-300"
            style={{ width: `${yuzde}%` }}
          />
        </div>
      </div>

      {kalanSure > 0 && (
        <span
          className="flex shrink-0 items-center gap-1 border-s border-slate-200 ps-3 text-[11px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400"
          title={t('roadmap_remaining_hint')}
        >
          <Clock size={12} />
          {t('roadmap_remaining_hours', { saat: kalanSure })}
        </span>
      )}

      <button
        onClick={onYonDegistir}
        aria-label={t('roadmap_rotate')}
        title={t(dikey ? 'roadmap_rotate_to_horizontal' : 'roadmap_rotate_to_vertical')}
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors',
          'hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
        )}
      >
        <RotateCw size={15} />
      </button>
    </div>
  );
}

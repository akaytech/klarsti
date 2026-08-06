import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useUIStore } from '../store/useUIStore';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { GUIDE_TOOLS } from '../content/toolGuides/available';

// Dar ekranda bu düğme gizli; oradaki karşılığı üç nokta menüsünde
// (TopRightMobileMoreMenu) duruyor.
export default function ToolGuideButton() {
  const { t } = useTranslation();
  const activeTool = useRoadmapStore((s) => s.activeTool);
  const guideOpen = useUIStore((s) => s.guideOpen);
  const setGuideOpen = useUIStore((s) => s.setGuideOpen);

  // Kılavuzu yazılmamış araçta düğme hiç çıkmaz: boş bir pencere açmak,
  // düğmeyi hiç göstermemekten kötü.
  if (!activeTool || !GUIDE_TOOLS.includes(activeTool)) return null;

  return (
    <button
      onClick={() => setGuideOpen(!guideOpen)}
      aria-pressed={guideOpen}
      className={clsx(
        'hidden sm:flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-colors',
        guideOpen
          ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60'
          : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700'
      )}
      title={t('guide_button')}
      aria-label={t('guide_button')}
    >
      <BookOpen size={18} />
      <span className="hidden sm:inline">{t('guide_button')}</span>
    </button>
  );
}

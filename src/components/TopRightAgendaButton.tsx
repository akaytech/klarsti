import { CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { ajandaDugmesiGorunurMu } from '../utils/ajandaDugmesi';

// Ajanda kişiseldir, projeye bağlı değildir; bu yüzden proje araç listelerinde
// yer almaz. Ana menüde ve ajandanın kendisindeyken sağ üstteki düğme kümesinde,
// "Çalışmalarım" ile hesap düğmesinin arasında durur. Başka bir araç açıkken
// görünmez, orada kanvasın kendi düğmeleriyle çakışıyordu.
// Dar ekranda kümenin tamamı gizleniyor; oradaki karşılığı "..." menüsündeki
// Ajanda satırı (TopRightMobileMoreMenu).
export default function TopRightAgendaButton() {
  const { t } = useTranslation();
  const { activeTool, setActiveTool } = useRoadmapStore(useShallow((state) => ({
    activeTool: state.activeTool,
    setActiveTool: state.setActiveTool
  })));

  if (!ajandaDugmesiGorunurMu(activeTool)) return null;

  const acik = activeTool === 'notepad';

  return (
    <div className="absolute top-4 end-24 z-[100]">
      <button
        onClick={() => setActiveTool(acik ? null : 'notepad')}
        title={t('notepad_title')}
        aria-label={t('notepad_title')}
        aria-pressed={acik}
        className={clsx(
          "hidden sm:flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 shadow-md hover:scale-105 transition-transform overflow-hidden focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50",
          acik
            ? "bg-fuchsia-100 dark:bg-fuchsia-900/50 border-fuchsia-300 dark:border-fuchsia-700 text-fuchsia-700 dark:text-fuchsia-300"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-fuchsia-500 dark:text-fuchsia-400"
        )}
      >
        <CalendarDays size={20} />
      </button>
    </div>
  );
}

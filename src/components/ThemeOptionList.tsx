import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { THEMES, setTheme, useThemeId } from '../theme';

/**
 * Tema seçeneklerinin listesi. Hem tanıtım sayfasındaki açılır menüde hem de
 * kullanıcı menüsündeki alt sayfada aynı liste kullanılıyor.
 *
 * DİKKAT: Burada sadece react / lucide / i18n var. Tanıtım sayfası da bu
 * bileşeni yüklüyor, store veya firebase import edilmemeli.
 */
export default function ThemeOptionList({ onPick }: { onPick?: () => void }) {
  const { t } = useTranslation();
  const activeId = useThemeId();

  return (
    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
      {THEMES.map((theme) => {
        const isActive = theme.id === activeId;
        return (
          <button
            key={theme.id}
            onClick={() => {
              setTheme(theme.id);
              onPick?.();
            }}
            className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ background: `linear-gradient(135deg, ${theme.swatch[0]} 0 50%, ${theme.swatch[1]} 50% 100%)` }}
              />
              <span>{t(theme.labelKey, { defaultValue: theme.defaultLabel })}</span>
            </span>
            {isActive && <Check size={16} className="text-indigo-500" />}
          </button>
        );
      })}
    </div>
  );
}

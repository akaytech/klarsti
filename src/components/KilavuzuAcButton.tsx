import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/useUIStore';

/**
 * Boş tuval karşılamasındaki üçüncü düğme: "Nasıl çalışır?".
 *
 * Karşılama panelindeki iki düğme (kendim oluşturacağım / örnek şablon)
 * kullanıcıyı çizmeye çağırıyor ama yöntemi bilmeyene bir şey söylemiyordu.
 * Kılavuz sağ üstte duruyor, orayı ilk kez giren kimse aramıyor.
 *
 * Diğer ikisinden daha sönük duruyor: asıl yol çizmeye başlamak, bu bir
 * kaçış kapısı.
 */
export default function KilavuzuAcButton() {
  const { t } = useTranslation();
  const setGuideOpen = useUIStore((s) => s.setGuideOpen);

  return (
    <button
      onClick={() => setGuideOpen(true)}
      className="mx-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
    >
      <BookOpen size={16} />
      {t('guide_how_button')}
    </button>
  );
}

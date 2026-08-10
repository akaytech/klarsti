import { useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useClampedPosition } from '../utils/useClampedPosition';
import { MenuPortal } from '../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../utils/menuKapatma';

export default function PaneContextMenu({
  x,
  y,
  onClose,
  onAddRootGoal,
  addLabel,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onAddRootGoal: () => void;
  addLabel?: string;
}) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  useBaglamMenusuKapat(onClose);

  // Menü açılır açılmaz odak "ekle" düğmesine geçsin; küçük gecikme menünün
  // yerleşmesini bekliyor.
  useEffect(() => {
    const timer = setTimeout(() => addBtnRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MenuPortal>
    <div
      ref={menuRef}
      role="menu"
      style={menuStyle}
      className="context-menu fixed z-50 w-56 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xl transition-all"
    >
      <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('map_operations')}</div>

      <button
        ref={addBtnRef}
        onClick={onAddRootGoal}
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <PlusCircle size={18} className="text-emerald-500 dark:text-emerald-400" /> {addLabel || t('new_root_goal')}
      </button>

      
      <div className="mt-2 text-center">
        <button onClick={onClose} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest">{t('close')}</button>
      </div>
    </div>
    </MenuPortal>
  );
}

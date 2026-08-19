import React from 'react';
import clsx from 'clsx';

/** Ayrıntı şeridindeki küçük ikon düğmeleri. */
export default function GanttIkonDugme({
  children, etiket, onClick, etkin, tehlike
}: {
  children: React.ReactNode;
  etiket: string;
  onClick: () => void;
  etkin?: boolean;
  tehlike?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={etiket}
      aria-label={etiket}
      aria-pressed={etkin}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        etkin
          ? 'bg-orange-600 text-white'
          : tehlike
          ? 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
      )}
    >
      {children}
    </button>
  );
}

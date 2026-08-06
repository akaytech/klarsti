import { useState, useRef, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface CustomTimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minTime?: string;
}

export default function CustomTimeSelect({ value, onChange, placeholder, className, minTime }: CustomTimeSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const times = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        arr.push(`${hh}:${mm}`);
      }
    }
    return minTime ? arr.filter((t) => t > minTime) : arr;
  }, [minTime]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Scroll to selected value
      setTimeout(() => {
        if (listRef.current) {
          const selectedEl = listRef.current.querySelector('.selected-time') as HTMLElement;
          if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'center' });
          }
        }
      }, 10);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={clsx("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-400 dark:text-slate-500" />
          <span>{value || placeholder || '--:--'}</span>
        </div>
      </button>

      {isOpen && (
        <div 
          ref={listRef}
          className="absolute z-[999] top-full mt-1 left-0 w-full max-h-48 overflow-y-auto custom-scrollbar rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Saati kaldırma seçeneği. Bu olmadan, bir kez saat seçildikten
              sonra yalnızca başka bir saatle değiştirilebiliyor, boşaltılamıyordu. */}
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={clsx(
              "w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors border-b border-slate-100 dark:border-slate-700 mb-1",
              value === ''
                ? "bg-indigo-500 text-white font-bold"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {t('goal_no_time')}
          </button>
          {times.map((saat) => (
            <button
              key={saat}
              onClick={() => {
                onChange(saat);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors",
                value === saat
                  ? "bg-indigo-500 text-white font-bold selected-time"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {saat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

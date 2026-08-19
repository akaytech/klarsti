import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { NotepadNote } from '../store/useRoadmapStore';
import { formatDateKey, getEntryDateKey, isEntryPast } from '../utils/notepadTime';

/**
 * Ajandanın takvim ekranı: ay ızgarası ve sağında yaklaşan kayıtlar.
 *
 * Hangi ayın gösterildiği yalnızca burayı ilgilendiriyor, o yüzden durum da
 * burada duruyor — ekran dosyasında dururken oradaki on beş durumdan ikisiydi
 * ve dışarıdan kimse okumuyordu.
 */
export default function AjandaTakvimi({
  notlar, journalGunleri, bugun, simdiMs, locale, onGunAc, onKaydaGit, onTamamlaDegistir,
}: {
  notlar: NotepadNote[];
  /** Gün sonu değerlendirmesi yazılmış günler; takvimde fuşya nokta olarak. */
  journalGunleri: Set<string>;
  bugun: string;
  simdiMs: number;
  locale: string;
  onGunAc: (gun: string) => void;
  onKaydaGit: (not: NotepadNote) => void;
  onTamamlaDegistir: (id: string) => void;
}) {
  const { t } = useTranslation();

  const [viewedYear, setViewedYear] = useState(() => new Date().getFullYear());
  const [viewedMonth, setViewedMonth] = useState(() => new Date().getMonth());

  const datesWithEntries = useMemo(() => {
    const set = new Set<string>();
    notlar.forEach(n => set.add(getEntryDateKey(n)));
    return set;
  }, [notlar]);

  // "Tüm kayıtlar" listesi: bitiş anı geçmiş işler burada görünmez, sadece takvimden o güne
  // tıklanınca açılan gün ekranında durmaya devam eder. Devam eden iş geçmiş sayılmaz.
  const upcomingEntriesSorted = useMemo(() => {
    return [...notlar].filter(n => !isEntryPast(n, simdiMs)).sort((a, b) => {
      const dateA = getEntryDateKey(a);
      const dateB = getEntryDateKey(b);
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      if (!a.startTime && !b.startTime) return a.createdAt - b.createdAt;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [notlar, simdiMs]);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2023, 0, 2);
    const labels: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      labels.push(new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d));
    }
    return labels;
  }, [locale]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(viewedYear, viewedMonth, 1));
  }, [locale, viewedYear, viewedMonth]);

  const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewedYear, viewedMonth, 1).getDay();
  const leadingOffset = (firstWeekday + 6) % 7;

  const goToPrevMonth = () => {
    if (viewedMonth === 0) { setViewedMonth(11); setViewedYear(y => y - 1); }
    else setViewedMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewedMonth === 11) { setViewedMonth(0); setViewedYear(y => y + 1); }
    else setViewedMonth(m => m + 1);
  };

  return (
          <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPrevMonth}
                  aria-label={t('notepad_prev_month')}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                  {monthLabel}
                </h2>
                <button
                  onClick={goToNextMonth}
                  aria-label={t('notepad_next_month')}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500 mb-2">
                {weekdayLabels.map((w, i) => <span key={i} className="uppercase">{w}</span>)}
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                {Array.from({ length: leadingOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateKey = formatDateKey(new Date(viewedYear, viewedMonth, dayNum));
                  const isToday = dateKey === bugun;
                  const hasEntries = datesWithEntries.has(dateKey);
                  return (
                    <button
                      key={dateKey}
                      onClick={() => onGunAc(dateKey)}
                      aria-label={dateKey}
                      className={clsx(
                        "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm transition-colors border",
                        isToday
                          ? "border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "border-transparent bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600"
                      )}
                    >
                      <span>{dayNum}</span>
                      {/* Mavi nokta: o güne ait iş var. Fuşya nokta: gün sonu değerlendirmesi yazılmış. */}
                      <span className="flex items-center gap-1 h-1.5">
                        {hasEntries && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        {journalGunleri.has(dateKey) && <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">{t('notepad_calendar_hint')}</p>

              {/* Noktaların ne anlama geldiği hiçbir yerde yazmıyordu; iki
                  ayrı renk vardı ve farkı yalnızca ikisini de kullanan biri
                  zamanla çıkarabiliyordu. */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {t('notepad_legend_entries')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                  {t('notepad_legend_journal')}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t('notepad_all_entries_title')}</p>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pe-1">
                {upcomingEntriesSorted.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500">{t('notepad_no_upcoming_entries')}</p>
                )}
                {upcomingEntriesSorted.map(entry => {
                  const dateKey = getEntryDateKey(entry);
                  const [ey, em, ed] = dateKey.split('-').map(Number);
                  const shortDateLabel = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(ey, em - 1, ed));
                  return (
                    <div
                      key={entry.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onKaydaGit(entry)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onKaydaGit(entry);
                        }
                      }}
                      className={clsx(
                        "group relative w-full flex items-start text-start p-3 rounded-xl border transition-colors",
                        entry.isCompleted
                          ? "bg-slate-50 dark:bg-slate-800/30 border-transparent opacity-60"
                          : "bg-white dark:bg-slate-800/80 border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTamamlaDegistir(entry.id);
                        }}
                        className="mt-1 mr-3 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all text-transparent hover:text-indigo-500"
                      >
                        {entry.isCompleted ? (
                          <div className="w-full h-full bg-indigo-500 rounded-full flex items-center justify-center text-white">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <svg className="w-3 h-3 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{shortDateLabel}</span>
                          <span className={clsx(
                            "inline-block text-xs font-medium rounded-full px-2 py-0.5",
                            entry.isCompleted ? "text-slate-400 bg-slate-100 dark:bg-slate-700" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                          )}>
                            {entry.startTime ? `${entry.startTime}–${entry.endTime}` : t('notepad_all_day')}
                          </span>
                        </div>
                        <p className={clsx(
                          "text-sm truncate pe-6",
                          entry.isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-600 dark:text-slate-300"
                        )}>
                          {entry.title && (
                            <span className="font-bold me-2">{entry.title}</span>
                          )}
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
  );
}

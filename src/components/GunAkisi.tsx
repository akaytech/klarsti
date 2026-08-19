import { useTranslation } from 'react-i18next';
import { Trash2, CalendarArrowUp } from 'lucide-react';
import clsx from 'clsx';
import type { NotepadNote } from '../store/useRoadmapStore';

/**
 * Açık günün kayıt listesi. Bir kayda tıklamak onu yazma formuna alıyor,
 * yani seçili kaydı vurgulamak için düzenlenen kaydın kimliğini biliyor.
 *
 * "Bugüne çek" düğmesi yalnızca geçmiş günlerde ve tamamlanmamış kayıtlarda:
 * geçmişte kalmış bir iş orada unutulmasın diye.
 */
export default function GunAkisi({
  kayitlar, gun, bugun, gecmisGun, duzenlenenId, onKaydaTikla, onTamamlaDegistir, onBuguneCek, onSil,
}: {
  kayitlar: NotepadNote[];
  gun: string;
  bugun: string;
  gecmisGun: boolean;
  duzenlenenId: string | null;
  onKaydaTikla: (not: NotepadNote) => void;
  onTamamlaDegistir: (id: string) => void;
  onBuguneCek: (e: React.MouseEvent, not: NotepadNote) => void;
  onSil: (e: React.MouseEvent, id: string) => void;
}) {
  const { t } = useTranslation();

  return (
              <div className="order-first lg:order-none">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {gun === bugun ? t('notepad_today_flow') : t('notepad_day_flow')}
                </p>
                <div className="space-y-2">
                  {kayitlar.length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-500">{t('notepad_no_entries_today')}</p>
                  )}
                  {kayitlar.map(entry => (
                    <div
                      key={entry.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onKaydaTikla(entry)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onKaydaTikla(entry);
                        }
                      }}
                      className={clsx(
                        "group relative w-full flex items-start text-start p-3 rounded-xl border cursor-pointer transition-colors",
                        duzenlenenId === entry.id
                          ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30"
                          : entry.isCompleted
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
                        <span className={clsx(
                          "inline-block text-xs font-medium rounded-full px-2 py-0.5 mb-1.5",
                          entry.isCompleted ? "text-slate-400 bg-slate-100 dark:bg-slate-700" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        )}>
                          {entry.startTime ? `${entry.startTime}–${entry.endTime}` : t('notepad_all_day')}
                        </span>
                        <p className={clsx(
                          "text-sm truncate",
                          gecmisGun && !entry.isCompleted ? "pe-16" : "pe-6",
                          entry.isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-600 dark:text-slate-300"
                        )}>
                          {entry.title && (
                            <span className="font-bold me-2">{entry.title}</span>
                          )}
                          {entry.content}
                        </p>
                      </div>
                      <div className="absolute end-2 top-2 flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        {gecmisGun && !entry.isCompleted && (
                          <button
                            onClick={(e) => onBuguneCek(e, entry)}
                            aria-label={t('notepad_move_to_today')}
                            title={t('notepad_move_to_today')}
                            className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                          >
                            <CalendarArrowUp className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => onSil(e, entry.id)}
                          aria-label={t('notepad_delete_note')}
                          className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  );
}

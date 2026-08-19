import { useTranslation } from 'react-i18next';
import { Plus, Clock, ArrowRight, AlertTriangle, Bell, CalendarDays } from 'lucide-react';
import clsx from 'clsx';
import { addOneHour } from '../utils/timeRange';
import type { AjandaYaziciDurumu } from '../utils/ajandaYazici';

/**
 * Ajandanın yazma formu: başlık, metin, saat aralığı, hatırlatma, kaydet.
 *
 * Durumu kendi tutmuyor (bkz. utils/ajandaYazici.ts): listeden bir kayda
 * tıklamak da, kaydı silmek de, güne geçmek de formu dışarıdan sürüyor.
 * Burası yalnızca çiziyor.
 */
export default function AjandaYazici({ yazici }: { yazici: AjandaYaziciDurumu }) {
  const { t } = useTranslation();
  const {
    editingNoteId, useTimeRange, setUseTimeRange, startTime, setStartTime,
    endTime, setEndTime, reminderMinutesBefore, setReminderMinutesBefore,
    draftTitle, setDraftTitle, draftText, setDraftText, draftDate, setDraftDate,
    conflictingNote, blockNewEntryOnPastDay, blockMoveToPast, isPastTimeRange,
    saveBlocked, resetComposer, handleSave,
  } = yazici;

  if (blockNewEntryOnPastDay) {
    return (
      <div className="flex items-start gap-2 h-fit rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{t('notepad_past_day_notice')}</span>
      </div>
    );
  }

  return (
              <div>
                {editingNoteId && draftDate && (
                  <div className="mb-3">
                    <div className={clsx(
                      "flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/80 p-2.5 shadow-sm border transition-colors",
                      blockMoveToPast ? "border-red-300 dark:border-red-500/50" : "border-transparent"
                    )}>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2">
                        <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <input
                          type="date"
                          value={draftDate}
                          onChange={(e) => { if (e.target.value) setDraftDate(e.target.value); }}
                          aria-label={t('notepad_entry_date')}
                          className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    {blockMoveToPast && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-2 text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{t('notepad_move_to_past_error')}</span>
                      </div>
                    )}
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <input
                    type="checkbox"
                    checked={useTimeRange}
                    onChange={(e) => setUseTimeRange(e.target.checked)}
                    className="rounded"
                  />
                  {t('notepad_use_time_range')}
                </label>

                {useTimeRange && (
                  <div className="mb-3">
                    <div className={clsx(
                      "flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/80 p-2.5 shadow-sm border transition-colors",
                      conflictingNote || isPastTimeRange ? "border-red-300 dark:border-red-500/50" : "border-transparent"
                    )}>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStartTime(val);
                            if (endTime <= val) {
                              setEndTime(addOneHour(val));
                            }
                          }}
                          className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 rtl:rotate-180" />
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <input
                          type="time"
                          value={endTime}
                          min={startTime}
                          onChange={(e) => {
                            if (e.target.value > startTime) setEndTime(e.target.value);
                          }}
                          className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    {conflictingNote && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-2 text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{t('notepad_time_conflict', { title: conflictingNote.title || t('notepad_untitled_note') })}</span>
                      </div>
                    )}
                    {isPastTimeRange && !conflictingNote && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-2 text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{t('notepad_past_time_error')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <select
                        value={reminderMinutesBefore ?? ''}
                        onChange={(e) => setReminderMinutesBefore(e.target.value === '' ? null : Number(e.target.value))}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
                      >
                        <option value="">{t('notepad_reminder_off')}</option>
                        <option value="0">{t('notepad_reminder_at_time')}</option>
                        <option value="5">{t('notepad_reminder_5min')}</option>
                        <option value="15">{t('notepad_reminder_15min')}</option>
                        <option value="30">{t('notepad_reminder_30min')}</option>
                        <option value="60">{t('notepad_reminder_1hour')}</option>
                        <option value="1440">{t('notepad_reminder_1day')}</option>
                      </select>
                    </div>
                    {/* Şu an bildirimi zamanlayan bir istemci yok; mobil uygulama
                        sıfırdan yeniden yazılacak. Kurulan hatırlatma yine de
                        kaydediliyor, gelecekteki uygulama bu veriyi okuyup
                        zamanlayacak. */}
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      {t('notepad_reminder_mobile_only')}
                    </p>
                  </div>
                )}

                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder={t('notepad_write_title', { defaultValue: 'Başlık (İsteğe bağlı)' })}
                  className="w-full mb-3 rounded-xl border-none bg-white dark:bg-slate-800/80 px-4 py-3 text-lg font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none shadow-sm"
                />

                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder={t('notepad_write_placeholder')}
                  // Dar ekranda alçak: orada bu alan tek başına bütün ekranı
                  // kaplıyordu. Geniş ekranda yan sütunda durduğu için 55vh
                  // kimseyi rahatsız etmiyor, oradaki boy korunuyor.
                  className="w-full min-h-[30vh] lg:min-h-[55vh] rounded-xl border-none bg-white dark:bg-slate-800/80 p-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 outline-none resize-y custom-scrollbar shadow-sm"
                />

                <div className="flex items-center justify-between mt-3">
                  {editingNoteId && (
                    <button
                      onClick={() => resetComposer()}
                      className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {t('notepad_new_entry')}
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saveBlocked}
                    className={clsx(
                      "ms-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors",
                      saveBlocked
                        ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    {t('notepad_save')}
                  </button>
                </div>
              </div>
  );
}

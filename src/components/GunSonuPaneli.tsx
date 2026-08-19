import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useRoadmapStore } from '../store/useRoadmapStore';

/**
 * Gün sonu değerlendirmesi paneli.
 *
 * Deposunu kendi okuyor: metin, o günün yüklenip yüklenmediği, kaydediliyor/
 * kaydedildi göstergeleri ve yükleme hatası — altı alan yalnızca burada
 * kullanılıyor. Ekran dosyası bunları taşıyıp durmasın diye buraya alındı.
 *
 * Değerlendirmeler günlere ayrı belgelerde duruyor; panel açılınca o günün
 * metni sunucudan bir kez çekiliyor.
 */
export default function GunSonuPaneli({ gun }: { gun: string }) {
  const { t } = useTranslation();

  const { journal, journalLoadedDates, journalSavingDates, journalSavedDates, journalLoadError,
          setJournalText, loadJournalDay } = useRoadmapStore(useShallow((state) => ({
    journal: state.journal,
    journalLoadedDates: state.journalLoadedDates,
    journalSavingDates: state.journalSavingDates,
    journalSavedDates: state.journalSavedDates,
    journalLoadError: state.journalLoadError,
    setJournalText: state.setJournalText,
    loadJournalDay: state.loadJournalDay
  })));

  // Panel açıldığında o günün metni sunucudan bir kez çekilir.
  useEffect(() => {
    loadJournalDay(gun);
  }, [gun, loadJournalDay]);

  const journalText = journal[gun]?.text ?? '';
  const journalDayLoaded = journalLoadedDates.includes(gun);
  // Gösterge yalnızca açık günü anlatır: başka bir günün kaydı sürerken ya da
  // bitmişken bu güne "kaydediliyor"/"kaydedildi" yazılmaz.
  const journalDaySaving = journalSavingDates.includes(gun);
  const journalDaySaved = journalSavedDates.includes(gun);

  return (
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('journal_hint')}</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      {journalDaySaving ? t('journal_saving') : (journalDaySaved ? t('journal_saved') : '')}
                    </span>
                  </div>
                  {journalLoadError === gun ? (
                    <div className="w-full min-h-[55vh] rounded-xl bg-white dark:bg-slate-800/80 shadow-sm flex flex-col items-center justify-center gap-3 p-6 text-center">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('journal_load_failed')}</p>
                      <button
                        onClick={() => loadJournalDay(gun)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                      >
                        {t('journal_retry')}
                      </button>
                    </div>
                  ) : journalDayLoaded ? (
                    <textarea
                      value={journalText}
                      onChange={(e) => setJournalText(gun, e.target.value)}
                      placeholder={t('journal_placeholder')}
                      className="w-full min-h-[55vh] rounded-xl border-none bg-white dark:bg-slate-800/80 p-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 outline-none resize-y custom-scrollbar shadow-sm"
                    />
                  ) : (
                    <div className="w-full min-h-[55vh] rounded-xl bg-white dark:bg-slate-800/80 shadow-sm flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-500"></div>
                    </div>
                  )}
                </div>
  );
}

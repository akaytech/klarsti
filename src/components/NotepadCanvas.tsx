import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarDays, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import type { NotepadNote } from '../store/useRoadmapStore';
import ConfirmModal from './ConfirmModal';
import AjandaTakvimi from './AjandaTakvimi';
import AjandaYazici from './AjandaYazici';
import GunAkisi from './GunAkisi';
import GunSonuPaneli from './GunSonuPaneli';
import { useAjandaYazici } from '../utils/ajandaYazici';
import { formatDateKey, getEntryDateKey, canKeepTimeOnMove } from '../utils/notepadTime';

/**
 * Ajanda. Burası artık yalnızca hangi ekranın açık olduğuna karar veriyor:
 * takvim mi, bir günün içi mi, o günün gün sonu değerlendirmesi mi.
 *
 * Ekranların kendisi ayrı dosyalarda:
 *   AjandaTakvimi    ay ızgarası + yaklaşan kayıtlar
 *   AjandaYazici     yazma formu (durumu utils/ajandaYazici.ts'te)
 *   GunAkisi         açık günün kayıt listesi
 *   GunSonuPaneli    gün sonu değerlendirmesi
 *
 * Hepsi tek dosyadaydı: 795 satır ve on beş ayrı durum. Bu boyutta küçük bir
 * değişiklik yaparken alakasız bir yeri bozmak kolaydı.
 */
const NotepadCanvas: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  // Ajanda kişisel: veriler projeden değil, doğrudan kullanıcı deposundan gelir.
  const { notes, addNotepadNote, updateNotepadNote, deleteNotepadNote, toggleNotepadNoteCompletion,
          journalDates } = useRoadmapStore(useShallow((state) => ({
    notes: state.notepad,
    addNotepadNote: state.addNotepadNote,
    updateNotepadNote: state.updateNotepadNote,
    deleteNotepadNote: state.deleteNotepadNote,
    toggleNotepadNoteCompletion: state.toggleNotepadNoteCompletion,
    journalDates: state.journalDates
  })));

  // Dakikada bir tazelenir; süresi dolan işler listeden kendiliğinden düşsün diye.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  // Gün sonu değerlendirmesi panelinin açık olup olmadığı.
  const [journalOpen, setJournalOpen] = useState(false);

  const journalDateSet = useMemo(() => new Set(journalDates), [journalDates]);
  const nowMs = now.getTime();
  const todayKey = formatDateKey(now);
  // Değerlendirme geçmiş ve bugün için yazılır; henüz yaşanmamış günün değerlendirmesi olmaz.
  const canWriteJournal = selectedDate !== null && selectedDate <= todayKey;

  const yazici = useAjandaYazici({
    notlar: notes,
    seciliGun: selectedDate,
    bugun: todayKey,
    simdiMs: nowMs,
    notEkle: addNotepadNote,
    notGuncelle: updateNotepadNote,
    guneGit: setSelectedDate,
  });

  const openDay = (dateKey: string) => {
    setSelectedDate(dateKey);
    setJournalOpen(false);
    yazici.resetComposer(dateKey);
  };

  const backToCalendar = () => {
    setSelectedDate(null);
    setJournalOpen(false);
    yazici.resetComposer();
  };

  // Gün ekranında komşu güne geçiş. Eskiden tek yol takvime dönüp başka bir
  // güne tıklamaktı; ardışık günlere bakmak (dün ne yapmıştım, yarın ne var)
  // her seferinde iki ekran değiştirmek demekti.
  //
  // Ay/yıl taşması new Date'in kendi işi: 31 Ağustos + 1 gün 1 Eylül'e,
  // 1 Ocak - 1 gün önceki yılın 31 Aralık'ına düşüyor.
  const gunKaydir = (fark: number) => {
    if (!selectedDate) return;
    const [yil, ay, gun] = selectedDate.split('-').map(Number);
    const yeniGun = formatDateKey(new Date(yil, ay - 1, gun + fark));
    // Günlük paneli açıksa açık kalsın: kullanıcı büyük ihtimalle günleri
    // tam da değerlendirmeleri okumak için çeviriyor. Ama gelecek bir güne
    // geçilirse kapanmalı; yaşanmamış günün değerlendirmesi yazılamıyor.
    const gunlukAcikKalsin = journalOpen && yeniGun <= todayKey;
    openDay(yeniGun);
    if (gunlukAcikKalsin) setJournalOpen(true);
  };

  const openEntryForEdit = (note: NotepadNote) => {
    setSelectedDate(getEntryDateKey(note));
    setJournalOpen(false);
    yazici.startEditingEntry(note);
  };

  // Geçmiş günde kalmış bir işi tek tıkla bugüne çeker. Saati bugün için geçmişse
  // ya da doluysa iş gün boyu olarak taşınır, sessizce kaybolmasın diye.
  const moveEntryToToday = (e: React.MouseEvent, entry: NotepadNote) => {
    e.stopPropagation();
    const keepTime = canKeepTimeOnMove(notes, entry, todayKey, nowMs);
    updateNotepadNote(
      entry.id,
      entry.title || '',
      entry.content || '',
      keepTime ? entry.startTime! : null,
      keepTime ? entry.endTime! : null,
      keepTime ? (entry.reminderMinutesBefore ?? null) : null,
      todayKey
    );
    if (yazici.editingNoteId === entry.id) yazici.resetComposer(todayKey);
    toast.success(keepTime ? t('notepad_moved_to_today') : t('notepad_moved_to_today_all_day'));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteNotepadNote(deleteTargetId);
    if (yazici.editingNoteId === deleteTargetId) yazici.resetComposer();
    setDeleteTargetId(null);
  };

  const dayEntries = useMemo(() => {
    if (!selectedDate) return [];
    const list = notes.filter(n => getEntryDateKey(n) === selectedDate);
    const untimed = list.filter(n => !n.startTime).sort((a, b) => a.createdAt - b.createdAt);
    const timed = list.filter(n => n.startTime).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    return [...untimed, ...timed];
  }, [notes, selectedDate]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
  }, [selectedDate, locale]);

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-y-auto text-slate-800 dark:text-slate-200 pt-16 md:pt-20">
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {selectedDate === null ? (
          <AjandaTakvimi
            notlar={notes}
            journalGunleri={journalDateSet}
            bugun={todayKey}
            simdiMs={nowMs}
            locale={locale}
            onGunAc={openDay}
            onKaydaGit={openEntryForEdit}
            onTamamlaDegistir={toggleNotepadNoteCompletion}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={backToCalendar}
                aria-label={t('notepad_back_to_calendar')}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              </button>

              {/* Gün okları takvimdeki ay oklarıyla birebir aynı biçimde:
                  kullanıcı o düzeni bir ekran önce zaten gördü. Geri oku
                  gövdeli, bunlar ince şevron — yan yana dursalar da farklı
                  okunuyorlar. */}
              <button
                onClick={() => gunKaydir(-1)}
                aria-label={t('notepad_prev_day', { defaultValue: 'Previous day' })}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                {selectedDateLabel}
              </h2>
              <button
                onClick={() => gunKaydir(1)}
                aria-label={t('notepad_next_day', { defaultValue: 'Next day' })}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>

              {/* Yalnızca başka bir gündeyken görünüyor. Oklarla on gün
                  uzaklaşan biri geri dönmek için on tık ya da takvime çıkıp
                  tekrar girmek zorundaydı. */}
              {selectedDate !== todayKey && (
                <button
                  onClick={() => openDay(todayKey)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('notepad_today', { defaultValue: 'Today' })}</span>
                </button>
              )}
              {canWriteJournal && (
                <button
                  onClick={() => setJournalOpen(o => !o)}
                  aria-pressed={journalOpen}
                  className={clsx(
                    "ms-auto flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
                    journalOpen
                      ? "bg-fuchsia-100 dark:bg-fuchsia-900/40 border-fuchsia-300 dark:border-fuchsia-700 text-fuchsia-700 dark:text-fuchsia-300"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  <NotebookPen className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('journal_title')}</span>
                  {journalDateSet.has(selectedDate) && !journalOpen && (
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {journalOpen ? (
                <GunSonuPaneli gun={selectedDate} />
              ) : (
                <AjandaYazici yazici={yazici} />
              )}

              {/* Dar ekranda gün akışı yazma alanının ÜSTÜNE geçiyor: iki sütun
                  alt alta dizilince yazma alanı (55vh) bütün ekranı kaplıyor ve
                  kullanıcı o gün ne yazdığını görmek için aşağı kaydırmak
                  zorunda kalıyordu. Geniş ekranda ikisi yan yana, sıra değişmiyor. */}
              <GunAkisi
                kayitlar={dayEntries}
                gun={selectedDate}
                bugun={todayKey}
                gecmisGun={yazici.isPastDay}
                duzenlenenId={yazici.editingNoteId}
                onKaydaTikla={yazici.startEditingEntry}
                onTamamlaDegistir={toggleNotepadNoteCompletion}
                onBuguneCek={moveEntryToToday}
                onSil={handleDelete}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title={t('notepad_delete_note')}
        message={t('notepad_delete_confirm_msg')}
      />
    </div>
  );
};

export default NotepadCanvas;

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ChevronLeft, ChevronRight, ArrowLeft, Clock, ArrowRight, AlertTriangle, Bell, CalendarDays, CalendarArrowUp, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import type { NotepadNote } from '../store/useRoadmapStore';
import ConfirmModal from './ConfirmModal';
import { addOneHour } from '../utils/timeRange';
import { formatDateKey, getEntryDateKey, isEntryPast, timeOnDateMs, nextHalfHour, findConflictingNote, canKeepTimeOnMove } from '../utils/notepadTime';



const NotepadCanvas: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  // Ajanda kişisel: veriler projeden değil, doğrudan kullanıcı deposundan gelir.
  const { notes, addNotepadNote, updateNotepadNote, deleteNotepadNote, toggleNotepadNoteCompletion,
          journal, journalDates, journalLoadedDates, journalSavingDates, journalSavedDates, journalLoadError, setJournalText, loadJournalDay } = useRoadmapStore(useShallow((state) => ({
    notes: state.notepad,
    addNotepadNote: state.addNotepadNote,
    updateNotepadNote: state.updateNotepadNote,
    deleteNotepadNote: state.deleteNotepadNote,
    toggleNotepadNoteCompletion: state.toggleNotepadNoteCompletion,
    journal: state.journal,
    journalDates: state.journalDates,
    journalLoadedDates: state.journalLoadedDates,
    journalSavingDates: state.journalSavingDates,
    journalSavedDates: state.journalSavedDates,
    journalLoadError: state.journalLoadError,
    setJournalText: state.setJournalText,
    loadJournalDay: state.loadJournalDay
  })));

  // Dakikada bir tazelenir; süresi dolan işler listeden kendiliğinden düşsün diye.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const [viewedYear, setViewedYear] = useState(() => now.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(() => now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftText, setDraftText] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  // Formun hedef günü. Yeni kayıtta seçili gün, düzenlemede işin günü; değiştirilirse iş taşınır.
  const [draftDate, setDraftDate] = useState<string | null>(null);
  // Gün sonu değerlendirmesi panelinin açık olup olmadığı.
  const [journalOpen, setJournalOpen] = useState(false);

  const journalDateSet = useMemo(() => new Set(journalDates), [journalDates]);
  const journalText = selectedDate ? (journal[selectedDate]?.text ?? '') : '';
  const journalDayLoaded = selectedDate ? journalLoadedDates.includes(selectedDate) : false;
  // Gösterge yalnızca açık günü anlatır: başka bir günün kaydı sürerken ya da
  // bitmişken bu güne "kaydediliyor"/"kaydedildi" yazılmaz.
  const journalDaySaving = selectedDate ? journalSavingDates.includes(selectedDate) : false;
  const journalDaySaved = selectedDate ? journalSavedDates.includes(selectedDate) : false;

  // Panel açıldığında o günün metni sunucudan bir kez çekilir.
  useEffect(() => {
    if (journalOpen && selectedDate) loadJournalDay(selectedDate);
  }, [journalOpen, selectedDate, loadJournalDay]);

  const datesWithEntries = useMemo(() => {
    const set = new Set<string>();
    notes.forEach(n => set.add(getEntryDateKey(n)));
    return set;
  }, [notes]);

  const nowMs = now.getTime();

  // "Tüm kayıtlar" listesi: bitiş anı geçmiş işler burada görünmez, sadece takvimden o güne
  // tıklanınca açılan gün ekranında durmaya devam eder. Devam eden iş geçmiş sayılmaz.
  const upcomingEntriesSorted = useMemo(() => {
    return [...notes].filter(n => !isEntryPast(n, nowMs)).sort((a, b) => {
      const dateA = getEntryDateKey(a);
      const dateB = getEntryDateKey(b);
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      if (!a.startTime && !b.startTime) return a.createdAt - b.createdAt;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [notes, nowMs]);

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

  const todayKey = formatDateKey(now);
  // Değerlendirme geçmiş ve bugün için yazılır; henüz yaşanmamış günün değerlendirmesi olmaz.
  const canWriteJournal = selectedDate !== null && selectedDate <= todayKey;

  const goToPrevMonth = () => {
    if (viewedMonth === 0) { setViewedMonth(11); setViewedYear(y => y - 1); }
    else setViewedMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewedMonth === 11) { setViewedMonth(0); setViewedYear(y => y + 1); }
    else setViewedMonth(m => m + 1);
  };

  const resetComposer = (dateKey: string | null = selectedDate) => {
    setEditingNoteId(null);
    setDraftTitle('');
    setDraftText('');
    setDraftDate(dateKey);
    setUseTimeRange(false);
    const start = dateKey === todayKey ? nextHalfHour(new Date()) : '09:00';
    const end = addOneHour(start);
    setStartTime(start);
    setEndTime(end > start ? end : '23:59');
    setReminderMinutesBefore(null);
  };

  const openDay = (dateKey: string) => {
    setSelectedDate(dateKey);
    setJournalOpen(false);
    resetComposer(dateKey);
  };

  const backToCalendar = () => {
    setSelectedDate(null);
    setJournalOpen(false);
    resetComposer();
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

  const startEditingEntry = (note: NotepadNote) => {
    setEditingNoteId(note.id);
    setDraftTitle(note.title || '');
    setDraftText(note.content || '');
    setDraftDate(getEntryDateKey(note));
    if (note.startTime) {
      setUseTimeRange(true);
      setStartTime(note.startTime);
      setEndTime(note.endTime || note.startTime);
      setReminderMinutesBefore(note.reminderMinutesBefore ?? null);
    } else {
      setUseTimeRange(false);
      setReminderMinutesBefore(null);
    }
  };

  const openEntryForEdit = (note: NotepadNote) => {
    setSelectedDate(getEntryDateKey(note));
    setJournalOpen(false);
    startEditingEntry(note);
  };

  // Çakışma hedef güne göre kontrol edilir; iş başka güne taşınıyorsa o günün işleriyle.
  const conflictingNote = useMemo(() => {
    if (!useTimeRange || !draftDate) return null;
    return findConflictingNote(notes, draftDate, startTime, endTime, editingNoteId);
  }, [useTimeRange, draftDate, startTime, endTime, notes, editingNoteId]);

  const editingNote = useMemo(
    () => editingNoteId ? notes.find(n => n.id === editingNoteId) || null : null,
    [notes, editingNoteId]
  );
  // Düzenlerken gün değiştirildiyse iş taşınıyor demektir.
  const isMovingEntry = !!editingNote && !!draftDate && draftDate !== getEntryDateKey(editingNote);

  // Geçmişe yeni iş eklenemez, mevcut iş de geçmişe taşınamaz.
  // Yerinde düzenleme (gün değişmeden) engellenmez.
  const isPastDay = selectedDate !== null && selectedDate < todayKey;
  const blockNewEntryOnPastDay = isPastDay && !editingNoteId;
  const blockMoveToPast = isMovingEntry && !!draftDate && draftDate < todayKey;

  const isPastTimeRange = useMemo(() => {
    if (!useTimeRange || !draftDate) return false;
    if (editingNoteId && !isMovingEntry) return false;
    return timeOnDateMs(draftDate, endTime) < nowMs;
  }, [useTimeRange, draftDate, endTime, editingNoteId, isMovingEntry, nowMs]);

  const saveBlocked = blockNewEntryOnPastDay || blockMoveToPast || isPastTimeRange || (useTimeRange && !!conflictingNote);

  const handleSave = () => {
    const title = draftTitle.trim();
    const text = draftText.trim();
    if (!title && !text) return;
    if (!draftDate) return;
    if (saveBlocked) return;
    const start = useTimeRange ? startTime : null;
    const end = useTimeRange ? endTime : null;
    const reminder = useTimeRange ? reminderMinutesBefore : null;
    if (editingNoteId) {
      updateNotepadNote(editingNoteId, title, text, start, end, reminder, draftDate);
      // Taşınan işin peşinden git ki kullanıcı nereye gittiğini görsün.
      if (isMovingEntry) setSelectedDate(draftDate);
    } else {
      addNotepadNote(draftDate, title, text, start, end, undefined, reminder);
    }
    resetComposer(draftDate);
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
    if (editingNoteId === entry.id) resetComposer(todayKey);
    toast.success(keepTime ? t('notepad_moved_to_today') : t('notepad_moved_to_today_all_day'));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteNotepadNote(deleteTargetId);
    if (editingNoteId === deleteTargetId) resetComposer();
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
                  const isToday = dateKey === todayKey;
                  const hasEntries = datesWithEntries.has(dateKey);
                  return (
                    <button
                      key={dateKey}
                      onClick={() => openDay(dateKey)}
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
                        {journalDateSet.has(dateKey) && <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />}
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
                      onClick={() => openEntryForEdit(entry)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openEntryForEdit(entry);
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
                          toggleNotepadNoteCompletion(entry.id);
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
                  {journalDateSet.has(selectedDate!) && !journalOpen && (
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {journalOpen ? (
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('journal_hint')}</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      {journalDaySaving ? t('journal_saving') : (journalDaySaved ? t('journal_saved') : '')}
                    </span>
                  </div>
                  {journalLoadError === selectedDate ? (
                    <div className="w-full min-h-[55vh] rounded-xl bg-white dark:bg-slate-800/80 shadow-sm flex flex-col items-center justify-center gap-3 p-6 text-center">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('journal_load_failed')}</p>
                      <button
                        onClick={() => { if (selectedDate) loadJournalDay(selectedDate); }}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                      >
                        {t('journal_retry')}
                      </button>
                    </div>
                  ) : journalDayLoaded ? (
                    <textarea
                      value={journalText}
                      onChange={(e) => { if (selectedDate) setJournalText(selectedDate, e.target.value); }}
                      placeholder={t('journal_placeholder')}
                      className="w-full min-h-[55vh] rounded-xl border-none bg-white dark:bg-slate-800/80 p-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 outline-none resize-y custom-scrollbar shadow-sm"
                    />
                  ) : (
                    <div className="w-full min-h-[55vh] rounded-xl bg-white dark:bg-slate-800/80 shadow-sm flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-500"></div>
                    </div>
                  )}
                </div>
              ) : blockNewEntryOnPastDay ? (
                <div className="flex items-start gap-2 h-fit rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t('notepad_past_day_notice')}</span>
                </div>
              ) : (
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
              )}

              {/* Dar ekranda gün akışı yazma alanının ÜSTÜNE geçiyor: iki sütun
                  alt alta dizilince yazma alanı (55vh) bütün ekranı kaplıyor ve
                  kullanıcı o gün ne yazdığını görmek için aşağı kaydırmak
                  zorunda kalıyordu. Geniş ekranda ikisi yan yana, sıra değişmiyor. */}
              <div className="order-first lg:order-none">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {selectedDate === todayKey ? t('notepad_today_flow') : t('notepad_day_flow')}
                </p>
                <div className="space-y-2">
                  {dayEntries.length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-500">{t('notepad_no_entries_today')}</p>
                  )}
                  {dayEntries.map(entry => (
                    <div
                      key={entry.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => startEditingEntry(entry)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          startEditingEntry(entry);
                        }
                      }}
                      className={clsx(
                        "group relative w-full flex items-start text-start p-3 rounded-xl border cursor-pointer transition-colors",
                        editingNoteId === entry.id
                          ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30"
                          : entry.isCompleted
                            ? "bg-slate-50 dark:bg-slate-800/30 border-transparent opacity-60"
                            : "bg-white dark:bg-slate-800/80 border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotepadNoteCompletion(entry.id);
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
                          isPastDay && !entry.isCompleted ? "pe-16" : "pe-6",
                          entry.isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-600 dark:text-slate-300"
                        )}>
                          {entry.title && (
                            <span className="font-bold me-2">{entry.title}</span>
                          )}
                          {entry.content}
                        </p>
                      </div>
                      <div className="absolute end-2 top-2 flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        {isPastDay && !entry.isCompleted && (
                          <button
                            onClick={(e) => moveEntryToToday(e, entry)}
                            aria-label={t('notepad_move_to_today')}
                            title={t('notepad_move_to_today')}
                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                          >
                            <CalendarArrowUp className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, entry.id)}
                          aria-label={t('notepad_delete_note')}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

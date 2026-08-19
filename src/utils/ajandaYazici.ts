import { useState, useMemo } from 'react';
import type { NotepadNote } from '../store/useRoadmapStore';
import { addOneHour } from './timeRange';
import { getEntryDateKey, timeOnDateMs, nextHalfHour, findConflictingNote } from './notepadTime';

/**
 * Ajandadaki yazma formunun durumu.
 *
 * Sekiz ayrı durum ve onlardan türeyen yedi kural tek bir ekran dosyasının
 * içinde duruyordu (795 satır). Form kendi başına anlaşılabilir bir şey:
 * bir taslak var, bir hedef gün var, ve kaydetmeyi engelleyen kurallar var.
 * Buraya alındı ki ekran dosyası yalnızca ne zaman ne göstereceğine baksın.
 *
 * Durum burada değil de bileşenin içinde dursaydı olmazdı: listeden bir kayda
 * tıklamak, kaydı silmek, güne geçmek — hepsi formu dışarıdan sıfırlıyor ya
 * da dolduruyor. Dışarıdan sürülebilmesi gerekiyor.
 */
export function useAjandaYazici(girdi: {
  notlar: NotepadNote[];
  /** Ekranda açık gün. Form kapalıyken null. */
  seciliGun: string | null;
  bugun: string;
  simdiMs: number;
  notEkle: (
    dateKey: string, title: string, text: string,
    start: string | null, end: string | null,
    _x: undefined, reminder: number | null,
  ) => void;
  notGuncelle: (
    id: string, title: string, text: string,
    start: string | null, end: string | null,
    reminder: number | null, dateKey: string,
  ) => void;
  /** Taşınan işin peşinden gitmek için: kayıt başka güne gittiyse ekran da gitsin. */
  guneGit: (gun: string) => void;
}) {
  const { notlar, seciliGun, bugun, simdiMs, notEkle, notGuncelle, guneGit } = girdi;

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftText, setDraftText] = useState('');
  // Formun hedef günü. Yeni kayıtta seçili gün, düzenlemede işin günü; değiştirilirse iş taşınır.
  const [draftDate, setDraftDate] = useState<string | null>(null);

  const resetComposer = (dateKey: string | null = seciliGun) => {
    setEditingNoteId(null);
    setDraftTitle('');
    setDraftText('');
    setDraftDate(dateKey);
    setUseTimeRange(false);
    const start = dateKey === bugun ? nextHalfHour(new Date()) : '09:00';
    const end = addOneHour(start);
    setStartTime(start);
    setEndTime(end > start ? end : '23:59');
    setReminderMinutesBefore(null);
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

  // Çakışma hedef güne göre kontrol edilir; iş başka güne taşınıyorsa o günün işleriyle.
  const conflictingNote = useMemo(() => {
    if (!useTimeRange || !draftDate) return null;
    return findConflictingNote(notlar, draftDate, startTime, endTime, editingNoteId);
  }, [useTimeRange, draftDate, startTime, endTime, notlar, editingNoteId]);

  const editingNote = useMemo(
    () => editingNoteId ? notlar.find(n => n.id === editingNoteId) || null : null,
    [notlar, editingNoteId]
  );
  // Düzenlerken gün değiştirildiyse iş taşınıyor demektir.
  const isMovingEntry = !!editingNote && !!draftDate && draftDate !== getEntryDateKey(editingNote);

  // Geçmişe yeni iş eklenemez, mevcut iş de geçmişe taşınamaz.
  // Yerinde düzenleme (gün değişmeden) engellenmez.
  const isPastDay = seciliGun !== null && seciliGun < bugun;
  const blockNewEntryOnPastDay = isPastDay && !editingNoteId;
  const blockMoveToPast = isMovingEntry && !!draftDate && draftDate < bugun;

  const isPastTimeRange = useMemo(() => {
    if (!useTimeRange || !draftDate) return false;
    if (editingNoteId && !isMovingEntry) return false;
    return timeOnDateMs(draftDate, endTime) < simdiMs;
  }, [useTimeRange, draftDate, endTime, editingNoteId, isMovingEntry, simdiMs]);

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
      notGuncelle(editingNoteId, title, text, start, end, reminder, draftDate);
      // Taşınan işin peşinden git ki kullanıcı nereye gittiğini görsün.
      if (isMovingEntry) guneGit(draftDate);
    } else {
      notEkle(draftDate, title, text, start, end, undefined, reminder);
    }
    resetComposer(draftDate);
  };

  return {
    editingNoteId, useTimeRange, setUseTimeRange,
    startTime, setStartTime, endTime, setEndTime,
    reminderMinutesBefore, setReminderMinutesBefore,
    draftTitle, setDraftTitle, draftText, setDraftText,
    draftDate, setDraftDate,
    conflictingNote, isPastDay, blockNewEntryOnPastDay, blockMoveToPast,
    isPastTimeRange, saveBlocked,
    resetComposer, startEditingEntry, handleSave,
  };
}

export type AjandaYaziciDurumu = ReturnType<typeof useAjandaYazici>;

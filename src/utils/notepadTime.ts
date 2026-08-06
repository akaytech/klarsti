import type { NotepadNote } from '../store/useRoadmapStore';
import { timeRangesOverlap } from './timeRange';

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getEntryDateKey(note: NotepadNote): string {
  if (note.date) return note.date;
  return formatDateKey(new Date(note.createdAt));
}

// Kaydın bittiği an. Saatli işlerde bitiş saati, saatsiz ("gün boyu") işlerde günün sonu.
export function getEntryEndMs(note: NotepadNote): number {
  const [y, m, d] = getEntryDateKey(note).split('-').map(Number);
  const endTime = note.endTime || note.startTime;
  if (endTime) {
    const [h, min] = endTime.split(':').map(Number);
    return new Date(y, m - 1, d, h, min).getTime();
  }
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
}

// Kayıt "geçmiş" mi? Bitiş anı geçtiyse evet; devam eden iş geçmiş sayılmaz.
export function isEntryPast(note: NotepadNote, nowMs: number): boolean {
  return getEntryEndMs(note) < nowMs;
}

// Belirli bir günde 'HH:mm' saatinin karşılık geldiği zaman damgası.
export function timeOnDateMs(dateKey: string, time: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return new Date(y, m - 1, d, h, min).getTime();
}

// Bugüne kayıt eklerken varsayılan başlangıç: şu andan sonraki ilk yarım saat.
// Gece yarısını aşacaksa aynı gün içinde kalsın diye 23:30'a sabitlenir.
export function nextHalfHour(from: Date): string {
  const d = new Date(from);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60);
  if (d.getDate() !== from.getDate()) return '23:30';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Hedef günde verilen saat aralığıyla çakışan ilk işi bulur (kendisi hariç).
export function findConflictingNote(
  notes: NotepadNote[],
  dateKey: string,
  start: string,
  end: string,
  excludeId: string | null
): NotepadNote | null {
  return notes.find(n =>
    n.id !== excludeId &&
    getEntryDateKey(n) === dateKey &&
    n.startTime && n.endTime &&
    timeRangesOverlap(start, end, n.startTime, n.endTime)
  ) || null;
}

// Bir iş başka güne taşınırken saati korunabilir mi? Saat hedef günde çoktan geçmişse
// ya da o saatte başka iş varsa korunmaz; iş "gün boyu" olarak taşınır ki kaybolmasın.
export function canKeepTimeOnMove(
  notes: NotepadNote[],
  entry: NotepadNote,
  targetDateKey: string,
  nowMs: number
): boolean {
  if (!entry.startTime || !entry.endTime) return false;
  if (timeOnDateMs(targetDateKey, entry.endTime) < nowMs) return false;
  return !findConflictingNote(notes, targetDateKey, entry.startTime, entry.endTime, entry.id);
}

// WBS'teki bir hedefin zamanı geçmiş mi? "Ajandaya Planla" bu kurala uyar:
// gün geçmişse, ya da o gün içindeki bitiş anı geçmişse planlanamaz.
// Saat verilmemişse gün boyu sayılır ve bugün için hâlâ planlanabilir.
export function isWbsTargetPast(
  targetDate: string | undefined,
  targetTime: string | undefined,
  targetEndTime: string | undefined,
  now: Date
): boolean {
  const todayKey = formatDateKey(now);
  const dateKey = targetDate || todayKey;
  if (dateKey < todayKey) return true;
  const end = targetEndTime || targetTime;
  return !!end && timeOnDateMs(dateKey, end) < now.getTime();
}

import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapState } from '../useRoadmapStore';
import { timeRangesOverlap } from '../../utils/timeRange';

export interface NotepadNote {
  id: string;
  title?: string;
  content: string;
  // 'YYYY-MM-DD' formatında yerel tarih. YENİ kayıtlarda HER ZAMAN dolu olmalı.
  // Bu alan eklenmeden ÖNCE oluşturulmuş eski kayıtlarda bulunmayabilir;
  // UI katmanı eksikse createdAt üzerinden türetir (bkz. NotepadCanvas.tsx: getEntryDateKey).
  date?: string;
  // 'HH:mm' formatında saat, ya da null (saat belirtilmemiş / gün boyu).
  startTime?: string | null;
  endTime?: string | null;
  isCompleted?: boolean;
  linkedWbsNodeId?: string;
  // Ajanda kişisel, WBS ise projeye ait. Bağlı düğümün hangi projede olduğunu
  // bilmezsek başka bir proje açıkken yanlış düğümü güncelleme riski var.
  linkedProjectId?: string;
  // Bildirim, startTime'dan kaç dakika önce gelsin. null/undefined = hatırlatma kapalı.
  // startTime yoksa (gün boyu not) anlamsızdır, UI'da gizlenir.
  reminderMinutesBefore?: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface NotepadSlice {
  notepad: NotepadNote[];
  addNotepadNote: (date: string, title: string, content: string, startTime: string | null, endTime: string | null, linkedWbsNodeId?: string, reminderMinutesBefore?: number | null) => string;
  // date verilirse iş o güne taşınır (erteleme). Verilmezse notun günü değişmez.
  updateNotepadNote: (noteId: string, title: string, content: string, startTime: string | null, endTime: string | null, reminderMinutesBefore?: number | null, date?: string) => void;
  deleteNotepadNote: (noteId: string) => void;
  toggleNotepadNoteCompletion: (noteId: string) => void;
  // WBS'ten Ajandaya aktarımda saat çakışması varsa yeni not oluşturmak yerine
  // mevcut notla birleştirir (bkz. GoalNode.tsx: onAddToAgenda).
  addOrMergeNotepadNoteFromWbs: (date: string, title: string, content: string, startTime: string | null, endTime: string | null, linkedWbsNodeId?: string) => void;
}

export const createNotepadSlice: StateCreator<
  RoadmapState,
  [],
  [],
  NotepadSlice
> = (set, get) => ({
  notepad: [],
  addNotepadNote: (date, title, content, startTime, endTime, linkedWbsNodeId, reminderMinutesBefore) => {
    const noteId = uuidv4();
    const newNote: NotepadNote = {
      id: noteId,
      date,
      title,
      content,
      startTime,
      endTime,
      linkedWbsNodeId,
      ...(linkedWbsNodeId && get().currentProjectId ? { linkedProjectId: get().currentProjectId as string } : {}),
      reminderMinutesBefore,
      isCompleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    set((state) => ({ notepad: [...state.notepad, newNote] }));
    return noteId;
  },

  updateNotepadNote: (noteId, title, content, startTime, endTime, reminderMinutesBefore, date) => {
    set((state) => ({
      notepad: state.notepad.map((n) => n.id === noteId
        ? { ...n, title, content, startTime, endTime, reminderMinutesBefore, ...(date ? { date } : {}), updatedAt: Date.now() }
        : n)
    }));
  },

  deleteNotepadNote: (noteId) => {
    set((state) => ({
      notepad: state.notepad.filter((n) => n.id !== noteId)
    }));
  },

  toggleNotepadNoteCompletion: (noteId) => {
    const state = get();
    const note = state.notepad.find(n => n.id === noteId);
    if (!note) return;

    const newIsCompleted = !note.isCompleted;
    set({
      notepad: state.notepad.map(n => 
        n.id === noteId ? { ...n, isCompleted: newIsCompleted, updatedAt: Date.now() } : n
      )
    });

    // Bağlı WBS düğümünü ancak o projedeyken güncelleyebiliriz; başka bir proje
    // açıkken güncelleme yanlış ağaca yazardı, bu yüzden atlanır.
    const linkedProjectIsOpen = !note.linkedProjectId || note.linkedProjectId === state.currentProjectId;
    if (note.linkedWbsNodeId && linkedProjectIsOpen) {
      if (typeof (state as any).updateGoal === 'function') {
        (state as any).updateGoal(note.linkedWbsNodeId, { status: newIsCompleted ? 'Done' : 'In Progress' });
      }
    }
  },

  addOrMergeNotepadNoteFromWbs: (date, title, content, startTime, endTime, linkedWbsNodeId) => {
    set((state) => {
      if (startTime && endTime) {
        const existing = state.notepad.find((n) =>
          n.date === date &&
          !!n.startTime && !!n.endTime &&
          timeRangesOverlap(startTime, endTime, n.startTime, n.endTime)
        );

        if (existing) {
          const incomingIsEarlier = startTime < existing.startTime!;
          const earlierTitle = incomingIsEarlier ? title : (existing.title || '');
          const laterTitle = incomingIsEarlier ? (existing.title || '') : title;
          const mergedTitle = [earlierTitle, laterTitle].filter((part) => part && part.trim() !== '').join(' - ');

          const incomingHasContent = content.trim() !== '';
          const existingHasContent = !!existing.content && existing.content.trim() !== '';
          const mergedContent = (incomingHasContent && existingHasContent)
            ? (incomingIsEarlier ? `${content}\n${existing.content}` : `${existing.content}\n${content}`)
            : existing.content;

          const mergedStart = startTime < existing.startTime! ? startTime : existing.startTime!;
          const mergedEnd = endTime > existing.endTime! ? endTime : existing.endTime!;

          return {
            notepad: state.notepad.map((n) => n.id === existing.id ? {
              ...n,
              title: mergedTitle,
              content: mergedContent,
              startTime: mergedStart,
              endTime: mergedEnd,
              updatedAt: Date.now(),
            } : n)
          };
        }
      }

      const noteId = uuidv4();
      const newNote: NotepadNote = {
        id: noteId,
        date,
        title,
        content,
        startTime,
        endTime,
        linkedWbsNodeId,
        ...(linkedWbsNodeId && state.currentProjectId ? { linkedProjectId: state.currentProjectId } : {}),
        isCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      return { notepad: [...state.notepad, newNote] };
    });
  }
});

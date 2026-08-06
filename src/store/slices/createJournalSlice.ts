import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';

export interface JournalEntry {
  text: string;
  updatedAt: number;
}

export interface JournalSlice {
  // Yalnızca açılmış günler burada durur; her gün ayrı bir Firestore dokümanı
  // (users/{uid}/journal/{YYYY-MM-DD}) olduğu için hepsi birden yüklenmez.
  journal: Record<string, JournalEntry>;
  // Kaydı olan günlerin listesi. Takvimde işaret göstermek için kullanılır;
  // kullanıcı dokümanında (users/{uid}) tutulur ki günleri tek tek okumayalım.
  journalDates: string[];
  // O gün sunucudan çekildi mi? Çekilmeden metin kutusu boş gösterilmemeli.
  journalLoadedDates: string[];
  // Kaydı süren günler. Tek bir boolean yetmiyordu: her gün ayrı dokümana
  // yazıldığı için iki gün aynı anda beklemedeyken ilki bitince gösterge
  // "kaydedildi"ye düşüyor, diğeri hâlâ havada kalıyordu. Ayrıca A günü
  // kaydedilirken B gününe geçilince B de "kaydediliyor" görünüyordu.
  journalSavingDates: string[];
  // Bu oturumda kaydı BAŞARIYLA tamamlanan günler. Başarısız yazmadan sonra
  // "kaydedildi" yazmamak için ayrı tutulur.
  journalSavedDates: string[];
  // Yüklenemeyen gün. Panelde "tekrar dene" gösterebilmek için tutulur.
  journalLoadError: string | null;

  setJournalLoadError: (dateKey: string | null) => void;
  // saving=false ile çağrıldığında succeeded, günün "kaydedildi" listesine
  // girip girmeyeceğini belirler.
  setJournalSaving: (dateKey: string, saving: boolean, succeeded?: boolean) => void;
  setJournalText: (dateKey: string, text: string) => void;
  setJournalDay: (dateKey: string, entry: JournalEntry | null) => void;
}

export const createJournalSlice: StateCreator<
  RoadmapState,
  [],
  [],
  JournalSlice
> = (set) => ({
  journal: {},
  journalDates: [],
  journalLoadedDates: [],
  journalSavingDates: [],
  journalSavedDates: [],
  journalLoadError: null,

  setJournalLoadError: (dateKey) => set({ journalLoadError: dateKey }),

  setJournalSaving: (dateKey, saving, succeeded = false) => {
    set((state) => ({
      journalSavingDates: saving
        ? (state.journalSavingDates.includes(dateKey)
            ? state.journalSavingDates
            : [...state.journalSavingDates, dateKey])
        : state.journalSavingDates.filter((d) => d !== dateKey),
      journalSavedDates: (!saving && succeeded && !state.journalSavedDates.includes(dateKey))
        ? [...state.journalSavedDates, dateKey]
        : state.journalSavedDates
    }));
  },

  // Kullanıcı yazarken çağrılır. Buluta yazma işini SyncManager gecikmeli yapar.
  setJournalText: (dateKey, text) => {
    set((state) => {
      const hasText = text.trim() !== '';
      const journalDates = hasText
        ? (state.journalDates.includes(dateKey) ? state.journalDates : [...state.journalDates, dateKey])
        : state.journalDates.filter((d) => d !== dateKey);

      return {
        journal: { ...state.journal, [dateKey]: { text, updatedAt: Date.now() } },
        journalDates
      };
    });
  },

  // Sunucudan gelen günü yerleştirir (yükleme sırasında).
  setJournalDay: (dateKey, entry) => {
    set((state) => ({
      journal: { ...state.journal, [dateKey]: entry || { text: '', updatedAt: 0 } },
      journalLoadedDates: state.journalLoadedDates.includes(dateKey)
        ? state.journalLoadedDates
        : [...state.journalLoadedDates, dateKey]
    }));
  }
});

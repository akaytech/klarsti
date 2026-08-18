import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';
import { islem } from '../gecmis';
import { kategoriliListeIslemleri } from './kategoriliListe';

export type PdcaPhase = 'Plan' | 'Do' | 'Check' | 'Act';

export interface PdcaItem {
  id: string;
  phase: PdcaPhase;
  text: string;
  status: 'pending' | 'completed';
  createdAt: number;
}

export interface PdcaCycle {
  id: string;
  goal: string;
  items: PdcaItem[];
  createdAt: number;
}

export interface PdcaSlice {
  pdca: PdcaCycle[];
  addPdcaCycle: (goal: string) => void;
  updatePdcaGoal: (id: string, goal: string) => void;
  deletePdcaCycle: (id: string) => void;
  addPdcaItem: (cycleId: string, phase: PdcaPhase, text: string) => void;
  updatePdcaItem: (cycleId: string, itemId: string, text: string) => void;
  deletePdcaItem: (cycleId: string, itemId: string) => void;
  togglePdcaItemStatus: (cycleId: string, itemId: string) => void;
}

export const createPdcaSlice: StateCreator<
  RoadmapState,
  [],
  [],
  PdcaSlice
> = (set, get) => {
  const ortak = kategoriliListeIslemleri(
    {
      anahtar: 'pdca', adAlani: 'goal', kategoriAlani: 'phase', aracAdi: 'pdca',
      // PUKÖ kalemleri yapıldı/yapılmadı taşıyor; ötekilerde böyle bir şey yok.
      yeniKaleminEkleri: () => ({ status: 'pending' })
    },
    set, get
  );

  return {
    pdca: [],
    addPdcaCycle: ortak.ekle,
    updatePdcaGoal: ortak.adiGuncelle,
    deletePdcaCycle: ortak.sil,
    addPdcaItem: ortak.kalemEkle,
    updatePdcaItem: ortak.kalemGuncelle,
    deletePdcaItem: ortak.kalemSil,

    // Araca özgü: kalemi yapıldı/yapılmadı arasında çevirir.
    togglePdcaItemStatus: (cycleId, itemId) => islem(() => {
      set({
        pdca: get().pdca.map((cycle) => cycle.id === cycleId
          ? {
              ...cycle,
              items: cycle.items.map((item) => item.id === itemId
                ? { ...item, status: (item.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed' }
                : item)
            }
          : cycle)
      });
    })
  };
};

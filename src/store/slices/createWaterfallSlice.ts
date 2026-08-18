import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';
import { islem } from '../gecmis';
import { kategoriliListeIslemleri } from './kategoriliListe';

export type WaterfallPhase = 'Requirements' | 'High-Level Design' | 'Low-Level Design' | 'Implementation' | 'Verification' | 'Maintenance';

export interface WaterfallItem {
  id: string;
  phase: WaterfallPhase;
  text: string;
  createdAt: number;
}

export interface WaterfallProject {
  id: string;
  name: string;
  currentPhaseIndex: number;
  items: WaterfallItem[];
  createdAt: number;
}

export interface WaterfallSlice {
  waterfall: WaterfallProject[];
  addWaterfallProject: (name: string) => void;
  updateWaterfallProjectName: (id: string, name: string) => void;
  deleteWaterfallProject: (id: string) => void;
  addWaterfallItem: (projectId: string, phase: WaterfallPhase, text: string) => void;
  updateWaterfallItem: (projectId: string, itemId: string, text: string) => void;
  deleteWaterfallItem: (projectId: string, itemId: string) => void;
  advanceWaterfallPhase: (projectId: string) => void;
}

export const createWaterfallSlice: StateCreator<
  RoadmapState,
  [],
  [],
  WaterfallSlice
> = (set, get) => {
  const ortak = kategoriliListeIslemleri(
    {
      anahtar: 'waterfall', adAlani: 'name', kategoriAlani: 'phase', aracAdi: 'waterfall',
      // Şelale sırayla yürüyor; hangi aşamada olduğunu kayıt kendi taşıyor.
      yeniKaydinEkleri: () => ({ currentPhaseIndex: 0 })
    },
    set, get
  );

  return {
    waterfall: [],
    addWaterfallProject: ortak.ekle,
    updateWaterfallProjectName: ortak.adiGuncelle,
    deleteWaterfallProject: ortak.sil,
    addWaterfallItem: ortak.kalemEkle,
    updateWaterfallItem: ortak.kalemGuncelle,
    deleteWaterfallItem: ortak.kalemSil,

    // Araca özgü: bir sonraki aşamaya geçirir. Altı aşama var, sonuncuda durur.
    advanceWaterfallPhase: (projectId) => islem(() => {
      set({
        waterfall: get().waterfall.map((project) => project.id === projectId
          ? { ...project, currentPhaseIndex: Math.min(5, project.currentPhaseIndex + 1) }
          : project)
      });
    })
  };
};

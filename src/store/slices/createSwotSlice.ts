import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';
import { kategoriliListeIslemleri } from './kategoriliListe';

export type SwotType = 'S' | 'W' | 'O' | 'T';

export interface SwotItem {
  id: string;
  type: SwotType;
  text: string;
  createdAt: number;
}

export interface SwotAnalysis {
  id: string;
  title: string;
  items: SwotItem[];
  createdAt: number;
}

export interface SwotSlice {
  swot: SwotAnalysis[];
  addSwot: (title: string) => void;
  updateSwotTitle: (id: string, title: string) => void;
  deleteSwot: (id: string) => void;
  addSwotItem: (analysisId: string, type: SwotType, text: string) => void;
  updateSwotItem: (analysisId: string, itemId: string, text: string) => void;
  deleteSwotItem: (analysisId: string, itemId: string) => void;
}

export const createSwotSlice: StateCreator<
  RoadmapState,
  [],
  [],
  SwotSlice
> = (set, get) => {
  const ortak = kategoriliListeIslemleri(
    { anahtar: 'swot', adAlani: 'title', kategoriAlani: 'type', aracAdi: 'swot' },
    set, get
  );

  return {
    swot: [],
    addSwot: ortak.ekle,
    updateSwotTitle: ortak.adiGuncelle,
    deleteSwot: ortak.sil,
    addSwotItem: ortak.kalemEkle,
    updateSwotItem: ortak.kalemGuncelle,
    deleteSwotItem: ortak.kalemSil
  };
};

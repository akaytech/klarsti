import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';
import { kategoriliListeIslemleri } from './kategoriliListe';

export type IshikawaCategory = 'Manpower' | 'Machine' | 'Material' | 'Method' | 'Measurement' | 'Milieu';

export interface IshikawaItem {
  id: string;
  category: IshikawaCategory;
  text: string;
  createdAt: number;
}

export interface IshikawaAnalysis {
  id: string;
  problemStatement: string;
  items: IshikawaItem[];
  createdAt: number;
}

export interface IshikawaSlice {
  ishikawa: IshikawaAnalysis[];
  addIshikawa: (problemStatement: string) => void;
  updateIshikawaProblem: (id: string, problemStatement: string) => void;
  deleteIshikawa: (id: string) => void;
  addIshikawaItem: (analysisId: string, category: IshikawaCategory, text: string) => void;
  updateIshikawaItem: (analysisId: string, itemId: string, text: string) => void;
  deleteIshikawaItem: (analysisId: string, itemId: string) => void;
}

export const createIshikawaSlice: StateCreator<
  RoadmapState,
  [],
  [],
  IshikawaSlice
> = (set, get) => {
  const ortak = kategoriliListeIslemleri(
    { anahtar: 'ishikawa', adAlani: 'problemStatement', kategoriAlani: 'category', aracAdi: 'ishikawa' },
    set, get
  );

  return {
    ishikawa: [],
    addIshikawa: ortak.ekle,
    updateIshikawaProblem: ortak.adiGuncelle,
    deleteIshikawa: ortak.sil,
    addIshikawaItem: ortak.kalemEkle,
    updateIshikawaItem: ortak.kalemGuncelle,
    deleteIshikawaItem: ortak.kalemSil
  };
};

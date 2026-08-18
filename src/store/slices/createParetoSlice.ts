import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { RoadmapState } from '../useRoadmapStore';
import { islem } from '../gecmis';

export interface ParetoItem {
  id: string;
  category: string;
  frequency: number;
}

export interface ParetoProject {
  id: string;
  title: string;
  items: ParetoItem[];
}

export interface ParetoSlice {
  pareto: ParetoProject[];
  addParetoProject: (paretoId: string, title: string) => void;
  addParetoItem: (paretoId: string, category: string, frequency: number) => void;
  updateParetoItem: (paretoId: string, itemId: string, data: Partial<ParetoItem>) => void;
  deleteParetoItem: (paretoId: string, itemId: string) => void;
  updateParetoTitle: (paretoId: string, title: string) => void;
  deleteParetoProject: (paretoId: string) => void;
}

export const createParetoSlice: StateCreator<
  RoadmapState,
  [],
  [],
  ParetoSlice
> = (set) => ({
  pareto: [],
  addParetoProject: (paretoId, title) => islem(() => {
    set((state) => {
      const newPareto: ParetoProject = { id: paretoId, title, items: [] };
      const next = { ...state, pareto: [...state.pareto, newPareto] };
      return { ...next };
    });
  }),
  addParetoItem: (paretoId, category, frequency) => islem(() => {
    set((state) => {
      const newItem: ParetoItem = { id: uuidv4(), category, frequency };
      const next = {
        ...state,
        pareto: state.pareto.map(p => p.id === paretoId ? { ...p, items: [...p.items, newItem] } : p)
      };
      return { ...next };
    });
  }),
  updateParetoItem: (paretoId, itemId, data) => islem(() => {
    set((state) => {
      const next = {
        ...state,
        pareto: state.pareto.map(p => 
          p.id === paretoId 
            ? { ...p, items: p.items.map(item => item.id === itemId ? { ...item, ...data } : item) } 
            : p
        )
      };
      return { ...next };
    });
  }),
  deleteParetoItem: (paretoId, itemId) => islem(() => {
    set((state) => {
      const next = {
        ...state,
        pareto: state.pareto.map(p => p.id === paretoId ? { ...p, items: p.items.filter(item => item.id !== itemId) } : p)
      };
      return { ...next };
    });
  }),
  updateParetoTitle: (paretoId, title) => islem(() => {
    set((state) => {
      const next = {
        ...state,
        pareto: state.pareto.map(p => p.id === paretoId ? { ...p, title } : p)
      };
      return { ...next };
    });
  }),
  deleteParetoProject: (paretoId) => islem(() => {
    set((state) => {
      const next = { ...state, pareto: state.pareto.filter(p => p.id !== paretoId) };
      return { ...next };
    });
  }),
});

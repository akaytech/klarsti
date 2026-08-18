import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { logAppEvent } from '../../firebase';
import i18n from '../../i18n';
import type {
  Edge,
  Node,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

import type { RoadmapState } from '../useRoadmapStore';
import { islem, tiktaIslem, gecmisiTemizle } from '../gecmis';
import { siraDegistir } from './siralama';

export type FiveWhysNodeType = 'problem' | 'why' | 'solution';

export interface FiveWhysNodeData extends Record<string, unknown> {
  label: string;
  type: FiveWhysNodeType;
  depth: number;
}

export type FiveWhysNode = Node<FiveWhysNodeData>;

/**
 * Bir projede birden çok kök neden analizi olabiliyor. Diğer araçlardaki
 * kalıbın aynısı; eskiden 5 Neden proje başına tekti, ikinci bir problemi
 * incelemek için ya öncekini silmek ya yeni proje açmak gerekiyordu.
 */
export interface FiveWhysAnalysis {
  id: string;
  name: string;
  nodes: FiveWhysNode[];
  edges: Edge[];
  createdAt: number;
}

export interface FiveWhysSlice {
  fiveWhysAnalyses: FiveWhysAnalysis[];
  /** Açık analiz. Kişisel tercih olduğu için projeye kaydedilmez. */
  activeFiveWhysId: string | null;

  setActiveFiveWhys: (id: string) => void;
  addFiveWhysAnalysis: (name: string, problemLabel?: string) => string;
  renameFiveWhysAnalysis: (id: string, name: string) => void;
  /** Çalışmayı listede başka bir sıraya taşır (bkz. siralama.ts). */
  moveFiveWhysTo: (id: string, hedefIndex: number) => void;
  deleteFiveWhysAnalysis: (id: string) => void;
  /**
   * Kırılım ağacındaki bir işten kök neden analizi başlatır. Açık analize
   * ikinci bir problem eklemek yerine yeni analiz açar; iş adı hem analizin
   * adı hem problem kutusu olur.
   */
  startFiveWhysFromWbs: (label: string) => string;

  // Aşağıdakiler hep açık analiz üzerinde çalışır.
  onFiveWhysNodesChange: OnNodesChange<FiveWhysNode>;
  onFiveWhysEdgesChange: OnEdgesChange;
  onFiveWhysConnect: OnConnect;
  addFiveWhysNode: (parentId: string | null, type: FiveWhysNodeType, label: string, position?: { x: number; y: number }) => void;
  updateFiveWhysNode: (id: string, data: Partial<FiveWhysNodeData>) => void;
  deleteFiveWhysNode: (id: string) => void;
  loadFiveWhysExample: () => void;
}

/**
 * Açık analiz. activeFiveWhysId proje değişince eskimiş olabiliyor, o yüzden
 * her yerde listeye bakarak çözülüyor; bulunamazsa ilk analiz açıktır.
 */
export function getActiveFiveWhys(state: { fiveWhysAnalyses: FiveWhysAnalysis[]; activeFiveWhysId: string | null }): FiveWhysAnalysis | undefined {
  return state.fiveWhysAnalyses.find((a) => a.id === state.activeFiveWhysId) || state.fiveWhysAnalyses[0];
}

const KENAR_STILI = { type: 'smoothstep', animated: true, style: { strokeWidth: 3, stroke: '#94a3b8' } };

export function yeniFiveWhysAnalizi(name: string, problemLabel: string): FiveWhysAnalysis {
  return {
    id: uuidv4(),
    name,
    nodes: [{ id: uuidv4(), type: 'fiveWhysNode', position: { x: 0, y: 0 }, data: { label: problemLabel, type: 'problem', depth: 0 } }],
    edges: [],
    createdAt: Date.now(),
  };
}

const getFiveWhysDescendants = (id: string, edges: Edge[]): string[] => {
  const children = edges.filter(e => e.source === id).map(e => e.target);
  return children.reduce((acc, child) => [...acc, child, ...getFiveWhysDescendants(child, edges)], [] as string[]);
};

import { getLayoutedElements } from '../../utils/layout';

const getFiveWhysLayoutedElements = (nodes: FiveWhysNode[], edges: Edge[]) => {
  const layoutedNodes = getLayoutedElements(nodes, edges, {
    direction: 'LR',
    nodeSep: 50,
    rankSep: 80,
    getNodeDimensions: () => ({ width: 320, height: 140 }),
  });
  return { layoutedNodes, layoutedEdges: edges };
};

export const createFiveWhysSlice: StateCreator<RoadmapState, [], [], FiveWhysSlice> = (set, get) => {
  /** Açık analizi değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: RoadmapState, degistir: (a: FiveWhysAnalysis) => FiveWhysAnalysis) => {
    const aktif = getActiveFiveWhys(state);
    if (!aktif) return state;
    return {
      ...state,
      fiveWhysAnalyses: state.fiveWhysAnalyses.map((a) => (a.id === aktif.id ? degistir(a) : a)),
    };
  };

  /** Kutu ve çizgi değişikliklerinden sonra dizilim hep yenilenir. */
  const diz = (analiz: FiveWhysAnalysis, nodes: FiveWhysNode[], edges: Edge[]): FiveWhysAnalysis => {
    const { layoutedNodes, layoutedEdges } = getFiveWhysLayoutedElements(nodes, edges);
    return { ...analiz, nodes: layoutedNodes, edges: layoutedEdges };
  };

  return {
    fiveWhysAnalyses: [],
    activeFiveWhysId: null,

    // Geçmiş yığını açık analize ait; başka analize geçilince (ya da analiz
    // eklenip silinince) kayıtlar ekranda olmayan bir şeyi anlatır ve geri
    // tuşu görünürde hiçbir şey yapmazdı.
    setActiveFiveWhys: (id) => {
      gecmisiTemizle();
      set({ activeFiveWhysId: id } as Partial<RoadmapState>);
    },

    addFiveWhysAnalysis: (name, problemLabel) => {
      gecmisiTemizle();
      const analiz = yeniFiveWhysAnalizi(name, problemLabel ?? i18n.t('whys_problem'));
      set((state) => ({ ...state, fiveWhysAnalyses: [...state.fiveWhysAnalyses, analiz], activeFiveWhysId: analiz.id }));
      return analiz.id;
    },

    moveFiveWhysTo: (id, hedefIndex) => islem(() => {
      set((state) => {
        const yeni = siraDegistir(state.fiveWhysAnalyses, id, hedefIndex);
        return yeni ? { ...state, fiveWhysAnalyses: yeni } : state;
      });
    }),

    renameFiveWhysAnalysis: (id, name) => {
      set((state) => ({ ...state, fiveWhysAnalyses: state.fiveWhysAnalyses.map((a) => (a.id === id ? { ...a, name } : a)) }));
    },

    deleteFiveWhysAnalysis: (id) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = state.fiveWhysAnalyses.filter((a) => a.id !== id);
        return {
          ...state,
          fiveWhysAnalyses: kalan,
          activeFiveWhysId: state.activeFiveWhysId === id ? kalan[0]?.id ?? null : state.activeFiveWhysId,
        };
      });
    },

    startFiveWhysFromWbs: (label) => {
      gecmisiTemizle();
      logAppEvent('node_created', { tool: '5whys', type: 'problem' });
      const analiz = yeniFiveWhysAnalizi(label, label);
      set((state) => ({ ...state, fiveWhysAnalyses: [...state.fiveWhysAnalyses, analiz], activeFiveWhysId: analiz.id }));
      return analiz.id;
    },

    // Silme dışındakiler geçici (seçim, ölçüm, sürükleme ara kareleri) ve
    // geçmişe girmiyor. Birlikte silinen kutular tek adım olsun diye silmeler
    // tek işlem sınırında toplanıyor.
    onFiveWhysNodesChange: (changes) => {
      const otherChanges: typeof changes = [];
      const silinecekler = changes.filter((c) => c.type === 'remove');
      for (const change of changes) {
        if (change.type !== 'remove') otherChanges.push(change);
      }
      if (silinecekler.length > 0) {
        islem(() => {
          silinecekler.forEach((c) => get().deleteFiveWhysNode((c as { id: string }).id));
        });
      }
      if (otherChanges.length === 0) return;
      set((state) => aktifiGuncelle(state, (a) => ({
        ...a,
        nodes: applyNodeChanges(otherChanges, a.nodes) as FiveWhysNode[],
      })));
    },

    onFiveWhysEdgesChange: (changes) => {
      // Kutu silinince ona bağlı çizgiler deleteFiveWhysNode içinde zaten
      // gitti; arkadan gelen bu çağrı bir şey değiştirmediği için kayıt düşmez.
      const uygula = () => set((state) => aktifiGuncelle(state, (a) => ({ ...a, edges: applyEdgeChanges(changes, a.edges) })));
      if (changes.some((c) => c.type === 'remove')) tiktaIslem(uygula);
      else uygula();
    },

    onFiveWhysConnect: (connection: Connection) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => diz(a, a.nodes, addEdge({ ...connection, ...KENAR_STILI }, a.edges))));
    }),

    addFiveWhysNode: (parentId, type, label, position) => islem(() => {
      logAppEvent('node_created', { tool: '5whys', type });
      set((state) => aktifiGuncelle(state, (a) => {
        const ebeveyn = parentId ? a.nodes.find((n) => n.id === parentId) : null;
        const depth = ebeveyn ? ebeveyn.data.depth + 1 : 0;
        const yeni: FiveWhysNode = {
          id: uuidv4(),
          type: 'fiveWhysNode',
          position: position || { x: 0, y: 0 },
          data: { label, type, depth },
        };
        const nodes = [...a.nodes, yeni];
        const edges = parentId
          ? [...a.edges, { id: uuidv4(), source: parentId, target: yeni.id, ...KENAR_STILI }]
          : [...a.edges];
        return diz(a, nodes, edges);
      }));
    }),

    updateFiveWhysNode: (id, data) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => ({
        ...a,
        nodes: a.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      })));
    }),

    deleteFiveWhysNode: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => {
        const silinecek = [id, ...getFiveWhysDescendants(id, a.edges)];
        const nodes = a.nodes.filter((n) => !silinecek.includes(n.id));
        const edges = a.edges.filter((e) => !silinecek.includes(e.source) && !silinecek.includes(e.target));
        return diz(a, nodes, edges);
      }));
    }),

    loadFiveWhysExample: () => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => {
        const kimlikler = Array.from({ length: 6 }, () => uuidv4());
        const etiketler = ['whys_example_problem', 'whys_example_w1', 'whys_example_w2', 'whys_example_w3', 'whys_example_w4', 'whys_example_solution'];
        const tipler: FiveWhysNodeType[] = ['problem', 'why', 'why', 'why', 'why', 'solution'];

        const nodes: FiveWhysNode[] = kimlikler.map((id, i) => ({
          id,
          type: 'fiveWhysNode',
          position: { x: 0, y: 0 },
          data: { label: i18n.t(etiketler[i]), type: tipler[i], depth: i },
        }));
        const edges: Edge[] = kimlikler.slice(0, -1).map((id, i) => ({
          id: uuidv4(),
          source: id,
          target: kimlikler[i + 1],
          ...KENAR_STILI,
        }));

        return diz(a, nodes, edges);
      }));
    }),
  };
};

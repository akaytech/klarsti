import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from './kutuDegisiklikleri';
import type { NodeChange, EdgeChange, Connection, Edge, Node } from '@xyflow/react';

import type { RoadmapState } from '../useRoadmapStore';
import { islem, tiktaIslem, gecmisiTemizle } from '../gecmis';
import { siraDegistir } from './siralama';
import i18n from '../../i18n';
import { logAppEvent } from '../../firebase';

export type FtaNodeType =
  | 'topEvent'
  | 'event'
  | 'andGate'
  | 'orGate'
  | 'basicEvent'
  | 'undevelopedEvent'
  | 'conditioningEvent'
  | 'exclusiveOrGate'
  | 'priorityAndGate'
  | 'inhibitGate';

export type FtaNodeData = {
  label: string;
  type: FtaNodeType;
  description?: string;
  probability?: number;
};

export type FtaNode = Node<FtaNodeData>;

/**
 * Bir projede birden çok hata ağacı olabiliyor. Diğer araçlardaki kalıbın
 * aynısı; eskiden FTA proje başına tekti, ikinci bir tepe olayı incelemek için
 * ya öncekini silmek ya yeni proje açmak gerekiyordu.
 */
export interface FtaAnalysis {
  id: string;
  name: string;
  nodes: FtaNode[];
  edges: Edge[];
  createdAt: number;
}

export interface FtaSlice {
  ftaAnalyses: FtaAnalysis[];
  /** Açık ağaç. Kişisel tercih olduğu için projeye kaydedilmez. */
  activeFtaId: string | null;

  setActiveFta: (id: string) => void;
  addFtaAnalysis: (name: string, topLabel?: string) => string;
  renameFtaAnalysis: (id: string, name: string) => void;
  /** Çalışmayı listede başka bir sıraya taşır (bkz. siralama.ts). */
  moveFtaTo: (id: string, hedefIndex: number) => void;
  deleteFtaAnalysis: (id: string) => void;

  // Aşağıdakiler hep açık ağaç üzerinde çalışır.
  onFtaNodesChange: (changes: NodeChange[]) => void;
  onFtaEdgesChange: (changes: EdgeChange[]) => void;
  onFtaConnect: (connection: Connection) => void;
  addFtaNode: (parentId: string, type: FtaNodeType, label: string) => void;
  updateFtaNode: (id: string, data: Partial<FtaNodeData>) => void;
  deleteFtaNode: (id: string) => void;
  /** Tuval tamamen boşsa varsayılan tepe olayı geri koyar. */
  addFtaRoot: () => void;
  /** El değmemiş tuvale örnek bir hata ağacı basar. */
  loadFtaExample: () => void;
}

/**
 * Açık ağaç. activeFtaId proje değişince eskimiş olabiliyor, o yüzden her
 * yerde listeye bakarak çözülüyor; bulunamazsa ilk ağaç açıktır.
 */
export function getActiveFta(state: { ftaAnalyses: FtaAnalysis[]; activeFtaId: string | null }): FtaAnalysis | undefined {
  return state.ftaAnalyses.find((a) => a.id === state.activeFtaId) || state.ftaAnalyses[0];
}

/**
 * Kutu verisini günceller; değeri olmayan alanı üstüne yazmak yerine siler.
 *
 * Olasılık kutusu boşaltıldığında menü `probability: undefined` gönderiyor.
 * Düz yayma (`{ ...eski, ...yeni }`) bunu "anahtar var, değeri yok" haline
 * getiriyordu; Firestore böyle bir alan görünce projenin yazmasını komple
 * reddediyor ve düzenleme hiçbir yere kaydedilmiyordu. Alanı büsbütün
 * kaldırmak hem kullanıcının istediği şey ("bu kutunun olasılığı yok") hem de
 * buluta yazılabilir tek hali.
 */
function alanlariBirlestir<T extends object>(eski: T, yeni: Partial<T>): T {
  const sonuc = { ...eski, ...yeni } as Record<string, unknown>;
  for (const anahtar of Object.keys(sonuc)) {
    if (sonuc[anahtar] === undefined) delete sonuc[anahtar];
  }
  return sonuc as T;
}

/** Tepe olay 'root' kimliğini korur; silinemez düğüm kuralı buna dayanıyor. */
export function yeniFtaAnalizi(name: string, topLabel: string): FtaAnalysis {
  return {
    id: uuidv4(),
    name,
    nodes: [{ id: 'root', type: 'ftaNode', position: { x: 0, y: 0 }, data: { label: topLabel, type: 'topEvent' } }],
    edges: [],
    createdAt: Date.now(),
  };
}

/** Tuval "el değmemiş" mi? Ya boş, ya da sadece varsayılan tepe olayı duruyor. */
export const isPristineFta = (nodes: FtaNode[], edges: Edge[]): boolean => {
  if (nodes.length === 0) return true;
  if (nodes.length > 1 || edges.length > 0) return false;
  const n = nodes[0];
  return n.id === 'root'
    && n.data.type === 'topEvent'
    && n.data.label === i18n.t('fta_top_event')
    && !n.data.description
    && n.data.probability === undefined;
};

const getFtaDescendants = (id: string, edges: Edge[]): string[] => {
  const children = edges.filter(e => e.source === id).map(e => e.target);
  return children.reduce((acc, child) => [...acc, child, ...getFtaDescendants(child, edges)], [] as string[]);
};

import { getLayoutedElements } from '../../utils/layout';

const getFtaLayoutedElements = (nodes: FtaNode[], edges: Edge[]) => {
  const newNodes = getLayoutedElements(nodes, edges, {
    direction: 'TB',
    nodeSep: 50,
    rankSep: 60,
    getNodeDimensions: (node) => {
      const ftaNode = node as FtaNode;
      const width = 180;
      let height = 60;
      if (['basicEvent', 'conditioningEvent'].includes(ftaNode.data.type)) {
        height = 80;
      } else if (ftaNode.data.type === 'undevelopedEvent') {
        height = 100;
      } else if (ftaNode.data.type === 'inhibitGate') {
        height = 90;
      }
      return { width, height };
    }
  });

  return { nodes: newNodes, edges };
};

export const createFtaSlice: StateCreator<RoadmapState, [], [], FtaSlice> = (set, get) => {
  const aktifiGuncelle = (state: RoadmapState, degistir: (a: FtaAnalysis) => FtaAnalysis) => {
    const aktif = getActiveFta(state);
    if (!aktif) return state;
    return {
      ...state,
      ftaAnalyses: state.ftaAnalyses.map((a) => (a.id === aktif.id ? degistir(a) : a)),
    };
  };

  /**
   * Açık ağacı verir; hiç analiz yoksa boş bir tane kurar. Son analizini
   * silen kullanıcı yoksa çıkışı olmayan bir ekranda kalıyordu: tepe olay
   * ekleyen de örnek yükleyen de açık analiz bulamayınca sessizce hiçbir şey
   * yapmıyordu, analiz menüsü de aynı sebeple gizleniyordu.
   */
  const analiziSagla = (state: RoadmapState): { state: RoadmapState; aktif: FtaAnalysis } => {
    const aktif = getActiveFta(state);
    if (aktif) return { state, aktif };
    const yeni: FtaAnalysis = {
      id: uuidv4(),
      name: i18n.t('fta_default_analysis_name'),
      nodes: [],
      edges: [],
      createdAt: Date.now(),
    };
    return {
      state: { ...state, ftaAnalyses: [...state.ftaAnalyses, yeni], activeFtaId: yeni.id },
      aktif: yeni,
    };
  };

  /** aktifiGuncelle'nin analiz yoksa kuran hali; yalnızca kurma yollarında. */
  const kurupGuncelle = (state: RoadmapState, degistir: (a: FtaAnalysis) => FtaAnalysis) => {
    const { state: yeniDurum, aktif } = analiziSagla(state);
    return {
      ...yeniDurum,
      ftaAnalyses: yeniDurum.ftaAnalyses.map((a) => (a.id === aktif.id ? degistir(a) : a)),
    };
  };

  const diz = (analiz: FtaAnalysis, nodes: FtaNode[], edges: Edge[]): FtaAnalysis => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getFtaLayoutedElements(nodes, edges);
    return { ...analiz, nodes: layoutedNodes, edges: layoutedEdges };
  };

  return {
    ftaAnalyses: [],
    activeFtaId: null,

    // Geçmiş açık analize ait; analiz değişince kayıtlar ekranda olmayan bir
    // şeye ait olur ve geri tuşu görünürde hiçbir şey yapmazdı.
    setActiveFta: (id) => {
      gecmisiTemizle();
      set({ activeFtaId: id } as Partial<RoadmapState>);
    },

    addFtaAnalysis: (name, topLabel) => {
      gecmisiTemizle();
      const analiz = yeniFtaAnalizi(name, topLabel ?? i18n.t('fta_top_event'));
      set((state) => ({ ...state, ftaAnalyses: [...state.ftaAnalyses, analiz], activeFtaId: analiz.id }));
      return analiz.id;
    },

    moveFtaTo: (id, hedefIndex) => islem(() => {
      set((state) => {
        const yeni = siraDegistir(state.ftaAnalyses, id, hedefIndex);
        return yeni ? { ...state, ftaAnalyses: yeni } : state;
      });
    }),

    renameFtaAnalysis: (id, name) => {
      set((state) => ({ ...state, ftaAnalyses: state.ftaAnalyses.map((a) => (a.id === id ? { ...a, name } : a)) }));
    },

    deleteFtaAnalysis: (id) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = state.ftaAnalyses.filter((a) => a.id !== id);
        return {
          ...state,
          ftaAnalyses: kalan,
          activeFtaId: state.activeFtaId === id ? kalan[0]?.id ?? null : state.activeFtaId,
        };
      });
    },

    // Silme dışındakiler geçici (seçim, ölçüm, sürükleme ara kareleri) ve
    // geçmişe girmiyor. Birlikte silinenler tek adım olsun diye silmeler tek
    // işlem sınırında toplanıyor.
    onFtaNodesChange: (changes) => {
      const otherChanges: typeof changes = [];
      const silinecekler = changes.filter((c) => c.type === 'remove');
      for (const change of changes) {
        if (change.type !== 'remove') otherChanges.push(change);
      }
      if (silinecekler.length > 0) {
        islem(() => {
          silinecekler.forEach((c) => get().deleteFtaNode((c as { id: string }).id));
        });
      }
      if (otherChanges.length === 0) return;
      set((state) => aktifiGuncelle(state, (a) => ({
        ...a,
        nodes: applyNodeChanges(otherChanges, a.nodes) as FtaNode[],
      })));
    },

    onFtaEdgesChange: (changes) => {
      // Kutu silinince ona bağlı çizgiler deleteFtaNode içinde zaten gitti;
      // arkadan gelen bu çağrı bir şey değiştirmediği için kayıt da düşmez.
      const uygula = () => set((state) => aktifiGuncelle(state, (a) => ({ ...a, edges: applyEdgeChanges(changes, a.edges) as Edge[] })));
      if (changes.some((c) => c.type === 'remove')) tiktaIslem(uygula);
      else uygula();
    },

    onFtaConnect: (connection) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => ({ ...a, edges: addEdge(connection, a.edges) })));
    }),

    addFtaNode: (parentId, type, label) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => {
        const yeniId = uuidv4();
        const nodes = [...a.nodes, { id: yeniId, type: 'ftaNode', position: { x: 0, y: 0 }, data: { label, type } } as FtaNode];
        const edges = [...a.edges, { id: uuidv4(), source: parentId, target: yeniId, type: 'smoothstep' }];
        return diz(a, nodes, edges);
      }));
    }),

    updateFtaNode: (id, data) => islem(() => {
      set((state) => aktifiGuncelle(state, (a) => ({
        ...a,
        nodes: a.nodes.map((n) => (n.id === id ? { ...n, data: alanlariBirlestir(n.data, data) } : n)),
      })));
    }),

    deleteFtaNode: (id) => islem(() => {
      // Tepe olay silinmez: ağacın kökü o.
      if (id === 'root') return;
      set((state) => aktifiGuncelle(state, (a) => {
        const silinecek = new Set([id, ...getFtaDescendants(id, a.edges)]);
        const nodes = a.nodes.filter((n) => !silinecek.has(n.id));
        const edges = a.edges.filter((e) => !silinecek.has(e.source) && !silinecek.has(e.target));
        return diz(a, nodes, edges);
      }));
    }),

    addFtaRoot: () => {
      const aktif = getActiveFta(get());
      if (aktif && aktif.nodes.length > 0) return;
      set((state) => kurupGuncelle(state, (a) => ({
        ...a,
        nodes: [{ id: 'root', type: 'ftaNode', position: { x: 0, y: 0 }, data: { label: i18n.t('fta_top_event'), type: 'topEvent' } }],
        edges: [],
      })));
    },

    // Örnek şablon: SWOT ve WBS örnekleriyle aynı kahve dükkanı senaryosu.
    // Tepe olay 'root' id'sini korur, böylece silinemez düğüm kuralı bozulmaz.
    loadFtaExample: () => islem(() => {
      const aktif = getActiveFta(get());
      if (aktif && !isPristineFta(aktif.nodes, aktif.edges)) return;
      logAppEvent('example_loaded', { tool: 'fta' });

      const mk = (labelKey: string, type: FtaNodeType, probability?: number): FtaNode => ({
        id: uuidv4(),
        type: 'ftaNode',
        position: { x: 0, y: 0 },
        data: { label: i18n.t(labelKey), type, ...(probability !== undefined ? { probability } : {}) }
      });

      const top: FtaNode = { ...mk('fta_example_top', 'topEvent'), id: 'root' };
      const orTop = mk('fta_add_or', 'orGate');
      const machine = mk('fta_example_machine', 'event');
      const orMachine = mk('fta_add_or', 'orGate');
      const noMaintenance = mk('fta_example_no_maintenance', 'basicEvent', 8);
      const clogged = mk('fta_example_clogged_filter', 'basicEvent', 5);
      const noStaff = mk('fta_example_no_staff', 'event');
      const andStaff = mk('fta_add_and', 'andGate');
      const sick = mk('fta_example_barista_sick', 'basicEvent', 6);
      const noBackup = mk('fta_example_no_backup', 'basicEvent', 20);
      const power = mk('fta_example_power_cut', 'undevelopedEvent');

      const nodes: FtaNode[] = [];
      const edges: Edge[] = [];
      const link = (parent: FtaNode, children: FtaNode[]) => {
        children.forEach(child => {
          nodes.push(child);
          edges.push({ id: uuidv4(), source: parent.id, target: child.id, type: 'smoothstep' });
        });
      };
      nodes.push(top);
      link(top, [orTop]);
      link(orTop, [machine, noStaff, power]);
      link(machine, [orMachine]);
      link(orMachine, [noMaintenance, clogged]);
      link(noStaff, [andStaff]);
      link(andStaff, [sick, noBackup]);

      set((state) => kurupGuncelle(state, (a) => diz(a, nodes, edges)));
    }),
  };
};

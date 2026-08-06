import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { logAppEvent } from '../../firebase';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type { Edge, NodeChange, EdgeChange, Connection, Node } from '@xyflow/react';

import i18n from '../../i18n';
import type { RoadmapState } from '../useRoadmapStore';
import { islem, gecmisiTemizle } from '../gecmis';

export type GoalStatus = 'To Do' | 'In Progress' | 'Done' | 'Failed';

export type GoalNodeData = {
  label: string;
  description?: string;
  notes?: string;
  targetDate?: string;
  targetTime?: string;
  targetEndTime?: string;
  status: GoalStatus;
  isExpanded: boolean;
  hideCompleted?: boolean;
  // Kutunun kendi otomatik yerinden ne kadar kaydırıldığı. Kutunun MUTLAK
  // konumu değil, sapması. Eskiden mutlak konum donduruluyordu; ağaç büyüyünce
  // dagre o kutunun yerini kaydırıyor, kutu ise yerinde kalıyordu ve aradaki
  // fark her eklemede biriktiği için kutu zamanla ağacın uzağına düşüyordu.
  // Sapma göreli tutulunca kutu ebeveyniyle birlikte hareket eder.
  offsetX?: number;
  offsetY?: number;
  /** @deprecated Eski mutlak sabitleme. Okunmuyor; yüklemede temizleniyor. */
  isManuallyPositioned?: boolean;
  // Yeni projeyle gelen varsayılan kök düğüm mü, adı hiç değiştirilmedi mi?
  // "El değmemiş tuval" tespiti eskiden başlığı çeviriyle karşılaştırıyordu,
  // bu yüzden dil değiştirilince tuval dolu sayılıyordu. Bu işaret dilden
  // bağımsızdır; kullanıcı başlığı değiştirdiği anda silinir (bkz. updateGoal).
  isUntouchedDefault?: boolean;
};

export type GoalNode = Node<GoalNodeData>;

/**
 * Bir projede birden çok kırılım ağacı olabiliyor. Zihin haritasındaki
 * (Mindmap) kalıbın aynısı; farkı, kırılım ağacında kutuların durumu ve
 * ajanda bağı olması.
 */
export type WbsTree = {
  id: string;
  name: string;
  nodes: GoalNode[];
  edges: Edge[];
  createdAt: number;
};

export interface WbsSlice {
  wbsTrees: WbsTree[];
  /**
   * Ekranda açık olan ağaç. Kişisel bir tercih olduğu için projeye
   * kaydedilmez; kaydedilse aynı projede çalışan iki kişi birbirinin
   * sekmesini değiştirirdi.
   */
  activeWbsTreeId: string | null;
  setActiveWbsTree: (id: string) => void;
  addWbsTree: (name: string, rootLabel: string) => void;
  renameWbsTree: (id: string, name: string) => void;
  deleteWbsTree: (id: string) => void;

  editingDescriptionId: string | null;
  setEditingDescriptionId: (id: string | null) => void;
  contextMenuNodeId: string | null;
  setContextMenuNodeId: (id: string | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addGoal: (parentId: string | null, label: string, position?: { x: number; y: number }) => void;
  // Boş tuvale örnek bir kırılım ağacı basar. Tuval doluysa hiçbir şey yapmaz.
  loadWbsExample: () => void;
  updateGoal: (id: string, data: Partial<GoalNodeData>) => void;
  deleteGoal: (id: string) => void;
  toggleExpand: (id: string) => void;
  toggleHideCompleted: (id: string) => void;
  /** Sürükleme bittiğinde çağrılır; taşınan kutuların sapmasını günceller. */
  nudgeGoals: (ids: string[], dx: number, dy: number) => void;
  /** Bütün elle kaydırmaları siler, ağacı sıfırdan dizer. */
  realignAllGoals: () => void;
  /**
   * Kayıtlı konumlar güncel dizilim kurallarıyla uyuşmuyorsa bir kez düzeltir.
   * Dizilim yalnızca değişiklik anında çalıştığı için, kurallar değiştiğinde
   * eski projeler kullanıcı bir şey düzenleyene kadar eski düzende kalıyordu.
   */
  normalizeWbsLayout: () => void;
}

/**
 * Açık ağaç. activeWbsTreeId proje değişince eskimiş olabiliyor, o yüzden
 * her yerde listeye bakarak çözülüyor; bulunamazsa ilk ağaç açıktır.
 */
export function getActiveWbsTree(state: { wbsTrees: WbsTree[]; activeWbsTreeId: string | null }): WbsTree | undefined {
  return state.wbsTrees.find((a) => a.id === state.activeWbsTreeId) || state.wbsTrees[0];
}

export const getDescendants = (parentId: string, edges: Edge[]): string[] => {
  const children = edges.filter((e) => e.source === parentId).map((e) => e.target);
  return children.reduce((acc, childId) => {
    return [...acc, childId, ...getDescendants(childId, edges)];
  }, [] as string[]);
};

const getDirectChildren = (parentId: string, edges: Edge[]): string[] => {
  return edges.filter((e) => e.source === parentId).map((e) => e.target);
};

// Kenar listesini iki yönlü aramaya hazırlar. Bu fonksiyonlar her düğüm
// güncellemesinde çalıştığı için, dizide tek tek arama (find/filter/some)
// yerine önceden kurulmuş harita kullanılır; sonuç aynı, maliyet değil.
const buildEdgeIndex = (edges: Edge[]) => {
  const childrenBySource = new Map<string, string[]>();
  const targetIds = new Set<string>();
  for (const e of edges) {
    targetIds.add(e.target);
    const mevcut = childrenBySource.get(e.source);
    if (mevcut) mevcut.push(e.target);
    else childrenBySource.set(e.source, [e.target]);
  }
  return { childrenBySource, targetIds };
};

const computeVisibility = (nodes: GoalNode[], edges: Edge[]) => {
  const { childrenBySource, targetIds } = buildEdgeIndex(edges);
  const nodeById = new Map(nodes.map(n => [n.id, n]));

  const rootNodes = nodes.filter(n => !targetIds.has(n.id));
  const visibleNodeIds = new Set<string>();
  rootNodes.forEach(n => visibleNodeIds.add(n.id));

  // shift() baştan silmek diziyi her seferinde kaydırıyordu; imleçle ilerlemek
  // aynı sırayı (genişlik öncelikli) korur.
  const queue = [...rootNodes];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current.data.isExpanded) {
      const childrenIds = childrenBySource.get(current.id) || [];
      const children = childrenIds.map(cid => nodeById.get(cid)).filter(Boolean) as GoalNode[];

      children.forEach(child => {
        if (current.data.hideCompleted && child.data.status === 'Done') {
           // do not show
        } else {
           visibleNodeIds.add(child.id);
           queue.push(child);
        }
      });
    }
  }

  return {
    nodes: nodes.map(n => ({ ...n, hidden: !visibleNodeIds.has(n.id) })),
    edges: edges.map(e => ({ ...e, hidden: !visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target) }))
  };
};

import { getTreeLayout } from '../../utils/treeLayout';

// Kutunun varsayılan ölçüsü. Gerçek ölçü ekrandan okunabiliyorsa (React Flow
// kutuları ölçtükten sonra `measured` alanına yazar) o kullanılır: uzun
// başlıklı kutular sarıp uzuyor, sabit sayıyla dizilirse alt satıra biniyorlar.
// DİKKAT: bu genişlik gerçekten kutunun genişliği olmalı. Eskiden 440 yazıyordu
// (kutu 220), yani her kutu için iki katı yer ayrılıyordu; ağaç gereksiz yere
// iki kat geniş açılıyordu.
export const WBS_NODE_W = 240;
export const WBS_NODE_H = 84;
const WBS_NODE_SEP = 50;
const WBS_RANK_SEP = 100;

const kutuOlcusu = (node: Node) => ({
  width: node.measured?.width || WBS_NODE_W,
  height: node.measured?.height || WBS_NODE_H,
});

type Konum = { x: number; y: number };

/**
 * Ağacı dizer ve iki harita döndürür:
 * - `yerler`: kutunun kendi kaydırması hesaba katılmadan oturacağı yer
 * - `konumlar`: kaydırma da eklendikten sonraki son yeri
 * Sürükleme bittiğinde sapmayı hesaplamak için ikisi de gerekiyor.
 */
const hesaplaDizilim = (nodes: GoalNode[], edges: Edge[]) => {
  const visibleNodes = nodes.filter(n => !n.hidden);
  const visibleEdges = edges.filter(e => !e.hidden);

  const baseLayouted = getTreeLayout(visibleNodes, visibleEdges, {
    nodeSep: WBS_NODE_SEP,
    rankSep: WBS_RANK_SEP,
    getNodeDimensions: kutuOlcusu
  });

  const { childrenBySource, targetIds } = buildEdgeIndex(visibleEdges);
  const visibleNodeById = new Map(visibleNodes.map(n => [n.id, n]));
  const layoutedById = baseLayouted;

  const yerler = new Map<string, Konum>();
  const konumlar = new Map<string, Konum>();

  const yurut = (nodeId: string, mirasKayma: { dx: number; dy: number }) => {
    const originalNode = visibleNodeById.get(nodeId);
    const layoutedNode = layoutedById.get(nodeId);
    if (!originalNode || !layoutedNode) return;

    const kok = !targetIds.has(nodeId);

    // Kökün bağlı olduğu bir ebeveyn yok, sapması neye göre ölçülecek belli
    // değil: kök kutular mutlak konumlarını korur. Kullanıcı bir kökü nereye
    // bıraktıysa bütün ağacı oraya taşımış olur.
    const kayma = kok
      ? {
          dx: originalNode.position.x - layoutedNode.x,
          dy: originalNode.position.y - layoutedNode.y,
        }
      : mirasKayma;

    yerler.set(nodeId, {
      x: layoutedNode.x + kayma.dx,
      y: layoutedNode.y + kayma.dy,
    });

    const ox = kok ? 0 : (originalNode.data.offsetX || 0);
    const oy = kok ? 0 : (originalNode.data.offsetY || 0);

    konumlar.set(nodeId, {
      x: layoutedNode.x + kayma.dx + ox,
      y: layoutedNode.y + kayma.dy + oy,
    });

    // Alt dallar ebeveynin kaydırmasını sürdürür: bir kutuyu oynattığında
    // altındaki ağaç da onunla gelir.
    const cocukKayma = { dx: kayma.dx + ox, dy: kayma.dy + oy };
    (childrenBySource.get(nodeId) || []).forEach(childId => yurut(childId, cocukKayma));
  };

  visibleNodes.filter(n => !targetIds.has(n.id)).forEach(root => yurut(root.id, { dx: 0, dy: 0 }));

  return { yerler, konumlar };
};

const getLayoutedElements = (nodes: GoalNode[], edges: Edge[]) => {
  const { konumlar } = hesaplaDizilim(nodes, edges);

  return nodes.map((node) => {
    if (node.hidden) return node;
    const konum = konumlar.get(node.id);
    if (!konum) return node;

    return {
      ...node,
      position: konum,
      targetPosition: 'top',
      sourcePosition: 'bottom',
    };
  }) as GoalNode[];
};

const cascadeStatus = (nodes: GoalNode[], edges: Edge[], changedId: string): GoalNode[] => {
  let currentNodes = [...nodes];
  let currentId: string | undefined = changedId;

  while (currentId) {
    const parentId = edges.find((e) => e.target === currentId)?.source;
    if (!parentId) break;

    const parentIndex = currentNodes.findIndex((n) => n.id === parentId);
    if (parentIndex === -1) break;

    const childrenIds = getDirectChildren(parentId, edges);
    const childrenNodes = childrenIds.map(cid => currentNodes.find(n => n.id === cid)).filter(Boolean) as GoalNode[];

    if (childrenNodes.length === 0) break;

    const allDone = childrenNodes.every(n => n.data.status === 'Done');
    const allFailed = childrenNodes.every(n => n.data.status === 'Failed');
    const allToDo = childrenNodes.every(n => n.data.status === 'To Do');

    let newStatus = currentNodes[parentIndex].data.status;
    
    if (allDone) {
      newStatus = 'Done';
    } else if (allFailed) {
      newStatus = 'Failed';
    } else if (allToDo) {
      newStatus = 'To Do';
    } else {
      newStatus = 'In Progress';
    }

    if (newStatus !== currentNodes[parentIndex].data.status) {
      currentNodes[parentIndex] = {
        ...currentNodes[parentIndex],
        data: { ...currentNodes[parentIndex].data, status: newStatus }
      };
      currentId = parentId;
    } else {
      break;
    }
  }

  return currentNodes;
};

/**
 * Yeni bir ağacın kök kutusu.
 * DİKKAT: Kimlik uuid. Eskiden sabit 'root' yazıyordu; tek ağaç varken sorun
 * değildi ama aynı projede iki ağaç olunca ikisinin de kökü aynı kimliği
 * taşırdı ve ajandadan gelen güncelleme yanlış ağaca düşerdi. Eski kayıtlarda
 * 'root' duruyor; bir projede eski ağaçtan yalnızca bir tane olduğu için
 * çakışmıyor.
 */
export const yeniWbsKoku = (label: string): GoalNode => ({
  id: uuidv4(),
  type: 'goalNode',
  position: { x: 0, y: 0 },
  data: {
    label,
    status: 'To Do',
    isExpanded: true,
    isUntouchedDefault: true,
  },
});

export const getDefaultNodes = (): GoalNode[] => [yeniWbsKoku(i18n.t('new_project'))];

/** Yeni proje / yeni araç için tek ağaçlık başlangıç listesi. */
export const getDefaultWbsTrees = (): WbsTree[] => [{
  id: uuidv4(),
  name: i18n.t('wbs_default_tree_name'),
  nodes: getDefaultNodes(),
  edges: [],
  createdAt: Date.now(),
}];

// Tuval "el değmemiş" mi? Ya tamamen boş, ya da sadece yeni projeyle gelen
// varsayılan kök düğüm duruyor. Boş ekran paneli ve örnek şablon buna bakar.
export const isPristineWbs = (nodes: GoalNode[], edges: Edge[]): boolean => {
  if (nodes.length === 0) return true;
  if (nodes.length > 1 || edges.length > 0) return false;
  const n = nodes[0];
  // İşaret yeni projelerde var; işaretsiz eski projeler için başlık
  // karşılaştırması geriye dönük uyum olarak korunuyor.
  const basligaDokunulmamis = n.data.isUntouchedDefault === true
    || n.data.label === i18n.t('new_project');
  // Kökün kimliği artık uuid (bkz. yeniWbsKoku); eskiden burada 'root'
  // aranıyordu, yeni ağaçlarda o koşul hiç tutmazdı.
  return basligaDokunulmamis
    && n.data.status === 'To Do'
    && !n.data.description
    && !n.data.notes
    && !n.data.targetDate;
};

export const createWbsSlice: StateCreator<
  RoadmapState,
  [],
  [],
  WbsSlice
> = (set, get) => {
  /** Açık ağacı değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: RoadmapState, degistir: (agac: WbsTree) => WbsTree): RoadmapState => {
    const aktif = getActiveWbsTree(state);
    if (!aktif) return state;
    return { ...state, wbsTrees: state.wbsTrees.map((a) => (a.id === aktif.id ? degistir(a) : a)) };
  };

  /**
   * Verilen kutuyu içeren ağacı günceller. Ajandadan gelen tamamlama işareti
   * açık olmayan bir ağaçtaki kutuyu hedefleyebiliyor; o yüzden ağaç kutunun
   * kimliğinden bulunur, açık olandan değil.
   */
  const kutununAgaciniGuncelle = (state: RoadmapState, nodeId: string, degistir: (agac: WbsTree) => WbsTree): RoadmapState => {
    const hedef = state.wbsTrees.find((a) => a.nodes.some((n) => n.id === nodeId)) || getActiveWbsTree(state);
    if (!hedef) return state;
    return { ...state, wbsTrees: state.wbsTrees.map((a) => (a.id === hedef.id ? degistir(a) : a)) };
  };

  /** Kutular değiştikten sonra görünürlük ve dizilim hep birlikte geçer. */
  const yenidenDiz = (nodes: GoalNode[], edges: Edge[]) => {
    const { nodes: updatedNodes, edges: updatedEdges } = computeVisibility(nodes, edges);
    return { nodes: getLayoutedElements(updatedNodes, updatedEdges), edges: updatedEdges };
  };

  return {
  wbsTrees: getDefaultWbsTrees(),
  activeWbsTreeId: null,
  editingDescriptionId: null,
  contextMenuNodeId: null,

  setActiveWbsTree: (id) => {
    // Geçmiş yığını açık ağaca ait; başka bir ağaca geçilince kayıtlar artık
    // ekranda olmayan bir şeyi anlatıyor ve geri tuşu görünürde hiçbir şey
    // yapmıyordu. (Aynısı ağaç ekleme/silme için de geçerli.)
    gecmisiTemizle();
    set({ activeWbsTreeId: id, editingDescriptionId: null, contextMenuNodeId: null } as Partial<RoadmapState>);
  },

  addWbsTree: (name, rootLabel) => {
    gecmisiTemizle();
    set((state) => {
      const yeni: WbsTree = {
        id: uuidv4(),
        name,
        nodes: [yeniWbsKoku(rootLabel)],
        edges: [],
        createdAt: Date.now(),
      };
      return { ...state, wbsTrees: [...state.wbsTrees, yeni], activeWbsTreeId: yeni.id, editingDescriptionId: null, contextMenuNodeId: null };
    });
  },

  renameWbsTree: (id, name) => {
    set((state) => ({ ...state, wbsTrees: state.wbsTrees.map((a) => (a.id === id ? { ...a, name } : a)) }));
  },

  deleteWbsTree: (id) => {
    gecmisiTemizle();
    set((state) => {
      const kalan = state.wbsTrees.filter((a) => a.id !== id);
      return {
        ...state,
        wbsTrees: kalan,
        activeWbsTreeId: state.activeWbsTreeId === id ? (kalan[0]?.id ?? null) : state.activeWbsTreeId,
        editingDescriptionId: null,
        contextMenuNodeId: null,
      };
    });
  },

  setEditingDescriptionId: (id) => {
    set({ editingDescriptionId: id });
  },

  setContextMenuNodeId: (id) => {
    set({ contextMenuNodeId: id });
  },

  onNodesChange: (changes: NodeChange[]) => {
    // Silme dışında buraya gelen her şey geçici: seçim, boyut ölçümü ve
    // sürükleme sırasındaki ara kareler. Bunlar geçmişe girmiyor; sürüklemenin
    // sonucunu bırakma anında nudgeGoals tek kayıt olarak yazıyor.
    // Silme ise gerçek bir işlem: birden çok kutu birlikte silindiğinde de
    // tek adım olsun diye tamamı tek sınır içine alınıyor.
    const otherChanges: NodeChange[] = [];
    const silinecekler = changes.filter((c) => c.type === 'remove');
    for (const change of changes) {
      if (change.type !== 'remove') otherChanges.push(change);
    }

    if (silinecekler.length > 0) {
      islem(() => {
        silinecekler.forEach((change) => get().deleteGoal((change as { id: string }).id));
      });
    }

    if (otherChanges.length === 0) return;

    // Sürükleme sırasında kutu sadece ekranda hareket eder; sapması sürükleme
    // bitince (bkz. nudgeGoals) tek seferde yazılır. Eskiden buradaki her
    // hareket kutuyu kalıcı olarak sabitliyordu, yani tıklarken elin titrese
    // kutu farkında olmadan dizilimin dışına çıkıyordu.
    set((state) => aktifiGuncelle(state, (agac) => ({
      ...agac,
      nodes: applyNodeChanges(otherChanges, agac.nodes) as GoalNode[],
    })));
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => aktifiGuncelle(state, (agac) => ({
      ...agac,
      edges: applyEdgeChanges(changes, agac.edges),
    })));
  },

  onConnect: (connection: Connection) => {
    islem(() => set((state) => aktifiGuncelle(state, (agac) => ({
      ...agac,
      edges: addEdge(connection, agac.edges),
    }))));
  },

  // Kutu ekleme tek adım: içeride kapalı ebeveyni açmak için toggleExpand da
  // çağrılıyor ama kullanıcı için bu tek bir "kutu ekledim" işlemi. İç içe
  // işlemleri gecmis.ts tek kayda indiriyor.
  addGoal: (parentId, label, position) => islem(() => {
    logAppEvent('node_created', { tool: 'wbs', label });
    const id = uuidv4();
    const newPos = position || { x: 0, y: 0 };
    const state = get();

    const hedefAgac = parentId
      ? (state.wbsTrees.find((a) => a.nodes.some((n) => n.id === parentId)) || getActiveWbsTree(state))
      : getActiveWbsTree(state);
    if (!hedefAgac) return;

    const parentNode = hedefAgac.nodes.find((n) => n.id === parentId);

    const newNode: GoalNode = {
      id,
      type: 'goalNode',
      position: newPos,
      hidden: parentId && parentNode ? !parentNode.data.isExpanded : false,
      data: { label, status: 'To Do', isExpanded: false },
    };

    set((s) => ({
      ...s,
      wbsTrees: s.wbsTrees.map((agac) => {
        if (agac.id !== hedefAgac.id) return agac;
        const newEdges = parentId
          ? [
              ...agac.edges,
              {
                id: `e-${parentId}-${id}`,
                source: parentId,
                target: id,
                hidden: parentNode ? !parentNode.data.isExpanded : false,
              },
            ]
          : agac.edges;
        const nextNodes = cascadeStatus([...agac.nodes, newNode], newEdges, id);
        const dizili = yenidenDiz(nextNodes, newEdges);
        return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
      }),
    }));

    if (parentId && parentNode && !parentNode.data.isExpanded) {
      get().toggleExpand(parentId);
    }
  }),

  updateGoal: (id, data) => islem(() => {
    set((state) => {
      const next: any = { ...kutununAgaciniGuncelle(state, id, (agac) => {
        let nextNodes = agac.nodes.map((node) => {
          if (node.id !== id) return node;
          const yeniVeri = { ...node.data, ...data };
          // Başlık değiştirildiyse düğüm artık "varsayılan" sayılmaz.
          if (data.label !== undefined) yeniVeri.isUntouchedDefault = undefined;
          return { ...node, data: yeniVeri };
        });

        if (data.status) {
          nextNodes = cascadeStatus(nextNodes, agac.edges, id);
        }

        const dizili = yenidenDiz(nextNodes, agac.edges);
        return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
      }) };

      // Ajanda ile çift yönlü senkronizasyon (WBS -> Agenda)
      // Yalnızca linkedWbsNodeId'ye bakmak yetmez: eski kayıtlarda her projenin
      // WBS kökü sabit 'root' kimliğini taşıyor, dolayısıyla A projesinin kökü
      // için kurulan ajanda kaydı, B projesinin kökü güncellendiğinde
      // yanlışlıkla eşleşiyordu. Ters yön (toggleNotepadNoteCompletion) proje
      // kontrolünü zaten yapıyor; bu taraf da aynı ölçütü kullanmalı.
      if (data.status && Array.isArray((state as any).notepad)) {
        const linkedNote = (state as any).notepad.find((n: any) =>
          n.linkedWbsNodeId === id &&
          (!n.linkedProjectId || n.linkedProjectId === state.currentProjectId)
        );
        if (linkedNote) {
          const isCompleted = data.status === 'Done';
          if (linkedNote.isCompleted !== isCompleted) {
            next.notepad = (state as any).notepad.map((n: any) =>
              n.id === linkedNote.id ? { ...n, isCompleted, updatedAt: Date.now() } : n
            );
          }
        }
      }

      return next;
    });
  }),

  deleteGoal: (id) => islem(() => {
    set((state) => kutununAgaciniGuncelle(state, id, (agac) => {
      const parentId = agac.edges.find((e) => e.target === id)?.source;
      const descendants = getDescendants(id, agac.edges);
      const toDelete = [id, ...descendants];
      let nextNodes = agac.nodes.filter((node) => !toDelete.includes(node.id));
      const nextEdges = agac.edges.filter(
        (edge) => !toDelete.includes(edge.source) && !toDelete.includes(edge.target)
      );

      if (parentId) {
        const survivingSiblings = getDirectChildren(parentId, nextEdges);
        if (survivingSiblings.length > 0) {
          nextNodes = cascadeStatus(nextNodes, nextEdges, survivingSiblings[0]);
        }
      }

      const dizili = yenidenDiz(nextNodes, nextEdges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  toggleExpand: (id) => islem(() => {
    set((state) => kutununAgaciniGuncelle(state, id, (agac) => {
      const parentNode = agac.nodes.find((n) => n.id === id);
      if (!parentNode) return agac;

      const newExpandedState = !parentNode.data.isExpanded;
      const nextNodes = agac.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, isExpanded: newExpandedState } } : node
      );

      const dizili = yenidenDiz(nextNodes, agac.edges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  toggleHideCompleted: (id) => islem(() => {
    set((state) => kutununAgaciniGuncelle(state, id, (agac) => {
      const parentNode = agac.nodes.find((n) => n.id === id);
      if (!parentNode) return agac;

      const newHideState = !parentNode.data.hideCompleted;
      const nextNodes = agac.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, hideCompleted: newHideState } } : node
      );

      const dizili = yenidenDiz(nextNodes, agac.edges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  // Sürükleme kanvasta islemBasla/islemBitir arasına alınıyor (bkz.
  // RoadmapCanvas): geçmişe giren hal sürükleme ÖNCESİ hal olmalı, çünkü ara
  // kareler kutunun konumunu çoktan değiştirmiş oluyor. Buradaki sarmalayıcı
  // yalnızca kanvas dışından gelen çağrılar için.
  nudgeGoals: (ids, dx, dy) => islem(() => {
    set((state) => aktifiGuncelle(state, (agac) => {
      // Elin titremesi sürükleme sayılmasın. Eşiğin altındaki hareket
      // yazılmaz; aşağıdaki yeniden dizilim kutuyu yerine geri oturtur.
      const gercekSurukleme = Math.hypot(dx, dy) >= 8;

      let nextNodes = agac.nodes;
      if (gercekSurukleme) {
        const suruklenen = new Set(ids);
        const ebeveyni = new Map(agac.edges.map((e) => [e.target, e.source]));

        // Alt dallar ebeveyniyle birlikte taşındı; onların ebeveynlerine göre
        // duruşu değişmedi, sapmalarına dokunulmaz. Yalnızca ebeveyni birlikte
        // taşınmayan kutular gerçekten yer değiştirmiş sayılır.
        const kaydirilacak = ids.filter((id) => {
          const parentId = ebeveyni.get(id);
          // Kök kutu mutlak duruyor: sürükleme onu zaten yerine taşıdı,
          // sapma yazmaya gerek yok.
          if (!parentId) return false;
          return !suruklenen.has(parentId);
        });

        // Sapma alt dallara miras kalıyor. Shift'e basmadan sürüklendiğinde
        // yalnızca tutulan kutu hareket etmeli (kılavuzda böyle yazıyor), o
        // yüzden birlikte taşınmayan çocukların sapmasından aynı mesafe
        // düşülür ve yerlerinde kalırlar. Shift'le taşınan çocuklar zaten
        // sürüklenenler arasında; onlara dokunulmaz, ebeveynleriyle gelirler.
        const denklestirilecek = new Set<string>();
        kaydirilacak.concat(ids.filter((id) => !ebeveyni.has(id))).forEach((id) => {
          getDirectChildren(id, agac.edges).forEach((childId) => {
            if (!suruklenen.has(childId)) denklestirilecek.add(childId);
          });
        });

        const kume = new Set(kaydirilacak);
        if (kume.size > 0 || denklestirilecek.size > 0) {
          nextNodes = agac.nodes.map((node) => {
            const tasindi = kume.has(node.id);
            const denklestir = denklestirilecek.has(node.id);
            if (!tasindi && !denklestir) return node;
            const yon = tasindi ? 1 : -1;
            return {
              ...node,
              data: {
                ...node.data,
                offsetX: (node.data.offsetX || 0) + dx * yon,
                offsetY: (node.data.offsetY || 0) + dy * yon,
              },
            };
          });
        }
      }

      const dizili = yenidenDiz(nextNodes, agac.edges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  realignAllGoals: () => islem(() => {
    set((state) => aktifiGuncelle(state, (agac) => {
      const nextNodes = agac.nodes.map((node) => {
        const { offsetX, offsetY, isManuallyPositioned, ...kalan } = node.data;
        if (offsetX === undefined && offsetY === undefined && isManuallyPositioned === undefined) return node;
        return { ...node, data: kalan as GoalNodeData };
      });
      const dizili = yenidenDiz(nextNodes, agac.edges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  // Bilerek işlem sınırı yok: bu, araç açılırken konumları yerine oturtan
  // otomatik bir düzeltme. Kullanıcının yaptığı bir iş değil, geri alınacak
  // bir adım olarak görünmemeli.
  normalizeWbsLayout: () => {
    set((state) => {
      const aktif = getActiveWbsTree(state);
      if (!aktif || aktif.nodes.length === 0) return state;

      // Eski mutlak sabitleme işaretleri okunmuyor; dururlarsa da kafa
      // karıştırıyorlar, temizliyoruz.
      let nextNodes = aktif.nodes;
      if (aktif.nodes.some((n) => n.data.isManuallyPositioned !== undefined)) {
        nextNodes = aktif.nodes.map((node) => {
          if (node.data.isManuallyPositioned === undefined) return node;
          const { isManuallyPositioned, ...kalan } = node.data;
          return { ...node, data: kalan as GoalNodeData };
        });
      }

      const dizili = yenidenDiz(nextNodes, aktif.edges);

      // Konumlar zaten yerindeyse hiçbir şeye dokunma: yoksa araç her
      // açıldığında yeni nesneler üretilir ve gereksiz bir buluta yazma tetiklenir.
      const oynayanVar = nextNodes !== aktif.nodes || dizili.nodes.some((node, i) => {
        const onceki = aktif.nodes[i];
        if (!onceki || onceki.id !== node.id) return true;
        if (node.hidden) return false;
        return Math.abs(onceki.position.x - node.position.x) > 0.5
          || Math.abs(onceki.position.y - node.position.y) > 0.5;
      });
      if (!oynayanVar) return state;

      return {
        ...state,
        wbsTrees: state.wbsTrees.map((a) => (a.id === aktif.id ? { ...a, nodes: dizili.nodes, edges: dizili.edges } : a)),
      };
    });
  },

  // Örnek şablon: SWOT örneğiyle aynı senaryonun (kahve dükkanı) devamı.
  // Tek set ile basılır ki geri alma (undo) tek adımda çalışsın.
  loadWbsExample: () => islem(() => {
    // El değmemiş tuvalde varsayılan kök düğümün yerine geçer; dolu tuvale dokunmaz.
    const acikAgac = getActiveWbsTree(get());
    if (!acikAgac || !isPristineWbs(acikAgac.nodes, acikAgac.edges)) return;
    logAppEvent('example_loaded', { tool: 'wbs' });

    const mk = (labelKey: string, status: GoalStatus): GoalNode => ({
      id: uuidv4(),
      type: 'goalNode',
      position: { x: 0, y: 0 },
      hidden: false,
      data: { label: i18n.t(labelKey), status, isExpanded: true },
    });

    const root = mk('wbs_example_root', 'In Progress');
    // Faz durumları çocuklarından türer (bkz. cascadeStatus); elle tutarlı verildi.
    const phases: { phase: GoalNode; tasks: GoalNode[] }[] = [
      {
        phase: mk('wbs_example_p1', 'Done'),
        tasks: [mk('wbs_example_p1_t1', 'Done'), mk('wbs_example_p1_t2', 'Done')],
      },
      {
        phase: mk('wbs_example_p2', 'In Progress'),
        tasks: [mk('wbs_example_p2_t1', 'Done'), mk('wbs_example_p2_t2', 'In Progress'), mk('wbs_example_p2_t3', 'To Do')],
      },
      {
        phase: mk('wbs_example_p3', 'To Do'),
        tasks: [mk('wbs_example_p3_t1', 'To Do'), mk('wbs_example_p3_t2', 'To Do'), mk('wbs_example_p3_t3', 'To Do')],
      },
    ];

    const nodes: GoalNode[] = [root];
    const edges: Edge[] = [];
    const link = (parent: GoalNode, child: GoalNode) => {
      nodes.push(child);
      edges.push({ id: `e-${parent.id}-${child.id}`, source: parent.id, target: child.id, hidden: false });
    };
    phases.forEach(({ phase, tasks }) => {
      link(root, phase);
      tasks.forEach(task => link(phase, task));
    });

    set((state) => aktifiGuncelle(state, (agac) => {
      const dizili = yenidenDiz(nodes, edges);
      return { ...agac, nodes: dizili.nodes, edges: dizili.edges };
    }));
  }),

  };
};

import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { NodeChange, EdgeChange, Connection, Edge, Node } from '@xyflow/react';
import i18n from '../../i18n';
import type { DiagramTypeDef } from '../../config/diagramShared';
import { edgeStyle } from '../../config/diagramShared';
import { islem, gecmisiTemizle } from '../gecmis';

// Akış diyagramları ve organizasyon şemaları aynı veri yapısını kullanıyor:
// projede birden çok şema, her şemanın kendi türü, kutuları ve çizgileri.
// Şema listesini yöneten işlemler burada tek yerde duruyor; iki dilim
// (createFlowchartSlice / createOrgchartSlice) bunları kendi alan adlarına
// bağlıyor.

export type DiagramNodeData = {
  label: string;
  shape: string;
  /** Kutuda ikinci satır: organizasyon şemasında unvan / görev */
  subtitle?: string;
};

export type DiagramNode = Node<DiagramNodeData>;

export type DiagramChart = {
  id: string;
  name: string;
  type: string;
  nodes: DiagramNode[];
  edges: Edge[];
  createdAt: number;
};

/**
 * Açık şema. activeId proje değişince eskimiş olabiliyor, o yüzden her yerde
 * listeye bakarak çözülüyor; bulunamazsa ilk şema açıktır.
 */
export function getActiveChart(charts: DiagramChart[], activeId: string | null): DiagramChart | undefined {
  return charts.find((s) => s.id === activeId) || charts[0];
}

/**
 * Kesik çizgili ikincil bağlantı mı? Kutuların yan tutamaklarından (sağdan
 * çıkıp soldan giren) çekilen çizgiler ikincil sayılıyor: matris şemasında
 * proje yöneticisi hattı, ağ şemasında dış paydaş bağlantısı.
 */
function ikincilMi(sourceHandle?: string | null, targetHandle?: string | null) {
  return sourceHandle === 'right' || targetHandle === 'left';
}

interface DiagramOpsConfig {
  /** Şema listesinin state'teki alan adı (ör. 'flowcharts') */
  listKey: string;
  /** Açık şemanın kimliğini tutan alan adı (ör. 'activeFlowchartId') */
  activeKey: string;
  /** React Flow düğüm tipi */
  nodeType: string;
  getType: (id: string | null | undefined) => DiagramTypeDef;
  /** Tür değişiminde kutuların en yakın karşılığı */
  fallbacks: Record<string, string[]>;
}

export function createDiagramOps(cfg: DiagramOpsConfig, set: (fn: (state: any) => any) => void) {
  const listesi = (state: any): DiagramChart[] => state[cfg.listKey] || [];

  /** Açık şemayı değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: any, degistir: (sema: DiagramChart) => DiagramChart) => {
    const aktif = getActiveChart(listesi(state), state[cfg.activeKey]);
    if (!aktif) return state;
    return {
      ...state,
      [cfg.listKey]: listesi(state).map((s) => (s.id === aktif.id ? degistir(s) : s)),
    };
  };

  const bicimiCevir = (shape: string, hedefTur: string): string => {
    const izinli = cfg.getType(hedefTur).shapes.map((b) => b.id);
    if (izinli.includes(shape)) return shape;
    const adaylar = cfg.fallbacks[shape] || [];
    return adaylar.find((aday) => izinli.includes(aday)) || izinli[0];
  };

  /**
   * Yeni şemanın açılış içeriği. Türün hazır iskeleti varsa o kurulur
   * (organizasyon şemasında türler birbirinden dizilimiyle ayrıldığı için
   * şablon şart), yoksa tek bir başlangıç kutusu atılır.
   */
  const acilisIcerigi = (tur: DiagramTypeDef, startLabel: string) => {
    if (!tur.template) {
      return {
        nodes: [{
          id: uuidv4(),
          type: cfg.nodeType,
          position: { x: 0, y: 0 },
          data: { label: startLabel, shape: tur.startShape },
        }] as DiagramNode[],
        edges: [] as Edge[],
      };
    }

    const kimlikler: Record<string, string> = {};
    const nodes: DiagramNode[] = tur.template.nodes.map((k) => {
      const id = uuidv4();
      kimlikler[k.key] = id;
      return {
        id,
        type: cfg.nodeType,
        position: { x: k.x, y: k.y },
        data: {
          label: i18n.t(k.labelKey),
          shape: k.shape,
          ...(k.subtitleKey ? { subtitle: i18n.t(k.subtitleKey) } : {}),
        },
      };
    });

    const edges: Edge[] = tur.template.edges.map((c) => {
      const temel: Edge = {
        id: uuidv4(),
        source: kimlikler[c.source],
        target: kimlikler[c.target],
      };
      if (c.sourceHandle) temel.sourceHandle = c.sourceHandle;
      if (c.targetHandle) temel.targetHandle = c.targetHandle;
      if (c.secondary && tur.secondaryEdge) {
        temel.type = tur.secondaryEdge.type;
        temel.animated = tur.secondaryEdge.animated;
        temel.style = edgeStyle(tur.secondaryEdge);
      }
      return temel;
    });

    return { nodes, edges };
  };

  return {
    // Geçmiş açık şemaya ait; şema değişince (ya da şema eklenip silinince)
    // kayıtlar ekranda olmayan bir şeye ait olur ve geri tuşu görünürde
    // hiçbir şey yapmazdı.
    setActive: (id: string) => {
      gecmisiTemizle();
      set((state) => ({ ...state, [cfg.activeKey]: id }));
    },

    add: (type: string, name: string, startLabel: string) => {
      gecmisiTemizle();
      set((state) => {
        const { nodes, edges } = acilisIcerigi(cfg.getType(type), startLabel);
        const yeni: DiagramChart = { id: uuidv4(), name, type, nodes, edges, createdAt: Date.now() };
        return { ...state, [cfg.listKey]: [...listesi(state), yeni], [cfg.activeKey]: yeni.id };
      });
    },

    rename: (id: string, name: string) => {
      set((state) => ({
        ...state,
        [cfg.listKey]: listesi(state).map((s) => (s.id === id ? { ...s, name } : s)),
      }));
    },

    remove: (id: string) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = listesi(state).filter((s) => s.id !== id);
        return {
          ...state,
          [cfg.listKey]: kalan,
          [cfg.activeKey]: state[cfg.activeKey] === id ? (kalan[0]?.id ?? null) : state[cfg.activeKey],
        };
      });
    },

    changeType: (id: string, type: string) => islem(() => {
      set((state) => ({
        ...state,
        [cfg.listKey]: listesi(state).map((s) => {
          if (s.id !== id) return s;
          return {
            ...s,
            type,
            nodes: s.nodes.map((n) => {
              const yeniBicim = bicimiCevir(n.data.shape, type);
              return yeniBicim === n.data.shape ? n : { ...n, data: { ...n.data, shape: yeniBicim } };
            }),
          };
        }),
      }));
    }),

    // Seçim, ölçüm ve sürükleme ara kareleri geçmişe girmiyor; yalnızca silme
    // gerçek bir işlem. Silinen kutunun çizgileri de aynı işlemde gidiyor:
    // arkadan gelen çizgi silme çağrısı ayrı bir adım olarak görünmesin ve
    // geri alındığında kutu çizgileriyle birlikte dönsün diye.
    onNodesChange: (changes: NodeChange[]) => {
      const silinenler = new Set(
        changes.filter((c) => c.type === 'remove').map((c) => (c as { id: string }).id)
      );
      const uygula = () => set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: applyNodeChanges(changes, sema.nodes) as DiagramNode[],
        edges: silinenler.size > 0
          ? sema.edges.filter((e) => !silinenler.has(e.source) && !silinenler.has(e.target))
          : sema.edges,
      })));
      if (silinenler.size > 0) islem(uygula);
      else uygula();
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const uygula = () => set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        edges: applyEdgeChanges(changes, sema.edges) as Edge[],
      })));
      if (changes.some((c) => c.type === 'remove')) islem(uygula);
      else uygula();
    },

    onConnect: (connection: Connection) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        const tur = cfg.getType(sema.type);
        // Yandan yana çekilen çizgi ikincil hat sayılır; türün kesikli stili
        // varsa o uygulanır, yoksa çizgi normal görünür.
        const ikincil = tur.secondaryEdge && ikincilMi(connection.sourceHandle, connection.targetHandle);
        const yeni: any = { ...connection, id: uuidv4() };
        if (ikincil) {
          yeni.type = tur.secondaryEdge!.type;
          yeni.animated = tur.secondaryEdge!.animated;
          yeni.style = edgeStyle(tur.secondaryEdge!);
        }
        return { ...sema, edges: addEdge(yeni, sema.edges as any) as Edge[] };
      }));
    }),

    addNode: (parentId: string | null, shape: string, label: string, position: { x: number; y: number }) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        const newNode: DiagramNode = {
          id: uuidv4(),
          type: cfg.nodeType,
          position,
          data: { label, shape },
        };
        return {
          ...sema,
          nodes: [...sema.nodes, newNode],
          edges: parentId ? [...sema.edges, { id: uuidv4(), source: parentId, target: newNode.id }] : sema.edges,
        };
      }));
    }),

    updateNode: (id: string, data: Partial<DiagramNodeData>) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: sema.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      })));
    }),

    deleteNode: (id: string) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: sema.nodes.filter((n) => n.id !== id),
        edges: sema.edges.filter((e) => e.source !== id && e.target !== id),
      })));
    }),
  };
}

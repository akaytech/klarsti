import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges } from './kutuDegisiklikleri';
import type { NodeChange, EdgeChange, Edge, Node } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { islem, tiktaIslem, gecmisiTemizle } from '../gecmis';
import { siraDegistir } from './siralama';
import { DAL_RENKLERI } from '../../utils/mindmapLayout';

export type MindmapNodeData = {
  label: string;
  /** Daraltılmış dalın altı gösterilmez. */
  collapsed?: boolean;
  /** Kökten çıkan dalın rengi; alt dallar aynı rengi sürdürür. */
  branch?: number;
  /** Yalnızca kökün çocuklarında: dal hangi yana açılıyor. */
  side?: 'left' | 'right';
  /**
   * Dal tamamlandı mı. Bilerek alt dallara yayılmıyor: zihin haritasında alt
   * dallar çoğu zaman "alt görev" değil, ayrı fikirler.
   */
  done?: boolean;
  /** Dala iliştirilen serbest not. */
  description?: string;
  /**
   * Elle taşındıysa, kendiliğinden hesaplanan yerine göre kayma payı.
   * Konumun kendisi saklanmıyor: harita yeni dal eklendikçe yeniden diziliyor,
   * mutlak konum ilk eklemede anlamsız kalırdı. Pay saklanınca dizilim yine
   * çalışıyor ama kullanıcının verdiği yer korunuyor.
   *
   * Pay alt dallara da geçiyor: dal taşınınca altındakiler onunla gelsin diye
   * (bkz. MindmapCanvas).
   */
  dx?: number;
  dy?: number;
  /** Bu dalın altındaki biten (tiklenmiş) dallar gizli mi. */
  hideDone?: boolean;
};

export type MindmapNode = Node<MindmapNodeData>;

/**
 * Bir projede birden çok zihin haritası olabiliyor. Akış şemasındaki
 * (Flowchart) kalıbın aynısı; farkı, zihin haritasının türü olmaması ve
 * her zaman bir kökle başlaması.
 */
export type Mindmap = {
  id: string;
  name: string;
  nodes: MindmapNode[];
  edges: Edge[];
  createdAt: number;
};

export interface MindmapSlice {
  mindmaps: Mindmap[];
  /**
   * Ekranda açık olan harita. Kişisel bir tercih olduğu için projeye
   * kaydedilmez; kaydedilse aynı projede çalışan iki kişi birbirinin
   * sekmesini değiştirirdi.
   */
  activeMindmapId: string | null;
  /**
   * Klavyeyle çalışırken hangi dalın seçili olduğu. Kişisel ve anlık bir
   * durum olduğu için projeye kaydedilmez.
   */
  mindmapSelectedId: string | null;
  setMindmapSelected: (id: string | null) => void;
  /**
   * Adı düzenlenen dal. Eskiden kırılım ağacının editingDescriptionId alanı
   * ödünç alınıyordu; zihin haritasına gerçek bir açıklama kutusu gelince o
   * varsayım çöktü (açıklamayı açan dal aynı anda ad düzenlemeye de giriyordu),
   * bu yüzden ayrıldı.
   */
  mindmapEditingLabelId: string | null;
  setMindmapEditingLabel: (id: string | null) => void;
  /** Açıklama kutusu açık olan dal. */
  mindmapDescriptionId: string | null;
  setMindmapDescriptionId: (id: string | null) => void;
  toggleMindmapDone: (id: string) => void;

  setActiveMindmap: (id: string) => void;
  addMindmap: (name: string, rootLabel: string) => void;
  renameMindmap: (id: string, name: string) => void;
  /** Çalışmayı listede başka bir sıraya taşır (bkz. siralama.ts). */
  moveMindmapTo: (id: string, hedefIndex: number) => void;
  deleteMindmap: (id: string) => void;

  // Aşağıdakiler hep açık olan harita üzerinde çalışır.
  onMindmapNodesChange: (changes: NodeChange[]) => void;
  onMindmapEdgesChange: (changes: EdgeChange[]) => void;
  /** Verilen düğüme alt dal ekler ve yeni dalın kimliğini döndürür. */
  addMindmapChild: (parentId: string, label: string) => string | null;
  /** Verilen düğümün kardeşini ekler (kökün kardeşi olmaz). */
  addMindmapSibling: (nodeId: string, label: string) => string | null;
  updateMindmapNode: (id: string, data: Partial<MindmapNodeData>) => void;
  /** Düğümü ve altındaki bütün dalları siler. Kök silinmez. */
  deleteMindmapNode: (id: string) => void;
  toggleMindmapCollapse: (id: string) => void;
  /** Bu dalın altındaki biten dalları gizler / geri gösterir. */
  toggleMindmapHideDone: (id: string) => void;
  /**
   * Elle taşıma. Pay mutlak veriliyor (eski payın üstüne değil), böylece
   * çağıran tarafta toplama hatası birikmiyor.
   *
   * `yalnizKendisi` doğruysa alt dallar yerinde kalır: pay onlara da geçtiği
   * için, farkı doğrudan çocuklardan düşüyoruz.
   */
  moveMindmapNode: (id: string, dx: number, dy: number, yalnizKendisi: boolean) => void;
  /** Açık haritadaki bütün elle taşımaları geri alır. */
  resetMindmapLayout: () => void;
}

/**
 * Açık harita. activeMindmapId proje değişince eskimiş olabiliyor, o yüzden
 * her yerde listeye bakarak çözülüyor; bulunamazsa ilk harita açıktır.
 */
export function getActiveMindmap(state: { mindmaps: Mindmap[]; activeMindmapId: string | null }): Mindmap | undefined {
  return state.mindmaps.find((h) => h.id === state.activeMindmapId) || state.mindmaps[0];
}

/** Yeni bir haritanın kök düğümü. */
export function yeniMindmapKoku(label: string): MindmapNode {
  return { id: uuidv4(), type: 'mindmapNode', position: { x: 0, y: 0 }, data: { label, branch: 0 } };
}

export const getMindmapRoot = (nodes: MindmapNode[], edges: Edge[]): MindmapNode | undefined => {
  if (nodes.length === 0) return undefined;
  const cocuk = new Set(edges.map((e) => e.target));
  return nodes.find((n) => !cocuk.has(n.id)) || nodes[0];
};

/** Bir düğümün altındaki bütün dallar (kendisi hariç). */
export const getMindmapDescendants = (id: string, edges: Edge[]): string[] => {
  const sonuc: string[] = [];
  const sira = [id];
  while (sira.length > 0) {
    const su = sira.pop()!;
    edges.filter((e) => e.source === su).forEach((e) => {
      sonuc.push(e.target);
      sira.push(e.target);
    });
  }
  return sonuc;
};

export const createMindmapSlice: StateCreator<
  RoadmapState,
  [],
  [],
  MindmapSlice
> = (set, get) => {
  /** Açık haritayı değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: RoadmapState, degistir: (harita: Mindmap) => Mindmap) => {
    const aktif = getActiveMindmap(state);
    if (!aktif) return state;
    return {
      ...state,
      mindmaps: state.mindmaps.map((h) => (h.id === aktif.id ? degistir(h) : h)),
    };
  };

  /** Yeni dalın rengi ve yönü ebeveynine göre belirlenir. */
  const yeniDugum = (harita: Mindmap, parentId: string, label: string): MindmapNode => {
    const kok = getMindmapRoot(harita.nodes, harita.edges);
    const ebeveyn = harita.nodes.find((n) => n.id === parentId);
    const kokun_cocugu = kok?.id === parentId;

    let branch = ebeveyn?.data.branch ?? 0;
    let side: 'left' | 'right' | undefined;
    if (kokun_cocugu) {
      const kardesler = harita.edges.filter((e) => e.source === parentId).length;
      branch = kardesler % DAL_RENKLERI.length;
      // Dallar iki yana dengeli dağılsın.
      side = kardesler % 2 === 0 ? 'right' : 'left';
    }

    return {
      id: uuidv4(),
      type: 'mindmapNode',
      position: { x: 0, y: 0 },
      data: { label, branch, side },
    };
  };

  return {
    mindmaps: [],
    activeMindmapId: null,
    mindmapSelectedId: null,
    mindmapEditingLabelId: null,
    mindmapDescriptionId: null,

    setMindmapSelected: (id) => set({ mindmapSelectedId: id } as Partial<RoadmapState>),
    setMindmapEditingLabel: (id) => set({ mindmapEditingLabelId: id } as Partial<RoadmapState>),
    setMindmapDescriptionId: (id) => set({ mindmapDescriptionId: id } as Partial<RoadmapState>),

    toggleMindmapDone: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, done: !n.data.done } } : n)),
      })));
    }),

    // Geçmiş açık haritaya ait; harita değişince kayıtlar ekranda olmayan bir
    // şeye ait olur ve geri tuşu görünürde hiçbir şey yapmazdı.
    setActiveMindmap: (id) => {
      gecmisiTemizle();
      set({
        activeMindmapId: id,
        mindmapSelectedId: null,
        mindmapEditingLabelId: null,
        mindmapDescriptionId: null,
      } as Partial<RoadmapState>);
    },

    addMindmap: (name, rootLabel) => {
      gecmisiTemizle();
      set((state) => {
        const yeni: Mindmap = {
          id: uuidv4(),
          name,
          nodes: [yeniMindmapKoku(rootLabel)],
          edges: [],
          createdAt: Date.now(),
        };
        return { ...state, mindmaps: [...state.mindmaps, yeni], activeMindmapId: yeni.id, mindmapSelectedId: null, mindmapEditingLabelId: null, mindmapDescriptionId: null };
      });
    },

    moveMindmapTo: (id, hedefIndex) => islem(() => {
      set((state) => {
        const yeni = siraDegistir(state.mindmaps, id, hedefIndex);
        return yeni ? { ...state, mindmaps: yeni } : state;
      });
    }),

    renameMindmap: (id, name) => {
      set((state) => ({
        ...state,
        mindmaps: state.mindmaps.map((h) => (h.id === id ? { ...h, name } : h)),
      }));
    },

    deleteMindmap: (id) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = state.mindmaps.filter((h) => h.id !== id);
        return {
          ...state,
          mindmaps: kalan,
          activeMindmapId: state.activeMindmapId === id ? (kalan[0]?.id ?? null) : state.activeMindmapId,
          mindmapSelectedId: null,
          mindmapEditingLabelId: null,
          mindmapDescriptionId: null,
        };
      });
    },

    onMindmapNodesChange: (changes) => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: applyNodeChanges(changes, harita.nodes) as MindmapNode[],
      })));
    },

    onMindmapEdgesChange: (changes) => {
      // Silme geçmişe girmeli ve kutu silmeyle AYNI işlemde kalmalı; ayrı
      // kalırsa geçmişe "çizgi zaten yok" hali düşer ve geri alma kutuyu
      // ebeveynsiz geri getirir (bkz. tiktaIslem).
      const uygula = () => set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        edges: applyEdgeChanges(changes, harita.edges) as Edge[],
      })));
      if (changes.some((c) => c.type === 'remove')) tiktaIslem(uygula);
      else uygula();
    },

    addMindmapChild: (parentId, label) => islem(() => {
      const aktif = getActiveMindmap(get());
      if (!aktif || !aktif.nodes.some((n) => n.id === parentId)) return null;
      const dugum = yeniDugum(aktif, parentId, label);
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        // Kapalı bir dala ekleme yapılırsa yeni dal görünmezdi; açıyoruz.
        nodes: [...harita.nodes.map((n) => (n.id === parentId && n.data.collapsed ? { ...n, data: { ...n.data, collapsed: false } } : n)), dugum],
        edges: [...harita.edges, { id: uuidv4(), source: parentId, target: dugum.id }],
      })));
      return dugum.id;
    }),

    addMindmapSibling: (nodeId, label) => {
      const aktif = getActiveMindmap(get());
      const kenar = aktif?.edges.find((e) => e.target === nodeId);
      if (!kenar) return null; // kökün kardeşi olmaz
      return get().addMindmapChild(kenar.source, label);
    },

    updateMindmapNode: (id, data) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      })));
    }),

    deleteMindmapNode: (id) => islem(() => {
      set((state) => {
        const aktif = getActiveMindmap(state);
        if (!aktif) return state;
        const kok = getMindmapRoot(aktif.nodes, aktif.edges);
        if (!kok || kok.id === id) return state;
        const silinecek = new Set([id, ...getMindmapDescendants(id, aktif.edges)]);
        return {
          ...aktifiGuncelle(state, (harita) => ({
            ...harita,
            nodes: harita.nodes.filter((n) => !silinecek.has(n.id)),
            edges: harita.edges.filter((e) => !silinecek.has(e.source) && !silinecek.has(e.target)),
          })),
          mindmapSelectedId: silinecek.has(state.mindmapSelectedId || '') ? null : state.mindmapSelectedId,
          mindmapEditingLabelId: silinecek.has(state.mindmapEditingLabelId || '') ? null : state.mindmapEditingLabelId,
          mindmapDescriptionId: silinecek.has(state.mindmapDescriptionId || '') ? null : state.mindmapDescriptionId,
        };
      });
    }),

    toggleMindmapCollapse: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } } : n)),
      })));
    }),

    toggleMindmapHideDone: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, hideDone: !n.data.hideDone } } : n)),
      })));
    }),

    moveMindmapNode: (id, dx, dy, yalnizKendisi) => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => {
        const dugum = harita.nodes.find((n) => n.id === id);
        if (!dugum) return harita;
        const farkX = dx - (dugum.data.dx ?? 0);
        const farkY = dy - (dugum.data.dy ?? 0);
        const cocuklar = new Set(harita.edges.filter((e) => e.source === id).map((e) => e.target));
        return {
          ...harita,
          nodes: harita.nodes.map((n) => {
            if (n.id === id) return { ...n, data: { ...n.data, dx, dy } };
            if (yalnizKendisi && cocuklar.has(n.id)) {
              return { ...n, data: { ...n.data, dx: (n.data.dx ?? 0) - farkX, dy: (n.data.dy ?? 0) - farkY } };
            }
            return n;
          }),
        };
      }));
    }),

    resetMindmapLayout: () => islem(() => {
      set((state) => aktifiGuncelle(state, (harita) => ({
        ...harita,
        nodes: harita.nodes.map((n) => {
          if (n.data.dx === undefined && n.data.dy === undefined) return n;
          const { dx: _dx, dy: _dy, ...kalan } = n.data;
          return { ...n, data: kalan };
        }),
      })));
    }),
  };
};

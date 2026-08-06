import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { Connection, EdgeChange, NodeChange } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { islem, gecmisiTemizle } from '../gecmis';

/** Süre alanlarının birimi. Veri eski kayıtlarla uyumlu kalsın diye İngilizce. */
export type VsmBirim = 'sec' | 'min' | 'hr' | 'day';

/**
 * Süreler artık çıplak sayı değil. Eskiden işlem kutusuna yazılan saniye ile
 * stok kutusuna yazılan gün aynı torbada toplanıyordu ve alttaki iki toplam
 * anlamsızdı; her değer birimiyle birlikte duruyor, hesap saniyeye çevirip
 * topluyor.
 */
export interface VsmSure {
  deger: number;
  birim: VsmBirim;
}

export interface VsmCustomField {
  id: string;
  name: string;
  value: string;
}

export type VsmNodeTuru =
  | 'vsmProcess'
  | 'vsmSupplierCustomer'
  | 'vsmInventory'
  | 'vsmProductionControl'
  | 'vsmSupermarket'
  | 'vsmShipment'
  | 'vsmKaizen';

export interface VsmNodeData {
  label: string;

  // --- İşlem kutusu ---
  /** Bir parçanın işlemde geçirdiği süre. Katma değerli sayılan tek süre bu. */
  cycleTime?: VsmSure;
  /** Ürün değişiminde kaybedilen ayar süresi. */
  changeoverTime?: VsmSure;
  /** Makinenin çalışmaya hazır olduğu zamanın yüzdesi. */
  uptime?: number;
  /** İlk seferde doğru üretilen oranı (%). */
  fpy?: number;
  /** İstasyondaki operatör sayısı. */
  operatorSayisi?: number;
  /** Parti büyüklüğü (adet). */
  partiBuyuklugu?: number;

  // --- Stok / süpermarket ---
  /**
   * Bekleyen parça adedi. Bekleme süresi buradan hesaplanır (adet ÷ günlük
   * talep); kullanıcıya doğrudan süre yazdırmak yanlıştı, gerçek VSM'de stoğa
   * adet yazılır.
   */
  adet?: number;
  /**
   * Bekleme süresi elle girilmişse adedin yerine bu kullanılır. Sayımın
   * olmadığı ama sürenin bilindiği durumlar için (ve eski kayıtların
   * taşınması için) gerekli.
   */
  beklemeSuresi?: VsmSure;

  // --- Tedarikçi / müşteri ---
  rol?: 'tedarikci' | 'musteri';

  // --- Sevkiyat ---
  /** "Günde 1", "Haftada 2" gibi serbest metin. */
  siklik?: string;

  // --- Üretim kontrol ---
  /** Planlamanın yürüdüğü sistem (MRP, ERP, çizelge...). */
  sistem?: string;

  customFields?: VsmCustomField[];
  [key: string]: any;
}

export interface VsmNode {
  id: string;
  type: VsmNodeTuru | string;
  position: { x: number; y: number };
  data: VsmNodeData;
  [key: string]: any;
}

/**
 * Malzeme akışı: itme, çekme, FIFO şeridi. Bilgi akışı: elle ve elektronik.
 * Yalnızca malzeme akışı okları zaman hesabına girer.
 */
export type VsmEdgeTuru = 'vsmPush' | 'vsmPull' | 'vsmFifo' | 'vsmInfo' | 'vsmInfoElectronic';

export const VSM_MALZEME_OKLARI: VsmEdgeTuru[] = ['vsmPush', 'vsmPull', 'vsmFifo'];

export interface VsmEdge {
  id: string;
  source: string;
  target: string;
  type?: VsmEdgeTuru | string;
  label?: string;
  [key: string]: any;
}

/**
 * Takt zamanının çıktığı yer. Bunlar olmadan hiçbir işlem "talebe yetişiyor mu"
 * diye kıyaslanamıyordu; VSM'in asıl sorusu bu.
 */
export interface VsmAyarlar {
  /** Müşterinin günlük talebi (adet). */
  gunlukTalep: number;
  vardiyaSayisi: number;
  /** Bir vardiyanın brüt süresi (dakika). */
  vardiyaDakika: number;
  /** Vardiya başına toplam mola (dakika). */
  molaDakika: number;
}

export const VSM_VARSAYILAN_AYARLAR: VsmAyarlar = {
  gunlukTalep: 460,
  vardiyaSayisi: 2,
  vardiyaDakika: 480,
  molaDakika: 30,
};

/** Mevcut durum ve gelecek durum ayrı haritalar; yan yana kıyaslanır. */
export type VsmHaritaTuru = 'mevcut' | 'gelecek';

export interface VsmHarita {
  id: string;
  name: string;
  tur: VsmHaritaTuru;
  nodes: VsmNode[];
  edges: VsmEdge[];
  ayarlar: VsmAyarlar;
  createdAt: number;
}

export interface VsmSlice {
  vsmMaps: VsmHarita[];
  /** Açık harita. Kişisel tercih olduğu için projeye kaydedilmez. */
  activeVsmMapId: string | null;

  setActiveVsmMap: (id: string) => void;
  addVsmMap: (name: string, tur: VsmHaritaTuru) => string;
  renameVsmMap: (id: string, name: string) => void;
  deleteVsmMap: (id: string) => void;
  /** Mevcut durumdan gelecek durum taslağı çıkarmanın kısa yolu. */
  copyVsmMap: (id: string, name: string, tur: VsmHaritaTuru) => string | null;
  updateVsmAyarlar: (patch: Partial<VsmAyarlar>) => void;

  // Aşağıdakiler hep açık harita üzerinde çalışır.
  onVsmNodesChange: (changes: NodeChange[]) => void;
  onVsmEdgesChange: (changes: EdgeChange[]) => void;
  onVsmConnect: (connection: Connection) => void;
  addVsmNode: (type: VsmNodeTuru, label: string, position: { x: number; y: number }) => string | null;
  updateVsmNode: (id: string, data: Partial<VsmNodeData>) => void;
  deleteVsmNode: (id: string) => void;
  updateVsmEdge: (id: string, patch: Partial<VsmEdge>) => void;
  deleteVsmEdge: (id: string) => void;
}

/**
 * Açık harita. activeVsmMapId proje değişince eskimiş olabiliyor, o yüzden
 * her yerde listeye bakarak çözülüyor; bulunamazsa ilk harita açıktır.
 */
export function getActiveVsmMap(state: { vsmMaps: VsmHarita[]; activeVsmMapId: string | null }): VsmHarita | undefined {
  return state.vsmMaps.find((h) => h.id === state.activeVsmMapId) || state.vsmMaps[0];
}

/** Yeni kutuların tip bazlı başlangıç verisi. */
export function yeniVsmNodeVerisi(type: VsmNodeTuru, label: string): VsmNodeData {
  switch (type) {
    case 'vsmProcess':
      return {
        label,
        cycleTime: { deger: 60, birim: 'sec' },
        changeoverTime: { deger: 0, birim: 'min' },
        uptime: 100,
        fpy: 100,
        operatorSayisi: 1,
      };
    case 'vsmInventory':
      return { label, adet: 0 };
    case 'vsmSupermarket':
      return { label, adet: 0 };
    case 'vsmSupplierCustomer':
      return { label, rol: 'tedarikci' };
    case 'vsmShipment':
      return { label, siklik: '' };
    case 'vsmProductionControl':
      return { label, sistem: '' };
    default:
      return { label };
  }
}

export function yeniVsmHarita(name: string, tur: VsmHaritaTuru): VsmHarita {
  return {
    id: uuidv4(),
    name,
    tur,
    nodes: [],
    edges: [],
    ayarlar: { ...VSM_VARSAYILAN_AYARLAR },
    createdAt: Date.now(),
  };
}

export const createVsmSlice: StateCreator<RoadmapState, [], [], VsmSlice> = (set, get) => {
  /** Açık haritayı değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: RoadmapState, degistir: (harita: VsmHarita) => VsmHarita) => {
    const aktif = getActiveVsmMap(state);
    if (!aktif) return state;
    return {
      ...state,
      vsmMaps: state.vsmMaps.map((h) => (h.id === aktif.id ? degistir(h) : h)),
    };
  };

  return {
    vsmMaps: [],
    activeVsmMapId: null,

    // Geçmiş açık haritaya ait; harita değişince kayıtlar ekranda olmayan bir
    // şeye ait olur ve geri tuşu görünürde hiçbir şey yapmazdı.
    setActiveVsmMap: (id) => {
      gecmisiTemizle();
      set({ activeVsmMapId: id } as Partial<RoadmapState>);
    },

    addVsmMap: (name, tur) => {
      gecmisiTemizle();
      const harita = yeniVsmHarita(name, tur);
      set((state) => ({ ...state, vsmMaps: [...state.vsmMaps, harita], activeVsmMapId: harita.id }));
      return harita.id;
    },

    renameVsmMap: (id, name) => {
      set((state) => ({
        ...state,
        vsmMaps: state.vsmMaps.map((h) => (h.id === id ? { ...h, name } : h)),
      }));
    },

    deleteVsmMap: (id) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = state.vsmMaps.filter((h) => h.id !== id);
        return {
          ...state,
          vsmMaps: kalan,
          activeVsmMapId: state.activeVsmMapId === id ? kalan[0]?.id ?? null : state.activeVsmMapId,
        };
      });
    },

    copyVsmMap: (id, name, tur) => {
      gecmisiTemizle();
      const kaynak = get().vsmMaps.find((h) => h.id === id);
      if (!kaynak) return null;
      // Kimlikler yenileniyor: iki haritada aynı kutu kimliği dolaşırsa
      // düzenleme ikisini birden değiştirir.
      const kimlikHaritasi = new Map(kaynak.nodes.map((n) => [n.id, uuidv4()]));
      const kopya: VsmHarita = {
        id: uuidv4(),
        name,
        tur,
        ayarlar: { ...kaynak.ayarlar },
        createdAt: Date.now(),
        nodes: kaynak.nodes.map((n) => ({ ...n, id: kimlikHaritasi.get(n.id)!, data: { ...n.data } })),
        edges: kaynak.edges.map((e) => ({
          ...e,
          id: uuidv4(),
          source: kimlikHaritasi.get(e.source) ?? e.source,
          target: kimlikHaritasi.get(e.target) ?? e.target,
        })),
      };
      set((state) => ({ ...state, vsmMaps: [...state.vsmMaps, kopya], activeVsmMapId: kopya.id }));
      return kopya.id;
    },

    updateVsmAyarlar: (patch) => islem(() => {
      set((state) => aktifiGuncelle(state, (h) => ({ ...h, ayarlar: { ...h.ayarlar, ...patch } })));
    }),

    // Seçim, ölçüm ve sürükleme ara kareleri geçmişe girmiyor; yalnızca silme
    // gerçek bir işlem. Silinen kutunun çizgileri de aynı işlemde gidiyor:
    // arkadan gelen çizgi silme çağrısı ayrı bir adım olarak görünmesin ve
    // geri alındığında kutu çizgileriyle birlikte dönsün diye.
    onVsmNodesChange: (changes) => {
      const silinenler = new Set(changes.filter((c) => c.type === 'remove').map((c) => (c as { id: string }).id));
      const uygula = () => set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        nodes: applyNodeChanges(changes, h.nodes as any) as unknown as VsmNode[],
        edges: silinenler.size > 0
          ? h.edges.filter((e) => !silinenler.has(e.source) && !silinenler.has(e.target))
          : h.edges,
      })));
      if (silinenler.size > 0) islem(uygula);
      else uygula();
    },

    onVsmEdgesChange: (changes) => {
      const uygula = () => set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        edges: applyEdgeChanges(changes, h.edges as any) as unknown as VsmEdge[],
      })));
      if (changes.some((c) => c.type === 'remove')) islem(uygula);
      else uygula();
    },

    onVsmConnect: (connection) => islem(() => {
      // Varsayılan itme oku. Eskiden 'step' yazılıyordu; bu tip edgeTypes'ta
      // tanımlı olmadığı için düz bir React Flow oku çiziliyor, üstelik hesap
      // onu malzeme akışı sayıyordu.
      set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        edges: addEdge({ ...connection, type: 'vsmPush' }, h.edges as any) as unknown as VsmEdge[],
      })));
    }),

    addVsmNode: (type, label, position) => islem(() => {
      const aktif = getActiveVsmMap(get());
      if (!aktif) return null;
      const yeni: VsmNode = { id: uuidv4(), type, position, data: yeniVsmNodeVerisi(type, label) };
      set((state) => aktifiGuncelle(state, (h) => ({ ...h, nodes: [...h.nodes, yeni] })));
      return yeni.id;
    }),

    updateVsmNode: (id, data) => islem(() => {
      set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        nodes: h.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      })));
    }),

    deleteVsmNode: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        nodes: h.nodes.filter((n) => n.id !== id),
        edges: h.edges.filter((e) => e.source !== id && e.target !== id),
      })));
    }),

    updateVsmEdge: (id, patch) => islem(() => {
      set((state) => aktifiGuncelle(state, (h) => ({
        ...h,
        edges: h.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })));
    }),

    deleteVsmEdge: (id) => islem(() => {
      set((state) => aktifiGuncelle(state, (h) => ({ ...h, edges: h.edges.filter((e) => e.id !== id) })));
    }),
  };
};

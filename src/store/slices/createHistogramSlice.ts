import type { StateCreator } from 'zustand';
import type { RoadmapState } from '../useRoadmapStore';
import { islem } from '../gecmis';

/**
 * Eski kayıtlarda kalan sınıf/sıklık kalemi. Histogram artık ölçüm alıyor;
 * sayıya çevrilemeyen etiketler (örn. "Hatalı kaynak") ölçüm olamadığı için
 * silinmiyor, burada bekletiliyor ve kullanıcıya gösteriliyor.
 */
export interface HistogramEskiKalem {
  id: string;
  category: string;
  frequency: number;
}

export interface HistogramAyarlar {
  /** Alt spesifikasyon sınırı (LSL). */
  altSinir?: number;
  /** Üst spesifikasyon sınırı (USL). */
  ustSinir?: number;
  /** Hedef değer. */
  hedef?: number;
  /** Elle seçilen sınıf sayısı; boşsa Sturges kuralıyla hesaplanır. */
  kutuSayisi?: number;
  /** Ölçüm birimi (mm, sn, kg...). Yalnızca etiketlerde kullanılır. */
  birim?: string;
}

export interface HistogramProject {
  id: string;
  title: string;
  /**
   * Ham ölçümler. Eskiden {kategori, sıklık} kalemleri tutuluyordu; o model
   * histogram değil sıralanmamış bir Pareto'ydu ve dağılım hakkında hiçbir şey
   * söyleyemiyordu (ortalama, sapma, yeterlilik hesaplanamaz).
   */
  olcumler: number[];
  ayarlar: HistogramAyarlar;
  createdAt: number;
  eskiKalemler?: HistogramEskiKalem[];
}

export interface HistogramSlice {
  histogram: HistogramProject[];
  addHistogramProject: (histogramId: string, title: string) => void;
  /** Ölçümler toplu girilir; yüz ölçümü tek tek satıra yazdırmak işkence. */
  setHistogramOlcumler: (histogramId: string, olcumler: number[]) => void;
  updateHistogramAyarlar: (histogramId: string, patch: Partial<HistogramAyarlar>) => void;
  updateHistogramTitle: (histogramId: string, title: string) => void;
  deleteHistogramProject: (histogramId: string) => void;
  /** Taşınamamış eski kalemleri kullanıcı gördükten sonra temizler. */
  clearHistogramEskiKalemler: (histogramId: string) => void;
}

export const createHistogramSlice: StateCreator<RoadmapState, [], [], HistogramSlice> = (set) => {
  const guncelle = (state: RoadmapState, histogramId: string, degistir: (h: HistogramProject) => HistogramProject) => ({
    ...state,
    histogram: state.histogram.map((h) => (h.id === histogramId ? degistir(h) : h)),
  });

  return {
    histogram: [],

    addHistogramProject: (histogramId, title) => islem(() => {
      set((state) => ({
        ...state,
        histogram: [...state.histogram, { id: histogramId, title, olcumler: [], ayarlar: {}, createdAt: Date.now() }],
      }));
    }),

    setHistogramOlcumler: (histogramId, olcumler) => islem(() => {
      set((state) => guncelle(state, histogramId, (h) => ({ ...h, olcumler })));
    }),

    updateHistogramAyarlar: (histogramId, patch) => islem(() => {
      set((state) => guncelle(state, histogramId, (h) => ({ ...h, ayarlar: { ...h.ayarlar, ...patch } })));
    }),

    updateHistogramTitle: (histogramId, title) => islem(() => {
      set((state) => guncelle(state, histogramId, (h) => ({ ...h, title })));
    }),

    deleteHistogramProject: (histogramId) => islem(() => {
      set((state) => ({ ...state, histogram: state.histogram.filter((h) => h.id !== histogramId) }));
    }),

    // Bilerek işlem sınırı yok: eski kayıt biçiminden kalan kalemleri temizleyen
    // bir göç adımı, kullanıcının yaptığı bir iş değil.
    clearHistogramEskiKalemler: (histogramId) => {
      set((state) => guncelle(state, histogramId, (h) => ({ ...h, eskiKalemler: undefined })));
    },
  };
};

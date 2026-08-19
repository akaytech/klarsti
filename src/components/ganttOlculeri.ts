import type { GanttDurum } from '../store/slices/createGanttSlice';

/**
 * Çizelgenin ölçüleri ve renkleri.
 *
 * Ayrı dosyada çünkü hem ana ekran hem de ondan ayrılan parçalar (takvim
 * başlığı, ayrıntı şeridi) aynı sayıları kullanıyor. İkisi ayrı yerlerde
 * dursaydı biri değişip diğeri kalabilirdi — satır yüksekliği ile çubuk
 * yüksekliği tutmayınca çizelge kayar.
 */

export type Yakinlik = 'gun' | 'hafta' | 'ay';

/** Gün başına piksel. Ay görünümünde bir gün 4 piksel: bir yıl ~1500 piksel. */
export const GUN_GENISLIK: Record<Yakinlik, number> = { gun: 30, hafta: 11, ay: 4 };
export const SATIR_YUKSEKLIK = 38;
export const BASLIK_YUKSEKLIK = 52;

export const DURUMLAR: GanttDurum[] = ['bekliyor', 'devam', 'bitti', 'riskli'];

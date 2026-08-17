import { Circle, PlayCircle, CheckCircle2, MinusCircle } from 'lucide-react';
import type { RoadmapDurum } from '../store/slices/createRoadmapSlice';

/**
 * Yol haritasındaki dört durum ve görünüşleri.
 *
 * Tek yerde duruyor çünkü aynı renkleri üç yer birden çiziyor: kutunun
 * kendisi, sağ tık menüsü ve ayrıntı paneli. Ayrı ayrı yazılsaydı biri
 * değişince ötekiler geride kalırdı.
 *
 * Tailwind sınıfları tam yazılıyor; sınıf adı parça parça kurulursa Tailwind
 * onu tarama sırasında göremiyor ve o rengi hiç üretmiyor.
 */
export interface DurumGorunumu {
  durum: RoadmapDurum;
  /** i18n anahtarı. */
  etiket: string;
  icon: typeof Circle;
  /** Kutunun çerçevesi ve zemini. */
  kutu: string;
  /** Menü ve paneldeki küçük simgenin rengi. */
  metin: string;
  /** Panelde seçili düğmenin zemini. */
  secili: string;
  /** İlerleme çubuğundaki dilimin rengi (satır içi stil, sınıf değil). */
  cizgi: string;
}

export const ROADMAP_DURUMLARI: DurumGorunumu[] = [
  {
    durum: 'bekliyor',
    etiket: 'roadmap_status_bekliyor',
    icon: Circle,
    kutu: 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800',
    metin: 'text-slate-400',
    secili: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    cizgi: '#cbd5e1'
  },
  {
    durum: 'ogreniyor',
    etiket: 'roadmap_status_ogreniyor',
    icon: PlayCircle,
    kutu: 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30',
    metin: 'text-amber-500',
    secili: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    cizgi: '#f59e0b'
  },
  {
    durum: 'bitti',
    etiket: 'roadmap_status_bitti',
    icon: CheckCircle2,
    kutu: 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30',
    metin: 'text-emerald-500',
    secili: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    cizgi: '#10b981'
  },
  {
    durum: 'atlandi',
    etiket: 'roadmap_status_atlandi',
    icon: MinusCircle,
    kutu: 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/60',
    metin: 'text-slate-400',
    secili: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    cizgi: '#94a3b8'
  }
];

const HARITA = new Map(ROADMAP_DURUMLARI.map((d) => [d.durum, d]));

export const durumGorunumu = (durum: RoadmapDurum | undefined): DurumGorunumu =>
  HARITA.get(durum || 'bekliyor') || ROADMAP_DURUMLARI[0];

/** Kaynak türünün i18n anahtarı ve rengi. */
export const KAYNAK_TURLERI = [
  { tur: 'yazi', etiket: 'roadmap_res_yazi' },
  { tur: 'video', etiket: 'roadmap_res_video' },
  { tur: 'kurs', etiket: 'roadmap_res_kurs' },
  { tur: 'kitap', etiket: 'roadmap_res_kitap' },
  { tur: 'arac', etiket: 'roadmap_res_arac' },
  { tur: 'diger', etiket: 'roadmap_res_diger' }
] as const;

/**
 * Kullanıcının yazdığı adresi açmadan önce süz.
 *
 * Kaynak bağlantılarını kullanıcı yazıyor ve harita paylaşılabiliyor; adres
 * `javascript:` ya da `data:` ile başlarsa tıklayan kişinin tarayıcısında kod
 * çalışırdı. Yalnızca http ve https geçiyor, protokolsüz yazılanın başına
 * https ekleniyor.
 */
export function guvenliAdres(url: string): string | null {
  const temiz = (url || '').trim();
  if (!temiz) return null;
  const tam = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(temiz) ? temiz : `https://${temiz}`;
  try {
    const cozulen = new URL(tam);
    if (cozulen.protocol !== 'http:' && cozulen.protocol !== 'https:') return null;
    return cozulen.href;
  } catch {
    return null;
  }
}

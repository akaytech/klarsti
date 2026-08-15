import type { ToolId } from '../store/useRoadmapStore';

/**
 * "Ne yapmak istiyorsun?" — karşılama ekranındaki amaç bazlı giriş.
 *
 * Neden var: karşılama ekranı 15 aracın adını sayıyordu. Kullanıcı aracın
 * adını değil, derdini biliyor. Buradaki her satır bir derdi doğru araca
 * bağlıyor; araç adı da yanında yazıyor, kullanıcı zamanla adları öğreniyor.
 *
 * İleride bu ekrana serbest yazılan bir sohbet kutusu gelirse bu liste
 * çöpe gitmiyor: kutunun altındaki örnek başlangıçlar olur ve "hangi dert
 * hangi araç" eşlemesi zaten burada yazılı durur.
 *
 * Ajanda listede yok: kişisel bir araç, bir problemi çözmenin yolu değil.
 */

export type Amac = {
  /** Ölçümlemede görünen kısa ad. */
  id: string;
  /** Sorunun metni (i18n anahtarı). */
  metinKey: string;
  arac: ToolId;
};

export const AMACLAR: Amac[] = [
  { id: 'parcala', metinKey: 'amac_parcala', arac: 'wbs' },
  { id: 'kok_neden', metinKey: 'amac_kok_neden', arac: '5whys' },
  { id: 'surec', metinKey: 'amac_surec', arac: 'flowchart' },
  { id: 'karar', metinKey: 'amac_karar', arac: 'decision' },
  { id: 'fikir', metinKey: 'amac_fikir', arac: 'mindmap' },
  { id: 'durum', metinKey: 'amac_durum', arac: 'swot' },
];

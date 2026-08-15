/**
 * İş kırılım yapısında seviyeler sabittir:
 *
 *   derinlik 0 → PROJE      (bir ağaçta yalnızca bir tane olur)
 *   derinlik 1 → FAZ
 *   derinlik 2+ → İŞ PAKETİ (iş paketinin altındaki de iş paketidir)
 *
 * Uygulama eskiden bunlara "görev / alt görev / ana hedef" diyordu; hiçbiri
 * yöntemin kendi terimleri değildi. Etiketler tek yerden üretiliyor ki sağ tık
 * menüsü, kutunun üstündeki artı ve alttaki ekleme düğmesi aynı şeyi desin.
 */

type Ceviri = (anahtar: string) => string;

/** `derinlik` seviyesindeki kutunun ALTINA eklenecek kutunun adı. */
export const altKutuAdi = (t: Ceviri, derinlik: number): string =>
  derinlik === 0 ? t('wbs_new_phase') : t('wbs_new_package');

/** `derinlik` seviyesindeki kutunun ALTINA ekleyen düğmenin yazısı. */
export const altKutuEkleEtiketi = (t: Ceviri, derinlik: number): string =>
  derinlik === 0 ? t('wbs_add_phase') : t('wbs_add_package');

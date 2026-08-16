/**
 * Bir aracın uygulama içindeki adresi.
 *
 * Neden ayrı bir dosya: aynı adresi iki taraf üretiyor. Sol menü linkin
 * `href`ini yazmak için, AuthenticatedApp ise adresi çözüp doğru klasörü
 * açmak için. İki yerde ayrı hesaplansaydı sağ tıkla açılan sekme, sol tıkla
 * açılandan başka bir klasöre gidebilirdi.
 *
 * DİKKAT: Bu dosya bilerek bağımlılıksız. Buraya store import edilmemeli.
 */

/**
 * "Aracı açmak istiyorum ama hiç klasörüm yok" adresinin öneki:
 * /new/{arac}
 *
 * Neden böyle bir adres var: klasörsüz kullanıcıda araç satırının gideceği
 * bir yer yoktu ve satır link olamıyordu; sağ tık menüsünde "yeni sekmede aç"
 * çıkmıyordu. Artık o durumun da adresi var. Adresi açan kişinin bu arada bir
 * klasörü olmuşsa (başka sekmede açmış olabilir) doğrudan oraya gidiliyor,
 * yoksa klasörün adı soruluyor.
 *
 * DİKKAT: Yeni bir yol adı, araç sayfalarının slug havuzuyla çakışmamalı
 * (bkz. toolPages.ts'teki uyarı).
 */
export const KLASORSUZ_ONEK = '/new/';

/** Sıralamada kullanılan en az bilgi; store'un Project tipinin alt kümesi. */
export interface KlasorOzeti {
  id: string;
  updatedAt?: number;
}

/**
 * Aracın açılacağı klasör: açık klasör varsa o, yoksa en son dokunulan.
 * Hiç klasör yoksa null.
 *
 * `acikKlasorId` sayfa her yenilendiğinde null'a düşüyor ve hiçbir yer onu
 * kendiliğinden doldurmuyor. Eski kod "açık klasör yoksa yeni klasör aç"
 * diyordu; sonuç, kullanıcının her oturumda bir tane daha "Yeni Çalışma"
 * biriktirmesiydi.
 */
export function hedefKlasorBul(klasorler: KlasorOzeti[], acikKlasorId: string | null): string | null {
  if (acikKlasorId && klasorler.some((k) => k.id === acikKlasorId)) return acikKlasorId;
  if (klasorler.length === 0) return null;
  return [...klasorler].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0].id;
}

/** Araç satırının/linkinin gideceği adres. Klasör yoksa /new/{arac}. */
export function aracAdresiBul(arac: string, hedefKlasorId: string | null): string {
  return hedefKlasorId ? `/project/${hedefKlasorId}/${arac}` : `${KLASORSUZ_ONEK}${arac}`;
}

/** Adres /new/{arac} ise aracın kimliği, değilse null. */
export function klasorsuzAracAdi(pathname: string): string | null {
  if (!pathname.startsWith(KLASORSUZ_ONEK)) return null;
  const arac = pathname.slice(KLASORSUZ_ONEK.length).replace(/\/+$/, '');
  return arac && !arac.includes('/') ? arac : null;
}

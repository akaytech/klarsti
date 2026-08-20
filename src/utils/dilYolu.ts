/**
 * Adresteki dil öneki (/tr/wbs, /de/swot ...) ile ilgili yardımcılar.
 *
 * Neden var: uygulama tek sayfa ve sunucu her adrese aynı index.html'i
 * döndürüyor. Arama motoruna ve link önizlemesine dile göre farklı bir HTML
 * verebilmek için adresin dili taşıması gerekiyor — Firebase Hosting'de
 * (ücretsiz plan) sunucu tarafında dil pazarlığı yapacak bir yer yok.
 *
 * İngilizce önek ALMIYOR: /wbs İngilizce sürüm, /tr/wbs Türkçe sürüm. Böylece
 * bugüne kadar paylaşılmış adresler kırılmıyor ve İngilizce sayfalar
 * hreflang'de x-default olarak durabiliyor.
 *
 * Dilin kendisini burada AYARLAMIYORUZ: i18n.ts'teki dil algılayıcı zaten
 * 'path' yöntemiyle adresin ilk parçasına bakıyor (bkz. i18n.ts). Burası
 * sadece yönlendirmenin göreceği yolu üretiyor.
 */
import { DESTEKLENEN_DILLER } from '../config/languages';

/** Adres önekinde görünebilecek diller. İngilizce bilerek yok. */
export const YOL_DILLERI = DESTEKLENEN_DILLER.map((d) => d.code).filter((k) => k !== 'en');

/** Öneksiz sürümün dili; hreflang'de x-default olarak da bu veriliyor. */
export const VARSAYILAN_DIL = 'en';

const DIL_KUMESI = new Set(YOL_DILLERI);

export interface AyriklmisYol {
  /** Adresten okunan dil; önek yoksa null. */
  dil: string | null;
  /** Yönlendirmenin kullanacağı, dil öneki çıkarılmış yol. Hep '/' ile başlar. */
  yol: string;
}

/**
 * '/tr/wbs' -> { dil: 'tr', yol: '/wbs' }
 * '/wbs'    -> { dil: null, yol: '/wbs' }
 * '/tr'     -> { dil: 'tr', yol: '/' }
 */
export function dilOnekiniAyikla(pathname: string): AyriklmisYol {
  const parcalar = pathname.split('/').filter(Boolean);
  if (parcalar.length === 0 || !DIL_KUMESI.has(parcalar[0].toLowerCase())) {
    return { dil: null, yol: pathname || '/' };
  }
  const dil = parcalar[0].toLowerCase();
  const kalan = parcalar.slice(1).join('/');
  return { dil, yol: kalan ? `/${kalan}` : '/' };
}

/** Dil öneki eklenmiş adres üretir. İngilizce için önek eklenmez. */
export function dilliYol(dil: string, yol: string): string {
  const temiz = yol.startsWith('/') ? yol : `/${yol}`;
  if (dil === VARSAYILAN_DIL) return temiz;
  return temiz === '/' ? `/${dil}` : `/${dil}${temiz}`;
}

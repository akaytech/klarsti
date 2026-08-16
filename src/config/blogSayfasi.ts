// Blogun adresleri: klarsti.com/blog ve klarsti.com/blog/<yazi-adi>
//
// Diğer herkese açık sayfalardan (iletişim, hakkımızda, yasal) bir farkı var:
// onlar tek parçalı adresler, blog iki katmanlı. Bu yüzden ayrı bir çözücü.
//
// Liste sayfasının arama motoru verisi JSON'da duruyor: build sonunda gerçek
// HTML dosyalarını üreten scripts/staticPages.mjs aynı dosyayı okuyor
// (bkz. contactPage.ts'teki aynı gerekçe).
//
// DİKKAT: Bu dosya bilerek bağımlılıksız. Buraya store ya da Firestore
// import edilmemeli; adres çözümü oturum kapısının önünde yapılıyor.
import sayfalar from '../content/blogPage.json';

export interface BlogSayfasi {
  slug: string;
  titleKey: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const BLOG_SAYFALARI = sayfalar as BlogSayfasi[];
export const BLOG_SAYFASI = BLOG_SAYFALARI[0];

/** Adresin blog kökü. */
export const BLOG_KOK = `/${BLOG_SAYFASI.slug}`;

export type BlogYolu = { tur: 'liste' } | { tur: 'yazi'; slug: string };

/**
 * Adres yolundan blog sayfasını çözer.
 *   /blog        → liste
 *   /blog/xyz    → xyz yazısı
 * Başka her şey null.
 */
export function blogYoluBul(pathname: string): BlogYolu | null {
  const yol = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (yol === BLOG_SAYFASI.slug) return { tur: 'liste' };
  if (!yol.startsWith(`${BLOG_SAYFASI.slug}/`)) return null;
  const slug = yol.slice(BLOG_SAYFASI.slug.length + 1);
  // İç içe adres yok: /blog/a/b diye bir şey tanımıyoruz.
  return slug && !slug.includes('/') ? { tur: 'yazi', slug } : null;
}

/** Yazının adresi. */
export const yaziAdresi = (slug: string) => `${BLOG_KOK}/${slug}`;

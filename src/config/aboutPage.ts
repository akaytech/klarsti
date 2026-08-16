// Herkese açık "Hakkımızda" sayfasının adres ve arama motoru verisi.
//
// İletişim sayfasıyla aynı mantık (bkz. contactPage.ts): veri JSON'da duruyor
// çünkü hem uygulama hem de build sonunda gerçek HTML dosyalarını üreten
// scripts/staticPages.mjs aynı dosyayı okuyor.
//
// Neden ayrı bir liste, iletişim listesine eklenmedi: o listedeki her sayfa
// ContactPage bileşeniyle çiziliyor. Buraya bir satır eklemek, hakkımızda
// adresini iletişim sayfası olarak açardı.
import sayfalar from '../content/aboutPage.json';

export interface AboutPage {
  /** Adresin tek parçası: klarsti.com/<slug> */
  slug: string;
  /** Sayfa başlığı için i18n anahtarı; başlık kullanıcının dilinde çizilir. */
  titleKey: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const ABOUT_PAGES = sayfalar as AboutPage[];

const SLUG_ILE = new Map(ABOUT_PAGES.map((s) => [s.slug, s]));

/** Adres yolundan hakkımızda sayfasını çözer. Eşleşme yoksa null. */
export function aboutPageBul(pathname: string): AboutPage | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug || slug.includes('/')) return null;
  return SLUG_ILE.get(slug) ?? null;
}

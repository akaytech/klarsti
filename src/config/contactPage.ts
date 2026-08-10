// Herkese açık iletişim sayfasının adres ve arama motoru verisi.
//
// Yasal sayfalarla aynı mantık (bkz. legalPages.ts): veri JSON'da duruyor
// çünkü hem uygulama hem de build sonunda gerçek HTML dosyalarını üreten
// scripts/staticPages.mjs aynı dosyayı okuyor.
//
// Tek sayfa için neden liste: staticPages.mjs bütün sayfa gruplarını dizi
// olarak dolaşıyor. Tek nesne yazsaydık orada özel bir durum açmak
// gerekirdi; ileride ikinci bir destek sayfası (SSS gibi) eklendiğinde de
// buraya bir satır yazmak yetiyor.
import sayfalar from '../content/contactPage.json';

export interface ContactPage {
  /** Adresin tek parçası: klarsti.com/<slug> */
  slug: string;
  /** Sayfa başlığı için i18n anahtarı; başlık kullanıcının dilinde çizilir. */
  titleKey: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const CONTACT_PAGES = sayfalar as ContactPage[];

const SLUG_ILE = new Map(CONTACT_PAGES.map((s) => [s.slug, s]));

/** Adres yolundan iletişim sayfasını çözer. Eşleşme yoksa null. */
export function contactPageBul(pathname: string): ContactPage | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug || slug.includes('/')) return null;
  return SLUG_ILE.get(slug) ?? null;
}

// Herkese açık yasal sayfaların adres ve arama motoru verisi.
//
// Araç sayfalarıyla aynı mantık (bkz. toolPages.ts): veri JSON'da duruyor
// çünkü hem uygulama hem de build sonunda gerçek HTML dosyalarını üreten
// scripts/staticPages.mjs aynı listeyi okuyor.
//
// Bu sayfalar Google'ın giriş ekranı onayı için gerekiyor: gizlilik
// politikası ve kullanım koşullarının kendi adresleri olmadan onaya
// girilemiyordu, metinler yalnızca uygulama içindeki pencerede duruyordu.
import sayfalar from '../content/legalPages.json';
import type { LegalType } from '../content/legalContent';

export interface LegalPage {
  /** Adresin tek parçası: klarsti.com/<slug> */
  slug: string;
  type: LegalType;
  /** Sayfa başlığı için i18n anahtarı; başlık kullanıcının dilinde çizilir. */
  titleKey: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const LEGAL_PAGES = sayfalar as LegalPage[];

const SLUG_ILE = new Map(LEGAL_PAGES.map((s) => [s.slug, s]));

/** Adres yolundan yasal sayfayı çözer. Eşleşme yoksa null. */
export function legalPageBul(pathname: string): LegalPage | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug || slug.includes('/')) return null;
  return SLUG_ILE.get(slug) ?? null;
}

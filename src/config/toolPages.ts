// Herkese açık araç sayfalarının adres ve arama motoru verisi.
//
// Veri neden JSON: aynı listeyi iki taraf okuyor. Uygulama tarafı rotaları
// kurmak için, `scripts/staticPages.mjs` ise build sonunda her adres için
// gerçek bir HTML dosyası üretmek için. TypeScript dosyası olsaydı Node
// tarafı derlemeden okuyamaz, liste iki yerde tutulmak zorunda kalır ve
// kaçınılmaz olarak birbirinden ayrılırdı.
//
// Başlık ve açıklamalar İngilizce: adresler dilsiz olduğu için üretilen
// statik HTML tek dilde olmak zorunda ve o dil İngilizce (i18n fallbackLng
// ile aynı). Kullanıcı sayfayı açtığında içerik kendi dilinde çizilir;
// buradaki metinler yalnızca arama motoru ve link önizlemesi için.
import sayfalar from '../content/toolPages.json';
// DİKKAT: `import type` olarak kalmalı. Yan etkili import olur ve tüm
// store'u (Firestore, zundo, bütün slice'lar) açık sayfalara yükler.
import type { ToolId } from '../store/useRoadmapStore';

export interface ToolPage {
  /** Adresin tek parçası: klarsti.com/<slug> */
  slug: string;
  /** `activeTool` ve kılavuz paketindeki anahtarla birebir aynı. */
  toolId: ToolId;
  /** Aracın İngilizce adı; yapılandırılmış veride (JSON-LD) kullanılıyor. */
  name: string;
  title: string;
  description: string;
  keywords: string;
}

export const TOOL_PAGES = sayfalar as ToolPage[];

/**
 * Araç sayfası adresleriyle çakışmaması gereken yollar. Adresler dilsiz ve
 * tek parça olduğu için bu liste uygulamanın kendi yollarıyla aynı isim
 * havuzunu paylaşıyor; yeni bir slug eklerken buraya bakılmalı.
 */
export const AYRILMIS_YOLLAR = ['login', 'register', 'agenda', 'project', '__'];

const SLUG_ILE = new Map(TOOL_PAGES.map((s) => [s.slug, s]));
const ARAC_ILE = new Map(TOOL_PAGES.map((s) => [s.toolId, s]));

/** Adres yolundan araç sayfasını çözer. Eşleşme yoksa null. */
export function toolPageBul(pathname: string): ToolPage | null {
  // Baştaki ve sondaki eğik çizgi yok sayılır: /wbs ve /wbs/ aynı sayfa.
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug || slug.includes('/')) return null;
  return SLUG_ILE.get(slug) ?? null;
}

/** Aracın açık sayfa adresi. Sayfası olmayan araç için null. */
export function toolPageAdresi(toolId: ToolId): string | null {
  const sayfa = ARAC_ILE.get(toolId);
  return sayfa ? `/${sayfa.slug}` : null;
}

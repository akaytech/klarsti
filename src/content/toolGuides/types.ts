// Araç kılavuzlarının veri şeması. Metinler bileşenin içine gömülmüyor:
// kılavuz içeriği dile göre ayrı dosyada duruyor ve sadece kullanıcı kılavuzu
// açtığında yükleniyor (bkz. index.ts).

export interface GuideShortcut {
  /**
   * Tuş dizisi. `Mod` özel bir simge: macOS'ta ⌘, diğer platformlarda Ctrl
   * olarak çizilir. Geri kalan her şey olduğu gibi gösterilir.
   */
  keys: string[];
  desc: string;
}

/**
 * Aracın gerçek bir işte nasıl kullanıldığını gösteren, doldurulmuş örnek.
 *
 * Neden var: araç sayfaları 270-460 kelimeydi ve arama sonuçlarında 8-10.
 * sayfada kalıyordu. Rakiplerin aynı sayfaları örnek, şablon ve soru-cevapla
 * dolu. Anlatım tek başına yetmiyor; insan da arama motoru da doldurulmuş bir
 * örneği okuyunca sayfanın işe yaradığına ikna oluyor.
 *
 * `blocks` bilerek genel: iş kırılımında faz/iş paketi, SWOT'ta dört kutu,
 * 5 neden'de soru zinciri, Pareto'da kategori listesi aynı biçime oturuyor.
 */
export interface ToolGuideExample {
  /** Örneğin konusu. Somut olmalı: "Yeni bir kahve dükkânı açmak". */
  title: string;
  /** Bir iki cümle bağlam: kim, neyi, neden yapıyor. */
  intro: string;
  blocks: { heading: string; items: string[] }[];
  /** Örnekten çıkan sonuç: bu tabloya bakan kişi ne karar verir. */
  outcome: string;
}

/** Sayfanın sonundaki soru-cevap. Google bunu arama sonucunda da gösterebiliyor. */
export interface ToolGuideFaq {
  q: string;
  a: string;
}

export interface ToolGuide {
  /** Kılavuz başlığı; aracın arayüzdeki adıyla aynı olmak zorunda değil. */
  title: string;
  summary: string;
  whenToUse: string[];
  steps: string[];
  /** Kısayolu olmayan araçlarda boş bırakılır; bölüm hiç çizilmez. */
  shortcuts?: GuideShortcut[];
  tips?: string[];
  /** Henüz yazılmamış dillerde yok; bölüm hiç çizilmez. */
  example?: ToolGuideExample;
  faq?: ToolGuideFaq[];
}

/** Anahtar, `activeTool` değeriyle birebir aynı (wbs, 5whys, mindmap...). */
export type ToolGuideBundle = Record<string, ToolGuide>;

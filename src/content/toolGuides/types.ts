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

export interface ToolGuide {
  /** Kılavuz başlığı; aracın arayüzdeki adıyla aynı olmak zorunda değil. */
  title: string;
  summary: string;
  whenToUse: string[];
  steps: string[];
  /** Kısayolu olmayan araçlarda boş bırakılır; bölüm hiç çizilmez. */
  shortcuts?: GuideShortcut[];
  tips?: string[];
}

/** Anahtar, `activeTool` değeriyle birebir aynı (wbs, 5whys, mindmap...). */
export type ToolGuideBundle = Record<string, ToolGuide>;

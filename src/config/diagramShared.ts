import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

// Akış diyagramları ve organizasyon şemaları aynı motoru kullanıyor: aynı
// kanvas, aynı kutu bileşeni, aynı sağ tık menüsü, aynı şema listesi. Aralarındaki
// tek fark hangi katalogdan beslendikleri. Bu dosya o katalogların ortak
// biçimini tanımlar; flowchartTypes.ts ve orgchartTypes.ts bunu doldurur.

export interface DiagramShapeDef {
  id: string;
  /** Sağ tık menüsündeki "... Ekle" satırı */
  addLabelKey: string;
  /** Yeni eklenen kutunun içine yazılan varsayılan metin */
  newLabelKey: string;
  icon: LucideIcon;
  /** Kutunun dış görünümü */
  boxClass: string;
  /** Dönmüş/eğilmiş kutularda içeriği düzeltmek için */
  innerClass?: string;
  /**
   * İçerik kutusunun yazı boyu ve iç boşluğu. Tailwind sınıfıyla verilince
   * temel sınıftaki p-2/text-sm ile çakışıp sıra kavgasına giriyor, o yüzden
   * bu ayarlar satır içi stil olarak veriliyor.
   */
  innerStyle?: CSSProperties;
  /** Menüdeki satırın rengi */
  menuClass: string;
  /** Mini haritadaki nokta rengi */
  minimapColor: string;
  /** Kutunun içinde ikon da görünsün mü */
  withIcon?: boolean;
  /** Kutuda ikinci bir satır (organizasyon şemasında unvan) */
  withSubtitle?: boolean;
}

export interface DiagramEdgeStyle {
  type: 'smoothstep' | 'step' | 'straight';
  animated: boolean;
  stroke: string;
  /** Kesik çizgi (ikincil / kesikli raporlama hattı) */
  dashed?: boolean;
}

/** Hazır iskeletteki bir kutu. Konumlar kutunun sol üst köşesidir. */
export interface DiagramTemplateNode {
  /** Şablon içinde geçerli geçici kimlik; kaydedilirken gerçek kimliğe çevrilir */
  key: string;
  shape: string;
  labelKey: string;
  subtitleKey?: string;
  x: number;
  y: number;
}

export interface DiagramTemplateEdge {
  source: string;
  target: string;
  /** Kesik çizgili ikincil bağlantı (çift raporlama, dış paydaş) */
  secondary?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface DiagramTemplate {
  nodes: DiagramTemplateNode[];
  edges: DiagramTemplateEdge[];
}

export interface DiagramTypeDef {
  id: string;
  labelKey: string;
  descKey: string;
  icon: LucideIcon;
  /** Seçim kartının rengi */
  cardClass: string;
  iconClass: string;
  /** Şablonu olmayan türlerde şema açılırken atılan tek kutu */
  startShape: string;
  shapes: DiagramShapeDef[];
  edge: DiagramEdgeStyle;
  /**
   * Kesik çizgili ikincil hat. Tanımlıysa kutuların yan tutamaklarından
   * (sol/sağ) çekilen bağlantılar bu stille çizilir: matris şemasında ikinci
   * yönetici, ağ şemasında dış paydaş bağlantısı.
   */
  secondaryEdge?: DiagramEdgeStyle;
  /**
   * Numaralanan kutular ve ön ekleri. Veri akış şemasında süreçler 1, 2, 3...
   * veri depoları D1, D2... diye anılır; numara kutuda saklanmaz, o türden
   * kaçıncı kutu olduğundan hesaplanır (silinince numaralar kaymasın diye
   * değil, tam tersine boşluk kalmasın diye).
   */
  numbered?: Record<string, string>;
  /**
   * Şema açılırken kurulan hazır iskelet. Organizasyon şemasında türler
   * birbirinden kutularıyla değil dizilimiyle ayrıldığı için şablon şart:
   * şablonsuz yedi tür de birbirinin aynısı boş kanvas verirdi.
   */
  template?: DiagramTemplate;
}

/** Kesik çizgili kenarların React Flow'a verilen stil nesnesi */
export function edgeStyle(e: DiagramEdgeStyle) {
  return e.dashed
    ? { strokeWidth: 3, stroke: e.stroke, strokeDasharray: '8 6' }
    : { strokeWidth: 3, stroke: e.stroke };
}

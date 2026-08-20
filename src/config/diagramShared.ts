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
  /** Kutunun yalın adı ("Karar", "İşlem"). "Türü değiştir" listesinde kullanılır. */
  nameKey: string;
  /** Yeni eklenen kutunun içine yazılan varsayılan metin */
  newLabelKey: string;
  icon: LucideIcon;
  /** Kutunun dış görünümü */
  boxClass: string;
  /**
   * Kırpılarak çizilen şekillerin (taşıma oku, depolama üçgeni) dolgusu.
   *
   * NEDEN AYRI: `clip-path` yalnız elemanı değil İÇİNDEKİLERİ de kırpıyor.
   * Kırpma kutunun kendisine verilince bağlantı noktaları şeklin dışında
   * kalan her yerde görünmez oluyordu — okun üstündeki ve altındaki noktalar
   * duruyor ama çizilmiyordu, kullanıcı da "burada nokta yok" diye görüyordu.
   * Kırpma artık arkada duran ayrı bir dolgu katmanında; noktalar, yazı ve
   * seçim halkası kırpılmıyor.
   */
  clipClass?: string;
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
  /**
   * Tutamakların yerini elle düzelten stiller. İki sebeple gerekiyor:
   *
   * 1. Döndürülmüş kutularda (karar baklavası `rotate-45` ile çiziliyor)
   *    tutamaklar da kutuyla dönüyor ve baklavanın köşelerine düşüyorlar;
   *    kutunun köşeleri döndükten sonra baklavanın uçlarına denk geldiği için
   *    tutamaklar oralara taşınıyor.
   * 2. Kırpılan şekillerde (ok, üçgen) kutunun kenar ortası şeklin dışında
   *    kalıyor. Tutamak şeklin gerçek kenarına oturtuluyor: okun gövdesinin
   *    üstü/altı, üçgenin yan kenarlarının ortası.
   */
  handleStyles?: Partial<Record<'top' | 'right' | 'bottom' | 'left', CSSProperties>>;
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
  /** Çizginin üstündeki yazı (karar dallarında "Evet" / "Hayır") */
  labelKey?: string;
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

/**
 * Çizginin ucundaki ok başı.
 *
 * Neden şart oldu: çizgiler artık her tutamaktan her tutamağa gidebiliyor.
 * Yukarı, sola, yana giden bir çizgide yönü yalnız akan noktalardan anlamak
 * mümkün değil — resim olarak dışa aktarıldığında akış hiç görünmüyordu.
 *
 * `'arrowclosed'` dizgesi React Flow'un `MarkerType.ArrowClosed` değeri.
 * Kütüphaneyi buraya bağlamamak için elle yazılıyor: bu dosyayı depo da
 * kullanıyor ve depoyu bütün araçlar indiriyor (bkz. kutuDegisiklikleri.ts).
 */
export function edgeMarker(e: DiagramEdgeStyle) {
  return { type: 'arrowclosed' as const, color: e.stroke };
}

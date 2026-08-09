import type { ToolId } from '../store/useRoadmapStore';

/**
 * Bir aracın içindeki tek bir çalışma: bir kırılım ağacı, bir zihin haritası,
 * bir SWOT analizi...
 *
 * Neden ayrı bir dosya: "Çalışmalarım" menüsü bu listeyi üçüncü kat olarak
 * gösteriyor, ileride paylaşım da çalışma bazına inecek. İki yerin aynı
 * listeyi ayrı ayrı hesaplaması, birinin diğerinden sapmasıyla biterdi.
 */
export interface AracCalismasi {
  id: string;
  /** Kullanıcının verdiği ad. Boşsa çağıran taraf bir yedek metin koyar. */
  ad: string;
}

/** Menüden bir çalışma seçilince açık çalışmayı değiştiren store eylemi. */
export type CalismaSecimEylemi =
  | 'setActiveWbsTree'
  | 'setActiveFiveWhys'
  | 'setActiveFta'
  | 'setActiveMindmap'
  | 'setActiveFlowchart'
  | 'setActiveOrgchart'
  | 'setActiveVsmMap';

interface AracTanimi {
  /** toolData içindeki dizi. */
  anahtar: string;
  /**
   * Çalışmanın adını taşıyan alan. Araçtan araca değişiyor: kırılım ağacının
   * "name"i var, SWOT'un "title"ı, balık kılçığının problem cümlesi, PDCA'nın
   * hedefi. Hepsini "name" yapmak eski kayıtları bozardı.
   */
  adAlani: string;
  /**
   * Bu kadar kutusu olmayan çalışma "kullanılmamış" sayılır ve listede
   * görünmez. Kökten ibaret bir ağaç, araç hiç açılmasa bile oluşuyor;
   * saymasaydık her proje her araçta doluymuş gibi görünürdü.
   */
  enAzKutu?: number;
  /**
   * Seçim eylemi olmayan araçlar bütün çalışmalarını zaten tek sayfada alt
   * alta listeliyor (SWOT, balık kılçığı, PDCA, şelale...). Orada seçilecek
   * bir şey yok, aracı açmak yetiyor.
   */
  secim?: CalismaSecimEylemi;
}

const TANIMLAR: Record<ToolId, AracTanimi | null> = {
  wbs: { anahtar: 'wbsTrees', adAlani: 'name', enAzKutu: 2, secim: 'setActiveWbsTree' },
  '5whys': { anahtar: 'fiveWhysAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFiveWhys' },
  fta: { anahtar: 'ftaAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFta' },
  mindmap: { anahtar: 'mindmaps', adAlani: 'name', enAzKutu: 2, secim: 'setActiveMindmap' },
  flowchart: { anahtar: 'flowcharts', adAlani: 'name', secim: 'setActiveFlowchart' },
  orgchart: { anahtar: 'orgcharts', adAlani: 'name', secim: 'setActiveOrgchart' },
  vsm: { anahtar: 'vsmMaps', adAlani: 'name', secim: 'setActiveVsmMap' },
  swot: { anahtar: 'swot', adAlani: 'title' },
  ishikawa: { anahtar: 'ishikawa', adAlani: 'problemStatement' },
  pdca: { anahtar: 'pdca', adAlani: 'goal' },
  waterfall: { anahtar: 'waterfall', adAlani: 'name' },
  pareto: { anahtar: 'pareto', adAlani: 'title' },
  histogram: { anahtar: 'histogram', adAlani: 'title' },
  decision: { anahtar: 'decision', adAlani: 'name' },
  // Ajanda projeye ait değil, kişisel. Menüde hiç yer almıyor.
  notepad: null
};

export const aracSecimEylemi = (tool: ToolId): CalismaSecimEylemi | undefined =>
  TANIMLAR[tool]?.secim;

/** Bir projedeki bir aracın içinde duran çalışmalar. */
export function aracCalismalari(
  toolData: Record<string, any> | undefined,
  tool: ToolId
): AracCalismasi[] {
  const tanim = TANIMLAR[tool];
  if (!tanim) return [];

  const dizi = toolData?.[tanim.anahtar];
  if (!Array.isArray(dizi)) return [];

  return dizi
    .filter((c) => (tanim.enAzKutu ? (c?.nodes?.length ?? 0) >= tanim.enAzKutu : true))
    .filter((c) => typeof c?.id === 'string')
    .map((c) => ({ id: c.id as string, ad: String(c[tanim.adAlani] ?? '').trim() }));
}

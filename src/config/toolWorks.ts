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
  /** Çalışmanın adını değiştiren store eylemi. */
  yenidenAdlandir: string;
  /** Çalışmayı silen store eylemi. */
  sil: string;
  /**
   * Pareto ve histogramın eylemleri ilk argüman olarak proje kimliğini
   * bekliyor, diğerleri beklemiyor. İmza farkı burada tutuluyor ki çağıran
   * taraf on dört ayrı durumu tek tek bilmek zorunda kalmasın.
   */
  projeliImza?: boolean;
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
  wbs: { anahtar: 'wbsTrees', adAlani: 'name', enAzKutu: 2, secim: 'setActiveWbsTree', yenidenAdlandir: 'renameWbsTree', sil: 'deleteWbsTree' },
  '5whys': { anahtar: 'fiveWhysAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFiveWhys', yenidenAdlandir: 'renameFiveWhysAnalysis', sil: 'deleteFiveWhysAnalysis' },
  fta: { anahtar: 'ftaAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFta', yenidenAdlandir: 'renameFtaAnalysis', sil: 'deleteFtaAnalysis' },
  mindmap: { anahtar: 'mindmaps', adAlani: 'name', enAzKutu: 2, secim: 'setActiveMindmap', yenidenAdlandir: 'renameMindmap', sil: 'deleteMindmap' },
  flowchart: { anahtar: 'flowcharts', adAlani: 'name', secim: 'setActiveFlowchart', yenidenAdlandir: 'renameFlowchart', sil: 'deleteFlowchart' },
  orgchart: { anahtar: 'orgcharts', adAlani: 'name', secim: 'setActiveOrgchart', yenidenAdlandir: 'renameOrgchart', sil: 'deleteOrgchart' },
  vsm: { anahtar: 'vsmMaps', adAlani: 'name', secim: 'setActiveVsmMap', yenidenAdlandir: 'renameVsmMap', sil: 'deleteVsmMap' },
  swot: { anahtar: 'swot', adAlani: 'title', yenidenAdlandir: 'updateSwotTitle', sil: 'deleteSwot' },
  ishikawa: { anahtar: 'ishikawa', adAlani: 'problemStatement', yenidenAdlandir: 'updateIshikawaProblem', sil: 'deleteIshikawa' },
  pdca: { anahtar: 'pdca', adAlani: 'goal', yenidenAdlandir: 'updatePdcaGoal', sil: 'deletePdcaCycle' },
  waterfall: { anahtar: 'waterfall', adAlani: 'name', yenidenAdlandir: 'updateWaterfallProjectName', sil: 'deleteWaterfallProject' },
  pareto: { anahtar: 'pareto', adAlani: 'title', yenidenAdlandir: 'updateParetoTitle', sil: 'deleteParetoProject', projeliImza: true },
  histogram: { anahtar: 'histogram', adAlani: 'title', yenidenAdlandir: 'updateHistogramTitle', sil: 'deleteHistogramProject', projeliImza: true },
  decision: { anahtar: 'decision', adAlani: 'name', yenidenAdlandir: 'updateDecisionProjectName', sil: 'deleteDecisionProject' },
  // Ajanda projeye ait değil, kişisel. Menüde hiç yer almıyor.
  notepad: null
};

export const aracSecimEylemi = (tool: ToolId): CalismaSecimEylemi | undefined =>
  TANIMLAR[tool]?.secim;

/**
 * Çalışma üzerindeki eylemler. Store nesnesi dışarıdan veriliyor: bu dosya
 * bir yapılandırma dosyası, store'u içe aktarsa iki modül birbirini çağıran
 * bir halkaya girerdi.
 *
 * Eylem adları ve imzaları araçtan araca değiştiği için `any` kaçınılmaz;
 * on dört ayrı imzayı tek bir tipte toplamak, kazandırdığından fazlasını
 * okunaklılıktan götürürdü.
 */
export function calismayiYenidenAdlandir(
  store: Record<string, any>, tool: ToolId, projectId: string, calismaId: string, yeniAd: string
) {
  const tanim = TANIMLAR[tool];
  if (!tanim) return;
  const eylem = store[tanim.yenidenAdlandir];
  if (typeof eylem !== 'function') return;
  if (tanim.projeliImza) eylem(projectId, calismaId, yeniAd);
  else eylem(calismaId, yeniAd);
}

export function calismayiSil(
  store: Record<string, any>, tool: ToolId, projectId: string, calismaId: string
) {
  const tanim = TANIMLAR[tool];
  if (!tanim) return;
  const eylem = store[tanim.sil];
  if (typeof eylem !== 'function') return;
  if (tanim.projeliImza) eylem(projectId, calismaId);
  else eylem(calismaId);
}

/** Menüde gösterilecek çalışmalar: kullanılmamış olanlar elenir. */
export function aracCalismalari(
  toolData: Record<string, any> | undefined,
  tool: ToolId
): AracCalismasi[] {
  const tanim = TANIMLAR[tool];
  if (!tanim) return [];
  return hamCalismalar(toolData, tool)
    .filter((c) => (tanim.enAzKutu ? (c?.nodes?.length ?? 0) >= tanim.enAzKutu : true))
    .map((c) => ({ id: c.id as string, ad: calismaAdi(c, tool) }));
}

/**
 * Diziden geçen HER çalışma, kutu sayısına bakılmadan.
 *
 * Menü kullanılmamış çalışmaları gizliyor ama saklama öyle davranamaz:
 * gizlenen bir çalışma da kullanıcının verisi, kaydedilmezse kaybolur.
 */
export function hamCalismalar(
  toolData: Record<string, any> | undefined,
  tool: ToolId
): Record<string, any>[] {
  const tanim = TANIMLAR[tool];
  if (!tanim) return [];
  const dizi = toolData?.[tanim.anahtar];
  if (!Array.isArray(dizi)) return [];
  return dizi.filter((c) => c && typeof c.id === 'string');
}

/** Çalışmanın kullanıcıya görünen adı; alan adı araçtan araca değişiyor. */
export function calismaAdi(calisma: Record<string, any>, tool: ToolId): string {
  const tanim = TANIMLAR[tool];
  if (!tanim) return '';
  return String(calisma[tanim.adAlani] ?? '').trim();
}

/** toolData içinde bu aracın dizisini tutan anahtar. */
export const aracAnahtari = (tool: ToolId): string | undefined => TANIMLAR[tool]?.anahtar;

/** Menüde yer alan sırayla bütün araçlar (ajanda hariç). */
export const TUM_ARACLAR = (Object.keys(TANIMLAR) as ToolId[]).filter((t) => TANIMLAR[t] !== null);

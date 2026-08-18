import i18n from '../i18n';
import { isPristineWbs } from '../store/slices/createWbsSlice';
import { isPristineFta } from '../store/slices/createFtaSlice';
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
  | 'setActiveVsmMap'
  | 'setActiveGantt'
  | 'setActiveRoadmap';

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
  /**
   * Açık çalışmanın kimliğini tutan store alanı. Adres çubuğu bunu okuyup
   * yazıyor; olmasaydı sayfa yenilenince açık çalışma unutulur ve listenin
   * ilkine dönülürdü. Yalnızca `secim` olan araçlarda var.
   */
  aktifAlan?: string;
}

const TANIMLAR: Record<ToolId, AracTanimi | null> = {
  wbs: { anahtar: 'wbsTrees', adAlani: 'name', enAzKutu: 2, secim: 'setActiveWbsTree', aktifAlan: 'activeWbsTreeId', yenidenAdlandir: 'renameWbsTree', sil: 'deleteWbsTree' },
  '5whys': { anahtar: 'fiveWhysAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFiveWhys', aktifAlan: 'activeFiveWhysId', yenidenAdlandir: 'renameFiveWhysAnalysis', sil: 'deleteFiveWhysAnalysis' },
  fta: { anahtar: 'ftaAnalyses', adAlani: 'name', enAzKutu: 2, secim: 'setActiveFta', aktifAlan: 'activeFtaId', yenidenAdlandir: 'renameFtaAnalysis', sil: 'deleteFtaAnalysis' },
  mindmap: { anahtar: 'mindmaps', adAlani: 'name', enAzKutu: 2, secim: 'setActiveMindmap', aktifAlan: 'activeMindmapId', yenidenAdlandir: 'renameMindmap', sil: 'deleteMindmap' },
  flowchart: { anahtar: 'flowcharts', adAlani: 'name', secim: 'setActiveFlowchart', aktifAlan: 'activeFlowchartId', yenidenAdlandir: 'renameFlowchart', sil: 'deleteFlowchart' },
  orgchart: { anahtar: 'orgcharts', adAlani: 'name', secim: 'setActiveOrgchart', aktifAlan: 'activeOrgchartId', yenidenAdlandir: 'renameOrgchart', sil: 'deleteOrgchart' },
  gantt: { anahtar: 'ganttPlans', adAlani: 'name', secim: 'setActiveGantt', aktifAlan: 'activeGanttId', yenidenAdlandir: 'renameGanttPlan', sil: 'deleteGanttPlan' },
  vsm: { anahtar: 'vsmMaps', adAlani: 'name', secim: 'setActiveVsmMap', aktifAlan: 'activeVsmMapId', yenidenAdlandir: 'renameVsmMap', sil: 'deleteVsmMap' },
  roadmap: { anahtar: 'roadmaps', adAlani: 'name', enAzKutu: 2, secim: 'setActiveRoadmap', aktifAlan: 'activeRoadmapId', yenidenAdlandir: 'renameRoadmap', sil: 'deleteRoadmap' },
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

/** Açık çalışmanın kimliğini tutan store alanının adı. */
export const aracAktifAlan = (tool: ToolId): string | undefined =>
  TANIMLAR[tool]?.aktifAlan;

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

/**
 * Menüde gösterilecek çalışmalar: kullanılmamış olanlar elenir.
 *
 * İki ölçüt birlikte: kutu sayısı ve "varsayılanına hiç dokunulmamış mı".
 * Tek başına kutu sayısı yetmiyordu, çünkü değer akışının kutu ölçütü yok:
 * proje açılır açılmaz kurulan boş "Mevcut Durum" haritası gerçek bir çalışma
 * gibi görünüyor, hesapsız denemeye ilk giren ziyaretçi bile karşılama
 * ekranında "Kaldığın Yer" başlığı altında onu buluyordu.
 */
export function aracCalismalari(
  toolData: Record<string, any> | undefined,
  tool: ToolId
): AracCalismasi[] {
  const tanim = TANIMLAR[tool];
  if (!tanim) return [];
  return hamCalismalar(toolData, tool)
    .filter((c) => (tanim.enAzKutu ? (c?.nodes?.length ?? 0) >= tanim.enAzKutu : true))
    .filter((c) => !calismaDokunulmamis(c, tool))
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

/**
 * Bu çalışma hiç başlanmamış mı?
 *
 * Uygulama bir proje açıldığında beş araç için (kırılım ağacı, 5 neden, zihin
 * haritası, hata ağacı, değer akışı) kendiliğinden boş bir başlangıç çalışması
 * kuruyor ve kaydediyor. Kullanıcı o araca hiç dokunmasa bile. Menü bunları
 * zaten gizliyor; ayrı kayıt olarak da saklanmamalılar, yoksa her proje
 * kimsenin açmadığı beş kayıt üretir.
 *
 * Ölçüt bilerek dar: "az kutusu var" değil, "varsayılanına hiç dokunulmamış".
 * Tek kutulu ama kullanıcının adını yazdığı bir zihin haritası gerçek bir
 * çalışmadır, elenmemeli.
 */
export function calismaDokunulmamis(calisma: Record<string, any>, tool: ToolId): boolean {
  const nodes = Array.isArray(calisma?.nodes) ? calisma.nodes : [];
  const edges = Array.isArray(calisma?.edges) ? calisma.edges : [];

  if (tool === 'wbs') return isPristineWbs(nodes as any, edges as any);
  if (tool === 'fta') return isPristineFta(nodes as any, edges as any);

  if (tool === '5whys') {
    if (nodes.length === 0) return true;
    if (nodes.length > 1 || edges.length > 0) return false;
    const d = nodes[0]?.data ?? {};
    return d.label === i18n.t('whys_problem') && !d.description;
  }

  // Yol haritası tek bir durakla açılıyor (bkz. getInitialValue); adı hâlâ
  // varsayılansa kullanıcı o haritaya hiç dokunmamış demektir.
  if (tool === 'roadmap') {
    if (nodes.length === 0) return true;
    if (nodes.length > 1 || edges.length > 0) return false;
    const d = nodes[0]?.data ?? {};
    return d.label === i18n.t('roadmap_first_step') && !d.description;
  }

  if (tool === 'mindmap') {
    if (nodes.length === 0) return true;
    if (nodes.length > 1 || edges.length > 0) return false;
    const d = nodes[0]?.data ?? {};
    return d.label === i18n.t('mindmap_root') && !d.description;
  }

  // Değer akışının varsayılanı gerçekten boş açılıyor; kutuları kanvastaki
  // başlangıç ekranı kuruyor. Eski sürümden dönüşen haritalarda tek bir
  // tedarikçi kutusu kalmış olabiliyor, o da başlanmış sayılmaz.
  if (tool === 'vsm') return edges.length === 0 && nodes.length <= 1;

  // Kalan araçlarda başlangıç çalışması kurulmuyor; ne varsa kullanıcı
  // bilerek oluşturmuştur, boş olsa bile korunur.
  return false;
}

/**
 * Bu çalışma kendi kaydını hak ediyor mu?
 *
 * Dokunulmamış başlangıç çalışması kayıt almıyor (yukarıdaki gerekçe). AMA
 * yalnızca araçtaki TEK çalışma oysa. Kullanıcı ikinci bir çalışma açtıysa,
 * ona hiç dokunmamış olsa bile o artık onun kararı; elenirse sayfa
 * yenilenince sessizce kaybolurdu.
 *
 * Hem yazma hem sıra listesi bu tek kapıdan geçiyor. Ayrışırlarsa listede
 * olup kaydı olmayan (ya da tersi) çalışmalar çıkar.
 */
export function calismaKayitHakEdiyor(
  calisma: Record<string, any>,
  tool: ToolId,
  aractakiToplam: number
): boolean {
  if (aractakiToplam > 1) return true;
  return !calismaDokunulmamis(calisma, tool);
}

/** toolData içinde bu aracın dizisini tutan anahtar. */
export const aracAnahtari = (tool: ToolId): string | undefined => TANIMLAR[tool]?.anahtar;

/** Menüde yer alan sırayla bütün araçlar (ajanda hariç). */
export const TUM_ARACLAR = (Object.keys(TANIMLAR) as ToolId[]).filter((t) => TANIMLAR[t] !== null);

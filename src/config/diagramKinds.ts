import type { DiagramShapeDef, DiagramTypeDef } from './diagramShared';
import { FLOWCHART_TYPES, FLOWCHART_SHAPE_FALLBACKS, getFlowchartShape, getFlowchartType } from './flowchartTypes';
import { ORGCHART_TYPES, ORGCHART_SHAPE_FALLBACKS, getOrgchartShape, getOrgchartType } from './orgchartTypes';

// Aynı motoru kullanan iki araç var: akış diyagramları ve organizasyon
// şemaları. Kanvas, kutu, sağ tık menüsü ve şema listesi bu kayıttan hangi
// katalogla çalışacağını öğreniyor; üçüncü bir şema ailesi eklemek buraya bir
// satır eklemek demek.

export type DiagramKind = 'flowchart' | 'orgchart';

interface DiagramKindDef {
  kind: DiagramKind;
  /** React Flow'daki düğüm tipi; kutuların data.type alanına yazılır */
  nodeType: string;
  types: DiagramTypeDef[];
  getType: (id: string | null | undefined) => DiagramTypeDef;
  getShape: (id: string) => DiagramShapeDef;
  /** Tür değişiminde kutuların en yakın karşılığı */
  fallbacks: Record<string, string[]>;
  /**
   * Arayüz metinlerinin çeviri anahtarları. Şema adı, silme onayı gibi
   * metinler iki araçta da aynı; sadece tür seçim ekranının başlığı ve
   * kesik çizgi ipucu araca özel.
   */
  text: {
    typeTitle: string;
    typeSubtitle: string;
    charts: string;
    newChart: string;
    renameChart: string;
    chartName: string;
    deleteChart: string;
    deleteChartMsg: string;
    /** Menüdeki "Tür" başlığı. Tür yalnızca gösteriliyor, değiştirilemiyor. */
    chartType: string;
    /** Türün neden değiştirilemediğini anlatan satır. */
    typeLockedHint: string;
    edit: string;
    save: string;
    /** Menüdeki "Kutu ekle" başlığı */
    addBox: string;
    /** Menüdeki "Kutunun türü" başlığı: seçilen kutuyu başka bir kutuya çevirir */
    changeShape: string;
    deleteNode: string;
    inputPlaceholder: string;
    subtitlePlaceholder: string;
    /** Kesik çizgili ikincil bağlantıyı anlatan ipucu (yalnızca o türlerde) */
    secondaryHint?: string;
  };
}

// İki araçta da aynı olan arayüz metinleri. Anahtarlar tarihsel olarak
// flowchart_ ön ekiyle duruyor; içerikleri şema türünden bağımsız.
const ORTAK_METIN = {
  charts: 'flowchart_charts',
  newChart: 'flowchart_new_chart',
  renameChart: 'flowchart_rename_chart',
  chartName: 'flowchart_chart_name',
  deleteChart: 'flowchart_delete_chart',
  deleteChartMsg: 'flowchart_delete_chart_msg',
  chartType: 'flowchart_change_type',
  typeLockedHint: 'flowchart_change_type_hint',
  edit: 'edit',
  save: 'save',
  addBox: 'diagram_add_box',
  changeShape: 'diagram_change_shape',
  deleteNode: 'delete',
  inputPlaceholder: 'flowchart_input_placeholder',
  subtitlePlaceholder: 'flowchart_subtitle_placeholder'
};

export const DIAGRAM_KINDS: Record<DiagramKind, DiagramKindDef> = {
  flowchart: {
    kind: 'flowchart',
    nodeType: 'flowchartNode',
    types: FLOWCHART_TYPES,
    getType: getFlowchartType,
    getShape: getFlowchartShape,
    fallbacks: FLOWCHART_SHAPE_FALLBACKS,
    text: {
      ...ORTAK_METIN,
      typeTitle: 'flowchart_type_title',
      typeSubtitle: 'flowchart_type_subtitle'
    }
  },
  orgchart: {
    kind: 'orgchart',
    nodeType: 'orgchartNode',
    types: ORGCHART_TYPES,
    getType: getOrgchartType,
    getShape: getOrgchartShape,
    fallbacks: ORGCHART_SHAPE_FALLBACKS,
    text: {
      ...ORTAK_METIN,
      typeTitle: 'org_type_title',
      typeSubtitle: 'org_type_subtitle',
      typeLockedHint: 'org_change_type_hint',
      secondaryHint: 'org_secondary_hint'
    }
  }
};

export const getDiagramKind = (kind: DiagramKind) => DIAGRAM_KINDS[kind];

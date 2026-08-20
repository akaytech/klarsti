import {
  PlayCircle, StopCircle, Box, GitMerge, Building, Database, FileText, ShieldCheck,
  User, Layers, Circle, Square, ArrowRight, Clock, Triangle,
  FileInput, Workflow, Share2
} from 'lucide-react';
import type { DiagramShapeDef, DiagramTypeDef } from './diagramShared';

// Akış diyagramları aracı tek bir şema tipi değil, üç ayrı şema türü sunuyor.
// Her türün kendi kutu takımı var; kutuların görünümü, menüdeki sırası ve
// rengi burada duruyor. Kanvas, düğüm ve sağ tık menüsü bu katalogdan okur;
// yeni bir kutu ya da yeni bir tür eklemek bu dosyaya satır eklemek demek.
//
// Organizasyon şeması eskiden buradaki dördüncü türdü. Kutuları hiçbir akış
// türüyle ortak değildi ve amacı akış değil hiyerarşiydi; ayrı bir araca
// taşındı (bkz. config/orgchartTypes.ts).

export type FlowchartTypeId = 'workflow' | 'process' | 'dfd';

export type FlowchartShapeId =
  // ortak
  | 'start' | 'end' | 'process' | 'decision'
  // iş akış şeması
  | 'subprocess' | 'approval' | 'document' | 'role'
  // süreç akış şeması (ASME sembolleri)
  | 'operation' | 'inspection' | 'transport' | 'delay' | 'storage' | 'inputOutput'
  // veri akış şeması
  | 'externalEntity' | 'dataStore';

export interface FlowchartShapeDef extends DiagramShapeDef {
  id: FlowchartShapeId;
}

const SHAPES: Record<FlowchartShapeId, FlowchartShapeDef> = {
  start: {
    id: 'start',
    addLabelKey: 'flowchart_add_start',
    nameKey: 'flowchart_shape_start',
    newLabelKey: 'flowchart_new_start',
    icon: PlayCircle,
    boxClass: 'rounded-full border-2 bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-400 dark:text-emerald-300 min-w-[110px] px-4 shadow-sm',
    menuClass: 'text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    minimapColor: '#10b981'
  },
  end: {
    id: 'end',
    addLabelKey: 'flowchart_add_end',
    nameKey: 'flowchart_shape_end',
    newLabelKey: 'flowchart_new_end',
    icon: StopCircle,
    boxClass: 'rounded-full border-2 bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-500/10 dark:border-rose-400 dark:text-rose-300 min-w-[110px] px-4 shadow-sm',
    menuClass: 'text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20',
    minimapColor: '#f43f5e'
  },
  process: {
    id: 'process',
    addLabelKey: 'flowchart_add_process',
    nameKey: 'flowchart_shape_process',
    newLabelKey: 'flowchart_new_process',
    icon: Box,
    boxClass: 'rounded-xl border-2 bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300 min-w-[130px] px-3 shadow-sm',
    menuClass: 'text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    minimapColor: '#3b82f6'
  },
  decision: {
    id: 'decision',
    addLabelKey: 'flowchart_add_decision',
    nameKey: 'flowchart_shape_decision',
    newLabelKey: 'flowchart_new_decision',
    icon: GitMerge,
    boxClass: 'rotate-45 transform w-28 h-28 border-2 bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-500/10 dark:border-amber-400 dark:text-amber-300 shadow-sm',
    innerClass: '-rotate-45 transform',
    // Sabit ölçülü kutularda metin taşmasın diye küçültülüp sıkıştırılıyor.
    innerStyle: { fontSize: 12, lineHeight: 1.15, padding: '4px 6px' },
    // Kutu 45° döndüğü için köşeleri baklavanın uçlarına denk geliyor:
    // sol üst köşe -> üst uç, sağ üst -> sağ uç, sağ alt -> alt, sol alt -> sol.
    handleStyles: {
      top: { left: 0, top: 0 },
      right: { left: '100%', top: 0 },
      bottom: { left: '100%', top: '100%' },
      left: { left: 0, top: '100%' }
    },
    menuClass: 'text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20',
    minimapColor: '#f59e0b'
  },

  // --- iş akış şeması ---
  subprocess: {
    id: 'subprocess',
    addLabelKey: 'flowchart_add_subprocess',
    nameKey: 'flowchart_shape_subprocess',
    newLabelKey: 'flowchart_new_subprocess',
    icon: Layers,
    boxClass: 'rounded-xl border-4 border-double bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-400 dark:text-indigo-300 min-w-[140px] px-3 shadow-sm',
    menuClass: 'text-indigo-600 dark:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    minimapColor: '#6366f1'
  },
  approval: {
    id: 'approval',
    addLabelKey: 'flowchart_add_approval',
    nameKey: 'flowchart_shape_approval',
    newLabelKey: 'flowchart_new_approval',
    icon: ShieldCheck,
    boxClass: 'rounded-xl border-2 bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-500/10 dark:border-yellow-400 dark:text-yellow-200 min-w-[130px] px-3 shadow-sm',
    menuClass: 'text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
    minimapColor: '#eab308',
    withIcon: true
  },
  document: {
    id: 'document',
    addLabelKey: 'flowchart_add_document',
    nameKey: 'flowchart_shape_document',
    newLabelKey: 'flowchart_new_document',
    icon: FileText,
    // Belge sembolünün alt kenarı dalgalıdır; eliptik köşe yarıçapı bunu yaklaşık verir.
    boxClass: 'rounded-t-xl rounded-b-[45%_22px] border-2 bg-violet-50 border-violet-500 text-violet-700 dark:bg-violet-500/10 dark:border-violet-400 dark:text-violet-300 min-w-[130px] px-3 pb-3 shadow-sm',
    menuClass: 'text-violet-600 dark:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20',
    minimapColor: '#8b5cf6',
    withIcon: true
  },
  role: {
    id: 'role',
    addLabelKey: 'flowchart_add_role',
    nameKey: 'flowchart_shape_role',
    newLabelKey: 'flowchart_new_role',
    icon: User,
    boxClass: 'rounded-2xl border-2 border-dashed bg-slate-100 border-slate-400 text-slate-700 dark:bg-slate-800 dark:border-slate-500 dark:text-slate-200 min-w-[120px] px-3 shadow-sm',
    menuClass: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
    minimapColor: '#94a3b8',
    withIcon: true
  },

  // --- süreç akış şeması ---
  operation: {
    id: 'operation',
    addLabelKey: 'flowchart_add_operation',
    nameKey: 'flowchart_shape_operation',
    newLabelKey: 'flowchart_new_operation',
    icon: Circle,
    boxClass: 'rounded-full border-2 w-28 h-28 bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-300 shadow-sm',
    innerStyle: { fontSize: 12, lineHeight: 1.15, padding: '4px 14px' },
    menuClass: 'text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    minimapColor: '#3b82f6'
  },
  inspection: {
    id: 'inspection',
    addLabelKey: 'flowchart_add_inspection',
    nameKey: 'flowchart_shape_inspection',
    newLabelKey: 'flowchart_new_inspection',
    icon: Square,
    boxClass: 'border-2 w-28 h-28 bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-500/10 dark:border-amber-400 dark:text-amber-300 shadow-sm',
    innerStyle: { fontSize: 12, lineHeight: 1.15, padding: '4px 10px' },
    menuClass: 'text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20',
    minimapColor: '#f59e0b'
  },
  transport: {
    id: 'transport',
    addLabelKey: 'flowchart_add_transport',
    nameKey: 'flowchart_shape_transport',
    newLabelKey: 'flowchart_new_transport',
    icon: ArrowRight,
    // Ok biçimi kırpma ile veriliyor, kırpılan kenarda çerçeve görünmez.
    boxClass: 'w-40 h-16 bg-sky-200 text-sky-900 dark:bg-sky-500/30 dark:text-sky-100 [clip-path:polygon(0_25%,70%_25%,70%_0,100%_50%,70%_100%,70%_75%,0_75%)]',
    // Sağdaki ok ucuna yazı girmemeli.
    innerStyle: { fontSize: 12, lineHeight: 1.1, padding: '4px 48px 4px 8px' },
    menuClass: 'text-sky-600 dark:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20',
    minimapColor: '#0ea5e9'
  },
  delay: {
    id: 'delay',
    addLabelKey: 'flowchart_add_delay',
    nameKey: 'flowchart_shape_delay',
    newLabelKey: 'flowchart_new_delay',
    icon: Clock,
    boxClass: 'rounded-e-full border-2 bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-500/10 dark:border-orange-400 dark:text-orange-300 min-w-[130px] px-4 shadow-sm',
    menuClass: 'text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    minimapColor: '#f97316'
  },
  storage: {
    id: 'storage',
    addLabelKey: 'flowchart_add_storage',
    nameKey: 'flowchart_shape_storage',
    newLabelKey: 'flowchart_new_storage',
    icon: Triangle,
    // Üçgenin tepesi dar; metin aşağı itilmezse kenarlardan taşıyor.
    boxClass: 'w-40 h-32 bg-teal-200 text-teal-900 dark:bg-teal-500/30 dark:text-teal-100 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
    innerStyle: { fontSize: 11, lineHeight: 1.1, padding: '68px 24px 8px' },
    menuClass: 'text-teal-600 dark:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20',
    minimapColor: '#14b8a6'
  },
  inputOutput: {
    id: 'inputOutput',
    addLabelKey: 'flowchart_add_input_output',
    nameKey: 'flowchart_shape_input_output',
    newLabelKey: 'flowchart_new_input_output',
    icon: FileInput,
    boxClass: '-skew-x-12 transform border-2 bg-violet-50 border-violet-500 text-violet-700 dark:bg-violet-500/10 dark:border-violet-400 dark:text-violet-300 min-w-[140px] px-4 shadow-sm',
    innerClass: 'skew-x-12 transform',
    menuClass: 'text-violet-600 dark:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20',
    minimapColor: '#8b5cf6'
  },

  // --- veri akış şeması ---
  externalEntity: {
    id: 'externalEntity',
    addLabelKey: 'flowchart_add_external',
    nameKey: 'flowchart_shape_external',
    newLabelKey: 'flowchart_new_external',
    icon: Building,
    boxClass: 'rounded-sm border-2 bg-slate-100 border-slate-600 text-slate-800 dark:bg-slate-800 dark:border-slate-400 dark:text-slate-200 min-w-[130px] px-3 shadow-md',
    menuClass: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
    minimapColor: '#64748b',
    withIcon: true
  },
  dataStore: {
    id: 'dataStore',
    addLabelKey: 'flowchart_add_datastore',
    nameKey: 'flowchart_shape_datastore',
    newLabelKey: 'flowchart_new_datastore',
    icon: Database,
    boxClass: 'border-y-[3px] border-x-0 bg-sky-50 border-sky-600 text-sky-800 dark:bg-sky-900/20 dark:border-sky-500 dark:text-sky-200 min-w-[150px] px-4 shadow-sm',
    menuClass: 'text-sky-600 dark:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20',
    minimapColor: '#0284c7',
    withIcon: true
  }
};

export interface FlowchartTypeDef extends DiagramTypeDef {
  id: FlowchartTypeId;
  startShape: FlowchartShapeId;
  shapes: FlowchartShapeDef[];
  numbered?: Partial<Record<FlowchartShapeId, string>>;
}

const s = (...ids: FlowchartShapeId[]) => ids.map((id) => SHAPES[id]);

export const FLOWCHART_TYPES: FlowchartTypeDef[] = [
  {
    id: 'workflow',
    labelKey: 'flowchart_type_workflow',
    descKey: 'flowchart_type_workflow_desc',
    icon: Workflow,
    cardClass: 'hover:border-blue-400 dark:hover:border-blue-500',
    iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    startShape: 'start',
    shapes: s('process', 'decision', 'subprocess', 'approval', 'document', 'role', 'start', 'end'),
    edge: { type: 'smoothstep', animated: true, stroke: '#94a3b8' }
  },
  {
    id: 'process',
    labelKey: 'flowchart_type_process',
    descKey: 'flowchart_type_process_desc',
    icon: Share2,
    cardClass: 'hover:border-amber-400 dark:hover:border-amber-500',
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    startShape: 'start',
    shapes: s('operation', 'inspection', 'transport', 'delay', 'storage', 'inputOutput', 'decision', 'start', 'end'),
    edge: { type: 'smoothstep', animated: true, stroke: '#94a3b8' }
  },
  {
    id: 'dfd',
    labelKey: 'flowchart_type_dfd',
    descKey: 'flowchart_type_dfd_desc',
    icon: Database,
    cardClass: 'hover:border-sky-400 dark:hover:border-sky-500',
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
    startShape: 'externalEntity',
    shapes: s('process', 'dataStore', 'externalEntity'),
    edge: { type: 'smoothstep', animated: true, stroke: '#0ea5e9' },
    numbered: { process: '', dataStore: 'D' }
  }
];

export function getFlowchartType(id: FlowchartTypeId | string | null | undefined): FlowchartTypeDef {
  return FLOWCHART_TYPES.find((tur) => tur.id === id) || FLOWCHART_TYPES[0];
}

export function getFlowchartShape(id: FlowchartShapeId | string): FlowchartShapeDef {
  return SHAPES[id as FlowchartShapeId] || SHAPES.process;
}

// Tür değiştirilirken kutular en yakın karşılığına eşlenir. Karşılığı
// olmayanlar yeni türün ilk (en genel) biçimine düşer, hiçbir kutu kaybolmaz.
export const FLOWCHART_SHAPE_FALLBACKS: Record<string, string[]> = {
  process: ['operation', 'process'],
  operation: ['process', 'operation'],
  decision: ['decision', 'inspection'],
  inspection: ['decision', 'inspection'],
  subprocess: ['process', 'operation'],
  approval: ['inspection', 'decision', 'process'],
  document: ['inputOutput', 'dataStore', 'process'],
  inputOutput: ['document', 'dataStore', 'process'],
  role: ['externalEntity', 'process'],
  externalEntity: ['role', 'process'],
  dataStore: ['document', 'inputOutput', 'process'],
  storage: ['dataStore', 'document', 'process'],
  transport: ['process', 'operation'],
  delay: ['approval', 'process', 'operation'],
  start: ['start'],
  end: ['end']
};

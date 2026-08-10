import {
  User, Users, UsersRound, UserCog, Building2, Boxes, CircleDashed,
  Handshake, Network, Grid3x3, Rows3, Waypoints
} from 'lucide-react';
import type { DiagramShapeDef, DiagramTemplate, DiagramTypeDef } from './diagramShared';

// Organizasyon şemaları aracının kataloğu.
//
// Akış diyagramlarından önemli bir farkı var: orada türler birbirinden KUTU
// TAKIMIYLA ayrılır (ASME sembolleri, DFD sembolleri). Burada ise yedi türün
// kutuları büyük ölçüde aynı; fark kutuların NASIL DİZİLDİĞİNDE. Bu yüzden
// her türün bir hazır iskeleti (template) var: şablon olmasa yedi kart da
// birbirinin aynısı boş kanvas verirdi.
//
// İkinci fark: matris ve ağ şemalarında tek üst yoktur. Bu türlerde kutuların
// yan tutamaklarından çekilen bağlantılar kesik çizgiyle çizilir (ikincil
// raporlama / dış paydaş hattı), dikey tutamaklardan çekilenler düz kalır.

export type OrgchartTypeId =
  | 'hierarchical' | 'functional' | 'divisional' | 'matrix' | 'flat' | 'team' | 'network';

export type OrgchartShapeId =
  | 'position' | 'department' | 'division' | 'team' | 'staff' | 'vacant' | 'partner';

export interface OrgchartShapeDef extends DiagramShapeDef {
  id: OrgchartShapeId;
}

const SHAPES: Record<OrgchartShapeId, OrgchartShapeDef> = {
  position: {
    id: 'position',
    addLabelKey: 'org_add_position',
    newLabelKey: 'org_new_position',
    icon: User,
    boxClass: 'rounded-xl border-2 bg-white border-indigo-400 text-slate-800 dark:bg-slate-800 dark:border-indigo-500 dark:text-slate-100 min-w-[160px] px-4 shadow-md',
    menuClass: 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    minimapColor: '#6366f1',
    withSubtitle: true
  },
  department: {
    id: 'department',
    addLabelKey: 'org_add_department',
    newLabelKey: 'org_new_department',
    icon: Building2,
    boxClass: 'rounded-xl border-2 bg-indigo-50 border-indigo-500 text-indigo-800 dark:bg-indigo-500/10 dark:border-indigo-400 dark:text-indigo-200 min-w-[160px] px-4 shadow-sm font-black uppercase tracking-wide',
    menuClass: 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    minimapColor: '#4f46e5',
    withIcon: true
  },
  // Divizyon, departmandan bir üst kırılım: ürün, bölge ya da pazar. Kendi
  // içinde departmanları tekrar eder, o yüzden görsel olarak daha ağır.
  division: {
    id: 'division',
    addLabelKey: 'org_add_division',
    newLabelKey: 'org_new_division',
    icon: Boxes,
    boxClass: 'rounded-2xl border-[3px] bg-violet-50 border-violet-500 text-violet-800 dark:bg-violet-500/10 dark:border-violet-400 dark:text-violet-200 min-w-[180px] px-5 shadow-md font-black uppercase tracking-wide',
    menuClass: 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20',
    minimapColor: '#7c3aed',
    withIcon: true
  },
  team: {
    id: 'team',
    addLabelKey: 'org_add_team',
    newLabelKey: 'org_new_team',
    icon: Users,
    boxClass: 'rounded-2xl border-2 bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-400 dark:text-emerald-200 min-w-[150px] px-4 shadow-sm',
    menuClass: 'text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    minimapColor: '#10b981',
    withIcon: true
  },
  // Kurmay: yönetime bağlı ama emir-komuta zincirinin dışında (danışman,
  // asistan, hukuk). Şemada kesik çerçeveyle ve kesik çizgiyle gösterilir.
  staff: {
    id: 'staff',
    addLabelKey: 'org_add_staff',
    newLabelKey: 'org_new_staff',
    icon: UserCog,
    boxClass: 'rounded-xl border-2 border-dashed bg-white border-slate-400 text-slate-700 dark:bg-slate-800 dark:border-slate-500 dark:text-slate-200 min-w-[150px] px-4 shadow-sm',
    menuClass: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
    minimapColor: '#94a3b8',
    withSubtitle: true
  },
  vacant: {
    id: 'vacant',
    addLabelKey: 'org_add_vacant',
    newLabelKey: 'org_new_vacant',
    icon: CircleDashed,
    boxClass: 'rounded-xl border-2 border-dashed bg-slate-50 border-slate-300 text-slate-400 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-500 min-w-[150px] px-4',
    menuClass: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
    minimapColor: '#cbd5e1',
    withSubtitle: true
  },
  // Dış paydaş: şirketin kadrosunda değil ama iş yapısının parçası
  // (tedarikçi, ajans, serbest çalışan). Ağ şemasının ana kutusu.
  partner: {
    id: 'partner',
    addLabelKey: 'org_add_partner',
    newLabelKey: 'org_new_partner',
    icon: Handshake,
    boxClass: 'rounded-full border-2 border-dashed bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-500/10 dark:border-teal-400 dark:text-teal-200 min-w-[160px] px-5 shadow-sm',
    menuClass: 'text-teal-600 dark:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20',
    minimapColor: '#14b8a6',
    withIcon: true,
    withSubtitle: true
  }
};

export interface OrgchartTypeDef extends DiagramTypeDef {
  id: OrgchartTypeId;
  startShape: OrgchartShapeId;
  shapes: OrgchartShapeDef[];
}

const s = (...ids: OrgchartShapeId[]) => ids.map((id) => SHAPES[id]);

/** Şablon yazımını kısaltan yardımcılar. */
const n = (key: string, shape: OrgchartShapeId, labelKey: string, x: number, y: number) =>
  ({ key, shape, labelKey, x, y });
const e = (source: string, target: string) => ({ source, target });
/** Kesik çizgili yan bağlantı: kaynağın sağından çıkar, hedefin soluna girer. */
const ey = (source: string, target: string) =>
  ({ source, target, secondary: true, sourceHandle: 'right', targetHandle: 'left' });

// Kutular yaklaşık 170x60 piksel; şablonlarda 220 yatay, 150 dikey aralık
// kullanılıyor ki çizgiler kutuların üstünden geçmesin.
const TEMPLATES: Record<OrgchartTypeId, DiagramTemplate> = {
  // Klasik piramit: tek üst, aşağı doğru dallanan departmanlar, yanda kurmay.
  hierarchical: {
    nodes: [
      n('ceo', 'position', 'org_lbl_ceo', 320, 0),
      n('asis', 'staff', 'org_lbl_assistant', 620, 10),
      n('fin', 'department', 'org_lbl_finance', 40, 160),
      n('sales', 'department', 'org_lbl_sales', 320, 160),
      n('ops', 'department', 'org_lbl_ops', 600, 160),
      n('p1', 'position', 'org_lbl_manager', 40, 320),
      n('p2', 'position', 'org_lbl_specialist', 320, 320)
    ],
    edges: [e('ceo', 'fin'), e('ceo', 'sales'), e('ceo', 'ops'), ey('ceo', 'asis'), e('fin', 'p1'), e('sales', 'p2')]
  },

  // Fonksiyonel: kırılım uzmanlık alanına göre. Departmanlar geniş, altlarında
  // aynı işi yapan pozisyonlar toplanır.
  functional: {
    nodes: [
      n('ceo', 'position', 'org_lbl_ceo', 330, 0),
      n('fin', 'department', 'org_lbl_finance', -60, 160),
      n('sales', 'department', 'org_lbl_sales', 180, 160),
      n('ops', 'department', 'org_lbl_ops', 420, 160),
      n('hr', 'department', 'org_lbl_hr', 660, 160),
      n('p1', 'position', 'org_lbl_manager', 140, 320),
      n('p2', 'position', 'org_lbl_specialist', 400, 320)
    ],
    edges: [e('ceo', 'fin'), e('ceo', 'sales'), e('ceo', 'ops'), e('ceo', 'hr'), e('sales', 'p1'), e('ops', 'p2')]
  },

  // Bölümsel: her divizyon kendi finans/satış birimini tekrar eder. Şablonun
  // asıl anlattığı şey bu tekrar.
  divisional: {
    nodes: [
      n('hq', 'position', 'org_lbl_ceo', 340, 0),
      n('d1', 'division', 'org_lbl_division_product', 60, 160),
      n('d2', 'division', 'org_lbl_division_region', 580, 160),
      n('a1', 'department', 'org_lbl_finance', -40, 330),
      n('a2', 'department', 'org_lbl_sales', 200, 330),
      n('b1', 'department', 'org_lbl_finance', 480, 330),
      n('b2', 'department', 'org_lbl_sales', 720, 330)
    ],
    edges: [e('hq', 'd1'), e('hq', 'd2'), e('d1', 'a1'), e('d1', 'a2'), e('d2', 'b1'), e('d2', 'b2')]
  },

  // Matris: dikey çizgi fonksiyon yöneticisine, kesik yatay çizgi proje
  // yöneticisine bağlar. Aynı kişinin iki üstü olması bu şemanın tanımı.
  matrix: {
    nodes: [
      n('ceo', 'position', 'org_lbl_ceo', 360, 0),
      n('f1', 'department', 'org_lbl_ops', 180, 160),
      n('f2', 'department', 'org_lbl_it', 560, 160),
      n('pa', 'position', 'org_lbl_project_a', -120, 320),
      n('pb', 'position', 'org_lbl_project_b', -120, 470),
      n('m11', 'position', 'org_lbl_specialist', 180, 320),
      n('m12', 'position', 'org_lbl_specialist', 560, 320),
      n('m21', 'position', 'org_lbl_specialist', 180, 470),
      n('m22', 'position', 'org_lbl_specialist', 560, 470)
    ],
    edges: [
      e('ceo', 'f1'), e('ceo', 'f2'),
      e('f1', 'm11'), e('f2', 'm12'), e('m11', 'm21'), e('m12', 'm22'),
      ey('pa', 'm11'), ey('pa', 'm12'), ey('pb', 'm21'), ey('pb', 'm22')
    ]
  },

  // Düz: tek katman. Herkes kurucuya bağlı, arada müdür yok.
  flat: {
    nodes: [
      n('f', 'position', 'org_lbl_founder', 380, 0),
      n('p1', 'position', 'org_lbl_sales', -100, 180),
      n('p2', 'position', 'org_lbl_it', 140, 180),
      n('p3', 'position', 'org_lbl_finance', 380, 180),
      n('p4', 'position', 'org_lbl_ops', 620, 180),
      n('p5', 'vacant', 'org_lbl_vacant', 860, 180)
    ],
    edges: [e('f', 'p1'), e('f', 'p2'), e('f', 'p3'), e('f', 'p4'), e('f', 'p5')]
  },

  // Takım bazlı: ana eleman kişi değil ekip. Her ekibin bir sözcüsü var,
  // ekipler merkez ekibe bağlı.
  team: {
    nodes: [
      n('core', 'team', 'org_lbl_core', 350, 0),
      n('t1', 'team', 'org_lbl_team_product', 60, 170),
      n('t2', 'team', 'org_lbl_team_growth', 350, 170),
      n('t3', 'team', 'org_lbl_team_support', 640, 170),
      n('l1', 'position', 'org_lbl_manager', 60, 330),
      n('l2', 'position', 'org_lbl_manager', 350, 330),
      n('l3', 'position', 'org_lbl_manager', 640, 330)
    ],
    edges: [e('core', 't1'), e('core', 't2'), e('core', 't3'), e('t1', 'l1'), e('t2', 'l2'), e('t3', 'l3')]
  },

  // Ağ: merkezde küçük bir çekirdek, çevresinde kesik çizgiyle bağlı dış
  // paydaşlar. Hiyerarşi yerine bağlantı ağı.
  network: {
    nodes: [
      n('lead', 'position', 'org_lbl_founder', 330, 0),
      n('core', 'team', 'org_lbl_core', 340, 170),
      n('sup', 'partner', 'org_lbl_supplier', 0, 60),
      n('agn', 'partner', 'org_lbl_agency', 700, 60),
      n('frl', 'partner', 'org_lbl_freelancer', 0, 300),
      n('tm', 'team', 'org_lbl_team_product', 700, 300)
    ],
    edges: [e('lead', 'core'), ey('sup', 'core'), ey('core', 'agn'), ey('frl', 'core'), ey('core', 'tm')]
  }
};

/** Emir-komuta hattı: düz, köşeli, animasyonsuz. Akış yok, bağlılık var. */
const cizgi = (stroke: string) => ({ type: 'step' as const, animated: false, stroke });
/** Kesikli hat: ikincil raporlama, kurmay bağlantısı, dış paydaş. */
const kesik = (stroke: string) => ({ type: 'smoothstep' as const, animated: false, stroke, dashed: true });

export const ORGCHART_TYPES: OrgchartTypeDef[] = [
  {
    id: 'hierarchical',
    labelKey: 'org_type_hierarchical',
    descKey: 'org_type_hierarchical_desc',
    icon: Network,
    cardClass: 'hover:border-indigo-400 dark:hover:border-indigo-500',
    iconClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
    startShape: 'position',
    shapes: s('position', 'department', 'staff', 'vacant'),
    edge: cizgi('#a5b4fc'),
    secondaryEdge: kesik('#a5b4fc'),
    template: TEMPLATES.hierarchical
  },
  {
    id: 'functional',
    labelKey: 'org_type_functional',
    descKey: 'org_type_functional_desc',
    icon: Building2,
    cardClass: 'hover:border-sky-400 dark:hover:border-sky-500',
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
    startShape: 'department',
    shapes: s('department', 'position', 'team', 'vacant'),
    edge: cizgi('#7dd3fc'),
    template: TEMPLATES.functional
  },
  {
    id: 'divisional',
    labelKey: 'org_type_divisional',
    descKey: 'org_type_divisional_desc',
    icon: Boxes,
    cardClass: 'hover:border-violet-400 dark:hover:border-violet-500',
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
    startShape: 'division',
    shapes: s('division', 'department', 'position', 'team', 'vacant'),
    edge: cizgi('#c4b5fd'),
    template: TEMPLATES.divisional
  },
  {
    id: 'matrix',
    labelKey: 'org_type_matrix',
    descKey: 'org_type_matrix_desc',
    icon: Grid3x3,
    cardClass: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    startShape: 'position',
    shapes: s('position', 'department', 'team', 'vacant'),
    edge: cizgi('#6ee7b7'),
    secondaryEdge: kesik('#34d399'),
    template: TEMPLATES.matrix
  },
  {
    id: 'flat',
    labelKey: 'org_type_flat',
    descKey: 'org_type_flat_desc',
    icon: Rows3,
    cardClass: 'hover:border-amber-400 dark:hover:border-amber-500',
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    startShape: 'position',
    shapes: s('position', 'team', 'vacant'),
    edge: cizgi('#fcd34d'),
    template: TEMPLATES.flat
  },
  {
    id: 'team',
    labelKey: 'org_type_team',
    descKey: 'org_type_team_desc',
    icon: UsersRound,
    cardClass: 'hover:border-rose-400 dark:hover:border-rose-500',
    iconClass: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
    startShape: 'team',
    shapes: s('team', 'position', 'staff', 'vacant'),
    edge: cizgi('#fda4af'),
    template: TEMPLATES.team
  },
  {
    id: 'network',
    labelKey: 'org_type_network',
    descKey: 'org_type_network_desc',
    icon: Waypoints,
    cardClass: 'hover:border-teal-400 dark:hover:border-teal-500',
    iconClass: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
    startShape: 'team',
    shapes: s('team', 'partner', 'position', 'department'),
    edge: cizgi('#5eead4'),
    secondaryEdge: kesik('#2dd4bf'),
    template: TEMPLATES.network
  }
];

export function getOrgchartType(id: OrgchartTypeId | string | null | undefined): OrgchartTypeDef {
  return ORGCHART_TYPES.find((tur) => tur.id === id) || ORGCHART_TYPES[0];
}

export function getOrgchartShape(id: OrgchartShapeId | string): OrgchartShapeDef {
  return SHAPES[id as OrgchartShapeId] || SHAPES.position;
}

// Tür değiştirilirken kutular en yakın karşılığına eşlenir; karşılığı
// olmayanlar yeni türün ilk biçimine düşer, hiçbir kutu kaybolmaz.
export const ORGCHART_SHAPE_FALLBACKS: Record<string, string[]> = {
  position: ['position', 'team'],
  department: ['department', 'division', 'team', 'position'],
  division: ['division', 'department', 'team'],
  team: ['team', 'department', 'position'],
  staff: ['staff', 'position', 'team'],
  vacant: ['vacant', 'position', 'team'],
  partner: ['partner', 'team', 'position']
};

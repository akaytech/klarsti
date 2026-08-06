import { create } from 'zustand';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, deleteDoc, collection, query, where, onSnapshot, or, arrayUnion, arrayRemove, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db, logAppEvent } from '../firebase';
import i18n from '../i18n';
import { useAuthStore } from './useAuthStore';
import { bekleyenAraclar, kisiselBekliyorMu } from './bekleyenYazmalar';
import { gecmisiBagla, yazmayiIsle, gecmisiTemizle } from './gecmis';
import { toast } from 'sonner';

export let isRemoteUpdate = false;

// Sunucudan gelen veriyi state'e yazarken bayrak kalkık olmalı ki otomatik
// kaydetme bunu kullanıcı düzenlemesi sanıp geri yazmasın. Zustand dinleyicileri
// set() içinde SENKRON çalıştığı için bayrağın set() bitince inmesi yeterli;
// eskiden setTimeout(...,0) ile indiriliyordu ve o boşlukta düşen gerçek bir
// kullanıcı düzenlemesi "uzaktan geldi" sanılıp hiç kaydedilmiyordu.
const uzaktanGuncelle = (yaz: () => void) => {
  isRemoteUpdate = true;
  try {
    yaz();
  } finally {
    isRemoteUpdate = false;
  }
};

// Sunucudan gelen araç verisi elimizdekiyle aynı mı? JSON karşılaştırması
// yetmiyor: Firestore alanları kendi sırasıyla döndürüyor, yerelde ise ekleme
// sırası korunuyor; aynı veri farklı metin veriyor. Tanımsız alanlar da
// yok sayılıyor, çünkü buluta yazılırken zaten ayıklanıyorlar.
const derinEsit = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    return a.length === b.length && a.every((eleman, i) => derinEsit(eleman, b[i]));
  }
  const aAnahtarlar = Object.keys(a).filter((k) => a[k] !== undefined);
  const bAnahtarlar = Object.keys(b).filter((k) => b[k] !== undefined);
  return aAnahtarlar.length === bAnahtarlar.length && aAnahtarlar.every((k) => derinEsit(a[k], b[k]));
};

// Eski (proje içi) ajanda kaydı temizliği denenen projeler. Aynı proje için
// tekrar tekrar yazma denememek için tutulur; bkz. fetchProjects.
const legacyNotepadCleanupTried = new Set<string>();

/**
 * Histogram eskiden {kategori, sıklık} kalemleri tutuyordu; yani sıralanmamış
 * bir Pareto'ydu ve dağılım hakkında hiçbir şey söyleyemiyordu. Artık ham ölçüm
 * alıyor. Sayısal etiketler sıklıkları kadar tekrarlanarak ölçüme çevriliyor;
 * sayıya çevrilemeyen etiketler (örn. "Hatalı kaynak") silinmiyor, kullanıcıya
 * gösterilmek üzere eskiKalemler'de bekletiliyor.
 */
const EN_FAZLA_OLCUM = 10000;

const tasiHistogram = (h: any) => {
  if (!h || Array.isArray(h.olcumler)) return h;
  const olcumler: number[] = [];
  const kalanlar: any[] = [];

  (Array.isArray(h.items) ? h.items : []).forEach((kalem: any) => {
    const etiket = String(kalem?.category ?? '').trim();
    const sayi = Number(etiket.replace(',', '.'));
    const tekrar = Math.max(0, Math.round(Number(kalem?.frequency) || 0));
    if (etiket !== '' && Number.isFinite(sayi) && tekrar > 0) {
      for (let i = 0; i < tekrar && olcumler.length < EN_FAZLA_OLCUM; i += 1) olcumler.push(sayi);
    } else if (etiket !== '' || tekrar > 0) {
      kalanlar.push(kalem);
    }
  });

  return {
    ...h,
    olcumler,
    ayarlar: h.ayarlar ?? {},
    createdAt: h.createdAt ?? Date.now(),
    eskiKalemler: kalanlar.length > 0 ? kalanlar : undefined,
    items: undefined,
  };
};

/**
 * Eski VSM kutusunu yeni şemaya taşır. Süreler çıplak sayıydı ve hepsi aynı
 * `cycleTime` alanında duruyordu; stok kutusundaki sayı ise gün cinsinden bir
 * bekleme süresiydi (kutudaki yer tutucu "gün" yazıyordu).
 */
const tasiVsmKutusu = (n: any) => {
  const birim = n?.data?.timeUnit || 'sec';
  const sayi = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const eski = n?.data ?? {};

  if (n?.type === 'vsmInventory') {
    return {
      ...n,
      data: {
        ...eski,
        beklemeSuresi: eski.cycleTime !== undefined ? { deger: sayi(eski.cycleTime), birim: 'day' } : undefined,
        cycleTime: undefined,
        timeUnit: undefined,
      },
    };
  }

  if (n?.type === 'vsmProcess') {
    return {
      ...n,
      data: {
        ...eski,
        cycleTime: { deger: sayi(eski.cycleTime), birim },
        changeoverTime: eski.changeoverTime !== undefined ? { deger: sayi(eski.changeoverTime), birim } : undefined,
        timeUnit: undefined,
      },
    };
  }

  return { ...n, data: { ...eski, timeUnit: undefined } };
};

export const TOOL_KEYS_MAP: Record<string, string[]> = {
  wbs: ['wbsTrees'],
  '5whys': ['fiveWhysAnalyses'],
  swot: ['swot'],
  ishikawa: ['ishikawa'],
  pdca: ['pdca'],
  waterfall: ['waterfall'],
  fta: ['ftaAnalyses'],
  decision: ['decision'],
  flowchart: ['flowcharts'],
  orgchart: ['orgcharts'],
  mindmap: ['mindmaps'],
  pareto: ['pareto'],
  histogram: ['histogram'],
  vsm: ['vsmMaps']
  // 'notepad' burada yok: ajanda kişisel, projeye ait değil.
};

import { getDefaultWbsTrees } from './slices/createWbsSlice';
import { yeniVsmHarita, VSM_VARSAYILAN_AYARLAR } from './slices/createVsmSlice';
import { yeniFiveWhysAnalizi } from './slices/createFiveWhysSlice';
import { yeniFtaAnalizi } from './slices/createFtaSlice';

export const getInitialValue = (toolName: string, key: string) => {
  if (toolName === 'wbs' && key === 'wbsTrees') return getDefaultWbsTrees();
  if (toolName === '5whys' && key === 'fiveWhysAnalyses') return [yeniFiveWhysAnalizi(i18n.t('whys_default_analysis_name'), i18n.t('whys_problem'))];
  // Akış şeması boş başlar: önce tür seçim ekranı çıkar, ilk şemayı o kurar.
  // Zihin haritası ise ana fikirle başlar, dallar ondan büyür.
  // Zihin haritası tek bir boş haritayla açılır; akış şemasının aksine tür
  // seçimi olmadığı için kullanıcıyı karşılayacak bir kök hep vardır.
  if (toolName === 'mindmap' && key === 'mindmaps') return [{
    id: uuidv4(),
    name: i18n.t('mindmap_default_map_name'),
    nodes: [yeniMindmapKoku(i18n.t('mindmap_root'))],
    edges: [],
    createdAt: Date.now()
  }];
  if (toolName === 'fta' && key === 'ftaAnalyses') return [yeniFtaAnalizi(i18n.t('fta_default_analysis_name'), i18n.t('fta_top_event'))];
  // Değer akışı boş bir "mevcut durum" haritasıyla açılır. Kutuları kanvastaki
  // başlangıç ekranı kurar; eskiden bir useEffect kanvas boşaldıkça tedarikçi
  // kutusunu geri koyuyordu ve haritayı boşaltmak imkânsızdı.
  if (toolName === 'vsm' && key === 'vsmMaps') return [yeniVsmHarita(i18n.t('vsm_default_map_name'), 'mevcut')];
  return [];
};

const KEY_TO_TOOL: Record<string, string> = {};
Object.entries(TOOL_KEYS_MAP).forEach(([tool, keys]) => {
  keys.forEach((k) => { KEY_TO_TOOL[k] = tool; });
});

export const getInitialValueForKey = (key: string) => getInitialValue(KEY_TO_TOOL[key] || key, key);

// DİKKAT: 'notepad' bu listede yok. Ajanda projeye değil kullanıcıya ait
// (users/{uid} dokümanı), bu yüzden proje toolData akışının dışında tutulur.
export const TOOL_STATE_KEYS = [
  'wbsTrees', 'fiveWhysAnalyses', 'swot', 'ishikawa',
  'pdca', 'waterfall', 'pareto', 'histogram', 'decision',
  'flowcharts', 'orgcharts', 'mindmaps', 'ftaAnalyses',
  'vsmMaps'
] as const;





import { createWbsSlice, getDescendants, getActiveWbsTree } from './slices/createWbsSlice';
import type { WbsSlice, GoalStatus, GoalNodeData, GoalNode, WbsTree } from './slices/createWbsSlice';
export type { GoalStatus, GoalNodeData, GoalNode, WbsTree };
export { getDescendants, getActiveWbsTree };
export { isPristineWbs, WBS_NODE_W, WBS_NODE_H } from './slices/createWbsSlice';
export { isPristineFta } from './slices/createFtaSlice';

import { createNotepadSlice } from './slices/createNotepadSlice';
import type { NotepadSlice, NotepadNote } from './slices/createNotepadSlice';
export type { NotepadNote };

import { createJournalSlice } from './slices/createJournalSlice';
import type { JournalSlice, JournalEntry } from './slices/createJournalSlice';
export type { JournalEntry };
import { createFiveWhysSlice } from './slices/createFiveWhysSlice';
import type { FiveWhysSlice, FiveWhysNode, FiveWhysNodeType, FiveWhysNodeData, FiveWhysAnalysis } from './slices/createFiveWhysSlice';
export type { FiveWhysAnalysis };
export { getActiveFiveWhys } from './slices/createFiveWhysSlice';
export type { FiveWhysNode, FiveWhysNodeType, FiveWhysNodeData };

import { createSwotSlice } from './slices/createSwotSlice';
import type { SwotSlice, SwotType, SwotItem, SwotAnalysis } from './slices/createSwotSlice';
export type { SwotType, SwotItem, SwotAnalysis };

import { createIshikawaSlice } from './slices/createIshikawaSlice';
import type { IshikawaSlice, IshikawaCategory, IshikawaItem, IshikawaAnalysis } from './slices/createIshikawaSlice';
export type { IshikawaCategory, IshikawaItem, IshikawaAnalysis };

import { createPdcaSlice } from './slices/createPdcaSlice';
import type { PdcaSlice, PdcaPhase, PdcaItem, PdcaCycle } from './slices/createPdcaSlice';
export type { PdcaPhase, PdcaItem, PdcaCycle };

import { createWaterfallSlice } from './slices/createWaterfallSlice';
import type { WaterfallSlice, WaterfallPhase, WaterfallItem, WaterfallProject } from './slices/createWaterfallSlice';
export type { WaterfallPhase, WaterfallItem, WaterfallProject };

import { createFtaSlice } from './slices/createFtaSlice';
import type { FtaSlice, FtaNodeType, FtaNodeData, FtaNode, FtaAnalysis } from './slices/createFtaSlice';
export type { FtaAnalysis };
export { getActiveFta } from './slices/createFtaSlice';
export type { FtaNodeType, FtaNodeData, FtaNode };

import { createMindmapSlice, getActiveMindmap, yeniMindmapKoku } from './slices/createMindmapSlice';
import type { MindmapSlice, MindmapNode, MindmapNodeData, Mindmap } from './slices/createMindmapSlice';
export type { MindmapNode, MindmapNodeData, Mindmap };
export { getActiveMindmap };

import { createFlowchartSlice } from './slices/createFlowchartSlice';
import type { FlowchartSlice, FlowchartNodeType, FlowchartNodeData, FlowchartNode, Flowchart } from './slices/createFlowchartSlice';
export type { FlowchartNodeType, FlowchartNodeData, FlowchartNode, Flowchart };
export { getActiveFlowchart } from './slices/createFlowchartSlice';

import { createOrgchartSlice } from './slices/createOrgchartSlice';
import type { OrgchartSlice, OrgchartNodeType, OrgchartNodeData, OrgchartNode, Orgchart } from './slices/createOrgchartSlice';
export type { OrgchartNodeType, OrgchartNodeData, OrgchartNode, Orgchart };
export { getActiveOrgchart } from './slices/createOrgchartSlice';

import { createParetoSlice } from './slices/createParetoSlice';
import type { ParetoSlice, ParetoItem, ParetoProject } from './slices/createParetoSlice';
export type { ParetoItem, ParetoProject };

import { createHistogramSlice } from './slices/createHistogramSlice';
import type { HistogramSlice, HistogramProject, HistogramAyarlar, HistogramEskiKalem } from './slices/createHistogramSlice';
export type { HistogramProject, HistogramAyarlar, HistogramEskiKalem };

import { createDecisionSlice } from './slices/createDecisionSlice';
import type { DecisionSlice, DecisionCriteria, DecisionOption, DecisionMatrixProject } from './slices/createDecisionSlice';
export type { DecisionCriteria, DecisionOption, DecisionMatrixProject };

import { createVsmSlice } from './slices/createVsmSlice';
import type { VsmSlice, VsmNode, VsmEdge, VsmNodeData, VsmHarita, VsmAyarlar, VsmSure, VsmBirim, VsmNodeTuru, VsmEdgeTuru, VsmHaritaTuru } from './slices/createVsmSlice';
export type { VsmNode, VsmEdge, VsmNodeData, VsmHarita, VsmAyarlar, VsmSure, VsmBirim, VsmNodeTuru, VsmEdgeTuru, VsmHaritaTuru };
export { getActiveVsmMap } from './slices/createVsmSlice';



export type ToolId = 'mindmap' | 'wbs' | '5whys' | 'swot' | 'ishikawa' | 'pdca' | 'waterfall' | 'fta' | 'decision' | 'flowchart' | 'orgchart' | 'pareto' | 'histogram' | 'notepad' | 'vsm';

export interface Project {
  id: string;
  name: string;
  toolData: Record<string, any>;
  isPublic?: boolean;
  sharedWith?: string[];
  updatedAt: number;
  userId: string;
}

export interface RoadmapState extends NotepadSlice, JournalSlice, FiveWhysSlice, SwotSlice, IshikawaSlice, PdcaSlice, WaterfallSlice, FtaSlice, FlowchartSlice, OrgchartSlice, MindmapSlice, ParetoSlice, HistogramSlice, DecisionSlice, WbsSlice, VsmSlice {
  projectUnsubscribe: (() => void) | null;
  // Kişisel veri (ajanda) users/{uid} dokümanından gelir, projelerden bağımsız dinlenir.
  personalUnsubscribe: (() => void) | null;
  personalLoaded: boolean;
  fetchPersonalData: (userId: string) => void;
  // Gün sonu değerlendirmesi gün başına ayrı doküman; sadece açılan gün çekilir.
  loadJournalDay: (dateKey: string) => Promise<void>;
  // Removed Auth state, moved to useAuthStore
  resetState: () => void;

  // UI State
  activeTool: ToolId | null;
  setActiveTool: (tool: ToolId | null) => void;

  // Projects
  projectsLoaded: boolean;
  projects: Project[];
  currentProjectId: string | null;
  fetchProjects: (userId: string) => Promise<void>;
  createProject: (name: string, initialTool?: string) => void;
  loadProject: (id: string) => void;
  updateProjectName: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  clearToolData: (projectId: string, toolName: ToolId) => void;
  setProjectPublic: (id: string, isPublic: boolean) => Promise<void>;
  joinSharedProject: (id: string) => Promise<boolean>;
}

/**
 * Geri al / ileri al'ın taşıdığı alanlar. Araçların kutuları, çizgileri ve
 * ayarları tek nesnede durduğu için her araç tek anahtarla temsil ediliyor;
 * geri alma o aracın hepsini birlikte taşıyor. Hangi çizimin/analizin açık
 * olduğu (active*Id) geçmişe girmiyor: o bir iş değil, bakış açısı.
 * (Ajanda bilerek dışarıda: kişisel veri, geçmişi tutulmuyor.)
 */
const gecmiseGirenler = (state: RoadmapState) => ({
  wbsTrees: state.wbsTrees,
  fiveWhysAnalyses: state.fiveWhysAnalyses,
  swot: state.swot,
  ishikawa: state.ishikawa,
  pdca: state.pdca,
  waterfall: state.waterfall,
  pareto: state.pareto,
  histogram: state.histogram,
  decision: state.decision,
  flowcharts: state.flowcharts,
  orgcharts: state.orgcharts,
  mindmaps: state.mindmaps,
  ftaAnalyses: state.ftaAnalyses,
  vsmMaps: state.vsmMaps,
});

// zundo'nun geçmişe yazma fonksiyonu; middleware kurulurken doluyor.
let gecmisHandleSet: ((oncekiDurum: Record<string, unknown>) => void) | null = null;

export const useRoadmapStore = create<RoadmapState>()(
  temporal(
      (set, get, api) => ({
        ...createNotepadSlice(set, get, api),
        ...createJournalSlice(set, get, api),
        ...createFiveWhysSlice(set, get, api),
        ...createSwotSlice(set, get, api),
        ...createIshikawaSlice(set, get, api),
        ...createPdcaSlice(set, get, api),
        ...createWaterfallSlice(set, get, api),
        ...createFtaSlice(set, get, api),
        ...createFlowchartSlice(set, get, api),
        ...createOrgchartSlice(set, get, api),
        ...createMindmapSlice(set, get, api),
        ...createParetoSlice(set, get, api),
        ...createHistogramSlice(set, get, api),
        ...createDecisionSlice(set, get, api),
        ...createWbsSlice(set, get, api),
        ...createVsmSlice(set, get, api),

        projectUnsubscribe: null,
        personalUnsubscribe: null,
        personalLoaded: false,
        resetState: () => {
          const sub = get().projectUnsubscribe;
          if (sub) sub();
          const personalSub = get().personalUnsubscribe;
          if (personalSub) personalSub();
          // Burada bekleyen yazmalar İPTAL EDİLMEZ; öyle yapan bir kod hiç
          // olmadı. Oturum kapanınca AuthenticatedApp sökülüyor ve
          // SyncManager'ın cleanup'ı flushAllSaves() ile bekleyenleri
          // göndermeye çalışıyor. Bir sonraki kullanıcıya sızma riski ise
          // dinleyicilerin kaldırılmasıyla kapandı (bkz. SyncManager cleanup).
          //
          // Bu flush eskiden signOut'tan SONRA çalışıyordu; istekler kimliksiz
          // gittiği için kurallar hepsini reddediyor ve son düzenlemeler
          // kayboluyordu. Artık çıkış akışı signOut'tan önce
          // flushPendingSaves() ile bekliyor (bkz. TopRightUserMenu.logout);
          // buradaki flush yalnızca duran ağ.
          set({ projectsLoaded: false, projects: [], currentProjectId: null, activeTool: null, wbsTrees: [], activeWbsTreeId: null, fiveWhysAnalyses: [], activeFiveWhysId: null, swot: [], ishikawa: [], pdca: [], waterfall: [], pareto: [], histogram: [],
            decision: [], flowcharts: [], activeFlowchartId: null, orgcharts: [], activeOrgchartId: null, mindmaps: [], activeMindmapId: null, ftaAnalyses: [], activeFtaId: null, notepad: [], vsmMaps: [], activeVsmMapId: null, projectUnsubscribe: null,
            personalUnsubscribe: null, personalLoaded: false,
            journal: {}, journalDates: [], journalLoadedDates: [], journalSavingDates: [], journalSavedDates: [], journalLoadError: null });
        },

        // Kişisel ajanda users/{uid} dokümanında durur. Projelerden tamamen ayrı:
        // proje paylaşıldığında ajanda o paylaşımın içine girmez.
        fetchPersonalData: (userId) => {
          const currentSub = get().personalUnsubscribe;
          if (currentSub) currentSub();

          const unsubscribe = onSnapshot(doc(db, 'users', userId), (snap) => {
            const data = snap.data();
            const gelenNotepad = Array.isArray(data?.notepad) ? data.notepad : [];
            const mevcutNotepad = get().notepad;
            // Projelerdeki ile aynı gerekçe: ajandanın bekleyen bir yazması
            // varken uzak hali uygulanmaz. (Aynı hesabın iki cihazı için
            // geçerli; ilk yüklemede bekleyen yazma olamaz, çünkü kaydetme
            // personalLoaded'ı bekliyor.)
            uzaktanGuncelle(() => set({
              notepad: kisiselBekliyorMu() || derinEsit(mevcutNotepad, gelenNotepad) ? mevcutNotepad : gelenNotepad,
              // Günlerin kendisi ayrı dokümanlarda; burada sadece hangi günlerde
              // kayıt olduğunun listesi var (takvim işareti için).
              journalDates: Array.isArray(data?.journalDates) ? data.journalDates : [],
              personalLoaded: true
            }));
          }, (error) => {
            console.error("Fetch personal data error:", error);
            // Sert yenilemede Firestore auth token'ı geç bağlanabiliyor; projelerdeki
            // ile aynı gerekçeyle dinleyiciyi kısa bir gecikmeyle tekrar kuruyoruz.
            if (error.code === 'permission-denied' && useAuthStore.getState().user?.uid === userId) {
              setTimeout(() => get().fetchPersonalData(userId), 1500);
            }
          });

          set({ personalUnsubscribe: unsubscribe });
        },

        // Bir günün değerlendirmesini sunucudan çeker. Zaten çekildiyse tekrar okumaz.
        loadJournalDay: async (dateKey) => {
          const user = useAuthStore.getState().user;
          if (!user) return;
          if (get().journalLoadedDates.includes(dateKey)) return;
          get().setJournalLoadError(null);
          try {
            const snap = await getDoc(doc(db, 'users', user.uid, 'journal', dateKey));
            const data = snap.exists() ? snap.data() : null;
            get().setJournalDay(dateKey, data ? { text: data.text || '', updatedAt: data.updatedAt || 0 } : null);
          } catch (error) {
            console.error("Load journal day error:", error);
            // Panel sonsuza kadar dönen ikonda kalmasın; hata gösterilip tekrar denenebilsin.
            get().setJournalLoadError(dateKey);
          }
        },

        
      activeTool: null,
      setActiveTool: (tool) => {
        set({ activeTool: tool });
        if (tool) {
          logAppEvent('tool_opened', { tool });
        }
      },

      projectsLoaded: false,
      projects: [],
      currentProjectId: null,

      fetchProjects: async (userId) => {
        try {
          const currentSub = get().projectUnsubscribe;
          if (currentSub) currentSub();

          const parseDoc = (doc: any): Project | null => {
            try {
              const data = doc.data();
              const toolData: Record<string, any> = data.toolData || {};
              
              TOOL_STATE_KEYS.forEach(key => {
                if (data[key] !== undefined) toolData[key] = data[key];
              });

              // Kırılım ağacı da eskiden proje başına tekti (nodes / edges).
              // Akış şeması ve zihin haritasındaki gibi tek ağaçlık listeye
              // çevriliyor; eski alanlar dokümanda kalıyor, okunmuyor.
              if (!Array.isArray(toolData.wbsTrees)) {
                ['nodes', 'edges'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                const eskiKutular = toolData.nodes || [];
                if (eskiKutular.length > 0) {
                  toolData.wbsTrees = [{
                    id: 'migrated-wbs',
                    name: i18n.t('wbs_default_tree_name'),
                    // Kutular eskiden mutlak konumda donduruluyordu
                    // (isManuallyPositioned). Artık sapma ebeveyne göre
                    // tutuluyor; eski işaret okunmuyor, taşınırken düşürülüyor.
                    nodes: eskiKutular.map((n: any) => {
                      if (n?.data?.isManuallyPositioned === undefined) return n;
                      const { isManuallyPositioned, ...kalanVeri } = n.data;
                      return { ...n, data: kalanVeri };
                    }),
                    edges: toolData.edges || [],
                    createdAt: Date.now()
                  }];
                }
                // Eski veri yoksa alan hiç yazılmıyor: aracı ilk kez açan
                // projede varsayılan ağacı getInitialValue kuruyor.
              }

              let safeSwot = toolData.swot || [];
              if (safeSwot.length > 0 && typeof safeSwot[0] === 'object' && safeSwot[0] !== null && 'type' in safeSwot[0]) {
                toolData.swot = [{ id: 'migrated-swot', title: i18n.t('default_swot_title'), items: safeSwot, createdAt: Date.now() }];
              }
              
              // Akış şeması eskiden proje başına tekti (flowchartNodes /
              // flowchartEdges / flowchartType). Artık şema listesi var; eski
              // kayıt varsa tek şemalık listeye çevriliyor. Eski alanlar
              // dokümanda kalıyor, okunmuyor.
              if (!Array.isArray(toolData.flowcharts)) {
                ['flowchartNodes', 'flowchartEdges', 'flowchartType'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                const eskiKutular = toolData.flowchartNodes || [];
                toolData.flowcharts = eskiKutular.length > 0 ? [{
                  id: 'migrated-flowchart',
                  name: i18n.t(`flowchart_type_${toolData.flowchartType || 'workflow'}`),
                  type: toolData.flowchartType || 'workflow',
                  nodes: eskiKutular,
                  edges: toolData.flowchartEdges || [],
                  createdAt: Date.now()
                }] : [];
              }

              // Organizasyon şeması eskiden akış şemasının dördüncü türüydü
              // (type: 'org'). Artık ayrı bir araç; eski kayıtlar hiyerarşik
              // organizasyon şeması olarak yeni listeye taşınıyor. Kutu
              // biçimleri (pozisyon, departman, kurmay, ekip, boş kadro) iki
              // katalogda da aynı adla durduğu için dönüştürme gerekmiyor,
              // yalnızca React Flow düğüm tipi değişiyor.
              const eskiOrgSemalari = (toolData.flowcharts || []).filter((s: any) => s?.type === 'org');
              if (eskiOrgSemalari.length > 0) {
                toolData.flowcharts = toolData.flowcharts.filter((s: any) => s?.type !== 'org');
                const tasinan = eskiOrgSemalari.map((s: any) => ({
                  ...s,
                  type: 'hierarchical',
                  nodes: (s.nodes || []).map((n: any) => ({ ...n, type: 'orgchartNode' }))
                }));
                toolData.orgcharts = [...(Array.isArray(toolData.orgcharts) ? toolData.orgcharts : []), ...tasinan];
              }

              // Zihin haritası da eskiden proje başına tekti (mindmapNodes /
              // mindmapEdges). Akış şemasındaki gibi tek haritalık listeye
              // çevriliyor; eski alanlar dokümanda kalıyor, okunmuyor.
              if (!Array.isArray(toolData.mindmaps)) {
                ['mindmapNodes', 'mindmapEdges'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                const eskiDallar = toolData.mindmapNodes || [];
                if (eskiDallar.length > 0) {
                  toolData.mindmaps = [{
                    id: 'migrated-mindmap',
                    name: i18n.t('mindmap_default_map_name'),
                    nodes: eskiDallar,
                    edges: toolData.mindmapEdges || [],
                    createdAt: Date.now()
                  }];
                }
                // Eski veri yoksa alan hiç yazılmıyor: aracı ilk kez açan
                // projede varsayılan haritayı getInitialValue kuruyor.
              }

              // Değer akışı da eskiden proje başına tekti (vsmNodes / vsmEdges)
              // ve süreler çıplak sayıydı: işlem kutusunun saniyesiyle stok
              // kutusunun günü aynı torbada toplanıyordu. Tek haritalık listeye
              // çevrilirken süreler birimleriyle birlikte yazılıyor.
              if (!Array.isArray(toolData.vsmMaps)) {
                ['vsmNodes', 'vsmEdges'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                const eskiKutular = toolData.vsmNodes || [];
                if (eskiKutular.length > 0) {
                  toolData.vsmMaps = [{
                    id: 'migrated-vsm',
                    name: i18n.t('vsm_default_map_name'),
                    tur: 'mevcut',
                    ayarlar: { ...VSM_VARSAYILAN_AYARLAR },
                    createdAt: Date.now(),
                    nodes: eskiKutular.map((n: any) => tasiVsmKutusu(n)),
                    // Eski varsayılan 'step' hiçbir VSM oku değildi; itme oku sayılıyor.
                    edges: (toolData.vsmEdges || []).map((e: any) => ({
                      ...e,
                      type: e.type && e.type !== 'step' ? e.type : 'vsmPush',
                    })),
                  }];
                }
                // Eski veri yoksa alan hiç yazılmıyor: aracı ilk kez açan
                // projede başlangıç haritasını getInitialValue kuruyor.
              }

              if (Array.isArray(toolData.histogram)) {
                toolData.histogram = toolData.histogram.map(tasiHistogram);
              }

              // 5 Neden ve Hata Ağacı da proje başına tekti; diğer araçlar gibi
              // tek analizlik listeye çevriliyor, eski alanlar dokümanda kalıyor.
              if (!Array.isArray(toolData.fiveWhysAnalyses)) {
                ['fiveWhysNodes', 'fiveWhysEdges'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                if ((toolData.fiveWhysNodes || []).length > 0) {
                  toolData.fiveWhysAnalyses = [{
                    id: 'migrated-5whys',
                    name: i18n.t('whys_default_analysis_name'),
                    nodes: toolData.fiveWhysNodes,
                    edges: toolData.fiveWhysEdges || [],
                    createdAt: Date.now(),
                  }];
                }
              }

              if (!Array.isArray(toolData.ftaAnalyses)) {
                ['ftaNodes', 'ftaEdges'].forEach((k) => {
                  if (data[k] !== undefined && toolData[k] === undefined) toolData[k] = data[k];
                });
                if ((toolData.ftaNodes || []).length > 0) {
                  toolData.ftaAnalyses = [{
                    id: 'migrated-fta',
                    name: i18n.t('fta_default_analysis_name'),
                    nodes: toolData.ftaNodes,
                    edges: toolData.ftaEdges || [],
                    createdAt: Date.now(),
                  }];
                }
              }

              let safeWaterfall = toolData.waterfall || [];
              toolData.waterfall = safeWaterfall.map((proj: any) => ({
                ...proj, currentPhaseIndex: proj.currentPhaseIndex ?? 0,
                items: Array.isArray(proj.items) ? proj.items.map((item: any) => ({ ...item, phase: item.phase === 'Design' ? 'High-Level Design' : item.phase })) : []
              }));

              const parsed: Project = { id: doc.id, name: data.name, updatedAt: data.updatedAt, userId: data.userId, toolData };
              if (data.isPublic !== undefined) parsed.isPublic = data.isPublic;
              if (data.sharedWith !== undefined) parsed.sharedWith = data.sharedWith;
              return parsed;            } catch (error) {
              console.error("Parse doc error for project ID", doc.id, error);
              toast.error(i18n.t('error_parse_doc', { defaultValue: 'Error parsing document' }), { id: 'error-parse-doc' });
              return null;
            }
          };

          // Sayfa sert yenilendiğinde, Firestore'un dahili auth token'ı bazen
          // onAuthStateChanged'den bir tık geç bağlanır. İlk istek bu yüzden
          // permission-denied alırsa, kısa bir gecikmeyle dinleyiciyi otomatik
          // olarak yeniden kurarak kalıcı olarak boş kalmasını önlüyoruz.
          const q = query(collection(db, 'projects'), or(where('userId', '==', userId), where('sharedWith', 'array-contains', userId)));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            // Ajanda eskiden proje dokümanının içinde tutuluyordu. Kişisel ajandaya
            // geçtikten sonra bu kayıtlar hem kullanılmıyor hem de paylaşılmış
            // projelerde okunabilir halde kalıyor; sahibi olduğumuz projelerden siliyoruz.
            // Temizlik proje başına EN FAZLA BİR KEZ denenir. Eskiden her
            // snapshot'ta tekrar deneniyordu; yazma kalıcı olarak hata verirse
            // (örn. yetki) bu, her güncellemede yeniden tetiklenen sonsuz bir
            // yazma turuna dönüşüyordu.
            snapshot.docs.forEach((d) => {
              const data = d.data();
              if (data.userId !== userId) return;
              if (data.notepad === undefined && data.toolData?.notepad === undefined) return;
              if (legacyNotepadCleanupTried.has(d.id)) return;
              legacyNotepadCleanupTried.add(d.id);
              updateDoc(doc(db, 'projects', d.id), {
                notepad: deleteField(),
                'toolData.notepad': deleteField()
              }).catch((err) => console.error("Legacy notepad cleanup failed:", err));
            });

            const fetchedProjects = snapshot.docs
              .map(parseDoc)
              .filter((p): p is Project => p !== null);

            // Sunucudan gelen hali "senkron" olarak işaretle; aksi halde otomatik
            // kaydetme her uzak güncellemeden sonra gereksiz bir yazma tetikler.
            const currentState = get();
            const updates: Partial<RoadmapState> & Record<string, any> = { projectsLoaded: true, projects: fetchedProjects };

            if (currentState.currentProjectId) {
              const activeProj = fetchedProjects.find(p => p.id === currentState.currentProjectId);
              if (activeProj) {
                // parseDoc her snapshot'ta yeni nesneler kuruyor. Yerel yazmalar da
                // anında bir yankı snapshot'ı doğurduğu için, değişmemiş araçlara
                // körü körüne yeni referans atamak her kayıttan sonra açık kanvası
                // baştan çizdiriyordu. İçerik aynıysa eldeki referansı koruyoruz.
                // (Yankıyı tamamen atlamak yerine karşılaştırma yapılıyor: aynı
                // saniyede gelen uzak bir düzenleme atlanırsa bir daha bildirilmez.)
                const bekleyenler = bekleyenAraclar(activeProj.id);
                const korunanAraclar: Record<string, any> = {};
                TOOL_STATE_KEYS.forEach((k) => {
                  const mevcut = (currentState as unknown as Record<string, any>)[k];
                  // Bu aracın yazması hâlâ bekliyorsa uzak hali uygulanmaz:
                  // kullanıcı kendi düzenlemesini ekranda geri alınmış görür,
                  // saniyesinde bizim yazmamız gidince de tekrar geri gelirdi.
                  // Yazma sunucuya ulaşınca gelen snapshot zaten güncel olacak.
                  if (bekleyenler.has(k)) {
                    updates[k] = mevcut;
                    korunanAraclar[k] = mevcut;
                    return;
                  }
                  const gelen = activeProj.toolData[k] || getInitialValueForKey(k);
                  const deger = derinEsit(mevcut, gelen) ? mevcut : gelen;
                  updates[k] = deger;
                  korunanAraclar[k] = deger;
                });
                // Projeler listesindeki nesne de aynı referansları göstermeli;
                // yoksa senkronizasyon bir sonraki düzenlemede bütün araçları
                // değişmiş sanıp hepsini birden yükler.
                updates.projects = fetchedProjects.map((p) =>
                  p.id === activeProj.id ? { ...p, toolData: { ...p.toolData, ...korunanAraclar } } : p
                );
              }
            }

            uzaktanGuncelle(() => set(updates));
          }, (error) => {
            console.error("Fetch projects error:", error);
            toast.error(i18n.t('error_fetch_projects', { defaultValue: 'Error fetching projects' }), { id: 'error-fetch-projects' });
            if (error.code === 'permission-denied' && useAuthStore.getState().user?.uid === userId) {
              setTimeout(() => get().fetchProjects(userId), 1500);
            }
          });

          set({ projectUnsubscribe: unsubscribe });
        } catch (error) {
          console.error("Setup listen projects error:", error);
          toast.error(i18n.t('error_setup_listen', { defaultValue: 'Error listening to projects' }), { id: 'error-setup-listen' });
        }
      },

      createProject: (name, initialTool = 'wbs') => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const activeToolToUse = initialTool || get().activeTool;
        logAppEvent('project_created', { tool: activeToolToUse });

        const id = uuidv4();
        const toolData: Record<string, any> = {};
        if (activeToolToUse) {
          const keys = TOOL_KEYS_MAP[activeToolToUse] || [];
          keys.forEach((k: string) => toolData[k] = getInitialValue(activeToolToUse, k));
        }

        const newProject: Project = {
          id,
          name,
          toolData,
          updatedAt: Date.now(),
          userId: user.uid,
        };

        // Save immediately
        setDoc(doc(db, 'projects', newProject.id), newProject).catch((err) => {
          console.error(err);
          toast.error(i18n.t('save_failed', { defaultValue: 'Failed to save to cloud' }), { id: 'save-failed' });
        });

        set((state) => {
          const updates: any = { projects: [newProject, ...state.projects], currentProjectId: newProject.id, activeTool: (initialTool as RoadmapState['activeTool']) || null };
          TOOL_STATE_KEYS.forEach(k => updates[k] = newProject.toolData[k] || getInitialValueForKey(k));
          return updates;
        });
      },

      loadProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          const updates: any = { currentProjectId: id };
          TOOL_STATE_KEYS.forEach(k => {
            updates[k] = project.toolData[k] || getInitialValueForKey(k);
          });
          set(updates);
        }
      },

      updateProjectName: (id, name) => {
        const user = useAuthStore.getState().user;
        if (user) {
           setDoc(doc(db, 'projects', id), { name, updatedAt: Date.now() }, { merge: true }).catch((err) => {
             console.error(err);
             toast.error(i18n.t('save_failed', { defaultValue: 'Failed to save to cloud' }), { id: 'save-failed' });
           });
        }
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: Date.now() } : p
          ),
        }));
      },

      deleteProject: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        logAppEvent('project_deleted');
        const state = get();
        const project = state.projects.find(p => p.id === id);
        // Hata bildirimi projenin geri kalanıyla aynı yoldan geçer; alert()
        // sayfayı kilitliyor ve diğer bildirimlerden farklı görünüyordu.
        const bildirHata = (e: { message: string }) =>
          toast.error(i18n.t('delete_error') + e.message, { id: 'delete-error' });

        if (project && project.userId !== user.uid) {
             updateDoc(doc(db, 'projects', id), { sharedWith: arrayRemove(user.uid) }).catch(bildirHata);
        } else {
             deleteDoc(doc(db, 'projects', id)).catch(bildirHata);
        }

        set((state) => {
          const newProjects = state.projects.filter((p) => p.id !== id);
          const isCurrent = state.currentProjectId === id;
          const updates: any = {
            projects: newProjects,
            currentProjectId: isCurrent ? null : state.currentProjectId,
            activeTool: newProjects.length === 0 ? null : state.activeTool,
          };
          if (isCurrent) {
            // Her anahtar liste değil (akış şemasının türü bir metin), o yüzden
            // boş liste yerine anahtarın kendi başlangıç değeri yazılıyor.
            TOOL_STATE_KEYS.forEach(k => updates[k] = getInitialValueForKey(k));
          }
          return updates;
        });
      },

      
      setProjectPublic: async (id, isPublic) => {
        if (isPublic === undefined) return;
        try {
          await setDoc(doc(db, 'projects', id), { isPublic }, { merge: true });
        } catch (error) {
          console.error("setProjectPublic error:", error);
          toast.error(i18n.t('error_set_public', { defaultValue: 'Error sharing project' }), { id: 'error-set-public' });
        }
      },

      // Burada uyarı GÖSTERİLMEZ, yalnızca false döner. Bu fonksiyon adres
      // çubuğundaki proje listede bulunamadığında çağrılıyor ve bu durum çoğu
      // zaman gerçek bir hata değil: liste henüz gelmemiş olabilir, hatta proje
      // kullanıcının kendisinin olabilir. Böyle bir anda "projeye katılırken
      // hata" demek yanlış. Ne söyleneceğine, tekrar denemeleri de gören çağıran
      // taraf karar veriyor (bkz. AuthenticatedApp).
      joinSharedProject: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return false;
        try {
          const docRef = doc(db, 'projects', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Project;
            if (data.isPublic) {
              await updateDoc(docRef, { sharedWith: arrayUnion(user.uid) });
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error("joinSharedProject error:", error);
          return false;
        }
      },

      clearToolData: (projectId, toolName) => {
        // Aracın verisi sıfırlandıktan sonra yığında kalan kayıtlar silinmiş
        // veriye ait; geri tuşuna basılırsa o veri buluta geri yazılırdı.
        gecmisiTemizle();
        const state = get();
        const updatedProjects = state.projects.map((p) => {
          if (p.id === projectId) {
            const nextP = { ...p, toolData: { ...p.toolData }, updatedAt: Date.now() };
            const keys = TOOL_KEYS_MAP[toolName] || [];
            keys.forEach(k => nextP.toolData[k] = getInitialValue(toolName, k));
            if (useAuthStore.getState().user) {
              setDoc(doc(db, 'projects', p.id), nextP, { merge: true }).catch((err) => {
                console.error(err);
                toast.error(i18n.t('save_failed', { defaultValue: 'Failed to save to cloud' }), { id: 'save-failed' });
              });
            }
            return nextP;
          }
          return p;
        });

        const isCurrent = state.currentProjectId === projectId;
        const updates: any = { projects: updatedProjects };
        if (isCurrent) {
            const keys = TOOL_KEYS_MAP[toolName] || [];
            keys.forEach(k => updates[k] = getInitialValue(toolName, k));
        }
        set(updates);
      },

    }),
  {
    partialize: gecmiseGirenler,
    equality: (pastState, currentState) => {
      // Her yazmada çalışan ucuz elek: referanslar aynıysa zundo'yu hiç
      // yormuyoruz. Kaydın gerçekten gerekli olup olmadığına işlem bitince
      // gecmis.ts daha dikkatli bakıyor.
      for (const key in pastState) {
        if (pastState[key as keyof typeof pastState] !== currentState[key as keyof typeof currentState]) {
          return false;
        }
      }
      return true;
    },
    limit: 50,
    // Kaydın ne zaman düşeceğine artık zamanlayıcı değil, işlem sınırları
    // karar veriyor (bkz. gecmis.ts). Buradaki tek iş, zundo'nun yazma
    // bildirimini oraya bağlamak.
    handleSet: (handleSet) => {
      gecmisHandleSet = (oncekiDurum) => handleSet(oncekiDurum as unknown as RoadmapState);
      return (oncekiDurum) => yazmayiIsle(oncekiDurum as unknown as Record<string, unknown>);
    },
  }
)
);

gecmisiBagla({
  yaz: (ilkDurum) => gecmisHandleSet?.(ilkDurum),
  durum: () => gecmiseGirenler(useRoadmapStore.getState()) as unknown as Record<string, unknown>,
  temizle: () => useRoadmapStore.temporal.getState().clear(),
});



import { useState, useRef } from 'react';

import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import packageJson from '../../package.json';
import { useTranslation } from 'react-i18next';
import { CATEGORY_ORDER, PROJECT_TOOLS } from '../config/tools';
import NewFolderModal from './NewFolderModal';
import { useDisariTiklama } from '../utils/menuKapatma';

const NAVBAR_THEME: Record<ToolId, { activeBtn: string; iconBg: string }> = {
  wbs: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
  '5whys': { activeBtn: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
  swot: { activeBtn: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  ishikawa: { activeBtn: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400", iconBg: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400" },
  pdca: { activeBtn: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400" },
  waterfall: { activeBtn: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  fta: { activeBtn: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  decision: { activeBtn: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400" },
  flowchart: { activeBtn: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  orgchart: { activeBtn: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400", iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400" },
  pareto: { activeBtn: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  histogram: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
  mindmap: { activeBtn: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" },
  notepad: { activeBtn: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400", iconBg: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/50 dark:text-fuchsia-400" },
  vsm: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
};

export default function Navbar() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const {  activeTool, setActiveTool, projects, createProject, loadProject, currentProjectId  } = useRoadmapStore(useShallow((state) => ({
      activeTool: state.activeTool,
      setActiveTool: state.setActiveTool,
      projects: state.projects,
      createProject: state.createProject,
      loadProject: state.loadProject,
      currentProjectId: state.currentProjectId
    })));
  const menuRef = useRef<HTMLDivElement>(null);

  const [klasorBekleyenArac, setKlasorBekleyenArac] = useState<ToolId | null>(null);

  // Karşılama ekranındaki mantığın aynısı (bkz. WelcomeScreen.handleToolClick):
  // açık klasör varsa ona, yoksa en son dokunulan klasöre gidilir; hiç klasör
  // yoksa adı sorulur. Eskiden ikinci durumda da yeni klasör açılıyordu ve
  // kullanıcı her oturumda bir "Yeni Çalışma" daha biriktiriyordu.
  const handleToolClick = (tool: ToolId) => {
    setIsExpanded(false);

    if (currentProjectId && projects.some(p => p.id === currentProjectId)) {
      setActiveTool(tool);
      return;
    }

    if (projects.length > 0) {
      const sonKlasor = [...projects].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
      loadProject(sonKlasor.id);
      setActiveTool(tool);
      return;
    }

    setKlasorBekleyenArac(tool);
  };

  const klasoruOlustur = (ad: string) => {
    if (!klasorBekleyenArac) return;
    createProject(ad, klasorBekleyenArac);
    setActiveTool(klasorBekleyenArac);
    setKlasorBekleyenArac(null);
  };

  useDisariTiklama(menuRef, () => setIsExpanded(false));



  return (
    <>
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
      <div
        ref={menuRef}
        className={clsx(
          "flex h-full flex-col bg-white dark:bg-slate-900 transition-all duration-300 z-50",
          "max-md:fixed max-md:inset-y-0 max-md:start-0 md:relative",
          isExpanded ? "w-72 max-w-[85vw] border-e border-slate-200 dark:border-slate-800" : "w-0 border-0"
        )}
      >
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        aria-label={t(isExpanded ? 'collapse_sidebar' : 'expand_sidebar', { defaultValue: 'Toggle sidebar' })}
        aria-expanded={isExpanded}
        className={clsx(
          "absolute top-1/2 -translate-y-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 z-10 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95 rtl:rotate-180",
          isExpanded ? "-end-5" : "start-4"
        )}
      >
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div className={clsx("flex h-full flex-col w-72 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 pointer-events-none")}>
      {/* Logo Area */}
      {/* Logo kare kutuda değil, kendi geniş oranında: "klarsti" yazısı
          56 piksellik karede okunmuyordu. Logonun kendi zemini ve yuvarlak
          köşeleri olduğu için etrafına ayrıca çerçeve çizilmiyor. */}
      <div className="flex p-4 items-center justify-center shrink-0">
        <button
          onClick={() => {
            setActiveTool(null);
            setIsExpanded(false);
          }}
          className="shrink-0 rounded-xl transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Klarsti"
        >
          <img
            src={`${import.meta.env.BASE_URL}klarsti-yazi-logo.png`}
            alt="Klarsti"
            width={282}
            height={120}
            className="h-11 w-auto"
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col py-2 px-3 gap-1 overflow-y-auto custom-scrollbar">
        {CATEGORY_ORDER.map((cat, index) => {
          const catTools = PROJECT_TOOLS.filter(t => t.category === cat);
          if (catTools.length === 0) return null;
          
          return (
            <div key={cat} className="contents">
              <div className={`mb-1 px-3 shrink-0 ${index > 0 ? 'mt-4' : 'mt-2'}`}>
                {/* Renkler ölçüldü: eski hali (açıkta slate-400, koyuda
                    slate-500) beyaz zeminde 2,6'ya düşüyordu; okunabilir
                    sayılmak için 4,5 gerekiyor. Açık temalarda slate-600
                    (5,3–7,6), koyu temalarda slate-400 (6,4–7,7). */}
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t(cat)}</h3>
              </div>
              
              {catTools.map(tool => {
                const Icon = tool.icon;
                const theme = NAVBAR_THEME[tool.id];
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={clsx(
                      // text-start şart: tarayıcı düğme içindeki yazıyı
                      // varsayılan olarak ortalar. Türkçede araç adları tek
                      // satıra sığdığı için görünmüyordu, ama İngilizcede
                      // "Work Breakdown Structure" iki satıra taşıyor ve
                      // satırlar ortalanmış duruyordu.
                      "flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-start text-sm font-semibold transition-colors",
                      activeTool === tool.id ? theme.activeBtn : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", theme.iconBg)}>
                      <Icon size={14} />
                    </div>
                    <span>{t(tool.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Version Info */}
      {/* Sürüm numarasının altında bir de "Geliştirme Aşamasında" yazıyordu.
          Aynı mesaj tanıtım sayfasının üst barında zaten var; uygulamanın
          içindeki kullanıcı ürünü kullanmaya çoktan başlamış oluyor ve
          hatırlatmayı ikinci kez okuyordu. */}
      <div className="py-3 text-center opacity-50 flex flex-col items-center shrink-0">
        <span className={clsx("font-bold text-slate-400 dark:text-slate-500", isExpanded ? "text-[10px]" : "text-[8px]")}>
          v{packageJson.version}
        </span>
      </div>
      </div>
    </div>

    <NewFolderModal
      acik={klasorBekleyenArac !== null}
      onKapat={() => setKlasorBekleyenArac(null)}
      onOlustur={klasoruOlustur}
    />
    </>
  );
}

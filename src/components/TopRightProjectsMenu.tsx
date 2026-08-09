import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useUIStore } from '../store/useUIStore';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import ConfirmModal from './ConfirmModal';
import { ajandaDugmesiGorunurMu } from '../utils/ajandaDugmesi';
import { Folder, Plus, Trash2, ChevronDown, ChevronRight, Fish, RefreshCcw, Layers, Pencil, AlertOctagon, Scale, GitMerge, BarChart2, BarChart, Activity, Network, Target, Check, Brain, UsersRound, Link2 } from 'lucide-react';
import type { Project } from '../store/useRoadmapStore';
import { toolTheme } from '../config/toolTheme';
import { aracCalismalari, aracSecimEylemi, calismayiYenidenAdlandir, calismayiSil } from '../config/toolWorks';
import SharePanel from './SharePanel';

const TOOL_OPTIONS: { id: ToolId; icon: typeof Network; label: string; color: string; bg: string }[] = [
  { id: 'mindmap', icon: Brain, label: 'tool_mindmap', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  { id: 'wbs', icon: Network, label: 'tool_wbs', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  { id: 'swot', icon: Target, label: 'tool_swot', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/40' },
  { id: '5whys', icon: Activity, label: 'tool_5whys', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { id: 'ishikawa', icon: Fish, label: 'tool_ishikawa', color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/40' },
  { id: 'pdca', icon: RefreshCcw, label: 'tool_pdca', color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/40' },
  { id: 'waterfall', icon: Layers, label: 'tool_waterfall', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'fta', icon: AlertOctagon, label: 'fta_title', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/40' },
  { id: 'decision', icon: Scale, label: 'decision_title', color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/40' },
  { id: 'flowchart', icon: GitMerge, label: 'tool_flowchart', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  { id: 'orgchart', icon: UsersRound, label: 'org_title', color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/40' },
  { id: 'pareto', icon: BarChart2, label: 'tool_pareto', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'histogram', icon: BarChart, label: 'tool_histogram', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/40' }
  // Ajanda burada yok: projeye ait değil, kişisel. Üst bardaki kendi düğmesinden açılır.
];

/**
 * Tek bir çalışma satırı: adı, adını değiştirme ve silme.
 *
 * Eylemler açık projenin verisi üzerinde çalışıyor. Bu yüzden başka bir
 * projenin çalışmasına dokunulacaksa önce o proje yükleniyor; yoksa eylem
 * yanlış projenin listesinde arar, kimliği bulamaz ve sessizce hiçbir şey
 * yapmaz.
 */
function WorkTreeItem({
  project, tool, calisma, isCurrentProject, onOpen, requestDelete
}: {
  project: Project;
  tool: ToolId;
  calisma: { id: string; ad: string };
  isCurrentProject: boolean;
  onOpen: (calismaId: string) => void;
  requestDelete: (t: string, m: string, cb: () => void) => void;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(calisma.ad);
  const inputRef = useRef<HTMLInputElement>(null);

  const gorunenAd = calisma.ad || t('untitled_work', { defaultValue: 'Untitled' });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  // Ad dışarıdan değişmiş olabilir (başka bir cihaz, geri al). Düzenleme
  // kutusu açık değilken güncel adı yansıtır.
  useEffect(() => {
    if (!isEditing) setEditName(calisma.ad);
  }, [calisma.ad, isEditing]);

  const projeyiHazirla = () => {
    if (!isCurrentProject) useRoadmapStore.getState().loadProject(project.id);
    return useRoadmapStore.getState();
  };

  const adiKaydet = () => {
    const yeni = editName.trim();
    if (yeni && yeni !== calisma.ad) {
      calismayiYenidenAdlandir(projeyiHazirla(), tool, project.id, calisma.id, yeni);
    } else {
      setEditName(calisma.ad);
    }
    setIsEditing(false);
  };

  return (
    <li className="group/work relative flex items-center">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={adiKaydet}
          onKeyDown={(e) => {
            if (e.key === 'Enter') adiKaydet();
            if (e.key === 'Escape') {
              setEditName(calisma.ad);
              setIsEditing(false);
            }
          }}
          aria-label={t('rename_title')}
          className="my-0.5 w-full min-w-0 rounded border border-indigo-300 bg-white px-1.5 py-0.5 text-xs text-slate-800 outline-none dark:border-indigo-500 dark:bg-slate-800 dark:text-slate-100"
        />
      ) : (
        <>
          <button
            onClick={() => onOpen(calisma.id)}
            onDoubleClick={() => setIsEditing(true)}
            className="w-full truncate rounded-lg px-2 py-1 pe-14 text-start text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title={gorunenAd}
          >
            {gorunenAd}
          </button>

          <div className="absolute end-0 flex items-center opacity-0 transition-opacity group-hover/work:opacity-100 focus-within:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-1.5 text-slate-400 transition-colors hover:text-indigo-500"
              title={t('rename_title')}
              aria-label={t('rename_title')}
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                requestDelete(
                  t('delete_work_title', { defaultValue: 'Delete work' }),
                  t('delete_work_msg', { ad: gorunenAd, defaultValue: '"{{ad}}" will be deleted.' }),
                  () => calismayiSil(projeyiHazirla(), tool, project.id, calisma.id)
                );
              }}
              className="p-1.5 text-slate-400 transition-colors hover:text-red-500"
              title={t('delete')}
              aria-label={t('delete')}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </>
      )}
    </li>
  );
}

/**
 * Menünün ikinci katı: bir araç ve içindeki çalışmalar (kırılım ağaçları,
 * zihin haritaları, SWOT analizleri...). Eskiden burada yalnızca bir sayı
 * vardı; "3" yazıyordu ama o üçünün hangileri olduğu menüden görünmüyordu.
 */
function ToolTreeItem({
  project, tool, isCurrentProject, onOpenTool, onClose, requestDelete
}: {
  project: Project;
  tool: { id: ToolId; icon: typeof Network; label: string; color: string };
  isCurrentProject: boolean;
  onOpenTool: (tool: ToolId) => void;
  onClose: () => void;
  requestDelete: (t: string, m: string, cb: () => void) => void;
}) {
  const { t } = useTranslation();
  const clearToolData = useRoadmapStore((s) => s.clearToolData);
  const activeTool = useRoadmapStore((s) => s.activeTool);
  // Açık aracın çalışmaları kendiliğinden görünür; gerisi kapalı başlar,
  // yoksa on üç araçlık bir projede menü uzayıp gidiyor.
  const [isExpanded, setIsExpanded] = useState(isCurrentProject && activeTool === tool.id);

  const calismalar = aracCalismalari(project.toolData, tool.id);
  if (calismalar.length === 0) return null;

  const Icon = tool.icon;

  const calismaAc = (calismaId: string) => {
    const durum = useRoadmapStore.getState();
    if (!isCurrentProject) durum.loadProject(project.id);
    durum.setActiveTool(tool.id);
    // Bazı araçlar bütün çalışmalarını tek sayfada listeliyor; orada seçilecek
    // bir şey yok, aracı açmak yeterli.
    const eylem = aracSecimEylemi(tool.id);
    if (eylem) useRoadmapStore.getState()[eylem](calismaId);
    onClose();
  };

  return (
    <div className="group/tool relative">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? t('collapse_tool', { defaultValue: 'Collapse' }) : t('expand_tool', { defaultValue: 'Expand' })}
          aria-expanded={isExpanded}
          className="shrink-0 p-0.5"
        >
          {isExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
        </button>

        <button
          onClick={() => onOpenTool(tool.id)}
          className="flex flex-1 items-center gap-2 overflow-hidden rounded-lg p-1.5 pe-[52px] text-start text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Icon size={14} className={`shrink-0 ${tool.color}`} />
          <span className="truncate">{t(tool.label)}</span>
        </button>
      </div>

      <div className="absolute end-1 top-[3px] flex items-center gap-1">
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">
          {calismalar.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            requestDelete(t('clear_tool_title'), t('clear_tool_msg'), () => clearToolData(project.id, tool.id));
          }}
          className="p-2 text-slate-400 opacity-40 transition-opacity hover:text-red-500 group-hover/tool:opacity-100"
          title={t('delete')}
          aria-label={t('delete')}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {isExpanded && (
        <ul className="ms-[18px] flex flex-col border-s border-slate-100 ps-2 dark:border-slate-700/60">
          {calismalar.map((calisma) => (
            <WorkTreeItem
              key={calisma.id}
              project={project}
              tool={tool.id}
              calisma={calisma}
              isCurrentProject={isCurrentProject}
              onOpen={calismaAc}
              requestDelete={requestDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectTreeItem({ project, isCurrent, onClose, requestDelete, requestShare }: { project: Project; isCurrent: boolean; onClose: () => void; requestDelete: (t: string, m: string, cb: () => void) => void; requestShare: (projectId: string) => void }) {
  // clearToolData artık ToolTreeItem'ın işi; araç satırı oraya taşındı.
  const {  loadProject, setActiveTool, deleteProject, updateProjectName  } = useRoadmapStore(useShallow((state) => ({
      loadProject: state.loadProject,
      setActiveTool: state.setActiveTool,
      deleteProject: state.deleteProject,
      updateProjectName: state.updateProjectName
    })));
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(isCurrent);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editName.trim() && editName.trim() !== project.name) {
      updateProjectName(project.id, editName.trim());
    } else {
      setEditName(project.name);
    }
    setIsEditing(false);
  };

  const handleToolClick = (tool: ToolId) => {
    if (!isCurrent) {
      loadProject(project.id);
    }
    setActiveTool(tool);
    onClose();
  };

  return (
    <div className="flex flex-col border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-1 mb-1">
      <div className={`group flex items-center justify-between rounded-xl px-2 py-1.5 transition-colors ${isCurrent ? 'bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'}`}>
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? t('collapse_project') : t('expand_project')}
            aria-expanded={isExpanded}
            className="shrink-0 p-0.5"
          >
            {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
          </button>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setEditName(project.name);
                  setIsEditing(false);
                }
              }}
              aria-label={t('project_name')}
              className="flex-1 min-w-0 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500 rounded px-1.5 py-0.5 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none"
            />
          ) : (
            <span 
              className="flex-1 truncate text-start text-sm font-bold cursor-pointer"
              onDoubleClick={() => setIsEditing(true)}
              onClick={() => {
                if (!isCurrent) loadProject(project.id);
              }}
            >
              {project.name}
            </span>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-1 shrink-0 ms-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                 e.stopPropagation();
                 requestShare(project.id);
              }}
              className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors"
              title={t('share')} aria-label={t('share')}
            >
              <Link2 size={14} />
              {/* Paylaşımda olan klasör listeden de belli olsun. */}
              {project.isPublic && (
                <span aria-hidden="true" className="absolute end-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
            <button
              onClick={(e) => {
                 e.stopPropagation();
                 setIsEditing(true);
              }}
              className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
              title={t('rename_title')} aria-label={t('rename_title')}
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 requestDelete(t('delete_project_title'), t('delete_project_msg'), () => deleteProject(project.id));
              }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title={t('delete_project_btn')} aria-label={t('delete_project_btn')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col ps-4 pe-2 space-y-0.5 mt-1">
          {/* Hangi çalışmaların sayılacağına artık toolWorks karar veriyor.
              Burada duran eski kural 5 Neden ve Hata Ağacı için yanlıştı:
              dizi kutuları tutarken kalma "ikiden az ise boş" ölçütü, dizi
              analizleri tutmaya başlayınca da öylece kalmıştı. Sonuç olarak
              tek analizi olan bir proje o araçta boş görünüyordu. */}
          {TOOL_OPTIONS.map((tool) => (
            <ToolTreeItem
              key={tool.id}
              project={project}
              tool={tool}
              isCurrentProject={isCurrent}
              onOpenTool={handleToolClick}
              onClose={onClose}
              requestDelete={requestDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopRightProjectsMenu() {
  const { activeTopMenu, setActiveTopMenu } = useUIStore(useShallow((state) => ({ activeTopMenu: state.activeTopMenu, setActiveTopMenu: state.setActiveTopMenu })));
  const isOpen = activeTopMenu === 'projects';
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  // Paylaşım penceresi menünün dışına (document.body) çiziliyor; menü kapansa
  // da açık kalsın diye tek örnek burada duruyor, satırların içinde değil.
  const [paylasilanProje, setPaylasilanProje] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const requestDelete = (title: string, message: string, onConfirm: () => void) => { setConfirmState({ isOpen: true, title, message, onConfirm }); };
  const {  projects, currentProjectId, createProject, setActiveTool, activeTool  } = useRoadmapStore(useShallow((state) => ({
      projects: state.projects,
      currentProjectId: state.currentProjectId,
      createProject: state.createProject,
      setActiveTool: state.setActiveTool,
      activeTool: state.activeTool
    })));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (useUIStore.getState().activeTopMenu === 'projects') {
          useUIStore.getState().setActiveTopMenu(null);
        }
      }
    }
    const forceClose = () => {
      if (useUIStore.getState().activeTopMenu === 'projects') {
        useUIStore.getState().setActiveTopMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, { capture: true });
    document.addEventListener("close-menus", forceClose);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
      document.removeEventListener("close-menus", forceClose);
    };
  }, []);


  // Ajanda düğmesi göründüğünde hesap düğmesiyle bunun arasına giriyor, o zaman
  // bu düğme bir sıra sola kayar. Araçların içinde Ajanda yok, o sıra da yok;
  // orada eski yerinde kalmalı, yoksa paylaş/dışa aktar kümesiyle çakışıyor.
  const ajandaVar = ajandaDugmesiGorunurMu(activeTool);

  return (
    <div
      ref={menuRef}
      className={clsx(
        "absolute top-4 end-20 z-50 flex flex-col items-end",
        ajandaVar ? "sm:end-40" : "sm:end-24"
      )}
    >
      <button 
        onClick={() => setActiveTopMenu(isOpen ? null : 'projects')}
        className="hidden sm:flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:scale-105 transition-transform text-indigo-500 dark:text-indigo-400 overflow-hidden"
      >
        <Folder size={20} className={isOpen ? 'fill-indigo-500' : ''} />
      </button>

      <div 
        className={`absolute top-14 end-0 w-80 origin-top-right rtl:origin-top-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('my_projects')}</span>
          <button 
            onClick={() => setIsCreating(true)}
            aria-label={t('new_project')}
            className="rounded bg-indigo-50 dark:bg-indigo-900/50 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
          >
             <Plus size={16} />
          </button>
        </div>

        {isCreating && (
          <div className="mb-3 px-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newProjectName.trim()) {
                    if (selectedTool) {
                      createProject(newProjectName.trim(), selectedTool);
                    } else {
                      createProject(newProjectName.trim(), ''); // Empty string forces initialTool to fallback or skip
                      setActiveTool(null); // Force welcome screen
                    }
                    setNewProjectName('');
                    setSelectedTool(null);
                    setIsCreating(false);
                  } else if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewProjectName('');
                    setSelectedTool(null);
                  }
                }}
                aria-label={t('project_name')}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200"
                placeholder={t('project_name')}
              />
            </div>
            
            <div className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('method')}</div>
            <div className="grid grid-cols-4 gap-2 pb-2">
              {TOOL_OPTIONS.map((tool) => {
                const isSelected = selectedTool === tool.id;
                const Icon = tool.icon;
                
                // Parse tailwind color classes to handle dynamic construction safely if needed,
                // but since we provide full classes in the object, we just use them.
                const theme = toolTheme[tool.id] || toolTheme.wbs;
                const borderColor = isSelected ? theme.border : 'border-slate-200 dark:border-slate-700';
                const bgColor = isSelected ? theme.bgSelected : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50';

                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    title={t(tool.label)}
                    className={`relative flex h-10 flex-col items-center justify-center rounded-xl border ${borderColor} ${bgColor} transition-all hover:scale-105 active:scale-95`}
                  >
                    <Icon size={16} className={isSelected ? tool.color : 'text-slate-400 dark:text-slate-500'} />
                    {isSelected && (
                      <div className="absolute -top-1.5 -end-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto px-1 custom-scrollbar">
          {projects.map((p) => (
            <ProjectTreeItem 
              key={p.id} 
              project={p} 
              isCurrent={p.id === currentProjectId}
              onClose={() => setActiveTopMenu(null)}
              requestDelete={requestDelete}
              requestShare={setPaylasilanProje}
            />
          ))}
          {projects.length === 0 && !isCreating && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-sm">
               <Folder size={32} className="mb-2 opacity-50" />
               {t('no_projects_found')}
            </div>
          )}
        </div>
      </div>
      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(p => ({...p, isOpen: false}))} />
      {paylasilanProje && <SharePanel projectId={paylasilanProje} onClose={() => setPaylasilanProje(null)} />}
    </div>
  );
}

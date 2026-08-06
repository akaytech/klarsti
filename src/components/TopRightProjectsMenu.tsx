import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useUIStore } from '../store/useUIStore';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import ConfirmModal from './ConfirmModal';
import { ajandaDugmesiGorunurMu } from '../utils/ajandaDugmesi';
import { Folder, Plus, Trash2, ChevronDown, ChevronRight, Fish, RefreshCcw, Layers, Pencil, AlertOctagon, Scale, GitMerge, BarChart2, BarChart, Activity, Network, Target, Check, Brain, UsersRound } from 'lucide-react';
import type { Project } from '../store/useRoadmapStore';
import { toolTheme } from '../config/toolTheme';

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

function ProjectTreeItem({ project, isCurrent, onClose, requestDelete }: { project: Project; isCurrent: boolean; onClose: () => void; requestDelete: (t: string, m: string, cb: () => void) => void }) {
  const {  loadProject, setActiveTool, deleteProject, updateProjectName, clearToolData  } = useRoadmapStore(useShallow((state) => ({
      loadProject: state.loadProject,
      setActiveTool: state.setActiveTool,
      deleteProject: state.deleteProject,
      updateProjectName: state.updateProjectName,
      clearToolData: state.clearToolData
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
        <div className="flex flex-col ps-6 pe-2 space-y-0.5 mt-1">
          {TOOL_OPTIONS.map((tool) => {
            // Find the array corresponding to this tool in toolData
            let dataArr: any[] = [];
            // Kırılım ağacında da dizi artık kutuları değil ağaçları tutuyor;
            // kökten ibaret ağaç "boş" sayılır (zihin haritasıyla aynı ölçüt).
            if (tool.id === 'wbs') dataArr = (project.toolData?.wbsTrees || []).filter((a: any) => (a?.nodes?.length ?? 0) > 1);
            // 5 Neden ve Hata Ağacı da artık analiz listesi tutuyor; tek kutuluk
            // analiz (problem ya da tepe olay) "boş" sayılır.
            else if (tool.id === '5whys') dataArr = (project.toolData?.fiveWhysAnalyses || []).filter((a: any) => (a?.nodes?.length ?? 0) > 1);
            else if (tool.id === 'flowchart') dataArr = project.toolData?.flowcharts || [];
            else if (tool.id === 'orgchart') dataArr = project.toolData?.orgcharts || [];
            else if (tool.id === 'fta') dataArr = (project.toolData?.ftaAnalyses || []).filter((a: any) => (a?.nodes?.length ?? 0) > 1);
            // Zihin haritasında dizi artık dalları değil haritaları tutuyor.
            // Kökten ibaret harita "boş" sayılıyor, yoksa araç hiç
            // kullanılmasa bile dolu görünürdü.
            else if (tool.id === 'mindmap') dataArr = (project.toolData?.mindmaps || []).filter((h: any) => (h?.nodes?.length ?? 0) > 1);
            else dataArr = project.toolData?.[tool.id] || [];

            // Skip rendering if no data (for 5whys/fta, empty means length <= 1, for others length === 0)
            // Akış şemasında dizi artık kutuları değil şemaları tutuyor: bir
            // şema varsa o araçta veri var demektir.
            const minLength = ['5whys', 'fta'].includes(tool.id) ? 1 : 0;
            if (!dataArr || dataArr.length <= minLength) return null;

            const Icon = tool.icon;
            return (
              <div key={tool.id} className="group/tool relative">
                <button 
                  onClick={() => handleToolClick(tool.id)} 
                  className={`flex w-full items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 hover:${tool.color.replace('text-', 'text-')} hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors pe-[52px]`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={tool.color} />
                    {t(tool.label)}
                  </div>
                </button>
                <div className="absolute end-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {tool.id !== 'wbs' && tool.id !== '5whys' && tool.id !== 'flowchart' && tool.id !== 'fta' && (
                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-500">
                      {dataArr.length}
                    </span>
                  )}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      requestDelete(t('clear_tool_title'), t('clear_tool_msg'), () => clearToolData(project.id, tool.id as any)); 
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 transition-opacity opacity-40 group-hover/tool:opacity-100"
                    title={t('delete')} 
                    aria-label={t('delete')}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}

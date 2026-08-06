import { useEffect } from 'react';
import { CATEGORY_ORDER, PROJECT_TOOLS } from '../config/tools';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { logAppEvent } from '../firebase';
import { toolTheme } from '../config/toolTheme';

export default function WelcomeScreen() {
  const { setActiveTool, projects, createProject, currentProjectId } = useRoadmapStore(useShallow((state) => ({
    setActiveTool: state.setActiveTool,
    projects: state.projects,
    createProject: state.createProject,
    currentProjectId: state.currentProjectId
  })));
  const { t } = useTranslation();

  useEffect(() => {
    logAppEvent('welcome_screen_viewed');
  }, []);

  const handleToolClick = (tool: ToolId) => {
    logAppEvent('tool_selected', { tool });
    if (!currentProjectId || !projects.some(p => p.id === currentProjectId)) {
      createProject(t('new_project'), tool);
    }
    setActiveTool(tool);
  };

  const ToolCard = ({ id, icon: Icon, title, desc, featured = false }: any) => {
    const theme = toolTheme[id] || toolTheme.wbs;
    return (
      <button
        onClick={() => handleToolClick(id)}
        className={`group flex flex-col items-start rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${theme.hoverBorder} text-start ${featured ? 'p-8 md:p-10 shadow-sm' : 'p-6'}`}
      >
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} transition-transform group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0`}>
          <Icon size={28} className={theme.text} />
        </div>
        <h3 className={`font-bold text-slate-800 dark:text-slate-100 ${featured ? 'mb-3 text-2xl' : 'mb-2 text-lg'}`}>{title}</h3>
        <p className={`text-slate-500 dark:text-slate-400 ${featured ? 'text-base' : 'text-sm'}`}>{desc}</p>
      </button>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center bg-slate-50 dark:bg-slate-950 p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-6xl pb-20">
        
        <header className="mb-12 mt-4">
          {/* Sürüm ve geliştirme uyarısı adın hemen yanında: kullanıcının
              ürünle ilk karşılaştığı yer burası, kenar çubuğunun dibinde
              %50 saydamlıkta duran satırı kimse okumuyordu. */}
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-5xl">
              Klarsti
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            {t('ws_subtitle')}
          </p>
        </header>

        {/* Featured / Recommended Tools */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-indigo-500"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('cat_recommended')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['wbs', '5whys', 'flowchart'].map(id => {
              const tool = PROJECT_TOOLS.find(t => t.id === id)!;
              return <ToolCard key={tool.id} id={tool.id} icon={tool.icon} title={t(tool.labelKey)} desc={t(tool.descKey)} featured={true} />;
            })}
          </div>
        </section>

                {/* Categories */}
        <div className="space-y-12">
          {CATEGORY_ORDER.map(cat => {
            const catTools = PROJECT_TOOLS.filter(tool => tool.category === cat);
            if (catTools.length === 0) return null;
            return (
            <section key={cat}>
              <h3 className="mb-6 text-xl font-bold text-slate-700 dark:text-slate-300">{t(cat)}</h3>
              <div className={`grid gap-4 md:grid-cols-2 ${cat === 'cat_process_project' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {catTools.map(tool => (
                  <ToolCard key={tool.id} id={tool.id} icon={tool.icon} title={t(tool.labelKey)} desc={t(tool.descKey)} />
                ))}
              </div>
            </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

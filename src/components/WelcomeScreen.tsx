import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ORDER, PROJECT_TOOLS, TOOLS } from '../config/tools';
import { AMACLAR } from '../config/amaclar';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { logAppEvent } from '../firebase';
import { toolTheme } from '../config/toolTheme';
import { tumCalismalar, calismayiAc, tarihEtiketi } from '../utils/calismaListesi';
import NewFolderModal from './NewFolderModal';

/** "Kaldığın yer" şeridinde kaç çalışma gösterilecek. */
const SON_CALISMA_SAYISI = 4;

export default function WelcomeScreen() {
  const { setActiveTool, projects, createProject, loadProject, currentProjectId, works } = useRoadmapStore(useShallow((state) => ({
    setActiveTool: state.setActiveTool,
    projects: state.projects,
    createProject: state.createProject,
    loadProject: state.loadProject,
    currentProjectId: state.currentProjectId,
    works: state.works
  })));
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // İkinci gün gelen kullanıcı araç aramıyor, dün bıraktığı işi arıyor. Araç
  // listesi hâlâ aşağıda duruyor ama ilk göze çarpan şey artık bu değil.
  const sonCalismalar = useMemo(
    () => tumCalismalar(projects, works).sort((a, b) => b.guncellendi - a.guncellendi),
    [projects, works]
  );
  const araclar = useMemo(() => new Map(TOOLS.map((a) => [a.id, a])), []);

  useEffect(() => {
    logAppEvent('welcome_screen_viewed');
  }, []);

  const [klasorBekleyenArac, setKlasorBekleyenArac] = useState<ToolId | null>(null);

  /**
   * Araç tıklaması. Üç durum var, eskiden ikisi de aynı yere çıkıyordu:
   *
   * `currentProjectId` sayfa her yenilendiğinde null'a düşüyor ve hiçbir yer
   * onu kendiliğinden doldurmuyor. Eski kod "açık klasör yoksa yeni klasör aç"
   * diyordu; sonuç, kullanıcının her oturumda bir tane daha "Yeni Çalışma"
   * biriktirmesiydi. Artık klasörü olan kullanıcıya yenisi açılmıyor, en son
   * dokunduğu klasör açılıyor. Gerçekten klasörü olmayana da adı soruluyor.
   */
  const handleToolClick = (tool: ToolId) => {
    logAppEvent('tool_selected', { tool });

    if (currentProjectId && projects.some((p) => p.id === currentProjectId)) {
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

  // Kategori listelerindeki araç kartı. Eskiden bir de "featured" (büyük)
  // hali vardı; onu kullanan "Önerilen Başlangıç Araçları" bölümü kalkınca
  // ölü kod olarak kalmıştı.
  const ToolCard = ({ id, icon: Icon, title, desc }: any) => {
    const theme = toolTheme[id] || toolTheme.wbs;
    return (
      <button
        onClick={() => handleToolClick(id)}
        className={`group flex flex-col items-start rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${theme.hoverBorder} text-start`}
      >
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} transition-transform group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0`}>
          <Icon size={28} className={theme.text} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
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

        {/* Kaldığın yer. Hiç çalışma yokken hiç çizilmiyor: yeni kullanıcıya
            boş bir kutu göstermek, olmayan bir şeyi eksik gibi hissettiriyor. */}
        {sonCalismalar.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-emerald-500"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('ws_recent_heading')}</h2>
              </div>
              {sonCalismalar.length > SON_CALISMA_SAYISI && (
                <button
                  onClick={() => navigate('/works')}
                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {t('works_see_all')}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sonCalismalar.slice(0, SON_CALISMA_SAYISI).map((calisma) => {
                const arac = araclar.get(calisma.tool);
                const tema = toolTheme[calisma.tool] || toolTheme.wbs;
                const Simge = arac?.icon;
                return (
                  <button
                    key={calisma.anahtar}
                    onClick={() => calismayiAc(calisma)}
                    className="group flex flex-col items-start rounded-3xl border border-slate-200 bg-white p-5 text-start transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tema.bg}`}>
                      {Simge && <Simge size={20} className={tema.text} />}
                    </div>
                    {/* Uzun adlar kesiliyor; tamamı üstüne gelince görünsün. */}
                    <h3 className="mb-1 w-full truncate font-bold text-slate-800 dark:text-slate-100" title={calisma.ad || t('untitled_work')}>
                      {calisma.ad || t('untitled_work')}
                    </h3>
                    <p className="w-full truncate text-sm text-slate-500 dark:text-slate-400" title={calisma.projectName}>
                      {calisma.projectName}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {tarihEtiketi(calisma.guncellendi, i18n.language)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Ne yapmak istiyorsun?
            Buranın eski hali "Önerilen Başlangıç Araçları" idi: üç araç kartı.
            İyi bir fikirdi ama yine araç adı soruyordu; altında zaten bütün
            liste duruyor. Kullanıcı aracın adını değil derdini biliyor. */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-indigo-500"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('ws_intent_heading')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AMACLAR.map((amac) => {
              const arac = araclar.get(amac.arac);
              const tema = toolTheme[amac.arac] || toolTheme.wbs;
              const Simge = arac?.icon;
              return (
                <button
                  key={amac.id}
                  onClick={() => {
                    logAppEvent('intent_selected', { intent: amac.id, tool: amac.arac });
                    handleToolClick(amac.arac);
                  }}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-start transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tema.bg}`}>
                    {Simge && <Simge size={22} className={tema.text} />}
                  </div>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-800 dark:text-slate-100">{t(amac.metinKey)}</span>
                    {/* Araç adı da yazıyor: kullanıcı zamanla adları öğreniyor. */}
                    <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
                      {arac ? t(arac.labelKey) : ''}
                    </span>
                  </span>
                  <ArrowRight size={16} className="ms-auto shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 dark:text-slate-600 rtl:rotate-180" />
                </button>
              );
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

      <NewFolderModal
        acik={klasorBekleyenArac !== null}
        onKapat={() => setKlasorBekleyenArac(null)}
        onOlustur={klasoruOlustur}
      />
    </div>
  );
}

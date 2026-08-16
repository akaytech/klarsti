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

  // Kategori listelerindeki araç kartı.
  //
  // Eskiden büyük bir kutuydu: 56 piksellik simge, başlık ve altında iki
  // satır açıklama. On dört araç böyle dizilince ekran üç ekran boyuna
  // çıkıyor, kullanıcı listenin sonunu görmek için uzun uzun kaydırıyordu.
  // Artık tek satır: simge ve ad. Açıklama silinmedi, üstüne gelince
  // görünüyor; aracın ne işe yaradığını asıl anlatan yer zaten kılavuzu ve
  // "Ne yapmak istiyorsun?" bölümü.
  //
  // Ama telefonda fare yok: üstüne gelince çıkan açıklama dokunmatik ekranda
  // hiç görünmüyordu, kullanıcı yalnız ada bakıp tıklamak zorunda kalıyordu.
  // O yüzden dar ekranda açıklama iki satıra kadar kartın içinde duruyor;
  // geniş ekranda kart yine tek satır.
  const ToolCard = ({ id, icon: Icon, title, desc }: any) => {
    const theme = toolTheme[id] || toolTheme.wbs;
    return (
      <button
        onClick={() => handleToolClick(id)}
        title={desc}
        className={`group flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 ${theme.hoverBorder} text-start`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.bg}`}>
          <Icon size={18} className={theme.text} />
        </div>
        <span className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400 line-clamp-2 md:hidden">
            {desc}
          </span>
        </span>
      </button>
    );
  };

  return (
    // Ekranın tamamı bir bakışta görünsün diye her şey derli toplu: başlık
    // küçüldü, bölüm araları daraldı, araçlar tek satırlık kartlara indi.
    // Eskiden içerik 2400 pikseli aşıyor ve kullanıcı listenin sonunu görmek
    // için kaydırmak zorunda kalıyordu.
    <div className="flex h-full w-full flex-col items-center bg-slate-50 dark:bg-slate-950 p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-6xl pb-4">

        <header className="mb-5 mt-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-3xl">
            Klarsti
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {t('ws_subtitle')}
          </p>
        </header>

        {/* Kaldığın yer. Hiç çalışma yokken hiç çizilmiyor: yeni kullanıcıya
            boş bir kutu göstermek, olmayan bir şeyi eksik gibi hissettiriyor. */}
        {sonCalismalar.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-emerald-500"></div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ws_recent_heading')}</h2>
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

            {/* grid-cols-1: sütun genişliği kendiliğinden hesaplanınca kesilmeyen
                uzun başlık sütunu şişiriyor ve kartlar ekranın sağından taşıyordu. */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {sonCalismalar.slice(0, SON_CALISMA_SAYISI).map((calisma) => {
                const arac = araclar.get(calisma.tool);
                const tema = toolTheme[calisma.tool] || toolTheme.wbs;
                const Simge = arac?.icon;
                return (
                  <button
                    key={calisma.anahtar}
                    onClick={() => calismayiAc(calisma)}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-start transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tema.bg}`}>
                      {Simge && <Simge size={18} className={tema.text} />}
                    </div>
                    {/* Uzun adlar kesiliyor; tamamı üstüne gelince görünsün.
                        Klasör adı ve tarih tek satırda: kart artık yatay. */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100" title={calisma.ad || t('untitled_work')}>
                        {calisma.ad || t('untitled_work')}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400" title={calisma.projectName}>
                        {calisma.projectName} · {tarihEtiketi(calisma.guncellendi, i18n.language)}
                      </span>
                    </span>
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
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-indigo-500"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ws_intent_heading')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
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
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-start transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tema.bg}`}>
                    {Simge && <Simge size={18} className={tema.text} />}
                  </div>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100">{t(amac.metinKey)}</span>
                    {/* Araç adı da yazıyor: kullanıcı zamanla adları öğreniyor. */}
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {arac ? t(arac.labelKey) : ''}
                    </span>
                  </span>
                  <ArrowRight size={16} className="ms-auto shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 dark:text-slate-600 rtl:rotate-180" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Bütün araçlar.
            Eskiden her kategori kendi başlığı ve kendi ızgarasıyla ayrı bir
            bölümdü; beş başlık ve altı sıra, tek başına 500 pikseldi ve ekran
            kaydırmadan bitmiyordu. Artık tek ızgara — araçlar yine kategori
            sırasında diziliyor, yani birbirine yakın olanlar yan yana.
            Kategori başlıkları sol menüde duruyor. */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ws_all_tools')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {CATEGORY_ORDER.flatMap((cat) => PROJECT_TOOLS.filter((tool) => tool.category === cat)).map((tool) => (
              <ToolCard key={tool.id} id={tool.id} icon={tool.icon} title={t(tool.labelKey)} desc={t(tool.descKey)} />
            ))}
          </div>
        </section>
      </div>

      <NewFolderModal
        acik={klasorBekleyenArac !== null}
        onKapat={() => setKlasorBekleyenArac(null)}
        onOlustur={klasoruOlustur}
      />
    </div>
  );
}

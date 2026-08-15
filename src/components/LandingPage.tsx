import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_ORDER, TOOLS } from '../config/tools';
import { toolTheme } from '../config/toolTheme';
import { toolPageAdresi } from '../config/toolPages';
// DİKKAT: `import type` olarak kalmalı. `import { type ToolId }` yazılırsa
// verbatimModuleSyntax nedeniyle yan etkili import olarak derlenir ve tüm
// store'u (Firestore, zundo, bütün slice'lar) tanıtım sayfasına yükler.
import type { ToolId } from '../store/useRoadmapStore';
import { ArrowRight } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import UrunDemosu from './UrunDemosu';
import FiyatVeSorular from './FiyatVeSorular';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const LANDING_BG_DARK: Record<ToolId, string> = {
    '5whys': 'bg-emerald-100 dark:bg-emerald-900/50',
    ishikawa: 'bg-cyan-100 dark:bg-cyan-900/50',
    pareto: 'bg-blue-100 dark:bg-blue-900/50',
    histogram: 'bg-indigo-100 dark:bg-indigo-900/50',
    swot: 'bg-rose-100 dark:bg-rose-900/50',
    decision: 'bg-violet-100 dark:bg-violet-900/50',
    fta: 'bg-rose-100 dark:bg-rose-900/50',
    wbs: 'bg-indigo-100 dark:bg-indigo-900/50',
    pdca: 'bg-teal-100 dark:bg-teal-900/50',
    waterfall: 'bg-blue-100 dark:bg-blue-900/50',
    flowchart: 'bg-amber-100 dark:bg-amber-900/50',
    orgchart: 'bg-sky-100 dark:bg-sky-900/50',
    vsm: 'bg-indigo-100 dark:bg-indigo-900/50',
    mindmap: 'bg-purple-100 dark:bg-purple-900/50',
    notepad: 'bg-fuchsia-100 dark:bg-fuchsia-900/50',
  };

  // Kartlar artık `/register`'a giden düğme değil, aracın kendi sayfasına giden
  // gerçek link. İki nedenle: kullanıcı kayıt olmadan önce aracın ne olduğunu
  // okuyabiliyor, ve arama motoru düğmeleri takip etmezken linkleri takip eder;
  // araç sayfalarının keşfedilmesi bu iç linklere bağlı.
  const kartVerisi = (tool: typeof TOOLS[number]) => {
    const theme = toolTheme[tool.id] || toolTheme.wbs;
    return {
      id: tool.id,
      icon: tool.icon,
      title: t(tool.labelKey),
      desc: t(tool.descKey),
      color: theme.text,
      bg: LANDING_BG_DARK[tool.id] || theme.bg,
      href: toolPageAdresi(tool.id) ?? '/register'
    };
  };

  const categories = CATEGORY_ORDER.map(cat => ({
    title: t(cat),
    gridCols: cat === 'cat_process_project' ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3",
    tools: TOOLS.filter(tool => tool.category === cat).map(kartVerisi)
  }));

  const FEATURED_TOOL_IDS: ToolId[] = ['wbs', '5whys', 'notepad'];
  const featuredTools = FEATURED_TOOL_IDS.map(id => kartVerisi(TOOLS.find(t => t.id === id)!));

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">

      <PublicHeader />

      <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-900 dark:to-slate-900"></div>
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/30 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {/* Burada eskiden "Projelerini buluta kaydetmek için giriş yap."
                yazıyordu (welcome_msg). Sayfanın ilk okunan yeri ürünün ne
                olduğunu söylemeli; o metin giriş ekranında duruyor. */}
            {t('landing_badge', { sayi: TOOLS.length })}
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-8">
            {t('hero_title')}
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-8 py-4 text-lg font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-2xl active:translate-y-0 w-full sm:w-auto justify-center"
            >
              {t('register')} <ArrowRight size={20} />
            </button>
            {/* Kaydolmadan deneme. Ziyaretçi tuvalin nasıl bir şey olduğunu
                e-posta vermeden görüyor; çizdiği, hesap açtığında hesabına
                taşınıyor (bkz. DenemeApp). */}
            <button
              onClick={() => navigate('/dene')}
              className="flex items-center gap-2 rounded-full border-2 border-indigo-500 bg-indigo-50/60 px-8 py-4 text-lg font-bold text-indigo-700 backdrop-blur-md transition-all hover:bg-indigo-100 dark:border-indigo-500/70 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 w-full sm:w-auto justify-center"
            >
              {t('landing_try_free')}
            </button>
            <button
              onClick={() => {
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto justify-center"
            >
              {t('landing_explore_tools')}
            </button>
          </div>

          {/* Eskiden burada bir ofis fotoğrafı vardı: ziyaretçi neye kayıt
              olduğunu göremiyordu. Yerini ürünün kendi görüntüsü aldı. */}
          <UrunDemosu />
        </div>
      </section>

      {/* Featured Tools Strip */}
      <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-8">
            {t('landing_featured_heading')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.href}
                className="group flex items-center gap-4 text-start rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 transition-all hover:shadow-xl hover:-translate-y-1 motion-reduce:hover:translate-y-0"
              >
                <div className={`h-14 w-14 shrink-0 rounded-2xl ${tool.bg} flex items-center justify-center`}>
                  <tool.icon size={28} className={tool.color} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tool.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 relative border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{t('landing_how_it_works_heading')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('landing_how_it_works_subtitle')}
            </p>
          </div>

          <div className="grid gap-12 md:gap-8 md:grid-cols-3 pt-6">
            {[
              // Araç sayısı metne elle yazılmıştı ve her yeni araçta eskiyordu;
              // artık listeden sayılıyor.
              { num: "1", title: t('landing_step1_title'), desc: t('landing_step1_desc', { sayi: TOOLS.length }) },
              { num: "2", title: t('landing_step2_title'), desc: t('landing_step2_desc') },
              { num: "3", title: t('landing_step3_title'), desc: t('landing_step3_desc') }
            ].map((step, idx) => (
              <div key={idx} className="relative p-8 pt-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0 text-center flex flex-col items-center group">
                <div className="absolute -top-8 bg-indigo-100 dark:bg-indigo-900/80 text-indigo-600 dark:text-indigo-400 font-black text-2xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/20 border border-white dark:border-slate-800 transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100 group-hover:rotate-6 motion-reduce:group-hover:rotate-0">
                  {step.num}
                </div>
                <h3 className="mt-4 mb-3 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* "Hâlâ geliştiriliyor" notu. Eskiden sayfanın en tepesinde,
              başlığın hemen altındaydı: ziyaretçi ürünün ne olduğunu
              görmeden önce okuduğu ilk cümle buydu. Artık üç adımı ve
              demoyu gördükten sonra çıkıyor. */}
          <p className="mx-auto mt-20 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
            {t('ws_development_note')}
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section
        id="tools"
        className="py-24 bg-white dark:bg-slate-950 relative border-t border-slate-100 dark:border-slate-900"
        style={{ scrollMarginTop: '6rem' }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{t('landing_tools_heading')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('landing_tools_subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{cat.title}</h3>
                <div className={`grid gap-6 ${cat.gridCols}`}>
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.href}
                      className="group relative flex flex-col items-start text-start rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 transition-all hover:shadow-2xl hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
                    >
                      <div className={`mb-6 h-14 w-14 rounded-2xl ${tool.bg} flex items-center justify-center transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100 group-hover:rotate-3 motion-reduce:group-hover:rotate-0`}>
                        <tool.icon size={28} className={tool.color} />
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{tool.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {tool.desc}
                      </p>
                      <div className="mt-6 pt-6 mt-auto border-t border-slate-200 dark:border-slate-800 w-full">
                        <span className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                          {t('landing_use_now')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiyat ve sık sorulanlar. Yeri bilerek burası: ziyaretçi ürünü,
          kliplerini ve araç listesini gördükten sonra "peki ücretli mi,
          verilerime ne oluyor?" diye soruyor. Kayıt çağrısının hemen üstünde
          cevabını buluyor. */}
      <FiyatVeSorular />

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 12px)' }}
        ></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">{t('landing_cta_heading')}</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-12">
            {t('landing_cta_subtitle')}
          </p>
          <button
            onClick={() => navigate('/register')}
            className="rounded-full bg-white px-10 py-5 text-xl font-black text-indigo-600 shadow-2xl transition-transform hover:scale-105 motion-reduce:hover:scale-100 active:scale-95 motion-reduce:active:scale-100"
          >
            {t('landing_cta_button')}
          </button>
        </div>
      </section>
      </main>

      <PublicFooter />
    </div>
  );
}

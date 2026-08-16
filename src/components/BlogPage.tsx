import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { BLOG_SAYFASI, yaziAdresi } from '../config/blogSayfasi';
import { yayinlananYazilar, type BlogYazisi } from '../store/blogDeposu';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import { blogTarihi } from '../utils/blogTarihi';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Herkese açık blog listesi: klarsti.com/blog
//
// DİKKAT: Giriş gerektirmiyor ama Firestore okuyor, yani bu ekran açıldığında
// veritabanı kodu iniyor. Sorun değil çünkü ekran gecikmeli yükleniyor
// (bkz. App.tsx) — tanıtım sayfasını açan ziyaretçiye inmiyor. Buraya
// `useRoadmapStore` ya da `@xyflow/react` GİRMEMELİ; onlar tuvalin bütün
// yükünü blog okuyan ziyaretçiye de indirirdi.

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [yazilar, setYazilar] = useState<BlogYazisi[] | null>(null);
  const [hata, setHata] = useState(false);

  const baslik = t('blog_title', { defaultValue: 'Blog' });

  useEffect(() => {
    sayfaMetaAyarla({
      title: BLOG_SAYFASI.title,
      description: BLOG_SAYFASI.description,
      canonical: `https://klarsti.com/${BLOG_SAYFASI.slug}`
    });
    return () => sayfaMetaSifirla();
  }, []);

  useEffect(() => {
    let iptal = false;
    yayinlananYazilar()
      .then((liste) => { if (!iptal) setYazilar(liste); })
      .catch(() => { if (!iptal) { setYazilar([]); setHata(true); } });
    return () => { iptal = true; };
  }, []);

  // Build sırasında üretilmiş hazır sayfa (bkz. scripts/staticPages.mjs)
  // uygulamanın önünde duran ayrı bir katman. Yazılar gelince kaldırılıyor;
  // erken kaldırsak sayfa bir an boşalırdı. Araç sayfalarındaki mantığın
  // aynısı (bkz. ToolLandingPage).
  useEffect(() => {
    const kaldir = () => document.getElementById('statik-onizleme')?.remove();
    if (yazilar !== null) kaldir();
    return kaldir;
  }, [yazilar]);

  // Okuyucu kendi dilindeki yazıları görüyor. O dilde hiç yazı yoksa hepsi
  // gösteriliyor: boş bir sayfa, yabancı dilde bir yazıdan daha kötü.
  const gosterilecek = useMemo(() => {
    if (!yazilar) return null;
    const dil = (i18n.language || 'en').split('-')[0];
    const kendiDili = yazilar.filter((y) => y.dil === dil);
    return kendiDili.length > 0 ? kendiDili : yazilar;
  }, [yazilar, i18n.language]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Klarsti</Link>
              <ChevronRight size={15} className="shrink-0 rtl:rotate-180" aria-hidden />
              <span className="text-slate-800 dark:text-slate-200">{baslik}</span>
            </nav>

            <h1 className="mb-4 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {baslik}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t('blog_subtitle', { defaultValue: 'Notes on problem solving, root cause analysis and planning.' })}
            </p>

            <div className="mt-10">
              {gosterilecek === null ? (
                <div className="flex items-center gap-2 py-10 text-slate-500 dark:text-slate-400">
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                  {t('loading', { defaultValue: 'Loading…' })}
                </div>
              ) : gosterilecek.length === 0 ? (
                <p className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 text-slate-600 dark:text-slate-300">
                  {hata
                    ? t('blog_error', { defaultValue: 'The posts could not be loaded right now. Please try again later.' })
                    : t('blog_empty', { defaultValue: 'No posts yet. The first one is on its way.' })}
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {gosterilecek.map((yazi) => (
                    <Link
                      key={yazi.slug}
                      to={yaziAdresi(yazi.slug)}
                      className="group flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 hover:border-indigo-500/30 sm:flex-row sm:items-center"
                    >
                      {yazi.kapak && (
                        <img
                          src={yazi.kapak}
                          alt=""
                          loading="lazy"
                          className="h-32 w-full shrink-0 rounded-2xl object-cover sm:h-24 sm:w-40"
                        />
                      )}
                      <div className="min-w-0">
                        {yazi.yayinTarihi && (
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            {blogTarihi(yazi.yayinTarihi, yazi.dil)}
                          </p>
                        )}
                        <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{yazi.baslik}</h2>
                        {yazi.ozet && (
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                            {yazi.ozet}
                          </p>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {t('blog_read', { defaultValue: 'Read' })}
                          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 rtl:rotate-180" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

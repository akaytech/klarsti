import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Loader2 } from 'lucide-react';
import { BLOG_KOK } from '../config/blogSayfasi';
import { yaziyiGetir, type BlogYazisi } from '../store/blogDeposu';
import { blogMetniCiz } from '../utils/blogMetni';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import { blogTarihi } from '../utils/blogTarihi';

// Tek blog yazısı: klarsti.com/blog/<yazi-adi>
//
// DİKKAT: BlogPage'deki uyarının aynısı geçerli — giriş gerektirmiyor,
// buraya depo ya da tuval kodu girmemeli.

export default function BlogPostPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const [yazi, setYazi] = useState<BlogYazisi | null | 'yok'>(null);

  useEffect(() => {
    let iptal = false;
    setYazi(null);
    yaziyiGetir(slug)
      .then((bulunan) => { if (!iptal) setYazi(bulunan ?? 'yok'); })
      .catch(() => { if (!iptal) setYazi('yok'); });
    return () => { iptal = true; };
  }, [slug]);

  useEffect(() => {
    if (!yazi || yazi === 'yok') return;
    // Sayfa başlığı ve açıklaması yazının kendisinden geliyor. Link önizlemesi
    // üreten tarayıcılar (WhatsApp, LinkedIn) JavaScript çalıştırmadığı için
    // bu yalnızca sekme başlığını ve tarayıcı içi paylaşımı düzeltiyor;
    // önizlemenin doğrusu için build sırasında üretilen HTML gerekiyor.
    sayfaMetaAyarla({
      title: `${yazi.baslik} | Klarsti`,
      description: yazi.ozet,
      canonical: `https://klarsti.com${BLOG_KOK}/${yazi.slug}`
    });
    return () => sayfaMetaSifirla();
  }, [yazi]);

  const govde = useMemo(
    () => (yazi && yazi !== 'yok' ? blogMetniCiz(yazi.govde) : null),
    [yazi]
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <nav aria-label="breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Klarsti</Link>
              <ChevronRight size={15} className="shrink-0 rtl:rotate-180" aria-hidden />
              <Link to={BLOG_KOK} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                {t('blog_title', { defaultValue: 'Blog' })}
              </Link>
            </nav>

            {yazi === null ? (
              <div className="flex items-center gap-2 py-10 text-slate-500 dark:text-slate-400">
                <Loader2 size={18} className="animate-spin" aria-hidden />
                {t('loading', { defaultValue: 'Loading…' })}
              </div>
            ) : yazi === 'yok' ? (
              <>
                <h1 className="mb-4 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t('blog_not_found', { defaultValue: 'This post could not be found.' })}
                </h1>
                <Link to={BLOG_KOK} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('blog_back', { defaultValue: 'Back to all posts' })}
                </Link>
              </>
            ) : (
              <>
                <h1 className="mb-3 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {yazi.baslik}
                </h1>
                {yazi.yayinTarihi && (
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {blogTarihi(yazi.yayinTarihi, yazi.dil)}
                  </p>
                )}
                {yazi.ozet && (
                  <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{yazi.ozet}</p>
                )}
                {yazi.kapak && (
                  <img
                    src={yazi.kapak}
                    alt=""
                    className="mt-8 w-full rounded-3xl border border-slate-200 dark:border-slate-700"
                  />
                )}

                <article className="mt-8 text-base md:text-lg">{govde}</article>

                <div className="mt-14 border-t border-slate-200 dark:border-slate-800 pt-6">
                  <Link to={BLOG_KOK} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    {t('blog_back', { defaultValue: 'Back to all posts' })}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

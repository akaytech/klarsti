import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Mail, Users, Building2, BookOpen } from 'lucide-react';
import { CONTACT_EMAIL } from '../config/iletisim';
import type { AboutPage as AboutPageVerisi } from '../config/aboutPage';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Herkese açık "Hakkımızda" sayfası: klarsti.com/about.
//
// Neden ayrı bir sayfa: sitenin arkasında kimin olduğunu söyleyen hiçbir yer
// yoktu. Verisini bir siteye emanet edecek kullanıcı ile arama motorunun
// güven ölçütlerinin ikisi de bu sayfayı arıyor.
//
// DİKKAT — METİNLER HENÜZ GERÇEK DEĞİL: about_intro, about_story_body,
// about_team_body ve about_company_body şu an dolgu (Lorem Ipsum) metin
// taşıyor. Gerçek bilgi geldiğinde yalnızca dil dosyalarındaki bu dört
// anahtarın değeri değişecek, bu dosyaya dokunmaya gerek yok.
//
// DİKKAT: Giriş gerektirmiyor, yani ilk açılışta inen paketin içinde.
// Buraya `useRoadmapStore` ya da `@xyflow/react` girmemeli.
export default function AboutPage({ sayfa }: { sayfa: AboutPageVerisi }) {
  const { t } = useTranslation();
  const baslik = t(sayfa.titleKey, { defaultValue: 'About' });

  useEffect(() => {
    sayfaMetaAyarla({
      title: sayfa.title,
      description: sayfa.description,
      canonical: `https://klarsti.com/${sayfa.slug}`
    });
    return () => sayfaMetaSifirla();
  }, [sayfa]);

  const bolumBasligi = 'flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white';

  const bolumler = [
    { ikon: BookOpen, baslik: 'about_story_heading', metin: 'about_story_body' },
    { ikon: Users, baslik: 'about_team_heading', metin: 'about_team_body' },
    { ikon: Building2, baslik: 'about_company_heading', metin: 'about_company_body' }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Klarsti
              </Link>
              <ChevronRight size={15} className="shrink-0 rtl:rotate-180" aria-hidden />
              <span className="text-slate-800 dark:text-slate-200">{baslik}</span>
            </nav>

            <h1 className="mb-6 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {baslik}
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t('about_intro')}
            </p>

            {bolumler.map(({ ikon: Ikon, baslik: basAnahtar, metin }) => (
              <section key={basAnahtar} className="mt-10">
                <h2 className={bolumBasligi}>
                  <Ikon size={20} className="text-slate-400" aria-hidden />
                  {t(basAnahtar)}
                </h2>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {t(metin)}
                </p>
              </section>
            ))}

            {/* Sayfanın sonu boşluğa çıkmıyor: hakkımızdayı okuyan kişinin
                bir sonraki adımı çoğu zaman soru sormak oluyor. */}
            <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
              <p className="text-base font-bold text-slate-900 dark:text-white">{t('about_contact_cta')}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                <Mail size={20} className="shrink-0" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <div className="mt-3 text-sm font-medium">
                <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('contact_title', { defaultValue: 'Contact' })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

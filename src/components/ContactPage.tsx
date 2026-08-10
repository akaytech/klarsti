import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Mail, LifeBuoy, ShieldCheck } from 'lucide-react';
import { CONTACT_EMAIL } from '../config/iletisim';
import type { ContactPage as ContactPageVerisi } from '../config/contactPage';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import { SOSYAL_HESAPLAR } from './sosyalHesaplar';

// Herkese açık iletişim sayfası: klarsti.com/contact.
//
// Neden ayrı bir sayfa: destek adresi yalnızca alt bilgideki bir zarf
// simgesinin arkasında ve yasal metinlerin en altında duruyordu. Yardım
// arayan biri ikisini de bulamıyor. Ayrıca "iletişim sayfası yok" bir SaaS
// için güven kıran şeylerden biri.
//
// DİKKAT: Giriş gerektirmiyor, yani ilk açılışta inen paketin içinde.
// Buraya `useRoadmapStore` ya da `@xyflow/react` girmemeli.
export default function ContactPage({ sayfa }: { sayfa: ContactPageVerisi }) {
  const { t } = useTranslation();
  const baslik = t(sayfa.titleKey, { defaultValue: 'Contact' });

  useEffect(() => {
    sayfaMetaAyarla({
      title: sayfa.title,
      description: sayfa.description,
      canonical: `https://klarsti.com/${sayfa.slug}`
    });
    return () => sayfaMetaSifirla();
  }, [sayfa]);

  const bolumBasligi = 'flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white';

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
              {t('contact_intro', { defaultValue: 'Questions, problems, suggestions — they all reach the same inbox, and every message gets an answer.' })}
            </p>

            {/* Adres sayfanın en görünür parçası: yardım arayan biri sayfayı
                okumadan da bulabilmeli. Yazı olarak da duruyor, çünkü
                mailto: bağlantısı çalışmayan (web posta kullanan) kullanıcı
                adresi kopyalayabilmeli. */}
            <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t('contact_email_label', { defaultValue: 'Support address' })}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-flex items-center gap-2 text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                <Mail size={22} className="shrink-0" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {t('contact_response_time', { defaultValue: 'We usually reply within one business day, and at the latest within two.' })}
              </p>
            </div>

            <section className="mt-10">
              <h2 className={bolumBasligi}>
                <LifeBuoy size={20} className="text-slate-400" aria-hidden />
                {t('contact_report_title', { defaultValue: 'Reporting a problem' })}
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {t('contact_report_intro', { defaultValue: 'Including these details gets your problem solved much faster:' })}
              </p>
              <ul className="mt-3 list-disc ps-5 space-y-2 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <li>{t('contact_report_step', { defaultValue: 'What you were trying to do, and the step where it went wrong' })}</li>
                <li>{t('contact_report_tool', { defaultValue: 'Which tool you were using (Fishbone, SWOT, 5 Whys, and so on)' })}</li>
                <li>{t('contact_report_device', { defaultValue: 'Your browser and device' })}</li>
                <li>{t('contact_report_screenshot', { defaultValue: 'A screenshot, if you have one' })}</li>
              </ul>
              <p className="mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t('contact_report_inapp', { defaultValue: 'If you are signed in, use the "Report a problem" button in the account menu instead — it fills in the technical details for you.' })}
              </p>
            </section>

            <section className="mt-10">
              <h2 className={bolumBasligi}>
                <ShieldCheck size={20} className="text-slate-400" aria-hidden />
                {t('contact_data_title', { defaultValue: 'Data requests' })}
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {t('contact_data_text', { defaultValue: 'To access a copy of your data or to have your account and its contents deleted, write to the same address. See the Privacy Policy for details.' })}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
                </Link>
                <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
                </Link>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('contact_social_title', { defaultValue: 'Social media' })}
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {t('contact_social_text', { defaultValue: 'You can follow announcements and new features from these accounts. For support, email is faster.' })}
              </p>
              {/* Alt bilgideki aynı liste (bkz. SocialIcons.tsx). Burada
                  simgelerin yanında adları da yazılı: alt bilgide yer yok,
                  burada var ve simgeden tanınmayan hesaplar okunur oluyor. */}
              <div className="mt-4 flex flex-wrap gap-2">
                {SOSYAL_HESAPLAR.map(({ ad, adres, Ikon }) => (
                  <a
                    key={ad}
                    href={adres}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Ikon size={16} />
                    {ad}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '../content/legalContent';
import {
  InstagramIcon, FacebookIcon, LinkedInIcon, XIcon, TikTokIcon, ThreadsIcon, BlueskyIcon,
} from './SocialIcons';

// Markanın resmi hesapları. Sıra: en çok kullanılandan en aza.
//
// DİKKAT: index.html'deki Organization yapılandırılmış verisinin `sameAs`
// listesiyle aynı kalmalı. Arama motoru hesapların bize ait olduğunu oradan
// anlıyor; biri eklenip diğeri unutulursa bağ kopar.
const SOSYAL_HESAPLAR = [
  { ad: 'Instagram', adres: 'https://www.instagram.com/klarsti.app/', Ikon: InstagramIcon },
  { ad: 'Facebook', adres: 'https://www.facebook.com/klarstiapp', Ikon: FacebookIcon },
  { ad: 'LinkedIn', adres: 'https://www.linkedin.com/company/klarsti/', Ikon: LinkedInIcon },
  { ad: 'X', adres: 'https://x.com/Klarsti', Ikon: XIcon },
  { ad: 'TikTok', adres: 'https://www.tiktok.com/@klarsti', Ikon: TikTokIcon },
  { ad: 'Threads', adres: 'https://www.threads.com/@klarsti.app', Ikon: ThreadsIcon },
  { ad: 'Bluesky', adres: 'https://bsky.app/profile/klarsti.bsky.social', Ikon: BlueskyIcon },
];

// Giriş gerektirmeyen sayfaların ortak alt bilgisi.
//
// Yasal metinler burada artık açılır pencere değil, kendi adreslerine giden
// gerçek link. İki sebeple: Google'ın giriş ekranı onayı bu adresleri
// istiyor, ve arama motoru düğmeleri takip etmezken linkleri takip eder.
export default function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Üst çubuktaki gibi: logo kendi geniş oranında ve marka adı zaten
            içinde yazdığı için yanına ayrıca "Klarsti" yazılmıyor. Gri filtre
            de kaldırıldı, markanın rengini götürüyordu. */}
        <img
          src={`${import.meta.env.BASE_URL}klarsti-yazi-logo.png`}
          alt="Klarsti"
          width={282}
          height={120}
          className="h-8 w-auto shrink-0 opacity-70"
        />

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
          </Link>
          <Link to="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
          </Link>
          <span className="h-4 w-px bg-slate-300 dark:bg-slate-700"></span>
          {/* Yalnızca simge. Adresi yanına yazıyla koymak denendi: 1024 piksel
              genişlikte bu grup tek satırdan üç satıra düşüyor, alt bilgi
              dağılıyor. Adres yasal sayfalarda zaten yazılı duruyor. */}
          <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`E-posta: ${CONTACT_EMAIL}`} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <Mail size={18} />
          </a>
          {/* Hesaplar tek listeden geliyor (bkz. SocialIcons.tsx); yenisi
              eklendiğinde burası kendiliğinden büyüyor. Dar ekranda sekiz
              simge tek satıra sığmıyor, o yüzden sarmalı açık. */}
          {SOSYAL_HESAPLAR.map(({ ad, adres, Ikon }) => (
            <a
              key={ad}
              href={adres}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Klarsti ${ad}`}
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <Ikon size={18} />
            </a>
          ))}
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Klarsti. {t('landing_rights_reserved')}
        </div>
      </div>
    </footer>
  );
}

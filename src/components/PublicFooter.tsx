import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SOSYAL_HESAPLAR } from './sosyalHesaplar';

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

        {/* Yatay boşluk gap-x-4 değil gap-x-3: "İletişim" yazısı eklenince
            grup 1024 pikselde tek satıra 5 piksel sığmıyor ve ikiye
            bölünüyordu. Dokuz boşluğun her birinden 4 piksel almak sığdırmaya
            yetiyor. Buraya yeni bir öğe eklenecekse o genişlikte ölç. */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
          </Link>
          <Link to="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
          </Link>
          {/* Burada eskiden yalnızca bir zarf simgesi vardı ve doğrudan
              mailto: adresine gidiyordu. İki sorunu vardı: simgenin ne
              olduğu belli değildi, ve mailto bir sayfa olmadığı için arama
              motoru "iletişim bilgisi var" diye görmüyordu. Adresi yazıyla
              yazmak da denenmişti, 1024 pikselde alt bilgiyi üç satıra
              düşürüyordu. Kısa bir kelime ve gerçek bir adres ikisini de
              çözüyor; e-posta adresi artık iletişim sayfasının içinde. */}
          <Link to="/contact" className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('contact_title', { defaultValue: 'Contact' })}
          </Link>
          <span className="h-4 w-px bg-slate-300 dark:bg-slate-700"></span>
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

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SOSYAL_HESAPLAR } from './sosyalHesaplar';
import { DESTEKLENEN_DILLER } from '../config/languages';
import { dilOnekiniAyikla, dilliYol } from '../utils/dilYolu';

// Giriş gerektirmeyen sayfaların ortak alt bilgisi.
//
// Yasal metinler burada artık açılır pencere değil, kendi adreslerine giden
// gerçek link. İki sebeple: Google'ın giriş ekranı onayı bu adresleri
// istiyor, ve arama motoru düğmeleri takip etmezken linkleri takip eder.
export default function PublicFooter() {
  const { t, i18n } = useTranslation();
  const konum = useLocation();
  // Adresteki dil öneki çıkarılmış hali: dil satırındaki her link aynı
  // sayfanın o dildeki karşılığına gitmeli, ana sayfaya değil.
  const { yol } = dilOnekiniAyikla(konum.pathname);
  // Alt bilgideki linkler bulunulan dilde kalmalı. Öneksiz yazıldıklarında
  // Türkçe sayfadaki "Blog" İngilizce bloga düşüyordu; hem kullanıcı dilini
  // kaybediyordu hem de dil sürümleri arama motoruna kopuk görünüyordu.
  const dilliAdres = (hedef: string) => dilliYol(i18n.language, hedef);

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
          {/* Blog ve Hakkımızda listenin başında: ikisi de sitenin kendi
              içeriği ve yasal metinlerden önce gelir. Alt bilgi iki satıra
              kırıldığında ilk satırda kalması istenen linkler bunlar. */}
          <Link to={dilliAdres('/blog')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('blog_title', { defaultValue: 'Blog' })}
          </Link>
          <Link to={dilliAdres('/about')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {/* `about_title` DEĞİL: o anahtar uygulama içindeki "Hakkında"
                penceresine ait (bkz. TopRightUserMenu), burası ayrı sayfa. */}
            {t('about_page_title', { defaultValue: 'About' })}
          </Link>
          <Link to={dilliAdres('/terms')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
          </Link>
          <Link to={dilliAdres('/privacy')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
          </Link>
          <Link to={dilliAdres('/cookies')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('cookie_policy_title', { defaultValue: 'Cookie Policy' })}
          </Link>
          {/* Burada eskiden yalnızca bir zarf simgesi vardı ve doğrudan
              mailto: adresine gidiyordu. İki sorunu vardı: simgenin ne
              olduğu belli değildi, ve mailto bir sayfa olmadığı için arama
              motoru "iletişim bilgisi var" diye görmüyordu. Adresi yazıyla
              yazmak da denenmişti, 1024 pikselde alt bilgiyi üç satıra
              düşürüyordu. Kısa bir kelime ve gerçek bir adres ikisini de
              çözüyor; e-posta adresi artık iletişim sayfasının içinde. */}
          <Link to={dilliAdres('/contact')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
            {t('contact_title', { defaultValue: 'Contact' })}
          </Link>
          {/* Ayraç çizgisi kaldırıldı: yazılarla simgeleri ayırmak için
              duruyordu, ama grup iki satıra kırıldığında birinci satırın
              sonunda tek başına asılı kalıyor ve kazara konmuş gibi
              görünüyordu. Ayrımı zaten satır kırılması yapıyor. */}
          {/* Hesaplar tek listeden geliyor (bkz. sosyalHesaplar.ts); yenisi
              eklendiğinde burası kendiliğinden büyüyor.
              Simgeler kendi kutusunda: sayfa listesi büyüdükçe (koşullar,
              gizlilik, çerez, iletişim) grup 1024 pikselde tek satıra
              sığmıyor. Simgeler tek tek sarmalanınca dördü üstte kalıp üçü
              alta düşüyordu ve bozuk duruyordu. Tek kutu olunca kırılma
              hep aynı yerden oluyor: yazılar bir satır, simgeler bir satır. */}
          {/* Simgeler 18 piksel ama dokunma alanı 40: parmakla 18 piksellik
              bir hedefe basmak telefonda kumar oynamak demek. */}
          <div className="flex flex-wrap items-center justify-center gap-1">
          {SOSYAL_HESAPLAR.map(({ ad, adres, Ikon }) => (
            <a
              key={ad}
              href={adres}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Klarsti ${ad}`}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <Ikon size={18} />
            </a>
          ))}
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Klarsti. {t('landing_rights_reserved')}
        </div>
      </div>

      {/* Dil sürümlerine giden GERÇEK linkler.
          Üst çubuktaki dil seçici bir düğme, arama motoru düğmeye basamıyor;
          bu satır konmadan önce sitede /tr, /de ... adreslerine giden tek bir
          link yoktu. Search Console "klarsti.com/tr: URL Google tarafından
          bilinmiyor, yönlendiren sayfa algılanmadı" diyordu ve 11 dilin
          hiçbiri dizinde değildi. Site haritası tek başına yetmiyor.

          onClick da şart: adres değişince i18n dili kendiliğinden değişmiyor
          (yol algılayıcı yalnızca ilk açılışta çalışıyor, bkz. i18n.ts).
          Tarayıcı linki takip ediyor, dili bu satır ayarlıyor.

          hrefLang, hangi linkin hangi dile gittiğini arama motoruna ayrıca
          söylüyor; lang ise metnin kendi dilini (Türkçe, 日本語) belirtiyor,
          ekran okuyucu doğru telaffuz etsin diye. */}
      <nav
        aria-label={t('language_selector')}
        className="container mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-slate-200 px-6 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
      >
        {DESTEKLENEN_DILLER.map(({ code, nativeName }) => (
          <Link
            key={code}
            to={dilliYol(code, yol)}
            hrefLang={code}
            lang={code}
            onClick={() => i18n.changeLanguage(code)}
            aria-current={code === i18n.language ? 'page' : undefined}
            className={
              code === i18n.language
                ? 'font-bold text-slate-700 dark:text-slate-200'
                : 'hover:text-slate-700 hover:underline dark:hover:text-slate-300 transition-colors'
            }
          >
            {nativeName}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

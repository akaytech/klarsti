import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Palette, Languages, Check } from 'lucide-react';
import packageJson from '../../package.json';
import { useAuthStore } from '../store/useAuthStore';
import ThemeOptionList from './ThemeOptionList';

// Giriş gerektirmeyen sayfaların (tanıtım sayfası, araç sayfaları) ortak üst
// çubuğu. Eskiden LandingPage'in içine gömülüydü; araç sayfaları eklenince
// kopyalanması gerekiyordu, bu yüzden ayrıldı.
//
// DİKKAT: Buraya `useRoadmapStore` girmemeli. useAuthStore ayrı ve hafif
// olduğu için sorun değil; giriş yapmış kullanıcıya "uygulamaya git" demek
// için oturum durumu gerekiyor.

const SUPPORTED_LANGUAGES = [
  { code: 'tr', nativeName: 'Türkçe' },
  { code: 'en', nativeName: 'English' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'es', nativeName: 'Español' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'ar', nativeName: 'العربية' },
  { code: 'zh', nativeName: '中文' },
];

export default function PublicHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLanguagePicker(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(target)) {
        setShowThemePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    return () => document.removeEventListener('mousedown', handleClickOutside, { capture: true });
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLanguagePicker(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <img src={`${import.meta.env.BASE_URL}logo-192.png`} alt="Klarsti Logo" className="h-10 w-10 rounded-xl shadow-sm" />
          <span className="hidden sm:inline text-2xl font-black tracking-tight">Klarsti</span>
          <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-700/60 dark:bg-amber-500/10 dark:text-amber-300 ms-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            {t('in_development')}
            <span className="text-amber-400 dark:text-amber-600/80" aria-hidden>·</span>
            <span className="tabular-nums">v{packageJson.version}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">

          <div className="flex items-center gap-0.5 sm:gap-2 me-2">
            {/* Theme Picker */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => { setShowThemePicker(!showThemePicker); setShowLanguagePicker(false); }}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={t('theme_selector', { defaultValue: 'Theme' })}
              >
                <Palette size={20} />
              </button>

              <div
                className={`absolute end-0 top-12 w-52 origin-top-right rtl:origin-top-left rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 ease-out ${showThemePicker ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <ThemeOptionList onPick={() => setShowThemePicker(false)} />
              </div>
            </div>

            {/* Language Picker */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => { setShowLanguagePicker(!showLanguagePicker); setShowThemePicker(false); }}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={t('language_selector', { defaultValue: 'Language' })}
              >
                <Languages size={20} />
              </button>

              <div
                className={`absolute end-0 top-12 w-48 origin-top-right rtl:origin-top-left rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 ease-out ${showLanguagePicker ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                  {SUPPORTED_LANGUAGES.map(({ code, nativeName }) => {
                    const isActive = i18n.language === code;
                    return (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{nativeName}</span>
                        {isActive && <Check size={16} className="text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* Araç sayfaları giriş yapmış kullanıcıya da açık; onlara tekrar
              "kayıt ol" demek anlamsız, doğrudan uygulamaya götürüyoruz.
              Oturum çözülene kadar hiçbiri çizilmiyor: aksi halde giriş yapmış
              kullanıcı bir an "giriş yap / kayıt ol" görüp sonra değişiyordu. */}
          {isAuthLoading ? (
            <div className="h-10 w-28" aria-hidden />
          ) : user ? (
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-indigo-600 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 active:translate-y-0"
            >
              {t('tool_page_open_app')}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 sm:px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-full bg-indigo-600 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 active:translate-y-0"
              >
                {t('register')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

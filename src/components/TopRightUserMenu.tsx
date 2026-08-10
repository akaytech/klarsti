import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseCore';
import { toast } from 'sonner';
import { LogOut, Palette, User, Shield, FileText, Languages, ChevronLeft, Check, Loader2, LifeBuoy, Trash2 } from 'lucide-react';
import { flushPendingSaves } from './SyncManager';
import { destekPostasiBaglantisi } from '../utils/destekPostasi';
import LegalModal from './LegalModal';
import DeleteAccountModal from './DeleteAccountModal';
import ThemeOptionList from './ThemeOptionList';
import { useTheme } from '../theme';
import { useDisariTiklama } from '../utils/menuKapatma';
import { DESTEKLENEN_DILLER } from '../config/languages';

export default function TopRightUserMenu() {
  const { t, i18n } = useTranslation();
  const { resetState } = useRoadmapStore(useShallow((state) => ({ resetState: state.resetState })));
  const user = useAuthStore((state) => state.user);

  const [cikisYapiliyor, setCikisYapiliyor] = useState(false);

  const logout = async () => {
    if (cikisYapiliyor) return;
    setCikisYapiliyor(true);
    try {
      // Bekleyen yazmalar oturum kapanmadan gönderilmeli: signOut'tan sonra
      // istekler kimliksiz gidiyor ve kurallar hepsini reddediyor. Yani son bir
      // saniyelik düzenlemeler sessizce kayboluyordu.
      const flushSonucu = await flushPendingSaves();
      // 'failed' durumunda safeWrite zaten uyarı gösterdi, üstüne bindirmeyelim.
      if (flushSonucu === 'timeout') {
        toast.warning(t('logout_unsaved_warning', { defaultValue: 'Some changes could not be saved before signing out.' }));
      }
      await signOut(auth);
    } catch (err) {
      console.error('signOut error:', err);
      useAuthStore.getState().logout();
    } finally {
      resetState();
      setCikisYapiliyor(false);
    }
  };
  const { activeTopMenu, setActiveTopMenu } = useUIStore(useShallow((state) => ({ activeTopMenu: state.activeTopMenu, setActiveTopMenu: state.setActiveTopMenu })));
  const isOpen = activeTopMenu === 'user';
  const activeTheme = useTheme();
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);
  const [hesapSilmeAcik, setHesapSilmeAcik] = useState(false);
  const [subMenu, setSubMenu] = useState<'language' | 'theme' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useDisariTiklama(menuRef, () => {
    if (useUIStore.getState().activeTopMenu === 'user') {
      useUIStore.getState().setActiveTopMenu(null);
    }
    setSubMenu(null);
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSubMenu(null);
  };

  // Konusu ve teknik bilgileri hazır bir e-posta açar (bkz. destekPostasi.ts).
  // Adres tıklama anında üretiliyor, menü çizildiğinde değil: hangi sayfada
  // olduğu bilgisi ancak o an doğru.
  const sorunBildir = () => {
    window.location.href = destekPostasiBaglantisi(
      {
        konu: t('report_problem_subject', { defaultValue: 'Klarsti — problem report' }),
        giris: t('report_problem_intro', { defaultValue: 'Please describe the problem here:' }),
        teknikBaslik: t('report_problem_tech', { defaultValue: '--- Technical details (please keep) ---' }),
      },
      { dil: i18n.language, kullaniciId: user?.uid, eposta: user?.email }
    );
    setActiveTopMenu(null);
  };

  if (!user) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-4 end-4 sm:end-8 z-[100]"
    >
      <button 
        onClick={(e) => {
           e.stopPropagation();
           setActiveTopMenu(isOpen ? null : 'user');
           if (isOpen) {
             setSubMenu(null);
           }
        }}
        className="hidden sm:flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:scale-105 transition-transform text-indigo-500 dark:text-indigo-400 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.name || 'User'} className="h-full w-full rounded-full object-cover" />
        ) : (
          <User size={20} className="text-slate-600 dark:text-slate-300" />
        )}
      </button>

      <div 
        className={`absolute end-0 top-12 w-64 origin-top-right rtl:origin-top-left rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {subMenu === null ? (
          <>
            <div className="mb-2 px-3 py-2 border-b border-slate-100 dark:border-slate-700">
              <p className="truncate font-bold text-slate-800 dark:text-slate-100">{user.name || t('user')}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>

            <button
              onClick={() => setSubMenu('theme')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Palette size={18} />
              <span className="flex-1 text-start">{t('theme_selector', { defaultValue: 'Theme' })}</span>
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ background: `linear-gradient(135deg, ${activeTheme.swatch[0]} 0 50%, ${activeTheme.swatch[1]} 50% 100%)` }}
              />
            </button>

            <button
              onClick={() => setSubMenu('language')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Languages size={18} />
              {t('change_language_settings', { defaultValue: 'Change Language Settings' })}
            </button>

            <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

            <button
              onClick={sorunBildir}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <LifeBuoy size={18} />
              {t('report_problem', { defaultValue: 'Report a problem' })}
            </button>

            <div className="mb-2">
              <button
                onClick={() => setLegalType('terms')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FileText size={18} />
                {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
              </button>
              <button
                onClick={() => setLegalType('privacy')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Shield size={18} />
                {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
              </button>
            </div>

            <button
              onClick={logout}
              disabled={cikisYapiliyor}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {cikisYapiliyor ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              {t('logout', { defaultValue: 'Logout' })}
            </button>

            {/* Hesap silme en altta ve ayrı: çıkışın hemen yanında dursa,
                menüde aşağı doğru giden birinin yanlış satıra basma
                ihtimali var ve bu satırın bedeli geri alınamıyor. Kalın
                değil, çünkü sık kullanılacak bir şey değil; ama gizli de
                değil, çünkü kanunen ulaşılabilir olması gerekiyor. */}
            <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700" />
            <button
              onClick={() => {
                setActiveTopMenu(null);
                setHesapSilmeAcik(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={18} />
              {t('delete_account_title', { defaultValue: 'Delete account' })}
            </button>
          </>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-3 py-2 border-b border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setSubMenu(null)}
                aria-label={t('back', { defaultValue: 'Back' })}
                className="p-2 -ms-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <ChevronLeft size={18} className="rtl:rotate-180" />
              </button>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {subMenu === 'theme'
                  ? t('theme_selector', { defaultValue: 'Theme' })
                  : t('language_selector', { defaultValue: 'Language' })}
              </span>
            </div>

            {subMenu === 'theme' ? (
              <ThemeOptionList />
            ) : (
            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto px-1">
              {DESTEKLENEN_DILLER.map(({ code, nativeName }) => {
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
            )}
          </div>
        )}
      </div>

      <LegalModal
        isOpen={legalType !== null}
        onClose={() => setLegalType(null)}
        type={legalType || 'privacy'}
      />

      <DeleteAccountModal
        isOpen={hesapSilmeAcik}
        onClose={() => setHesapSilmeAcik(false)}
      />
    </div>
  );
}

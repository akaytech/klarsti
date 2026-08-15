import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';
import { useTheme } from './theme';
import { toolPageBul } from './config/toolPages';
import { legalPageBul } from './config/legalPages';
import { contactPageBul } from './config/contactPage';
// Çerez şeridi gecikmeli DEĞİL: her sayfada, giriş yapılmamışken de
// görünmesi gerekiyor ve içinde ağır hiçbir şey yok (bkz. CookieConsent).
import CookieConsent from './components/CookieConsent';
import { gecikmeliEkran } from './utils/surumTazeleme';

const AuthenticatedApp = gecikmeliEkran(() => import('./AuthenticatedApp'));
const LandingPage = gecikmeliEkran(() => import('./components/LandingPage'));
const VerifyEmailPage = gecikmeliEkran(() => import('./components/VerifyEmailPage'));
const ToolLandingPage = gecikmeliEkran(() => import('./components/ToolLandingPage'));
const LegalPage = gecikmeliEkran(() => import('./components/LegalPage'));
const ContactPage = gecikmeliEkran(() => import('./components/ContactPage'));
// Yönetim ekranı gecikmeli ve AuthenticatedApp'in DIŞINDA: oradaki adres
// eşitleme mantığı tanımadığı her yolu '/' ile eziyor, /admin açılır açılmaz
// ana ekrana atılırdı. Ayrıca o ekran projelerin ağır deposunu kuruyor;
// yönetim ekranının hiçbirine ihtiyacı yok.
const AdminPage = gecikmeliEkran(() => import('./components/AdminPage'));
// Giriş ekranı da gecikmeli: tek statik import olarak duruyordu ve Firebase
// Auth'u (60 KB) siteyi ilk kez açan herkesin ilk yüklemesine sokuyordu.
// Zaten Suspense içinde çiziliyordu, gecikmeli olması bir şey değiştirmiyor.
const AuthPage = gecikmeliEkran(() => import('./components/AuthPage'));

// Tanıtım kliplerinin çekim ekranı. Yalnızca geliştirme kipinde var: koşul
// derleme sırasında `false`a düştüğü için bu satır ve arkasındaki bütün demo
// kodu yayın paketine hiç girmiyor.
const DemoStudio = import.meta.env.DEV ? gecikmeliEkran(() => import('./demo/DemoStudio')) : null;

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const user = useAuthStore(state => state.user);
  const isAuthLoading = useAuthStore(state => state.isAuthLoading);
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // Araç tanıtım sayfaları (klarsti.com/wbs, /swot ...) herkese açık: oturum
  // kapısının önünde çözülüyor. Giriş yapmış kullanıcı da görebiliyor, yoksa
  // tanıtım sayfasındaki ya da arama sonucundaki link onun için çalışmazdı.
  // Oturumun çözülmesi de beklenmiyor; sayfanın içeriği oturuma bağlı değil.
  const aracSayfasi = toolPageBul(location.pathname);
  // Yasal sayfalar da (gizlilik, kullanım koşulları) oturumdan bağımsız:
  // Google'ın giriş ekranı onayı ve uygulama mağazaları bu adresleri giriş
  // yapmadan açıp okuyabilmeli.
  const yasalSayfa = legalPageBul(location.pathname);
  // İletişim sayfası da aynı sebeple oturumdan bağımsız: yardım arayan
  // kullanıcının çoğu zaman sorunu zaten giriş yapamamak oluyor.
  const iletisimSayfasi = contactPageBul(location.pathname);

  const theme = useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      <Toaster position="bottom-center" theme={theme.isDark ? 'dark' : 'light'} richColors />
      <CookieConsent />

      {DemoStudio && location.pathname.startsWith('/demo-cekim/') ? (
        <Suspense fallback={<LoadingScreen />}>
          <DemoStudio ad={location.pathname.replace('/demo-cekim/', '')} />
        </Suspense>
      ) : aracSayfasi ? (
        <Suspense fallback={<LoadingScreen />}>
          <ToolLandingPage sayfa={aracSayfasi} />
        </Suspense>
      ) : yasalSayfa ? (
        <Suspense fallback={<LoadingScreen />}>
          <LegalPage sayfa={yasalSayfa} />
        </Suspense>
      ) : iletisimSayfasi ? (
        <Suspense fallback={<LoadingScreen />}>
          <ContactPage sayfa={iletisimSayfasi} />
        </Suspense>
      ) : isAuthLoading ? (
        <LoadingScreen />
      ) : !user ? (
        isAuthRoute ? (
          <Suspense fallback={<LoadingScreen />}>
            <AuthPage mode={location.pathname === '/register' ? 'register' : 'login'} />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <LandingPage />
          </Suspense>
        )
      ) : !user.emailVerified ? (
        <Suspense fallback={<LoadingScreen />}>
          <VerifyEmailPage />
        </Suspense>
      ) : location.pathname === '/admin' ? (
        <Suspense fallback={<LoadingScreen />}>
          <AdminPage />
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <AuthenticatedApp />
        </Suspense>
      )}
    </div>
  );
}

export default App;

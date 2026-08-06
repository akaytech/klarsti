import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';
import { useTheme } from './theme';
import { toolPageBul } from './config/toolPages';
import AuthPage from './components/AuthPage';

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const VerifyEmailPage = React.lazy(() => import('./components/VerifyEmailPage'));
const ToolLandingPage = React.lazy(() => import('./components/ToolLandingPage'));

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

  const theme = useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      <Toaster position="bottom-center" theme={theme.isDark ? 'dark' : 'light'} richColors />

      {aracSayfasi ? (
        <Suspense fallback={<LoadingScreen />}>
          <ToolLandingPage sayfa={aracSayfasi} />
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
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <AuthenticatedApp />
        </Suspense>
      )}
    </div>
  );
}

export default App;

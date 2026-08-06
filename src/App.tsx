import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';
import { useTheme } from './theme';
import AuthPage from './components/AuthPage';

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const VerifyEmailPage = React.lazy(() => import('./components/VerifyEmailPage'));

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
  
  const theme = useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      <Toaster position="bottom-center" theme={theme.isDark ? 'dark' : 'light'} richColors />
      
      {isAuthLoading ? (
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

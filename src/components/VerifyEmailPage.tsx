import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebaseCore';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!auth.currentUser || isResending || cooldown > 0) return;
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success(t('verify_email_resend_success', { defaultValue: 'Verification email resent' }));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      console.error('resend verification error:', err);
      toast.error(t('auth_error_generic', { defaultValue: 'An error occurred' }));
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerified = async () => {
    if (!auth.currentUser || isChecking) return;
    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        login(
          auth.currentUser.uid,
          auth.currentUser.email || '',
          auth.currentUser.displayName || user?.name || '',
          true,
          auth.currentUser.photoURL || undefined
        );
      } else {
        toast.error(t('verify_email_not_verified_yet', { defaultValue: 'Not verified yet' }));
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('signOut error:', err);
      useAuthStore.getState().logout();
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <Mail size={32} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{t('verify_email_title')}</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {t('verify_email_desc', { email: user?.email })}
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={handleCheckVerified}
          disabled={isChecking}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-100 px-4 py-3 font-bold text-white dark:text-slate-900 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {isChecking && <Loader2 size={18} className="animate-spin" />}
          {t('verify_email_continue')}
        </button>
        <button
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          {isResending && <Loader2 size={18} className="animate-spin" />}
          {cooldown > 0 ? t('verify_email_resend_cooldown', { seconds: cooldown }) : t('verify_email_resend')}
        </button>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <LogOut size={16} />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

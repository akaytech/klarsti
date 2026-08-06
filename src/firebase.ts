import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebaseCore';

// Site anahtari gizli degil, tasarim geregi derlenmis dosyayla tarayiciya
// iniyor. Gizli olan es anahtar sadece Firebase konsolunda duruyor.
const RECAPTCHA_SITE_KEY = '6LfHxngtAAAAAMX0_4Wf73QyxStX8P3wByu8Ujbj';

if (typeof window !== 'undefined') {
  // Localhost'ta reCAPTCHA calismaz. Bu bayrak SDK'ya konsola bir hata ayiklama
  // token'i bastiriyor; o token Firebase Console -> App Check -> Apps -> web
  // uygulamasi -> Manage debug tokens altina eklenmeli, yoksa zorlama acildigi
  // an `npm run dev` calismaz olur.
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export const db = getFirestore(app);

export let analytics: Analytics | null = null;

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(console.error);

export const logAppEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch {
      console.warn("Analytics blocked or failed");
    }
  }
};

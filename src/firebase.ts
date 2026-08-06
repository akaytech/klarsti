import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { app } from './firebaseCore';

// App Check, klarsti projesine gecerken kaldirildi: eski projenin reCAPTCHA
// anahtari burada duruyordu ve yenisi henuz kurulmadi. Zorlama (enforcement)
// zaten kapali oldugu icin bugun bir koruma kaybi yok; backend'i su an
// firestore.rules koruyor.
// GERI KONULACAK: odeme altyapisi devreye girmeden once. Gerekenler:
//   1. google.com/recaptcha/admin uzerinden reCAPTCHA v3 site anahtari
//   2. Firebase Console -> App Check -> web uygulamasini kaydet
//   3. initializeAppCheck cagrisi + localhost icin FIREBASE_APPCHECK_DEBUG_TOKEN
//   4. Enforcement'i Firestore icin ac

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

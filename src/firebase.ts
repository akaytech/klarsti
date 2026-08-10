import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebaseCore';
import { olcumlemeyeIzinVar } from './config/cerezIzni';

// Site anahtari gizli degil, tasarim geregi derlenmis dosyayla tarayiciya
// iniyor. Gizli olan es anahtar sadece Firebase konsolunda duruyor.
const RECAPTCHA_SITE_KEY = '6LfHxngtAAAAAMX0_4Wf73QyxStX8P3wByu8Ujbj';

if (typeof window !== 'undefined') {
  // Gelistirme sunucusunda reCAPTCHA calismaz. Bu bayrak SDK'ya konsola bir
  // hata ayiklama token'i bastiriyor; o token Firebase Console -> App Check ->
  // Apps -> web uygulamasi -> Manage debug tokens altina eklenmeli, yoksa
  // zorlama acildigi an `npm run dev` calismaz olur.
  //
  // DIKKAT: Kosul adrese BAKMAMALI. Eskiden `hostname === 'localhost'` diye
  // sorulyordu; Capacitor'la paketlenen Android uygulamasi kendini telefonun
  // icinde https://localhost adresinden yayinladigi icin YAYINDAKI mobil
  // uygulama da bu dala giriyordu. Iki sonucu vardi: (1) App Check hata
  // ayiklama token'i uretmek icin crypto.randomUUID cagiriyor, eski Android
  // WebView'lerinde bu fonksiyon yok ve giris ekrani coküyordu (Sentry,
  // 1 Agustos 2026); (2) daha onemlisi, yayindaki mobil uygulama bot
  // korumasini devre disi halde calistiriyordu. import.meta.env.DEV derleme
  // aninda sabitlenir: uretim paketinde bu blok hic yer almaz.
  if (import.meta.env.DEV) {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export const db = getFirestore(app);

export let analytics: Analytics | null = null;

// Ölçümleme yalnızca kullanıcı izin verdiyse başlar.
//
// Eskiden koşulsuz başlıyordu: getAnalytics çağrısı Google'ın ölçüm betiğini
// sayfaya sokuyor ve ziyaretçiyi izin sorulmadan ölçmeye başlıyordu. Arayüzü
// Almanca, Fransızca ve İtalyanca da olan bir uygulama için bu, kullanıcının
// haklarını görmezden gelmek demekti.
//
// Karar bağımsız bir dosyada tutuluyor (bkz. config/cerezIzni.ts); şerit
// buradan hiçbir şey import etmiyor, yoksa tanıtım sayfasının paketine
// Firestore girerdi.
export function olcumlemeyiBaslat() {
  if (analytics || !olcumlemeyeIzinVar()) return;
  isSupported().then((supported) => {
    if (supported && olcumlemeyeIzinVar()) {
      analytics = getAnalytics(app);
    }
  }).catch(console.error);
}

olcumlemeyiBaslat();

export const logAppEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch {
      console.warn("Analytics blocked or failed");
    }
  }
};

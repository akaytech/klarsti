import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { useAuthStore } from './store/useAuthStore';
import { toast } from 'sonner';
import i18n from './i18n';
// authDomain, uygulamanın servis edildiği alan adıyla aynı tutuluyor:
// signInWithRedirect boylece ayni kokende kaliyor ve tarayicilarin ucuncu
// taraf cerez engeline takilmiyor. Degistirilirse Google Cloud Console'daki
// OAuth istemcisine .../__/auth/handler adresi de eklenmeli.
const firebaseConfig = {
  apiKey: "AIzaSyDamSYvxhu0lvbDG_wLkGofMDC9K3V0m-k",
  authDomain: "klarsti.com",
  projectId: "klarsti",
  storageBucket: "klarsti.firebasestorage.app",
  messagingSenderId: "662559981702",
  appId: "1:662559981702:web:0db99d0b063e82803fd107",
  measurementId: "G-ZM3ETNKKXC"
};

export const app = initializeApp(firebaseConfig);
/**
 * Auth, getAuth() yerine initializeAuth() ile kuruluyor.
 *
 * Tek fark: getAuth, "popupRedirectResolver" adinda bir bileseni de
 * kendiliginden takiyor. O bilesen, Google ile giris olaylarini dinlemek icin
 * sayfaya gizli bir cerceve aciyor ve /__/auth/iframe.js (93 KB) ile Google'in
 * gapi betigini (35 KB) indiriyor. Bunu giris yapilsin yapilmasin, HER
 * sayfada yapiyordu.
 *
 * PageSpeed /dene sayfasinda o tek dosyayi uc ayri bulguda gosteriyordu:
 * kodunun %62'si hic calismiyor, onbellek suresi sifir (her ziyarette bastan
 * iniyor) ve en uzun bagimlilik zincirinin basi o. Hesap acmadan denemeye
 * gelen ziyaretci icin tamamen bosunaydi.
 *
 * Artik bilesen ihtiyac duyan uc cagriya ELDEN veriliyor:
 * signInWithRedirect (AuthPage), getRedirectResult (asagida) ve
 * reauthenticateWithPopup (hesapSilme). Yani cerceve yalnizca gercekten
 * Google ile giris/dogrulama yapilirken aciliyor.
 *
 * persistence listesi getAuth'un kendi varsayilaninin AYNISI. Buradaki sira
 * degistirilirse veya biri cikarilirsa acik oturumlar kaybolur; liste bilerek
 * birebir kopyalandi.
 */
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
});

// Firebase'in gönderdiği e-postaların dili (doğrulama, şifre sıfırlama,
// e-posta değişikliği).
//
// Ayarlanmazsa hepsi İngilizce gidiyordu. Arayüzü 11 dilde olan bir
// uygulamada, Türkçe kullanan birinin kayıt olduktan sonra aldığı tek mesajın
// İngilizce olması hem kötü duruyor hem de mailin ne olduğunu anlamayan
// kullanıcı doğrulamayı hiç yapmıyor.
//
// Metinleri biz yazmıyoruz; Firebase'in kendi çevirileri kullanılıyor. Bu
// yüzden desteklenmeyen bir dil gelirse Firebase kendiliğinden İngilizce'ye
// düşüyor, ayrıca bir kontrol gerekmiyor.
const postaDiliniAyarla = () => {
  auth.languageCode = i18n.language || 'en';
};
postaDiliniAyarla();
// Kullanıcı dili sonradan değiştirirse bir sonraki mail yeni dilde gitmeli.
i18n.on('languageChanged', postaDiliniAyarla);

const YONLENDIRME_ANAHTARI = 'klarsti-google-yonlendirme';

/**
 * "Bu sekmeden Google'la giris baslatildi" isareti.
 *
 * signInWithRedirect sayfayi Google'a gonderiyor; donuste sonucu okuyabilmek
 * icin getRedirectResult cagrilmali. Ama o cagri 128 KB'lik bir yuk getiriyor
 * (bkz. initAuthListener), o yuzden yalnizca gercekten yola cikmis sekmede
 * yapiliyor. Isareti AuthPage yola cikmadan hemen once biraikiyor.
 */
export function yonlendirmeyiIsaretle() {
  try {
    sessionStorage.setItem(YONLENDIRME_ANAHTARI, '1');
  } catch {
    // Depolama kapaliysa isaret birakilamiyor. Sorun degil: okuma tarafi da
    // ayni durumda "belki vardir" deyip eski davranisa donuyor.
  }
}

/** Isaret varsa true doner ve isareti siler. Depolama kapaliysa true. */
function yonlendirmeBekleniyorMu(): boolean {
  try {
    if (sessionStorage.getItem(YONLENDIRME_ANAHTARI) === null) return false;
    sessionStorage.removeItem(YONLENDIRME_ANAHTARI);
    return true;
  } catch {
    // Emin olamiyoruz. Girisi bozmaktansa fazladan dosya indirmek yeglenir.
    return true;
  }
}

// Firebase Auth'u tek gerçek kaynak (source of truth) yapar.
// localStorage'daki 'user' yalnızca ilk paint için optimistik önbellektir;
// otorite her zaman Firebase oturumudur. Token yenileme veya sunucu tarafı
// oturum iptali otomatik olarak store'a yansır.
let authListenerStarted = false;
export const initAuthListener = () => {
  if (authListenerStarted) return;
  authListenerStarted = true;

  // getRedirectResult YALNIZCA Google'la giris baslatilmis bir sekmede
  // cagriliyor.
  //
  // Neden: bu cagri Firebase Auth'un yonlendirme cozucusunu ayaga kaldiriyor
  // ve o da sayfaya /__/auth/iframe.js (93 KB) ile Google'in gapi betigini
  // (35 KB) indiriyor. PageSpeed /dene sayfasinda bu dosyayi UC ayri bulguda
  // birden gosteriyordu: kodunun %62'si hic calismiyor, onbellek suresi sifir
  // (her ziyarette yeniden iniyor) ve en uzun bagimlilik zincirinin basi o.
  // Hesap acmadan denemek icin gelen ziyaretcide bir kere bile
  // kullanilmiyordu.
  //
  // Yonlendirme baslatan tek yer AuthPage; orasi yola cikmadan once
  // sessionStorage'a isaret birakiyor (bkz. yonlendirmeyiIsaretle).
  // sessionStorage sekmeye ozel ve gidip donerken duruyor, yani donuste
  // isaret yerinde oluyor.
  //
  // Zaten giris yapmis kullanici etkilenmiyor: oturumu okuyan
  // onAuthStateChanged asagida ve o bu dosyalara ihtiyac duymuyor.
  if (yonlendirmeBekleniyorMu()) {
    // Cozucu burada elden veriliyor (bkz. yukaridaki initializeAuth notu) ve
    // gecikmeli import ediliyor: boylece cerceve kodu firebaseCore parcasina
    // girmiyor, yalnizca gercekten yonlendirmeden donen sekmede iniyor.
    import('firebase/auth')
      .then(({ getRedirectResult, browserPopupRedirectResolver }) =>
        getRedirectResult(auth, browserPopupRedirectResolver))
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
        toast.error(i18n.t('auth_error_generic', { defaultValue: 'An error occurred during authentication' }), { id: 'redirect-auth-error' });
      });
  }

  onAuthStateChanged(auth, (firebaseUser) => {
    const { login, logout, user: cachedUser, setAuthLoading } = useAuthStore.getState();
    if (firebaseUser) {
      login(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || cachedUser?.name || '',
        firebaseUser.emailVerified,
        firebaseUser.photoURL || undefined
      );
    } else {
      logout();
    }
    setAuthLoading(false);
  });
};

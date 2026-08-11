import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
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
export const auth = getAuth(app);

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

// Firebase Auth'u tek gerçek kaynak (source of truth) yapar.
// localStorage'daki 'user' yalnızca ilk paint için optimistik önbellektir;
// otorite her zaman Firebase oturumudur. Token yenileme veya sunucu tarafı
// oturum iptali otomatik olarak store'a yansır.
let authListenerStarted = false;
export const initAuthListener = () => {
  if (authListenerStarted) return;
  authListenerStarted = true;

  getRedirectResult(auth).catch((err) => {
    console.error('Redirect sign-in error:', err);
    toast.error(i18n.t('auth_error_generic', { defaultValue: 'An error occurred during authentication' }), { id: 'redirect-auth-error' });
  });

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

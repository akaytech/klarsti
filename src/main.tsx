import { StrictMode, Suspense, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { surumTazelemeyiBaslat, tazelemeBekleniyorMu } from './utils/surumTazeleme'
import { eskiHashAdresiniCevir } from './utils/eskiHashAdresi'
import { useAuthStore } from './store/useAuthStore'
import packageJson from '../package.json'

// HashRouter döneminden kalan `#/...` linklerini gerçek yola çevirir.
// Router mount olmadan önce çalışmalı, bu yüzden en başta.
eskiHashAdresiniCevir();

// Yeni deploy sonrası eski sürümde kalmış sekmeleri kurtarır. Render'dan
// önce kurulmalı: ilk gecikmeli parça yüklemesi hemen sonra başlıyor.
surumTazelemeyiBaslat();

/**
 * Firebase oturumunu store ile senkronlayan tek listener. Gerçek oturum
 * durumu buradan doğrulanır; token yenileme veya sunucu tarafı oturum iptali
 * otomatik olarak arayüze yansır.
 *
 * Neden koşullu: Firebase Auth ilk yüklemenin en ağır ikinci parçası (60 KB
 * sıkıştırılmış, indirilenin yaklaşık üçte biri). Siteyi ilk kez açan, hiç
 * üye olmamış birinin bunu indirmesi için tek sebep "acaba giriş yapmış mı?"
 * sorusuydu. Cevabı zaten elimizde: useAuthStore oturumu localStorage'a
 * yazıyor (bkz. persist), iz yoksa bu tarayıcıda hiç giriş yapılmamış demek.
 *
 * Giriş/kayıt sayfaları koşulun dışında: Google ile girişte sayfa
 * yönlendirmeden geri döner ve sonucu getRedirectResult okur. Onu geciktirmek
 * girişi bozardı.
 */
const oturumIziVar = useAuthStore.getState().user !== null;
const authRotasi = /\/(login|register)\/?$/.test(location.pathname);
const authBaslat = () => import('./firebaseCore').then((m) => m.initAuthListener());

if (oturumIziVar || authRotasi) {
  authBaslat();
} else {
  // Tanıtım sayfası Firebase'i hiç beklemeden çiziliyor.
  useAuthStore.getState().setAuthLoading(false);
  // Yine de arkadan yükleniyor: localStorage'ı temizlemiş ama oturumu duran
  // bir kullanıcı bir an "girmemiş" görünür, sonra kendiliğinden düzelir.
  //
  // Once `load` bekleniyor, SONRA bosa dusuluyor. Tek basina
  // requestIdleCallback yetmiyordu: tarayici boslugu cok erken buluyor ve
  // Google'in giris cercevesi (gapi + auth/iframe.js, toplam 128 KB) sayfa
  // daha cizilmeden inmeye basliyordu. Olcumde /dene sayfasinda 238. ms'de
  // basliyordu; sayfanin ilk boyasi 503. ms'de. Yani hesabi olmayan bir
  // ziyaretci, kullanmayacagi 128 KB'in hatti bosaltmasini bekliyordu.
  //
  // Gecikmenin bedeli degismedi: bu yol zaten "oturum izi YOK" durumu, yani
  // beklenen sonuc "giris yapilmamis". Geciken tek sey, localStorage'ini
  // temizlemis kullanicinin kendiliginden geri taninmasi.
  let baslatildi = false;
  const bosaDusunce = () => {
    if (baslatildi) return;
    baslatildi = true;
    if ('requestIdleCallback' in window) {
      (window as Window & typeof globalThis).requestIdleCallback(() => authBaslat(), { timeout: 4000 });
    } else {
      setTimeout(authBaslat, 2000);
    }
  };
  if (document.readyState === 'complete') {
    bosaDusunce();
  } else {
    window.addEventListener('load', bosaDusunce, { once: true });
    // Emniyet kemeri: bir kaynak asili kalirsa `load` hic gelmeyebilir.
    // O durumda da oturum sonsuza kadar kontrolsuz kalmasin.
    setTimeout(bosaDusunce, 8000);
  }
}

/**
 * Kendi bilgisayarımızdaki geliştirme sunucusu. Buradan çıkan hatalar arıza
 * değil, kod yazarken geçilen yarım anlar: parça henüz sayfaya bağlanmamış,
 * isim daha tanımlanmamış. Bir sonraki kayıtta kendiliğinden geçiyorlar ve
 * zaten konsolda gözümüzün önündeler. Sentry'ye gönderildiklerinde tek
 * yaptıkları, gerçek kullanıcının yaşadığı hatanın yanında yer kaplamak.
 */
const kendiBilgisayarimMi = () => {
  const adres = location.hostname;
  return adres === 'localhost' || adres === '127.0.0.1';
};

/**
 * Hatanın hangi adresten geldiği. Aynı kod üç yerde birden yayında:
 * klarsti.com asıl site, klarsti.web.app ve klarsti.firebaseapp.com ise
 * Firebase'in silinemeyen sistem adresleri (bkz. index.html'deki canonical).
 * Hepsi tek Sentry projesine yazıyor ve ayırt edilemiyorlardı; artık gerçek
 * kullanıcının yaşadığı hata ile önizlemedeki denememiz karışmıyor.
 */
const sentryOrtami = () => {
  const adres = location.hostname;
  if (adres === 'klarsti.com' || adres === 'www.klarsti.com') return 'production';
  // klarsti.web.app, klarsti.firebaseapp.com ve PR önizleme adresleri.
  // (localhost buraya hiç gelmiyor, yukarıda eleniyor.)
  return 'preview';
};

// Asenkron Sentry başlatma (Ana render'ı bloke etmemesi için gecikmeli)
setTimeout(() => {
  if (kendiBilgisayarimMi()) return;
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: "https://0942b4d0d1d1208b089ff3528ea7f024@o4511775904366592.ingest.de.sentry.io/4511775925862480",
      // Hatanın hangi sürümde çıktığı. Bir düzeltmenin işe yarayıp
      // yaramadığını ancak bununla takip edebiliyoruz: sürüm etiketi yokken
      // Sentry'de "bu hata hâlâ oluyor mu" sorusunun cevabı yoktu.
      // package.json'daki numarayla aynı kalmalı; ileride hata satırlarını
      // okunur kılmak için harita dosyası yüklersek eşleşme buradan kurulur.
      release: packageJson.version,
      environment: sentryOrtami(),
      // Oturum kaydı (replayIntegration) bilerek yok: hatadan önceki saniyeleri
      // geri oynatabilmek için ekranda olan biten her değişikliği kesintisiz
      // bellekte tutuyordu. Tarayıcıda sürekli çalışan en büyük yüktü ve
      // karşılığında aldığımız şey, kodu okuyarak da bulabildiğimiz bir bilgi.
      // Hata bildirimi ve iz sürme aynen duruyor.
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
      // Yeni sürüm yayınlandığında, açık kalmış sekmenin aradığı parça
      // sunucuda olmuyor ve sayfa kendini tazeliyor (bkz. surumTazeleme.ts).
      // O aralıkta çıkan hatalar gerçek arıza değil, tazelemenin gölgesi;
      // gönderilirlerse asıl hataların arasında gürültü yapıyorlar.
      beforeSend: (olay) => (tazelemeBekleniyorMu() ? null : olay),
    });
  }).catch(console.error);
}, 2000);

const YuklemeEkrani = (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

class ErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) {
    // Sayfa tazelenmek üzereyse hata gerçek değil, tazelemenin gölgesi.
    if (tazelemeBekleniyorMu()) return;
    // Geliştirme sunucusunda Sentry hiç başlatılmıyor; paketi buradan da
    // indirtmenin anlamı yok, hata konsolda zaten duruyor.
    if (kendiBilgisayarimMi()) return;
    import('@sentry/react').then(Sentry => Sentry.captureException(error, { contexts: { react: { componentStack: info?.componentStack } } })).catch(console.error);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    // Aynı sebeple: kullanıcıya "bir şeyler ters gitti" demek yerine, sayfa
    // yenilenene kadar normal yükleme göstergesi kalsın.
    return tazelemeBekleniyorMu() ? YuklemeEkrani : this.props.fallback;
  }
}

// Kök bir kez kuruluyor ve pencerede saklanıyor. Geliştirmede bu dosya bazen
// iki kez çalışıyor (Vite sıcak güncellemeyi uyguladığında main.tsx `?t=` ekli
// ikinci bir adresten yeniden yükleniyor); kök saklanmasa aynı kaba iki React
// ağacı birden kuruluyor ve sayfa "bir şeyler ters gitti" ekranına düşüyordu.
// Yayında koşul hiç işlemiyor, kök zaten tek sefer kuruluyor.
type KokTasiyan = typeof globalThis & { __klarstiKok?: ReturnType<typeof createRoot> };
const kokKap = globalThis as KokTasiyan;
kokKap.__klarstiKok ??= createRoot(document.getElementById('root')!);

kokKap.__klarstiKok.render(
  <StrictMode>
    <ErrorBoundary fallback={<div className="flex items-center justify-center min-h-screen p-4 text-center"><h1>Bir şeyler ters gitti. Ekibimiz bilgilendirildi, lütfen sayfayı yenile.</h1></div>}>
      <Suspense fallback={YuklemeEkrani}>
        {/* basename şart: canlıda base "/" ama dev ve GitHub Pages derlemesinde
            "/klarsti/". HashRouter'da bu fark görünmüyordu çünkü hash yolu
            base'den bağımsızdı; BrowserRouter yolu doğrudan okuduğu için
            basename verilmezse dev ortamında hiçbir rota eşleşmez. */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)

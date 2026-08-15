// Deploy sonrasi eski surumde kalmis sekmeler icin emniyet kemeri.
//
// Sorun: her derlemede parca adlarina yeni bir icerik hash'i giriyor
// (MindmapCanvas-DNqaOrpa.js gibi). Kullanicinin sekmesi acik kalmissa,
// o sekme eski adlari hafizasinda tutmaya devam ediyor. Yeni deploy'dan
// sonra o adres sunucuda yok; Firebase Hosting bulamadigi her adrese
// index.html donduruyor ve tarayici "JS bekliyordum, HTML geldi" diyerek
// gec yuklenen ekrani hic acamiyor. Service worker'daki skipWaiting bunu
// cozmuyor: sorun onbellekte degil, sayfanin bellegindeki eski modul
// haritasinda.
//
// Vite bu durumda `vite:preloadError` firlatiyor. Sayfayi bir kez
// tazelemek dogru dosya adlarini getiriyor.
//
// Ama o olay her seferinde gelmiyor. Firebase Hosting kayip dosyaya 404
// degil, 200 ile index.html donduruyor; on yukleme istegi basarili sayildigi
// icin Vite hicbir sey firlatmiyor. Hata bir adim sonra, modulun kendisi
// calistirilmaya calisilirken "Failed to fetch dynamically imported module"
// diye geliyor ve dogruca React.lazy'nin sozunu reddediyor. Bu yuzden ikinci
// bir agimiz var: `gecikmeliEkran`, her gec yuklenen ekrani sarmalayip ayni
// tazelemeyi oradan tetikliyor.

import { lazy, type ComponentType } from 'react';

/**
 * Tazeleme kararı verildi mi?
 *
 * `location.reload()` anında olmuyor; sayfa bir an daha yaşıyor. O aralıkta
 * React beklediği ekranı boş buluyor ("Cannot read properties of undefined
 * (reading 'default')") ve kullanıcıya hata ekranı çıkıyor — hemen ardından
 * sayfa zaten yenilenecekken. Aşağıdaki olay iptali de buna katkıda bulunuyor:
 * Vite hatayı fırlatmayınca `import()` reddedilmek yerine undefined ile
 * çözülüyor, React.lazy de onun `.default`ını okumaya çalışıyor.
 *
 * Bu bayrak açıkken hem hata ekranı çizilmiyor hem de Sentry'ye kayıt
 * gitmiyor: ortada gerçek bir arıza yok, sayfa kendini toparlıyor.
 */
let tazelemeYolda = false;

/** Sayfa yenilenmek üzere mi? (bkz. main.tsx: hata sınırı ve Sentry) */
export const tazelemeBekleniyorMu = () => tazelemeYolda;

const SON_TAZELEME_ANAHTARI = 'klarsti-surum-tazeleme';
// Tazeleme sorunu cozmediyse (parca gercekten kayipsa) sonsuz donguye
// girmeyelim: yakin zamanda denediysek bir daha denemiyoruz.
const DONGU_ESIGI_MS = 10_000;
// Uzun sure acik kalan sekmeler yeni surumu kendiliginden gorsun.
const GUNCELLEME_ARALIGI_MS = 60 * 60 * 1000;

/**
 * Sayfayi bir kez tazeler. Tazeleme yapildiysa true doner.
 *
 * Cagri iki yerden geliyor (Vite'in olayi ve gec yuklenen ekranin hatasi);
 * dongu esigi ikisi icin ortak, yoksa biri digerinin ardindan tekrar
 * yenilerdi.
 */
function tazelemeyiDene(): boolean {
  // Cevrimdisiyken tazelemenin kayip parcayi getirme ihtimali yok; kullaniciyi
  // acik sayfasindan etmenin anlami kalmiyor, hata ekrani daha durust.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;

  const son = Number(sessionStorage.getItem(SON_TAZELEME_ANAHTARI) || 0);
  if (Date.now() - son < DONGU_ESIGI_MS) return false;

  sessionStorage.setItem(SON_TAZELEME_ANAHTARI, String(Date.now()));
  tazelemeYolda = true;
  window.location.reload();
  return true;
}

/** Hata, inmeyen bir parcadan mi kaynaklaniyor? */
function parcaHatasiMi(hata: unknown): boolean {
  const mesaj = String((hata as { message?: string })?.message ?? hata ?? '');
  return /dynamically imported module|Importing a module script failed|module script failed|Failed to fetch/i.test(mesaj);
}

/**
 * Gec yuklenen ekranlar icin `React.lazy` sarmalayicisi.
 *
 * Parca inmezse sayfayi bir kez tazeliyor. Tazeleme yoldayken React'e hicbir
 * zaman cozulmeyen bir soz veriliyor: ekranda hata degil, normal yukleme
 * gostergesi kaliyor ve kullanici arizayi hic gormeden yeni surume geciyor.
 */
export function gecikmeliEkran<T extends ComponentType<any>>(
  yukleyici: () => Promise<{ default: T }>
) {
  return lazy(() =>
    yukleyici().catch((hata) => {
      if (parcaHatasiMi(hata) && tazelemeyiDene()) {
        return new Promise<{ default: T }>(() => { /* sayfa tazeleniyor */ });
      }
      throw hata;
    })
  );
}

export function surumTazelemeyiBaslat() {
  if (typeof window === 'undefined') return;

  window.addEventListener('vite:preloadError', (olay) => {
    // Olay iptal edilebilir; engellemezsek Vite hatayi ayrica firlatiyor.
    if (tazelemeyiDene()) olay.preventDefault();
  });

  if ('serviceWorker' in navigator) {
    setInterval(() => {
      navigator.serviceWorker.getRegistration()
        .then((kayit) => kayit?.update())
        .catch(() => { /* guncelleme denemesi basarisizsa sessizce gec */ });
    }, GUNCELLEME_ARALIGI_MS);
  }
}

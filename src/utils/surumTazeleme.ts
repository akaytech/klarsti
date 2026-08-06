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

const SON_TAZELEME_ANAHTARI = 'klarsti-surum-tazeleme';
// Tazeleme sorunu cozmediyse (parca gercekten kayipsa) sonsuz donguye
// girmeyelim: yakin zamanda denediysek bir daha denemiyoruz.
const DONGU_ESIGI_MS = 10_000;
// Uzun sure acik kalan sekmeler yeni surumu kendiliginden gorsun.
const GUNCELLEME_ARALIGI_MS = 60 * 60 * 1000;

export function surumTazelemeyiBaslat() {
  if (typeof window === 'undefined') return;

  window.addEventListener('vite:preloadError', (olay) => {
    const son = Number(sessionStorage.getItem(SON_TAZELEME_ANAHTARI) || 0);
    if (Date.now() - son < DONGU_ESIGI_MS) return;

    sessionStorage.setItem(SON_TAZELEME_ANAHTARI, String(Date.now()));
    // Olay iptal edilebilir; engellemezsek Vite hatayi ayrica firlatiyor.
    olay.preventDefault();
    window.location.reload();
  });

  if ('serviceWorker' in navigator) {
    setInterval(() => {
      navigator.serviceWorker.getRegistration()
        .then((kayit) => kayit?.update())
        .catch(() => { /* guncelleme denemesi basarisizsa sessizce gec */ });
    }, GUNCELLEME_ARALIGI_MS);
  }
}

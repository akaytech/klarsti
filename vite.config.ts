import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { readFileSync } from 'node:fs'

// Sürüm fs ile okunuyor, import ile değil: bu dosya NodeNext modülü olarak
// derleniyor ve orada JSON import'u ek bir söz dizimi istiyor.
const surum: string = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
).version

// Anahtar yalnızca GitHub Actions'ta var (SENTRY_AUTH_TOKEN secret'ı). Yerelde
// yoksa eklenti hiç devreye girmiyor: `npm run build` anahtar istemeden,
// harita üretmeden eskisi gibi çalışsın.
const sentryAnahtari = process.env.SENTRY_AUTH_TOKEN

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Sekme ikonu klarsti-ikon-32.png. Eskiden yanında bir de favicon.svg
      // duruyordu; içeriği Vite şablonundan kalma mor bir şimşekti, hiçbir
      // yerden çağrılmıyordu, silindi.
      includeAssets: ['klarsti-ikon-32.png'],
      // Manifest ikonları varsayılan olarak precache'e ekleniyordu. İkonu
      // tarayıcı zaten ihtiyaç duyduğunda kendisi indirir; önden indirmek
      // her ilk ziyarete boşuna yük bindiriyordu.
      includeManifestIcons: false,
      workbox: {
        // Sayfa açılışlarını servis çalışanı artık önbellekten karşılamıyor;
        // aşağıdaki "klarsti-sayfa" kuralı internetten alıp önbelleği yedek
        // olarak kullanıyor. Bu yüzden hazır index.html yönlendirmesi kapalı:
        // açık kalsaydı o kural önce denenir ve yeni sürüm görünmezdi (kurallar
        // yazılış sırasına göre deneniyor, yönlendirme hepsinden önce geliyor).
        navigateFallback: null as unknown as undefined,
        // Servis çalışanının harita dosyası hiç üretilmesin. Bu dosyalar
        // Sentry eklentisinin temizliğinden sonra yazıldığı için silinemiyor
        // ve yayına çıkıyorlardı. İçerikleri workbox'ın kendi kodu, bizim
        // kaynağımız değil; Sentry'nin de onlara ihtiyacı yok.
        sourcemap: false,
        // Önden SADECE uygulama kabuğu indirilir (html, css, manifest, favicon).
        // JS varsayılan globPatterns'te olduğu için eskiden her ziyaretçi
        // açmadığı 13 aracın, konuşmadığı 9 dilin ve Sentry'nin kodunu da
        // indiriyordu; bu, kod bölmenin kazandırdığını geri veriyordu.
        globPatterns: ['**/*.{css,html,webmanifest}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Sayfa açılışları (yeni sekme, yenileme, adres çubuğu) önce
            // internetten alınıyor. Eskiden servis çalışanı elindeki index.html
            // kopyasını anında veriyordu: yeni sürüm yayınlansa bile kullanıcı
            // sekmeyi yeniden açtığında eski uygulamayı görüyor, ancak
            // Ctrl+Shift+R ile kurtuluyordu.
            //
            // İki saniye içinde cevap gelmezse önbellekteki kopya veriliyor:
            // internetsizken ya da çok yavaş bağlantıda site yine anında
            // açılıyor. Bu kural aşağıdakilerden önce yazılı; servis çalışanı
            // kuralları yazılış sırasına göre deniyor.
            // /__/ altı Firebase'in kendi sayfaları (Google ile giriş buradan
            // dönüyor); onlar hiç önbelleğe girmemeli, eskiden de yönlendirme
            // dışında tutuluyorlardı.
            urlPattern: ({ request, url }: { request: Request; url: URL }) =>
              request.mode === 'navigate' && !url.pathname.startsWith('/__/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'klarsti-sayfa',
              networkTimeoutSeconds: 2,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Bütün JS parçalarının adında içerik hash'i var: aynı isim her
            // zaman aynı içerik demek. Bu yüzden CacheFirst güvenli; parça
            // değişince adı da değişir ve yeniden indirilir.
            urlPattern: /\/assets\/[^/]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'klarsti-js',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\.(?:png|webp|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'klarsti-images',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: 'Klarsti',
        short_name: 'Klarsti',
        description: 'Problem Çözüm Teknikleri Uygulaması',
        // Telefonda uygulama olarak açıldığında üst şeridin rengi. Marka
        // pembesi; beyazken uygulama markasız görünüyordu.
        theme_color: '#c70f4d',
        // Açılış ekranının zemini beyaz kalıyor: logo pembe olduğu için
        // pembe zeminde kaybolurdu.
        background_color: '#ffffff',
        display: 'standalone',
        // Her iki girdi de 1024x1024'lük logo.png'yi gösteriyordu; yani beyan
        // edilen ölçüler (192/512) dosyanın gerçek ölçüsüyle uyuşmuyordu.
        // Artık gerçekten o ölçülerde üretilmiş dosyalar veriliyor.
        icons: [
          {
            src: 'klarsti-ikon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'klarsti-ikon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Android uyarlanabilir ikon için: logonun kenar boşluğu geniş,
            // maskeleme güvenli alanın dışını kırpsa da yazı tam kalıyor.
            src: 'klarsti-ikon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    // Hata izlerini okunur kılan harita dosyaları. Sentry'ye yüklenip
    // ardından siliniyorlar; yayına çıkmıyorlar. Yayınlanan bir harita, sıkışık
    // koddan kaynağın tamamını geri üretilebilir hale getirirdi.
    //
    // release, main.tsx'teki Sentry.init'e verilen sürümle AYNI olmalı:
    // eşleşme buradan kuruluyor, farklı olursa haritalar yüklenir ama hiçbir
    // hataya bağlanmaz.
    ...(sentryAnahtari
      ? [
          sentryVitePlugin({
            org: 'klarsti',
            project: 'klarsti-web',
            authToken: sentryAnahtari,
            // Derleme istatistiklerimizi Sentry'ye göndermenin bize faydası yok.
            telemetry: false,
            release: { name: surum },
            // dist'in tamamı taranıyor: uygulama parçalarının yanında PWA
            // eklentisi de sw.js.map ve workbox-*.js.map üretiyor, onlar
            // yalnızca assets/ altını silen bir kalıptan kaçıp yayına giderdi.
            sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.js.map'] },
            // Yükleme başarısız olursa (anahtar süresi dolmuş, isim değişmiş)
            // derleme çökmesin: yayın, hata takibinin yan işine takılmamalı.
            // Bunun bedeli sessiz kalma riski, o yüzden uyarı bağırıyor.
            errorHandler: (hata) => {
              console.warn('\n[sentry] Kaynak haritalari YUKLENEMEDI. Yayin devam ediyor,');
              console.warn('[sentry] ama bu surumun hata izleri okunaksiz kalacak. Sebep:');
              console.warn(hata.message, '\n');
            }
          })
        ]
      : [])
  ],
  build: {
    // 'hidden': harita üretilir ama JS dosyalarının sonuna "haritam şurada"
    // notu düşülmez. Tarayıcı onları aramaz, yalnızca Sentry kullanır.
    // Anahtar yoksa hiç üretilmiyor, boşuna derleme süresi harcanmasın.
    sourcemap: sentryAnahtari ? 'hidden' : false
  },
  base: process.env.VITE_DEPLOY_TARGET === 'firebase' ? '/' : '/klarsti/'
})

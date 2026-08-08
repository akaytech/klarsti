import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Sekme ikonu favicon-32.png. Eskiden yanında bir de favicon.svg
      // duruyordu; içeriği Vite şablonundan kalma mor bir şimşekti, hiçbir
      // yerden çağrılmıyordu, silindi.
      includeAssets: ['favicon-32.png'],
      // Manifest ikonları varsayılan olarak precache'e ekleniyordu. İkonu
      // tarayıcı zaten ihtiyaç duyduğunda kendisi indirir; önden indirmek
      // her ilk ziyarete boşuna yük bindiriyordu.
      includeManifestIcons: false,
      workbox: {
        navigateFallbackDenylist: [/^\/__\//],
        // Önden SADECE uygulama kabuğu indirilir (html, css, manifest, favicon).
        // JS varsayılan globPatterns'te olduğu için eskiden her ziyaretçi
        // açmadığı 13 aracın, konuşmadığı 9 dilin ve Sentry'nin kodunu da
        // indiriyordu; bu, kod bölmenin kazandırdığını geri veriyordu.
        globPatterns: ['**/*.{css,html,webmanifest}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
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
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Android uyarlanabilir ikon için: logonun kenar boşluğu geniş,
            // maskeleme güvenli alanın dışını kırpsa da "S" tam kalıyor.
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: process.env.VITE_DEPLOY_TARGET === 'firebase' ? '/' : '/klarsti/'
})

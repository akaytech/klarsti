import { defineConfig } from 'vitest/config';

// Testler kendi yapılandırmasını kullanıyor, vite.config.ts'i DEĞİL: oradaki
// PWA ve Sentry eklentilerinin testlerde hiçbir işi yok, sadece her koşumu
// yavaşlatır ve anahtar arar.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__testler__/**/*.test.ts'],
    // Testler tarayıcı API'si olmayan saf mantığı sınıyor; biri yanlışlıkla
    // DOM'a uzanırsa sessizce geçmesin, patlasın.
    globals: false
  }
});

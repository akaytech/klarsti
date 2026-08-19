import { describe, it, expect, vi } from 'vitest';

// Bot koruması (App Check) artık firebase.ts yüklenirken DEĞİL, çağrıyla
// başlıyor. Sebep: o dosyayı Firestore'a hiç dokunmayan yerler de çekiyor —
// özellikle hesapsız deneme, ki verisi tarayıcıda duruyor. Eskiden deneme
// ziyaretçisi hiç kullanılmayacak 314 KB'lık reCAPTCHA betiğini indiriyordu.
//
// Buradaki ilk test o davranışın geri gelmesini engelliyor: biri çağrıyı
// tekrar modül gövdesine taşırsa test kırmızı yanar.

const initializeAppCheck = vi.fn();

vi.mock('firebase/app-check', () => ({
  initializeAppCheck,
  ReCaptchaV3Provider: class {
    anahtar: string;
    constructor(anahtar: string) {
      this.anahtar = anahtar;
    }
  },
}));
vi.mock('firebase/firestore', () => ({ getFirestore: () => ({}) }));
vi.mock('firebase/analytics', () => ({
  getAnalytics: () => ({}),
  isSupported: () => Promise.resolve(false),
  logEvent: () => {},
}));
vi.mock('../firebaseCore', () => ({ app: {} }));
vi.mock('../config/cerezIzni', () => ({ olcumlemeyeIzinVar: () => false }));

// Testler node ortamında koşuyor (bkz. vitest.config.ts) ama bu fonksiyon
// tarayıcı dışında bilerek hiçbir şey yapmıyor. Sahte `window` DOSYA
// YÜKLENMEDEN ÖNCE konuyor: yoksa "modül seviyesinde başlamıyor" iddiası boşa
// düşerdi — çağrı orada olsa bile window yok diye sessizce geçerdi.
(globalThis as Record<string, unknown>).window ??= {};

const { botKorumasiniBaslat } = await import('../firebase');

describe('bot korumasi', () => {
  it('dosya yuklenirken KENDILIGINDEN baslamiyor', () => {
    // Bu satıra gelindiğinde firebase.ts çoktan yüklendi. Hâlâ hiç
    // çağrılmamış olmalı: deneme ziyaretçisinin indirmediği kısım bu.
    expect(initializeAppCheck).not.toHaveBeenCalled();
  });

  it('cagrilinca basliyor', () => {
    botKorumasiniBaslat();
    expect(initializeAppCheck).toHaveBeenCalledTimes(1);
  });

  it('ikinci cagri etkisiz: uc giris noktasi da cagiriyor', () => {
    // Uygulama, yönetim ekranı ve blog aynı sayfada arka arkaya yüklenebilir.
    botKorumasiniBaslat();
    botKorumasiniBaslat();
    expect(initializeAppCheck).toHaveBeenCalledTimes(1);
  });

  it('token kendini yenileyecek sekilde kuruluyor', () => {
    const ayarlar = initializeAppCheck.mock.calls[0][1];
    expect(ayarlar.isTokenAutoRefreshEnabled).toBe(true);
    expect(ayarlar.provider).toBeTruthy();
  });
});

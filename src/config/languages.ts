/**
 * Arayüzün çevirisi olan diller.
 *
 * Liste iki ayrı dil seçicide (tanıtım sayfasının üst barı ve uygulamadaki
 * hesap menüsü) birebir kopyalanmıştı; yeni bir dil eklendiğinde ikisini de
 * güncellemek gerekiyordu.
 *
 * DİKKAT: Bu dosya bilerek bağımlılıksız. Tanıtım sayfası da okuyor; buraya
 * store/firebase import edilirse tanıtım sayfasının bundle izolasyonu bozulur.
 * Kodların `src/locales/<kod>.json` ile aynı olması gerekiyor (bkz. i18n.ts).
 */
export interface Dil {
  code: string;
  nativeName: string;
}

export const DESTEKLENEN_DILLER: Dil[] = [
  { code: 'tr', nativeName: 'Türkçe' },
  { code: 'en', nativeName: 'English' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'es', nativeName: 'Español' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'ar', nativeName: 'العربية' },
  { code: 'zh', nativeName: '中文' },
];

import type { ToolGuideBundle } from './types';

export type { GuideShortcut, ToolGuide, ToolGuideBundle, ToolGuideExample, ToolGuideFaq } from './types';

// Kılavuz metinleri i18n dosyalarına konmuyor: on dil × araç başına kırk satır,
// ilk açılışta hiç okunmayacak bir yükü ana pakete bindiriyor. Bunun yerine dil
// başına ayrı bir parça duruyor ve yalnızca kullanıcı kılavuzu açtığında
// indiriliyor. Tanımadığı bir dil gelirse İngilizceye düşer.
const YUKLEYICILER: Record<string, () => Promise<{ default: ToolGuideBundle }>> = {
  tr: () => import('./tr'),
  en: () => import('./en'),
  de: () => import('./de'),
  es: () => import('./es'),
  fr: () => import('./fr'),
  it: () => import('./it'),
  pt: () => import('./pt'),
  ru: () => import('./ru'),
  ja: () => import('./ja'),
  zh: () => import('./zh'),
  ar: () => import('./ar')
};

export async function loadToolGuides(dil: string): Promise<ToolGuideBundle> {
  const kod = (dil || 'en').toLowerCase().split('-')[0];
  const yukle = YUKLEYICILER[kod] ?? YUKLEYICILER.en;
  return (await yukle()).default;
}

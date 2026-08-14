import { useSyncExternalStore } from 'react';

/**
 * Çizim alanının zemin deseni.
 *
 * Temadan ayrı bir tercih: tema rengi belirliyor, bu ise desenin biçimini.
 * İkisi ayrı kalsın diye ayrı dosyada — kullanıcı koyu temayı severken
 * kareli zemin isteyebilir, ters de olabilir.
 *
 * Tercih tarayıcıya kaydediliyor, çalışmanın içine değil. Zemin bir görüntü
 * tercihi; paylaşılan bir çalışmayı açan kişi kendi seçtiği zeminde görmeli,
 * çalışmayı hazırlayanın seçtiğinde değil. Ayrıca böylece her değişiklikte
 * sunucuya yazmıyoruz.
 *
 * DİKKAT: theme.ts gibi bu dosya da bilerek bağımlılıksız (sadece react).
 */

export type CanvasBgId = 'dots' | 'grid' | 'cross' | 'none';

export interface CanvasBgDef {
  id: CanvasBgId;
  labelKey: string;
  defaultLabel: string;
}

/** Listede varsayılan başta: seçenekler desensizden yoğuna doğru gidiyor. */
export const CANVAS_BACKGROUNDS: CanvasBgDef[] = [
  { id: 'none', labelKey: 'canvas_bg_none', defaultLabel: 'Plain' },
  { id: 'dots', labelKey: 'canvas_bg_dots', defaultLabel: 'Dotted' },
  { id: 'cross', labelKey: 'canvas_bg_cross', defaultLabel: 'Crosses' },
  { id: 'grid', labelKey: 'canvas_bg_grid', defaultLabel: 'Grid' },
];

/**
 * Varsayılan sade: desensiz zemin çizimi öne çıkarıyor, kutular ve oklar
 * daha net okunuyor. Desen isteyen Ayarlar'dan seçiyor.
 */
const DEFAULT_BG: CanvasBgId = 'none';
const STORAGE_KEY = 'klarsti-canvas-bg';

const BG_IDS = new Set<string>(CANVAS_BACKGROUNDS.map((b) => b.id));

function readStored(): CanvasBgId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && BG_IDS.has(saved)) return saved as CanvasBgId;
  } catch {
    /* gizli sekme: tercih oturum boyunca yaşar, kaydedilmez */
  }
  return DEFAULT_BG;
}

let current: CanvasBgId = readStored();
const listeners = new Set<() => void>();

export function getCanvasBg(): CanvasBgId {
  return current;
}

export function setCanvasBg(id: CanvasBgId) {
  const next = BG_IDS.has(id) ? id : DEFAULT_BG;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* gizli sekme */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Seçili zemin deseni. */
export function useCanvasBg(): CanvasBgId {
  return useSyncExternalStore(subscribe, getCanvasBg, () => DEFAULT_BG);
}

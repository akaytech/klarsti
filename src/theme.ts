import { useSyncExternalStore } from 'react';

/**
 * Tema altyapısı.
 *
 * Renkler component'lerin içinde `dark:bg-slate-800` gibi hazır Tailwind
 * class'ları olarak duruyor (1000'den fazla kullanım). Her tema için ayrı
 * class yazmak yerine, Tailwind v4'te `bg-slate-800`in `var(--color-slate-800)`
 * olarak derlendiği gerçeğinden yararlanıyoruz: `<html>` üstündeki tema
 * class'ı slate/indigo skalasını yeniden tanımlıyor, component'lere hiç
 * dokunmuyoruz. Paletlerin kendisi index.css içinde.
 *
 * DİKKAT: Bu dosya bilerek bağımlılıksız (sadece react). LandingPage de
 * kullanıyor; buraya store/firebase import edilirse tanıtım sayfasının
 * bundle izolasyonu bozulur.
 */

export type ThemeId = 'light' | 'deep-night' | 'dark' | 'graphite' | 'blossom' | 'pistachio';

export interface ThemeDef {
  id: ThemeId;
  /** Tailwind'in `dark:` varyantı bu temada açık mı? */
  isDark: boolean;
  labelKey: string;
  defaultLabel: string;
  /** Tema seçicideki önizleme yuvarlağı: [zemin, vurgu] */
  swatch: [string, string];
  /** React Flow zemin noktaları */
  canvasDot: string;
  /** React Flow varsayılan bağlantı çizgisi */
  canvasEdge: string;
  minimapNode: string;
  minimapMask: string;
  /** PNG/PDF dışa aktarımının arka planı */
  exportBg: string;
}

export const THEMES: ThemeDef[] = [
  {
    id: 'light',
    isDark: false,
    labelKey: 'theme_light',
    defaultLabel: 'Light',
    swatch: ['#f8fafc', '#6366f1'],
    canvasDot: '#cbd5e1',
    canvasEdge: '#94a3b8',
    minimapNode: '#a5b4fc',
    minimapMask: 'rgba(200, 200, 225, 0.2)',
    exportBg: '#ffffff',
  },
  {
    id: 'deep-night',
    isDark: true,
    labelKey: 'theme_deep_night',
    defaultLabel: 'Deep Night',
    swatch: ['#0f172a', '#818cf8'],
    canvasDot: '#334155',
    canvasEdge: '#64748b',
    minimapNode: '#4f46e5',
    minimapMask: 'rgba(15, 23, 42, 0.6)',
    exportBg: '#0f172a',
  },
  {
    id: 'dark',
    isDark: true,
    labelKey: 'theme_dark',
    defaultLabel: 'Dark',
    swatch: ['#0d0d0d', '#818cf8'],
    canvasDot: '#2e2e2e',
    canvasEdge: '#5c5c5c',
    minimapNode: '#4f46e5',
    minimapMask: 'rgba(10, 10, 10, 0.6)',
    exportBg: '#0d0d0d',
  },
  {
    id: 'graphite',
    isDark: true,
    labelKey: 'theme_graphite',
    defaultLabel: 'Graphite',
    swatch: ['#1a1d21', '#9fb0c4'],
    canvasDot: '#3a4046',
    canvasEdge: '#6f7880',
    minimapNode: '#7d8fa6',
    minimapMask: 'rgba(26, 29, 33, 0.6)',
    exportBg: '#1a1d21',
  },
  {
    id: 'blossom',
    isDark: false,
    labelKey: 'theme_blossom',
    defaultLabel: 'Blossom',
    swatch: ['#fff5f9', '#ec4899'],
    canvasDot: '#f4b6cd',
    canvasEdge: '#dd8fac',
    minimapNode: '#f472a6',
    minimapMask: 'rgba(244, 182, 205, 0.25)',
    exportBg: '#fffbfd',
  },
  {
    id: 'pistachio',
    isDark: false,
    labelKey: 'theme_pistachio',
    defaultLabel: 'Pistachio',
    swatch: ['#f6faf0', '#74a92c'],
    canvasDot: '#bcd79b',
    canvasEdge: '#93b56c',
    minimapNode: '#8cc03f',
    minimapMask: 'rgba(188, 215, 155, 0.25)',
    exportBg: '#fcfdf8',
  },
];

const DEFAULT_THEME: ThemeId = 'light';
/**
 * Yeni anahtar ayrı tutuluyor: eski kurguda 'theme' altındaki 'dark' değeri
 * "koyu lacivert" demekti, artık 'dark' ayrı bir temanın (gerçek siyah) id'si.
 * Aynı anahtarda kalsaydı Karanlık'ı seçen kullanıcı sayfayı yenileyince
 * Derin Gece'ye düşerdi.
 */
const STORAGE_KEY = 'klarsti-theme';
const LEGACY_STORAGE_KEY = 'theme';

const THEME_BY_ID = new Map<string, ThemeDef>(THEMES.map((t) => [t.id, t]));

export function normalizeThemeId(raw: string | null | undefined): ThemeId {
  if (raw && THEME_BY_ID.has(raw)) return raw as ThemeId;
  return DEFAULT_THEME;
}

export function getThemeDef(id: ThemeId): ThemeDef {
  return THEME_BY_ID.get(id) ?? THEME_BY_ID.get(DEFAULT_THEME)!;
}

function readStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEME_BY_ID.has(saved)) return saved as ThemeId;
    // Tek seferlik geçiş: eskiden sadece 'dark' / 'light' kaydediliyordu.
    return localStorage.getItem(LEGACY_STORAGE_KEY) === 'dark' ? 'deep-night' : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * `<html>` üstünde şu an hangi tema class'ı varsa onu okur. index.html'deki
 * inline script sayfayı boyamadan önce class'ı basıyor, ilk render bununla
 * uyumlu başlasın diye buradan okuyoruz.
 */
function readAppliedTheme(): ThemeId {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  for (const theme of THEMES) {
    if (document.documentElement.classList.contains(`theme-${theme.id}`)) {
      return theme.id;
    }
  }
  return readStoredTheme();
}

let current: ThemeId = readAppliedTheme();
const listeners = new Set<() => void>();

export function applyTheme(id: ThemeId) {
  const theme = getThemeDef(id);
  const root = document.documentElement;
  for (const t of THEMES) root.classList.remove(`theme-${t.id}`);
  root.classList.add(`theme-${theme.id}`);
  root.classList.toggle('dark', theme.isDark);
  root.style.colorScheme = theme.isDark ? 'dark' : 'light';
}

export function getTheme(): ThemeId {
  return current;
}

export function setTheme(id: ThemeId) {
  const next = normalizeThemeId(id);
  current = next;
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode: tema oturum boyunca yaşar, kaydedilmez */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Aktif temanın id'si. */
export function useThemeId(): ThemeId {
  return useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);
}

/** Aktif temanın tüm tanımı (canvas/export renkleri dahil). */
export function useTheme(): ThemeDef {
  return getThemeDef(useThemeId());
}

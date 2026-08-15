import { create } from 'zustand';

interface UIState {
  activeTopMenu: 'user' | 'projects' | 'more' | null;
  setActiveTopMenu: (menu: 'user' | 'projects' | 'more' | null) => void;
  triggerShare: () => void;
  setTriggerShare: (fn: () => void) => void;
  triggerExport: () => void;
  setTriggerExport: (fn: () => void) => void;
  /** Araç kılavuzu penceresi. Geniş ekranda düğmeden, dar ekranda üç nokta
   *  menüsünden açılıyor; ikisi de aynı bayrağı çeviriyor. */
  guideOpen: boolean;
  setGuideOpen: (open: boolean) => void;
  /** Tuvalin sağ altındaki küçük harita açık mı? (bkz. CanvasMiniMap) */
  minimapOpen: boolean;
  setMinimapOpen: (open: boolean) => void;
}

// Küçük haritayı kapatan kullanıcı onu her sayfa yenilemesinde geri
// istemiyor; tercih tarayıcıda duruyor. Gizli sekmede localStorage
// erişimi hata verebiliyor, o yüzden sarmalanmış.
const MINIMAP_ANAHTARI = 'klarsti-minimap-acik';
const minimapBaslangici = (): boolean => {
  try {
    return localStorage.getItem(MINIMAP_ANAHTARI) !== '0';
  } catch {
    return true;
  }
};

export const useUIStore = create<UIState>((set) => ({
  activeTopMenu: null,
  setActiveTopMenu: (menu) => set({ activeTopMenu: menu }),
  triggerShare: () => {},
  setTriggerShare: (fn) => set({ triggerShare: fn }),
  triggerExport: () => {},
  setTriggerExport: (fn) => set({ triggerExport: fn }),
  guideOpen: false,
  setGuideOpen: (open) => set({ guideOpen: open }),
  minimapOpen: minimapBaslangici(),
  setMinimapOpen: (open) => {
    try { localStorage.setItem(MINIMAP_ANAHTARI, open ? '1' : '0'); } catch { /* gizli sekme */ }
    set({ minimapOpen: open });
  },
}));

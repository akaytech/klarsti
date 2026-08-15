import { TOOL_STATE_KEYS, getInitialValueForKey, useRoadmapStore } from './useRoadmapStore';

/**
 * Hesapsız denemenin verisi: tarayıcıda durur, buluta hiç gitmez.
 *
 * Kullanıcı /dene adresinde çizdiğinde SyncManager takılı değildir, yani
 * hiçbir şey Firestore'a yazılmaz. Çizilenin sayfa yenilenince kaybolmaması
 * için burada localStorage'a alınıyor. Hesap açıldığında bu kayıt bir
 * klasöre dönüşüyor (bkz. denemeDevri.ts) ve siliniyor.
 *
 * Ajanda burada yok: kişisel bir araç, hesabın kendisine bağlı.
 */

const ANAHTAR = 'klarsti-deneme';
/** Kayıt biçimi değişirse eski kayıt sessizce atılsın diye. */
const SURUM = 1;
const YAZMA_GECIKMESI_MS = 700;

export type DenemeKaydi = {
  surum: number;
  guncellendi: number;
  /** Araçların verisi: TOOL_STATE_KEYS anahtarlarıyla. */
  toolData: Record<string, unknown>;
};

export function denemeyiOku(): DenemeKaydi | null {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    if (!ham) return null;
    const kayit = JSON.parse(ham) as DenemeKaydi;
    if (kayit?.surum !== SURUM || !kayit.toolData) return null;
    return kayit;
  } catch {
    // Gizli sekmede depolama okunamayabiliyor; deneme o zaman yalnızca
    // sekme açık kaldığı sürece yaşar.
    return null;
  }
}

export function denemeyiSil() {
  try {
    localStorage.removeItem(ANAHTAR);
  } catch {
    /* gizli sekme */
  }
}

/** Kayıtta gerçekten bir şey var mı? Boş araç listeleri "iş yapılmadı" demek. */
export function denemeDoluMu(kayit: DenemeKaydi | null): boolean {
  if (!kayit) return false;
  return Object.values(kayit.toolData).some((deger) => Array.isArray(deger) && deger.length > 0);
}

/** Depodaki araç verisini kayıt biçimine çevirir. */
function depodanTopla(): Record<string, unknown> {
  const durum = useRoadmapStore.getState() as unknown as Record<string, unknown>;
  const toolData: Record<string, unknown> = {};
  TOOL_STATE_KEYS.forEach((k) => {
    toolData[k] = durum[k];
  });
  return toolData;
}

/**
 * Depoyu deneme kaydından kurar. Kayıt yoksa araçlar boş başlar.
 * Sahte bir klasör de açılıyor: tuvaller ve menüler açık bir klasör bekliyor,
 * yoksa araç seçimi "yeni klasör aç" akışına düşer.
 */
export function denemeyiYukle() {
  const kayit = denemeyiOku();
  const toolData: Record<string, unknown> = {};
  TOOL_STATE_KEYS.forEach((k) => {
    const kayitli = kayit?.toolData?.[k];
    toolData[k] = Array.isArray(kayitli) ? kayitli : getInitialValueForKey(k);
  });

  useRoadmapStore.setState({
    // Sahte klasörün toolData'sı da doluyor: karşılama ekranındaki "Kaldığın
    // Yer" şeridi ile menülerdeki çalışma listesi klasörün verisini okuyor,
    // depodaki üst seviye alanları değil.
    projects: [{ id: 'deneme', name: 'Deneme', toolData, updatedAt: Date.now() }],
    currentProjectId: 'deneme',
    projectsLoaded: true,
    worksLoaded: true,
    works: [],
    activeTool: null,
    ...toolData,
  } as never);
}

/**
 * Depodaki her değişikliği tarayıcıya yazar. Geri döndürdüğü fonksiyon
 * dinlemeyi bırakır (bileşen sökülürken çağrılıyor).
 */
export function denemeyiKaydetmeyeBasla(): () => void {
  let zamanlayici: ReturnType<typeof setTimeout> | null = null;

  const yaz = () => {
    const toolData = depodanTopla();
    const kayit: DenemeKaydi = { surum: SURUM, guncellendi: Date.now(), toolData };

    // Sahte klasör de tazeleniyor: karşılama ekranı ve menüler çalışmaları
    // klasörün verisinden okuyor. Bu güncelleme araç alanlarına dokunmadığı
    // için aşağıdaki aboneliği tekrar tetiklemiyor.
    useRoadmapStore.setState((durum) => ({
      projects: durum.projects.map((p) => (p.id === 'deneme' ? { ...p, toolData, updatedAt: Date.now() } : p)),
    }));

    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(kayit));
    } catch {
      // Depolama dolu ya da kapalı. Deneme yine çalışıyor, yalnızca sayfa
      // yenilenince kayboluyor; şeritteki uyarı bunu zaten söylüyor.
    }
  };

  const abonelik = useRoadmapStore.subscribe((durum, oncekiDurum) => {
    const d = durum as unknown as Record<string, unknown>;
    const o = oncekiDurum as unknown as Record<string, unknown>;
    const degisti = TOOL_STATE_KEYS.some((k) => d[k] !== o[k]);
    if (!degisti) return;
    if (zamanlayici) clearTimeout(zamanlayici);
    zamanlayici = setTimeout(yaz, YAZMA_GECIKMESI_MS);
  });

  return () => {
    if (zamanlayici) clearTimeout(zamanlayici);
    abonelik();
  };
}

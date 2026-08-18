/**
 * Tarayıcının kendi tam ekranı. Masaüstünde görev çubuğu ve tarayıcının
 * sekme/adres çubuğu da kayboluyor, yani F11 ile aynı sonuç.
 *
 * Ayrı dosyada: hem tam ekran düğmesi hem de "araçtan çıkınca kapat" mantığı
 * (bkz. Workspace) aynı kuralları kullanıyor.
 *
 * Safari tam ekranı hâlâ webkit önekiyle veriyor; iPhone'daki Safari'de ise
 * özellik hiç yok. Bu yüzden her yerde hem önekli hem öneksiz ad deneniyor.
 */

type TamEkranBelgesi = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type TamEkranEleman = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export function tamEkrandaMi() {
  const belge = document as TamEkranBelgesi;
  return Boolean(belge.fullscreenElement || belge.webkitFullscreenElement);
}

export function tamEkranDestekliMi() {
  const belge = document as TamEkranBelgesi;
  return Boolean(belge.fullscreenEnabled || belge.webkitFullscreenEnabled);
}

// Tarayıcı isteği geri çevirebiliyor (izin, gömülü çerçeve, kullanıcı hareketi
// olmadan çağrı). Ekrana hata basmaya değmez: kullanıcı zaten hiçbir şey
// olmadığını görüyor ve düğmenin görünümü olaydan besleniyor, yanlış duruma
// düşmüyor.
export async function tamEkranAc() {
  const kok = document.documentElement as TamEkranEleman;
  try {
    await (kok.requestFullscreen ? kok.requestFullscreen() : kok.webkitRequestFullscreen?.());
  } catch {
    /* yut */
  }
}

export async function tamEkranKapat() {
  if (!tamEkrandaMi()) return;
  const belge = document as TamEkranBelgesi;
  try {
    await (belge.exitFullscreen ? belge.exitFullscreen() : belge.webkitExitFullscreen?.());
  } catch {
    /* yut */
  }
}

/** Durum değişimini dinler; bırakma işlevi döner. */
export function tamEkranDegisiminiDinle(isle: () => void) {
  document.addEventListener('fullscreenchange', isle);
  document.addEventListener('webkitfullscreenchange', isle);
  return () => {
    document.removeEventListener('fullscreenchange', isle);
    document.removeEventListener('webkitfullscreenchange', isle);
  };
}

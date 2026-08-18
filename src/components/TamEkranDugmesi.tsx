import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Tam ekran düğmesi: tarayıcının kendi tam ekranını açıyor, yani masaüstünde
 * görev çubuğu ve tarayıcının sekme/adres çubuğu da kayboluyor. F11'in aynısı,
 * tek farkı klavyeyi bilmeyen kullanıcının da görebildiği bir düğme olması.
 *
 * Uygulamanın kendi menüleri bilerek yerinde kalıyor: kullanıcı tam ekranda da
 * geri al, paylaş, hesap gibi her şeye erişebilmeli.
 */

// Safari tam ekranı hâlâ webkit önekiyle veriyor; iPhone'daki Safari'de ise
// özellik hiç yok. Bu yüzden hem önekli hem öneksiz ad deneniyor, ikisi de
// yoksa düğme hiç çizilmiyor.
type TamEkranBelgesi = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type TamEkranEleman = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function tamEkrandaMi() {
  const belge = document as TamEkranBelgesi;
  return Boolean(belge.fullscreenElement || belge.webkitFullscreenElement);
}

function desteklenirMi() {
  const belge = document as TamEkranBelgesi;
  return Boolean(belge.fullscreenEnabled || belge.webkitFullscreenEnabled);
}

export default function TamEkranDugmesi() {
  const { t } = useTranslation();
  const [acik, setAcik] = useState(tamEkrandaMi);

  // Destek kontrolü bir kez yapılıyor: tarayıcı oturum ortasında bu yeteneği
  // kazanmıyor, her çizimde sormanın anlamı yok.
  const [destekli] = useState(desteklenirMi);

  // Durum olaydan okunuyor, düğmeye basıldığında elle yazılmıyor: kullanıcı
  // Esc'e basıp çıkabiliyor, o zaman düğme "çık" görünümünde kalırdı.
  useEffect(() => {
    const guncelle = () => setAcik(tamEkrandaMi());
    document.addEventListener('fullscreenchange', guncelle);
    document.addEventListener('webkitfullscreenchange', guncelle);
    return () => {
      document.removeEventListener('fullscreenchange', guncelle);
      document.removeEventListener('webkitfullscreenchange', guncelle);
    };
  }, []);

  if (!destekli) return null;

  const degistir = async () => {
    const belge = document as TamEkranBelgesi;
    try {
      if (tamEkrandaMi()) {
        await (belge.exitFullscreen ? belge.exitFullscreen() : belge.webkitExitFullscreen?.());
      } else {
        const kok = document.documentElement as TamEkranEleman;
        await (kok.requestFullscreen ? kok.requestFullscreen() : kok.webkitRequestFullscreen?.());
      }
    } catch {
      // Tarayıcı isteği geri çevirebiliyor (izin, gömülü çerçeve). Ekrana hata
      // basmaya değmez: kullanıcı zaten hiçbir şey olmadığını görüyor ve
      // düğmenin görünümü olaydan besleniyor, yanlış duruma düşmüyor.
    }
  };

  const etiket = t(acik ? 'fullscreen_exit' : 'fullscreen_enter');

  return (
    <button
      onClick={degistir}
      title={etiket}
      aria-label={etiket}
      aria-pressed={acik}
      className="hidden sm:flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {acik ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
}

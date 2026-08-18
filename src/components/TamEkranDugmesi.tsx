import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { tamEkranAc, tamEkranDegisiminiDinle, tamEkranDestekliMi, tamEkranKapat, tamEkrandaMi } from '../utils/tamEkran';

/**
 * Tam ekran düğmesi: tarayıcının kendi tam ekranını açıyor, yani masaüstünde
 * görev çubuğu ve tarayıcının sekme/adres çubuğu da kayboluyor. F11'in aynısı,
 * tek farkı klavyeyi bilmeyen kullanıcının da görebildiği bir düğme olması.
 *
 * Uygulamanın kendi menüleri bilerek yerinde kalıyor: kullanıcı tam ekranda da
 * geri al, paylaş, hesap gibi her şeye erişebilmeli.
 */
export default function TamEkranDugmesi() {
  const { t } = useTranslation();
  const [acik, setAcik] = useState(tamEkrandaMi);

  // Destek kontrolü bir kez yapılıyor: tarayıcı oturum ortasında bu yeteneği
  // kazanmıyor, her çizimde sormanın anlamı yok.
  const [destekli] = useState(tamEkranDestekliMi);

  // Durum olaydan okunuyor, düğmeye basıldığında elle yazılmıyor: kullanıcı
  // Esc'e basıp çıkabiliyor, araçtan çıkınca da kendiliğinden kapanıyor
  // (bkz. Workspace); o durumlarda düğme "çık" görünümünde kalırdı.
  useEffect(() => tamEkranDegisiminiDinle(() => setAcik(tamEkrandaMi())), []);

  if (!destekli) return null;

  const etiket = t(acik ? 'fullscreen_exit' : 'fullscreen_enter');

  return (
    <button
      onClick={() => void (tamEkrandaMi() ? tamEkranKapat() : tamEkranAc())}
      title={etiket}
      aria-label={etiket}
      aria-pressed={acik}
      className="hidden sm:flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {acik ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
}

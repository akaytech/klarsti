import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { denemeKipindeMi } from '../utils/denemeKipi';

/**
 * Denemede sağ üstteki "Hesap Aç" düğmesi.
 *
 * Eskiden tuvalin sağ altında bir şeritti. Orası küçük haritanın köşesiydi:
 * şerit haritanın ve onu açıp kapatan düğmenin üstüne biniyordu. Düğme sağ üste,
 * kılavuzun soluna taşındı; alt köşe haritaya kaldı.
 *
 * Şeritteki "bu deneme yalnızca bu tarayıcıda duruyor" uyarısı düğmenin ipucuna
 * ve karşılama ekranına taşındı (bkz. WelcomeScreen): kullanıcının verisinin
 * kalıcı olmadığını bilmesi gereken tek yer orası.
 */
export default function DenemeHesapDugmesi() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!denemeKipindeMi()) return null;

  return (
    <button
      onClick={() => navigate('/register')}
      title={t('trial_bar_text')}
      className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
    >
      {t('trial_bar_button')}
      {/* Ok dar ekranda gizli: yer kazanmak için. Küme genişleyince üstteki
          logonun üzerine biniyor. */}
      <ArrowRight size={16} className="hidden rtl:rotate-180 sm:block" />
    </button>
  );
}

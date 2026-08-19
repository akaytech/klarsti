import { Camera, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Görsel dışa aktarma düğmesinin görünen kısmı.
 *
 * Ayrı duruyor çünkü iki farklı dışa aktarıcı aynı düğmeyi çiziyor: çizim
 * tuvalleri için olan (React Flow'un görüş alanını çeker, bkz. CizimDisaAktar)
 * ve listeye dayalı araçlar için olan (sayfanın kendisini çeker, bkz.
 * GlobalExportButton). İkincisi çizim kütüphanesine hiç dokunmuyor.
 */
export default function DisaAktarDugmesi({ calisiyor, onTikla }: { calisiyor: boolean; onTikla: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onTikla}
      disabled={calisiyor}
      className={`hidden sm:flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-sm ${calisiyor ? 'opacity-75 cursor-not-allowed' : ''}`}
      title={t('export_image')} aria-label={t('export_image')}
    >
      {calisiyor ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
      <span className="hidden sm:inline">{t('export_image')}</span>
    </button>
  );
}

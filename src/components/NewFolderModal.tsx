import { useEffect, useRef, useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Yeni klasörün adını soran pencere.
 *
 * Neden var: bir araca ilk kez tıklandığında arkada sessizce bir klasör
 * açılıyor ve adı hep "Yeni Çalışma" oluyordu. Kimse sonradan dönüp
 * değiştirmediği için kullanıcının klasör listesi aynı addan yedi taneye
 * dönüşüyor, çalışma listesindeki klasör sütunu da hiçbir işe yaramıyordu.
 *
 * İptal edilirse araç açılmıyor: klasörsüz çalışma diye bir şey yok, adsız
 * klasör açmak da baştaki soruna geri dönmek olurdu.
 */
export default function NewFolderModal({
  acik,
  onKapat,
  onOlustur,
}: {
  acik: boolean;
  onKapat: () => void;
  onOlustur: (ad: string) => void;
}) {
  const { t } = useTranslation();
  const [ad, setAd] = useState('');
  const girdiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!acik) return;
    setAd('');
    const zaman = setTimeout(() => girdiRef.current?.focus(), 10);
    const kacis = (e: KeyboardEvent) => { if (e.key === 'Escape') onKapat(); };
    document.addEventListener('keydown', kacis);
    return () => {
      document.removeEventListener('keydown', kacis);
      clearTimeout(zaman);
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  const gonder = () => {
    const temiz = ad.trim();
    if (!temiz) return;
    onOlustur(temiz);
  };

  return (
    <div
      className="perde-gir fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onKapat}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="yeni-klasor-basligi"
        className="kutu-gir w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <FolderPlus size={20} />
            <h2 id="yeni-klasor-basligi" className="text-lg font-semibold">{t('new_folder_title')}</h2>
          </div>
          <button
            onClick={onKapat}
            aria-label={t('close_modal', { defaultValue: 'Close' })}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t('new_folder_hint')}
          </p>
          <input
            ref={girdiRef}
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') gonder(); }}
            placeholder={t('new_folder_placeholder')}
            aria-label={t('new_folder_label')}
            maxLength={80}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <button
            onClick={onKapat}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {t('cancel_btn')}
          </button>
          <button
            onClick={gonder}
            disabled={!ad.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
          >
            {t('new_folder_create')}
          </button>
        </div>
      </div>
    </div>
  );
}

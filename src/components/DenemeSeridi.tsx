import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Info } from 'lucide-react';

/**
 * Deneme ekranının altındaki şerit.
 *
 * İki işi var: çizilenin nerede durduğunu dürüstçe söylemek ("bu tarayıcıda")
 * ve hesaba geçişi tek tıkla vermek. Kapatılamıyor — kullanıcının verisinin
 * kalıcı olmadığını bilmesi gereken tek yer burası.
 *
 * Tuvalin alt ortasındaki "kutu ekle" düğmesiyle çakışmasın diye sağa yaslı
 * ve dar ekranda daha alçak duruyor.
 *
 * Kapladığı yüksekliği bir CSS değişkenine yazıyor: küçük harita tam bu köşede
 * duruyordu ve şeridin altında kalıyordu. Sabit bir sayı yazmak yetmedi, şerit
 * dile göre iki ya da üç satır oluyor; ölçüsü buradan okunuyor.
 */
export default function DenemeSeridi() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const seritRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = seritRef.current;
    if (!el) return;
    const yaz = () => {
      document.documentElement.style.setProperty('--deneme-seridi', `${Math.round(el.offsetHeight)}px`);
    };
    yaz();
    const gozlemci = new ResizeObserver(yaz);
    gozlemci.observe(el);
    return () => {
      gozlemci.disconnect();
      document.documentElement.style.removeProperty('--deneme-seridi');
    };
  }, []);

  return (
    <div ref={seritRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-[110] flex justify-center px-3 pb-3 sm:justify-end sm:px-4 sm:pb-4">
      <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-indigo-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md dark:border-indigo-800 dark:bg-slate-800/95 sm:w-auto">
        <Info size={18} className="hidden shrink-0 text-indigo-500 sm:block" aria-hidden />
        <p className="min-w-0 flex-1 text-xs leading-snug text-slate-600 dark:text-slate-300 sm:text-sm">
          {t('trial_bar_text')}
        </p>
        <button
          onClick={() => navigate('/register')}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          {t('trial_bar_button')}
          <ArrowRight size={16} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

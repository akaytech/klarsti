import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cerezKarariniOku, cerezKarariniYaz, type CerezKarari } from '../config/cerezIzni';

// Çerez şeridi: yalnızca ölçümleme için izin ister.
//
// DİKKAT: Bu bileşen tanıtım sayfasında da çiziliyor, yani ilk açılışta inen
// paketin içinde. Buraya `useRoadmapStore`, `firebase.ts` ya da başka ağır
// bir şey import edilmemeli (bkz. CLAUDE.md). Karar düz localStorage'a
// yazılıyor; ölçümlemeyi başlatan taraf onu kendi tarafında okuyor.
//
// "Reddet" düğmesi "Kabul et" ile aynı görünürlükte. Reddetmeyi zorlaştırmak
// (küçük yazı, gri renk, iki tık arkası) verilen izni geçersiz kılıyor.
//
// Kapatma düğmesi (X) bilerek YOK: şeridi kapatmak ne kabul ne ret sayılır
// ve kullanıcı hangi durumda olduğunu bilemez. Karar iki düğmeden biriyle
// veriliyor, o zamana kadar ölçümleme çalışmıyor.
export default function CookieConsent() {
  const { t } = useTranslation();
  const [karar, setKarar] = useState<CerezKarari | null | 'bekliyor'>('bekliyor');

  // İlk çizimde localStorage okumak yerine bir tur sonra: sunucudan gelen
  // HTML ile ilk çizim aynı kalsın, şerit bir anlığına yanıp sönmesin.
  useEffect(() => {
    setKarar(cerezKarariniOku());
  }, []);

  if (karar === 'bekliyor' || karar !== null) return null;

  const sec = (yeni: CerezKarari) => {
    cerezKarariniYaz(yeni);
    setKarar(yeni);
    // Kabul edildiyse ölçümleme bir sonraki sayfa yüklemesinde başlar.
    // Burada başlatmıyoruz: başlatan modül Firestore'u da beraberinde
    // getiriyor ve tanıtım sayfasını ağırlaştırırdı.
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie_banner_label', { defaultValue: 'Cookie notice' })}
      className="fixed inset-x-0 bottom-0 z-[120] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-2xl sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t('cookie_banner_text', { defaultValue: 'We use only what the app needs to work. We would also like to measure visits, and that needs your consent.' })}{' '}
          <Link to="/cookies" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('cookie_banner_more', { defaultValue: 'Details' })}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => sec('red')}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors sm:flex-none"
          >
            {t('cookie_banner_reject', { defaultValue: 'Essential only' })}
          </button>
          <button
            onClick={() => sec('kabul')}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors sm:flex-none"
          >
            {t('cookie_banner_accept', { defaultValue: 'Accept' })}
          </button>
        </div>
      </div>
    </div>
  );
}

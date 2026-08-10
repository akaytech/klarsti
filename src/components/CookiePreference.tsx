import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cerezKarariniOku, cerezKarariniYaz, type CerezKarari } from '../config/cerezIzni';

// Çerez politikası sayfasının içindeki tercih düğmeleri.
//
// Neden gerekli: şerit yalnızca bir kez çıkıyor. Kararını sonradan
// değiştirmek isteyen kullanıcının gidebileceği bir yer olmazsa, verilen
// izin geri alınamaz hale gelir.
//
// DİKKAT: Yasal metinlerle birlikte tanıtım sayfasında da çiziliyor; ağır
// bir şey import edilmemeli (bkz. CookieConsent.tsx).
export default function CookiePreference() {
  const { t } = useTranslation();
  const [karar, setKarar] = useState<CerezKarari | null>(null);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    setKarar(cerezKarariniOku());
    setYuklendi(true);
  }, []);

  const sec = (yeni: CerezKarari) => {
    cerezKarariniYaz(yeni);
    setKarar(yeni);
  };

  const durum = !yuklendi
    ? ''
    : karar === 'kabul'
      ? t('cookie_pref_state_allowed', { defaultValue: 'Right now: measurement is allowed.' })
      : karar === 'red'
        ? t('cookie_pref_state_denied', { defaultValue: 'Right now: measurement is off. Only what the app needs is stored.' })
        : t('cookie_pref_state_unset', { defaultValue: 'You have not chosen yet. Until you do, measurement stays off.' });

  const dugme = 'rounded-xl px-4 py-2 text-sm font-semibold transition-colors';

  return (
    <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 not-prose">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {t('cookie_pref_heading', { defaultValue: 'Your choice' })}
      </p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{durum}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => sec('red')}
          disabled={karar === 'red'}
          className={`${dugme} border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-default`}
        >
          {t('cookie_pref_deny_btn', { defaultValue: 'Turn measurement off' })}
        </button>
        <button
          onClick={() => sec('kabul')}
          disabled={karar === 'kabul'}
          className={`${dugme} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-default`}
        >
          {t('cookie_pref_allow_btn', { defaultValue: 'Allow measurement' })}
        </button>
      </div>
      {/* Kabul edilen izin ölçümlemeyi bir sonraki sayfa açılışında
          başlatıyor; reddedilen izin ise anında geçerli olmuyor çünkü
          Google'ın betiği zaten yüklenmiş olabilir. İkisini de dürüstçe
          söylüyoruz, yoksa kullanıcı düğmeye basıp hiçbir şey olmadığını
          görüyor ve haklı olarak güvenmiyor. */}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {t('cookie_pref_reload_note', { defaultValue: 'The change takes full effect the next time the page loads.' })}
      </p>
    </div>
  );
}

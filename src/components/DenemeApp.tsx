import { Suspense, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { denemeKipiniAc, denemeKipiKapat } from '../utils/denemeKipi';
import { denemeyiKaydetmeyeBasla, denemeyiYukle } from '../store/denemeDeposu';
import { gecikmeliEkran } from '../utils/surumTazeleme';
import { logAppEvent } from '../firebase';
import { PROJECT_TOOLS } from '../config/tools';

const Workspace = gecikmeliEkran(() => import('./Workspace'));

/**
 * Hesapsız deneme: klarsti.com/dene
 *
 * Ziyaretçi kaydolmadan gerçek tuvali kullanıyor. Uygulamanın kendisiyle
 * aynı bileşenler çiziliyor (Navbar + Workspace); fark üç yerde:
 *
 *   - SyncManager takılmıyor → hiçbir şey buluta yazılmıyor.
 *   - Üst sağdaki ajanda/çalışmalar düğmeleri yok; hepsi hesaba bağlı. Onların
 *     yerinde "Hesap Aç" duruyor (bkz. DenemeHesapDugmesi).
 *   - Çizilen tarayıcıda saklanıyor (bkz. denemeDeposu), hesap açılınca
 *     hesaba taşınıyor (bkz. denemeDevri).
 *
 * DİKKAT: Bu ekran gecikmeli yükleniyor (bkz. App.tsx). Tanıtım sayfasını
 * açan ziyaretçi tuval kodunu ve depoyu indirmiyor; yalnızca "dene" diyen
 * indiriyor.
 */
/**
 * `arac`: /dene/{arac} adresiyle gelindiyse açılacak araç. Doğrudan /dene ile
 * gelindiğinde null ve karşılama ekranı açılır. Tanınmayan bir ad (elle
 * yazılmış adres) da karşılama ekranına düşer.
 */
export default function DenemeApp({ arac }: { arac?: string | null }) {
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    denemeKipiniAc();
    // Araç, deneme yüklenirken tek seferde konuyor: sonradan koysaydık ekran
    // önce karşılama ekranını çizip sonra araca atlardı.
    denemeyiYukle(PROJECT_TOOLS.some((x) => x.id === arac) ? arac : null);
    setHazir(true);
    logAppEvent('trial_opened');
    const kaydetmeyiBirak = denemeyiKaydetmeyeBasla();
    return () => {
      kaydetmeyiBirak();
      denemeKipiKapat();
    };
    // Bilerek yalnızca ilk açılışta: `arac` sonradan değişse bile deneme
    // yeniden yüklenmemeli, yoksa kullanıcının o an çizdiği tarayıcıdaki
    // son kayda geri döner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hazir) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
            </div>
          }
        >
          <Workspace />
        </Suspense>
      </div>
    </>
  );
}

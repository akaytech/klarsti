import { Suspense, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { denemeKipiniAc, denemeKipiKapat } from '../utils/denemeKipi';
import { denemeyiKaydetmeyeBasla, denemeyiYukle } from '../store/denemeDeposu';
import { gecikmeliEkran } from '../utils/surumTazeleme';
import { logAppEvent } from '../firebase';

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
export default function DenemeApp() {
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    denemeKipiniAc();
    denemeyiYukle();
    setHazir(true);
    logAppEvent('trial_opened');
    const kaydetmeyiBirak = denemeyiKaydetmeyeBasla();
    return () => {
      kaydetmeyiBirak();
      denemeKipiKapat();
    };
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

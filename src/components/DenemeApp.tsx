import { Suspense, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { denemeKipiniAc, denemeKipiKapat } from '../utils/denemeKipi';
import { denemeyiKaydetmeyeBasla, denemeyiYukle } from '../store/denemeDeposu';
import { gecikmeliEkran } from '../utils/surumTazeleme';
import { PROJECT_TOOLS } from '../config/tools';

const Workspace = gecikmeliEkran(() => import('./Workspace'));

/**
 * "Deneme acildi" olcum olayi.
 *
 * Neden bu kadar dolambacli: olayi gonderen fonksiyon src/firebase.ts icinde
 * ve o dosya ayni zamanda Firestore baglantisini kuruyor. Bu dosyanin en
 * ustunde durgun (statik) bir import olarak dururken, tek bir istatistik
 * satiri yuzunden hesapsiz deneme sayfasina 114 KB'lik veritabani
 * kutuphanesi iniyordu -- hem de sayfanin cizilecegi anin tam ortasinda
 * (olcumde 183-510 ms arasi, sayfadaki en uzun indirme).
 *
 * Denemede cizilen her sey tarayicida duruyor (bkz. denemeDeposu);
 * Firestore'a hic dokunulmuyor. Yani o dosyanin sayfa acilirken inmesi icin
 * hicbir sebep yok.
 *
 * Simdi hem import hem olay `load`dan sonraya birakiliyor: sayfa cizilip
 * ilk kaynaklar bittikten sonra. Olay kaybolmuyor, yalnizca geciyor.
 */
const olcumuGonder = () => {
  const gonder = () => {
    import('../firebase').then((m) => m.logAppEvent('trial_opened')).catch(() => {});
  };
  if (document.readyState === 'complete') gonder();
  else window.addEventListener('load', gonder, { once: true });
};

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
    olcumuGonder();
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

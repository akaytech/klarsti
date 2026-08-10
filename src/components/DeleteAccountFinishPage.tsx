import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  bekleyenSilmeyiOku, bekleyenSilmeyiSil, baglantiylaDogrula, hesabiSil,
  silmeBaglantisiMi, type SilmeAdimi,
} from '../store/hesapSilme';
import { auth } from '../firebaseCore';
import { CONTACT_EMAIL } from '../config/iletisim';

// Maildeki onay bağlantısının döndüğü sayfa: klarsti.com/hesap-sil
//
// Silmenin gerçekten olduğu yer burası. İlk ekran (DeleteAccountModal)
// yalnızca maili yolluyor.
//
// Oturum aranmıyor: kullanıcı bağlantıyı başka bir cihazda ya da çıkış
// yaptıktan sonra açmış olabilir. Bu, uygulamaya giremeyen birinin de
// verisini silebilmesi demek — kanunen olması gereken de bu.
//
// Kendiliğinden başlamıyor, kullanıcı düğmeye basıyor. Bağlantı önizleme
// yapan istemciler (kurumsal posta taramaları) linkleri kendiliğinden
// açabiliyor; tek tık ile silinen bir sayfa olsaydı hesap, kullanıcı maili
// görmeden gitmiş olabilirdi.
type Durum = 'hazir' | 'siliniyor' | 'bitti' | 'gecersiz' | 'hata';

export default function DeleteAccountFinishPage() {
  const { t } = useTranslation();
  const [durum, setDurum] = useState<Durum>('hazir');
  const [adim, setAdim] = useState<SilmeAdimi | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [eposta, setEposta] = useState<string | null>(null);
  const [elleEposta, setElleEposta] = useState('');
  const adresRef = useRef(window.location.href);

  useEffect(() => {
    if (!silmeBaglantisiMi(adresRef.current)) {
      setDurum('gecersiz');
      return;
    }
    // Adres bu cihazda saklanmış olabilir. Başka cihazdan açıldıysa yok;
    // o zaman kullanıcıdan isteniyor. Firebase bağlantıyı doğrularken
    // adresi de şart koşuyor: link tek başına yetseydi, onu ele geçiren
    // biri istediği hesaba girebilirdi.
    setEposta(bekleyenSilmeyiOku());
  }, []);

  const sil = async () => {
    const adres = eposta ?? elleEposta.trim();
    if (!adres) return;
    setDurum('siliniyor');
    setHata(null);
    try {
      setAdim('dogrulama');
      await baglantiylaDogrula(adres, adresRef.current);

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Oturum kurulamadı.');

      await hesabiSil(uid, setAdim);
      bekleyenSilmeyiSil();
      setDurum('bitti');
    } catch (err: any) {
      console.error('Hesap silinemedi:', err);
      const kod = err?.code ?? '';
      if (kod === 'auth/user-mismatch') {
        setHata(t('delete_account_error_mismatch', { defaultValue: 'That is a different account. Nothing was deleted.' }));
      } else if (kod === 'auth/invalid-action-code' || kod === 'auth/expired-action-code') {
        setHata(t('delete_account_error_expired', { defaultValue: 'This link has expired or has already been used. Start again from the app. Nothing was deleted.' }));
      } else if (kod === 'auth/invalid-email') {
        setHata(t('delete_account_error_email', { defaultValue: 'That address does not match this link. Nothing was deleted.' }));
      } else {
        setHata(t('delete_account_error_generic', { defaultValue: 'The account could not be deleted. Nothing was lost — please try again, or write to us.' }));
      }
      setDurum('hata');
      setAdim(null);
    }
  };

  const adimYazisi = (a: SilmeAdimi | null) => {
    switch (a) {
      case 'dogrulama': return t('delete_account_step_auth', { defaultValue: 'Verifying identity…' });
      case 'calismalar': return t('delete_account_step_works', { defaultValue: 'Deleting work…' });
      case 'klasorler': return t('delete_account_step_folders', { defaultValue: 'Deleting folders…' });
      case 'kisisel': return t('delete_account_step_personal', { defaultValue: 'Deleting notes…' });
      case 'paylasimlar': return t('delete_account_step_shares', { defaultValue: 'Removing you from shared items…' });
      case 'hesap': return t('delete_account_step_account', { defaultValue: 'Deleting the account…' });
      default: return '';
    }
  };

  const kart = 'w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl';

  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 text-slate-800 dark:text-slate-100">
      {durum === 'bitti' ? (
        <div className={kart}>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
            <h1 className="text-lg font-bold">
              {t('delete_account_done_title', { defaultValue: 'Your account has been deleted' })}
            </h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t('delete_account_done_body', { defaultValue: 'Everything in the account is gone: your folders, your work, your notes, and the sign-in account itself. Thank you for trying Klarsti.' })}
          </p>
          <a
            href="/"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {t('delete_account_done_home', { defaultValue: 'Back to the home page' })}
          </a>
        </div>
      ) : durum === 'gecersiz' ? (
        <div className={kart}>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={22} />
            <h1 className="text-lg font-bold">
              {t('delete_account_invalid_title', { defaultValue: 'This link is not valid' })}
            </h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t('delete_account_invalid_body', { defaultValue: 'The link may have expired or already been used. Start again from the account menu inside the app. Nothing was deleted.' })}
          </p>
          <a
            href="/"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {t('delete_account_done_home', { defaultValue: 'Back to the home page' })}
          </a>
        </div>
      ) : (
        <div className={kart}>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <AlertTriangle size={22} />
            <h1 className="text-lg font-bold">
              {t('delete_account_finish_title', { defaultValue: 'Confirm account deletion' })}
            </h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t('delete_account_finish_body', { defaultValue: 'This is the last step. Once you press the button, the account and everything in it are deleted. It cannot be undone.' })}
          </p>

          {eposta ? (
            <p className="mt-3 break-all text-sm font-semibold text-slate-700 dark:text-slate-200">{eposta}</p>
          ) : (
            <div className="mt-4">
              <label htmlFor="silme-eposta" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t('delete_account_finish_email_label', { defaultValue: 'Type the email address this link was sent to:' })}
              </label>
              <input
                id="silme-eposta"
                type="email"
                autoComplete="off"
                value={elleEposta}
                disabled={durum === 'siliniyor'}
                onChange={(e) => setElleEposta(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-60"
              />
            </div>
          )}

          {hata && (
            <p className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
              {hata}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>
            </p>
          )}

          {durum === 'siliniyor' && adim && (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 size={16} className="animate-spin" />
              {adimYazisi(adim)}
            </p>
          )}

          <button
            onClick={sil}
            disabled={durum === 'siliniyor' || (!eposta && !elleEposta.trim())}
            className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {durum === 'siliniyor' && <Loader2 size={16} className="animate-spin" />}
            {t('delete_account_confirm_btn', { defaultValue: 'Delete permanently' })}
          </button>
        </div>
      )}
    </div>
  );
}

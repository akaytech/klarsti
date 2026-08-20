import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { hesabiSil, kimligiTazele, girisYolu, type SilmeAdimi } from '../store/hesapSilme';
import { CONTACT_EMAIL } from '../config/iletisim';

// Hesap silme penceresi.
//
// Neden ortak ConfirmModal kullanılmadı: orası tek satır mesaj ve iki düğme
// için. Burada silinecek şeylerin dökümü, yazarak onaylama, giriş yöntemine
// göre değişen kimlik tazeleme ve adım adım ilerleme var.
//
// Yazarak onaylama (e-posta adresini yazdırmak) bilerek: bu pencerede
// "Sil" düğmesine yanlışlıkla basmanın bedeli, geri alınamayan bir kayıp.
// Yedek de yok, yani hiçbir kurtarma yolu bulunmuyor.
export default function DeleteAccountModal({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [onay, setOnay] = useState('');
  const [sifre, setSifre] = useState('');
  const [siliniyor, setSiliniyor] = useState(false);
  const [adim, setAdim] = useState<SilmeAdimi | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOnay('');
      setSifre('');
      setHata(null);
      setAdim(null);
      setSiliniyor(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const kacis = (e: KeyboardEvent) => {
      // Silme sürerken kapanmıyor: yarıda kesmek veriyi tutarsız bırakır.
      if (e.key === 'Escape' && !siliniyor) onClose();
    };
    document.addEventListener('keydown', kacis);
    return () => document.removeEventListener('keydown', kacis);
  }, [isOpen, onClose, siliniyor]);

  if (!isOpen || !user) return null;

  const yol = girisYolu();
  const eslesti = onay.trim().toLowerCase() === (user.email || '').toLowerCase();
  const sifreGerekli = yol === 'password';
  const hazir = eslesti && (!sifreGerekli || sifre.length > 0);

  const adimYazisi = (a: SilmeAdimi | null) => {
    switch (a) {
      case 'dogrulama': return t('delete_account_step_auth', { defaultValue: 'Verifying identity…' });
      case 'calismalar': return t('delete_account_step_works', { defaultValue: 'Deleting your work…' });
      case 'klasorler': return t('delete_account_step_folders', { defaultValue: 'Deleting your folders…' });
      case 'kisisel': return t('delete_account_step_personal', { defaultValue: 'Deleting your notes…' });
      case 'paylasimlar': return t('delete_account_step_shares', { defaultValue: 'Removing you from shared items…' });
      case 'hesap': return t('delete_account_step_account', { defaultValue: 'Deleting your account…' });
      default: return '';
    }
  };

  const sil = async () => {
    if (!hazir || siliniyor) return;
    setSiliniyor(true);
    setHata(null);
    try {
      setAdim('dogrulama');
      await kimligiTazele(sifreGerekli ? sifre : undefined);
      await hesabiSil(user.uid, setAdim);
      // Hesap gitti; oturum dinleyicisi kullanıcıyı dışarı alacak. Sayfayı
      // baştan yüklemek en temizi: bellekte kalan proje/çalışma verisi
      // silinmiş bir hesaba ait ve ekranda durmasının anlamı yok.
      window.location.replace('/');
    } catch (err: any) {
      console.error('Hesap silinemedi:', err);
      const kod = err?.code ?? '';
      if (kod === 'auth/wrong-password' || kod === 'auth/invalid-credential') {
        setHata(t('delete_account_error_password', { defaultValue: 'The password is incorrect.' }));
      } else if (kod === 'auth/popup-closed-by-user' || kod === 'auth/cancelled-popup-request') {
        setHata(t('delete_account_error_cancelled', { defaultValue: 'Identity check was cancelled. Nothing was deleted.' }));
      } else if (kod === 'auth/user-mismatch') {
        // Google penceresinde başka bir hesap seçildi. Eskiden buraya genel
        // hata metni düşüyordu ve kullanıcı neyi yanlış yaptığını anlamıyordu.
        setHata(t('delete_account_error_mismatch', { defaultValue: 'That is a different account. Choose the account you are deleting. Nothing was deleted.' }));
      } else if (kod === 'auth/popup-blocked') {
        setHata(t('delete_account_error_popup', { defaultValue: 'Your browser blocked the sign-in window. Allow pop-ups and try again.' }));
      } else {
        setHata(t('delete_account_error_generic', { defaultValue: 'The account could not be deleted. Nothing was lost — please try again, or write to us.' }));
      }
      setSiliniyor(false);
      setAdim(null);
    }
  };

  const kutu = 'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-60';

  return (
    <div
      className="perde-gir fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={() => { if (!siliniyor) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hesap-silme-basligi"
        className="kutu-gir bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <AlertTriangle size={20} />
            <h2 id="hesap-silme-basligi" className="font-semibold text-lg">
              {t('delete_account_title', { defaultValue: 'Delete account' })}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={siliniyor}
            aria-label={t('close', { defaultValue: 'Close' })}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('delete_account_intro', { defaultValue: 'This deletes your account and everything in it. It cannot be undone, and there is no backup to restore from.' })}
          </p>

          <ul className="list-disc ps-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>{t('delete_account_item_works', { defaultValue: 'All your folders and every piece of work inside them' })}</li>
            <li>{t('delete_account_item_personal', { defaultValue: 'Your agenda and end-of-day notes' })}</li>
            <li>{t('delete_account_item_shares', { defaultValue: 'Anything you shared — the people you shared it with will lose access' })}</li>
            <li>{t('delete_account_item_login', { defaultValue: 'Your sign-in account' })}</li>
          </ul>

          <p className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {t('delete_account_export_hint', { defaultValue: 'Want a copy of your work first? Export what you need before deleting, or write to us.' })}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>

          <div>
            <label htmlFor="hesap-silme-onay" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('delete_account_confirm_label', { defaultValue: 'To confirm, type your email address:' })}
            </label>
            <p className="mt-1 mb-2 text-xs text-slate-500 dark:text-slate-400 break-all">{user.email}</p>
            <input
              id="hesap-silme-onay"
              type="text"
              autoComplete="off"
              value={onay}
              disabled={siliniyor}
              onChange={(e) => setOnay(e.target.value)}
              className={kutu}
            />
          </div>

          {sifreGerekli && (
            <div>
              <label htmlFor="hesap-silme-sifre" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t('delete_account_password_label', { defaultValue: 'Your password' })}
              </label>
              <p className="mt-1 mb-2 text-xs text-slate-500 dark:text-slate-400">
                {t('delete_account_password_hint', { defaultValue: 'Asked once more so nobody can delete your account from an open session.' })}
              </p>
              <input
                id="hesap-silme-sifre"
                type="password"
                autoComplete="current-password"
                value={sifre}
                disabled={siliniyor}
                onChange={(e) => setSifre(e.target.value)}
                className={kutu}
              />
            </div>
          )}

          {yol === 'google' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('delete_account_google_hint', { defaultValue: 'A Google window will open and ask for your password — so that someone with brief access to your device cannot delete your account.' })}
            </p>
          )}

          {hata && (
            <p className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
              {hata}
            </p>
          )}

          {siliniyor && adim && (
            <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 size={16} className="animate-spin" />
              {adimYazisi(adim)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={siliniyor}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40"
          >
            {t('cancel')}
          </button>
          <button
            onClick={sil}
            disabled={!hazir || siliniyor}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {siliniyor && <Loader2 size={16} className="animate-spin" />}
            {t('delete_account_confirm_btn', { defaultValue: 'Delete permanently' })}
          </button>
        </div>
      </div>
    </div>
  );
}

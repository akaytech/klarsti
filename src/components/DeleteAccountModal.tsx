import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Loader2, MailCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { silmeBaglantisiGonder } from '../store/hesapSilme';
import { CONTACT_EMAIL } from '../config/iletisim';

// Hesap silmenin ilk adımı: ne silineceğini anlatır ve onay bağlantısını
// kullanıcının adresine yollar. Silmenin kendisi burada olmuyor; mailden
// dönülen /hesap-sil sayfasında tamamlanıyor (bkz. DeleteAccountFinishPage).
//
// Neden iki adım: silme geri alınamıyor ve yedek de yok. Tek ekranda
// bitseydi, cihazını kısa süreliğine birine emanet eden kullanıcının hesabı
// o kişi tarafından silinebilirdi. Artık posta kutusuna da erişmek gerekiyor.
//
// Yazarak onaylama da duruyor: mail göndermek de bedava bir işlem değil,
// yanlışlıkla basılan düğme kullanıcıya boşuna "hesabın siliniyor" maili
// yollamamalı.
export default function DeleteAccountModal({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [onay, setOnay] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [gonderildi, setGonderildi] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOnay('');
      setHata(null);
      setGonderildi(false);
      setGonderiliyor(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const kacis = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !gonderiliyor) onClose();
    };
    document.addEventListener('keydown', kacis);
    return () => document.removeEventListener('keydown', kacis);
  }, [isOpen, onClose, gonderiliyor]);

  if (!isOpen || !user) return null;

  const eslesti = onay.trim().toLowerCase() === (user.email || '').toLowerCase();

  const gonder = async () => {
    if (!eslesti || gonderiliyor) return;
    setGonderiliyor(true);
    setHata(null);
    try {
      await silmeBaglantisiGonder(user.email);
      setGonderildi(true);
    } catch (err: any) {
      console.error('Silme baglantisi gonderilemedi:', err);
      setHata(t('delete_account_error_send', { defaultValue: 'The link could not be sent. Nothing was deleted — please try again, or write to us.' }));
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={() => { if (!gonderiliyor) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hesap-silme-basligi"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className={`flex items-center gap-2 ${gonderildi ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-500'}`}>
            {gonderildi ? <MailCheck size={20} /> : <AlertTriangle size={20} />}
            <h2 id="hesap-silme-basligi" className="font-semibold text-lg">
              {gonderildi
                ? t('delete_account_sent_title', { defaultValue: 'Check your email' })
                : t('delete_account_title', { defaultValue: 'Delete account' })}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={gonderiliyor}
            aria-label={t('close_modal', { defaultValue: 'Close' })}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {gonderildi ? (
          <div className="p-5 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('delete_account_sent_body', { defaultValue: 'We sent a confirmation link to {{eposta}}. Your account will be deleted only after you open that link.', eposta: user.email })}
            </p>
            {/* Spam uyarısı: mail Firebase'in kendi adresinden gidiyor, marka
                alan adımızdan değil. Gereksiz klasörüne düşmesi olağan ve
                kullanıcı bunu bilmezse "mail gelmedi" diye takılıp kalıyor. */}
            <p className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t('delete_account_sent_spam', { defaultValue: 'If it has not arrived within a few minutes, check your spam or junk folder.' })}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('delete_account_sent_cancel', { defaultValue: 'Changed your mind? Just ignore the email — nothing happens on its own.' })}
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('delete_account_intro', { defaultValue: 'This deletes the account and everything in it. It cannot be undone, and there is no backup to restore from.' })}
            </p>

            <ul className="list-disc ps-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li>{t('delete_account_item_works', { defaultValue: 'All folders and every piece of work inside them' })}</li>
              <li>{t('delete_account_item_personal', { defaultValue: 'The agenda and end-of-day notes' })}</li>
              <li>{t('delete_account_item_shares', { defaultValue: 'Everything shared — the people it was shared with lose access' })}</li>
              <li>{t('delete_account_item_login', { defaultValue: 'The sign-in account' })}</li>
            </ul>

            <p className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {t('delete_account_export_hint', { defaultValue: 'Want a copy first? Export what you need before deleting, or write to us.' })}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('delete_account_link_hint', { defaultValue: 'We will email you a confirmation link. The account is deleted only after you open it.' })}
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
                disabled={gonderiliyor}
                onChange={(e) => setOnay(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') gonder(); }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-60"
              />
            </div>

            {hata && (
              <p className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
                {hata}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          {gonderildi ? (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {t('close_modal', { defaultValue: 'Close' })}
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={gonderiliyor}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-40"
              >
                {t('cancel_btn')}
              </button>
              <button
                onClick={gonder}
                disabled={!eslesti || gonderiliyor}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {gonderiliyor && <Loader2 size={16} className="animate-spin" />}
                {t('delete_account_send_btn', { defaultValue: 'Email me the deletion link' })}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { legalIcerik, type LegalType } from '../content/legalContent';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType;
}

// Uygulama içindeki açılır pencere. Metinler burada durmuyor: aynı içerik
// herkese açık /privacy ve /terms sayfalarında da gösteriliyor, bu yüzden
// tek kopyası src/content/legalContent.tsx içinde.
const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const { t, i18n } = useTranslation();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 10);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtnRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 id="legal-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            {type === 'privacy'
              ? t('privacy_policy_title')
              : type === 'cookies'
                ? t('cookie_policy_title', { defaultValue: 'Cookie Policy' })
                : t('terms_of_use_title')}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label={t('close_modal', { defaultValue: 'Close' })}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-slate-700 dark:text-slate-300 space-y-4 text-sm md:text-base">
          {legalIcerik(type, i18n.language)}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;

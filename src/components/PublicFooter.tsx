import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import LegalModal, { CONTACT_EMAIL } from './LegalModal';

// lucide-react marka logoları içermiyor, bu yüzden inline SVG kullanıyoruz.
const LinkedInIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z"/>
  </svg>
);

const InstagramIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Giriş gerektirmeyen sayfaların ortak alt bilgisi. Yasal metin penceresinin
// durumu burada duruyor; sayfaların bunu bilmesi gerekmiyor.
export default function PublicFooter() {
  const { t } = useTranslation();
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo-192.png`} alt="Klarsti Logo" className="h-8 w-8 rounded-lg grayscale opacity-50" />
            <span className="text-lg font-bold text-slate-400">Klarsti</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <button onClick={() => setLegalType('terms')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
              {t('terms_of_use_title', { defaultValue: 'Terms of Use' })}
            </button>
            <button onClick={() => setLegalType('privacy')} className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors">
              {t('privacy_policy_title', { defaultValue: 'Privacy Policy' })}
            </button>
            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700"></span>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <Mail size={18} />
            </a>
            <a href="https://www.linkedin.com/in/kilicaslan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <LinkedInIcon size={18} />
            </a>
            <a href="https://www.instagram.com/kilicyavuz0/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <InstagramIcon size={18} />
            </a>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Klarsti. {t('landing_rights_reserved')}
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={legalType !== null}
        onClose={() => setLegalType(null)}
        type={legalType || 'privacy'}
      />
    </>
  );
}

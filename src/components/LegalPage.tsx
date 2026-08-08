import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { legalIcerik } from '../content/legalContent';
import type { LegalPage as LegalPageVerisi } from '../config/legalPages';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Herkese açık yasal sayfa: klarsti.com/privacy ve klarsti.com/terms.
//
// Aynı metin uygulama içindeki açılır pencerede de gösteriliyor; buradaki
// fark, içeriğin kendi adresinin olması. Google'ın giriş ekranı onayı ve
// uygulama mağazaları bu adresleri istiyor, açılır pencereyi kabul etmiyorlar.
//
// DİKKAT: Giriş gerektirmiyor, yani ilk açılışta inen paketin içinde.
// Buraya `useRoadmapStore` ya da `@xyflow/react` girmemeli.
export default function LegalPage({ sayfa }: { sayfa: LegalPageVerisi }) {
  const { t, i18n } = useTranslation();
  const baslik = t(sayfa.titleKey);

  useEffect(() => {
    sayfaMetaAyarla({
      title: sayfa.title,
      description: sayfa.description,
      canonical: `https://klarsti.com/${sayfa.slug}`
    });
    return () => sayfaMetaSifirla();
  }, [sayfa]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Klarsti
              </Link>
              <ChevronRight size={15} className="shrink-0 rtl:rotate-180" aria-hidden />
              <span className="text-slate-800 dark:text-slate-200">{baslik}</span>
            </nav>

            <h1 className="mb-10 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {baslik}
            </h1>

            <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {legalIcerik(sayfa.type, i18n.language)}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

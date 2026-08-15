import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, FolderOpen, Search } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { TOOLS } from '../config/tools';
import { toolTheme } from '../config/toolTheme';
import { tumCalismalar, calismayiAc, tarihEtiketi, type CalismaOzeti } from '../utils/calismaListesi';

/**
 * Tam sayfa çalışma listesi.
 *
 * Neden ayrı bir sayfa: aynı liste sağ üstteki açılır pencerede de var ama
 * orada üç kat derin bir ağaç, arama yok, tarih yok. Elli çalışması olan
 * kullanıcı dün bıraktığı işi orada bulamıyordu.
 *
 * Bu sayfa yalnızca bulup açmak için. Paylaşma, yeniden adlandırma ve silme
 * o menüde kalıyor; ikinci bir yere kopyalamak iki ayrı yerde bakımı gereken
 * iki ayrı silme düğmesi demek olurdu.
 */
export default function WorksPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { projects, works } = useRoadmapStore(useShallow((s) => ({ projects: s.projects, works: s.works })));

  const [arama, setArama] = useState('');
  const [siralama, setSiralama] = useState<'zaman' | 'ad'>('zaman');

  const araclar = useMemo(() => new Map(TOOLS.map((a) => [a.id, a])), []);

  const hepsi = useMemo(() => tumCalismalar(projects, works), [projects, works]);

  const gosterilecek = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase(i18n.language);
    // Arama çalışmanın adında, klasör adında ve araç adında birden geçiyor:
    // kullanıcı bazen "kahve dükkanı" diye, bazen "swot" diye arıyor.
    const suzulmus = q
      ? hepsi.filter((c) => {
          const aracAdi = araclar.get(c.tool);
          const aracMetni = aracAdi ? t(aracAdi.labelKey) : '';
          return `${c.ad} ${c.projectName} ${aracMetni}`.toLocaleLowerCase(i18n.language).includes(q);
        })
      : hepsi;

    return [...suzulmus].sort((a, b) =>
      siralama === 'ad'
        ? (a.ad || '').localeCompare(b.ad || '', i18n.language)
        : b.guncellendi - a.guncellendi
    );
  }, [hepsi, arama, siralama, araclar, t, i18n.language]);

  const Satir = ({ calisma }: { calisma: CalismaOzeti }) => {
    const arac = araclar.get(calisma.tool);
    const tema = toolTheme[calisma.tool] || toolTheme.wbs;
    const Simge = arac?.icon;
    return (
      <button
        onClick={() => calismayiAc(calisma)}
        className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-start transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tema.bg}`}>
          {Simge && <Simge size={22} className={tema.text} />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-slate-800 dark:text-slate-100">
            {calisma.ad || t('untitled_work')}
          </h3>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {calisma.projectName} · {arac ? t(arac.labelKey) : calisma.tool}
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap text-sm tabular-nums text-slate-400 dark:text-slate-500">
          {tarihEtiketi(calisma.guncellendi, i18n.language)}
        </span>
      </button>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-slate-50 p-6 custom-scrollbar dark:bg-slate-950 md:p-10">
      <div className="w-full max-w-4xl pb-20">

        <header className="mb-8 mt-4">
          <button
            onClick={() => navigate('/')}
            className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t('back', { defaultValue: 'Geri' })}
          </button>

          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-4xl">
            {t('my_projects')}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {t('works_count', { sayi: hepsi.length })}
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder={t('works_search_placeholder')}
              aria-label={t('works_search_placeholder')}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 ps-12 pe-4 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex shrink-0 gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {([['zaman', 'works_sort_recent'], ['ad', 'works_sort_name']] as const).map(([deger, anahtar]) => (
              <button
                key={deger}
                onClick={() => setSiralama(deger)}
                aria-pressed={siralama === deger}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  siralama === deger
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {t(anahtar)}
              </button>
            ))}
          </div>
        </div>

        {gosterilecek.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FolderOpen size={26} />
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {hepsi.length === 0 ? t('works_empty') : t('works_none_found')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {gosterilecek.map((c) => <Satir key={c.anahtar} calisma={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

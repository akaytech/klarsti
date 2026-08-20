import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, BookOpen, Compass, ListOrdered, Keyboard, Lightbulb, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useUIStore } from '../store/useUIStore';
import { loadToolGuides, type ToolGuide } from '../content/toolGuides';

// macOS'ta Ctrl diye yazmak yanlış olur; kısayol listesindeki `Mod` simgesi
// platforma göre çiziliyor.
const macMi = () => {
  if (typeof navigator === 'undefined') return false;
  const kaynak = (navigator as any).userAgentData?.platform || navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(kaynak);
};

function Tus({ deger }: { deger: string }) {
  const metin = deger === 'Mod' ? (macMi() ? '⌘' : 'Ctrl') : deger;
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
      {metin}
    </kbd>
  );
}

function Bolum({ baslik, ikon, children }: { baslik: string; ikon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {ikon}
        {baslik}
      </h3>
      {children}
    </section>
  );
}

// Kılavuz sağdan kayan bir panel; modal değil. Panel açıkken tuval çalışmaya
// devam ediyor, yani adımı okurken aynı anda uygulayabiliyorsun. Ekranı kaplayan
// blur da kalktı: React Flow'un üstünde her karede blur hesaplamak siteyi
// kasıyormuş gibi gösteriyordu.
export default function ToolGuidePanel() {
  const { t, i18n } = useTranslation();
  const activeTool = useRoadmapStore((s) => s.activeTool);
  const acik = useUIStore((s) => s.guideOpen);
  const setGuideOpen = useUIStore((s) => s.setGuideOpen);
  const kapatRef = useRef<HTMLButtonElement>(null);
  const [kilavuz, setKilavuz] = useState<ToolGuide | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  // Panel ilk açılışta zaten `acik` durumda takılıyor; ilk kareyi kapalı çizip
  // bir sonraki karede açmazsak giriş animasyonu hiç görünmüyor.
  const [bindi, setBindi] = useState(false);
  const gorunur = acik && bindi;

  useEffect(() => {
    const kare = requestAnimationFrame(() => setBindi(true));
    return () => cancelAnimationFrame(kare);
  }, []);

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);
    loadToolGuides(i18n.language)
      .then((paket) => {
        if (iptal) return;
        setKilavuz(activeTool ? paket[activeTool] ?? null : null);
      })
      .catch(() => {
        if (!iptal) setKilavuz(null);
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [activeTool, i18n.language]);

  useEffect(() => {
    if (!acik) return;
    const tus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    document.addEventListener('keydown', tus);
    const zaman = setTimeout(() => kapatRef.current?.focus(), 10);
    return () => {
      document.removeEventListener('keydown', tus);
      clearTimeout(zaman);
    };
  }, [acik, setGuideOpen]);

  const kapat = () => setGuideOpen(false);

  return (
    <>
      {/* Dar ekranda panel neredeyse tüm ekranı kapladığı için arkası karartılıyor.
          Geniş ekranda karartma yok: tuval görünür ve tıklanabilir kalsın diye. */}
      <div
        className={clsx(
          'fixed inset-0 z-[9998] bg-slate-900/50 transition-opacity duration-300 sm:hidden',
          gorunur ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={kapat}
        aria-hidden="true"
      />

      <aside
        data-tool-guide=""
        role="dialog"
        aria-labelledby="tool-guide-title"
        aria-hidden={!acik}
        {...(acik ? {} : ({ inert: '' } as any))}
        className={clsx(
          'fixed inset-y-0 end-0 z-[9999] flex w-[min(92vw,400px)] flex-col border-s border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-700 dark:bg-slate-800',
          gorunur ? 'translate-x-0' : 'pointer-events-none translate-x-full rtl:-translate-x-full'
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 id="tool-guide-title" className="flex items-center gap-2.5 text-lg font-black text-slate-900 dark:text-white">
            <BookOpen size={20} className="shrink-0 text-indigo-500" />
            <span className="truncate">{kilavuz?.title || t('guide_button')}</span>
          </h2>
          <button
            ref={kapatRef}
            onClick={kapat}
            aria-label={t('close', { defaultValue: 'Close' })}
            className="shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 text-sm text-slate-700 dark:text-slate-300">
          {yukleniyor && (
            <div className="flex h-40 items-center justify-center">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
            </div>
          )}

          {!yukleniyor && !kilavuz && (
            <p className="py-10 text-center text-slate-500 dark:text-slate-400">{t('guide_missing')}</p>
          )}

          {!yukleniyor && kilavuz && (
            <>
              <p className="rounded-xl bg-indigo-50 px-4 py-3 leading-relaxed text-slate-700 dark:bg-indigo-900/20 dark:text-slate-300">
                {kilavuz.summary}
              </p>

              <Bolum baslik={t('guide_when')} ikon={<Compass size={15} />}>
                <ul className="space-y-2">
                  {kilavuz.whenToUse.map((satir, i) => (
                    <li key={i} className="flex gap-2.5 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      <span>{satir}</span>
                    </li>
                  ))}
                </ul>
              </Bolum>

              <Bolum baslik={t('guide_steps')} ikon={<ListOrdered size={15} />}>
                <ol className="space-y-3">
                  {kilavuz.steps.map((satir, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-black text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {i + 1}
                      </span>
                      <span>{satir}</span>
                    </li>
                  ))}
                </ol>
              </Bolum>

              {kilavuz.shortcuts && kilavuz.shortcuts.length > 0 && (
                <Bolum baslik={t('guide_shortcuts')} ikon={<Keyboard size={15} />}>
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    {kilavuz.shortcuts.map((kisayol, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5 last:border-b-0 odd:bg-slate-50/60 dark:border-slate-700/60 dark:odd:bg-slate-900/30"
                      >
                        <span className="leading-snug">{kisayol.desc}</span>
                        <span className="flex shrink-0 items-center gap-1">
                          {kisayol.keys.map((tus, j) => (
                            <span key={j} className="flex items-center gap-1">
                              {j > 0 && <span className="text-xs text-slate-400">+</span>}
                              <Tus deger={tus} />
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </Bolum>
              )}

              {kilavuz.tips && kilavuz.tips.length > 0 && (
                <Bolum baslik={t('guide_tips')} ikon={<Lightbulb size={15} />}>
                  <ul className="space-y-2">
                    {kilavuz.tips.map((satir, i) => (
                      <li key={i} className="flex gap-2.5 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <span>{satir}</span>
                      </li>
                    ))}
                  </ul>
                </Bolum>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

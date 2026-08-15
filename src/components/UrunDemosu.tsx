import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';

/**
 * Ana sayfadaki hareketli ürün tanıtımı.
 *
 * Klipler uygulamanın kendisinden çekiliyor (bkz. scripts/klipCek.mjs); burada
 * yalnızca oynatılıyorlar. Ses yok, kontrol yok, başa sarıyorlar: amaç video
 * izletmek değil, ürünün ne olduğunu göstermek.
 *
 * DİKKAT: Bu bileşen tanıtım sayfasının içinde, yani siteyi ilk açan herkese
 * iniyor. Buraya depo (useRoadmapStore) ya da tuval kodu girmemeli.
 *
 * Ağırlık: yalnızca açık sekmenin videosu indiriliyor (preload="none" +
 * kapak resmi). Sekmeye basmadan hiçbir video inmiyor; ilk sekme de sayfa
 * görünür alana geldiğinde başlıyor.
 */

type Klip = { ad: string; adKey: string; aciklamaKey: string };

const KLIPLER: Klip[] = [
  { ad: 'is-kirilimi', adKey: 'tool_wbs', aciklamaKey: 'demo_wbs_desc' },
  { ad: 'bes-neden', adKey: 'tool_5whys', aciklamaKey: 'demo_whys_desc' },
  { ad: 'pareto', adKey: 'tool_pareto', aciklamaKey: 'demo_pareto_desc' },
  { ad: 'zihin-haritasi', adKey: 'tool_mindmap', aciklamaKey: 'demo_mindmap_desc' },
];

const azHareket = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function UrunDemosu() {
  const { t } = useTranslation();
  const tema = useTheme();
  const temaEki = tema.isDark ? 'koyu' : 'acik';
  const taban = import.meta.env.BASE_URL;

  const [acik, setAcik] = useState(0);
  const [gorunur, setGorunur] = useState(false);
  const sarmalRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bölüm ekrana girmeden video indirilmiyor.
  useEffect(() => {
    const oge = sarmalRef.current;
    if (!oge) return;
    if (!('IntersectionObserver' in window)) {
      setGorunur(true);
      return;
    }
    const gozcu = new IntersectionObserver(
      (girisler) => {
        if (girisler.some((g) => g.isIntersecting)) {
          setGorunur(true);
          gozcu.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    gozcu.observe(oge);
    return () => gozcu.disconnect();
  }, []);

  // Bölüm görünür olunca ve sekme/tema değişince video baştan oynasın.
  // preload="none" olduğu için indirme de ilk oynatmayla başlıyor.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !gorunur || azHareket()) return;
    video.currentTime = 0;
    const soz = video.play();
    if (soz) soz.catch(() => { /* tarayıcı izin vermezse kapak resmi kalır */ });
  }, [acik, temaEki, gorunur]);

  const klip = KLIPLER[acik];
  const kaynak = `${taban}tanitim/${klip.ad}-${temaEki}`;

  return (
    <div ref={sarmalRef} className="mx-auto mt-16 max-w-5xl">
      {/* Sekmeler */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        {KLIPLER.map((k, i) => (
          <button
            key={k.ad}
            type="button"
            onClick={() => setAcik(i)}
            aria-pressed={i === acik}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              i === acik
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-slate-200 bg-white/60 text-slate-600 hover:bg-white dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {t(k.adKey)}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-2xl dark:border-slate-800">
        {/* key: sekme ya da tema değişince tarayıcı yeni kaynağı yüklesin. */}
        <video
          key={kaynak}
          ref={videoRef}
          className="block aspect-video w-full"
          poster={`${kaynak}-poster.jpg`}
          preload="none"
          muted
          loop
          playsInline
          aria-label={`${t(klip.adKey)} — ${t(klip.aciklamaKey)}`}
        >
          <source src={`${kaynak}.mp4`} type="video/mp4" />
        </video>
      </div>

      <p className="mt-4 text-center text-base text-slate-600 dark:text-slate-400">{t(klip.aciklamaKey)}</p>
    </div>
  );
}

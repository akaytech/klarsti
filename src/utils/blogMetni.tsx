import type { ReactNode } from 'react';
import { blogAyristir, type Parca } from './blogAyristir';

/**
 * Blog yazısını ekrana çizer.
 *
 * Metnin ayrıştırılması burada DEĞİL, blogAyristir.ts içinde: aynı ayrıştırma
 * build tarafında da kullanılıyor ve arama motoru için gerçek HTML üretiyor
 * (bkz. scripts/staticPages.mjs). Tek ayrıştırıcı, iki çizici.
 *
 * Neden hazır bir markdown kütüphanesi değil: hazır kütüphanelerin çoğu HTML
 * metni üretiyor ve o metin sayfaya `dangerouslySetInnerHTML` ile basılıyor.
 * Burada hiç HTML metni üretilmiyor; doğrudan React öğeleri kuruluyor, yani
 * yazının içine yazılmış bir `<script>` yazı olarak görünür, çalışmaz.
 */

function parcalariCiz(parcalar: Parca[], anahtar: string): ReactNode[] {
  return parcalar.map((p, i) => {
    const k = `${anahtar}-${i}`;
    switch (p.tur) {
      case 'kalin':
        return <strong key={k} className="font-bold">{p.metin}</strong>;
      case 'egik':
        return <em key={k}>{p.metin}</em>;
      case 'baglanti':
        return (
          <a
            key={k}
            href={p.adres}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {p.metin}
          </a>
        );
      case 'resim':
        return (
          <img
            key={k}
            src={p.adres}
            alt={p.aciklama}
            loading="lazy"
            className="my-6 w-full rounded-2xl border border-slate-200 dark:border-slate-700"
          />
        );
      default:
        return p.metin;
    }
  });
}

export function blogMetniCiz(govde: string): ReactNode[] {
  return blogAyristir(govde).map((blok, i) => {
    const k = `b${i}`;
    switch (blok.tur) {
      case 'baslik': {
        const icerik = parcalariCiz(blok.parcalar, k);
        if (blok.seviye === 1) {
          return <h2 key={k} className="mt-10 mb-4 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{icerik}</h2>;
        }
        if (blok.seviye === 2) {
          return <h3 key={k} className="mt-8 mb-3 text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{icerik}</h3>;
        }
        return <h4 key={k} className="mt-6 mb-2 text-lg font-bold text-slate-900 dark:text-white">{icerik}</h4>;
      }
      case 'liste':
        return (
          <ul key={k} className="my-4 list-disc space-y-2 ps-6 leading-relaxed text-slate-700 dark:text-slate-300">
            {blok.maddeler.map((madde, j) => (
              <li key={`${k}-${j}`}>{parcalariCiz(madde, `${k}-${j}`)}</li>
            ))}
          </ul>
        );
      case 'alinti':
        return (
          <blockquote key={k} className="my-6 border-s-4 border-indigo-400 bg-slate-50 dark:bg-slate-800/60 py-3 pe-4 ps-5 italic text-slate-600 dark:text-slate-300">
            {parcalariCiz(blok.parcalar, k)}
          </blockquote>
        );
      case 'video':
        return (
          // aspect-video: oynatıcı sabit yükseklikle konsaydı telefonda ya
          // kenarlarda siyah bant kalırdı ya da taşardı.
          <div key={k} className="my-6 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <iframe
              src={blok.adres}
              title={blok.adres}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        );
      default:
        return (
          <p key={k} className="my-4 leading-relaxed text-slate-700 dark:text-slate-300">
            {parcalariCiz(blok.parcalar, k)}
          </p>
        );
    }
  });
}

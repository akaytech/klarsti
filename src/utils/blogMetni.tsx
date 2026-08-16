import type { ReactNode } from 'react';

/**
 * Blog yazısının metnini ekrana çizer.
 *
 * Neden hazır bir kütüphane değil: iki sebep.
 *
 * 1. GÜVENLİK. Hazır markdown kütüphanelerinin çoğu HTML üretiyor ve o HTML
 *    sayfaya `dangerouslySetInnerHTML` ile basılıyor. Burada hiç HTML metni
 *    üretilmiyor; doğrudan React öğeleri kuruluyor, yani metnin içine
 *    yazılmış bir `<script>` yazı olarak görünür, çalışmaz.
 * 2. BOYUT. Blog sayfası herkese açık; tam bir markdown kütüphanesi bu iş
 *    için gereğinden ağır.
 *
 * Desteklenen yazım (panelde de aynısı yazıyor):
 *
 *   # Başlık            → büyük başlık
 *   ## Alt başlık       → orta başlık
 *   ### Küçük başlık    → küçük başlık
 *   - madde             → liste
 *   > alıntı            → alıntı bloğu
 *   **kalın**  *eğik*
 *   [yazı](adres)       → bağlantı
 *   ![açıklama](adres)  → resim
 *   Tek başına bir YouTube/Vimeo adresi → gömülü oynatıcı
 *
 * Boş satır paragrafları ayırır.
 */

/** Satırın tamamı bir video adresi mi? Öyleyse gömme adresini döner. */
export function videoGomme(satir: string): string | null {
  const adres = satir.trim();
  if (!/^https?:\/\/\S+$/.test(adres)) return null;

  const yt = adres.match(
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;

  const vimeo = adres.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

/**
 * Adres güvenli mi? Yalnızca http(s) geçiyor.
 *
 * `javascript:` ile başlayan bir bağlantı, tıklandığında sayfada kod
 * çalıştırır. Yazan tek kişi yönetici olsa da adresler dışarıdan kopyalanıp
 * yapıştırılıyor; filtre burada duruyor.
 */
function guvenliAdres(adres: string): string | null {
  const temiz = adres.trim();
  return /^https?:\/\//i.test(temiz) ? temiz : null;
}

/** Satır içi işaretleme: kalın, eğik, bağlantı, resim. */
function satirIci(metin: string, anahtar: string): ReactNode[] {
  const parcalar: ReactNode[] = [];
  // Sıra önemli: resim (`![]()`) bağlantıdan (`[]()`) önce denenmeli.
  const kalip = /(!?)\[([^\]]*)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let son = 0;
  let eslesme: RegExpExecArray | null;
  let sayac = 0;

  while ((eslesme = kalip.exec(metin)) !== null) {
    if (eslesme.index > son) parcalar.push(metin.slice(son, eslesme.index));
    const k = `${anahtar}-i${sayac++}`;

    const [tam, unlem, etiket, adres, kalin, egik] = eslesme;
    if (adres !== undefined) {
      const guvenli = guvenliAdres(adres);
      if (!guvenli) {
        // Tanınmayan adres olduğu gibi yazı olarak kalıyor: sessizce
        // yutulursa yazar neyin gitmediğini anlamıyor.
        parcalar.push(tam);
      } else if (unlem === '!') {
        parcalar.push(
          <img
            key={k}
            src={guvenli}
            alt={etiket}
            loading="lazy"
            className="my-6 w-full rounded-2xl border border-slate-200 dark:border-slate-700"
          />
        );
      } else {
        parcalar.push(
          <a
            key={k}
            href={guvenli}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {etiket || guvenli}
          </a>
        );
      }
    } else if (kalin !== undefined) {
      parcalar.push(<strong key={k} className="font-bold">{kalin}</strong>);
    } else if (egik !== undefined) {
      parcalar.push(<em key={k}>{egik}</em>);
    }
    son = eslesme.index + tam.length;
  }

  if (son < metin.length) parcalar.push(metin.slice(son));
  return parcalar;
}

export function blogMetniCiz(govde: string): ReactNode[] {
  const satirlar = (govde || '').replace(/\r\n/g, '\n').split('\n');
  const cikti: ReactNode[] = [];
  let paragraf: string[] = [];
  let liste: string[] = [];
  let sayac = 0;

  const paragrafiBitir = () => {
    if (paragraf.length === 0) return;
    const k = `p${sayac++}`;
    cikti.push(
      <p key={k} className="my-4 leading-relaxed text-slate-700 dark:text-slate-300">
        {satirIci(paragraf.join(' '), k)}
      </p>
    );
    paragraf = [];
  };

  const listeyiBitir = () => {
    if (liste.length === 0) return;
    const k = `l${sayac++}`;
    cikti.push(
      <ul key={k} className="my-4 list-disc space-y-2 ps-6 leading-relaxed text-slate-700 dark:text-slate-300">
        {liste.map((madde, i) => (
          <li key={`${k}-${i}`}>{satirIci(madde, `${k}-${i}`)}</li>
        ))}
      </ul>
    );
    liste = [];
  };

  const hepsiniBitir = () => {
    paragrafiBitir();
    listeyiBitir();
  };

  for (const ham of satirlar) {
    const satir = ham.trimEnd();

    if (satir.trim() === '') {
      hepsiniBitir();
      continue;
    }

    const video = videoGomme(satir);
    if (video) {
      hepsiniBitir();
      const k = `v${sayac++}`;
      cikti.push(
        // aspect-video: oynatıcı sabit yükseklikle konsaydı telefonda ya
        // kenarlarda siyah bant kalırdı ya da taşardı.
        <div key={k} className="my-6 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <iframe
            src={video}
            title={video}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
      continue;
    }

    const baslik = satir.match(/^(#{1,3})\s+(.*)$/);
    if (baslik) {
      hepsiniBitir();
      const k = `h${sayac++}`;
      const yazi = satirIci(baslik[2], k);
      if (baslik[1].length === 1) {
        cikti.push(<h2 key={k} className="mt-10 mb-4 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{yazi}</h2>);
      } else if (baslik[1].length === 2) {
        cikti.push(<h3 key={k} className="mt-8 mb-3 text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{yazi}</h3>);
      } else {
        cikti.push(<h4 key={k} className="mt-6 mb-2 text-lg font-bold text-slate-900 dark:text-white">{yazi}</h4>);
      }
      continue;
    }

    const alinti = satir.match(/^>\s?(.*)$/);
    if (alinti) {
      hepsiniBitir();
      const k = `a${sayac++}`;
      cikti.push(
        <blockquote key={k} className="my-6 border-s-4 border-indigo-400 bg-slate-50 dark:bg-slate-800/60 py-3 pe-4 ps-5 italic text-slate-600 dark:text-slate-300">
          {satirIci(alinti[1], k)}
        </blockquote>
      );
      continue;
    }

    const madde = satir.match(/^[-*]\s+(.*)$/);
    if (madde) {
      paragrafiBitir();
      liste.push(madde[1]);
      continue;
    }

    listeyiBitir();
    paragraf.push(satir.trim());
  }

  hepsiniBitir();
  return cikti;
}

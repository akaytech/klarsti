/**
 * Blog yazısının metnini bloklara ayırır.
 *
 * Neden ayrı bir dosya: aynı metni İKİ taraf çiziyor. Tarayıcı tarafı React
 * öğeleri kuruyor (bkz. blogMetni.tsx), build tarafı ise arama motoru için
 * gerçek HTML üretiyor (bkz. scripts/staticPages.mjs). İkisi metni ayrı ayrı
 * ayrıştırsaydı kaçınılmaz olarak birbirinden saparlardı: kullanıcının
 * ekranda gördüğü yazı ile Google'ın okuduğu yazı farklı olurdu.
 *
 * Bu dosya bilerek bağımlılıksız ve JSX içermiyor: build tarafı onu Node
 * içinde derleyip okuyor.
 *
 * Desteklenen yazım (yazma panelinde de aynısı yazıyor):
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

export type Parca =
  | { tur: 'yazi'; metin: string }
  | { tur: 'kalin'; metin: string }
  | { tur: 'egik'; metin: string }
  | { tur: 'baglanti'; metin: string; adres: string }
  | { tur: 'resim'; aciklama: string; adres: string };

export type Blok =
  | { tur: 'paragraf'; parcalar: Parca[] }
  | { tur: 'baslik'; seviye: 1 | 2 | 3; parcalar: Parca[] }
  | { tur: 'liste'; maddeler: Parca[][] }
  | { tur: 'alinti'; parcalar: Parca[] }
  | { tur: 'video'; adres: string };

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
export function guvenliAdres(adres: string): string | null {
  const temiz = adres.trim();
  return /^https?:\/\//i.test(temiz) ? temiz : null;
}

/** Satır içi işaretleme: kalın, eğik, bağlantı, resim. */
function satirIci(metin: string): Parca[] {
  const parcalar: Parca[] = [];
  // Sıra önemli: resim (`![]()`) bağlantıdan (`[]()`) önce denenmeli.
  const kalip = /(!?)\[([^\]]*)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let son = 0;
  let eslesme: RegExpExecArray | null;

  const yaziEkle = (m: string) => { if (m) parcalar.push({ tur: 'yazi', metin: m }); };

  while ((eslesme = kalip.exec(metin)) !== null) {
    yaziEkle(metin.slice(son, eslesme.index));
    const [tam, unlem, etiket, adres, kalin, egik] = eslesme;

    if (adres !== undefined) {
      const guvenli = guvenliAdres(adres);
      if (!guvenli) {
        // Tanınmayan adres olduğu gibi yazı olarak kalıyor: sessizce
        // yutulursa yazar neyin gitmediğini anlamıyor.
        yaziEkle(tam);
      } else if (unlem === '!') {
        parcalar.push({ tur: 'resim', aciklama: etiket, adres: guvenli });
      } else {
        parcalar.push({ tur: 'baglanti', metin: etiket || guvenli, adres: guvenli });
      }
    } else if (kalin !== undefined) {
      parcalar.push({ tur: 'kalin', metin: kalin });
    } else if (egik !== undefined) {
      parcalar.push({ tur: 'egik', metin: egik });
    }
    son = eslesme.index + tam.length;
  }

  yaziEkle(metin.slice(son));
  return parcalar;
}

export function blogAyristir(govde: string): Blok[] {
  const satirlar = (govde || '').replace(/\r\n/g, '\n').split('\n');
  const bloklar: Blok[] = [];
  let paragraf: string[] = [];
  let liste: string[] = [];

  const paragrafiBitir = () => {
    if (paragraf.length === 0) return;
    bloklar.push({ tur: 'paragraf', parcalar: satirIci(paragraf.join(' ')) });
    paragraf = [];
  };

  const listeyiBitir = () => {
    if (liste.length === 0) return;
    bloklar.push({ tur: 'liste', maddeler: liste.map(satirIci) });
    liste = [];
  };

  const hepsiniBitir = () => { paragrafiBitir(); listeyiBitir(); };

  for (const ham of satirlar) {
    const satir = ham.trimEnd();

    if (satir.trim() === '') { hepsiniBitir(); continue; }

    const video = videoGomme(satir);
    if (video) { hepsiniBitir(); bloklar.push({ tur: 'video', adres: video }); continue; }

    const baslik = satir.match(/^(#{1,3})\s+(.*)$/);
    if (baslik) {
      hepsiniBitir();
      bloklar.push({ tur: 'baslik', seviye: baslik[1].length as 1 | 2 | 3, parcalar: satirIci(baslik[2]) });
      continue;
    }

    const alinti = satir.match(/^>\s?(.*)$/);
    if (alinti) {
      hepsiniBitir();
      bloklar.push({ tur: 'alinti', parcalar: satirIci(alinti[1]) });
      continue;
    }

    const madde = satir.match(/^[-*]\s+(.*)$/);
    if (madde) { paragrafiBitir(); liste.push(madde[1]); continue; }

    listeyiBitir();
    paragraf.push(satir.trim());
  }

  hepsiniBitir();
  return bloklar;
}

/** Yazının düz metni. Arama motoru açıklaması ve özet için. */
export function blogDuzMetin(govde: string): string {
  const yaz = (parcalar: Parca[]): string =>
    parcalar.map((p) => (p.tur === 'resim' ? '' : p.tur === 'baglanti' ? p.metin : p.metin)).join('');
  return blogAyristir(govde)
    .map((b) => {
      if (b.tur === 'video') return '';
      if (b.tur === 'liste') return b.maddeler.map(yaz).join(' ');
      return yaz(b.parcalar);
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

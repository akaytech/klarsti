// Build sonunda her araç sayfası için gerçek bir HTML dosyası üretir ve
// sitemap'i yeniden yazar. `vite build`'den SONRA çalışmalı.
//
// Neden gerekli: uygulama tek sayfa. Sunucu her adrese aynı index.html'i
// döndürüyor, yani /wbs ile /swot arama motoruna aynı başlıkla, aynı
// açıklamayla görünür. Bunu React içinden düzeltmek yetmiyor: link önizlemesi
// üreten tarayıcılar (WhatsApp, LinkedIn, Slack, X) JavaScript çalıştırmaz,
// sadece ilk gelen HTML'i okur.
//
// Çözüm, index.html'in etiketleri değiştirilmiş kopyalarını dist/<slug>.html
// olarak yazmak. Firebase Hosting statik dosyayı rewrite kuralından önce
// servis ediyor, yani /wbs isteği doğrudan bu dosyaya düşüyor. JavaScript
// paketi aynı; uygulama açıldığında React zaten doğru sayfayı çiziyor.
//
// Dosyalar neden düz, klasör içinde değil: `dist/wbs/index.html` yazsaydık
// Firebase dizin dosyaları için adrese eğik çizgi ekliyor ve /wbs isteğini
// /wbs/ adresine yönlendiriyordu. O zaman canonical etiketiyle gerçekten
// servis edilen adres birbirinden ayrılırdı. firebase.json'daki
// `cleanUrls` ayarı /wbs isteğini doğrudan wbs.html'e bağlıyor.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { yayinlananYazilariCek } from './blogCek.mjs';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(KOK, 'dist');
const SITE = 'https://klarsti.com';

const oku = (dosya) =>
  JSON.parse(fs.readFileSync(path.join(KOK, 'src/content', dosya), 'utf8'));

const araclar = oku('toolPages.json');
// Yasal sayfalar (gizlilik, kullanım koşulları) da statik üretiliyor: Google'ın
// giriş ekranı onayı bu adresleri açıp okuyabilmeyi bekliyor, ve doğru
// başlıkla görünmeleri gerekiyor.
const yasal = oku('legalPages.json');
// Giriş ve kayıt sayfaları: ikisi de aynı kabuktan servis edildiği için arama
// sonucunda ana sayfayla aynı başlığı taşıyorlardı. Kendi başlıkları olmadan
// Google'ın arama sonucunun altında gösterdiği kısayollar arasına ("site
// linkleri") girme ihtimalleri yok. Bu kısayolları kod yazarak zorlayamıyoruz,
// seçimi Google yapıyor; yapabileceğimiz tek şey sayfaları aday olabilecek
// hale getirmek: taranabilir olsunlar (bkz. public/robots.txt), kendi
// başlıkları ve açıklamaları olsun, site haritasında dursunlar.
const girisler = oku('authPages.json');
// İletişim sayfası: arama motorunda "klarsti destek" gibi bir aramanın
// karşılığı olması gerekiyor, ve mailto: bağlantısı bir sayfa sayılmadığı
// için site "iletişim bilgisi olmayan site" görünümündeydi.
const iletisim = oku('contactPage.json');
// Hakkımızda: hem ziyaretçinin hem arama motorunun "bu sitenin arkasında kim
// var" sorusunun karşılığı. İletişim sayfasıyla aynı öncelikte.
const hakkimizda = oku('aboutPage.json');
// Blog liste sayfası. Yazıların kendisi Firestore'dan geliyor (aşağıda).
const blogListesi = oku('blogPage.json');

const TUR = { ARAC: 'arac', YASAL: 'yasal', GIRIS: 'giris', ILETISIM: 'iletisim', HAKKIMIZDA: 'hakkimizda', BLOG: 'blog' };
const ONCELIK = { [TUR.ARAC]: '0.8', [TUR.BLOG]: '0.7', [TUR.ILETISIM]: '0.6', [TUR.HAKKIMIZDA]: '0.6', [TUR.GIRIS]: '0.5', [TUR.YASAL]: '0.3' };
const sayfalar = [
  ...araclar.map((s) => ({ ...s, tur: TUR.ARAC })),
  ...yasal.map((s) => ({ ...s, tur: TUR.YASAL })),
  ...girisler.map((s) => ({ ...s, tur: TUR.GIRIS })),
  ...iletisim.map((s) => ({ ...s, tur: TUR.ILETISIM })),
  ...hakkimizda.map((s) => ({ ...s, tur: TUR.HAKKIMIZDA })),
  ...blogListesi.map((s) => ({ ...s, tur: TUR.BLOG }))
];

const kabukYolu = path.join(DIST, 'index.html');
if (!fs.existsSync(kabukYolu)) {
  console.error('staticPages: dist/index.html yok. Once "vite build" calistir.');
  process.exit(1);
}
const kabuk = fs.readFileSync(kabukYolu, 'utf8');

// Sayfaya gömülecek bağlantılar sitenin kökünü bilmeli: Firebase yayınında "/",
// GitHub Pages önizlemesinde "/klarsti/" (bkz. vite.config.ts).
//
// Değer vite.config.ts'ten kopyalanmıyor, üretilmiş index.html'den okunuyor.
// Kopyalamayı denedik: `build:firebase` komutundaki ortam değişkeni yalnızca
// `vite build` adımına geçiyor, ardından çalışan bu script'e geçmiyor; sonuç,
// Firebase yayınına "/klarsti/..." linkleri gömmekti. Paket yollarında kök
// zaten yazıyor, tek doğru kaynak orası.
const kokEslesme = kabuk.match(/(?:src|href)="([^"]*?)assets\//);
if (!kokEslesme) {
  console.error('staticPages: dist/index.html icinde assets yolu bulunamadi, kok adres okunamiyor.');
  process.exit(1);
}
const KOKADRES = kokEslesme[1];

function kacir(deger) {
  return deger
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Etiket bulunamazsa sessizce geçmiyoruz: index.html ileride elle
// düzenlendiğinde sayfalar yanlış başlıkla yayına gitmesin.
function degistir(metin, kalip, yeni, ad) {
  if (!kalip.test(metin)) {
    throw new Error(`staticPages: index.html icinde "${ad}" bulunamadi`);
  }
  return metin.replace(kalip, yeni);
}

// Aynısı, ama yerine konan metin düz kabul ediliyor. String.replace ikinci
// argümandaki `$` dizilerini ($&, $1 ...) yorumluyor; kılavuz metninde bir
// dolar işareti geçtiğinde sayfa bozulmasın diye fonksiyonla veriyoruz.
function degistirDuz(metin, kalip, yeni, ad) {
  if (!kalip.test(metin)) {
    throw new Error(`staticPages: index.html icinde "${ad}" bulunamadi`);
  }
  return metin.replace(kalip, () => yeni);
}

function icerikDegistir(metin, anahtar, ad, deger) {
  const kalip = new RegExp(`(<meta\\s+${anahtar}="${ad}"\\s+content=")[^"]*(")`, 'i');
  return degistir(metin, kalip, `$1${kacir(deger)}$2`, `${ad} etiketi`);
}

// Yasal ve giriş sayfaları araç değil: onları "uygulama" diye tanıtmak yanlış
// olur, düz sayfa olarak işaretleniyorlar.
const aracMi = (sayfa) => sayfa.tur === TUR.ARAC;

function yapilandirilmisVeri(sayfa, adres) {
  const anaVarlik = !aracMi(sayfa)
    ? {
        '@type': 'WebPage',
        name: sayfa.name,
        url: adres,
        description: sayfa.description,
        publisher: { '@type': 'Organization', name: 'Klarsti', url: `${SITE}/` }
      }
    : {
        '@type': 'SoftwareApplication',
        name: `${sayfa.name} — Klarsti`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: adres,
        description: sayfa.description,
        publisher: { '@type': 'Organization', name: 'Klarsti', url: `${SITE}/` }
      };

  const veri = {
    '@context': 'https://schema.org',
    '@graph': [
      anaVarlik,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Klarsti', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: sayfa.name, item: adres }
        ]
      }
    ]
  };
  // `</script>` dizisi JSON içinde geçerse script erken kapanır; kaynak
  // metinlerimizde yok ama kural olarak kaçırıyoruz.
  const json = JSON.stringify(veri, null, 2).replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">\n${json}\n</script>\n`;
}

/**
 * İngilizce araç kılavuzlarını build sırasında okur.
 *
 * Metinler `src/content/toolGuides/en.ts` içinde duruyor ve uygulamada
 * yalnızca tarayıcı sayfayı açtıktan sonra indiriliyordu. Bu script Node'da
 * çalışıyor, TypeScript dosyasını doğrudan içeri alamıyor; derleyiciyi
 * kullanıp bellekte JavaScript'e çevirip öyle okuyoruz. Dosya düz veri,
 * içinde tip tanımından başka bir şey yok, o da çeviride siliniyor.
 *
 * `typescript` zaten devDependency ve CI `npm ci` ile kuruyor.
 */
async function ingilizceKilavuzlar() {
  const kaynak = fs.readFileSync(path.join(KOK, 'src/content/toolGuides/en.ts'), 'utf8');
  const js = ts.transpileModule(kaynak, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const modul = await import(`data:text/javascript;base64,${Buffer.from(js, 'utf8').toString('base64')}`);
  return modul.default;
}

// Kılavuzun bölüm başlıkları arayüzde i18n'den geliyor; burada üretilen sayfa
// bilerek İngilizce (bkz. index.html'deki lang="en" ve sayfa başlıkları).
const BASLIK = {
  when: 'When to use it',
  steps: 'Step by step',
  shortcuts: 'Keyboard shortcuts (desktop)',
  tips: 'Tips',
  other: 'Other tools'
};

// `Mod` arayüzde macOS'ta ⌘, başka yerde Ctrl çiziliyor. Statik dosya tek bir
// hali taşıyabilir; okuyan çoğunluk için Ctrl yazıyoruz.
const tus = (t) => `<kbd class="inline-flex min-w-[26px] items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">${kacir(t === 'Mod' ? 'Ctrl' : t)}</kbd>`;

const bolum = (baslik, icerik) => `
      <section class="mt-14 first:mt-0">
        <h2 class="mb-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">${kacir(baslik)}</h2>
        ${icerik}
      </section>`;

/**
 * Araç sayfasının gövdesi.
 *
 * Neden gerekli: uygulama tek sayfa, sunucudan gelen dosyanın gövdesi bomboş
 * (`<div id="root"></div>`) ve bütün yazı sonradan tarayıcıda çiziliyordu.
 * Google sayfayı sonunda okuyor ama geç ve isteksiz okuyor; Bing ve yapay zekâ
 * asistanları çoğu zaman hiç okumuyor. Search Console'da araç sayfalarımız
 * "value stream mapping tool", "wbs tool" gibi aramalarda 90. sırada
 * görünüyordu ve iç bağlantı sayısı sıfırdı: sayfalar birbirine bağlı
 * değil, on beş yetim sayfa gibi duruyorlardı.
 *
 * Uygulama açılınca React kendi sürümünü çizip buranın yerini alıyor. İkisi
 * aynı metin ve aynı stiller olduğu için değişim göze çarpmıyor; yan fayda,
 * sayfanın boş ekranla değil dolu açılması.
 */
function govde(sayfa, kilavuz, digerleri) {
  const bolumler = [];

  if (kilavuz?.whenToUse?.length) {
    const satirlar = kilavuz.whenToUse
      .map((s) => `<li class="flex gap-3 leading-relaxed"><span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span><span>${kacir(s)}</span></li>`)
      .join('\n          ');
    bolumler.push(bolum(BASLIK.when, `<ul class="space-y-3">\n          ${satirlar}\n        </ul>`));
  }

  if (kilavuz?.steps?.length) {
    const satirlar = kilavuz.steps
      .map((s, i) => `<li class="flex gap-4 leading-relaxed"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-black text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">${i + 1}</span><span>${kacir(s)}</span></li>`)
      .join('\n          ');
    bolumler.push(bolum(BASLIK.steps, `<ol class="space-y-4">\n          ${satirlar}\n        </ol>`));
  }

  if (kilavuz?.shortcuts?.length) {
    const satirlar = kilavuz.shortcuts
      .map(
        (k) =>
          `<div class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0 odd:bg-slate-50/60 dark:border-slate-800/60 dark:odd:bg-slate-900/40"><span class="leading-snug">${kacir(k.desc)}</span><span class="flex shrink-0 items-center gap-1">${k.keys.map(tus).join('<span class="text-xs text-slate-400">+</span>')}</span></div>`
      )
      .join('\n          ');
    bolumler.push(
      bolum(BASLIK.shortcuts, `<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">\n          ${satirlar}\n        </div>`)
    );
  }

  if (kilavuz?.tips?.length) {
    const satirlar = kilavuz.tips
      .map((s) => `<li class="flex gap-3 leading-relaxed"><span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span><span>${kacir(s)}</span></li>`)
      .join('\n          ');
    bolumler.push(bolum(BASLIK.tips, `<ul class="space-y-3">\n          ${satirlar}\n        </ul>`));
  }

  // Diğer araçların linkleri gerçek <a> etiketi: arama motorunun sayfalarımız
  // arasında yol bulabildiği tek yer burası.
  const linkler = digerleri
    .map(
      (d) =>
        `<a href="${KOKADRES}${d.slug}" class="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 font-bold text-slate-900 dark:text-white">${kacir(d.name)}</a>`
    )
    .join('\n          ');

  const ad = kilavuz?.title || sayfa.name;
  const ozet = kilavuz?.summary || sayfa.description;

  return `<div class="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
  <main class="flex-1 flex flex-col">
    <section class="pt-14 pb-20">
      <div class="container mx-auto px-6"><div class="max-w-4xl">
        <nav aria-label="breadcrumb" class="mb-10 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
          <a href="${KOKADRES}">Klarsti</a><span aria-hidden="true">›</span><span class="text-slate-800 dark:text-slate-200">${kacir(ad)}</span>
        </nav>
        <h1 class="mb-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">${kacir(ad)}</h1>
        <p class="mb-10 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-400">${kacir(ozet)}</p>
        <a href="${KOKADRES}register" class="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-8 py-4 text-lg font-bold text-white dark:text-slate-900">Sign up</a>
      </div></div>
    </section>
    <section class="pb-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-16">
      <div class="container mx-auto px-6 text-slate-700 dark:text-slate-300"><div class="max-w-4xl">${bolumler.join('\n')}
      </div></div>
    </section>
    <section class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
      <div class="container mx-auto px-6">
        <h2 class="mb-10 text-2xl font-black tracking-tight text-slate-900 dark:text-white">${BASLIK.other}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          ${linkler}
        </div>
      </div>
    </section>
  </main>
</div>`;
}

/**
 * Blog yazısının gövdesini HTML'e çevirir.
 *
 * Ayrıştırma burada YAPILMIYOR: uygulamanın kullandığı ayrıştırıcının ta
 * kendisi okunuyor (src/utils/blogAyristir.ts). İki ayrı ayrıştırıcı olsaydı
 * kullanıcının ekranda gördüğü yazı ile Google'ın okuduğu yazı zamanla
 * birbirinden saparadı. Kılavuzlarda da aynı yöntem kullanılıyor.
 */
async function blogAyristirici() {
  const kaynak = fs.readFileSync(path.join(KOK, 'src/utils/blogAyristir.ts'), 'utf8');
  const js = ts.transpileModule(kaynak, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js, 'utf8').toString('base64')}`);
}

function parcalarHtml(parcalar) {
  return parcalar
    .map((p) => {
      switch (p.tur) {
        case 'kalin': return `<strong>${kacir(p.metin)}</strong>`;
        case 'egik': return `<em>${kacir(p.metin)}</em>`;
        case 'baglanti':
          return `<a href="${kacir(p.adres)}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">${kacir(p.metin)}</a>`;
        case 'resim':
          return `<img src="${kacir(p.adres)}" alt="${kacir(p.aciklama)}" loading="lazy" class="my-6 w-full rounded-2xl border border-slate-200 dark:border-slate-700" />`;
        default: return kacir(p.metin);
      }
    })
    .join('');
}

function bloklarHtml(bloklar) {
  return bloklar
    .map((b) => {
      switch (b.tur) {
        case 'baslik': {
          const etiket = b.seviye === 1 ? 'h2' : b.seviye === 2 ? 'h3' : 'h4';
          const sinif = b.seviye === 1
            ? 'mt-10 mb-4 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white'
            : b.seviye === 2
              ? 'mt-8 mb-3 text-xl md:text-2xl font-bold text-slate-900 dark:text-white'
              : 'mt-6 mb-2 text-lg font-bold text-slate-900 dark:text-white';
          return `<${etiket} class="${sinif}">${parcalarHtml(b.parcalar)}</${etiket}>`;
        }
        case 'liste':
          return `<ul class="my-4 list-disc space-y-2 ps-6 leading-relaxed text-slate-700 dark:text-slate-300">${b.maddeler.map((m) => `<li>${parcalarHtml(m)}</li>`).join('')}</ul>`;
        case 'alinti':
          return `<blockquote class="my-6 border-s-4 border-indigo-400 bg-slate-50 dark:bg-slate-800/60 py-3 pe-4 ps-5 italic text-slate-600 dark:text-slate-300">${parcalarHtml(b.parcalar)}</blockquote>`;
        case 'video':
          return `<div class="my-6 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><iframe src="${kacir(b.adres)}" title="video" loading="lazy" allowfullscreen class="h-full w-full"></iframe></div>`;
        default:
          return `<p class="my-4 leading-relaxed text-slate-700 dark:text-slate-300">${parcalarHtml(b.parcalar)}</p>`;
      }
    })
    .join('\n        ');
}

const blogTarihi = (ms, dil) => {
  if (!ms) return '';
  try {
    return new Date(ms).toLocaleDateString(dil || 'tr', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return new Date(ms).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
  }
};

/** Tek yazının hazır gövdesi. Araç sayfalarındakiyle aynı mantık. */
function blogYaziGovdesi(yazi, bloklar) {
  const tarih = blogTarihi(yazi.yayinTarihi, yazi.dil);
  const kapak = yazi.kapak
    ? `<img src="${kacir(yazi.kapak)}" alt="" class="mt-8 w-full rounded-3xl border border-slate-200 dark:border-slate-700" />`
    : '';
  return `<div class="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
  <main class="flex-1">
    <div class="container mx-auto px-6 py-14"><div class="max-w-3xl">
      <nav aria-label="breadcrumb" class="mb-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
        <a href="${KOKADRES}">Klarsti</a><span aria-hidden="true">›</span><a href="${KOKADRES}blog">Blog</a>
      </nav>
      <h1 class="mb-3 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">${kacir(yazi.baslik)}</h1>
      ${tarih ? `<p class="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">${kacir(tarih)}</p>` : ''}
      ${yazi.ozet ? `<p class="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">${kacir(yazi.ozet)}</p>` : ''}
      ${kapak}
      <article class="mt-8 text-base md:text-lg">
        ${bloklarHtml(bloklar)}
      </article>
      <div class="mt-14 border-t border-slate-200 dark:border-slate-800 pt-6">
        <a href="${KOKADRES}blog" class="font-bold text-indigo-600 dark:text-indigo-400">← Blog</a>
      </div>
    </div></div>
  </main>
</div>`;
}

/** Liste sayfasının hazır gövdesi: yazıların başlıkları gerçek link. */
function blogListeGovdesi(yazilar) {
  const satirlar = yazilar
    .map((y) => {
      const tarih = blogTarihi(y.yayinTarihi, y.dil);
      return `<a href="${KOKADRES}blog/${kacir(y.slug)}" class="flex flex-col gap-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
            ${tarih ? `<span class="text-xs font-semibold uppercase tracking-wide text-slate-400">${kacir(tarih)}</span>` : ''}
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">${kacir(y.baslik)}</h2>
            ${y.ozet ? `<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">${kacir(y.ozet)}</p>` : ''}
          </a>`;
    })
    .join('\n          ');

  return `<div class="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
  <main class="flex-1">
    <div class="container mx-auto px-6 py-14"><div class="max-w-3xl">
      <nav aria-label="breadcrumb" class="mb-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
        <a href="${KOKADRES}">Klarsti</a><span aria-hidden="true">›</span><span class="text-slate-800 dark:text-slate-200">Blog</span>
      </nav>
      <h1 class="mb-4 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Blog</h1>
      <div class="mt-10 flex flex-col gap-5">
          ${satirlar}
      </div>
    </div></div>
  </main>
</div>`;
}

const kilavuzlar = await ingilizceKilavuzlar();
// Yayımlanmış yazılar. Kimlik yoksa boş liste döner ve blog sayfaları
// üretilmez; yerel derleme bu yüzden durmuyor (bkz. blogCek.mjs).
const blogYazilari = await yayinlananYazilariCek('klarsti');
const { blogAyristir, blogDuzMetin } = await blogAyristirici();

let uretilen = 0;
for (const sayfa of sayfalar) {
  const adres = `${SITE}/${sayfa.slug}`;
  let html = kabuk;

  html = degistir(html, /<title>[^<]*<\/title>/i, `<title>${kacir(sayfa.title)}</title>`, '<title>');
  html = icerikDegistir(html, 'name', 'description', sayfa.description);
  html = icerikDegistir(html, 'name', 'keywords', sayfa.keywords);
  html = icerikDegistir(html, 'property', 'og:title', sayfa.title);
  html = icerikDegistir(html, 'property', 'og:description', sayfa.description);
  html = icerikDegistir(html, 'property', 'og:url', adres);
  html = icerikDegistir(html, 'name', 'twitter:title', sayfa.title);
  html = icerikDegistir(html, 'name', 'twitter:description', sayfa.description);
  html = degistir(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${adres}" />`,
    'canonical'
  );

  html = degistir(html, /<\/head>/i, `${yapilandirilmisVeri(sayfa, adres)}</head>`, '</head>');

  // Blog liste sayfasının gövdesi de dolduruluyor: yazı başlıkları gerçek
  // link olmalı, arama motorunun tek tek yazılara giden yolu burası.
  if (sayfa.tur === TUR.BLOG && blogYazilari.length > 0) {
    html = degistirDuz(
      html,
      /<div id="root">\s*<\/div>/i,
      `<div id="statik-onizleme" class="fixed inset-0 z-[1] overflow-y-auto bg-slate-50 dark:bg-slate-900">${blogListeGovdesi(blogYazilari)}</div>\n    <div id="root"></div>`,
      'root kutusu'
    );
  }

  // Araç sayfalarının gövdesi dolduruluyor; yasal/giriş/iletişim/hakkımızda
  // arama sonucunda öne çıkmak için değil bulunabilir olmak için var, onlarda
  // kabuğun boş gövdesi yeterli.
  if (aracMi(sayfa)) {
    const digerleri = araclar.filter((d) => d.slug !== sayfa.slug);
    // Hazır sayfa `root`un İÇİNE değil, ÖNÜNE konuyor.
    //
    // İçine koymayı denedik: React bağlanırken `root`u boşaltıyor, kendi
    // sürümünü çizmesi ise kılavuz metni indiğinde bitiyor. Arada sayfa
    // yaklaşık üçte bir saniye bomboş kalıyordu — dolu ekranın boşalıp tekrar
    // dolması, baştan boş açılmaktan daha çok göze batıyor.
    //
    // Şimdi hazır sayfa üstte duran ayrı bir katman: React arkada kendi
    // sürümünü çizip hazır olduğunu söyleyince kaldırılıyor (bkz.
    // ToolLandingPage). Böylece ekranda hep dolu bir sayfa var.
    html = degistirDuz(
      html,
      /<div id="root">\s*<\/div>/i,
      `<div id="statik-onizleme" class="fixed inset-0 z-[1] overflow-y-auto bg-slate-50 dark:bg-slate-900">${govde(sayfa, kilavuzlar[sayfa.toolId], digerleri)}</div>\n    <div id="root"></div>`,
      'root kutusu'
    );
  }

  fs.writeFileSync(path.join(DIST, `${sayfa.slug}.html`), html, 'utf8');
  uretilen++;
}

/**
 * Her blog yazısı için gerçek bir HTML dosyası: dist/blog/<slug>.html
 *
 * Neden klasörün içinde, diğerleri gibi düz değil: adres iki katmanlı
 * (/blog/yazi-adi). `cleanUrls` açık olduğu için Firebase bu isteği doğrudan
 * bu dosyaya bağlıyor. Araç sayfalarındaki eğik çizgi sorunu burada yok; o
 * sorun `klasor/index.html` biçiminden çıkıyordu, burada dosyanın kendi adı
 * var.
 */
const blogKlasoru = path.join(DIST, 'blog');
if (blogYazilari.length > 0) fs.mkdirSync(blogKlasoru, { recursive: true });

for (const yazi of blogYazilari) {
  const adres = `${SITE}/blog/${yazi.slug}`;
  const bloklar = blogAyristir(yazi.govde);
  // Açıklama yoksa yazının kendisinden kırpılıyor: arama sonucundaki iki
  // satır boş kalmasın.
  const aciklama = yazi.ozet || `${blogDuzMetin(yazi.govde).slice(0, 155)}…`;
  const baslik = `${yazi.baslik} | Klarsti`;
  let html = kabuk;

  html = degistir(html, /<title>[^<]*<\/title>/i, `<title>${kacir(baslik)}</title>`, '<title>');
  html = icerikDegistir(html, 'name', 'description', aciklama);
  html = icerikDegistir(html, 'property', 'og:title', baslik);
  html = icerikDegistir(html, 'property', 'og:description', aciklama);
  html = icerikDegistir(html, 'property', 'og:url', adres);
  html = icerikDegistir(html, 'name', 'twitter:title', baslik);
  html = icerikDegistir(html, 'name', 'twitter:description', aciklama);
  // Kapak resmi varsa link önizlemesi onu göstersin; yoksa sitenin kendi
  // paylaşım görseli kalıyor.
  if (yazi.kapak) {
    html = icerikDegistir(html, 'property', 'og:image', yazi.kapak);
    html = icerikDegistir(html, 'name', 'twitter:image', yazi.kapak);
  }
  html = degistir(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${adres}" />`,
    'canonical'
  );

  const yapilandirilmis = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: yazi.baslik,
        description: aciklama,
        url: adres,
        inLanguage: yazi.dil,
        ...(yazi.yayinTarihi ? { datePublished: new Date(yazi.yayinTarihi).toISOString() } : {}),
        ...(yazi.kapak ? { image: yazi.kapak } : {}),
        author: { '@type': 'Organization', name: 'Klarsti', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'Klarsti', url: `${SITE}/` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Klarsti', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
          { '@type': 'ListItem', position: 3, name: yazi.baslik, item: adres }
        ]
      }
    ]
  };
  const json = JSON.stringify(yapilandirilmis, null, 2).replace(/<\//g, '<\\/');
  html = degistir(html, /<\/head>/i, `<script type="application/ld+json">\n${json}\n</script>\n</head>`, '</head>');

  html = degistirDuz(
    html,
    /<div id="root">\s*<\/div>/i,
    `<div id="statik-onizleme" class="fixed inset-0 z-[1] overflow-y-auto bg-slate-50 dark:bg-slate-900">${blogYaziGovdesi(yazi, bloklar)}</div>\n    <div id="root"></div>`,
    'root kutusu'
  );

  fs.writeFileSync(path.join(blogKlasoru, `${yazi.slug}.html`), html, 'utf8');
  uretilen++;
}

// Sitemap elle tutulmuyordu ve tek adres içeriyordu; artık listeden üretiliyor,
// yani yeni bir araç sayfası eklendiğinde kendiliğinden içine giriyor.
const bugun = new Date().toISOString().slice(0, 10);
const girdiler = [
  `  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${bugun}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  // Yasal sayfalar arama sonucunda öne çıkmak için değil, bulunabilir olmak
  // için listede; bu yüzden düşük öncelikli. Giriş/kayıt ikisinin arasında:
  // araç sayfaları kadar değerli değiller ama sitenin ana yollarından biri.
  ...sayfalar.map(
    (s) =>
      `  <url>\n    <loc>${SITE}/${s.slug}</loc>\n    <lastmod>${bugun}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${ONCELIK[s.tur]}</priority>\n  </url>`
  ),
  // Blog yazıları. lastmod olarak yazının kendi yayın tarihi veriliyor:
  // her derlemede bugünü yazmak, değişmemiş bir yazıyı her gün "güncellendi"
  // diye göstermek olurdu ve arama motoru bir süre sonra bu bilgiye
  // güvenmeyi bırakıyor.
  ...blogYazilari.map((y) => {
    const tarih = y.yayinTarihi ? new Date(y.yayinTarihi).toISOString().slice(0, 10) : bugun;
    return `  <url>\n    <loc>${SITE}/blog/${y.slug}</loc>\n    <lastmod>${tarih}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
  })
];
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${girdiler.join('\n')}\n</urlset>\n`,
  'utf8'
);

console.log(
  `staticPages: ${uretilen} sayfa (${araclar.length} arac + ${yasal.length} yasal + ${girisler.length} giris + ${iletisim.length} iletisim + ${hakkimizda.length} hakkimizda + ${blogListesi.length} blog listesi + ${blogYazilari.length} blog yazisi) + sitemap uretildi`
);

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

const TUR = { ARAC: 'arac', YASAL: 'yasal', GIRIS: 'giris' };
const ONCELIK = { [TUR.ARAC]: '0.8', [TUR.GIRIS]: '0.5', [TUR.YASAL]: '0.3' };
const sayfalar = [
  ...araclar.map((s) => ({ ...s, tur: TUR.ARAC })),
  ...yasal.map((s) => ({ ...s, tur: TUR.YASAL })),
  ...girisler.map((s) => ({ ...s, tur: TUR.GIRIS }))
];

const kabukYolu = path.join(DIST, 'index.html');
if (!fs.existsSync(kabukYolu)) {
  console.error('staticPages: dist/index.html yok. Once "vite build" calistir.');
  process.exit(1);
}
const kabuk = fs.readFileSync(kabukYolu, 'utf8');

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

  fs.writeFileSync(path.join(DIST, `${sayfa.slug}.html`), html, 'utf8');
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
  )
];
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${girdiler.join('\n')}\n</urlset>\n`,
  'utf8'
);

console.log(
  `staticPages: ${uretilen} sayfa (${araclar.length} arac + ${yasal.length} yasal + ${girisler.length} giris) + sitemap uretildi`
);

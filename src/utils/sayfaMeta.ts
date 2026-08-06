// Sayfa başına arama motoru etiketlerini yönetir.
//
// Statik HTML dosyaları (bkz. scripts/staticPages.mjs) doğru etiketlerle
// üretiliyor; tarayıcıdan gelen ilk istek zaten doğru başlığı alıyor. Buradaki
// iş uygulama içi gezinme için: kullanıcı tanıtım sayfasından bir araç
// sayfasına geçtiğinde yeni bir HTML indirilmiyor, o yüzden etiketleri React
// güncellemek zorunda. Sekme başlığı ve tarayıcı geçmişi de buna bakıyor.
//
// Link önizlemeleri (WhatsApp, LinkedIn, Slack) JavaScript çalıştırmaz; onlar
// her zaman statik HTML'deki etiketleri okur. Yani burası önizlemeleri
// etkilemiyor, statik üretim onun için var.

export interface SayfaMeta {
  title: string;
  description: string;
  /** Tam adres. Yinelenen içerik sayılmamak için sayfa başına değişmeli. */
  canonical: string;
}

const SITE = 'https://klarsti.com';

function etiketBul(secici: string, olustur: () => HTMLElement): HTMLElement {
  const mevcut = document.head.querySelector(secici);
  if (mevcut) return mevcut as HTMLElement;
  const yeni = olustur();
  document.head.appendChild(yeni);
  return yeni;
}

function metaYaz(ad: string, deger: string, ozellikMi = false) {
  const anahtar = ozellikMi ? 'property' : 'name';
  const etiket = etiketBul(`meta[${anahtar}="${ad}"]`, () => {
    const e = document.createElement('meta');
    e.setAttribute(anahtar, ad);
    return e;
  });
  etiket.setAttribute('content', deger);
}

// index.html'deki değerler; sayfadan çıkıldığında buraya dönülüyor. Modül
// yüklendiği anda okunuyor: o an henüz hiçbir sayfa etiketleri değiştirmemiş.
const VARSAYILAN: SayfaMeta = {
  title: document.title,
  description:
    document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  canonical: `${SITE}/`
};

export function sayfaMetaAyarla(meta: SayfaMeta) {
  document.title = meta.title;
  metaYaz('description', meta.description);

  const link = etiketBul('link[rel="canonical"]', () => {
    const e = document.createElement('link');
    e.setAttribute('rel', 'canonical');
    return e;
  });
  link.setAttribute('href', meta.canonical);

  metaYaz('og:title', meta.title, true);
  metaYaz('og:description', meta.description, true);
  metaYaz('og:url', meta.canonical, true);
  metaYaz('twitter:title', meta.title);
  metaYaz('twitter:description', meta.description);
}

export function sayfaMetaSifirla() {
  sayfaMetaAyarla(VARSAYILAN);
}

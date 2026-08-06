import type { HistogramAyarlar } from '../store/slices/createHistogramSlice';

export interface HistogramKutu {
  alt: number;
  ust: number;
  sayi: number;
}

export interface HistogramSonuc {
  n: number;
  ortalama: number;
  /** Örneklem standart sapması (n-1). */
  standartSapma: number;
  medyan: number;
  enKucuk: number;
  enBuyuk: number;
  aralik: number;
  kutular: HistogramKutu[];
  kutuGenislik: number;
  /** Süreç yeterliliği; iki sınır da girilmişse hesaplanır. */
  cp?: number;
  /** Ortalamanın kaymasını da hesaba katan yeterlilik; tek sınır yeter. */
  cpk?: number;
  /** Spesifikasyon dışına düşen ölçüm sayısı. */
  sinirDisi: number;
  sinirDisiYuzde: number;
}

/**
 * Sınıf genişliğini okunur bir sayıya yuvarlar (1, 2, 2.5, 5, 10 × 10^n).
 * Ham genişlik 3,7183… gibi çıkınca eksen etiketleri okunmaz oluyor.
 */
function yuvarlakAdim(ham: number): number {
  if (!Number.isFinite(ham) || ham <= 0) return 1;
  const us = Math.floor(Math.log10(ham));
  const taban = Math.pow(10, us);
  const oran = ham / taban;
  const secim = oran <= 1 ? 1 : oran <= 2 ? 2 : oran <= 2.5 ? 2.5 : oran <= 5 ? 5 : 10;
  return secim * taban;
}

/**
 * Sınıf sayısı için Sturges kuralı: k = ⌈log2(n)⌉ + 1. Klasik ve tanıdık;
 * kullanıcı isterse elle geçersiz kılabiliyor.
 */
export function sturgesKutuSayisi(n: number): number {
  if (n <= 0) return 1;
  return Math.min(30, Math.max(3, Math.ceil(Math.log2(n)) + 1));
}

/**
 * Metinden ölçüm listesi. Ayırıcılar: satır sonu, noktalı virgül, sekme,
 * boşluk. Virgül BİLEREK ayırıcı sayılmıyor — Türkçe klavyede ondalık
 * ayırıcısı o; "3,5" yazan kullanıcı iki ölçüm değil bir buçuk kastediyor.
 * Yine de "1,2,3" gibi tek parçada birden çok virgül varsa liste kabul edilir.
 */
export function olcumleriAyristir(metin: string): number[] {
  const parcalar: string[] = [];
  metin.split(/[\n\r;\t ]+/).forEach((ham) => {
    const parca = ham.trim();
    if (parca === '') return;
    if (/^-?\d+,\d+$/.test(parca)) parcalar.push(parca.replace(',', '.'));
    else if (parca.includes(',')) parca.split(',').forEach((p) => p.trim() !== '' && parcalar.push(p.trim()));
    else parcalar.push(parca);
  });
  return parcalar.map(Number).filter((s) => Number.isFinite(s));
}

/** Ölçüm listesini metne çevirir (düzenleme kutusu için). */
export function olcumleriMetneCevir(olcumler: number[]): string {
  return olcumler.join('\n');
}

export function histogramHesapla(olcumler: number[], ayarlar: HistogramAyarlar): HistogramSonuc | null {
  const veri = olcumler.filter((s) => Number.isFinite(s));
  const n = veri.length;
  if (n === 0) return null;

  const sirali = [...veri].sort((a, b) => a - b);
  const enKucuk = sirali[0];
  const enBuyuk = sirali[n - 1];
  const ortalama = veri.reduce((t, s) => t + s, 0) / n;
  // Örneklem sapması: elimizdeki ölçümler evrenin tamamı değil, bir örneklem.
  const varyans = n > 1 ? veri.reduce((t, s) => t + (s - ortalama) ** 2, 0) / (n - 1) : 0;
  const standartSapma = Math.sqrt(varyans);
  const medyan = n % 2 === 1 ? sirali[(n - 1) / 2] : (sirali[n / 2 - 1] + sirali[n / 2]) / 2;

  const istenenKutu = ayarlar.kutuSayisi && ayarlar.kutuSayisi >= 2 ? Math.min(60, Math.round(ayarlar.kutuSayisi)) : sturgesKutuSayisi(n);
  const aralik = enBuyuk - enKucuk;

  let kutuGenislik: number;
  let baslangic: number;
  if (aralik === 0) {
    // Bütün ölçümler aynı: tek sınıf, değeri ortalayan bir genişlik uydurulur.
    kutuGenislik = Math.abs(enKucuk) > 0 ? yuvarlakAdim(Math.abs(enKucuk) / 10) : 1;
    baslangic = enKucuk - kutuGenislik / 2;
  } else {
    kutuGenislik = yuvarlakAdim(aralik / istenenKutu);
    baslangic = Math.floor(enKucuk / kutuGenislik) * kutuGenislik;
  }

  const kutular: HistogramKutu[] = [];
  // Kayan nokta hatası yüzünden sonsuz döngüye girmesin diye üst sınır var.
  for (let alt = baslangic, guvenlik = 0; alt < enBuyuk + kutuGenislik * 1e-9 && guvenlik < 200; alt += kutuGenislik, guvenlik += 1) {
    kutular.push({ alt, ust: alt + kutuGenislik, sayi: 0 });
  }
  if (kutular.length === 0) kutular.push({ alt: baslangic, ust: baslangic + kutuGenislik, sayi: 0 });

  veri.forEach((deger) => {
    let indeks = Math.floor((deger - baslangic) / kutuGenislik);
    // Son sınıf üst sınırı dahil sayar; yoksa en büyük ölçüm hiçbir sınıfa girmez.
    if (indeks >= kutular.length) indeks = kutular.length - 1;
    if (indeks < 0) indeks = 0;
    kutular[indeks].sayi += 1;
  });

  const { altSinir, ustSinir } = ayarlar;
  const altVar = typeof altSinir === 'number' && Number.isFinite(altSinir);
  const ustVar = typeof ustSinir === 'number' && Number.isFinite(ustSinir);

  let cp: number | undefined;
  let cpk: number | undefined;
  if (standartSapma > 0) {
    if (altVar && ustVar) {
      cp = (ustSinir! - altSinir!) / (6 * standartSapma);
      cpk = Math.min((ustSinir! - ortalama) / (3 * standartSapma), (ortalama - altSinir!) / (3 * standartSapma));
    } else if (ustVar) {
      cpk = (ustSinir! - ortalama) / (3 * standartSapma);
    } else if (altVar) {
      cpk = (ortalama - altSinir!) / (3 * standartSapma);
    }
  }

  const sinirDisi = veri.filter((d) => (altVar && d < altSinir!) || (ustVar && d > ustSinir!)).length;

  return {
    n,
    ortalama,
    standartSapma,
    medyan,
    enKucuk,
    enBuyuk,
    aralik,
    kutular,
    kutuGenislik,
    cp,
    cpk,
    sinirDisi,
    sinirDisiYuzde: (sinirDisi / n) * 100,
  };
}

/** Normal dağılım eğrisi: histogramın üstüne bindirilip şekil kıyaslanır. */
export function normalEgriNoktalari(sonuc: HistogramSonuc, adet = 60): { x: number; y: number }[] {
  const { ortalama, standartSapma, kutular, kutuGenislik, n } = sonuc;
  if (standartSapma <= 0 || kutular.length === 0) return [];
  const bas = kutular[0].alt;
  const son = kutular[kutular.length - 1].ust;
  const noktalar: { x: number; y: number }[] = [];
  for (let i = 0; i <= adet; i += 1) {
    const x = bas + ((son - bas) * i) / adet;
    const yogunluk = Math.exp(-((x - ortalama) ** 2) / (2 * standartSapma ** 2)) / (standartSapma * Math.sqrt(2 * Math.PI));
    // Yoğunluğu sıklık ölçeğine taşı: toplam alan n * sınıf genişliği.
    noktalar.push({ x, y: yogunluk * n * kutuGenislik });
  }
  return noktalar;
}

/** En fazla üç anlamlı ondalık; tam sayıysa ondalık yazılmaz. */
export function sayiBicimle(sayi: number, ondalik = 2): string {
  if (!Number.isFinite(sayi)) return '—';
  const yuvarlanmis = Number(sayi.toFixed(ondalik));
  return Number.isInteger(yuvarlanmis) ? String(yuvarlanmis) : String(yuvarlanmis);
}

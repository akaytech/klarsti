import type { VsmAyarlar, VsmEdge, VsmNode, VsmSure } from '../store/slices/createVsmSlice';
import { VSM_MALZEME_OKLARI } from '../store/slices/createVsmSlice';

/**
 * Kutu genişlikleri tek yerde: zaman merdiveni bunlara hizalanıyor. Eskiden
 * merdiven her işlem kutusunu 150 px varsayıyordu, kutular yaklaşınca
 * segmentler üst üste biniyordu.
 */
export const VSM_KUTU_GENISLIK: Record<string, number> = {
  vsmProcess: 200,
  vsmInventory: 96,
  vsmSupermarket: 128,
  vsmSupplierCustomer: 152,
  vsmProductionControl: 184,
  vsmShipment: 136,
  vsmKaizen: 152,
};

export const vsmKutuGenislik = (type: string) => VSM_KUTU_GENISLIK[type] ?? 152;

const SANIYE_CARPANI: Record<string, number> = { sec: 1, min: 60, hr: 3600, day: 86400 };

export const sureyiSaniyeyeCevir = (sure?: VsmSure): number => {
  if (!sure) return 0;
  const deger = Number(sure.deger);
  if (!Number.isFinite(deger)) return 0;
  return deger * (SANIYE_CARPANI[sure.birim] ?? 1);
};

/**
 * VSM'de "gün" takvim günü değil ÜRETİM günü demektir: iki günlük stok, iki
 * vardiyalı bir tesiste 48 saat değil, iki günlük çalışma süresi kadar bekler.
 * Bu yüzden 'day' birimi 86400 saniyeye değil, günlük çalışma süresine çevrilir.
 */
export const sureyiUretimSaniyesineCevir = (sure: VsmSure | undefined, gunlukCalisma: number): number => {
  if (!sure) return 0;
  if (sure.birim === 'day') return (Number(sure.deger) || 0) * gunlukCalisma;
  return sureyiSaniyeyeCevir(sure);
};

/** Bir günde fiilen üretim yapılan saniye. */
export const gunlukCalismaSaniyesi = (ayarlar: VsmAyarlar): number => {
  const vardiya = Math.max(0, Number(ayarlar.vardiyaSayisi) || 0);
  const brut = Math.max(0, Number(ayarlar.vardiyaDakika) || 0);
  const mola = Math.max(0, Number(ayarlar.molaDakika) || 0);
  return Math.max(0, vardiya * (brut - mola) * 60);
};

/**
 * Takt zamanı: müşteri talebini karşılamak için bir parçanın kaç saniyede
 * çıkması gerektiği. VSM'in tek en önemli sayısı; talep girilmemişse 0 döner
 * ve arayüz kıyas yapmaz.
 */
export const taktSaniye = (ayarlar: VsmAyarlar): number => {
  const talep = Number(ayarlar.gunlukTalep) || 0;
  if (talep <= 0) return 0;
  return gunlukCalismaSaniyesi(ayarlar) / talep;
};

export type VsmAdimTuru = 'islem' | 'bekleme';

export interface VsmAdim {
  node: VsmNode;
  tur: VsmAdimTuru;
  /** İşlem adımının katma değerli süresi (saniye). */
  katmaDegerSaniye: number;
  /** Adımın teslim süresine kattığı üretim saniyesi. */
  teslimSaniye: number;
  /** Aynı katkının gün cinsinden hali (merdivendeki üst basamak). */
  teslimGun: number;
  /** İşlem adımı takt zamanını aşıyor mu. */
  taktiAsiyor: boolean;
}

export interface VsmHesapSonucu {
  taktSaniye: number;
  gunlukCalismaSaniyesi: number;
  yol: VsmAdim[];
  toplamKatmaDegerSaniye: number;
  /** Toplam teslim süresi, üretim saniyesi cinsinden. */
  toplamTeslimSaniye: number;
  /** Aynı toplamın üretim günü cinsinden hali. */
  toplamTeslimGun: number;
  /** Katma değerli sürenin toplam teslim süresine oranı (%). */
  akisVerimliligi: number;
  /** Akış zincirine bağlanmamış, bu yüzden toplamlara girmeyen kutu sayısı. */
  zincirDisiSayisi: number;
  /** Darboğazlar: çevrim süresi takt'ı aşan işlemler. */
  taktiAsanIdler: string[];
}

const BOS_SONUC: VsmHesapSonucu = {
  taktSaniye: 0,
  gunlukCalismaSaniyesi: 0,
  yol: [],
  toplamKatmaDegerSaniye: 0,
  toplamTeslimSaniye: 0,
  toplamTeslimGun: 0,
  akisVerimliligi: 0,
  zincirDisiSayisi: 0,
  taktiAsanIdler: [],
};

/** Zaman hattında yer alan kutu tipleri. */
const ZAMAN_TIPLERI = new Set(['vsmProcess', 'vsmInventory', 'vsmSupermarket']);

/**
 * Akışın ana hattını bulur ve süreleri toplar.
 *
 * Eski hesap ilk çıkan bağlantıyı körü körüne takip ediyor, dallanmada ikinci
 * kolu yok sayıyor, sonra zincire hiç girmemiş kutular x sırasına göre
 * toplamın sonuna ekliyordu; haritada duran kopuk bir kutu sessizce toplama
 * giriyordu. Artık en uzun (en çok teslim süresi biriktiren) yol seçiliyor ve
 * zincir dışında kalanlar toplama girmeden sayılıyor.
 */
export function vsmHesapla(nodes: VsmNode[], edges: VsmEdge[], ayarlar: VsmAyarlar): VsmHesapSonucu {
  const zamanNodelari = nodes.filter((n) => ZAMAN_TIPLERI.has(n.type));
  if (zamanNodelari.length === 0) {
    return { ...BOS_SONUC, taktSaniye: taktSaniye(ayarlar), gunlukCalismaSaniyesi: gunlukCalismaSaniyesi(ayarlar) };
  }

  const calisma = gunlukCalismaSaniyesi(ayarlar);
  const takt = taktSaniye(ayarlar);
  const talep = Number(ayarlar.gunlukTalep) || 0;
  const kutular = new Map(zamanNodelari.map((n) => [n.id, n]));

  /** Bir kutunun teslim süresine kattığı üretim saniyesi. */
  const teslimSaniyesi = (node: VsmNode): number => {
    if (node.type === 'vsmProcess') {
      // İşlem süresi de teslim süresinin parçası.
      return sureyiUretimSaniyesineCevir(node.data.cycleTime, calisma);
    }
    // Bekleme süresi elle girildiyse o kullanılır; girilmediyse bekleyen
    // adet ÷ günlük talep = kaç günlük stok.
    if (node.data.beklemeSuresi) return sureyiUretimSaniyesineCevir(node.data.beklemeSuresi, calisma);
    const adet = Number(node.data.adet) || 0;
    return talep > 0 ? (adet / talep) * calisma : 0;
  };

  // Yalnızca malzeme akışı okları zincire dahil; bilgi okları akışı taşımaz.
  const komsular = new Map<string, string[]>();
  const hedefOlanlar = new Set<string>();
  edges.forEach((e) => {
    if (!VSM_MALZEME_OKLARI.includes(e.type as any)) return;
    if (!kutular.has(e.source) || !kutular.has(e.target)) return;
    komsular.set(e.source, [...(komsular.get(e.source) ?? []), e.target]);
    hedefOlanlar.add(e.target);
  });

  // Bir kutudan başlayan en uzun yol. Döngüye karşı yol üstündeki kutular
  // işaretleniyor; kullanıcı halka çizerse hesap patlamasın.
  const bellek = new Map<string, { agirlik: number; yol: string[] }>();
  const yolda = new Set<string>();

  const enUzunYol = (id: string): { agirlik: number; yol: string[] } => {
    const hazir = bellek.get(id);
    if (hazir) return hazir;
    if (yolda.has(id)) return { agirlik: 0, yol: [] };

    yolda.add(id);
    const node = kutular.get(id)!;
    const kendiAgirligi = teslimSaniyesi(node);
    let enIyi: { agirlik: number; yol: string[] } = { agirlik: 0, yol: [] };

    (komsular.get(id) ?? []).forEach((sonraki) => {
      const alt = enUzunYol(sonraki);
      if (alt.yol.length > 0 && alt.agirlik >= enIyi.agirlik) enIyi = alt;
    });

    yolda.delete(id);
    const sonuc = { agirlik: kendiAgirligi + enIyi.agirlik, yol: [id, ...enIyi.yol] };
    bellek.set(id, sonuc);
    return sonuc;
  };

  // Başlangıç adayları: kendisine malzeme oku gelmeyen kutular. Hiç yoksa
  // (her şey halka ya da bağlantısız) en soldaki kutudan başlanır.
  const baslangiclar = zamanNodelari.filter((n) => !hedefOlanlar.has(n.id));
  const adaylar = baslangiclar.length > 0 ? baslangiclar : [...zamanNodelari].sort((a, b) => a.position.x - b.position.x).slice(0, 1);

  let enIyiYol: string[] = [];
  let enIyiAgirlik = -1;
  adaylar.forEach((n) => {
    const sonuc = enUzunYol(n.id);
    if (sonuc.agirlik > enIyiAgirlik || (sonuc.agirlik === enIyiAgirlik && sonuc.yol.length > enIyiYol.length)) {
      enIyiAgirlik = sonuc.agirlik;
      enIyiYol = sonuc.yol;
    }
  });

  const yol: VsmAdim[] = enIyiYol.map((id) => {
    const node = kutular.get(id)!;
    const islem = node.type === 'vsmProcess';
    const cevrim = islem ? sureyiUretimSaniyesineCevir(node.data.cycleTime, calisma) : 0;
    const saniye = teslimSaniyesi(node);
    return {
      node,
      tur: islem ? 'islem' : 'bekleme',
      katmaDegerSaniye: cevrim,
      teslimSaniye: saniye,
      teslimGun: calisma > 0 ? saniye / calisma : 0,
      taktiAsiyor: islem && takt > 0 && cevrim > takt,
    };
  });

  const toplamKatmaDegerSaniye = yol.reduce((t, a) => t + a.katmaDegerSaniye, 0);
  const toplamTeslimSaniye = yol.reduce((t, a) => t + a.teslimSaniye, 0);

  return {
    taktSaniye: takt,
    gunlukCalismaSaniyesi: calisma,
    yol,
    toplamKatmaDegerSaniye,
    toplamTeslimSaniye,
    toplamTeslimGun: calisma > 0 ? toplamTeslimSaniye / calisma : 0,
    akisVerimliligi: toplamTeslimSaniye > 0 ? (toplamKatmaDegerSaniye / toplamTeslimSaniye) * 100 : 0,
    zincirDisiSayisi: zamanNodelari.length - yol.length,
    taktiAsanIdler: yol.filter((a) => a.taktiAsiyor).map((a) => a.node.id),
  };
}

/**
 * Saniyeyi okunur hale getirir: 45 sn, 117,4 sn, 12 dk, 2,1 sa. Birim
 * kısaltmaları çağıran taraftan gelir ki çeviri tek yerde kalsın.
 *
 * Saniye eşiği bilerek yüksek (10 dk): VSM'de çevrim ve takt süreleri saniye
 * cinsinden konuşulur. Eşik 90 sn iken 117,4 saniyelik bir takt "2 dk" diye
 * yuvarlanıyor ve kıyas için gereken hassasiyet kayboluyordu.
 */
export function saniyeBicimle(saniye: number, kisaltmalar: { sec: string; min: string; hr: string }): string {
  if (!Number.isFinite(saniye) || saniye <= 0) return `0 ${kisaltmalar.sec}`;
  if (saniye < 600) return `${sayiBicimle(saniye)} ${kisaltmalar.sec}`;
  if (saniye < 5400) return `${sayiBicimle(saniye / 60)} ${kisaltmalar.min}`;
  return `${sayiBicimle(saniye / 3600)} ${kisaltmalar.hr}`;
}

/** En fazla bir ondalık; tam sayıysa ondalık yazılmaz. */
export function sayiBicimle(sayi: number): string {
  if (!Number.isFinite(sayi)) return '0';
  const yuvarlanmis = Math.round(sayi * 10) / 10;
  return Number.isInteger(yuvarlanmis) ? String(yuvarlanmis) : yuvarlanmis.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

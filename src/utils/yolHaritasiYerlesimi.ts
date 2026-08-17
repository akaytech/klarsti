import type { Edge } from '@xyflow/react';
import type { RoadmapNode, RoadmapYon } from '../store/slices/createRoadmapSlice';
import { hattaMi, roadmapHatti } from '../store/slices/createRoadmapSlice';

/**
 * Yol haritasının dizilimi.
 *
 * Kutular elle taşınmıyor; harita her değişiklikten sonra kendini diziyor.
 * Dagre kullanılmadı: dagre kolon kolon hizalıyor, burada ise ortada düz bir
 * HAT olması ve yan konuların o hatta asılması gerekiyor.
 *
 * İki yön var ve ikisi aynı algoritmanın çevrilmiş hali DEĞİL. Sebebi kutuların
 * dönmemesi: yazı her iki yönde de yatay, yani kutu enine geniş boyuna kısa.
 *
 *   - Dikeyde hat aşağı akar, konu kümesi hattın yanına asılır ve kardeşler
 *     alt alta dizilir. Bir durağın hatta kapladığı yer, kümesinin YÜKSEKLİĞİ
 *     kadar; kutular kısa olduğu için bu ucuz.
 *   - Yatayda hat sağa akar, konu kümesi durağın altına (ya da üstüne) asılır.
 *     Kardeşler yine alt alta diziliyor, derinlik yine sağa gidiyor. Kümeyi
 *     hattın yönünde dizmek denendi ve harita ekranlarca uzadı: yan yana
 *     dizilen her kutu 200 küsur piksel yer kaplıyor, alt alta dizilen ise 44.
 *
 * Böylece iki yönde de konular hep aynı biçimde büyüyor (kardeş aşağı, alt
 * konu yana); değişen tek şey hattın kendisi.
 */

/** Hat üzerindeki iki durak arası. */
const HAT_BOSLUK = 56;
/** Kardeş konular arası. */
const KONU_BOSLUK = 14;
/** Hattan (ya da üst konudan) yan konuya olan mesafe. */
const SEVIYE_BOSLUK = 70;

export interface RoadmapYerlesimKaydi {
  x: number;
  y: number;
  /** 0 = hat üzerinde, 1 = doğrudan yan konu, 2+ = alt konu. */
  derinlik: number;
  /** Hattın hangi yanında: dikeyde 1 sağ / -1 sol, yatayda 1 alt / -1 üst. */
  taraf: 1 | -1;
}

export type RoadmapYerlesim = Map<string, RoadmapYerlesimKaydi>;

export interface RoadmapOlcu {
  genislik: number;
  yukseklik: number;
}

/**
 * Kutunun ölçüsü metninden kestiriliyor; ölçmek için DOM'a basmaya gerek yok.
 *
 * DİKKAT: Kutunun içindeki her şey buraya da eklenmeli. Durum düğmesi, kaynak
 * işareti ve süre rozeti metnin yanında yer kaplıyor; tahmine katılmazsa
 * gerçek kutu hesaplanandan geniş olur ve yan konular birbirine girer
 * (bkz. RoadmapNode).
 */
export function roadmapKutuOlcusu(node: RoadmapNode): RoadmapOlcu {
  const { label, tur, kaynaklar, sure, description } = node.data;
  const metin = label || '';

  if (tur === 'bolum') {
    const genislik = Math.min(340, Math.max(180, metin.length * 8.2 + 56));
    return { genislik, yukseklik: 46 };
  }

  const adim = tur === 'adim';
  const harf = adim ? 8 : 7.2;
  // Durum düğmesi 18px + 8 boşluk; kaynak işareti 14 + 6; süre rozeti ~38;
  // açıklama işareti 14 + 6.
  const ekler = 26
    + (kaynaklar && kaynaklar.length > 0 ? 20 : 0)
    + (sure ? 38 : 0)
    + (description ? 20 : 0);
  const yatayPay = (adim ? 34 : 28) + ekler;

  const enAz = adim ? 210 : 150;
  const enCok = adim ? 330 : 270;
  const genislik = Math.min(enCok, Math.max(enAz, metin.length * harf + yatayPay));
  // Uzun metin sarınca kutu uzar; kabaca satır sayısından hesaplanıyor.
  const satir = Math.max(1, Math.ceil((metin.length * harf + yatayPay) / genislik));
  const yukseklik = (adim ? 54 : 44) + (satir - 1) * 18;
  return { genislik, yukseklik };
}

/**
 * Görünen kutuların konumları. Kapalı durakların altındaki konular listeye hiç
 * girmez, yani burada gizleme mantığı yok; çağıran süzüyor (bkz. RoadmapCanvas).
 */
export function yolHaritasiYerlesimi(
  nodes: RoadmapNode[],
  edges: Edge[],
  yon: RoadmapYon = 'dikey'
): RoadmapYerlesim {
  const yerlesim: RoadmapYerlesim = new Map();
  if (nodes.length === 0) return yerlesim;

  const dikey = yon === 'dikey';
  const kutular = new Map(nodes.map((n) => [n.id, n]));

  const konuCocuklari = new Map<string, string[]>();
  edges.forEach((e) => {
    const hedef = kutular.get(e.target);
    if (!kutular.has(e.source) || !hedef || hedef.data.tur !== 'konu') return;
    const liste = konuCocuklari.get(e.source);
    if (liste) liste.push(e.target);
    else konuCocuklari.set(e.source, [e.target]);
  });

  const olcuOnbellek = new Map<string, RoadmapOlcu>();
  const olcu = (id: string): RoadmapOlcu => {
    const hazir = olcuOnbellek.get(id);
    if (hazir) return hazir;
    const hesap = roadmapKutuOlcusu(kutular.get(id)!);
    olcuOnbellek.set(id, hesap);
    return hesap;
  };
  const w = (id: string) => olcu(id).genislik;
  const h = (id: string) => olcu(id).yukseklik;

  /** Bir konu dalının kapladığı toplam yükseklik (kardeşler alt alta). */
  const dalYuksekligi = (id: string): number => {
    const alt = konuCocuklari.get(id) || [];
    if (alt.length === 0) return h(id);
    const toplam = alt.reduce((acc, c) => acc + dalYuksekligi(c), 0) + (alt.length - 1) * KONU_BOSLUK;
    return Math.max(h(id), toplam);
  };

  /** Bir konu dalının kapladığı toplam genişlik (alt konular yana gider). */
  const dalGenisligi = (id: string): number => {
    const alt = konuCocuklari.get(id) || [];
    if (alt.length === 0) return w(id);
    return w(id) + SEVIYE_BOSLUK + Math.max(...alt.map(dalGenisligi));
  };

  const yaz = (id: string, x: number, y: number, derinlik: number, taraf: 1 | -1) => {
    yerlesim.set(id, { x, y, derinlik, taraf });
  };

  /**
   * Bir konu dalını yerleştirir.
   *
   * @param yakinX Dalın büyüme yönündeki yakın kenarı: sağa büyüyorsa sol
   *   kenar, sola büyüyorsa sağ kenar.
   * @param ustY Dalın üst sınırı.
   * @param dalYonu Derinliğin gittiği yön (1 sağ, -1 sol).
   * @param taraf Kaydedilecek "hattın hangi yanı" bilgisi; kutunun tutamak
   *   seçiminde kullanılıyor.
   */
  const daliYerlestir = (
    id: string, yakinX: number, ustY: number, derinlik: number, dalYonu: 1 | -1, taraf: 1 | -1
  ) => {
    const genislik = w(id);
    const yukseklik = dalYuksekligi(id);
    const x = dalYonu > 0 ? yakinX : yakinX - genislik;
    yaz(id, x, ustY + yukseklik / 2 - h(id) / 2, derinlik, taraf);

    const cocukYakinX = dalYonu > 0 ? x + genislik + SEVIYE_BOSLUK : x - SEVIYE_BOSLUK;
    let imlec = ustY;
    (konuCocuklari.get(id) || []).forEach((c) => {
      daliYerlestir(c, cocukYakinX, imlec, derinlik + 1, dalYonu, taraf);
      imlec += dalYuksekligi(c) + KONU_BOSLUK;
    });
  };

  const hat = roadmapHatti(nodes, edges);
  let imlec = 0;

  hat.forEach((durak, i) => {
    const genislik = w(durak.id);
    const yukseklik = h(durak.id);
    const cocuklar = konuCocuklari.get(durak.id) || [];

    // Yan konular duraktan durağa yön değiştiriyor: hat iki yanını da
    // kullansın, harita tek tarafa şişmesin. Kullanıcı bir konunun tarafını
    // sabitlemişse (bkz. taraf alanı) o durağın tamamı o yana geçiyor.
    const sabit = durak.data.taraf ?? cocuklar.map((c) => kutular.get(c)?.data.taraf).find(Boolean);
    const taraf: 1 | -1 = sabit === 'sol' ? -1 : sabit === 'sag' ? 1 : i % 2 === 0 ? 1 : -1;

    const kumeYuksekligi = cocuklar.length === 0
      ? 0
      : cocuklar.reduce((acc, c) => acc + dalYuksekligi(c), 0) + (cocuklar.length - 1) * KONU_BOSLUK;

    if (dikey) {
      // Hat aşağı akıyor; küme hattın yanında, durağın hizasında duruyor.
      const blok = Math.max(yukseklik, kumeYuksekligi);
      const merkezY = imlec + blok / 2;
      yaz(durak.id, -genislik / 2, merkezY - yukseklik / 2, 0, taraf);

      const yakinX = taraf > 0
        ? genislik / 2 + SEVIYE_BOSLUK
        : -genislik / 2 - SEVIYE_BOSLUK;
      let cocukY = merkezY - kumeYuksekligi / 2;
      cocuklar.forEach((c) => {
        daliYerlestir(c, yakinX, cocukY, 1, taraf, taraf);
        cocukY += dalYuksekligi(c) + KONU_BOSLUK;
      });

      imlec += blok + HAT_BOSLUK;
    } else {
      // Hat sağa akıyor; küme durağın altına (ya da üstüne) asılıyor ve sol
      // kenarından durakla hizalanıyor.
      const kumeGenisligi = cocuklar.length === 0 ? 0 : Math.max(...cocuklar.map(dalGenisligi));
      const blok = Math.max(genislik, kumeGenisligi);
      const solX = imlec;
      yaz(durak.id, solX + blok / 2 - genislik / 2, -yukseklik / 2, 0, taraf);

      let cocukY = taraf > 0
        ? yukseklik / 2 + SEVIYE_BOSLUK
        : -yukseklik / 2 - SEVIYE_BOSLUK - kumeYuksekligi;
      cocuklar.forEach((c) => {
        daliYerlestir(c, solX, cocukY, 1, 1, taraf);
        cocukY += dalYuksekligi(c) + KONU_BOSLUK;
      });

      imlec += blok + HAT_BOSLUK;
    }
  });

  // Hatta hiç bağlı olmayan kutular (veri bozulmuşsa) yine de çizilsin.
  nodes.forEach((n) => {
    if (yerlesim.has(n.id)) return;
    if (dikey) yaz(n.id, -w(n.id) / 2, imlec, hattaMi(n) ? 0 : 1, 1);
    else yaz(n.id, imlec, -h(n.id) / 2, hattaMi(n) ? 0 : 1, 1);
    imlec += (dikey ? h(n.id) : w(n.id)) + HAT_BOSLUK;
  });

  return yerlesim;
}

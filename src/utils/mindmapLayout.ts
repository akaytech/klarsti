import type { Edge } from '@xyflow/react';
import type { MindmapNode } from '../store/slices/createMindmapSlice';

// Zihin haritası kutuları elle taşınmıyor, her zaman kendiliğinden diziliyor.
// Kök ortada durur, dallar iki yana açılır. Dagre kullanılmıyor: dagre kolon
// kolon hizalıyor, zihin haritasında ise her dal kendi genişliğince kayar ve
// kardeşler dikeyde sırayla yığılır.

const DIKEY_BOSLUK = 16;
const SEVIYE_BOSLUK = 64;

export const DAL_RENKLERI = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444', '#14b8a6'];

/**
 * Kutunun ölçüsü metninden kestiriliyor; ölçmek için DOM'a basmaya gerek yok.
 *
 * DİKKAT: Kutunun içindeki her şey buraya da eklenmeli. Tik kutucuğu ve
 * açıklama işareti metnin yanında yer kaplıyor; tahmine katılmazsa gerçek
 * kutu hesaplanandan geniş olur ve dallar birbirine girer.
 */
export function kutuOlcusu(label: string, derinlik: number, ekler: { tik?: boolean; aciklama?: boolean } = {}) {
  const harfGenisligi = derinlik === 0 ? 10 : 7.5;
  // Tik kutucuğu 16px + 8px boşluk, açıklama işareti 13px + 8px boşluk.
  const eklerPayi = (ekler.tik ? 24 : 0) + (ekler.aciklama ? 21 : 0);
  const yatayPay = (derinlik === 0 ? 48 : 32) + eklerPayi;
  const genislik = Math.min(280 + eklerPayi, Math.max(derinlik === 0 ? 140 : 90, label.length * harfGenisligi + yatayPay));
  // Uzun metin sarınca kutu büyür; kabaca satır sayısından hesaplıyoruz.
  const satir = Math.max(1, Math.ceil((label.length * harfGenisligi + yatayPay) / genislik));
  const yukseklik = (derinlik === 0 ? 52 : 40) + (satir - 1) * 18;
  return { genislik, yukseklik };
}

export type Yerlesim = Map<string, { x: number; y: number; derinlik: number; taraf: 1 | -1 }>;

/**
 * Görünen düğümlerin konumlarını hesaplar. Daraltılmış dalların altı zaten
 * listeye girmez, yani burada gizleme mantığı yok; çağıran süzer.
 */
export function mindmapYerlesimi(nodes: MindmapNode[], edges: Edge[]): Yerlesim {
  const yerlesim: Yerlesim = new Map();
  if (nodes.length === 0) return yerlesim;

  const kutular = new Map(nodes.map((n) => [n.id, n]));
  const cocuklar = new Map<string, string[]>();
  const ebeveyni = new Map<string, string>();
  edges.forEach((e) => {
    if (!kutular.has(e.source) || !kutular.has(e.target)) return;
    if (!cocuklar.has(e.source)) cocuklar.set(e.source, []);
    cocuklar.get(e.source)!.push(e.target);
    ebeveyni.set(e.target, e.source);
  });

  const kok = nodes.find((n) => !ebeveyni.has(n.id)) || nodes[0];

  const derinlikler = new Map<string, number>([[kok.id, 0]]);
  const derinlikHesapla = (id: string, d: number) => {
    derinlikler.set(id, d);
    (cocuklar.get(id) || []).forEach((c) => derinlikHesapla(c, d + 1));
  };
  derinlikHesapla(kok.id, 0);

  const olcu = (id: string) => {
    const n = kutular.get(id)!;
    const derinlik = derinlikler.get(id) ?? 1;
    // Tik kutucuğu kökte yok (bkz. MindmapNode).
    return kutuOlcusu(n.data.label, derinlik, { tik: derinlik > 0, aciklama: !!n.data.description });
  };

  /** Bir dalın kapladığı toplam yükseklik. */
  const dalYuksekligi = (id: string): number => {
    const alt = cocuklar.get(id) || [];
    if (alt.length === 0) return olcu(id).yukseklik;
    const toplam = alt.reduce((acc, c) => acc + dalYuksekligi(c), 0) + (alt.length - 1) * DIKEY_BOSLUK;
    return Math.max(olcu(id).yukseklik, toplam);
  };

  /** Dalı yerleştirir: x merkez, ustY dalın üst sınırı. */
  const yerlestir = (id: string, merkezX: number, ustY: number, taraf: 1 | -1) => {
    const kendiOlcu = olcu(id);
    const yukseklik = dalYuksekligi(id);
    const merkezY = ustY + yukseklik / 2;
    yerlesim.set(id, {
      x: merkezX - kendiOlcu.genislik / 2,
      y: merkezY - kendiOlcu.yukseklik / 2,
      derinlik: derinlikler.get(id) ?? 0,
      taraf
    });

    let imlec = ustY;
    (cocuklar.get(id) || []).forEach((c) => {
      const cocukOlcu = olcu(c);
      const cocukMerkezX = merkezX + taraf * (kendiOlcu.genislik / 2 + SEVIYE_BOSLUK + cocukOlcu.genislik / 2);
      yerlestir(c, cocukMerkezX, imlec, taraf);
      imlec += dalYuksekligi(c) + DIKEY_BOSLUK;
    });
  };

  const kokOlcu = olcu(kok.id);
  yerlesim.set(kok.id, { x: -kokOlcu.genislik / 2, y: -kokOlcu.yukseklik / 2, derinlik: 0, taraf: 1 });

  // Kökün çocukları iki yana paylaştırılıyor: tek sıradakiler sağa, çiftler sola.
  const kokCocuklari = cocuklar.get(kok.id) || [];
  const saglar: string[] = [];
  const sollar: string[] = [];
  kokCocuklari.forEach((c, i) => {
    const kayitli = kutular.get(c)!.data.side;
    if (kayitli === 'left') sollar.push(c);
    else if (kayitli === 'right') saglar.push(c);
    else (i % 2 === 0 ? saglar : sollar).push(c);
  });

  ([[saglar, 1], [sollar, -1]] as [string[], 1 | -1][]).forEach(([liste, taraf]) => {
    const toplam = liste.reduce((acc, c) => acc + dalYuksekligi(c), 0) + Math.max(0, liste.length - 1) * DIKEY_BOSLUK;
    let imlec = -toplam / 2;
    liste.forEach((c) => {
      const cocukOlcu = olcu(c);
      const merkezX = taraf * (kokOlcu.genislik / 2 + SEVIYE_BOSLUK + cocukOlcu.genislik / 2);
      yerlestir(c, merkezX, imlec, taraf);
      imlec += dalYuksekligi(c) + DIKEY_BOSLUK;
    });
  });

  return yerlesim;
}

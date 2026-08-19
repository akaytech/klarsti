import { describe, it, expect } from 'vitest';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import {
  applyNodeChanges as gercekKutu,
  applyEdgeChanges as gercekCizgi,
  addEdge as gercekEkle,
} from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '../kutuDegisiklikleri';

// Bu üç fonksiyon React Flow'dan kopyalandı: kütüphaneden çağrıldıkları sürece
// bütün çizim kütüphanesi depoya bağlanıyordu ve hiç çizim yapmayan araçlar da
// onu indiriyordu (bkz. kutuDegisiklikleri.ts).
//
// Kopya sessizce eskimesin diye burada GERÇEĞİYLE yan yana koşuyorlar. Kütüphane
// yükseltilip davranışı değişirse bu testler kırmızı yanar.
//
// Test kütüphaneyi içe aktarabiliyor; testler kullanıcıya gitmiyor.

const kutu = (id: string, ek: Partial<Node> = {}): Node => ({
  id,
  position: { x: 0, y: 0 },
  data: { label: id },
  ...ek,
});

const cizgi = (id: string, source: string, target: string, ek: Partial<Edge> = {}): Edge => ({
  id, source, target, ...ek,
});

/** İkisini aynı girdiyle koşturur, sonuçları karşılaştırır. */
const kutuKarsilastir = (degisiklikler: NodeChange[], kutular: Node[]) => {
  const bizim = applyNodeChanges(degisiklikler, kutular);
  const onlarin = gercekKutu(degisiklikler, kutular);
  expect(bizim).toEqual(onlarin);
  return bizim;
};

const cizgiKarsilastir = (degisiklikler: EdgeChange[], cizgiler: Edge[]) => {
  const bizim = applyEdgeChanges(degisiklikler, cizgiler);
  const onlarin = gercekCizgi(degisiklikler, cizgiler);
  expect(bizim).toEqual(onlarin);
  return bizim;
};

describe('kutu degisiklikleri kutuphaneyle ayni', () => {
  const kutular = [kutu('a'), kutu('b'), kutu('c')];

  it('secim', () => {
    const sonuc = kutuKarsilastir([{ id: 'b', type: 'select', selected: true }], kutular);
    expect(sonuc[1].selected).toBe(true);
  });

  it('konum ve surukleme', () => {
    const sonuc = kutuKarsilastir(
      [{ id: 'a', type: 'position', position: { x: 10, y: 20 }, dragging: true }],
      kutular,
    );
    expect(sonuc[0].position).toEqual({ x: 10, y: 20 });
    expect(sonuc[0].dragging).toBe(true);
  });

  it('konum degisikligi konumsuz gelirse dokunmuyor', () => {
    const sonuc = kutuKarsilastir([{ id: 'a', type: 'position', dragging: false }], kutular);
    expect(sonuc[0].position).toEqual({ x: 0, y: 0 });
  });

  it('olcu', () => {
    kutuKarsilastir([{ id: 'a', type: 'dimensions', dimensions: { width: 100, height: 50 } }], kutular);
  });

  it('olcu, setAttributes ile', () => {
    for (const setAttributes of [true, 'width', 'height'] as const) {
      kutuKarsilastir(
        [{ id: 'a', type: 'dimensions', dimensions: { width: 100, height: 50 }, setAttributes }],
        kutular,
      );
    }
  });

  it('silme', () => {
    const sonuc = kutuKarsilastir([{ id: 'b', type: 'remove' }], kutular);
    expect(sonuc.map((k) => k.id)).toEqual(['a', 'c']);
  });

  it('degistirme', () => {
    kutuKarsilastir([{ id: 'b', type: 'replace', item: kutu('b', { data: { label: 'yeni' } }) }], kutular);
  });

  it('ekleme sona', () => {
    const sonuc = kutuKarsilastir([{ type: 'add', item: kutu('d') }], kutular);
    expect(sonuc.map((k) => k.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('ekleme araya', () => {
    const sonuc = kutuKarsilastir([{ type: 'add', item: kutu('d'), index: 1 }], kutular);
    expect(sonuc.map((k) => k.id)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('ayni kutuya birden cok degisiklik sirayla uygulaniyor', () => {
    kutuKarsilastir(
      [
        { id: 'a', type: 'position', position: { x: 5, y: 5 } },
        { id: 'a', type: 'select', selected: true },
        { id: 'a', type: 'position', position: { x: 9, y: 9 } },
      ],
      kutular,
    );
  });

  it('silme diger degisikliklerin onune geciyor', () => {
    kutuKarsilastir(
      [
        { id: 'b', type: 'position', position: { x: 5, y: 5 } },
        { id: 'b', type: 'remove' },
      ],
      kutular,
    );
  });

  it('silme sonra gelse de once gelse de ayni', () => {
    kutuKarsilastir(
      [
        { id: 'b', type: 'remove' },
        { id: 'b', type: 'select', selected: true },
      ],
      kutular,
    );
  });

  it('tanimadigi kimlik yok sayiliyor', () => {
    kutuKarsilastir([{ id: 'yok', type: 'select', selected: true }], kutular);
  });

  it('bos degisiklik listesi', () => {
    kutuKarsilastir([], kutular);
  });

  it('degismeyen kutunun REFERANSI korunuyor', () => {
    // Kopyalansaydı React o kutuyu da yeniden çizerdi.
    const sonuc = applyNodeChanges([{ id: 'a', type: 'select', selected: true }], kutular);
    expect(sonuc[1]).toBe(kutular[1]);
    expect(sonuc[0]).not.toBe(kutular[0]);
  });

  it('kalabalik: silme + ekleme + tasima bir arada', () => {
    kutuKarsilastir(
      [
        { id: 'a', type: 'position', position: { x: 1, y: 1 } },
        { id: 'b', type: 'remove' },
        { type: 'add', item: kutu('d'), index: 0 },
        { id: 'c', type: 'select', selected: true },
        { type: 'add', item: kutu('e') },
      ],
      kutular,
    );
  });
});

describe('cizgi degisiklikleri kutuphaneyle ayni', () => {
  const cizgiler = [cizgi('c1', 'a', 'b'), cizgi('c2', 'b', 'c')];

  it('secim', () => {
    cizgiKarsilastir([{ id: 'c1', type: 'select', selected: true }], cizgiler);
  });

  it('silme', () => {
    cizgiKarsilastir([{ id: 'c1', type: 'remove' }], cizgiler);
  });

  it('degistirme', () => {
    cizgiKarsilastir([{ id: 'c2', type: 'replace', item: cizgi('c2', 'b', 'c', { label: 'x' }) }], cizgiler);
  });

  it('ekleme', () => {
    cizgiKarsilastir([{ type: 'add', item: cizgi('c3', 'a', 'c') }], cizgiler);
  });
});

describe('cizgi ekleme kutuphaneyle ayni', () => {
  const cizgiler = [cizgi('c1', 'a', 'b')];
  const karsilastir = (yeni: Edge | Connection, liste: Edge[]) => {
    const bizim = addEdge(yeni as Edge, liste);
    const onlarin = gercekEkle(yeni as Edge, liste);
    expect(bizim).toEqual(onlarin);
    return bizim;
  };

  it('yeni baglanti ekleniyor', () => {
    const sonuc = karsilastir({ source: 'b', target: 'c', sourceHandle: null, targetHandle: null }, cizgiler);
    expect(sonuc).toHaveLength(2);
  });

  it('ayni baglanti ikinci kez eklenmiyor', () => {
    const sonuc = karsilastir({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null }, cizgiler);
    expect(sonuc).toBe(cizgiler);
  });

  it('kimlik farkli olsa bile ayni baglanti eklenmiyor', () => {
    const sonuc = karsilastir(cizgi('bambaska', 'a', 'b'), cizgiler);
    expect(sonuc).toHaveLength(1);
  });

  it('kaynak ya da hedef eksikse liste degismiyor', () => {
    karsilastir({ source: '', target: 'b', sourceHandle: null, targetHandle: null }, cizgiler);
    karsilastir({ source: 'a', target: '', sourceHandle: null, targetHandle: null }, cizgiler);
  });

  it('tutamaklar ayirt ediliyor', () => {
    const tutamakli = [cizgi('c1', 'a', 'b', { sourceHandle: 'sol', targetHandle: 'sag' })];
    karsilastir({ source: 'a', target: 'b', sourceHandle: 'ust', targetHandle: 'alt' }, tutamakli);
    karsilastir({ source: 'a', target: 'b', sourceHandle: 'sol', targetHandle: 'sag' }, tutamakli);
  });

  it('hazir cizgi verilirse kimligi korunuyor', () => {
    const sonuc = karsilastir(cizgi('elle-verilen', 'b', 'c'), cizgiler);
    expect(sonuc[1].id).toBe('elle-verilen');
  });

  it('kimliksiz baglantiya kutuphaneyle ayni kimlik uretiliyor', () => {
    const baglanti = { source: 'b', target: 'c', sourceHandle: 'x', targetHandle: 'y' };
    const sonuc = karsilastir(baglanti, cizgiler);
    expect(sonuc[1].id).toBe(gercekEkle(baglanti, cizgiler)[1].id);
  });
});

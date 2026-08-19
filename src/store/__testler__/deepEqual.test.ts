import { describe, it, expect } from 'vitest';
import { deepEqual } from '../deepEqual';

// Bu karşılaştırma iki kritik kararı veriyor: sunucudan gelen veri elimizdekiyle
// aynı mı (aynıysa elimizdeki tutulur), ve bir işlem geçmişe kayıt düşecek
// kadar değişiklik yarattı mı. İkisinde de yanlış "eşit" cevabı veri kaybettirir,
// yanlış "farklı" cevabı gereksiz yeniden çizim ve boş geri-al adımı üretir.

describe('temel degerler', () => {
  it('ayni ilkel degerler esit', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it('farkli ilkel degerler esit degil', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(0, '')).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
  });

  it('null bir nesneyle karistirilmiyor', () => {
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });
});

describe('nesneler ve diziler', () => {
  it('ayni icerik farkli referans esit', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
  });

  it('ic ice bir fark yakalaniyor', () => {
    expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
  });

  it('anahtar sirasi onemli degil', () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('fazladan anahtar farktir', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it('dizi ile nesne karistirilmiyor', () => {
    expect(deepEqual([], {})).toBe(false);
    expect(deepEqual({ 0: 'a' }, ['a'])).toBe(false);
  });

  it('dizi sirasi onemli', () => {
    expect(deepEqual([1, 2], [1, 2])).toBe(true);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('kutu listeleri: derindeki tek alan farki yakalaniyor', () => {
    const a = [{ id: '1', data: { label: 'Kok' } }, { id: '2', data: { label: 'Dal' } }];
    const b = [{ id: '1', data: { label: 'Kok' } }, { id: '2', data: { label: 'Dal!' } }];
    expect(deepEqual(a, a.map((n) => ({ ...n, data: { ...n.data } })))).toBe(true);
    expect(deepEqual(a, b)).toBe(false);
  });
});

describe('undefined alanlar', () => {
  // Firestore undefined alanları hiç yazmıyor: "alan var ama undefined" ile
  // "alan hic yok" ayni sey. Ayirt etseydik sunucudan gelen her snapshot
  // farkli gorunurdu.
  it('undefined degerli anahtar yok sayilir', () => {
    expect(deepEqual({ a: 1, b: undefined }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true);
  });

  it('undefined ile null ayni sey degil', () => {
    expect(deepEqual({ a: undefined }, { a: null })).toBe(false);
  });
});

describe('yok sayilan alanlar', () => {
  const YOK = new Set(['selected', 'dragging']);

  it('yok sayilan alanin farki esitligi bozmuyor', () => {
    expect(deepEqual({ id: '1', selected: true }, { id: '1', selected: false }, YOK)).toBe(true);
    expect(deepEqual({ id: '1', dragging: true }, { id: '1' }, YOK)).toBe(true);
  });

  it('yok sayma her derinlikte gecerli', () => {
    const a = { nodes: [{ id: '1', selected: true, data: { label: 'x' } }] };
    const b = { nodes: [{ id: '1', selected: false, data: { label: 'x' } }] };
    expect(deepEqual(a, b, YOK)).toBe(true);
  });

  it('yok sayilan alan verilmezse fark olarak gorunur', () => {
    expect(deepEqual({ id: '1', selected: true }, { id: '1', selected: false })).toBe(false);
  });

  it('yok sayma gercek farki gizlemiyor', () => {
    const a = { id: '1', selected: true, data: { label: 'x' } };
    const b = { id: '1', selected: false, data: { label: 'y' } };
    expect(deepEqual(a, b, YOK)).toBe(false);
  });

  it('surukleme esik altinda kalirsa kutu ayni sayilir', () => {
    // Gercek durum: kutu tutulup birakiliyor, konum ayni kaliyor ama yol
    // boyunca yeni nesneler uretiliyor ve dragging bayragi gidip geliyor.
    const once = { id: '1', position: { x: 10, y: 20 }, dragging: false };
    const sonra = { id: '1', position: { x: 10, y: 20 }, dragging: true };
    expect(deepEqual(once, sonra, YOK)).toBe(true);
  });

  it('surukleme gercekten tasidiysa fark gorunur', () => {
    const once = { id: '1', position: { x: 10, y: 20 }, dragging: false };
    const sonra = { id: '1', position: { x: 11, y: 20 }, dragging: false };
    expect(deepEqual(once, sonra, YOK)).toBe(false);
  });
});

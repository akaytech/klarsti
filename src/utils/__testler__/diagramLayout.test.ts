import { describe, it, expect } from 'vitest';
import type { Edge, Node } from '@xyflow/react';
import { altKutular, ebeveyneHizala, semayiDiz } from '../diagramLayout';

// Akış şemasının otomatik hizalaması. Buradaki hata kullanıcının doğrudan
// gördüğü türden: kutu yanlış yere oturur, üst üste biner ya da tek kutu
// hizalanırken bütün şema peşinden sürüklenir.

const EN = 200;
const BOY = 60;

const kutu = (id: string, x: number, y: number): Node => ({
  id,
  position: { x, y },
  data: {},
  measured: { width: EN, height: BOY },
});

const cizgi = (source: string, target: string, ek: Partial<Edge> = {}): Edge =>
  ({ id: `${source}-${target}`, source, target, ...ek });

describe('ebeveyneHizala', () => {
  it('tek cocuk ust kutunun tam ortasina oturur', () => {
    const nodes = [kutu('a', 0, 0), kutu('b', 640, 900)];
    const yer = ebeveyneHizala(nodes, [cizgi('a', 'b')], 'b');
    // Genişlikler eşit olduğu için tek çocuk ebeveyniyle aynı x'e gelir.
    expect(yer).toEqual({ x: 0, y: BOY + 90 });
  });

  it('kardesler varken kendi sirasindaki yere oturur, kardesler kimildamaz', () => {
    const nodes = [kutu('a', 0, 0), kutu('b', 0, 0), kutu('c', 0, 0)];
    const edges = [cizgi('a', 'b'), cizgi('a', 'c')];

    const ilk = ebeveyneHizala(nodes, edges, 'b')!;
    const ikinci = ebeveyneHizala(nodes, edges, 'c')!;

    // İki kutu 60px boşlukla yan yana, ikisinin ortası ebeveynin ortasında.
    expect(ikinci.x - ilk.x).toBe(EN + 60);
    expect((ilk.x + ikinci.x + EN) / 2).toBe(EN / 2);
    expect(ilk.y).toBe(ikinci.y);
  });

  it('ustunde bagli kutu yoksa hizalanacak yer de yok', () => {
    expect(ebeveyneHizala([kutu('a', 0, 0)], [], 'a')).toBeNull();
  });

  it('yan tutamaktan cekilen ikincil cizgi ebeveyn saymaz', () => {
    const nodes = [kutu('a', 0, 0), kutu('b', 500, 500)];
    const edges = [cizgi('a', 'b', { sourceHandle: 'right', targetHandle: 'left' })];
    expect(ebeveyneHizala(nodes, edges, 'b')).toBeNull();
  });
});

describe('altKutular', () => {
  const kutular = (...idler: string[]) => idler.map((id) => kutu(id, 0, 0));

  it('kutunun altindaki bacagin tamami', () => {
    const nodes = kutular('a', 'b', 'c', 'd');
    const edges = [cizgi('a', 'b'), cizgi('b', 'c'), cizgi('c', 'd')];
    expect([...altKutular(nodes, edges, 'b')].sort()).toEqual(['c', 'd']);
  });

  it('yukari geri donen ok ustteki kutulari surukletmez', () => {
    // Karar kutusundan başa dönen ok: b hizalanırken başlangıç ve onun
    // üstündeki hiçbir şey kımıldamamalı, sadece c gelmeli.
    const nodes = kutular('bas', 'b', 'c');
    const edges = [cizgi('bas', 'b'), cizgi('b', 'c'), cizgi('c', 'b')];
    expect([...altKutular(nodes, edges, 'b')]).toEqual(['c']);
  });

  it('iki ayri yerden beslenen kutu peslerinden gitmez', () => {
    // d hem b'ye hem c'ye bağlı; b hizalanırken d yerinde kalmalı, yoksa
    // c'den gelen çizgi kopuk gibi uzuyor.
    const nodes = kutular('a', 'b', 'c', 'd');
    const edges = [cizgi('a', 'b'), cizgi('a', 'c'), cizgi('b', 'd'), cizgi('c', 'd')];
    expect([...altKutular(nodes, edges, 'b')]).toEqual([]);
  });
});

describe('semayiDiz', () => {
  it('cocuklar ebeveynin altina iner', () => {
    const nodes = [kutu('a', 900, 40), kutu('b', 10, 700), kutu('c', 300, 12)];
    const edges = [cizgi('a', 'b'), cizgi('a', 'c')];
    const yerler = semayiDiz(nodes, edges);

    expect(yerler.get('b')!.y).toBeGreaterThan(yerler.get('a')!.y);
    expect(yerler.get('c')!.y).toBe(yerler.get('b')!.y);
    expect(yerler.get('b')!.x).not.toBe(yerler.get('c')!.x);
  });

  it('sema eski yerinde kalir', () => {
    const nodes = [kutu('a', 900, 400), kutu('b', 1200, 800)];
    const yerler = semayiDiz(nodes, [cizgi('a', 'b')]);
    const enSolX = Math.min(...[...yerler.values()].map((y) => y.x));
    const enUstY = Math.min(...[...yerler.values()].map((y) => y.y));

    // Dizilim (0,0) civarında hesaplanıyor ama sonuç şemanın eski
    // çerçevesine taşınıyor; yoksa şema ekrandan kayıp gidiyordu.
    expect(enSolX).toBe(900);
    expect(enUstY).toBe(400);
  });
});

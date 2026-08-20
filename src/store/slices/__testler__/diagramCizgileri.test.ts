import { describe, it, expect } from 'vitest';
import type { Edge, Node } from '@xyflow/react';
import { createDiagramOps } from '../diagramOps';

// Çizgi işlemleri: hangi tutamaktan çıkıp hangisine girdiği, üstündeki yazı,
// ucunun başka bir tutamağa taşınması ve silinmesi.
//
// Neden test: dört tutamağın dördü de hem çıkış hem giriş olduktan sonra bir
// çizginin uçları ARTIK KAYITTAN okunuyor. Tutamak adı yazılmazsa kütüphane
// "listedeki ilk tutamak" diyor ve çizgi bambaşka bir yere yapışıyor.

const kutu = (id: string, x = 0, y = 0): Node => ({
  id,
  type: 'kutu',
  position: { x, y },
  data: { label: id, shape: 'process' },
  measured: { width: 180, height: 56 },
});

const DUZ_TUR = { edge: { type: 'smoothstep', animated: true, stroke: '#94a3b8' } };
/** Organizasyon şeması gibi: yandan yana çekilen çizgi kesikli ikincil hat. */
const IKINCILLI_TUR = {
  ...DUZ_TUR,
  secondaryEdge: { type: 'smoothstep', animated: false, stroke: '#a5b4fc', dashed: true },
};

const kur = (edges: Edge[] = [], tur: any = DUZ_TUR) => {
  let state: any = {
    semalar: [{ id: 's1', name: 'sema', type: 'workflow', nodes: [kutu('a'), kutu('b', 300)], edges, createdAt: 0 }],
    aktifId: 's1',
  };
  const ops = createDiagramOps(
    { listKey: 'semalar', activeKey: 'aktifId', nodeType: 'kutu', getType: () => tur, fallbacks: {} },
    (fn: (s: any) => any) => { state = fn(state); }
  );
  return { ops, cizgiler: () => state.semalar[0].edges as Edge[], kutular: () => state.semalar[0].nodes as Node[] };
};

describe('cizgi kurma', () => {
  it('her iki ucun tutamak adini saklar', () => {
    const { ops, cizgiler } = kur();
    ops.onConnect({ source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'right' });

    expect(cizgiler()).toHaveLength(1);
    expect(cizgiler()[0]).toMatchObject({ source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'right' });
  });

  it('tutamaktaki artidan eklenen kutu ayni tutamaktan baglanir', () => {
    const { ops, cizgiler, kutular } = kur();
    ops.addNode('a', 'process', 'Yeni', { x: 260, y: 0 }, { sourceHandle: 'right', targetHandle: 'left' });

    expect(kutular()).toHaveLength(3);
    expect(cizgiler()[0]).toMatchObject({ source: 'a', sourceHandle: 'right', targetHandle: 'left' });
  });

  it('yandan yana cekilen cizgi ikincil hat stiliyle gelir', () => {
    const { ops, cizgiler } = kur([], IKINCILLI_TUR);
    ops.onConnect({ source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'left' });

    const cizgi = cizgiler()[0] as any;
    expect(cizgi.style.strokeDasharray).toBe('8 6');
    expect(cizgi.markerEnd).toEqual({ type: 'arrowclosed', color: '#a5b4fc' });
  });

  it('ikincil hatti olmayan turde yan cizgi de olagan gorunur', () => {
    const { ops, cizgiler } = kur();
    ops.onConnect({ source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'left' });

    expect((cizgiler()[0] as any).style).toBeUndefined();
  });
});

describe('cizginin uzerindeki yazi', () => {
  const baslangic = (): Edge[] => [{ id: 'e1', source: 'a', target: 'b', sourceHandle: 'bottom', targetHandle: 'top' }];

  it('yaziyi ekler', () => {
    const { ops, cizgiler } = kur(baslangic());
    ops.setEdgeLabel('e1', 'Evet');

    expect(cizgiler()[0].label).toBe('Evet');
  });

  it('bos verilince alani tamamen kaldirir', () => {
    const { ops, cizgiler } = kur([{ ...baslangic()[0], label: 'Hayır' }]);
    ops.setEdgeLabel('e1', '');

    // Boş dizge kalsaydı çizginin ortasında boş bir etiket kutusu dururdu.
    expect('label' in cizgiler()[0]).toBe(false);
  });
});

describe('cizgiyi sokup takma', () => {
  const yaziliCizgi = (): Edge[] => [
    { id: 'e1', source: 'a', target: 'b', sourceHandle: 'bottom', targetHandle: 'top', label: 'Hayır' },
  ];

  it('ucu baska tutamaga tasir, yaziyi korur', () => {
    const { ops, cizgiler } = kur(yaziliCizgi());
    ops.reconnectEdge('e1', { source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'right' });

    expect(cizgiler()[0]).toMatchObject({ sourceHandle: 'right', targetHandle: 'right', label: 'Hayır' });
  });

  it('ayni iki tutamak arasinda ikinci cizgi kurmaz', () => {
    const { ops, cizgiler } = kur([
      ...yaziliCizgi(),
      { id: 'e2', source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'left' },
    ]);
    ops.reconnectEdge('e1', { source: 'a', target: 'b', sourceHandle: 'right', targetHandle: 'left' });

    // Taşınan çizgi eski yerinde kalıyor; üst üste binen iki çizgi olmuyor.
    expect(cizgiler()).toHaveLength(2);
    expect(cizgiler()[0]).toMatchObject({ sourceHandle: 'bottom', targetHandle: 'top' });
  });

  it('siler', () => {
    const { ops, cizgiler } = kur(yaziliCizgi());
    ops.deleteEdge('e1');

    expect(cizgiler()).toHaveLength(0);
  });
});

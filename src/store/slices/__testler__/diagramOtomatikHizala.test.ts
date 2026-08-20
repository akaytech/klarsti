import { describe, it, expect } from 'vitest';
import type { Edge, Node } from '@xyflow/react';
import { createDiagramOps } from '../diagramOps';

// "Otomatik hizala" düğmesinin iki ayrı işi var ve ikisinin BİRBİRİYLE
// tutarlı olması gerekiyor: zaten dizili bir şemada düğmeye basmak hiçbir
// kutuyu oynatmamalı. Kullanıcının gördüğü hata tam buydu: örnek şablon
// dizili geliyor, hepsini seçip hizalayınca kutular yerlerinden kayıyordu.

const kutu = (id: string, x = 0, y = 0, secili = false): Node => ({
  id,
  type: 'kutu',
  position: { x, y },
  data: { label: id, shape: 'process' },
  measured: { width: 180, height: 56 },
  selected: secili,
});

const cizgi = (source: string, target: string): Edge => ({ id: `${source}-${target}`, source, target });

const kur = (nodes: Node[], edges: Edge[]) => {
  let state: any = {
    semalar: [{ id: 's1', name: 'sema', type: 'workflow', nodes, edges, createdAt: 0 }],
    aktifId: 's1',
  };
  const ops = createDiagramOps(
    {
      listKey: 'semalar',
      activeKey: 'aktifId',
      nodeType: 'kutu',
      getType: () => ({ edge: { type: 'smoothstep', animated: false, stroke: '#000' } }) as any,
      fallbacks: {},
    },
    (fn: (s: any) => any) => { state = fn(state); }
  );
  return { ops, konumlar: () => state.semalar[0].nodes.map((n: Node) => ({ id: n.id, ...n.position })) };
};

/** Ebeveyn + iki çocuk + torun; kutular birbirine karışmış yerlerde. */
const dagilmisSema = (secili: boolean) => ({
  nodes: [
    kutu('a', 400, 40, secili),
    kutu('b', -80, 500, secili),
    kutu('c', 900, 260, secili),
    kutu('d', 120, 900, secili),
  ],
  edges: [cizgi('a', 'b'), cizgi('a', 'c'), cizgi('b', 'd')],
});

describe('autoLayout', () => {
  it('hepsi seciliyken butun semayi dizer', () => {
    const hicbiri = dagilmisSema(false);
    const hepsi = dagilmisSema(true);

    const a = kur(hicbiri.nodes, hicbiri.edges);
    const b = kur(hepsi.nodes, hepsi.edges);
    a.ops.autoLayout();
    b.ops.autoLayout();

    // Hepsini seçmek "hepsini hizala" demek: sonuç, hiçbiri seçili değilken
    // çıkan dizilimin aynısı olmalı.
    expect(b.konumlar()).toEqual(a.konumlar());
  });

  it('dizili semada tekrar hizalamak hicbir kutuyu oynatmaz', () => {
    const { nodes, edges } = dagilmisSema(false);
    const s = kur(nodes, edges);

    s.ops.autoLayout();
    const ilk = s.konumlar();
    s.ops.autoLayout();

    expect(s.konumlar()).toEqual(ilk);
  });

  it('dizili semayi hepsini secip hizalamak da oynatmaz', () => {
    const { nodes, edges } = dagilmisSema(false);
    const s = kur(nodes, edges);

    s.ops.autoLayout();
    const ilk = s.konumlar();

    // Kullanıcının yaptığı: bütün kutuları seçip düğmeye basmak.
    s.ops.onNodesChange(ilk.map((k: { id: string }) => ({ type: 'select', id: k.id, selected: true })));
    s.ops.autoLayout();

    expect(s.konumlar()).toEqual(ilk);
  });

  it('kenara cekilen tek kutu, secilip hizalaninca eski yerine doner', () => {
    const { nodes, edges } = dagilmisSema(false);
    const s = kur(nodes, edges);
    s.ops.autoLayout();
    const ilk = s.konumlar();

    // 'c' elle kenara çekiliyor, seçiliyken hizalanıyor. Tek kutu hizalamak
    // ile bütün şemayı hizalamak aynı hesaba bağlı olduğu için kutu tam
    // eski yerine dönmeli, şemanın kalanı yerinde kalmalı.
    s.ops.onNodesChange([
      { type: 'select', id: 'c', selected: true },
      { type: 'position', id: 'c', position: { x: 2000, y: 2000 } },
    ]);
    s.ops.autoLayout();

    expect(s.konumlar()).toEqual(ilk);
  });
});

import type { Node, Edge } from '@xyflow/react';

export interface TreeLayoutOptions {
  /** Aynı sıradaki iki kutu arasındaki en küçük boşluk. */
  nodeSep: number;
  /** İki sıra arasındaki dikey boşluk. */
  rankSep: number;
  getNodeDimensions: (node: Node) => { width: number; height: number };
}

/**
 * Ağaç dizici (tidy tree). Kırılım ağacı her zaman saf bir ağaçtır: her
 * kutunun en fazla bir ebeveyni olur, çevrim yoktur.
 *
 * NEDEN DAGRE DEĞİL: dagre genel amaçlı bir DAG dizicisidir, yatay konumu
 * dört ayrı hizalamanın (UL/UR/DL/DR) ortalamasıyla bulur. Ağaç büyüyünce bu
 * hizalamalar birbirinden uzaklaşıyor ve ortalama saçmalıyor: bir kullanıcının
 * 74 kutuluk ağacında iki kardeş kutu 290px yerine 1450px arayla diziliyordu,
 * yani aralarında dört kutuluk boşluk vardı. Aynı ağaçta align: 'UL' 2900px
 * veriyordu. Ayarla oynamak sonucu şansa bağlamak olurdu.
 *
 * Bu dizici iki şeyi garanti eder:
 * - Kardeşler tam olarak nodeSep aralıkla dizilir.
 * - Ebeveyn, çocuklarının tam ortasında durur.
 *
 * Yaprakları soldan sağa sırayla yerleştirip ebeveyni çocuklarının ortasına
 * koyar. Her alt ağaç kendine ayrı bir yaprak aralığı kapladığı için iki
 * kutunun çakışması mümkün değildir (kutu genişlikleri eşit olduğu sürece;
 * kırılım ağacında hepsi aynı genişlikte).
 */
export function getTreeLayout(
  nodes: Node[],
  edges: Edge[],
  options: TreeLayoutOptions
): Map<string, { x: number; y: number }> {
  const { nodeSep, rankSep, getNodeDimensions } = options;
  const sonuc = new Map<string, { x: number; y: number }>();
  if (nodes.length === 0) return sonuc;

  const kutuById = new Map(nodes.map((n) => [n.id, n]));
  const olcu = (id: string) => getNodeDimensions(kutuById.get(id)!);

  const cocuklar = new Map<string, string[]>();
  const ebeveynli = new Set<string>();
  for (const e of edges) {
    if (!kutuById.has(e.source) || !kutuById.has(e.target)) continue;
    // Ağaçta bir kutunun tek ebeveyni olur. Veri bozuksa ilk kenar geçerli
    // sayılır, fazlası yok sayılır; yoksa aşağıdaki gezinme sonsuza girer.
    if (ebeveynli.has(e.target)) continue;
    ebeveynli.add(e.target);
    const mevcut = cocuklar.get(e.source);
    if (mevcut) mevcut.push(e.target);
    else cocuklar.set(e.source, [e.target]);
  }

  const kokler = nodes.filter((n) => !ebeveynli.has(n.id)).map((n) => n.id);
  // Bütün kutular bir çevrimin içindeyse kök bulunamaz; hiç değilse ilkinden
  // başlanır, böylece ekran boş kalmaz.
  if (kokler.length === 0) kokler.push(nodes[0].id);

  // 1) Derinlikler ve her sıranın en yüksek kutusu.
  const derinlik = new Map<string, number>();
  const siraYuksekligi: number[] = [];
  const sira: { id: string; d: number }[] = kokler.map((id) => ({ id, d: 0 }));
  const gorulen = new Set<string>();
  for (let i = 0; i < sira.length; i++) {
    const { id, d } = sira[i];
    if (gorulen.has(id)) continue;
    gorulen.add(id);
    derinlik.set(id, d);
    siraYuksekligi[d] = Math.max(siraYuksekligi[d] || 0, olcu(id).height);
    (cocuklar.get(id) || []).forEach((c) => sira.push({ id: c, d: d + 1 }));
  }

  const siraY: number[] = [];
  let y = 0;
  for (let d = 0; d < siraYuksekligi.length; d++) {
    siraY[d] = y;
    y += (siraYuksekligi[d] || 0) + rankSep;
  }

  // 2) Yatay: yapraklar sırayla, ebeveynler çocuklarının ortasında.
  const x = new Map<string, number>();
  let imlec = 0;

  const yerlestir = (id: string) => {
    const cs = (cocuklar.get(id) || []).filter((c) => gorulen.has(c));
    const genislik = olcu(id).width;

    if (cs.length === 0) {
      x.set(id, imlec);
      imlec += genislik + nodeSep;
      return;
    }

    cs.forEach(yerlestir);
    const ilk = cs[0];
    const son = cs[cs.length - 1];
    const ilkMerkez = x.get(ilk)! + olcu(ilk).width / 2;
    const sonMerkez = x.get(son)! + olcu(son).width / 2;
    x.set(id, (ilkMerkez + sonMerkez) / 2 - genislik / 2);
  };

  kokler.forEach(yerlestir);

  gorulen.forEach((id) => {
    sonuc.set(id, { x: x.get(id) ?? 0, y: siraY[derinlik.get(id) ?? 0] ?? 0 });
  });

  return sonuc;
}

import dagre from 'dagre';
import type { Edge, Node } from '@xyflow/react';

/**
 * Akış diyagramlarının ve organizasyon şemalarının otomatik hizalaması.
 *
 * Kırılım ağacındaki dizilimden (bkz. treeLayout.ts) ayrı duruyor, çünkü
 * oradaki veri her zaman saf bir ağaç: her kutunun tek ebeveyni var, çevrim
 * yok. Akış şeması öyle değil — bir karar kutusundan çıkan ok yukarıdaki bir
 * işleme geri dönebiliyor, bir kutuya iki ayrı yerden bağlanılabiliyor.
 * Ağaç dizici bu çizgileri sessizce yok sayardı; dagre çevrimleri de birden
 * çok ebeveyni de kaldırıyor.
 */

// Kutu daha ölçülmediyse (ekranda hiç çizilmediyse) kullanılan kaba ölçü.
const VARSAYILAN_EN = 180;
const VARSAYILAN_BOY = 60;

export type Konum = { x: number; y: number };

function olcu(n: Node) {
  return {
    width: n.measured?.width ?? n.width ?? VARSAYILAN_EN,
    height: n.measured?.height ?? n.height ?? VARSAYILAN_BOY,
  };
}

/** Kutunun kısa kenarı. Kutular yatık olduğu için bu neredeyse hep boyudur. */
const kisaKenar = (n: Node) => {
  const { width, height } = olcu(n);
  return Math.min(width, height);
};

/**
 * İki kutu arasındaki boşluk: kutunun kısa kenarı kadar. Sabit bir sayı
 * yerine kutunun kendi ölçüsüne bağlı, çünkü sabit boşluk küçük kutularda
 * seyrek, iri kutularda sıkışık duruyordu.
 *
 * Bir dizilimde birden çok kutu var ve hepsinin ölçüsü aynı olmayabilir;
 * boşluk tek bir sayı olmak zorunda olduğu için ortalama alınıyor. Kutular eşit
 * boyken (olağan hâl) bu tam olarak kutunun kısa kenarı demek.
 */
function bosluk(nodes: Node[]): number {
  if (nodes.length === 0) return VARSAYILAN_BOY;
  const toplam = nodes.reduce((a, n) => a + kisaKenar(n), 0);
  return Math.round(toplam / nodes.length);
}

/**
 * Hiyerarşi çizgisi mi? Kutuların YAN tutamaklarından çekilen çizgiler
 * (sağdan çıkıp soldan giren) ikincil hat sayılıyor: matris şemasındaki ikinci
 * yönetici, ağ şemasındaki dış paydaş hattı (bkz. diagramOps). Bunlar kimin
 * kimin altında olduğunu anlatmadığı için dizilime karışmıyorlar.
 */
const hiyerarsik = (e: Edge) => e.sourceHandle !== 'right' && e.targetHandle !== 'left';

/**
 * Bütün şemayı yukarıdan aşağıya dizer; kutu kimliğinden yeni konuma bir
 * eşleme döner.
 *
 * Dizilim kendi başına (0,0) civarında çıkıyor. Sonuç, şemanın eski çerçevesi
 * neredeyse oraya taşınıyor: yoksa hizala düğmesine basan kullanıcının şeması
 * ekrandan kayıp gidiyor.
 */
export function semayiDiz(nodes: Node[], edges: Edge[]): Map<string, Konum> {
  const sonuc = new Map<string, Konum>();
  if (nodes.length === 0) return sonuc;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  const ara = bosluk(nodes);
  g.setGraph({ rankdir: 'TB', nodesep: ara, ranksep: ara });

  const kutular = new Set(nodes.map((n) => n.id));
  nodes.forEach((n) => g.setNode(n.id, olcu(n)));
  edges.forEach((e) => {
    if (!hiyerarsik(e)) return;
    if (!kutular.has(e.source) || !kutular.has(e.target)) return;
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  // Dagre kutunun MERKEZİNİ veriyor, React Flow sol üst köşesini istiyor.
  let yeniEnKucukX = Infinity;
  let yeniEnKucukY = Infinity;
  let eskiEnKucukX = Infinity;
  let eskiEnKucukY = Infinity;

  nodes.forEach((n) => {
    const yer = g.node(n.id);
    if (!yer) return;
    const { width, height } = olcu(n);
    const konum = { x: yer.x - width / 2, y: yer.y - height / 2 };
    sonuc.set(n.id, konum);
    yeniEnKucukX = Math.min(yeniEnKucukX, konum.x);
    yeniEnKucukY = Math.min(yeniEnKucukY, konum.y);
    eskiEnKucukX = Math.min(eskiEnKucukX, n.position.x);
    eskiEnKucukY = Math.min(eskiEnKucukY, n.position.y);
  });

  if (!Number.isFinite(yeniEnKucukX)) return sonuc;

  const dx = eskiEnKucukX - yeniEnKucukX;
  const dy = eskiEnKucukY - yeniEnKucukY;
  sonuc.forEach((konum, id) => sonuc.set(id, { x: konum.x + dx, y: konum.y + dy }));

  return sonuc;
}

/**
 * Verilen kutulardan aşağı doğru gidilerek ulaşılan her yer. `durak` verilirse
 * o kutunun içinden geçilmez (ama kendisi de sonuca girmez).
 */
function asagiUlasilan(kenarlar: Edge[], baslangic: string[], durak?: string): Set<string> {
  const sonuc = new Set<string>();
  const sira = baslangic.filter((id) => id !== durak);
  sira.forEach((id) => sonuc.add(id));
  while (sira.length) {
    const s = sira.pop()!;
    for (const e of kenarlar) {
      if (e.source !== s || e.target === durak || sonuc.has(e.target)) continue;
      sonuc.add(e.target);
      sira.push(e.target);
    }
  }
  return sonuc;
}

/**
 * Kutunun altında YALNIZCA ona bağlı olan kutular. Tek kutu hizalanırken
 * bunlar da aynı kadar kayıyor; yoksa kutu yerine oturuyor ama altındaki bacak
 * geride kalıp çizgiler uzuyordu.
 *
 * "Yalnızca ona bağlı" ölçüsü şu: bir kutuya baştan (yani ebeveyni olmayan
 * kutulardan) bu kutunun içinden geçmeden de varılabiliyorsa, o kutu buranın
 * malı değildir, yerinde kalır. Bu iki hâli birden çözüyor:
 * - Bir kutu iki ayrı yerden besleniyorsa (elmas) peşimizden sürüklenmiyor.
 * - Karar kutusundan yukarı GERİ dönen ok, hizalanan kutunun üstündeki her
 *   şeyi "alttaki" gibi göstermiyor.
 *
 * Şemanın tamamı çevrimin içindeyse (baş sayılacak kutu yok) kimse taşınmaz;
 * orada "alt" diye bir şey yok, sadece seçili kutu yerine oturur.
 */
export function altKutular(nodes: Node[], edges: Edge[], id: string): Set<string> {
  const kutular = new Set(nodes.map((n) => n.id));
  const kenarlar = edges.filter((e) => hiyerarsik(e) && kutular.has(e.source) && kutular.has(e.target));

  const ebeveynli = new Set(kenarlar.map((e) => e.target));
  const kokler = nodes.filter((n) => !ebeveynli.has(n.id)).map((n) => n.id);
  if (kokler.length === 0) return new Set();

  const baskaYoldan = asagiUlasilan(kenarlar, kokler, id);
  const sonuc = asagiUlasilan(kenarlar, [id]);
  sonuc.delete(id);
  baskaYoldan.forEach((k) => sonuc.delete(k));
  return sonuc;
}

/**
 * Seçili kutunun, bağlı olduğu üst kutunun altındaki yeri.
 *
 * Kardeşleri KIMILDAMIYOR: kutu, kardeşleriyle birlikte kurulacak sıranın
 * kendi sırasındaki yerine oturuyor. Böylece kutular tek tek seçilip
 * hizalandığında satır kendiliğinden düzgün çıkıyor.
 *
 * Üstünde bağlı olduğu bir kutu yoksa null döner (hizalanacak bir pivot yok).
 */
export function ebeveyneHizala(nodes: Node[], edges: Edge[], id: string): Konum | null {
  const kutuById = new Map(nodes.map((n) => [n.id, n]));
  if (!kutuById.has(id)) return null;

  const ebeveynKenari = edges.find(
    (e) => hiyerarsik(e) && e.target === id && e.source !== id && kutuById.has(e.source)
  );
  if (!ebeveynKenari) return null;
  const ebeveyn = kutuById.get(ebeveynKenari.source)!;

  // Kardeşler: aynı kutuya bağlı bütün kutular, çizgilerin eklenme sırasıyla.
  const kardesler: string[] = [];
  for (const e of edges) {
    if (!hiyerarsik(e) || e.source !== ebeveyn.id || e.target === ebeveyn.id) continue;
    if (!kutuById.has(e.target) || kardesler.includes(e.target)) continue;
    kardesler.push(e.target);
  }

  const sira = kardesler.indexOf(id);
  if (sira < 0) return null;

  const ara = bosluk([ebeveyn, ...kardesler.map((k) => kutuById.get(k)!)]);
  const enler = kardesler.map((k) => olcu(kutuById.get(k)!).width);
  const toplamEn = enler.reduce((a, b) => a + b, 0) + ara * (kardesler.length - 1);
  const ebeveynOlcu = olcu(ebeveyn);

  let x = ebeveyn.position.x + ebeveynOlcu.width / 2 - toplamEn / 2;
  for (let i = 0; i < sira; i++) x += enler[i] + ara;

  return { x, y: ebeveyn.position.y + ebeveynOlcu.height + ara };
}

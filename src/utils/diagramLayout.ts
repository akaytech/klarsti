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
 * İki kutu arasındaki boşluk: sade işlem kutusunun kısa kenarı kadar.
 *
 * Şemadaki EN KÜÇÜK kısa kenar alınıyor; bu her zaman sade işlem kutusudur.
 * Karar baklavası, belge, veri deposu gibi biçimler ona ek yükseklik koyar,
 * hiçbiri ondan alçak olamaz (hepsinin en az 56 piksellik ortak bir tabanı
 * var). Ortalama alınıyordu ve yanlıştı: iri bir kutu bütün şemanın arasını
 * açıyor, aynı şema başka kutu eklenince aralık değiştiriyordu. Ölçü tek bir
 * yere bağlı olunca boşluk her yerde aynı kalıyor.
 */
function bosluk(nodes: Node[]): number {
  if (nodes.length === 0) return VARSAYILAN_BOY;
  return Math.round(Math.min(...nodes.map(kisaKenar)));
}

/**
 * Hiyerarşi çizgisi mi? Kutuların YAN tutamaklarından çekilen çizgiler
 * (sağdan çıkıp soldan giren) ikincil hat sayılıyor: matris şemasındaki ikinci
 * yönetici, ağ şemasındaki dış paydaş hattı (bkz. diagramOps). Bunlar kimin
 * kimin altında olduğunu anlatmadığı için dizilime karışmıyorlar.
 *
 * `ikincilVar` yalnızca öyle bir hattı OLAN şemalar için doğru (organizasyon
 * şemaları). Akış şemalarında yandan çekilen çizgi de olağan bir akış
 * çizgisidir; kutunun sağındaki artıdan eklenen kutular dizilimin dışında
 * kalırsa "otomatik hizala" onları köksüz sanıp şemanın tepesine yığıyordu.
 */
const hiyerarsik = (e: Edge, ikincilVar: boolean) =>
  !ikincilVar || (e.sourceHandle !== 'right' && e.targetHandle !== 'left');

/**
 * Bütün şemayı yukarıdan aşağıya dizer; kutu kimliğinden yeni konuma bir
 * eşleme döner.
 *
 * Dizilim kendi başına (0,0) civarında çıkıyor. Sonuç, şemanın eski çerçevesi
 * neredeyse oraya taşınıyor: yoksa hizala düğmesine basan kullanıcının şeması
 * ekrandan kayıp gidiyor.
 */
export function semayiDiz(nodes: Node[], edges: Edge[], ikincilVar = true): Map<string, Konum> {
  const sonuc = new Map<string, Konum>();
  if (nodes.length === 0) return sonuc;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  const ara = bosluk(nodes);
  g.setGraph({ rankdir: 'TB', nodesep: ara, ranksep: ara });

  const kutular = new Set(nodes.map((n) => n.id));
  nodes.forEach((n) => g.setNode(n.id, olcu(n)));
  edges.forEach((e) => {
    if (!hiyerarsik(e, ikincilVar)) return;
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
export function altKutular(nodes: Node[], edges: Edge[], id: string, ikincilVar = true): Set<string> {
  const kutular = new Set(nodes.map((n) => n.id));
  const kenarlar = edges.filter((e) => hiyerarsik(e, ikincilVar) && kutular.has(e.source) && kutular.has(e.target));

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
 * Yer, bütün şemanın dizilimine (semayiDiz) bakılarak bulunuyor: dizilimde bu
 * kutunun ebeveynine göre nerede durduğu ölçülüp, aynı fark ebeveynin
 * ŞU ANKİ yerine ekleniyor. İki şeyi birden sağlıyor:
 *
 * - Ebeveyn ve kardeşler kımıldamıyor; yalnızca seçili kutu yerine oturuyor.
 * - Sonuç bütün şemayı hizalamakla aynı hesaptan çıkıyor. Eskiden burada ayrı
 *   bir "kardeşleri sıraya diz" hesabı vardı ve ikisi aynı yeri göstermiyordu:
 *   zaten dizili bir şemada kutuları seçip hizalayınca hepsi yerinden
 *   oynuyordu.
 *
 * Üstünde bağlı olduğu bir kutu yoksa null döner (hizalanacak bir pivot yok).
 */
export function ebeveyneHizala(nodes: Node[], edges: Edge[], id: string, ikincilVar = true): Konum | null {
  const kutuById = new Map(nodes.map((n) => [n.id, n]));
  if (!kutuById.has(id)) return null;

  const ebeveynKenari = edges.find(
    (e) => hiyerarsik(e, ikincilVar) && e.target === id && e.source !== id && kutuById.has(e.source)
  );
  if (!ebeveynKenari) return null;
  const ebeveyn = kutuById.get(ebeveynKenari.source)!;

  const yerler = semayiDiz(nodes, edges, ikincilVar);
  const kendiYeri = yerler.get(id);
  const ebeveynYeri = yerler.get(ebeveyn.id);
  if (!kendiYeri || !ebeveynYeri) return null;

  return {
    x: ebeveyn.position.x + (kendiYeri.x - ebeveynYeri.x),
    y: ebeveyn.position.y + (kendiYeri.y - ebeveynYeri.y),
  };
}

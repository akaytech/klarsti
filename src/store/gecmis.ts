/**
 * Geri al / ileri al'ın işlem sınırları.
 *
 * Eskiden geçmiş kaydı zamana bağlıydı: 1 saniyelik bir zamanlayıcı her
 * yazmada sıfırlanıyor, o yüzden aralıksız çalışırken onlarca işlem tek
 * adıma iniyordu (ard arda açılan kutuların hepsi bir geri'de silinirdi),
 * bir saniyeden kısa süre önce yapılan işlem ise henüz kaydedilmediği için
 * geri tuşu bambaşka bir şeyi geri alıyordu.
 *
 * Artık ölçü zaman değil, işlem: bir kullanıcı eylemi kaç set() üretirse
 * üretsin geçmişte TEK adım, ve eylem dışında kalan yazmalar (seçim,
 * sürükleme sırasındaki ara kareler, sunucudan gelen güncellemeler) geçmişe
 * hiç girmez.
 *
 * Kullanım:
 *   islem(() => set(...))        tek seferde biten eylemler
 *   islemBasla() / islemBitir()  zamana yayılan eylemler (sürükleme):
 *                                başlangıçtaki hal saklanır, arada olan biten
 *                                yutulur, bitişte tek kayıt düşer.
 */

import { deepEqual } from './deepEqual';

type Anlik = Record<string, unknown>;

// İç içe eylemler tek kayıt olsun diye sayaç: addGoal içinden toggleExpand
// çağrılıyor, ikisi kullanıcı için tek bir "kutu ekledim" işlemi.
let derinlik = 0;
// Olay boyunca açık kalan sınır (bkz. tiktaIslem). Kapanışı mikro göreve
// bırakıldığı için sayaçtan ayrı tutuluyor.
let tikAcik = false;
// İşlem başladıktan sonraki İLK yazmanın öncesindeki hal. Sonraki yazmalar
// aynı işleme ait olduğu için üzerine yazılmaz.
let ilkDurum: Anlik | null = null;

let gecmiseYaz: ((ilkDurum: Anlik) => void) | null = null;
let anlikDurum: (() => Anlik) | null = null;
let yiginiBosalt: (() => void) | null = null;

/**
 * Bir kaydın gerçekten gerekli olup olmadığına bakarken yok sayılan alanlar.
 * Kutuya tıklamak (`selected`) veya sürüklemek (`dragging`) düğüm nesnesini
 * değiştirir ama kullanıcı için "yapılmış bir iş" değildir; bunlar yüzünden
 * kayıt düşerse geri tuşu basıldığında ekranda hiçbir şey olmaz.
 */
const YOK_SAYILAN_ALANLAR = new Set(['selected', 'dragging']);

/** Depo kurulduktan sonra bir kez çağrılır (bkz. useRoadmapStore). */
export const gecmisiBagla = (baglar: {
  yaz: (ilkDurum: Anlik) => void;
  durum: () => Anlik;
  temizle: () => void;
}) => {
  gecmiseYaz = baglar.yaz;
  anlikDurum = baglar.durum;
  yiginiBosalt = baglar.temizle;
};

/**
 * zundo'nun handleSet'i buraya bağlanır. İşlem dışındaki yazmalar sessizce
 * düşer; işlem içindekilerden yalnızca ilkinin öncesi saklanır.
 */
export const yazmayiIsle = (oncekiDurum: Anlik) => {
  if (derinlik === 0) return;
  if (ilkDurum === null) ilkDurum = oncekiDurum;
};

const islemiKapat = () => {
  const ilk = ilkDurum;
  ilkDurum = null;
  if (!ilk || !gecmiseYaz || !anlikDurum) return;

  const son = anlikDurum();
  // Önce referans, sonra içerik: derin karşılaştırma yalnızca referansı
  // değişmiş anahtarlar için, işlem başına bir kez çalışıyor.
  const degisti = Object.keys(ilk).some(
    (k) => ilk[k] !== son[k] && !deepEqual(ilk[k], son[k], YOK_SAYILAN_ALANLAR)
  );
  if (degisti) gecmiseYaz(ilk);
};

export const islemBasla = () => {
  derinlik++;
};

export const islemBitir = () => {
  // Açılmamış bir işlemi kapatma denemesi (örn. sürükleme başlamadan gelen
  // bırakma olayı) sayaçları bozmasın.
  if (derinlik === 0) return;
  derinlik--;
  if (derinlik === 0) islemiKapat();
};

/**
 * Aynı olayda ard arda gelen yazmaları TEK işleme toplar.
 *
 * React Flow bir kutu silindiğinde kutuyu ve ona bağlı çizgileri ayrı ayrı
 * bildiriyor — ve önce ÇİZGİLERİ:
 *
 *   if (hasMatchingEdges) { ...triggerEdgeChanges(...) }   // önce
 *   if (hasMatchingNodes) { ...triggerNodeChanges(...) }   // sonra
 *
 * İkisi ayrı işlem sayılırsa geçmişe düşen fotoğraf "çizgi zaten silinmiş"
 * halini taşıyor. Geri alma kutuyu geri getiriyor ama ebeveyniyle arasındaki
 * çizgiyi getirmiyor; kutu tek başına, kökmüş gibi kalıyor.
 *
 * Bu sarmalayıcı ilk çağrıda işlemi açıyor ve kapanışı olayın sonuna
 * (mikro göreve) bırakıyor. Böylece aynı el hareketindeki bütün yazmalar tek
 * sınırın içinde kalıyor ve geçmişe HER ŞEYDEN ÖNCEKİ hal düşüyor.
 *
 * İç içe `islem` çağrıları zaten sayaçla tek kayda iniyor; bu, sınırı bir
 * çağrının ötesine taşıyan hali.
 */
export const tiktaIslem = (calistir: () => void) => {
  if (tikAcik) {
    // Sınır zaten açık; bu yazma da aynı işleme ait.
    calistir();
    return;
  }
  tikAcik = true;
  islemBasla();
  try {
    calistir();
  } finally {
    queueMicrotask(() => {
      tikAcik = false;
      islemBitir();
    });
  }
};

/** Tek seferde biten eylemler için sarmalayıcı. */
export const islem = <T,>(calistir: () => T): T => {
  islemBasla();
  try {
    return calistir();
  } finally {
    islemBitir();
  }
};

/**
 * Geçmişi sıfırlar. Araç, proje veya üzerinde çalışılan çizim değiştiğinde
 * çağrılır: yığında kalan kayıtlar artık ekranda olmayan bir şeye ait olurdu
 * ve geri tuşu görünürde hiçbir şey yapmazdı.
 */
export const gecmisiTemizle = () => {
  // Yarım kalmış bir işlem (bırakma olayı hiç gelmemiş bir sürükleme) sonraki
  // her yazmayı kendine yutmasın diye sayaç da sıfırlanır.
  derinlik = 0;
  ilkDurum = null;
  // Bekleyen bir tık sınırı varsa o da düşer; yoksa sonraki el hareketi
  // "sınır zaten açık" sanıp kendi kaydını hiç düşürmezdi.
  tikAcik = false;
  yiginiBosalt?.();
};

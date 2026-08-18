/**
 * Bir aracın uygulama içindeki adresi.
 *
 * Neden ayrı bir dosya: aynı adresi iki taraf üretiyor. Sol menü linkin
 * `href`ini yazmak için, AuthenticatedApp ise adresi çözüp doğru klasörü
 * açmak için. İki yerde ayrı hesaplansaydı sağ tıkla açılan sekme, sol tıkla
 * açılandan başka bir klasöre gidebilirdi.
 *
 * DİKKAT: Bu dosya bilerek bağımlılıksız. Buraya store import edilmemeli.
 */

/**
 * "Aracı açmak istiyorum ama hiç klasörüm yok" adresinin öneki:
 * /new/{arac}
 *
 * Neden böyle bir adres var: klasörsüz kullanıcıda araç satırının gideceği
 * bir yer yoktu ve satır link olamıyordu; sağ tık menüsünde "yeni sekmede aç"
 * çıkmıyordu. Artık o durumun da adresi var. Adresi açan kişinin bu arada bir
 * klasörü olmuşsa (başka sekmede açmış olabilir) doğrudan oraya gidiliyor,
 * yoksa klasörün adı soruluyor.
 *
 * DİKKAT: Yeni bir yol adı, araç sayfalarının slug havuzuyla çakışmamalı
 * (bkz. toolPages.ts'teki uyarı).
 */
export const KLASORSUZ_ONEK = '/new/';

/**
 * Hesapsız denemede aracın adresi: /dene/{arac}
 *
 * Denemede klasör kavramı yok; sahte bir "deneme" klasörü var ama onun
 * /project/... adresi giriş yapmamış ziyaretçide çalışmıyor, tanıtım
 * sayfasına düşüyordu. Deneme verisi tarayıcıda durduğu için (bkz.
 * denemeDeposu) yeni sekmede açılan bu adres aynı denemeyi, istenen araçla
 * açıyor.
 */
export const DENEME_ONEK = '/dene/';

/** Sıralamada kullanılan en az bilgi; store'un Project tipinin alt kümesi. */
export interface KlasorOzeti {
  id: string;
  updatedAt?: number;
}

/**
 * Aracın açılacağı klasör: açık klasör varsa o, yoksa en son dokunulan.
 * Hiç klasör yoksa null.
 *
 * `acikKlasorId` sayfa her yenilendiğinde null'a düşüyor ve hiçbir yer onu
 * kendiliğinden doldurmuyor. Eski kod "açık klasör yoksa yeni klasör aç"
 * diyordu; sonuç, kullanıcının her oturumda bir tane daha "Yeni Çalışma"
 * biriktirmesiydi.
 */
export function hedefKlasorBul(klasorler: KlasorOzeti[], acikKlasorId: string | null): string | null {
  if (acikKlasorId && klasorler.some((k) => k.id === acikKlasorId)) return acikKlasorId;
  if (klasorler.length === 0) return null;
  return [...klasorler].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0].id;
}

/** Araç satırının/linkinin gideceği adres. Klasör yoksa /new/{arac}. */
export function aracAdresiBul(arac: string, hedefKlasorId: string | null, denemede = false): string {
  if (denemede) return `${DENEME_ONEK}${arac}`;
  return hedefKlasorId ? `/project/${hedefKlasorId}/${arac}` : `${KLASORSUZ_ONEK}${arac}`;
}

/** Verilen önekten sonraki tek parçayı döner; yoksa ya da iç içeyse null. */
function onekSonrasi(pathname: string, onek: string): string | null {
  if (!pathname.startsWith(onek)) return null;
  const parca = pathname.slice(onek.length).replace(/\/+$/, '');
  return parca && !parca.includes('/') ? parca : null;
}

/** Adres /new/{arac} ise aracın kimliği, değilse null. */
export function klasorsuzAracAdi(pathname: string): string | null {
  return onekSonrasi(pathname, KLASORSUZ_ONEK);
}

/** Adres /dene/{arac} ise aracın kimliği, değilse null. (Düz /dene de null.) */
export function denemeAracAdi(pathname: string): string | null {
  return onekSonrasi(pathname, DENEME_ONEK);
}

/* -------------------------------------------------------------------------
 * Adres <-> durum kararları.
 *
 * Bunlar bilerek SAF: hiçbir şeyi değiştirmiyorlar, yalnızca "bu adres ne
 * demek" ve "bu duruma hangi adres düşer" sorularını cevaplıyorlar. Karar
 * verme ile yapma ayrıldığı için karar tek başına sınanabiliyor
 * (bkz. aracAdresi.test.ts). Eskiden ikisi 160 satırlık tek bir blokta iç
 * içeydi ve ancak canlıda tıklayarak denenebiliyordu.
 * ---------------------------------------------------------------------- */

/** Adres çubuğundaki yolun ne istediği. */
export type AdresNiyeti =
  /** Karşılama ekranı. */
  | { tur: 'kok' }
  /** Tam sayfa çalışma listesi (/works). */
  | { tur: 'calismalar' }
  /** Ajanda (/agenda). Kişisel, klasör gerektirmiyor. */
  | { tur: 'ajanda' }
  /** /new/{arac} — araç seçildi ama tıklandığında hiç klasör yoktu. */
  | { tur: 'klasorsuz'; arac: string }
  /** /project/{klasor}/{arac}/{calisma} */
  | { tur: 'klasor'; klasorId: string; arac?: string; calismaId?: string }
  /** /work/{klasor}/{arac}/{calisma} — paylaşılan çalışma linki. */
  | { tur: 'paylasik'; klasorId: string; arac: string; calismaId?: string }
  /** Elle yazılmış ya da artık geçersiz bir adres. */
  | { tur: 'taninmaz' };

/**
 * Adresi niyete çevirir.
 *
 * @param aracGecerliMi Araç adının gerçekten var olan bir araç olup olmadığı.
 *   Dışarıdan veriliyor: bu dosya bilerek bağımsız (bkz. dosya başı).
 */
export function adresiCoz(
  pathname: string,
  aracGecerliMi: (ad: string) => boolean
): AdresNiyeti {
  if (pathname === '/') return { tur: 'kok' };
  if (pathname === '/works') return { tur: 'calismalar' };
  if (pathname === '/agenda') return { tur: 'ajanda' };

  const yeniArac = klasorsuzAracAdi(pathname);
  if (yeniArac) {
    // Tanınmayan araç adı (elle yazılmış adres) niyet sayılmıyor; adres
    // korunmuyor ve '/' ile temizleniyor.
    return aracGecerliMi(yeniArac) ? { tur: 'klasorsuz', arac: yeniArac } : { tur: 'taninmaz' };
  }

  if (pathname.startsWith('/project/')) {
    const [, , klasorId, arac, calismaId] = pathname.split('/');
    if (!klasorId) return { tur: 'taninmaz' };
    return { tur: 'klasor', klasorId, arac: arac || undefined, calismaId: calismaId || undefined };
  }

  if (pathname.startsWith('/work/')) {
    const [, , klasorId, arac, calismaId] = pathname.split('/');
    // Araç olmadan paylaşılan çalışma linki bir şey ifade etmiyor.
    if (!klasorId || !arac) return { tur: 'taninmaz' };
    return { tur: 'paylasik', klasorId, arac, calismaId: calismaId || undefined };
  }

  return { tur: 'taninmaz' };
}

/**
 * Bu adresi çözmek için klasör listesinin gelmesini beklemek gerekir mi?
 *
 * Ajanda kişisel: users/{uid} altında duruyor, hiçbir klasöre ait değil.
 * Beklerse sayfa yenilendiğinde ekranda önce karşılama ekranı duruyor ve
 * ajanda ancak liste geldikten sonra açılıyor — gözle görülen bir zıplama.
 *
 * Ötekiler gerçekten bekliyor: hangi klasörün açılacağına, hatta klasörün
 * var olup olmadığına liste gelmeden karar verilemiyor.
 */
export const klasorListesiGerekir = (niyet: AdresNiyeti): boolean =>
  niyet.tur !== 'ajanda';

/**
 * Bu duruma hangi adres düşer? Mevcut adres zaten uygunsa null.
 *
 * "Uygun" her zaman "birebir aynı" demek değil: araç seçili değilken hem '/'
 * hem '/works' hem de klasör adının sorulduğu /new/{arac} kabul edilebilir
 * adresler. Bunları ezseydik kullanıcı listeye girer girmez karşılama
 * ekranına atılır, ya da hangi araç için klasör sorduğumuz kaybolurdu.
 */
export function hedefAdres(girdi: {
  activeTool: string | null;
  currentProjectId: string | null;
  acikCalismaId: string | null;
  mevcutAdres: string;
  /** Adres /new/{arac} ve oradaki araç gerçekten var mı? */
  klasorsuzAracGecerli: boolean;
}): string | null {
  const { activeTool, currentProjectId, acikCalismaId, mevcutAdres, klasorsuzAracGecerli } = girdi;

  // Ajanda kişisel: klasör seçili olmasa da kendi adresi var.
  if (activeTool === 'notepad') {
    return mevcutAdres === '/agenda' ? null : '/agenda';
  }

  if (!activeTool) {
    const uygun = mevcutAdres === '/' || mevcutAdres === '/works' || klasorsuzAracGecerli;
    return uygun ? null : '/';
  }

  // Araç var ama klasör yok: adrese dokunulmaz. Bu geçici bir hal (klasör
  // çözülmeyi bekliyor olabilir); '/' ile ezmek linki silmek olurdu.
  if (!currentProjectId) return null;

  // Çalışma kimliği yalnızca seçilmişse ekleniyor. Kullanıcı aracı henüz
  // açtıysa hangi çalışmada olduğu belli değil (ilki gösteriliyor); uydurma
  // bir kimlik yazmak, sonradan silinse bile adreste kalırdı.
  const hedef = acikCalismaId
    ? `/project/${currentProjectId}/${activeTool}/${acikCalismaId}`
    : `/project/${currentProjectId}/${activeTool}`;

  return mevcutAdres === hedef ? null : hedef;
}

/**
 * Tanıtım kliplerinin çekim düzeneği.
 *
 * Ana sayfadaki hareketli demolar elle kaydedilmiyor: burada tarif edilen
 * adımlar tarayıcıda gerçek uygulamanın üstünde oynatılıyor, `scripts/klipCek.mjs`
 * de ekranı kare kare kaydedip videoya çeviriyor. Böylece arayüz değiştiğinde
 * bütün klipler tek komutla yenileniyor.
 *
 * DİKKAT: Bu klasör yalnızca geliştirme kipinde yükleniyor (bkz. App.tsx).
 * Yayına çıkan pakette yok; buraya eklenen hiçbir şey kullanıcıya inmiyor.
 */

export type ImlecDurum = { x: number; y: number; basili: boolean; halka: number };

let yayinla: ((d: ImlecDurum) => void) | null = null;
let durum: ImlecDurum = { x: 660, y: 640, basili: false, halka: 0 };

const guncelle = (yeni: Partial<ImlecDurum>) => {
  durum = { ...durum, ...yeni };
  yayinla?.(durum);
};

/** İmleci çizen katman buraya abone oluyor (bkz. DemoImlec). */
export const imlecAboneOl = (f: ((d: ImlecDurum) => void) | null) => {
  yayinla = f;
};

export const imlecDurumu = () => durum;

export const bekle = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Yavaş başlayıp yavaş biten hareket; imlecin insan eli gibi görünmesini sağlar.
const yumusat = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Ekrandaki bir öğenin ortası. Öğe yoksa hata verir: sahne sessizce bozulmasın. */
export function merkez(sec: string): { x: number; y: number } {
  const oge = document.querySelector(sec);
  if (!oge) throw new Error(`Demo: "${sec}" ekranda yok`);
  const k = oge.getBoundingClientRect();
  return { x: k.left + k.width / 2, y: k.top + k.height / 2 };
}

export async function imlecGit(hedef: { x: number; y: number } | string, sure = 480) {
  const nokta = typeof hedef === 'string' ? merkez(hedef) : hedef;
  const bas = { x: durum.x, y: durum.y };
  const t0 = performance.now();
  await new Promise<void>((cozumle) => {
    const adim = (simdi: number) => {
      const o = Math.min(1, (simdi - t0) / sure);
      const k = yumusat(o);
      guncelle({ x: bas.x + (nokta.x - bas.x) * k, y: bas.y + (nokta.y - bas.y) * k });
      if (o < 1) requestAnimationFrame(adim);
      else cozumle();
    };
    requestAnimationFrame(adim);
  });
}

/** Tıklama efekti: imleç bir an küçülür, arkasında halka açılır. */
export async function tiklaGorsel() {
  guncelle({ basili: true, halka: durum.halka + 1 });
  await bekle(130);
  guncelle({ basili: false });
  await bekle(120);
}

/** İmleci öğenin üstüne götürüp gerçekten tıklar. */
export async function tikla(sec: string) {
  await imlecGit(sec);
  await tiklaGorsel();
  const oge = document.querySelector(sec) as HTMLElement | null;
  oge?.click();
  await bekle(170);
}

/**
 * Harf harf yazma. Metni depoya yazan fonksiyon dışarıdan veriliyor; hangi
 * aracın hangi alanına yazıldığı sahnenin işi.
 */
export async function yaz(uygula: (metin: string) => void, metin: string, hiz = 30) {
  for (let i = 1; i <= metin.length; i++) {
    uygula(metin.slice(0, i));
    // Boşluktan sonra biraz duraklamak, sabit aralıklı yazmaktan daha doğal.
    await bekle(metin[i - 1] === ' ' ? hiz + 45 : hiz);
  }
}

/**
 * React'in kontrol ettiği bir input'a harf harf yazar. Değeri doğrudan
 * atamak React'e ulaşmıyor; yerel setter'ı çağırıp input olayını elle
 * tetiklemek gerekiyor.
 */
export async function inputaYaz(sec: string, metin: string, hiz = 42) {
  const oge = document.querySelector(sec) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!oge) throw new Error(`Demo: "${sec}" ekranda yok`);
  const yerelSetter = Object.getOwnPropertyDescriptor(
    oge instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
    'value'
  )?.set;
  oge.focus();
  for (let i = 1; i <= metin.length; i++) {
    yerelSetter?.call(oge, metin.slice(0, i));
    oge.dispatchEvent(new Event('input', { bubbles: true }));
    await bekle(metin[i - 1] === ' ' ? hiz + 45 : hiz);
  }
}

/** Formu gönderir (Enter'a basmanın karşılığı). */
export async function enter(sec: string) {
  const oge = document.querySelector(sec) as HTMLElement | null;
  const form = oge?.closest('form');
  form?.requestSubmit();
  await bekle(260);
}

/**
 * Alandan çıkar. Uygulamadaki yazı alanlarının çoğu (DebouncedField) yazıyı
 * her tuşta değil, odak kaybında kaydediyor; kaydın görünmesi için gerekli.
 */
export async function odaktanCik(sec: string) {
  const oge = document.querySelector(sec) as HTMLElement | null;
  oge?.blur();
  await bekle(280);
}

// Tuvali ekrana sığdırma.
//
// Tuvalin kendi "ekrana sığdır" düğmesine basılıyor; bunun sebebi bazı
// tuvallerin (5 Neden) kendi React Flow sağlayıcısını kurması: dışarıdan
// alınan örnek o tuvale değil, boş bir örneğe bağlanıyor ve hiçbir şey
// olmuyordu. Düğme her zaman ekrandaki tuvale ait.
//
// Düğme görüntüyü anında sıçratıyor; klipte kötü duruyor. Bu yüzden çekim
// sayfasında React Flow'un görüntü katmanına geçiş süresi verildi (bkz.
// ImlecKatmani içindeki stil), sıçrama yumuşak bir kaydırmaya dönüşüyor.
const SIGDIR_DUGMESI = '.react-flow__controls-fitview';

let sigdirF: (() => void) | null = null;
export const sigdirKaydet = (f: (() => void) | null) => {
  sigdirF = f;
};
export const sigdir = async (bekleme = 430) => {
  const dugme = document.querySelector(SIGDIR_DUGMESI) as HTMLElement | null;
  if (dugme) dugme.click();
  else sigdirF?.();
  await bekle(bekleme);
};

/** Kırpılmış görüntüde imleç ekranın dışından gelsin diye. */
export function imlecBaslangic(x: number, y: number) {
  guncelle({ x, y, basili: false });
}


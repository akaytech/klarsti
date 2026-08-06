// Gönderilmeyi bekleyen (kuyrukta ya da yolda) yazmaların kaydı.
//
// Neden var: paylaşılan bir projede uzaktan gelen snapshot, kullanıcının henüz
// buluta gitmemiş düzenlemesinin üstüne yazıyordu. Kullanıcı kendi eylemini
// ekranda geri alınmış görüyor, bizim yazmamız gidince de geri geliyordu.
// Bekleyen yazması olan araçların uzak hali artık uygulanmıyor.
//
// Kayıt burada duruyor çünkü bunu bilen taraf SyncManager, ihtiyacı olan taraf
// ise useRoadmapStore; store'un bir bileşeni içe aktarması döngü yaratırdı.

type AracSaglayici = (projectId: string) => Set<string>;

let aracSaglayici: AracSaglayici | null = null;
let kisiselSaglayici: (() => boolean) | null = null;

export const bekleyenYazmalariBildir = (
  araclar: AracSaglayici | null,
  kisisel: (() => boolean) | null
) => {
  aracSaglayici = araclar;
  kisiselSaglayici = kisisel;
};

const BOS: ReadonlySet<string> = new Set();

// Bu projede hangi araçların yazması bekliyor?
export const bekleyenAraclar = (projectId: string): ReadonlySet<string> =>
  aracSaglayici ? aracSaglayici(projectId) : BOS;

// Kişisel ajandanın bekleyen bir yazması var mı? (Aynı hesabın iki cihazında
// aynı anda düzenleme yapıldığında geçerli.)
export const kisiselBekliyorMu = (): boolean =>
  kisiselSaglayici ? kisiselSaglayici() : false;

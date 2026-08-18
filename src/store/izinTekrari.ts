/**
 * Sayfa sert yenilendiğinde Firestore'un dinleyicisi bazen "yetkin yok"
 * (permission-denied) diyerek açılıyor. Sebep gerçek bir yetki sorunu değil:
 * Firestore'un içindeki kimlik jetonu, onAuthStateChanged'den bir tık geç
 * bağlanıyor. O aralıkta kurulan dinleyici reddediliyor ve bir daha kendi
 * kendine açılmıyor — kullanıcı boş ekranda kalıyor.
 *
 * Eskiden üç yerde aynı yama vardı: "1,5 saniye bekle, bir kez daha dene".
 * İki sorunu vardı. Bir: tek deneme. Yavaş bağlantıda 1,5 saniye yetmezse
 * veri hiç gelmiyordu. İki: gerçek bir yetki sorunu ile geçici gecikme ayırt
 * edilmiyordu; çağıran taraf ilk hatada uyarı gösteriyor, sonra veri sessizce
 * geliyordu — yani kullanıcı düzelmiş bir sorunun uyarısını görüyordu.
 *
 * Burada beklemenin kendisi kalkmadı, çünkü kaldıracak bir yer yok: Firebase
 * "jeton artık Firestore'a bağlandı" diye bir söz vermiyor. Yapılan şey
 * beklemeyi tek seferlik olmaktan çıkarmak: üç deneme, arası açılarak. Üçü de
 * tutmazsa artık geçici bir gecikme değildir, çağıran taraf uyarıyı o zaman
 * gösterir.
 *
 * Sayaç bu modülde duruyor. Dışarıdan görünmüyor, yalnızca aşağıdaki iki
 * fonksiyon okuyup yazıyor; başka bir dosyanın davranışını sessizce
 * değiştiren paylaşımlı bir bayrak değil.
 */

/** Denemeler arası bekleme. Uzunluğu aynı zamanda deneme hakkını belirliyor. */
export const BEKLEMELER = [400, 1200, 3000];

const sayaclar = new Map<string, number>();

/**
 * Dinleyici açıldığında çağrılır: bir sonraki kopma için haklar yenilenir.
 * Olmasaydı, uzun bir oturumda arada bir yaşanan kopmalar hakları yavaş yavaş
 * tüketir ve en sonunda gerçekten gerektiğinde deneme kalmazdı.
 */
export const izinTekrariSifirla = (anahtar: string) => {
  sayaclar.delete(anahtar);
};

/**
 * Hata geçici bir jeton gecikmesi olabilir mi? Öyleyse dinleyiciyi tekrar
 * kurmayı planlar ve `true` döner.
 *
 * `false` dönen her durumda çağıran taraf hatayı gerçek kabul edebilir:
 * ya hata yetkiyle ilgili değildir, ya kullanıcı değişmiştir, ya da denemeler
 * bitmiştir.
 *
 * @param hataKodu   Firestore'un verdiği kod.
 * @param ayniKullanici Dinleyici kurulurkenki kullanıcı hâlâ oturumda mı?
 *                   Değilse tekrar denemek yanlış hesabın verisini çeker.
 * @param anahtar    Hangi dinleyici ('projeler', 'calismalar', 'kisisel').
 * @param tekrarKur  Dinleyiciyi baştan kuran çağrı.
 */
export function izinTekrariPlanla(
  hataKodu: string | undefined,
  ayniKullanici: boolean,
  anahtar: string,
  tekrarKur: () => void,
): boolean {
  if (hataKodu !== 'permission-denied' || !ayniKullanici) return false;

  const denenen = sayaclar.get(anahtar) ?? 0;
  const gecikme = BEKLEMELER[denenen];
  if (gecikme === undefined) return false;

  sayaclar.set(anahtar, denenen + 1);
  setTimeout(tekrarKur, gecikme);
  return true;
}

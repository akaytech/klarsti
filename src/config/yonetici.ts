/**
 * Yönetim ekranını kimin açabileceği.
 *
 * Tek bir hesap numarası. Rol/yetki tablosu kurulmadı: tek kişilik bir ekip
 * için tablo, veritabanında bakımı gereken ve yanlış yazılınca sessizce
 * kapıyı açan fazladan bir parça olurdu. İkinci bir yönetici gerektiğinde
 * burası listeye çevrilir.
 *
 * DİKKAT: firestore.rules içindeki `yonetici()` fonksiyonunda aynı numara
 * yazılı. Buradaki değişirse orası da değişmeli, yoksa ekran açılır ama
 * veritabanı hiçbir şey vermez.
 *
 * Bu numaranın gizli olması gerekmiyor: kimlik değil, adres gibi bir şey.
 * Asıl kapı, Firebase'in oturum doğrulaması ve firestore.rules.
 */
export const YONETICI_UID = 'gjmZ4g59yAeR9uz6di4Q9C57iO43';

export const yoneticiMi = (uid?: string | null): boolean =>
  !!uid && uid === YONETICI_UID;

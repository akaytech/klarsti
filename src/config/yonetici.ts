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
 *
 * Numara admin@klarsti.com hesabına ait; sahibinin günlük kullandığı kişisel
 * hesap değil. Ayrı tutulmasının sebebi: yönetim erişimi, her gün her yerde
 * kullanılan ve oltalama maili alan hesaba bağlı kalmasın. O hesap bir gün
 * düşerse bütün kullanıcı verisi onunla düşerdi.
 *
 * E-posta değil UID yazılı olmasının sebebi: e-posta değişebilir, ayrıca
 * kurallarda e-postaya güvenmek için ayrıca doğrulanmış olmasına bakmak
 * gerekir. UID hesapla birlikte doğuyor ve hiç değişmiyor.
 */
export const YONETICI_UID = 'nAyfA6WDEUfG0i5duXsVBgBeJbA3';

export const yoneticiMi = (uid?: string | null): boolean =>
  !!uid && uid === YONETICI_UID;

// Kullanıcının kendi hesabını ve bütün verisini silmesi.
//
// Neden gerekli: KVKK ve GDPR, kişinin verisinin silinmesini isteyebilmesini
// şart koşuyor. Bunu yalnızca e-postayla kabul etmek de mümkün ama o zaman
// her talebi elle karşılamak gerekir; kullanıcı açısından da "silebiliyor
// muyum" sorusunun görünür bir cevabı olmaz.
//
// Sunucu tarafı yok (bkz. CLAUDE.md, Firebase ücretsiz planı). Bütün silme
// tarayıcıda, kullanıcının kendi yetkisiyle yapılıyor. Bunun iki sonucu var
// ve ikisi de tasarımı belirledi:
//
// 1) SIRA. Giriş hesabı EN SONA bırakılıyor. Önce silinseydi, kurallar
//    kimliksiz isteklerin hepsini reddeder ve geri kalan veri hiç kimsenin
//    ulaşamayacağı şekilde ortada kalırdı. Bu sırayla, ortada bir kopma
//    olursa kullanıcı hâlâ giriş yapıp tekrar deneyebilir.
//
// 2) YARIM KALMA. Kullanıcı sekmeyi kaparsa iş yarıda kalır. Bu yüzden her
//    adım tekrar çalıştırılabilir olacak şekilde yazıldı: silinmiş bir şeyi
//    tekrar silmek hata vermiyor, ikinci deneme kaldığı yerden devam ediyor.
import {
  collection, query, where, getDocs, deleteDoc, doc, updateDoc,
  arrayRemove, deleteField,
} from 'firebase/firestore';
import {
  deleteUser, reauthenticateWithCredential, signInWithEmailLink,
  sendSignInLinkToEmail, isSignInWithEmailLink, EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebaseCore';
import { db } from '../firebase';
import { useAuthStore } from './useAuthStore';

export type SilmeAdimi =
  | 'dogrulama'
  | 'calismalar'
  | 'klasorler'
  | 'kisisel'
  | 'paylasimlar'
  | 'hesap';

// Adres App.tsx ile ortak; tanımı bilerek bağımlılıksız bir dosyada
// (bkz. config/adresler.ts).
import { SILME_YOLU } from '../config/adresler';

// Bekleyen silme isteği. Mail gönderildikten sonra kullanıcı sayfadan
// çıkıyor, maili açıyor ve geri geliyor; arada tarayıcı belleği sıfırlanıyor.
// Hangi adres için istendiği bu yüzden diske yazılıyor.
//
// Firebase, bağlantıyı doğrularken e-posta adresini de istiyor: bağlantı tek
// başına yeterli olsaydı, linki ele geçiren biri istediği hesaba girebilirdi.
const BEKLEYEN_ANAHTAR = 'klarsti-hesap-silme';

export function bekleyenSilmeyiYaz(eposta: string) {
  localStorage.setItem(BEKLEYEN_ANAHTAR, JSON.stringify({ eposta, zaman: Date.now() }));
}

export function bekleyenSilmeyiOku(): string | null {
  try {
    const ham = localStorage.getItem(BEKLEYEN_ANAHTAR);
    if (!ham) return null;
    return JSON.parse(ham).eposta ?? null;
  } catch {
    return null;
  }
}

export function bekleyenSilmeyiSil() {
  localStorage.removeItem(BEKLEYEN_ANAHTAR);
}

/** Adres çubuğundaki bağlantı bir silme onayı bağlantısı mı. */
export function silmeBaglantisiMi(adres: string): boolean {
  return isSignInWithEmailLink(auth, adres);
}

/**
 * Silme onayı bağlantısını kullanıcının adresine yollar.
 *
 * Neden Google penceresi değil: Google, tarayıcıda açık oturum varsa şifre
 * sormadan yalnızca hesap listesi gösteriyordu ve silme tek tıkla
 * tamamlanıyordu. Cihazını kısa süreliğine birine emanet eden kullanıcının
 * hesabı o kişi tarafından silinebiliyordu. "Şifreyi tekrar sor" ayarı
 * (max_age=0) denendi, Google yok saydı — o tarafı biz zorlayamıyoruz.
 *
 * E-posta bağlantısı kontrolü bize veriyor: silmek için posta kutusuna da
 * erişmek gerekiyor. Sunucuya ihtiyaç yok, maili Firebase'in kendisi
 * gönderiyor (Authentication → Sign-in method → Email link).
 */
export async function silmeBaglantisiGonder(eposta: string): Promise<void> {
  await sendSignInLinkToEmail(auth, eposta, {
    url: `${window.location.origin}${SILME_YOLU}`,
    // Bağlantı uygulamada karşılanacak; Firebase'in kendi ekranına
    // düşmemesi için zorunlu.
    handleCodeInApp: true,
  });
  bekleyenSilmeyiYaz(eposta);
}

/**
 * Maildeki bağlantıyla kimliği doğrular. Silmeden ÖNCE çağrılıyor: veriler
 * gittikten sonra bu adımda takılsaydık kullanıcı verisiz ama hesabı duran
 * bir yerde kalırdı.
 *
 * İki durum var. Kullanıcı hâlâ girişliyse oturumu tazeliyoruz. Bağlantıyı
 * başka bir cihazda veya çıkış yaptıktan sonra açtıysa oturum yok; o zaman
 * bağlantıyla giriş yapılıyor. İkisi de aynı yere çıkıyor: elimizde silme
 * yetkisi olan, kimliği az önce doğrulanmış bir kullanıcı.
 */
export async function baglantiylaDogrula(eposta: string, adres: string): Promise<void> {
  const mevcut = auth.currentUser;

  if (mevcut) {
    if ((mevcut.email ?? '').toLowerCase() !== eposta.toLowerCase()) {
      // Girişli hesap, bağlantının ait olduğu hesap değil. Devam etmek
      // yanlış hesabı silmek olurdu.
      const hata: any = new Error('Hesap eşleşmiyor.');
      hata.code = 'auth/user-mismatch';
      throw hata;
    }
    await reauthenticateWithCredential(
      mevcut,
      EmailAuthProvider.credentialWithLink(eposta, adres)
    );
    return;
  }

  await signInWithEmailLink(auth, eposta, adres);
}

// Firestore tek seferde sınırsız paralel istek sevmiyor; küçük gruplar
// halinde gidiliyor. Veri miktarı bugün küçük ama bu fonksiyon büyük bir
// hesapta da çalışmak zorunda.
const GRUP = 20;
async function gruplarHalinde<T>(kayitlar: T[], islem: (k: T) => Promise<unknown>) {
  for (let i = 0; i < kayitlar.length; i += GRUP) {
    await Promise.all(kayitlar.slice(i, i + GRUP).map(islem));
  }
}

/**
 * Hesabı ve bütün veriyi siler.
 *
 * @param ilerleme Hangi adımda olunduğunu bildirir; pencere bunu gösteriyor.
 */
export async function hesabiSil(
  uid: string,
  ilerleme?: (adim: SilmeAdimi) => void
): Promise<void> {
  // 1) Kendi çalışmaları. Klasörlerden önce siliniyor: klasör kaydı önce
  //    gitseydi, çalışma kurallarındaki klasöre bakan koşullar boşa düşerdi.
  ilerleme?.('calismalar');
  const calismalar = await getDocs(
    query(collection(db, 'works'), where('ownerId', '==', uid))
  );
  await gruplarHalinde(calismalar.docs, (d) => deleteDoc(d.ref));

  // 2) Kendi klasörleri.
  ilerleme?.('klasorler');
  const klasorler = await getDocs(
    query(collection(db, 'projects'), where('userId', '==', uid))
  );
  await gruplarHalinde(klasorler.docs, (d) => deleteDoc(d.ref));

  // 3) Kişisel veri: ajanda, gün sonu değerlendirmeleri, kimlik satırı.
  //    Alt koleksiyon kendiliğinden silinmiyor, tek tek dolaşmak gerekiyor.
  ilerleme?.('kisisel');
  const gunler = await getDocs(collection(db, 'users', uid, 'journal'));
  await gruplarHalinde(gunler.docs, (d) => deleteDoc(d.ref));
  await deleteDoc(doc(db, 'users', uid));
  await deleteDoc(doc(db, 'profiles', uid));

  // 4) Başkalarının paylaşımlarındaki izler. Bu adım atlanırsa kişinin adı ve
  //    e-postası, hesabı silindikten sonra bile başkalarının klasörlerinde
  //    "katılanlar" listesinde yazılı kalırdı.
  ilerleme?.('paylasimlar');
  const paylasilanKlasorler = await getDocs(
    query(collection(db, 'projects'), where('sharedWith', 'array-contains', uid))
  );
  await gruplarHalinde(paylasilanKlasorler.docs, (d) =>
    updateDoc(d.ref, { sharedWith: arrayRemove(uid), [`members.${uid}`]: deleteField() })
  );

  const paylasilanCalismalar = await getDocs(
    query(collection(db, 'works'), where('readers', 'array-contains', uid))
  );
  await gruplarHalinde(paylasilanCalismalar.docs, (d) =>
    updateDoc(d.ref, {
      readers: arrayRemove(uid),
      sharedWith: arrayRemove(uid),
      [`members.${uid}`]: deleteField(),
    })
  );

  // 5) En son giriş hesabı. Buradan sonra geri dönüş yok.
  ilerleme?.('hesap');
  const kullanici = auth.currentUser;
  if (kullanici) await deleteUser(kullanici);

  // 6) Tarayıcıdaki kimlik kopyası.
  //
  // Uygulama, sayfa ilk açılırken kimin girdiğini bu kopyadan okuyup ekranı
  // ona göre çiziyor (bkz. useAuthStore, persist). Silme sonrası burayı
  // temizlemeyi atlarsak, silinmiş bir kimlik tarayıcıda yazılı kalıyor:
  // kullanıcı bir sonraki açılışta kendini bir an girmiş gibi görüyor,
  // içerisi boş olduğu için de "hesap silinmemiş ama verilerim gitmiş"
  // sanıyor. Firebase'in oturum dinleyicisi bunu zaten temizliyor ama biz
  // hemen ardından sayfayı yeniden yüklüyoruz ve o temizliğe sıra gelmiyor.
  useAuthStore.getState().logout();
  useAuthStore.persist.clearStorage();
}

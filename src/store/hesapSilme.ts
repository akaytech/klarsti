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
  deleteUser, reauthenticateWithPopup, reauthenticateWithCredential,
  GoogleAuthProvider, EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebaseCore';
import { db } from '../firebase';

export type SilmeAdimi =
  | 'dogrulama'
  | 'calismalar'
  | 'klasorler'
  | 'kisisel'
  | 'paylasimlar'
  | 'hesap';

/** Kullanıcının hangi yolla giriş yaptığı; kimlik tazeleme buna göre değişir. */
export function girisYolu(): 'google' | 'password' | 'bilinmiyor' {
  const saglayicilar = auth.currentUser?.providerData.map((p) => p.providerId) ?? [];
  if (saglayicilar.includes('google.com')) return 'google';
  if (saglayicilar.includes('password')) return 'password';
  return 'bilinmiyor';
}

/**
 * Kimliği tazeler. Firebase, hesap silme gibi ağır işlemler için oturumun
 * yakın zamanda açılmış olmasını istiyor; aylardır açık duran bir sekmeden
 * silme yapılamıyor (`auth/requires-recent-login`).
 *
 * Silmeden ÖNCE çağrılıyor: veriler gittikten sonra bu adımda takılırsak
 * kullanıcı verisiz ama hesabı duran bir yerde kalırdı.
 */
export async function kimligiTazele(sifre?: string): Promise<void> {
  const kullanici = auth.currentUser;
  if (!kullanici) throw new Error('Oturum bulunamadı.');

  const yol = girisYolu();
  if (yol === 'google') {
    // Yönlendirme değil açılır pencere: yönlendirme sayfayı baştan yükler ve
    // kullanıcının içinde olduğu silme akışı kaybolur.
    await reauthenticateWithPopup(kullanici, new GoogleAuthProvider());
    return;
  }
  if (yol === 'password') {
    if (!sifre) throw new Error('Şifre gerekli.');
    await reauthenticateWithCredential(
      kullanici,
      EmailAuthProvider.credential(kullanici.email ?? '', sifre)
    );
    return;
  }
  throw new Error('Giriş yöntemi tanınmadı.');
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
}

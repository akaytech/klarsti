// Kullanıcının kendi kaydına bıraktığı küçük kimlik satırı.
//
// Neden var: Firebase'in kayıtlı kullanıcı listesi tarayıcıdan okunamıyor,
// yalnızca Firebase konsolu gösteriyor. Yani "kaç kişi kayıtlı, kim ne zaman
// geldi" sorusunun uygulama içinde hiçbir karşılığı yoktu. Herkes kendi
// users/{uid} kaydına bu dört alanı yazınca yönetim ekranı sayabiliyor.
//
// Yazan: kullanıcının kendisi, kendi kaydına. Kimse başkasının satırını
// yazamıyor (bkz. firestore.rules, profiles kuralı). Yönetici yalnızca okuyor.
//
// NEDEN AYRI KOLEKSİYON: bu alanlar users/{uid} içine de yazılabilirdi ama o
// kayıt ajandanın kendisini taşıyor. Yöneticiye orayı açmak, insanların
// notlarını okuyabilir hale getirmek olurdu. Ajanda ve gün sonu
// değerlendirmesi böylece yönetim ekranının tamamen dışında kalıyor.
//
// Ne YAZILMIYOR: ajanda notu, proje içeriği, gezinti geçmişi. Bu kayıt
// "kim, ne zaman" sorusundan fazlasını taşımamalı.
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface KullaniciProfili {
  ad: string;
  eposta: string;
  /** İlk kez bu kaydın yazıldığı an. Kayıt tarihi değil, ona en yakın şey. */
  ilkGoruldu: number;
  sonGoruldu: number;
}

/**
 * Profili tazeler. Oturum başına bir kez çağrılması yeterli.
 *
 * `ilkGoruldu` yalnızca kayıtta yoksa yazılıyor, bu yüzden önce bir okuma
 * yapılıyor. Okumadan `merge` ile yazsaydık her girişte üstüne biner ve alan
 * "son giriş"in kopyasına dönerdi.
 *
 * Sessizce başarısız oluyor: bu kayıt kullanıcının işine yaramıyor, yalnızca
 * bizim görüşümüz için. Ağ koptuğunda kullanıcıya hata göstermenin anlamı yok.
 */
export async function profiliTazele(
  uid: string,
  ad: string,
  eposta: string
): Promise<void> {
  try {
    const ref = doc(db, 'profiles', uid);
    const mevcut = await getDoc(ref);
    const simdi = Date.now();

    const yazilacak: Partial<KullaniciProfili> = {
      ad,
      // Küçük harfe çevriliyor: yönetim ekranındaki arama tam eşleşme
      // yapıyor, Firestore'da harf duyarsız arama diye bir şey yok. Kayıt
      // "Ahmet@..." diye girilmişse aranınca bulunamazdı.
      eposta: eposta.toLowerCase(),
      sonGoruldu: simdi,
    };
    if (!mevcut.exists() || !mevcut.data()?.ilkGoruldu) {
      yazilacak.ilkGoruldu = simdi;
    }

    await setDoc(ref, yazilacak, { merge: true });
  } catch (err) {
    console.warn('Profil kaydi yazilamadi:', err);
  }
}

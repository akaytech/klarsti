// Uygulama içindeki "Sorun bildir" düğmesinin arkasındaki iş.
//
// Neden var: destek adresine düz bir mailto: koymak yetmiyordu. Gelen mesaj
// "açılmıyor" oluyor ve elimizde hiçbir şey olmuyor; hangi sürüm, hangi
// tarayıcı, hangi ekran, hangi kullanıcı — hepsini tek tek sormak gerekiyor
// ve çoğu kullanıcı ikinci mesajı yazmıyor. Burası o bilgileri mesajın
// altına kendisi ekliyor.
//
// Ne EKLENMİYOR: kullanıcının içeriği. Not, proje adı, düğüm metni, hiçbiri.
// Sorunu çözmeye yaramıyorlar ve kullanıcının verisini habersiz e-postayla
// dışarı taşımak olurdu. Buraya alan eklerken bu sınırı koru.
import packageJson from '../../package.json';
import { CONTACT_EMAIL } from '../config/iletisim';

export interface DestekPostasiMetni {
  /** E-postanın konusu. */
  konu: string;
  /** Kullanıcının üstüne yazacağı satır. */
  giris: string;
  /** Teknik bilgi bloğunun başlığı. */
  teknikBaslik: string;
}

export interface DestekPostasiKimlik {
  dil: string;
  kullaniciId?: string;
  eposta?: string;
}

/**
 * Konusu ve gövdesi hazır bir mailto: adresi üretir.
 *
 * Uzunluk: tarayıcı kimliği (userAgent) en uzun satır, ~200 karakter.
 * Toplam gövde 600 karakteri geçmiyor, mailto sınırlarının çok altında.
 */
export function destekPostasiBaglantisi(
  metin: DestekPostasiMetni,
  kimlik: DestekPostasiKimlik
): string {
  // Teknik satırlar bilerek İngilizce etiketli: mesajı okuyan biziz ve
  // kullanıcının dili ne olursa olsun aynı biçimde gelmeleri gerekiyor.
  const teknik = [
    `Version: ${packageJson.version}`,
    `Language: ${kimlik.dil}`,
    `Page: ${window.location.pathname}`,
    `Screen: ${window.innerWidth}x${window.innerHeight}`,
    `Browser: ${navigator.userAgent}`,
    kimlik.kullaniciId ? `User: ${kimlik.kullaniciId}` : null,
    kimlik.eposta ? `Account: ${kimlik.eposta}` : null,
  ].filter((satir): satir is string => satir !== null);

  const govde = [metin.giris, '', '', metin.teknikBaslik, ...teknik].join('\n');

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(metin.konu)}&body=${encodeURIComponent(govde)}`;
}

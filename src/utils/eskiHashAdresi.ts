// Uygulama HashRouter kullanırken bütün adresler `klarsti.com/#/project/...`
// biçimindeydi. BrowserRouter'a geçince bu adresler kırılıyor: tarayıcı `#`
// sonrasını sunucuya hiç göndermez, router da onu görmez; kullanıcı paylaşılan
// bir proje linkine tıkladığında ana sayfaya düşer.
//
// Dışarıda dolaşan o linkler geri alınamıyor (WhatsApp mesajları, e-postalar,
// yer imleri). Bu yüzden açılışta hash bir kez okunup gerçek yola çevriliyor.
// React render edilmeden önce çalışmak zorunda: router ilk yolu mount anında
// okuyor, sonra müdahale etmek geçmişte fazladan bir kayıt bırakır.
//
// Yalnızca `#/` ile başlayan hash'e dokunulur. Firebase Auth yönlendirmesi ve
// sayfa içi çapa linkleri bu biçimi üretmez, onlar olduğu gibi kalır.
export function eskiHashAdresiniCevir() {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash;
  if (!hash.startsWith('#/')) return;

  const yol = hash.slice(1);
  // Sorgu dizesi hash'in kendi içinde de olabilir; iki yerden birleştirirsek
  // adrese iki tane `?` girer.
  const sorgu = yol.includes('?') ? '' : window.location.search;

  // BASE_URL canlıda "/", dev ve GitHub Pages derlemesinde "/klarsti/".
  // Router'a basename olarak o veriliyor, dolayısıyla yeni adres de onun
  // altında olmalı.
  const taban = import.meta.env.BASE_URL.replace(/\/$/, '');

  // replaceState kullanılıyor: eski adres geçmişte kalsaydı geri tuşu
  // kullanıcıyı tekrar çalışmayan linke götürürdü.
  window.history.replaceState(null, '', taban + yol + sorgu);
}

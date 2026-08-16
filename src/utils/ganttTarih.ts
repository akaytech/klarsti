/**
 * Gantt'ın tarih hesapları.
 *
 * Tarihler 'YYYY-MM-DD' metni olarak saklanıyor; uygulamanın geri kalanı da
 * (WBS hedef tarihi, ajanda) böyle tutuyor. Saat yok: bir Gantt çubuğu gün
 * ölçüsünde anlamlı, saat ölçüsünde değil.
 *
 * DİKKAT: Bütün hesap yerel saatte yapılıyor. `new Date('2026-03-12')` UTC
 * gece yarısı demek; Türkiye'de bu 03:00 olur ve gün farkı hesabında bir gün
 * kayabilir. O yüzden metin elle parçalanıp `new Date(yil, ay, gun)` ile
 * kuruluyor.
 */

const GUN_MS = 86_400_000;

export const tariheCevir = (metin: string): Date => {
  const [yil, ay, gun] = metin.split('-').map(Number);
  return new Date(yil, (ay || 1) - 1, gun || 1);
};

export const metneCevir = (tarih: Date): string => {
  const ay = String(tarih.getMonth() + 1).padStart(2, '0');
  const gun = String(tarih.getDate()).padStart(2, '0');
  return `${tarih.getFullYear()}-${ay}-${gun}`;
};

export const bugununMetni = () => metneCevir(new Date());

/** İki tarih arasındaki tam gün farkı. Yaz saati geçişlerinde de doğru. */
export const gunFarki = (a: string, b: string): number => {
  const x = tariheCevir(a);
  const y = tariheCevir(b);
  return Math.round((y.getTime() - x.getTime()) / GUN_MS);
};

export const gunEkle = (metin: string, gun: number): string => {
  const t = tariheCevir(metin);
  t.setDate(t.getDate() + gun);
  return metneCevir(t);
};

/** Görevin kapladığı gün sayısı; bitiş günü dahil, en az 1. */
export const gunSayisi = (baslangic: string, bitis: string): number =>
  Math.max(1, gunFarki(baslangic, bitis) + 1);

export const haftaSonuMu = (metin: string): boolean => {
  const g = tariheCevir(metin).getDay();
  return g === 0 || g === 6;
};

export const ayinIlkiMi = (metin: string): boolean => tariheCevir(metin).getDate() === 1;

/** Pazartesi mi? Hafta sütunları buradan başlıyor. */
export const haftaBasiMi = (metin: string): boolean => tariheCevir(metin).getDay() === 1;

export const kucukOlan = (a: string, b: string) => (a <= b ? a : b);
export const buyukOlan = (a: string, b: string) => (a >= b ? a : b);

/** "12 Mar" gibi kısa etiket; ay adı kullanıcının diline göre. */
export const gunEtiketi = (metin: string, dil: string) =>
  new Intl.DateTimeFormat(dil, { day: 'numeric', month: 'short' }).format(tariheCevir(metin));

/** "Mart 2026" — üst şeritteki ay başlığı. */
export const ayEtiketi = (metin: string, dil: string) =>
  new Intl.DateTimeFormat(dil, { month: 'long', year: 'numeric' }).format(tariheCevir(metin));

/** Takvimde gösterilecek aralık: en erken başlangıçtan en geç bitişe. */
export function araligiHesapla(
  tarihler: { baslangic: string; bitis: string }[],
  bugun = bugununMetni()
): { basla: string; bit: string } {
  if (tarihler.length === 0) {
    // Boş planda bile takvim çizilsin: bugünün etrafında bir ay.
    return { basla: gunEkle(bugun, -7), bit: gunEkle(bugun, 21) };
  }
  let enErken = tarihler[0].baslangic;
  let enGec = tarihler[0].bitis;
  tarihler.forEach(({ baslangic, bitis }) => {
    enErken = kucukOlan(enErken, baslangic);
    enGec = buyukOlan(enGec, bitis);
  });
  // Bugün aralığın dışındaysa da görünsün: "bugün" çizgisi Gantt'ın en çok
  // bakılan işareti, aralığın dışında kalırsa hiç çizilmiyordu.
  enErken = kucukOlan(enErken, bugun);
  enGec = buyukOlan(enGec, bugun);
  // Kenarlarda birer hafta boşluk: çubuk tam kenara yapışınca sürüklemek zor.
  return { basla: gunEkle(enErken, -7), bit: gunEkle(enGec, 7) };
}

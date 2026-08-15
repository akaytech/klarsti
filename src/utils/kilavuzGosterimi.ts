/**
 * Bir aracın kılavuzu bu tarayıcıda daha önce açıldı mı?
 *
 * Neden var: kılavuz metinleri ürünün en iyi parçası ama en çok ihtiyacı olan
 * kişi, aracı ilk kez açan kullanıcı, sağ üstteki düğmeyi fark etmiyordu.
 * Artık her araç ilk açıldığında kılavuz bir kez kendiliğinden açılıyor;
 * kapatan bir daha görmüyor.
 *
 * Tercih kullanıcının hesabına değil tarayıcısına yazılıyor: kişisel ve
 * önemsiz bir iz, sunucuya taşımaya değmez.
 */

const ANAHTAR = 'klarsti-kilavuz-gosterildi';

const oku = (): string[] => {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    return ham ? ham.split(',').filter(Boolean) : [];
  } catch {
    // Gizli sekmede depolama erişimi hata verebiliyor. O zaman kılavuz her
    // açılışta çıkar; yanlış ama zararsız bir davranış.
    return [];
  }
};

export const kilavuzGosterildiMi = (arac: string): boolean => oku().includes(arac);

export const kilavuzuGosterildiIsaretle = (arac: string): void => {
  const liste = oku();
  if (liste.includes(arac)) return;
  try {
    localStorage.setItem(ANAHTAR, [...liste, arac].join(','));
  } catch {
    /* gizli sekme */
  }
};

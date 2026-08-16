/**
 * Blog yazısının tarihi, yazının kendi dilinde.
 *
 * Ayrı dosyada: liste sayfası da tek yazı sayfası da kullanıyor. Bileşen
 * dosyasından dışa açıldığında hızlı yenileme (fast refresh) bozuluyor.
 */
export function blogTarihi(ms: number | null, dil: string): string {
  if (!ms) return '';
  const bicim = { day: 'numeric', month: 'long', year: 'numeric' } as const;
  try {
    return new Date(ms).toLocaleDateString(dil, bicim);
  } catch {
    // Tanınmayan dil kodu Intl'de hata veriyor; tarihsiz bırakmaktansa
    // İngilizce yazmak daha iyi.
    return new Date(ms).toLocaleDateString('en', bicim);
  }
}

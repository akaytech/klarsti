/**
 * Ölçümleme (Google Analytics) için kullanıcının kararı.
 *
 * Neden gerekli: uygulama Avrupa'daki kullanıcılara da açık (Almanca,
 * Fransızca, İtalyanca arayüz var). Orada zorunlu olmayan ölçümleme,
 * kullanıcı izin vermeden başlatılamıyor.
 *
 * Neyin izne ihtiyacı YOK: oturum bilgisi, dil, tema, çevrimdışı önbellek ve
 * bot koruması (reCAPTCHA). Bunlar uygulamanın çalışması ve güvenliği için
 * zorunlu; izne bağlansalar "hayır" diyen kullanıcı uygulamayı hiç
 * kullanamazdı. İzne bağlı olan tek şey ölçümleme.
 *
 * DİKKAT: Bu dosya bilerek bağımlılıksız. Hem tanıtım sayfasındaki çerez
 * şeridi hem de firebase.ts okuyor; buraya bir şey import edilirse tanıtım
 * sayfasının paket izolasyonu bozulur (bkz. CLAUDE.md).
 */
export type CerezKarari = 'kabul' | 'red';

const ANAHTAR = 'klarsti-cerez-izni';

export function cerezKarariniOku(): CerezKarari | null {
  try {
    const deger = localStorage.getItem(ANAHTAR);
    return deger === 'kabul' || deger === 'red' ? deger : null;
  } catch {
    // Gizli sekmede ya da depolama kapalıyken okuma patlayabiliyor.
    // Karar yok saymak doğru davranış: izin verilmemiş kabul edilir.
    return null;
  }
}

export function cerezKarariniYaz(karar: CerezKarari): void {
  try {
    localStorage.setItem(ANAHTAR, karar);
  } catch {
    // Yazamıyorsak da uygulama çalışmaya devam etmeli; yalnızca karar
    // hatırlanmaz ve şerit bir sonraki açılışta yine sorar.
  }
}

/** Ölçümleme başlatılabilir mi. Karar verilmemişse HAYIR. */
export function olcumlemeyeIzinVar(): boolean {
  return cerezKarariniOku() === 'kabul';
}

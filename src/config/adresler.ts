/**
 * Uygulama içi sabit adresler.
 *
 * Neden ayrı ve bağımlılıksız bir dosya: bu sabitleri hem App.tsx (ilk
 * açılışta inen paket) hem de Firestore/Auth kullanan ağır modüller okuyor.
 * Sabit o ağır modüllerden birinde dursaydı, App.tsx onu import ederken
 * Firestore'u da tanıtım sayfasının paketine sokardı (bkz. CLAUDE.md,
 * modülerlik kuralı).
 */

/** Hesap silme onayı: maildeki bağlantının döndüğü adres. */
export const SILME_YOLU = '/hesap-sil';

/**
 * Sağ tıklanan yer bir metin alanı mı?
 *
 * Çizim alanlarında sağ tık kendi bağlam menümüzü açıyor ve bunu yaparken
 * tarayıcının kendi menüsünü bastırıyor. Kutunun içindeki bir yazı alanında
 * bu yanlış: kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü
 * değil. Metin alanındaki sağ tıklamayı kendi haline bırakıyoruz.
 *
 * Kontrol `closest` ile: tıklama metnin kendisine değil, alanın içindeki bir
 * öğeye de gelebiliyor (biçimlendirilmiş metinde kalın bir kelime gibi).
 */
export function metinAlaninda(hedef: EventTarget | null): boolean {
  const el = hedef as HTMLElement | null;
  if (!el || typeof el.closest !== 'function') return false;
  return !!el.closest('input, textarea, select, [contenteditable="true"]');
}

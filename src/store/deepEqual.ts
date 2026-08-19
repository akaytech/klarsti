/**
 * Derin karşılaştırma. Depoda iki yerde birebir aynı kod olarak duruyordu:
 * biri sunucudan gelen güncellemeyi elimizdekiyle karşılaştıran tarafta
 * (useRoadmapStore), biri geri al/ileri al tarafında (gecmis.ts). Tek farkları
 * ikincisinin bazı alanları yok saymasıydı; o fark artık bir parametre.
 *
 * Neden referans karşılaştırması yetmiyor:
 *
 * - Sunucu tarafında: her snapshot yepyeni nesneler getiriyor. İçerik aynıysa
 *   elimizdeki nesneyi tutmak gerekiyor, yoksa referans değişince ekrandaki
 *   her şey yeniden çizilir ve senkronizasyon bütün araçları "değişmiş" sanıp
 *   hepsini birden yükler.
 *
 * - Geçmiş tarafında: eşik altında kalan bir sürükleme kutuyu yerine geri
 *   oturtuyor ama yol boyunca yeni nesneler üretiyor. İçerik aynıysa geçmişe
 *   kayıt düşmemeli, yoksa geri tuşuna basınca ekranda hiçbir şey olmaz.
 *
 * `undefined` değerli anahtarlar iki tarafta da yok sayılıyor: Firestore
 * `undefined` alanları hiç yazmıyor, dolayısıyla "alan var ama undefined" ile
 * "alan hiç yok" aynı şey.
 */
export function deepEqual(
  a: unknown,
  b: unknown,
  /** Karşılaştırmada hiç bakılmayacak alan adları; her derinlikte geçerli. */
  yokSayilan?: ReadonlySet<string>,
): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    const digeri = b as unknown[];
    return a.length === digeri.length && a.every((eleman, i) => deepEqual(eleman, digeri[i], yokSayilan));
  }

  const aNesne = a as Record<string, unknown>;
  const bNesne = b as Record<string, unknown>;
  const anahtarlar = (n: Record<string, unknown>) =>
    Object.keys(n).filter((k) => n[k] !== undefined && !yokSayilan?.has(k));

  const aAnahtarlar = anahtarlar(aNesne);
  const bAnahtarlar = anahtarlar(bNesne);
  return (
    aAnahtarlar.length === bAnahtarlar.length &&
    aAnahtarlar.every((k) => deepEqual(aNesne[k], bNesne[k], yokSayilan))
  );
}

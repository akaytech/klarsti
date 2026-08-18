/**
 * Çalışma listelerinde sıra değiştirme.
 *
 * Sıra ayrı bir alanda değil, dizinin kendi sırasında duruyor. Çalışma
 * kayıtları birleştirilirken de sırayı projenin toolData'sı veriyor (bkz.
 * calismaOkuma.ts), yani diziyi değiştirmek sırayı kalıcı kılıyor.
 *
 * Yedi araç aynı işi yapıyor; hepsinin kendi kopyasını taşımasının bir sebebi
 * yok.
 */
export function siraDegistir<T extends { id: string }>(
  liste: T[],
  id: string,
  hedefIndex: number
): T[] | null {
  const kaynak = liste.findIndex((o) => o.id === id);
  if (kaynak < 0) return null;
  const hedef = Math.max(0, Math.min(liste.length - 1, hedefIndex));
  if (kaynak === hedef) return null;

  const yeni = [...liste];
  const [tasinan] = yeni.splice(kaynak, 1);
  yeni.splice(hedef, 0, tasinan);
  return yeni;
}

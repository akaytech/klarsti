import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * SWOT, kılçık, PUKÖ ve şelale ekranlarının form durumu.
 *
 * Dördünde de aynı üç durum vardı: üstteki "yeni kayıt" kutusu, her kategori
 * için açık duran kalem kutuları, ve silme onayı bekleyen kaydın kimliği.
 * Kalem kutuları tek bir sözlükte tutuluyor; anahtarı "kayıt-kategori".
 * Bu kurulum dört dosyada birebir tekrar ediyordu.
 *
 * Kalem kutusunun kendi durumunu (her tuş vuruşu) burada tutmak bilinçli:
 * kutu boşken ekle düğmesi kapalı duruyor, ekledikten sonra kutu temizleniyor.
 * Kayıtlı metinler ise DebouncedField üzerinden gidiyor, yani her harfte
 * depoya yazılmıyor.
 */
export function useAnalizFormu<K extends string>(
  kayitAc: (ad: string) => void,
  kalemEkle: (kayitId: string, kategori: K, metin: string) => void,
) {
  const [yeniAd, setYeniAd] = useState('');
  const [girdiler, setGirdiler] = useState<Record<string, string>>({});
  const [silinecekId, setSilinecekId] = useState<string | null>(null);

  const anahtar = (kayitId: string, kategori: K) => `${kayitId}-${kategori}`;

  const kayitGonder = (e: FormEvent) => {
    e.preventDefault();
    if (!yeniAd.trim()) return;
    kayitAc(yeniAd);
    setYeniAd('');
  };

  const kalemMetni = (kayitId: string, kategori: K) => girdiler[anahtar(kayitId, kategori)] || '';

  const kalemYaz = (kayitId: string, kategori: K, metin: string) =>
    setGirdiler((onceki) => ({ ...onceki, [anahtar(kayitId, kategori)]: metin }));

  const kalemGonder = (e: FormEvent, kayitId: string, kategori: K) => {
    e.preventDefault();
    const metin = girdiler[anahtar(kayitId, kategori)];
    if (!metin?.trim()) return;
    kalemEkle(kayitId, kategori, metin);
    setGirdiler((onceki) => ({ ...onceki, [anahtar(kayitId, kategori)]: '' }));
  };

  return {
    yeniAd,
    setYeniAd,
    kayitGonder,
    kalemMetni,
    kalemYaz,
    kalemGonder,
    silinecekId,
    setSilinecekId,
  };
}

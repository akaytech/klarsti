import { v4 as uuidv4 } from 'uuid';
import { islem } from '../gecmis';
import { logAppEvent } from '../../firebase';

/**
 * SWOT, balık kılçığı, PUKÖ ve şelalenin ortak iskeleti.
 *
 * Dördü de aynı şey: bir başlık, ve o başlığın altında KATEGORİLERE ayrılmış
 * kalemler. Değişen yalnızca isimler — SWOT'un "title"ı var, kılçığın problem
 * cümlesi, PUKÖ'nün hedefi, şelalenin adı; kategori alanı da sırasıyla
 * "type", "category", "phase", "phase".
 *
 * Dördü ayrı yazıldığında aynı altı işlem dört kez tekrarlanıyordu: bir
 * hatayı düzeltince üçü eski kalıyor, bir özellik eklemek dört kez yazmak
 * demek oluyordu. İşlemlerin gövdesi artık burada tek yerde duruyor.
 *
 * Araçlara özgü olanlar (PUKÖ'nün kalem durumu, şelalenin aşama sayacı)
 * bilerek DIŞARIDA: burası ortak olanı toplar, farklı olanı gizlemez.
 *
 * Eylem adları değişmiyor: dışarıdan bakan her yer (özellikle
 * config/toolWorks.ts, eylemleri adıyla arıyor) eskisi gibi çalışır.
 */

interface Ayar {
  /** Durumdaki dizinin adı: 'swot', 'ishikawa', 'pdca', 'waterfall'. */
  anahtar: string;
  /** Kaydın başlığını taşıyan alan: 'title', 'problemStatement', 'goal', 'name'. */
  adAlani: string;
  /** Kalemin kategorisini taşıyan alan: 'type' ya da 'phase'/'category'. */
  kategoriAlani: string;
  /** logAppEvent'te görünen araç adı. Verilmezse olay yazılmaz. */
  aracAdi?: string;
  /** Yeni kayda eklenecek araca özgü alanlar (ör. şelalenin aşama sayacı). */
  yeniKaydinEkleri?: () => Record<string, unknown>;
  /** Yeni kaleme eklenecek araca özgü alanlar (ör. PUKÖ'nün durumu). */
  yeniKaleminEkleri?: () => Record<string, unknown>;
}

type Kayit = Record<string, any>;

export function kategoriliListeIslemleri(
  ayar: Ayar,
  set: (kismi: any) => void,
  get: () => any
) {
  const liste = (): Kayit[] => get()[ayar.anahtar] ?? [];
  const yaz = (yeni: Kayit[]) => set({ [ayar.anahtar]: yeni });

  /** Tek bir kaydı değiştirir, ötekilere dokunmaz. */
  const kaydiGuncelle = (kayitId: string, degistir: (k: Kayit) => Kayit) =>
    yaz(liste().map((k) => (k.id === kayitId ? degistir(k) : k)));

  return {
    /** Yeni kayıt listenin BAŞINA giriyor: en son açılan en üstte görünsün. */
    ekle: (ad: string) => islem(() => {
      const yeni: Kayit = {
        id: uuidv4(),
        [ayar.adAlani]: ad,
        items: [],
        createdAt: Date.now(),
        ...(ayar.yeniKaydinEkleri?.() ?? {})
      };
      yaz([yeni, ...liste()]);
    }),

    adiGuncelle: (id: string, ad: string) => islem(() => {
      kaydiGuncelle(id, (k) => ({ ...k, [ayar.adAlani]: ad }));
    }),

    sil: (id: string) => islem(() => {
      yaz(liste().filter((k) => k.id !== id));
    }),

    /** Kalem kaydın SONUNA giriyor: kullanıcı yazdığı sırayı görsün. */
    kalemEkle: (kayitId: string, kategori: string, metin: string) => islem(() => {
      if (ayar.aracAdi) logAppEvent('node_created', { tool: ayar.aracAdi, type: kategori });
      const kalem: Kayit = {
        id: uuidv4(),
        [ayar.kategoriAlani]: kategori,
        text: metin,
        createdAt: Date.now(),
        ...(ayar.yeniKaleminEkleri?.() ?? {})
      };
      kaydiGuncelle(kayitId, (k) => ({ ...k, items: [...(k.items ?? []), kalem] }));
    }),

    kalemGuncelle: (kayitId: string, kalemId: string, metin: string) => islem(() => {
      kaydiGuncelle(kayitId, (k) => ({
        ...k,
        items: (k.items ?? []).map((i: Kayit) => (i.id === kalemId ? { ...i, text: metin } : i))
      }));
    }),

    kalemSil: (kayitId: string, kalemId: string) => islem(() => {
      kaydiGuncelle(kayitId, (k) => ({
        ...k,
        items: (k.items ?? []).filter((i: Kayit) => i.id !== kalemId)
      }));
    })
  };
}

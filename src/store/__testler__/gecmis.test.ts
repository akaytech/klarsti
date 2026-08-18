import { describe, it, expect, beforeEach } from 'vitest';
import {
  gecmisiBagla, yazmayiIsle, islem, islemBasla, islemBitir, gecmisiTemizle
} from '../gecmis';

// Geri al / ileri al'ın işlem sınırları.
//
// Buradaki hata kullanıcının doğrudan gördüğü türden: geri tuşuna basar,
// ya hiçbir şey olmaz, ya da yaptığı on şey birden uçar.

type Anlik = Record<string, unknown>;

let durum: Anlik;
let yazilanlar: Anlik[];
let temizlenmeSayisi: number;

/** zundo'nun yaptığı iş: her yazmada ÖNCEKİ hali geçmişe bildirir. */
const yaz = (yeni: Anlik) => {
  const onceki = durum;
  durum = yeni;
  yazmayiIsle(onceki);
};

beforeEach(() => {
  durum = {};
  yazilanlar = [];
  temizlenmeSayisi = 0;
  gecmisiBagla({
    yaz: (ilkDurum) => yazilanlar.push(ilkDurum),
    durum: () => durum,
    temizle: () => { temizlenmeSayisi += 1; }
  });
  // Önceki testten yarım kalmış bir işlem sızmasın: modül seviyesinde
  // tutulan sayaç bütün testler arasında paylaşılıyor.
  gecmisiTemizle();
  temizlenmeSayisi = 0;
});

describe('islem sinirlari', () => {
  it('tek islem tek kayit dusurur', () => {
    durum = { kutular: ['a'] };
    islem(() => yaz({ kutular: ['a', 'b'] }));
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0]).toEqual({ kutular: ['a'] });
  });

  // Bir kullanici eylemi kac yazma uretirse uretsin gecmiste TEK adim olmali.
  // addGoal icinden toggleExpand cagriliyor; kullanici icin ikisi tek is.
  it('islem icindeki butun yazmalar tek kayda iner', () => {
    durum = { kutular: [] };
    islem(() => {
      yaz({ kutular: ['a'] });
      yaz({ kutular: ['a', 'b'] });
      yaz({ kutular: ['a', 'b', 'c'] });
    });
    expect(yazilanlar).toHaveLength(1);
    // Kaydedilen hal, ILK yazmadan onceki hal olmali; yoksa geri tusu
    // eylemin ortasina donerdi.
    expect(yazilanlar[0]).toEqual({ kutular: [] });
  });

  it('ic ice islemler tek kayit dusurur', () => {
    durum = { sayi: 0 };
    islem(() => {
      yaz({ sayi: 1 });
      islem(() => yaz({ sayi: 2 }));
    });
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0]).toEqual({ sayi: 0 });
  });

  // Secim, surukleme sirasindaki ara kareler, sunucudan gelen guncellemeler.
  it('islem disindaki yazma gecmise hic girmez', () => {
    durum = { sayi: 0 };
    yaz({ sayi: 1 });
    yaz({ sayi: 2 });
    expect(yazilanlar).toHaveLength(0);
  });

  // Islem disindaki yazma yalnizca "gecmise girmemekle" kalmamali; sonraki
  // islemin BASLANGIC HALI de olmamali. Olsaydi geri tusu bir adim degil iki
  // adim geri giderdi: kullanici son yaptigi seyi geri almak isterken ondan
  // oncekini de kaybederdi.
  it('islem disindaki yazma sonraki islemin baslangici olmaz', () => {
    durum = { sayi: 0 };
    yaz({ sayi: 1 });                    // islem disi (or. sunucudan gelen)
    islem(() => yaz({ sayi: 2 }));       // kullanicinin gercek eylemi
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0]).toEqual({ sayi: 1 });
  });

  // Zamana yayilan eylem: surukleme. Baslangictaki hal saklanir, aradaki
  // ara kareler yutulur, biraktiginda tek kayit duser.
  it('islemBasla/islemBitir arasindaki ara kareler yutulur', () => {
    durum = { x: 0 };
    islemBasla();
    yaz({ x: 1 });
    yaz({ x: 2 });
    yaz({ x: 3 });
    islemBitir();
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0]).toEqual({ x: 0 });
  });
});

describe('gereksiz kayit dusurmeme', () => {
  // Esik altinda kalan bir surukleme kutuyu yerine geri oturtuyor ama yol
  // boyunca yepyeni nesneler uretiyor. Referans karsilastirmasi yetmez.
  it('icerik ayniysa kayit dusmez', () => {
    durum = { kutular: [{ id: 'a', x: 10 }] };
    islem(() => yaz({ kutular: [{ id: 'a', x: 10 }] }));
    expect(yazilanlar).toHaveLength(0);
  });

  // Kutuya tiklamak veya suruklemek nesneyi degistirir ama "yapilmis bir is"
  // degildir. Kayit dusseydi geri tusuna basildiginda ekranda hicbir sey olmaz.
  it('yalnizca secim degistiyse kayit dusmez', () => {
    durum = { kutular: [{ id: 'a', selected: false }] };
    islem(() => yaz({ kutular: [{ id: 'a', selected: true }] }));
    expect(yazilanlar).toHaveLength(0);
  });

  it('yalnizca surukleme isareti degistiyse kayit dusmez', () => {
    durum = { kutular: [{ id: 'a', dragging: false }] };
    islem(() => yaz({ kutular: [{ id: 'a', dragging: true }] }));
    expect(yazilanlar).toHaveLength(0);
  });

  // Ama secimle BIRLIKTE gercek bir degisiklik olduysa kayit dusmeli.
  it('secimle birlikte gercek degisiklik varsa kayit duser', () => {
    durum = { kutular: [{ id: 'a', selected: false, etiket: 'eski' }] };
    islem(() => yaz({ kutular: [{ id: 'a', selected: true, etiket: 'yeni' }] }));
    expect(yazilanlar).toHaveLength(1);
  });

  it('hic yazma olmayan islem kayit dusurmez', () => {
    durum = { sayi: 0 };
    islem(() => { /* kullanici vazgecti */ });
    expect(yazilanlar).toHaveLength(0);
  });
});

describe('bozulmaya karsi', () => {
  // Surukleme baslamadan gelen bir birakma olayi sayaclari bozmamali; bozarsa
  // sonraki her yazma kendine yutulur ve geri tusu bir daha calismaz.
  it('acilmamis islemi kapatmak sayaci bozmaz', () => {
    islemBitir();
    islemBitir();
    durum = { sayi: 0 };
    islem(() => yaz({ sayi: 1 }));
    expect(yazilanlar).toHaveLength(1);
  });

  // islem() finally kullaniyor: icerideki hata sayaci acik birakmamali.
  it('islem icinde hata firlasa da sonraki islem calisir', () => {
    durum = { sayi: 0 };
    expect(() => islem(() => { throw new Error('patladi'); })).toThrow('patladi');
    islem(() => yaz({ sayi: 1 }));
    expect(yazilanlar).toHaveLength(1);
  });

  it('islem cagrilan fonksiyonun sonucunu dondurur', () => {
    expect(islem(() => 42)).toBe(42);
  });

  // Arac, proje ya da acik cizim degisince yigin bosalir: yigindaki kayitlar
  // artik ekranda olmayan bir seye aitti.
  it('gecmisiTemizle yigini bosaltir ve yarim islemi iptal eder', () => {
    durum = { sayi: 0 };
    islemBasla();
    yaz({ sayi: 1 });
    gecmisiTemizle();
    expect(temizlenmeSayisi).toBe(1);

    // Yarim kalan islem kapatilmis olmali: bu islemBitir bir kayit dusurmemeli.
    islemBitir();
    expect(yazilanlar).toHaveLength(0);

    // Ve sonraki islem normal calismali.
    durum = { sayi: 1 };
    islem(() => yaz({ sayi: 2 }));
    expect(yazilanlar).toHaveLength(1);
  });
});

import { describe, it, expect } from 'vitest';
import {
  adresiCoz, hedefAdres, hedefKlasorBul, aracAdresiBul,
  klasorsuzAracAdi, denemeAracAdi
} from '../aracAdresi';

// Adres çubuğu ile ekranın birbirini takip etmesi. Buradaki hata kullanıcının
// doğrudan gördüğü türden: paylaşılan link açılmaz, geri tuşu çalışmaz, ya da
// sayfa yenilenince başka bir yere düşülür.

const ARACLAR = ['wbs', 'mindmap', '5whys', 'notepad', 'roadmap'];
const gecerli = (ad: string) => ARACLAR.includes(ad);

describe('adresiCoz', () => {
  it('kok adresi', () => {
    expect(adresiCoz('/', gecerli)).toEqual({ tur: 'kok' });
  });

  it('calisma listesi', () => {
    expect(adresiCoz('/works', gecerli)).toEqual({ tur: 'calismalar' });
  });

  it('ajanda', () => {
    expect(adresiCoz('/agenda', gecerli)).toEqual({ tur: 'ajanda' });
  });

  it('klasorsuz arac adresi', () => {
    expect(adresiCoz('/new/wbs', gecerli)).toEqual({ tur: 'klasorsuz', arac: 'wbs' });
  });

  // Elle yazilmis adres. Taninmaz sayilmali; yoksa olmayan bir arac icin
  // klasor adi sorulurdu.
  it('taninmayan arac adi klasorsuz sayilmaz', () => {
    expect(adresiCoz('/new/olmayanarac', gecerli)).toEqual({ tur: 'taninmaz' });
  });

  it('klasor adresi: arac ve calisma ile', () => {
    expect(adresiCoz('/project/p1/wbs/c1', gecerli)).toEqual({
      tur: 'klasor', klasorId: 'p1', arac: 'wbs', calismaId: 'c1'
    });
  });

  it('klasor adresi: yalnizca arac', () => {
    expect(adresiCoz('/project/p1/wbs', gecerli)).toEqual({
      tur: 'klasor', klasorId: 'p1', arac: 'wbs', calismaId: undefined
    });
  });

  it('klasor adresi: yalnizca klasor', () => {
    expect(adresiCoz('/project/p1', gecerli)).toEqual({
      tur: 'klasor', klasorId: 'p1', arac: undefined, calismaId: undefined
    });
  });

  it('paylasik calisma adresi', () => {
    expect(adresiCoz('/work/p1/wbs/c1', gecerli)).toEqual({
      tur: 'paylasik', klasorId: 'p1', arac: 'wbs', calismaId: 'c1'
    });
  });

  // Arac olmadan paylasilan calisma linki bir sey ifade etmiyor.
  it('aracsiz paylasik adres taninmaz', () => {
    expect(adresiCoz('/work/p1', gecerli)).toEqual({ tur: 'taninmaz' });
  });

  it('bos klasor kimligi taninmaz', () => {
    expect(adresiCoz('/project/', gecerli)).toEqual({ tur: 'taninmaz' });
  });

  it('bilinmeyen yol taninmaz', () => {
    expect(adresiCoz('/blog/bir-yazi', gecerli)).toEqual({ tur: 'taninmaz' });
  });
});

describe('hedefAdres', () => {
  const temel = {
    activeTool: null as string | null,
    currentProjectId: null as string | null,
    acikCalismaId: null as string | null,
    mevcutAdres: '/',
    klasorsuzAracGecerli: false
  };

  it('arac ve klasor varken proje adresini uretir', () => {
    expect(hedefAdres({ ...temel, activeTool: 'wbs', currentProjectId: 'p1', mevcutAdres: '/' }))
      .toBe('/project/p1/wbs');
  });

  it('acik calisma varsa adrese eklenir', () => {
    expect(hedefAdres({
      ...temel, activeTool: 'wbs', currentProjectId: 'p1', acikCalismaId: 'c1', mevcutAdres: '/'
    })).toBe('/project/p1/wbs/c1');
  });

  it('adres zaten dogruysa null doner', () => {
    expect(hedefAdres({
      ...temel, activeTool: 'wbs', currentProjectId: 'p1', mevcutAdres: '/project/p1/wbs'
    })).toBeNull();
  });

  it('ajanda kendi adresine gider', () => {
    expect(hedefAdres({ ...temel, activeTool: 'notepad', mevcutAdres: '/' })).toBe('/agenda');
    expect(hedefAdres({ ...temel, activeTool: 'notepad', mevcutAdres: '/agenda' })).toBeNull();
  });

  // Ajanda kisisel: klasor secili olmasa da adresi var.
  it('ajanda klasorsuz da calisir', () => {
    expect(hedefAdres({
      ...temel, activeTool: 'notepad', currentProjectId: null, mevcutAdres: '/project/p1/wbs'
    })).toBe('/agenda');
  });

  it('arac yokken bilinmeyen adres koke doner', () => {
    expect(hedefAdres({ ...temel, mevcutAdres: '/project/p1/wbs' })).toBe('/');
  });

  // '/works' de aracsiz bir durum. Ezilseydi kullanici listeye girer girmez
  // karsilama ekranina atilirdi.
  it('arac yokken calisma listesi adresine dokunulmaz', () => {
    expect(hedefAdres({ ...temel, mevcutAdres: '/works' })).toBeNull();
  });

  // Klasor adi sorulurken ekranda arac yok; adres silinirse hangi arac icin
  // sordugumuz da kaybolur.
  it('klasor adi sorulurken adrese dokunulmaz', () => {
    expect(hedefAdres({ ...temel, mevcutAdres: '/new/wbs', klasorsuzAracGecerli: true })).toBeNull();
  });

  it('gecersiz klasorsuz adres koke doner', () => {
    expect(hedefAdres({ ...temel, mevcutAdres: '/new/olmayanarac', klasorsuzAracGecerli: false })).toBe('/');
  });

  // Klasor henuz cozulmemis olabilir. '/' ile ezmek, kullanicinin elindeki tek
  // tutamagi (linki) silmek olurdu.
  it('arac var ama klasor yokken adrese dokunulmaz', () => {
    expect(hedefAdres({
      ...temel, activeTool: 'wbs', currentProjectId: null, mevcutAdres: '/project/p1/wbs'
    })).toBeNull();
  });
});

describe('hedefKlasorBul', () => {
  // acikKlasorId sayfa yenilendiginde null'a dusuyor. Eski kod "acik klasor
  // yoksa yeni klasor ac" diyordu; kullanici her oturumda bir "Yeni Calisma"
  // biriktiriyordu.
  it('acik klasor varsa o secilir', () => {
    expect(hedefKlasorBul([{ id: 'a', updatedAt: 1 }, { id: 'b', updatedAt: 9 }], 'a')).toBe('a');
  });

  it('acik klasor listede yoksa en son dokunulan secilir', () => {
    expect(hedefKlasorBul([{ id: 'a', updatedAt: 1 }, { id: 'b', updatedAt: 9 }], 'silinmis')).toBe('b');
  });

  it('acik klasor yoksa en son dokunulan secilir', () => {
    expect(hedefKlasorBul([{ id: 'a', updatedAt: 1 }, { id: 'b', updatedAt: 9 }], null)).toBe('b');
  });

  it('hic klasor yoksa null doner', () => {
    expect(hedefKlasorBul([], null)).toBeNull();
  });
});

describe('aracAdresiBul', () => {
  it('klasor varsa proje adresi', () => {
    expect(aracAdresiBul('wbs', 'p1')).toBe('/project/p1/wbs');
  });

  it('klasor yoksa /new adresi', () => {
    expect(aracAdresiBul('wbs', null)).toBe('/new/wbs');
  });

  it('denemede /dene adresi', () => {
    expect(aracAdresiBul('wbs', 'p1', true)).toBe('/dene/wbs');
  });
});

describe('onek cozumleyicileri', () => {
  it('ic ice yol kabul edilmez', () => {
    expect(klasorsuzAracAdi('/new/wbs/fazla')).toBeNull();
  });

  it('sondaki bolu isareti yok sayilir', () => {
    expect(klasorsuzAracAdi('/new/wbs/')).toBe('wbs');
  });

  it('duz /dene arac vermez', () => {
    expect(denemeAracAdi('/dene')).toBeNull();
    expect(denemeAracAdi('/dene/wbs')).toBe('wbs');
  });
});

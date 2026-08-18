import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../firebase', () => ({ logAppEvent: () => {} }));

const { kategoriliListeIslemleri } = await import('../kategoriliListe');

// SWOT, kılçık, PUKÖ ve şelalenin ortak iskeleti. Dördü de buradan geçtiği
// için buradaki bir hata dört araçta birden görünür.

let durum: Record<string, any>;
const set = (kismi: any) => { durum = { ...durum, ...kismi }; };
const get = () => durum;

const swot = () => kategoriliListeIslemleri(
  { anahtar: 'swot', adAlani: 'title', kategoriAlani: 'type', aracAdi: 'swot' }, set, get
);

beforeEach(() => { durum = { swot: [] }; });

describe('kayit islemleri', () => {
  it('yeni kayit listenin BASINA girer', () => {
    const o = swot();
    o.ekle('birinci');
    o.ekle('ikinci');
    expect(durum.swot.map((k: any) => k.title)).toEqual(['ikinci', 'birinci']);
  });

  it('yeni kayit bos kalem listesiyle dogar', () => {
    swot().ekle('analiz');
    expect(durum.swot[0].items).toEqual([]);
    expect(typeof durum.swot[0].id).toBe('string');
    expect(typeof durum.swot[0].createdAt).toBe('number');
  });

  it('ad guncellenir, oteki kayitlara dokunulmaz', () => {
    const o = swot();
    o.ekle('bir'); o.ekle('iki');
    const hedef = durum.swot[1];
    o.adiGuncelle(hedef.id, 'yeni ad');
    expect(durum.swot[1].title).toBe('yeni ad');
    expect(durum.swot[0].title).toBe('iki');
  });

  it('kayit silinir', () => {
    const o = swot();
    o.ekle('bir'); o.ekle('iki');
    o.sil(durum.swot[0].id);
    expect(durum.swot.map((k: any) => k.title)).toEqual(['bir']);
  });

  it('olmayan kaydin adini guncellemek hicbir seyi bozmaz', () => {
    const o = swot();
    o.ekle('bir');
    o.adiGuncelle('yok-boyle-bir-id', 'x');
    expect(durum.swot[0].title).toBe('bir');
  });
});

describe('kalem islemleri', () => {
  const hazirla = () => {
    const o = swot();
    o.ekle('analiz');
    return { o, kayitId: durum.swot[0].id };
  };

  // Kalem SONA giriyor: kullanici yazdigi sirayi gormeli.
  it('kalem kaydin SONUNA girer', () => {
    const { o, kayitId } = hazirla();
    o.kalemEkle(kayitId, 'S', 'birinci');
    o.kalemEkle(kayitId, 'W', 'ikinci');
    expect(durum.swot[0].items.map((i: any) => i.text)).toEqual(['birinci', 'ikinci']);
  });

  it('kalem kategorisini dogru alana yazar', () => {
    const { o, kayitId } = hazirla();
    o.kalemEkle(kayitId, 'S', 'guclu yan');
    expect(durum.swot[0].items[0].type).toBe('S');
  });

  it('kalem metni guncellenir', () => {
    const { o, kayitId } = hazirla();
    o.kalemEkle(kayitId, 'S', 'eski');
    o.kalemGuncelle(kayitId, durum.swot[0].items[0].id, 'yeni');
    expect(durum.swot[0].items[0].text).toBe('yeni');
  });

  it('kalem silinir', () => {
    const { o, kayitId } = hazirla();
    o.kalemEkle(kayitId, 'S', 'bir');
    o.kalemEkle(kayitId, 'S', 'iki');
    o.kalemSil(kayitId, durum.swot[0].items[0].id);
    expect(durum.swot[0].items.map((i: any) => i.text)).toEqual(['iki']);
  });

  it('bir kaydin kalemi otekini etkilemez', () => {
    const o = swot();
    o.ekle('bir'); o.ekle('iki');
    o.kalemEkle(durum.swot[0].id, 'S', 'sadece burada');
    expect(durum.swot[0].items).toHaveLength(1);
    expect(durum.swot[1].items).toHaveLength(0);
  });
});

describe('araca ozgu alanlar', () => {
  // Selale sirayla yuruyor; kayit hangi asamada oldugunu kendi tasiyor.
  it('yeni kayda ek alan eklenebilir', () => {
    durum = { waterfall: [] };
    const o = kategoriliListeIslemleri(
      { anahtar: 'waterfall', adAlani: 'name', kategoriAlani: 'phase',
        yeniKaydinEkleri: () => ({ currentPhaseIndex: 0 }) }, set, get
    );
    o.ekle('proje');
    expect(durum.waterfall[0].currentPhaseIndex).toBe(0);
    expect(durum.waterfall[0].name).toBe('proje');
  });

  // PUKO kalemleri yapildi/yapilmadi tasiyor.
  it('yeni kaleme ek alan eklenebilir', () => {
    durum = { pdca: [] };
    const o = kategoriliListeIslemleri(
      { anahtar: 'pdca', adAlani: 'goal', kategoriAlani: 'phase',
        yeniKaleminEkleri: () => ({ status: 'pending' }) }, set, get
    );
    o.ekle('hedef');
    o.kalemEkle(durum.pdca[0].id, 'Plan', 'is');
    expect(durum.pdca[0].items[0].status).toBe('pending');
    expect(durum.pdca[0].items[0].phase).toBe('Plan');
  });

  // Kilcikta problem cumlesi, PUKO'de hedef, SWOT'ta baslik. Hepsini "name"
  // yapmak eski kayitlari bozardi; alan adi ayarla geliyor.
  it('ad alani araca gore degisir', () => {
    durum = { ishikawa: [] };
    const o = kategoriliListeIslemleri(
      { anahtar: 'ishikawa', adAlani: 'problemStatement', kategoriAlani: 'category' }, set, get
    );
    o.ekle('makine duruyor');
    expect(durum.ishikawa[0].problemStatement).toBe('makine duruyor');
    expect('name' in durum.ishikawa[0]).toBe(false);
  });
});

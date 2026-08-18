import { describe, it, expect } from 'vitest';
import { projeyeCalismalariUygula } from '../calismaOkuma';
import type { Project, WorkRecord } from '../useRoadmapStore';

// Çalışma kayıtlarının projeye uygulanması. Uygulamanın en pahalı hatasının
// çıkabileceği yer burası: yanlış birleştirme, kullanıcının ekranında
// "işim kayboldu" demek.

const proje = (toolData: Record<string, any> = {}): Project => ({
  id: 'p1',
  name: 'Klasor',
  toolData,
  updatedAt: 1,
  userId: 'sahip'
});

const kayit = (p: { workId: string; tool: any; data: any; projectId?: string }): WorkRecord =>
  ({
    id: `p1__${p.workId}`,
    projectId: p.projectId ?? 'p1',
    projectName: 'Klasor',
    name: 'calisma',
    ownerId: 'sahip',
    updatedAt: 1,
    workId: p.workId,
    tool: p.tool,
    data: p.data
  }) as WorkRecord;

const idler = (liste: any[]) => liste.map((c: any) => c.id);

describe('projeyeCalismalariUygula', () => {
  it('hic kayit yoksa projeyi oldugu gibi birakir', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'Agac', nodes: [], edges: [] }] });
    expect(projeyeCalismalariUygula(p, [])).toBe(p);
  });

  it('kaydin icerigi eski kopyanin yerine gecer', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'ESKI', nodes: [], edges: [] }] });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'YENI', nodes: [{ id: 'k' }], edges: [] } })
    ]);
    expect(sonuc.toolData.wbsTrees).toHaveLength(1);
    expect(sonuc.toolData.wbsTrees[0].name).toBe('YENI');
    expect(sonuc.toolData.wbsTrees[0].nodes).toHaveLength(1);
  });

  it('sirayi klasor belirler, kayitlar yalnizca icerigi verir', () => {
    const p = proje({
      wbsTrees: [
        { id: 'a1', name: 'birinci', nodes: [], edges: [] },
        { id: 'a2', name: 'ikinci', nodes: [], edges: [] }
      ]
    });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a2', tool: 'wbs', data: { id: 'a2', name: 'ikinci-guncel' } }),
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'birinci-guncel' } })
    ]);
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a1', 'a2']);
  });

  // Silmenin temeli bu: ortak calisan bir calismayi silince KAYDI silemiyor
  // (kurallar yalnizca sahibe izin veriyor). Klasor okunabiliyorsa listeye
  // klasor karar veriyor; yoksa silinen calisma ekrana geri gelirdi.
  it('klasor okunabilirken, klasorde olmayan kayit listeye eklenmez', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'duran', nodes: [], edges: [] }] });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'duran' } }),
      kayit({ workId: 'silinen', tool: 'wbs', data: { id: 'silinen', name: 'silinmis olmali' } })
    ]);
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a1']);
  });

  // Tek bir calisma paylasildiginda karsi taraf klasorun kaydini goremiyor;
  // agac tamamen kayitlardan doguyor.
  it('klasor kapaliyken liste yalnizca kayitlardan dogar, kurulus sirasiyla', () => {
    const sonuc = projeyeCalismalariUygula(
      proje(),
      [
        kayit({ workId: 'b', tool: 'wbs', data: { id: 'b', name: 'sonra', createdAt: 200 } }),
        kayit({ workId: 'a', tool: 'wbs', data: { id: 'a', name: 'once', createdAt: 100 } })
      ],
      false
    );
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a', 'b']);
  });

  // Uygulama bazi araclar icin kendiliginden bos bir baslangic calismasi
  // kuruyor ve bunlar ayri kayit almiyor; o arac klasorden gelmeli.
  it('kaydi olmayan araca dokunulmaz', () => {
    const p = proje({
      wbsTrees: [{ id: 'a1', name: 'Agac', nodes: [], edges: [] }],
      mindmaps: [{ id: 'm1', name: 'Dokunulmamis harita', nodes: [], edges: [] }]
    });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'Agac guncel' } })
    ]);
    expect(sonuc.toolData.mindmaps).toEqual(p.toolData.mindmaps);
  });

  it('baska projenin kayitlari bu projeye karismaz', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'bizim', nodes: [], edges: [] }] });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'BASKA PROJE' }, projectId: 'p2' })
    ]);
    expect(sonuc.toolData.wbsTrees[0].name).toBe('bizim');
  });

  it('data alani olmayan bozuk kayit yok sayilir', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'saglam', nodes: [], edges: [] }] });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: undefined })
    ]);
    expect(sonuc.toolData.wbsTrees[0].name).toBe('saglam');
  });

  it('projenin kendisini degistirmez, yeni nesne dondurur', () => {
    const eski = { id: 'a1', name: 'ESKI', nodes: [], edges: [] };
    const p = proje({ wbsTrees: [eski] });
    projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'YENI' } })
    ]);
    expect(p.toolData.wbsTrees[0]).toBe(eski);
  });
});

// ---------------------------------------------------------------------------
// Sıra listesi (calismaSirasi). İçerik artık klasörde durmuyor; klasör yalnızca
// "hangi çalışmalar var, hangi sırayla" diyor.
// ---------------------------------------------------------------------------

import { calismaSirasiKur } from '../calismaOkuma';

describe('calismaSirasi ile okuma', () => {
  it('sira listesi sirayi belirler', () => {
    const p: Project = { ...proje(), calismaSirasi: { wbs: ['a2', 'a1'] } };
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'bir' } }),
      kayit({ workId: 'a2', tool: 'wbs', data: { id: 'a2', name: 'iki' } })
    ]);
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a2', 'a1']);
  });

  // Ortak calisan bir calismayi silince KAYDI silemiyor. Silme ancak sira
  // listesinden dusmekle olur; kayit hala sunucuda dursa bile gorunmemeli.
  it('sirada olmayan kayit gosterilmez', () => {
    const p: Project = { ...proje(), calismaSirasi: { wbs: ['a1'] } };
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'duran' } }),
      kayit({ workId: 'silinen', tool: 'wbs', data: { id: 'silinen', name: 'gitmeli' } })
    ]);
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a1']);
  });

  // Bos dizi "kullanici hepsini sildi" demek. Baslangic calismasi geri gelmemeli.
  it('bos sira listesi bos liste uretir', () => {
    const p: Project = { ...proje(), calismaSirasi: { wbs: [], mindmap: ['m1'] } };
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'm1', tool: 'mindmap', data: { id: 'm1', name: 'harita' } })
    ]);
    expect(sonuc.toolData.wbsTrees).toEqual([]);
  });

  // Anahtarin hic olmamasi "bu arac hic acilmadi" demek; baslangic calismasi
  // kurulabilsin diye alan TANIMSIZ kalmali. Bos dizi yazsaydik, [] JS'te
  // dogru sayildigi icin loadProject'teki yedek hic devreye girmezdi.
  it('sirada hic gecmeyen arac tanimsiz kalir', () => {
    const p: Project = { ...proje(), calismaSirasi: { mindmap: ['m1'] } };
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'm1', tool: 'mindmap', data: { id: 'm1', name: 'harita' } })
    ]);
    expect(sonuc.toolData.wbsTrees).toBeUndefined();
  });

  it('kaydi olmayan kimlik icin klasordeki eski kopyaya duser', () => {
    const p: Project = {
      ...proje({ wbsTrees: [{ id: 'a1', name: 'eski kopya', nodes: [], edges: [] }] }),
      calismaSirasi: { wbs: ['a1', 'a2'] }
    };
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a2', tool: 'wbs', data: { id: 'a2', name: 'kayitli' } })
    ]);
    expect(idler(sonuc.toolData.wbsTrees)).toEqual(['a1', 'a2']);
    expect(sonuc.toolData.wbsTrees[0].name).toBe('eski kopya');
  });

  // Sira listesine hic gecmemis eski projeler: sira klasordeki icerikten gelir.
  it('sira listesi yokken eski davranis surer', () => {
    const p = proje({ wbsTrees: [{ id: 'a1', name: 'x', nodes: [], edges: [] }] });
    const sonuc = projeyeCalismalariUygula(p, [
      kayit({ workId: 'a1', tool: 'wbs', data: { id: 'a1', name: 'guncel' } })
    ]);
    expect(sonuc.toolData.wbsTrees[0].name).toBe('guncel');
  });
});

describe('calismaSirasiKur', () => {
  const doluAgac = (id: string) => ({
    id,
    name: 'Agac',
    nodes: [{ id: 'k1' }, { id: 'k2' }],
    edges: [{ id: 'e1', source: 'k1', target: 'k2' }]
  });

  it('hic acilmamis aracin anahtarini hic yazmaz', () => {
    const sira = calismaSirasiKur(proje({ wbsTrees: [doluAgac('a1')] }));
    expect(sira.wbs).toEqual(['a1']);
    expect('mindmap' in sira).toBe(false);
  });

  it('bosaltilmis araci bos diziyle yazar', () => {
    const sira = calismaSirasiKur(proje({ wbsTrees: [] }));
    expect(sira.wbs).toEqual([]);
  });

  // Proje acilir acilmaz kurulan, kullanicinin hic dokunmadigi baslangic
  // calismasi kayit almiyor; listede de yeri yok.
  // Anahtar HIC yazilmamali. Bos dizi yazsaydik arac "bosaltilmis" sayilirdi
  // ve bir daha baslangic calismasiyla acilmazdi.
  it('tek basina duran dokunulmamis baslangic calismasi anahtar bile yazdirmaz', () => {
    const sira = calismaSirasiKur(proje({ wbsTrees: [{ id: 'a1', name: 'Agac', nodes: [], edges: [] }] }));
    expect('wbs' in sira).toBe(false);
  });

  // Ama kullanici gercekten hepsini sildiyse bos dizi yazilmali; yoksa
  // sildigi calismalarin yerine baslangic calismasi gelirdi.
  it('kullanici hepsini sildiyse bos dizi yazilir', () => {
    const sira = calismaSirasiKur(proje({ wbsTrees: [] }));
    expect(sira.wbs).toEqual([]);
  });

  // Ama kullanici ikinci bir calisma actiysa, ona hic dokunmamis olsa bile
  // o artik onun karari. Elenirse sayfa yenilenince sessizce kaybolurdu.
  it('ikinci calisma dokunulmamis olsa bile listeye girer', () => {
    const sira = calismaSirasiKur(proje({
      wbsTrees: [doluAgac('a1'), { id: 'a2', name: 'Bos ama benim', nodes: [], edges: [] }]
    }));
    expect(sira.wbs).toEqual(['a1', 'a2']);
  });

  it('sirayi kullanicinin gordugu diziliste yazar', () => {
    const sira = calismaSirasiKur(proje({ wbsTrees: [doluAgac('a3'), doluAgac('a1'), doluAgac('a2')] }));
    expect(sira.wbs).toEqual(['a3', 'a1', 'a2']);
  });
});

// ---------------------------------------------------------------------------
// Gidiş-dönüş: ekrandaki veri kaydedilip geri okunduğunda aynı mı kalıyor?
// Çift yazma sökülürken en çok bunun bozulma riski vardı.
// ---------------------------------------------------------------------------

describe('kaydet ve geri oku', () => {
  const agac = (id: string, ad: string) => ({
    id,
    name: ad,
    nodes: [{ id: 'k1', data: { label: 'kok' } }, { id: 'k2', data: { label: 'dal' } }],
    edges: [{ id: 'e1', source: 'k1', target: 'k2' }]
  });

  /** Klasöre yazılan (içeriksiz) hali + çalışma kayıtları -> geri okunmuş hali. */
  const gidipGel = (ekrandaki: Project, klasorOkunabilir = true) => {
    const sira = calismaSirasiKur(ekrandaki);
    // Sunucudaki klasör dokümanı: içerik YOK, yalnızca sıra listesi.
    const sunucudaki: Project = { ...ekrandaki, toolData: {}, calismaSirasi: sira };
    const kayitlar = Object.entries(sira).flatMap(([tool, idler]) =>
      idler.map((id) => {
        const c = (ekrandaki.toolData[
          tool === 'wbs' ? 'wbsTrees' : tool === 'mindmap' ? 'mindmaps' : tool
        ] as any[]).find((x) => x.id === id);
        return kayit({ workId: id, tool, data: c });
      })
    );
    return projeyeCalismalariUygula(sunucudaki, kayitlar, klasorOkunabilir);
  };

  it('icerik ve sira aynen geri gelir', () => {
    const ekrandaki = proje({ wbsTrees: [agac('a1', 'Birinci'), agac('a2', 'Ikinci')] });
    const geri = gidipGel(ekrandaki);
    expect(geri.toolData.wbsTrees).toEqual(ekrandaki.toolData.wbsTrees);
  });

  it('birden fazla arac birbirine karismaz', () => {
    const ekrandaki = proje({
      wbsTrees: [agac('a1', 'Agac')],
      mindmaps: [agac('m1', 'Harita'), agac('m2', 'Harita 2')]
    });
    const geri = gidipGel(ekrandaki);
    expect(idler(geri.toolData.wbsTrees)).toEqual(['a1']);
    expect(idler(geri.toolData.mindmaps)).toEqual(['m1', 'm2']);
  });

  // Bu bozulursa kullanici araci acar ve bombos bulur: baslangic calismasi
  // kurulmaz, cunku bos dizi JS'te "dogru" sayilip yedegi devre disi birakir.
  it('hic acilmamis arac, geri okununca da tanimsiz kalir', () => {
    const geri = gidipGel(proje({ wbsTrees: [agac('a1', 'Agac')] }));
    expect(geri.toolData.mindmaps).toBeUndefined();
  });

  // Dokunulmamis baslangic calismasi kayit almiyor; araci acinca yeniden
  // kuruluyor. Yani klasorde de, kayitlarda da yeri olmamali.
  // En sinsi hata burada olurdu: arac TANIMSIZ degil de BOS dizi olarak geri
  // gelseydi, loadProject'teki `toolData[k] || baslangic` yedegi devreye
  // girmezdi (bos dizi JS'te dogru sayilir) ve kullanici araci bombos bulurdu.
  it('dokunulmamis baslangic calismasi olan arac TANIMSIZ geri gelir', () => {
    const ekrandaki = proje({ wbsTrees: [{ id: 'a1', name: 'Agac', nodes: [], edges: [] }] });
    const sira = calismaSirasiKur(ekrandaki);
    const geri = projeyeCalismalariUygula(
      { ...ekrandaki, toolData: {}, calismaSirasi: sira },
      [kayit({ workId: 'baska', tool: 'mindmap', data: { id: 'baska' } })]
    );
    expect(geri.toolData.wbsTrees).toBeUndefined();
  });
});

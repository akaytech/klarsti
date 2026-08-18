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

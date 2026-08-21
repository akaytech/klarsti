import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../firebase', () => ({ logAppEvent: () => {}, db: {}, analytics: null }));

const { useRoadmapStore } = await import('../../store/useRoadmapStore');

// Bekçi testi: çalışma listesi boşken kanvasın çıkışı olmalı.
//
// Son çalışmasını silen kullanıcı çıkışı olmayan bir ekranda kalıyordu.
// Kutu ekleyen bütün yollar "açık çalışmayı güncelle" üzerinden geçiyor; açık
// çalışma yoksa güncellenecek bir şey de bulunamıyor ve düğme SESSİZCE hiçbir
// şey yapmıyordu. Çalışma menüsü de açık çalışma istediği için gizleniyordu,
// yani yeni bir tane açacak yer kalmıyordu. Sayfayı yenilemek de kurtarmıyordu:
// kayıtlı boş liste "kayıt yok" sayılmadığı için başlangıç çalışması da
// kurulmuyordu. Araç o projede kalıcı olarak ölüyordu.
//
// Zihin haritası, yol haritası ve değer akışı bu durumu zaten karşılıyor
// (kanvas "yeni harita kur" kartı çıkarıyor). Buradakiler ise çıkarmıyordu.

const durum = () => useRoadmapStore.getState();

beforeEach(() => {
  useRoadmapStore.setState({
    fiveWhysAnalyses: [], activeFiveWhysId: null,
    ftaAnalyses: [], activeFtaId: null,
    wbsTrees: [], activeWbsTreeId: null,
  } as any);
});

describe('5 Neden: hic analiz yokken', () => {
  it('ana sorun ekleyince analiz de kuruluyor', () => {
    durum().addFiveWhysNode(null, 'problem', 'Problem nedir?');

    const analizler = durum().fiveWhysAnalyses;
    expect(analizler).toHaveLength(1);
    expect(analizler[0].nodes).toHaveLength(1);
    expect(analizler[0].nodes[0].data.type).toBe('problem');
    expect(durum().activeFiveWhysId).toBe(analizler[0].id);
  });

  it('ornek sablon yuklenince analiz de kuruluyor', () => {
    durum().loadFiveWhysExample();

    const analizler = durum().fiveWhysAnalyses;
    expect(analizler).toHaveLength(1);
    expect(analizler[0].nodes.length).toBeGreaterThan(1);
    expect(analizler[0].edges.length).toBeGreaterThan(0);
  });
});

describe('Hata agaci: hic analiz yokken', () => {
  it('tepe olay eklenince analiz de kuruluyor', () => {
    durum().addFtaRoot();

    const analizler = durum().ftaAnalyses;
    expect(analizler).toHaveLength(1);
    expect(analizler[0].nodes).toHaveLength(1);
    expect(analizler[0].nodes[0].data.type).toBe('topEvent');
  });

  it('ornek sablon yuklenince analiz de kuruluyor', () => {
    durum().loadFtaExample();

    const analizler = durum().ftaAnalyses;
    expect(analizler).toHaveLength(1);
    expect(analizler[0].nodes.length).toBeGreaterThan(1);
  });
});

describe('Kirilim agaci: hic agac yokken', () => {
  // Menü son ağacın silinmesini engelliyor ama çalışmalar panelinde böyle bir
  // kısıt yok; oradan silinince aynı çıkmaza giriliyordu.
  it('kok kutu eklenince agac da kuruluyor', () => {
    durum().addGoal(null, 'Yeni Çalışma');

    const agaclar = durum().wbsTrees;
    expect(agaclar).toHaveLength(1);
    expect(agaclar[0].nodes).toHaveLength(1);
    expect(durum().activeWbsTreeId).toBe(agaclar[0].id);
  });

  it('ornek sablon yuklenince agac da kuruluyor', () => {
    durum().loadWbsExample();

    const agaclar = durum().wbsTrees;
    expect(agaclar).toHaveLength(1);
    expect(agaclar[0].nodes.length).toBeGreaterThan(1);
  });
});

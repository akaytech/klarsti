import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calismayiYenidenAdlandir, calismayiSil } from '../toolWorks';
import type { ToolId } from '../../store/useRoadmapStore';

vi.mock('../../firebase', () => ({ logAppEvent: () => {}, db: {}, analytics: null }));

const { useRoadmapStore } = await import('../../store/useRoadmapStore');

// Çalışma menüsündeki "adını değiştir" ve "sil" düğmeleri store eylemlerini
// ADIYLA arıyor (bkz. toolWorks.ts). Eskiden ad tutmazsa hiçbir şey olmuyordu:
// ne derleme uyarıyordu, ne konsol; düğme sessizce çalışmayı bırakıyordu.
//
// Artık üç katman var ve üçü de burada sınanıyor:
//   1. Ad derleme zamanında denetleniyor (keyof RoadmapState) — bunu test
//      değil derleyici yakalıyor, bozunca `npx tsc` patlıyor.
//   2. Ad yine de bulunamazsa konsola hata basılıyor, sessiz kalınmıyor.
//   3. Testte sahte bir store DEĞİL gerçeği kullanılıyor: aranan ad gerçekten
//      yoksa hiçbir çağrı kaydedilmiyor ve test kırmızı yanıyor.
//
// Dördüncü denetim imza: Pareto ile histogramın eylemleri eskiden ilk argüman
// olarak proje kimliğini bekliyordu ama hiç kullanmıyordu; o parametre
// kaldırıldı, on dört aracın imzası aynılaştı.

const ARACLAR: ToolId[] = [
  'wbs', '5whys', 'fta', 'mindmap', 'flowchart', 'orgchart', 'gantt', 'vsm',
  'roadmap', 'swot', 'ishikawa', 'pdca', 'waterfall', 'pareto', 'histogram', 'decision',
];

let cagrilar: { ad: string; args: any[] }[];

/** Gerçek store; eylemleri çalıştırmak yerine çağrıyı kaydeden bir kabukla. */
const izlenenStore = new Proxy(useRoadmapStore.getState() as Record<string, any>, {
  get: (hedef, ad: string) => {
    const gercek = hedef[ad];
    if (typeof gercek !== 'function') return gercek;
    return (...args: any[]) => cagrilar.push({ ad, args });
  },
});

beforeEach(() => { cagrilar = []; });

describe('adini degistir', () => {
  it('her arac icin store da gercekten var olan bir eylem cagriliyor', () => {
    for (const arac of ARACLAR) {
      cagrilar = [];
      calismayiYenidenAdlandir(izlenenStore, arac, 'c1', 'yeni ad');
      expect(cagrilar, `${arac}: eylem adi store da yok`).toHaveLength(1);
    }
  });

  it('eylem yalnizca calisma kimligi ve yeni adla cagriliyor', () => {
    for (const arac of ARACLAR) {
      cagrilar = [];
      calismayiYenidenAdlandir(izlenenStore, arac, 'c1', 'yeni ad');
      expect(cagrilar[0]?.args, `${arac} imzasi`).toEqual(['c1', 'yeni ad']);
    }
  });

  it('ajanda projeye ait degil, hicbir eylem cagirmiyor', () => {
    calismayiYenidenAdlandir(izlenenStore, 'notepad', 'c1', 'yeni ad');
    expect(cagrilar).toHaveLength(0);
  });

  it('eylem bulunamazsa patlamiyor ama SESSIZ de kalmiyor', () => {
    const konsol = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => calismayiYenidenAdlandir({}, 'swot', 'c1', 'yeni ad')).not.toThrow();
    expect(konsol).toHaveBeenCalledTimes(1);
    expect(String(konsol.mock.calls[0][0])).toContain('updateSwotTitle');
    konsol.mockRestore();
  });
});

describe('sil', () => {
  it('her arac icin store da gercekten var olan bir eylem cagriliyor', () => {
    for (const arac of ARACLAR) {
      cagrilar = [];
      calismayiSil(izlenenStore, arac, 'c1');
      expect(cagrilar, `${arac}: eylem adi store da yok`).toHaveLength(1);
    }
  });

  it('eylem yalnizca calisma kimligiyle cagriliyor', () => {
    for (const arac of ARACLAR) {
      cagrilar = [];
      calismayiSil(izlenenStore, arac, 'c1');
      expect(cagrilar[0]?.args, `${arac} imzasi`).toEqual(['c1']);
    }
  });

  it('ajanda icin hicbir eylem cagrilmiyor', () => {
    calismayiSil(izlenenStore, 'notepad', 'c1');
    expect(cagrilar).toHaveLength(0);
  });

  it('eylem bulunamazsa patlamiyor ama SESSIZ de kalmiyor', () => {
    const konsol = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => calismayiSil({}, 'swot', 'c1')).not.toThrow();
    expect(konsol).toHaveBeenCalledTimes(1);
    expect(String(konsol.mock.calls[0][0])).toContain('deleteSwot');
    konsol.mockRestore();
  });

  it('ajanda icin konsola hata da basilmiyor: eylemi olmamasi normal', () => {
    const konsol = vi.spyOn(console, 'error').mockImplementation(() => {});
    calismayiSil(izlenenStore, 'notepad', 'c1');
    expect(konsol).not.toHaveBeenCalled();
    konsol.mockRestore();
  });
});

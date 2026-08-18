import { describe, it, expect, vi, beforeEach } from 'vitest';

// Firestore'a gerçekten yazılmıyor: bu testin sorusu "ne yazılacağına doğru
// karar veriliyor mu", "yazma çalışıyor mu" değil. Kuralları ve gerçek yazmayı
// emülatör testi sınıyor (scripts/kuralDenemesi.mjs).
const yazilanlar: { yol: string; govde: any }[] = [];
const silinenler: string[] = [];

vi.mock('../../firebase', () => ({ db: {}, logAppEvent: () => {} }));
vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, kol: string, id: string) => ({ yol: `${kol}/${id}` }),
  setDoc: (ref: any, govde: any) => {
    yazilanlar.push({ yol: ref.yol, govde });
    return Promise.resolve();
  },
  deleteDoc: (ref: any) => {
    silinenler.push(ref.yol);
    return Promise.resolve();
  },
  arrayUnion: (...v: unknown[]) => ({ __arrayUnion: v }),
  arrayRemove: (...v: unknown[]) => ({ __arrayRemove: v })
}));

const { projeCalismalariniEsitle, calismaDokumanId } = await import('../calismaYazma');
import type { Project } from '../useRoadmapStore';

const proje = (toolData: Record<string, any>, ek: Partial<Project> = {}): Project => ({
  id: 'p1',
  name: 'Klasor',
  toolData,
  updatedAt: 1,
  userId: 'sahip',
  ...ek
});

/** Kullanıcının gerçekten üzerinde çalıştığı bir ağaç (dokunulmamış sayılmaz). */
const doluAgac = (id: string, ad = 'Agac') => ({
  id,
  name: ad,
  nodes: [{ id: 'k1', data: { label: 'kok' } }, { id: 'k2', data: { label: 'dal' } }],
  edges: [{ id: 'e1', source: 'k1', target: 'k2' }]
});

beforeEach(() => {
  yazilanlar.length = 0;
  silinenler.length = 0;
});

describe('projeCalismalariniEsitle', () => {
  it('kaydi olmayan calisma icin yeni kayit kurar', () => {
    projeCalismalariniEsitle(proje({ wbsTrees: [doluAgac('a1')] }), []);
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0].yol).toBe(`works/${calismaDokumanId('p1', 'a1')}`);
    expect(yazilanlar[0].govde.ownerId).toBe('sahip');
    expect(yazilanlar[0].govde.tool).toBe('wbs');
    expect(yazilanlar[0].govde.data.id).toBe('a1');
  });

  // Uygulama bazı araçlar için kendiliğinden boş bir başlangıç çalışması
  // kuruyor. Kullanıcı dokunmadıysa bunlar kayıt hak etmiyor; yoksa her proje
  // kimsenin açmadığı kayıtlar üretirdi.
  it('dokunulmamis baslangic calismasi kayit almaz', () => {
    const bosAgac = { id: 'a1', name: 'Agac', nodes: [], edges: [] };
    projeCalismalariniEsitle(proje({ wbsTrees: [bosAgac] }), []);
    expect(yazilanlar).toHaveLength(0);
  });

  // Silinen calismanin kaydi kalirsa, okuma yeni kayitlara cevrildiginde
  // silinen calisma geri gelmis gibi gorunur.
  it('karsiligi kalmayan kaydi siler', () => {
    projeCalismalariniEsitle(proje({ wbsTrees: [doluAgac('a1')] }), [
      { id: calismaDokumanId('p1', 'a1'), tool: 'wbs' },
      { id: calismaDokumanId('p1', 'silinen'), tool: 'wbs' }
    ]);
    expect(silinenler).toEqual([`works/${calismaDokumanId('p1', 'silinen')}`]);
  });

  // Kurallar ortak calisanin silmesini reddediyor; denemek bos yere hata uretir.
  it('ortak calisan silme denemez', () => {
    projeCalismalariniEsitle(
      proje({ wbsTrees: [doluAgac('a1')] }),
      [{ id: calismaDokumanId('p1', 'fazlalik'), tool: 'wbs' }],
      undefined,
      false,
      false
    );
    expect(silinenler).toHaveLength(0);
  });

  it('sadeceAraclar verilirse oteki araclara dokunulmaz', () => {
    projeCalismalariniEsitle(
      proje({ wbsTrees: [doluAgac('a1')], mindmaps: [doluAgac('m1', 'Harita')] }),
      [],
      new Set(['wbs'] as any)
    );
    expect(yazilanlar).toHaveLength(1);
    expect(yazilanlar[0].govde.tool).toBe('wbs');
  });

  // Klasore biri katildiginda calismalarin erisim listesi de takip etmeli;
  // kayit kurulurken kopyalanan liste tek basina eskir.
  it('klasorun paylasim listesi degisince erisim listesi tazelenir', () => {
    projeCalismalariniEsitle(
      proje({ wbsTrees: [doluAgac('a1')] }, { sharedWith: ['yeni-kisi'] }),
      [{ id: calismaDokumanId('p1', 'a1'), tool: 'wbs', readers: [] }]
    );
    expect(yazilanlar[0].govde.readers).toEqual(['yeni-kisi']);
  });

  // Kurallar ortak calisanin erisim listesine dokunmasini reddediyor;
  // gonderirse YAZMANIN TAMAMI reddedilir, yani icerik de kaybolur.
  it('ortak calisan erisim listesini hic gondermez', () => {
    projeCalismalariniEsitle(
      proje({ wbsTrees: [doluAgac('a1')] }, { sharedWith: ['biri'] }),
      [{ id: calismaDokumanId('p1', 'a1'), tool: 'wbs', readers: [] }],
      undefined,
      false,
      false
    );
    expect(yazilanlar[0].govde.readers).toBeUndefined();
  });

  it('ilk doldurmada icerik tekrar yazilmaz', () => {
    projeCalismalariniEsitle(
      proje({ wbsTrees: [doluAgac('a1')] }),
      [{ id: calismaDokumanId('p1', 'a1'), tool: 'wbs', readers: [] }],
      undefined,
      true
    );
    expect(yazilanlar).toHaveLength(0);
  });
});

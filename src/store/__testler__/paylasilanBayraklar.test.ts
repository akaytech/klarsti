import { describe, it, expect } from 'vitest';

/**
 * Modül seviyesinde tutulan paylaşımlı değişkenlerin sayımı.
 *
 * NEDEN VAR: Depoda bir dosyanın yazıp başka bir dosyanın okuduğu, aradaki
 * bağı koddan görünmeyen değişkenler var. "Sunucudan gelen güncelleme
 * kullanıcının düzenlemesi sanıldı" tipi hatalar tam buradan çıkıyor ve
 * sonucu ancak canlıda görülüyor.
 *
 * Hepsini birden sökmek doğru değil: her biri gerçek bir sorunu çözüyor ve
 * gerekçesi kendi dosyasında yazılı. Yapılması gereken şey SAYILARININ
 * BÜYÜMEMESİ. Bu test onu bekçiliyor: aşağıdaki liste ile kodda bulunanlar
 * birebir tutmazsa kırmızı yanar.
 *
 * YENİ BİRİ EKLEMEK GEREKİRSE: önce bilgiyi parametre olarak geçirmeyi dene.
 * Gerçekten gerekiyorsa listeye ekle — ama listeye eklemek bilinçli bir karar
 * olsun, kimse fark etmeden olmasın.
 *
 * Aşağıdaki harita aynı zamanda maddenin kendisine cevap: bağ koddan
 * görünmüyorsa buradan görünüyor.
 */

/** Dosya → o dosyada modül seviyesinde tutulan değişkenler. */
const BEKLENEN: Record<string, string[]> = {
  // isRemoteUpdate: sunucudan gelen güncelleme mi, kullanıcının düzenlemesi mi?
  //   YAZAN: useRoadmapStore (uzaktanGuncelle) · OKUYAN: SyncManager (3 yer)
  // gecmisHandleSet: zundo'nun handleSet'i. Store kurulurken doluyor,
  //   gecmis.ts oradan çağırıyor (bkz. gecmisiBagla).
  'src/store/useRoadmapStore.ts': ['isRemoteUpdate', 'gecmisHandleSet'],

  // derinlik / tikAcik / ilkDurum: işlem sınırlarının kendi iç durumu,
  //   tek dosyada kalıyor.
  // gecmiseYaz / anlikDurum / yiginiBosalt:
  //   YAZAN: useRoadmapStore (gecmisiBagla) · OKUYAN: gecmis.ts
  //   Depo geçmişi doğrudan içe aktarsa iki modül birbirini çağıran bir
  //   halkaya girerdi.
  'src/store/gecmis.ts': ['derinlik', 'tikAcik', 'ilkDurum', 'gecmiseYaz', 'anlikDurum', 'yiginiBosalt'],

  // YAZAN: SyncManager (bekleyenYazmalariBildir) · OKUYAN: useRoadmapStore.
  // Bileni SyncManager, ihtiyacı olanı store; store bir bileşeni içe aktarsa
  // döngü olurdu.
  'src/store/bekleyenYazmalar.ts': ['aracSaglayici', 'kisiselSaglayici'],

  // Denemeyi hesaba taşıma bir oturumda bir kez çalışmalı; kendi iç bayrağı.
  'src/store/denemeDevri.ts': ['denendi'],

  // Bekleyen yazmaları zorla gönderen çağrı. Bileşenin içinden doluyor,
  // dışarıdan flushPendingSaves ile çağrılıyor (hesap silme, çıkış).
  'src/components/SyncManager.tsx': ['flushHandler'],
};

// Dosyalar Vite'ın kendi yoluyla okunuyor, node'un fs'iyle değil: uygulamanın
// tip yapılandırmasında node tipleri yok (olmamalı da, uygulama tarayıcıda
// çalışıyor) ve `tsc` orada patlıyordu.
const KAYNAKLAR: Record<string, string> = {
  ...(import.meta.glob('../*.ts', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>),
  ...(import.meta.glob('../../components/SyncManager.tsx', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>),
};

/** '../gecmis.ts' → 'src/store/gecmis.ts' */
function yolAdi(anahtar: string): string {
  if (anahtar.startsWith('../../')) return anahtar.replace('../../', 'src/');
  return anahtar.replace('../', 'src/store/');
}

/** Bir dosyadaki modül seviyesi `let` tanımları. */
function modulBayraklari(kaynak: string): string[] {
  const bulunan: string[] = [];
  for (const satir of kaynak.split('\n')) {
    const m = /^(?:export\s+)?let\s+([A-Za-z_$][\w$]*)/.exec(satir);
    if (m) bulunan.push(m[1]);
  }
  return bulunan;
}

describe('paylasilan modul bayraklari', () => {
  it('sayilari buyumemis: kodda bulunanlar listedekilerle birebir ayni', () => {
    const bulunan: Record<string, string[]> = {};
    for (const [anahtar, kaynak] of Object.entries(KAYNAKLAR)) {
      const bayraklar = modulBayraklari(kaynak);
      if (bayraklar.length) bulunan[yolAdi(anahtar)] = bayraklar;
    }

    expect(
      bulunan,
      'Modül seviyesinde yeni bir paylaşımlı değişken var (ya da biri kalktı). ' +
      'Önce bilgiyi parametre olarak geçirmeyi dene; gerçekten gerekiyorsa ' +
      'bu testteki BEKLENEN listesini kim yazıyor / kim okuyor notuyla güncelle.',
    ).toEqual(BEKLENEN);
  });

  it('taramanin gercekten dosya okudugu dogrulaniyor', () => {
    // Liste boş bir taramayla da "geçebilirdi"; okunan dosya sayısı kontrol
    // ediliyor ki test kendi kendini kandırmasın.
    expect(Object.keys(KAYNAKLAR).length).toBeGreaterThan(10);
  });

  it('toplam sayi on ikiyi gecmiyor', () => {
    const toplam = Object.values(BEKLENEN).reduce((t, l) => t + l.length, 0);
    expect(toplam).toBe(12);
  });
});

import { describe, it, expect } from 'vitest';

// Kaynak dosyalar metin olarak okunuyor (Vite'ın ?raw eki). Node'un fs'i
// bilerek kullanılmıyor: uygulama derlemesi node tiplerini tanımıyor.
import wbsKaynak from '../WbsCanvas.tsx?raw';
import fiveWhysKaynak from '../FiveWhysCanvas.tsx?raw';
import ftaKaynak from '../FtaCanvas.tsx?raw';
import mindmapKaynak from '../MindmapCanvas.tsx?raw';
import roadmapKaynak from '../RoadmapCanvas.tsx?raw';

// Bekçi testi.
//
// Ağacını çizgilerden okuyan araçlarda silmeyi React Flow'a BIRAKAMAYIZ.
// React Flow kutuyu silmeden ÖNCE ona bağlı çizgileri kaldırıyor:
//
//     if (hasMatchingEdges) { ...triggerEdgeChanges(...) }   // önce
//     if (hasMatchingNodes) { ...triggerNodeChanges(...) }   // sonra
//
// Depo "bu kutunun çocukları kim?" diye sorduğunda kutu→çocuk çizgisi çoktan
// silinmiş oluyor; çocuklar bulunamıyor, yalnızca kutunun kendisi siliniyor ve
// çocuklar ekranda bağlantısız kalıyor.
//
// Test kaynağa bakıyor, çünkü hata tam da yapılandırmada: birinin
// deleteKeyCode'u geri açması yeter. Bir daha sessizce dönmesin.

const AGAC_ARACLARI = [
  ['Kırılım ağacı', wbsKaynak, true],
  ['5 Neden', fiveWhysKaynak, true],
  ['Hata ağacı', ftaKaynak, true],
  ['Zihin haritası', mindmapKaynak, false],
  ['Yol haritası', roadmapKaynak, false]
] as const;

describe('agac araclarinda silme yolu', () => {
  AGAC_ARACLARI.forEach(([ad, kaynak]) => {
    it(`${ad}: React Flow'un kendi silmesi kapali`, () => {
      expect(kaynak).toContain('deleteKeyCode={null}');
      expect(kaynak).not.toContain("deleteKeyCode={['Delete']}");
    });
  });

  // Silmeyi kendimiz yapiyorsak Delete tusunu de kendimiz dinlemeliyiz;
  // yoksa tus hicbir sey yapmaz. (Zihin ve yol haritasinin kendi dinleyicisi
  // zaten vardi, onlar bu ortak kancayi kullanmiyor.)
  AGAC_ARACLARI.filter(([, , kancaKullanir]) => kancaKullanir).forEach(([ad, kaynak]) => {
    it(`${ad}: Delete tusu depo uzerinden siliyor`, () => {
      expect(kaynak).toContain('useSilTusu');
    });
  });
});

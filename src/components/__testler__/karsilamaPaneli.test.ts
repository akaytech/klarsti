import { describe, it, expect } from 'vitest';

// Kaynak dosyalar metin olarak okunuyor (Vite'ın ?raw eki). Node'un fs'i
// bilerek kullanılmıyor: uygulama derlemesi node tiplerini tanımıyor.
import wbsKaynak from '../WbsCanvas.tsx?raw';
import fiveWhysKaynak from '../FiveWhysCanvas.tsx?raw';
import ftaKaynak from '../FtaCanvas.tsx?raw';
import mindmapKaynak from '../MindmapCanvas.tsx?raw';
import roadmapKaynak from '../RoadmapCanvas.tsx?raw';
import vsmKaynak from '../VsmCanvas.tsx?raw';
import diagramKaynak from '../diagram/DiagramCanvas.tsx?raw';

// Bekçi testi.
//
// Boş tuvaldeki karşılama şeridi üstteki düğmelerin ve sol üstteki çalışma
// menüsünün üstüne biniyordu. Sebep şeridin konumu değil, boşluğun VERİLME
// BİÇİMİYDİ: React Flow kendi stil dosyasında panele margin veriyor ve o kural
// Tailwind'in `mt-*` sınıfını eziyor. Yani
//
//     <Panel position="top-center" className="mt-20">
//
// yazan boşluk hiç uygulanmıyordu; şerit tepeye yapışıyordu. Beş tuvalde
// böyleydi, ikisinde satır içi stille doğru yazılmıştı ve hangisinin doğru
// olduğu koda bakmadan anlaşılmıyordu.
//
// Artık hepsi KarsilamaPaneli'nden geçiyor; boşluk orada tek bir yerde.
// Test kaynağa bakıyor, çünkü hata gözle görünmüyor: sınıf yazılıyor, kimse
// uyarmıyor, sadece uygulanmıyor.

const TUVALLER = [
  ['Kırılım ağacı', wbsKaynak],
  ['5 Neden', fiveWhysKaynak],
  ['Hata ağacı', ftaKaynak],
  ['Zihin haritası', mindmapKaynak],
  ['Yol haritası', roadmapKaynak],
  ['Değer akışı', vsmKaynak],
  ['Şemalar', diagramKaynak]
] as const;

describe('karsilama seridi', () => {
  TUVALLER.forEach(([ad, kaynak]) => {
    it(`${ad}: ortak panelden geciyor`, () => {
      expect(kaynak).toContain('<KarsilamaPaneli');
      expect(kaynak).not.toContain('position="top-center"');
    });
  });

  // Tailwind'in mt-* sınıfı React Flow panellerinde çalışmıyor. Önem işareti
  // (`!mt-[...]`) o kuralı geçtiği için serbest; işaretsiz olan sessizce
  // hiçbir şey yapar.
  TUVALLER.forEach(([ad, kaynak]) => {
    it(`${ad}: React Flow panelinde islemeyen mt-* sinifi yok`, () => {
      const panelSatirlari = kaynak
        .split('\n')
        .filter((satir) => satir.includes('<Panel'));
      const suclular = panelSatirlari.filter((satir) => /className="(?:[^"]* )?mt-/.test(satir));
      expect(suclular).toEqual([]);
    });
  });
});

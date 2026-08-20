import { describe, it, expect } from 'vitest';
import { FLOWCHART_EXAMPLES } from '../flowchartExamples';
import { FLOWCHART_TYPES, getFlowchartType } from '../flowchartTypes';
import tr from '../../locales/tr.json';

// Örnek şablonlar elle yazılıyor: bir kutu anahtarının yazımı kayarsa ya da
// türde olmayan bir şekil kullanılırsa örnek sessizce bozuk açılır — çizgisi
// olmayan kutular, boş etiketler. Buradaki denetimler onu yakalıyor.

describe('akis semasi ornek sablonlari', () => {
  it('her turun ornegi var', () => {
    for (const tur of FLOWCHART_TYPES) {
      expect(FLOWCHART_EXAMPLES[tur.id], tur.id).toBeTruthy();
    }
  });

  for (const [turId, sablon] of Object.entries(FLOWCHART_EXAMPLES)) {
    describe(turId, () => {
      const anahtarlar = new Set(sablon.nodes.map((n) => n.key));

      it('kutu anahtarlari benzersiz', () => {
        expect(anahtarlar.size).toBe(sablon.nodes.length);
      });

      it('cizgiler var olan kutulari bagliyor', () => {
        for (const c of sablon.edges) {
          expect(anahtarlar.has(c.source), `${c.source} yok`).toBe(true);
          expect(anahtarlar.has(c.target), `${c.target} yok`).toBe(true);
        }
      });

      it('her kutu en az bir cizgiye bagli', () => {
        const bagli = new Set(sablon.edges.flatMap((c) => [c.source, c.target]));
        for (const n of sablon.nodes) expect(bagli.has(n.key), `${n.key} bagsiz`).toBe(true);
      });

      it('kullanilan sekiller turde var', () => {
        const turunSekilleri = new Set(getFlowchartType(turId).shapes.map((s) => s.id));
        for (const n of sablon.nodes) {
          expect(turunSekilleri.has(n.shape as never), `${n.shape}`).toBe(true);
        }
      });

      it('etiket anahtarlarinin cevirisi var', () => {
        const sozluk = tr as Record<string, string>;
        for (const n of sablon.nodes) expect(sozluk[n.labelKey], n.labelKey).toBeTruthy();
      });
    });
  }
});

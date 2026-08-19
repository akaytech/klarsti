import type { GanttGorev } from '../store/slices/createGanttSlice';
import { SATIR_YUKSEKLIK, BASLIK_YUKSEKLIK } from './ganttOlculeri';

/**
 * Bağımlılık okları. Önceki görevin bitişinden sonrakinin başlangıcına
 * dirsekli bir çizgi çiziliyor; klasik "bitiş → başlangıç" bağı.
 *
 * Yalnız ikisi de ekranda görünen (kapatılmamış) görevler için çiziliyor:
 * gizli bir satıra giden ok boşluğa gider.
 */
export default function GanttBagimlilikOklari({
  satirlar, ozetler, gunuKonumla, gunGenislik
}: {
  satirlar: { gorev: GanttGorev; derinlik: number }[];
  ozetler: Map<string, { baslangic: string; bitis: string; ilerleme: number }>;
  gunuKonumla: (tarih: string) => number;
  gunGenislik: number;
}) {
  const sira = new Map(satirlar.map((s, i) => [s.gorev.id, i]));

  const yollar: string[] = [];
  satirlar.forEach(({ gorev }) => {
    (gorev.oncekiler || []).forEach((oncekiId) => {
      const oncekiSira = sira.get(oncekiId);
      const buSira = sira.get(gorev.id);
      if (oncekiSira === undefined || buSira === undefined) return;
      const onceki = ozetler.get(oncekiId);
      const bu = ozetler.get(gorev.id);
      if (!onceki || !bu) return;

      const x1 = gunuKonumla(onceki.bitis) + gunGenislik;
      const y1 = BASLIK_YUKSEKLIK + oncekiSira * SATIR_YUKSEKLIK + SATIR_YUKSEKLIK / 2;
      const x2 = gunuKonumla(bu.baslangic);
      const y2 = BASLIK_YUKSEKLIK + buSira * SATIR_YUKSEKLIK + SATIR_YUKSEKLIK / 2;
      const ara = x2 - 8 > x1 + 8 ? x2 - 8 : x1 + 8;
      yollar.push(`M ${x1} ${y1} H ${ara} V ${y2} H ${x2}`);
    });
  });

  if (yollar.length === 0) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-0 z-10 overflow-visible"
      style={{ insetInlineStart: 'var(--gantt-sol)' }}
      width="100%"
      height="100%"
    >
      <defs>
        <marker id="gantt-ok" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
      {yollar.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          strokeWidth={1.5}
          markerEnd="url(#gantt-ok)"
          className="stroke-slate-400 dark:stroke-slate-500"
        />
      ))}
    </svg>
  );
}

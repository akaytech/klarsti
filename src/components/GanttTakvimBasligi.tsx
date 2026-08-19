import { useMemo } from 'react';
import clsx from 'clsx';
import {
  ayEtiketi, ayinIlkiMi, gunEkle, haftaBasiMi, haftaSonuMu, tariheCevir
} from '../utils/ganttTarih';
import type { Yakinlik } from './ganttOlculeri';

/** Takvimin üst şeridi: ay adları ve altında gün/hafta işaretleri. */
export default function GanttTakvimBasligi({
  basla, toplamGun, gunGenislik, yakinlik, dil
}: {
  basla: string;
  toplamGun: number;
  gunGenislik: number;
  yakinlik: Yakinlik;
  dil: string;
}) {
  const gunler = useMemo(
    () => Array.from({ length: toplamGun }, (_, i) => gunEkle(basla, i)),
    [basla, toplamGun]
  );

  // Ay etiketleri ayın ilk gününe konuyor; ilk ay için de takvimin başına.
  const aylar = gunler
    .map((g, i) => ({ g, i }))
    .filter(({ g, i }) => i === 0 || ayinIlkiMi(g));

  return (
    <>
      <div className="relative h-6 border-b border-slate-100 dark:border-slate-800">
        {aylar.map(({ g, i }) => (
          <span
            key={g}
            className="absolute top-0 whitespace-nowrap ps-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400"
            style={{ insetInlineStart: i * gunGenislik }}
          >
            {ayEtiketi(g, dil)}
          </span>
        ))}
      </div>
      <div className="relative h-[26px]">
        {gunler.map((g, i) => {
          // Gün görünümünde her gün yazılıyor; hafta görünümünde yalnız
          // pazartesiler; ay görünümünde hiçbiri (yer yok, ay şeridi yeter).
          const gunGorunumu = yakinlik === 'gun';
          const yaz = gunGorunumu || (yakinlik === 'hafta' && haftaBasiMi(g));
          // Gün görünümünde hafta sonları yazısız da olsa çiziliyor: gri
          // zeminleri takvimi haftalara bölen tek işaret.
          if (!yaz && !(gunGorunumu && haftaSonuMu(g))) return null;
          return (
            <span
              key={g}
              className={clsx(
                'absolute top-0 flex h-full items-center justify-center text-[10px] tabular-nums',
                haftaSonuMu(g)
                  ? 'bg-slate-100 font-semibold text-slate-400 dark:bg-slate-800/60 dark:text-slate-500'
                  : 'text-slate-400 dark:text-slate-500'
              )}
              style={{ insetInlineStart: i * gunGenislik, width: gunGenislik }}
            >
              {yaz ? tariheCevir(g).getDate() : ''}
            </span>
          );
        })}
      </div>
    </>
  );
}

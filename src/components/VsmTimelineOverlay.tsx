import { useMemo } from 'react';
import { useStore } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, getActiveVsmMap } from '../store/useRoadmapStore';
import { vsmHesapla, vsmKutuGenislik, saniyeBicimle, sayiBicimle } from '../utils/vsmHesap';

/** Merdivenin kutuların altında duracağı boşluk. */
const ALT_BOSLUK = 130;
/** Bekleme basamağı ile işlem basamağı arasındaki yükseklik farkı. */
const BASAMAK = 34;

/**
 * Zaman merdiveni: üst basamak bekleme (teslim süresi), alt basamak işlem
 * (katma değer). Eskiden her işlem 150 px varsayılıyordu ve merdiven kutularla
 * hizalanmıyordu; artık gerçek kutu genişlikleri kullanılıyor.
 */
export default function VsmTimelineOverlay() {
  const { t } = useTranslation();
  const transform = useStore((s) => s.transform);
  const harita = useRoadmapStore((s) => getActiveVsmMap(s));

  const cizim = useMemo(() => {
    if (!harita) return null;
    const { yol } = vsmHesapla(harita.nodes, harita.edges, harita.ayarlar);
    if (yol.length === 0) return null;

    const altKenar = Math.max(
      ...yol.map((a) => a.node.position.y + ((a.node as any).measured?.height ?? 110))
    );
    const taban = altKenar + ALT_BOSLUK;

    // Çizim soldan sağa; kullanıcı kutuları sırasız yerleştirmiş olabilir.
    const parcalar = yol
      .map((adim) => ({
        adim,
        x: adim.node.position.x,
        genislik: vsmKutuGenislik(adim.node.type),
      }))
      .sort((a, b) => a.x - b.x);

    let d = '';
    parcalar.forEach((parca, i) => {
      const islem = parca.adim.tur === 'islem';
      const y = islem ? taban + BASAMAK : taban;
      const bitis = parca.x + parca.genislik;

      if (i === 0) {
        d += `M ${parca.x} ${y}`;
      } else {
        const oncekiParca = parcalar[i - 1];
        const oncekiY = oncekiParca.adim.tur === 'islem' ? taban + BASAMAK : taban;
        const oncekiBitis = oncekiParca.x + oncekiParca.genislik;
        // Aradaki boşluğu önceki basamağın yüksekliğinde yürü, sonra bu
        // basamağın hizasına in/çık.
        d += ` L ${parca.x} ${oncekiY} L ${parca.x} ${y}`;
        if (oncekiBitis > parca.x) d += ` M ${parca.x} ${y}`;
      }
      d += ` L ${bitis} ${y}`;
    });

    return { parcalar, d, taban };
  }, [harita]);

  if (!cizim) return null;

  const birimler = { sec: t('vsm_time_unit_sec'), min: t('vsm_time_unit_min'), hr: t('vsm_time_unit_hr') };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
          transformOrigin: '0 0',
          overflow: 'visible',
        }}
      >
        <path d={cizim.d} fill="none" strokeWidth="2.5" className="stroke-slate-700 dark:stroke-slate-300" />

        {cizim.parcalar.map(({ adim, x, genislik }) => {
          const orta = x + genislik / 2;
          if (adim.tur === 'islem') {
            return (
              <text key={adim.node.id} x={orta} y={cizim.taban + BASAMAK + 18} textAnchor="middle" fontSize="12" fontWeight="bold"
                className="fill-emerald-600 dark:fill-emerald-400">
                {saniyeBicimle(adim.katmaDegerSaniye, birimler)}
              </text>
            );
          }
          return (
            <text key={adim.node.id} x={orta} y={cizim.taban - 8} textAnchor="middle" fontSize="12" fontWeight="bold"
              className="fill-rose-600 dark:fill-rose-400">
              {sayiBicimle(adim.teslimGun)} {t('vsm_days')}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

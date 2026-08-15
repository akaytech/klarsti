import { useEffect, useState } from 'react';
import { imlecAboneOl, imlecDurumu, type ImlecDurum } from './demoAltyapi';

/**
 * Klipteki fare imleci. Gerçek imleç ekran kaydına düşmüyor, bu yüzden
 * çiziliyor: sahne onu hedefe kaydırıyor, tıklamada arkasında halka açılıyor.
 */
export default function DemoImlec() {
  const [d, setD] = useState<ImlecDurum>(imlecDurumu);

  useEffect(() => {
    imlecAboneOl(setD);
    return () => imlecAboneOl(null);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Halkanın animasyonu burada duruyor: uygulamanın ortak stil dosyasına
          yalnızca çekim için kullanılan bir kural eklemeye gerek yok. */}
      <style>{`
        .demo-halka {
          width: 12px; height: 12px; margin: -6px 0 0 -6px;
          animation: demo-halka-ac 520ms ease-out forwards;
        }
        @keyframes demo-halka-ac {
          from { transform: scale(0.4); opacity: 0.9; }
          to   { transform: scale(3.6); opacity: 0; }
        }
        /* "Ekrana sığdır" düğmesi görüntüyü anında sıçratıyor; klipte
           yumuşak kaysın. */
        .react-flow__viewport { transition: transform 420ms ease-out; }
      `}</style>

      {/* Tıklama halkası: her tıklamada yeniden doğsun diye anahtarı sayaç. */}
      {d.halka > 0 && (
        <span
          key={d.halka}
          className="demo-halka absolute rounded-full border-2 border-indigo-500/70"
          style={{ left: d.x, top: d.y }}
        />
      )}

      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        className="absolute"
        style={{
          left: d.x,
          top: d.y,
          transform: `translate(-3px, -2px) scale(${d.basili ? 0.82 : 1})`,
          transition: 'transform 90ms ease-out',
          filter: 'drop-shadow(0 2px 4px rgba(15,23,42,0.35))',
        }}
      >
        <path
          d="M4 2 L4 20 L9 15.5 L12 22.5 L15.5 21 L12.5 14 L19 13.5 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

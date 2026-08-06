import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Context menü / inline panel gibi ham (x, y) tıklama koordinatlarıyla
 * konumlanan öğelerin viewport dışına taşmasını önler. Menü render olduktan
 * hemen sonra (boyama öncesi) gerçek boyutunu ölçüp gerekirse ekran içine
 * "klipler". margin: ekran kenarından bırakılacak minimum boşluk (px).
 */
export function useClampedPosition(x: number, y: number, margin = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ top: number; left: number }>({ top: y, left: x });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
    setStyle({
      left: Math.min(Math.max(x, margin), maxLeft),
      top: Math.min(Math.max(y, margin), maxTop),
    });
  }, [x, y, margin]);

  return { ref, style };
}

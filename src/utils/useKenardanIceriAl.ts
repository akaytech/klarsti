import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Düğüme göre konumlanan menüler (NodeToolbar) kanvasın kenarındaki kutularda
 * dışarı taşıyordu. Menü kendini ölçüp taştığı kadar geri itiliyor, kanvastan
 * uzunsa kendi içinde kayıyor.
 *
 * Sınır olarak pencere değil `.react-flow` kutusu alınır: NodeToolbar menüyü
 * oraya çiziyor ve orada overflow gizli, pencereye göre kırpmak yetmezdi.
 *
 * Verilen ref kaydırmayı taşıyan dış sarmalayıcıya, `enFazlaBoy` ise kaydırma
 * çubuğu olan iç kutuya bağlanmalı.
 */
export function useKenardanIceriAl<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [kaydirma, setKaydirma] = useState({ x: 0, y: 0 });
  const kaydirmaRef = useRef(kaydirma);
  kaydirmaRef.current = kaydirma;

  const [enFazlaBoy, setEnFazlaBoy] = useState<number | undefined>(undefined);
  const enFazlaBoyRef = useRef(enFazlaBoy);
  enFazlaBoyRef.current = enFazlaBoy;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const hesapla = () => {
      const bosluk = 8;
      const r = el.getBoundingClientRect();
      const mevcut = kaydirmaRef.current;
      // Uygulanmış kaydırmayı çıkarıp menünün ham konumunu buluyoruz,
      // yoksa her ölçümde birikerek kayardı.
      const sol = r.left - mevcut.x;
      const ust = r.top - mevcut.y;

      const kapsayici = el.closest('.react-flow')?.getBoundingClientRect();
      const solSinir = kapsayici ? kapsayici.left : 0;
      const ustSinir = kapsayici ? kapsayici.top : 0;
      const sagSinir = kapsayici ? kapsayici.right : window.innerWidth;
      const altSinir = kapsayici ? kapsayici.bottom : window.innerHeight;

      const kullanilabilirBoy = Math.round(altSinir - ustSinir - bosluk * 2);
      if (kullanilabilirBoy > 0 && kullanilabilirBoy !== enFazlaBoyRef.current) setEnFazlaBoy(kullanilabilirBoy);

      let x = 0;
      let y = 0;
      if (sol + r.width > sagSinir - bosluk) x = sagSinir - bosluk - (sol + r.width);
      if (sol + x < solSinir + bosluk) x = solSinir + bosluk - sol;
      if (ust + r.height > altSinir - bosluk) y = altSinir - bosluk - (ust + r.height);
      if (ust + y < ustSinir + bosluk) y = ustSinir + bosluk - ust;

      if (x !== mevcut.x || y !== mevcut.y) setKaydirma({ x, y });
    };

    hesapla();
    // İlk karede menünün son konumu henüz oturmamış olabiliyor (NodeToolbar
    // kendi yerleşimini yapıyor), bir kare sonra tekrar ölçüyoruz.
    const kare = requestAnimationFrame(hesapla);
    // Menünün boyu içeriğe göre değişebiliyor, her değişimde yeniden ölçülmeli.
    const gozlemci = new ResizeObserver(hesapla);
    gozlemci.observe(el);
    window.addEventListener('resize', hesapla);

    return () => {
      cancelAnimationFrame(kare);
      gozlemci.disconnect();
      window.removeEventListener('resize', hesapla);
    };
  }, [ref]);

  return {
    sarmalayiciStil: { transform: `translate(${kaydirma.x}px, ${kaydirma.y}px)` },
    enFazlaBoy,
  };
}

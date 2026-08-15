import { useEffect, useRef } from 'react';

/**
 * Ekrana girince beliren bölüm.
 *
 * Tanıtım sayfasında bölümler kaydırırken olduğu gibi duruyordu; artık
 * görünür alana girdiklerinde hafifçe yükselerek beliriyorlar.
 *
 * ÖNEMLİ — bölüm neden baştan gizlenmiyor:
 *
 * İlk yazımda `.belir` (saydam ve biraz aşağıda) bölüme hemen ekleniyordu,
 * gözcü de onu görünce açıyordu. Sorun şu ki gözcü her koşulda çalışmıyor:
 * sayfa arka planda açılmışsa (yeni sekmede link) tarayıcı çizim hattını
 * durduruyor ve gözcü hiç haber vermiyor. O sırada bölüm zaten gizlenmiş
 * oluyor — yani içerik görünmez kalıyor. Test sırasında tam olarak bunu
 * gördük.
 *
 * Şimdi sıra tersine: bölüm normal görünür halde duruyor, gizleme ancak
 * gözcü ilk haberini verdiğinde ve bölüm gerçekten ekranın dışındaysa
 * uygulanıyor. Gözcü hiç konuşmazsa hiçbir şey gizlenmiyor. En kötü ihtimal
 * animasyonun olmaması; içeriğin kaybolması değil.
 *
 * Bir kez belirdikten sonra gözcü bırakılıyor: kullanıcı yukarı kaydırınca
 * bölümlerin tekrar solup gelmesi dikkat dağıtıyor.
 */
export function useKaydirincaBelir<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const oge = ref.current;
    if (!oge) return;
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const gozcu = new IntersectionObserver(
      (girdiler) => {
        for (const girdi of girdiler) {
          const hedef = girdi.target as HTMLElement;
          if (girdi.isIntersecting) {
            // Zaten ekrandaysa: gizlenmişse aç, hiç gizlenmediyse olduğu gibi
            // bırak. İkisinde de sonuç görünür bir bölüm.
            hedef.classList.add('belir-acik');
            gozcu.unobserve(hedef);
          } else {
            // Ekranın dışında: şimdi gizlemek güvenli, kullanıcı görmüyor.
            hedef.classList.add('belir');
          }
        }
      },
      // Bölüm tam kenardan girer girmez değil, biraz içeri girdiğinde:
      // kenarda tetiklenince animasyon kullanıcının göz ucunda kalıyor.
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    gozcu.observe(oge);
    return () => gozcu.disconnect();
  }, []);

  return ref;
}

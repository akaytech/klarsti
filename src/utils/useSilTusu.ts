import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { metinAlaninda } from './metinAlaninda';

/**
 * Delete tuşuyla seçili kutuları siler.
 *
 * NEDEN REACT FLOW'UN KENDİ SİLMESİ KULLANILMIYOR (deleteKeyCode={null}):
 *
 * React Flow silerken kutuyu ve ona bağlı çizgileri AYRI bildiriyor, üstelik
 * önce çizgileri:
 *
 *     if (hasMatchingEdges) { ...triggerEdgeChanges(...) }   // önce
 *     if (hasMatchingNodes) { ...triggerNodeChanges(...) }   // sonra
 *
 * Ağacını çizgilerden okuyan araçlarda (kırılım ağacı, 5 neden, hata ağacı)
 * bu ölümcül: depo "bu kutunun çocukları kim?" diye sorduğunda kutu→çocuk
 * çizgisi çoktan silinmiş oluyor, çocuk bulunamıyor ve yalnızca kutunun
 * kendisi siliniyor. Çocuklar ekranda bağlantısız, kök gibi asılı kalıyor.
 *
 * Silmeyi kendimiz yapınca depo ağacı bozulmamış haliyle görüyor ve kendi
 * silme mantığı (torunlar dahil) doğru çalışıyor. Sağ tık menüsündeki "Sil"
 * zaten hep bu yoldan gidiyordu; artık klavye de aynı yoldan gidiyor.
 */
export function useSilTusu(sil: (idler: string[]) => void) {
  const { getNodes } = useReactFlow();
  // Çağıran taraf çoğu zaman satır içi bir fonksiyon veriyor; ref olmadan
  // dinleyici her render'da sökülüp yeniden takılırdı.
  const silRef = useRef(sil);
  silRef.current = sil;

  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if (e.key !== 'Delete') return;
      // Kutunun içinde yazı yazarken Delete metni silmeli, kutuyu değil.
      if (metinAlaninda(e.target)) return;

      const secili = getNodes().filter((n) => n.selected).map((n) => n.id);
      if (secili.length === 0) return;

      e.preventDefault();
      silRef.current(secili);
    };

    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [getNodes]);
}

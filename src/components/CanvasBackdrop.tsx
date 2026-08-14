import { Background, BackgroundVariant } from '@xyflow/react';
import { useTheme } from '../theme';
import { useCanvasBg } from '../canvasBackground';

/**
 * Çizim alanının zemini. Altı ayrı canvas dosyası da bunu çağırıyor; desen
 * tercihi tek yerden okunsun diye araya girdi (bkz. canvasBackground.ts).
 *
 * gap/size varsayılanları eski `<Background gap={24} size={2} />` çağrısıyla
 * aynı; Değer Akışı kendi daha sık düzenini prop olarak veriyor.
 */
export default function CanvasBackdrop({ gap = 24, size = 2 }: { gap?: number; size?: number }) {
  const themeColors = useTheme();
  const desen = useCanvasBg();

  if (desen === 'none') return null;

  if (desen === 'grid') {
    // İki kat: ince çizgiler her karede, kalın çizgi her beş karede bir.
    // Tek kalınlıkta ızgara mesafe hissi vermiyor; göz uzunluğu kalın
    // çizgilerden ölçüyor. Üstteki çizgi rengi için canvasEdge ödünç
    // alındı — temalarda canvasDot'un bir ton koyusu olarak zaten duruyor,
    // ızgaranın ikinci katı için ayrı bir renk tanımlamaya gerek kalmadı.
    return (
      <>
        <Background
          id="izgara-ince"
          variant={BackgroundVariant.Lines}
          color={themeColors.canvasDot}
          gap={gap}
          lineWidth={0.6}
        />
        <Background
          id="izgara-kalin"
          variant={BackgroundVariant.Lines}
          color={themeColors.canvasEdge}
          gap={gap * 5}
          lineWidth={1}
        />
      </>
    );
  }

  if (desen === 'cross') {
    // Cross'ta `size` artının kol uzunluğu. Aralığa oranlanmazsa sık
    // düzenlerde artılar birbirine değip ızgaraya dönüşüyor.
    return (
      <Background
        variant={BackgroundVariant.Cross}
        color={themeColors.canvasDot}
        gap={gap}
        size={Math.max(4, gap / 4)}
      />
    );
  }

  return <Background color={themeColors.canvasDot} gap={gap} size={size} />;
}

import { Panel } from '@xyflow/react';
import type { ReactNode } from 'react';

/**
 * Boş tuvaldeki karşılama şeridini taşıyan panel.
 *
 * Tek başına bir bileşen olmasının sebebi iki tekrar eden hata:
 *
 * 1. BOŞLUĞUN VERİLME BİÇİMİ. Şerit tuvalin üst ortasında duruyor ama React
 *    Flow kendi stil dosyasında panele margin veriyor ve o kural Tailwind'in
 *    `mt-*` sınıfını eziyor. Yani `className="mt-20"` diye yazılan boşluk hiç
 *    uygulanmıyor, şerit tepeye yapışıyordu: sağ üstteki kılavuz/paylaş/dışa
 *    aktar düğmelerinin ve sol üstteki çalışma menüsünün üstüne biniyordu.
 *    Ekran daraldıkça bindirme büyüyordu. Beş tuvalde böyleydi, ikisinde
 *    doğru yazılmıştı; hangisinin doğru olduğu koda bakmadan anlaşılmıyordu.
 *    Satır içi stil o kuralı geçen tek yol.
 *
 * 2. BOŞLUĞUN DEĞERİ. Her tuval kendi sayısını yazıyordu (80, 96, 112) ve
 *    hiçbiri üst şeritle çalışma menüsünün gerçek yüksekliğinden gelmiyordu.
 *    Artık tek bir yerde: üst düğme sırası 16'da başlayıp 64'te bitiyor,
 *    çalışma menüsü 68'de başlayıp ~106'da bitiyor; şerit 116'dan başlarsa
 *    ikisinin de altında kalıyor.
 */
const UST_BOSLUK = 116;

export default function KarsilamaPaneli({
  children,
  /**
   * Sol üstte çalışma menüsünün altında ikinci bir şerit olan tuvaller
   * (yol haritasının ilerleme çubuğu) için ek boşluk.
   */
  ekBosluk = 0
}: {
  children: ReactNode;
  ekBosluk?: number;
}) {
  return (
    <Panel position="top-center" style={{ marginTop: UST_BOSLUK + ekBosluk }}>
      {children}
    </Panel>
  );
}

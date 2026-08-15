import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * Kamerayı içeriğe sığdırır.
 *
 * React Flow'un `fitView` özelliği yalnızca bileşen ilk kurulduğunda çalışıyor.
 * Kutular sonradan geliyor: kayıtlı çalışma Firestore'dan iniyor, örnek şablon
 * düğmeyle yükleniyor, kullanıcı başka bir ağaca/analize geçiyor. Bu durumların
 * hiçbirinde kamera oynamıyordu; örnek şablon iki kat yakınlaştırılmış açılıyor
 * ve içerik ekrana sığmıyordu.
 *
 * @param anahtar Açık çalışmanın kimliği. Değişince yeniden sığdırılır.
 * @param dugumSayisi Kutu sayısı. Toplu artışta (şablon, içe aktarma) sığdırılır.
 */
export function useEkranaSigdir(
  anahtar: string | undefined,
  dugumSayisi: number,
  secenekler?: { padding?: number; duration?: number; gecikme?: number }
) {
  const { fitView } = useReactFlow();
  const oncekiAnahtar = useRef(anahtar);
  const oncekiSayi = useRef(dugumSayisi);
  const padding = secenekler?.padding ?? 0.2;
  const duration = secenekler?.duration ?? 400;
  const gecikme = secenekler?.gecikme ?? 80;

  useEffect(() => {
    const anahtarDegisti = oncekiAnahtar.current !== anahtar;
    // Tek tek eklenen kutuda kamera oynamamalı: kullanıcı bir kutu eklerken
    // ekranın altından kayması rahatsız edici. Yalnızca birden fazla kutu
    // birden gelince sığdırılıyor.
    const topluGelis = dugumSayisi - oncekiSayi.current > 1;

    oncekiAnahtar.current = anahtar;
    oncekiSayi.current = dugumSayisi;

    if (!anahtar || dugumSayisi === 0) return;
    if (!anahtarDegisti && !topluGelis) return;

    // React Flow kutuların gerçek boyunu ölçmeden sığdırma yanlış hesaplanıyor;
    // bir boyama beklendikten sonra çağrılıyor. Kendi dizilimini sonradan
    // düzelten araçlar (WBS) `gecikme` ile bu payı uzatıyor.
    const zaman = setTimeout(() => {
      // maxZoom sınırı olmadan tek kutuluk bir tuval React Flow'un varsayılan
      // üst sınırına (2 kat) kadar yakınlaşıyor ve sonradan gelen kutular o
      // yakınlıkta kalıyordu: örnek şablonun ekrana sığmamasının sebebi buydu.
      fitView({ padding, duration, maxZoom: 1.2 });
    }, gecikme);
    return () => clearTimeout(zaman);
  }, [anahtar, dugumSayisi, fitView, padding, duration, gecikme]);
}

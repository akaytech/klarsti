import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from 'react';

/**
 * Bir listeyi sürükleyerek sıralamak.
 *
 * Satırların DOM sırası sürükleme boyunca DEĞİŞMİYOR; hepsi yerinde duruyor ve
 * yalnızca `transform` ile kaydırılıyor. Önce liste gerçekten yeniden
 * diziliyordu ve sonuç sıçramalıydı: satır bir anda yer değiştiriyor, altındaki
 * satırın ölçüsü de o anda değiştiği için hedef hesabı zıplıyordu.
 *
 * Şimdi:
 *   - Sürüklenen satır parmağı birebir izliyor (geçiş yok, yoksa gecikirdi).
 *   - Aradaki satırlar bir satır boyu kayıyor ve bunu 160 ms'de yapıyor.
 *   - Hedef hesabı, sürükleme BAŞLARKEN alınan ölçülere bakıyor. Ekrandaki
 *     kaymalar o ölçüleri bozmuyor, yani satır sınırında gidip gelen bir
 *     titreme olmuyor.
 *
 * Sıra yalnızca parmak kalkınca bir kez kaydediliyor.
 */

/** Sürükleme sayılması için gereken en küçük hareket. */
const ESIK = 5;

interface Olcum {
  top: number;
  height: number;
}

interface Durum {
  id: string;
  kaynak: number;
  hedef: number;
  dy: number;
  basladi: boolean;
  baslangicY: number;
  olcumler: Olcum[];
}

export interface SiraSurukleme {
  /** Sürüklenen satırın kimliği; sürükleme yoksa null. */
  suruklenenId: string | null;
  /** Satıra uygulanacak stil. */
  satirStili: (index: number) => CSSProperties;
  onPointerDown: (e: ReactPointerEvent, id: string, index: number) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: () => void;
  /**
   * Sürüklemeden sonra gelen tıklamayı yut. Satırın onClick'i bunu ilk iş
   * olarak çağırmalı; yoksa satır bırakıldığı anda bir de o çalışmaya
   * geçilirdi.
   */
  tiklamaYutuldu: () => boolean;
}

/**
 * @param kapRef Satırların içinde bulunduğu kap. Ölçüler buradaki
 *   `[data-sira-satiri]` öğelerinden alınıyor.
 * @param onSirala Parmak kalkınca çağrılır; hedef, öğenin yeni sırası.
 * @param acik Sürükleme açık mı (kapalıysa bütün işleyiciler boş geçer).
 */
export function useSiraSurukleme(
  kapRef: RefObject<HTMLElement | null>,
  onSirala: ((id: string, hedefIndex: number) => void) | undefined,
  acik = true
): SiraSurukleme {
  const [durum, setDurum] = useState<Durum | null>(null);
  const suruklendi = useRef(false);

  // Sıra kaydı setDurum'un GÜNCELLEYİCİSİNİN İÇİNDEN çağrılamaz: orası
  // render'ın parçası ve depoya yazmak "başka bir bileşen çizilirken durumunu
  // değiştiriyorsun" uyarısı veriyor. Son durum ref'te tutuluyor, yazma da
  // dışarıda yapılıyor.
  const durumRef = useRef(durum);
  durumRef.current = durum;

  const bitir = useCallback(() => {
    const su = durumRef.current;
    if (!su) return;
    if (su.basladi && su.hedef !== su.kaynak) {
      suruklendi.current = true;
      onSirala?.(su.id, su.hedef);
    }
    setDurum(null);
  }, [onSirala]);

  // Parmak listenin dışında kalkarsa satırların pointerup'ı hiç gelmez ve
  // sürükleme asılı kalırdı; son sözü pencere söylüyor.
  const bitirRef = useRef(bitir);
  bitirRef.current = bitir;
  useEffect(() => {
    if (!durum) return;
    const birak = () => bitirRef.current();
    window.addEventListener('pointerup', birak);
    window.addEventListener('pointercancel', birak);
    return () => {
      window.removeEventListener('pointerup', birak);
      window.removeEventListener('pointercancel', birak);
    };
  }, [durum]);

  const onPointerDown = useCallback((e: ReactPointerEvent, id: string, index: number) => {
    if (!acik || !onSirala) return;
    // Yalnızca sol tuş ve fare/kalem. Dokunmatikte parmakla sürüklemek listeyi
    // kaydırmalı; sıralamaya orada basılı tutunca çıkan menüden giriliyor.
    if (e.button !== 0 || e.pointerType === 'touch') return;

    const satirlar = Array.from(kapRef.current?.querySelectorAll<HTMLElement>('[data-sira-satiri]') ?? []);
    if (satirlar.length < 2) return;
    const olcumler = satirlar.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });

    setDurum({ id, kaynak: index, hedef: index, dy: 0, basladi: false, baslangicY: e.clientY, olcumler });
    // Yakalama, imleç listenin dışına taşsa da hareketin gelmeye devam etmesi
    // için. Tarayıcı reddederse sürükleme yine çalışır: hareket bu kez
    // altındaki satırdan gelir, hepsi aynı işleyiciye bağlı.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* önemsiz */ }
  }, [acik, onSirala, kapRef]);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    setDurum((su) => {
      if (!su) return su;
      const ham = e.clientY - su.baslangicY;
      if (!su.basladi && Math.abs(ham) < ESIK) return su;

      const kendi = su.olcumler[su.kaynak];
      const ilk = su.olcumler[0];
      const son = su.olcumler[su.olcumler.length - 1];
      // Satır listenin dışına taşmasın: üstte ilk satırın, altta son satırın
      // hizasında durur.
      const dy = Math.max(ilk.top - kendi.top, Math.min(son.top + son.height - (kendi.top + kendi.height), ham));

      const merkez = kendi.top + kendi.height / 2 + dy;
      let hedef = su.olcumler.length - 1;
      for (let i = 0; i < su.olcumler.length; i++) {
        const o = su.olcumler[i];
        if (merkez < o.top + o.height) { hedef = i; break; }
      }

      if (su.basladi && hedef === su.hedef && dy === su.dy) return su;
      return { ...su, basladi: true, hedef, dy };
    });
  }, []);

  const satirStili = useCallback((index: number): CSSProperties => {
    if (!durum?.basladi) return {};
    const boy = durum.olcumler[durum.kaynak]?.height ?? 0;

    if (index === durum.kaynak) {
      return {
        // Sürüklenen satır parmağı gecikmesiz izliyor.
        transform: `translateY(${durum.dy}px)`,
        zIndex: 2,
        position: 'relative',
        cursor: 'grabbing',
        willChange: 'transform'
      };
    }

    // Aradakiler bir satır boyu kayarak yer açıyor.
    let kayma = 0;
    if (durum.kaynak < durum.hedef && index > durum.kaynak && index <= durum.hedef) kayma = -boy;
    else if (durum.kaynak > durum.hedef && index >= durum.hedef && index < durum.kaynak) kayma = boy;

    return {
      transform: `translateY(${kayma}px)`,
      transition: 'transform 160ms cubic-bezier(0.2, 0, 0, 1)',
      willChange: 'transform'
    };
  }, [durum]);

  const tiklamaYutuldu = useCallback(() => {
    if (!suruklendi.current) return false;
    suruklendi.current = false;
    return true;
  }, []);

  return {
    suruklenenId: durum?.basladi ? durum.id : null,
    satirStili,
    onPointerDown,
    onPointerMove,
    onPointerUp: bitir,
    tiklamaYutuldu
  };
}

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Menü kapatma kuralları.
 *
 * Uygulamada üç ayrı menü türü var ve üçü de kapanma mantığını her bileşende
 * elle yazıyordu (16 yerde, birbirinden hafif farklı lehçelerle). Kural tek
 * olduğu halde kopyaları ayrı ayrı bakım istiyordu; buraya toplandı.
 *
 * `close-menus`: kanvas üzerinde bir işlem başladığında (düğüm sürükleme, boş
 * alana tıklama...) tüm menülerin birden kapanması için document üstünde
 * yayınlanan olay. Yayınlayan taraf kanvas dosyalarında.
 */

/**
 * Geri çağırmayı ref'te tutar. Dinleyiciler bir kez bağlanıp bileşen sökülene
 * kadar kalır ama her zaman en güncel fonksiyonu çağırır; her render'da
 * yeniden bağlanma olmaz. Kopyalanan kodda deps listesi yerden yere
 * değişiyordu, bu fark böylece ortadan kalkıyor.
 */
function useGuncelGeriCagirma(fn: () => void) {
  const ref = useRef(fn);
  ref.current = fn;
  return ref;
}

/**
 * Sağ tık menüleri: menünün dışına basınca, Escape'e basınca ya da kanvas
 * "hepsini kapat" deyince kapanır. Menünün kendi kabı `.context-menu`
 * sınıfını taşımalı, dışarı sayılmaması buna bakıyor.
 */
export function useBaglamMenusuKapat(onClose: () => void) {
  const kapatRef = useGuncelGeriCagirma(onClose);

  useEffect(() => {
    const disaTiklama = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.context-menu')) return;
      kapatRef.current();
    };
    const tus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kapatRef.current();
    };
    const yayin = () => kapatRef.current();

    document.addEventListener('mousedown', disaTiklama);
    document.addEventListener('keydown', tus);
    document.addEventListener('close-menus', yayin);
    return () => {
      document.removeEventListener('mousedown', disaTiklama);
      document.removeEventListener('keydown', tus);
      document.removeEventListener('close-menus', yayin);
    };
  }, [kapatRef]);
}

/**
 * Kendi düğmesiyle açılıp kapanan açılır menüler: dışarı tıklamayı zaten
 * kendileri yönetmiyor, yalnızca kanvasın "hepsini kapat" yayınına uyuyorlar.
 */
export function useKapatmaYayini(kapat: () => void) {
  const kapatRef = useGuncelGeriCagirma(kapat);

  useEffect(() => {
    const dinleyici = () => kapatRef.current();
    document.addEventListener('close-menus', dinleyici);
    return () => document.removeEventListener('close-menus', dinleyici);
  }, [kapatRef]);
}

/**
 * Üst bardaki menüler: kendi kabının dışına basınca, Escape'e basınca ya da
 * "hepsini kapat" yayınında kapanır.
 *
 * Escape sonradan eklendi: sağ tık menüleri baştan beri kapanıyordu ama üst
 * bardaki açılır menüler (Çalışmalarım, hesap, üç nokta, araç listesi)
 * kapanmıyordu. Bilgisayarda çalışan herkesin bir pencereyi kapatmak için ilk
 * refleksi Escape.
 *
 * Yakalama aşamasında dinleniyor (`capture: true`): menünün içindeki bir düğme
 * tıklamayı durdurabiliyor, normal aşamada beklesek dışarı tıklamayı hiç
 * göremezdik.
 *
 * `kanvasYayini: false` ile "hepsini kapat" yayını dinlenmez. Kanvas bu yayını
 * kaydırma/yakınlaştırma başlar başlamaz da gönderiyor (bkz. onMoveStart) ve
 * bunun sebebi kutuya yapışık menülerin kanvasla birlikte sürüklenip ekran
 * dışına çıkması. Ekranın kenarında sabit duran bir panelin böyle bir derdi
 * yok; tekerlek her döndüğünde kapanması kullanıcının işini bölüyordu.
 * Kanvasa TIKLAMA yine kapatıyor, o dışarı tıklama olarak zaten yakalanıyor.
 */
export function useDisariTiklama(
  ref: RefObject<HTMLElement | null>,
  kapat: () => void,
  { kanvasYayini = true }: { kanvasYayini?: boolean } = {}
) {
  const kapatRef = useGuncelGeriCagirma(kapat);

  useEffect(() => {
    const disaTiklama = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) kapatRef.current();
    };
    const tus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kapatRef.current();
    };
    const yayin = () => kapatRef.current();

    document.addEventListener('mousedown', disaTiklama, { capture: true });
    document.addEventListener('keydown', tus);
    if (kanvasYayini) document.addEventListener('close-menus', yayin);
    return () => {
      document.removeEventListener('mousedown', disaTiklama, { capture: true });
      document.removeEventListener('keydown', tus);
      document.removeEventListener('close-menus', yayin);
    };
  }, [ref, kapatRef, kanvasYayini]);
}

import { Position } from '@xyflow/react';

/**
 * Kutunun dört bağlantı noktası.
 *
 * Eskiden noktaların görevi sabitti: üst ile sol yalnız GİRİŞ, alt ile sağ
 * yalnız ÇIKIŞ. Bu yüzden sağdan çıkan bir çizgi ancak karşı kutunun soluna
 * girebiliyordu; "sağdan çık, sağa gir" ya da "üstten çık" diye bir şey yoktu.
 * Şimdi dördü de hem çıkış hem giriş (bkz. DiagramCanvas, ConnectionMode.Loose)
 * ve her birinin üstünde yeni kutu ekleyen bir artı duruyor.
 */
export const YONLER = ['top', 'right', 'bottom', 'left'] as const;

export type Yon = (typeof YONLER)[number];

export const POZISYON: Record<Yon, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

/** Karşı kenar: sağdan çıkan çizgi yeni kutunun soluna girer. */
export const KARSI_YON: Record<Yon, Yon> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/** Kutular arasında bırakılan boşluk; dizilimin verdiği aralıkla aynı ölçüde. */
const ARA = 80;
const VARSAYILAN_EN = 180;
const VARSAYILAN_BOY = 60;

interface Kutu {
  position: { x: number; y: number };
  measured?: { width?: number; height?: number };
}

/**
 * Tutamaktaki artıdan eklenen kutunun yeri: basılan tutamağın yönünde, bir
 * kutu boyu ötede. Aynı tutamaktan daha önce kutu çıkmışsa yenisi onun yanına
 * kayıyor, yoksa hepsi aynı noktaya yığılıyordu.
 */
export function yeniKutuYeri(ebeveyn: Kutu | undefined, yon: Yon, kardesSayisi: number) {
  if (!ebeveyn) return { x: 0, y: 0 };
  const en = ebeveyn.measured?.width ?? VARSAYILAN_EN;
  const boy = ebeveyn.measured?.height ?? VARSAYILAN_BOY;
  const { x, y } = ebeveyn.position;
  const yatayKaydir = kardesSayisi * (en + ARA);
  const dikeyKaydir = kardesSayisi * (boy + ARA);

  switch (yon) {
    case 'top':
      return { x: x + yatayKaydir, y: y - boy - ARA };
    case 'bottom':
      return { x: x + yatayKaydir, y: y + boy + ARA };
    case 'left':
      return { x: x - en - ARA, y: y + dikeyKaydir };
    case 'right':
      return { x: x + en + ARA, y: y + dikeyKaydir };
  }
}

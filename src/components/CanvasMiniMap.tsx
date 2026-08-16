import { MiniMap, Panel } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { Map as MapIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/useUIStore';
import { denemeKipindeMi } from '../utils/denemeKipi';

/** Küçük haritanın ölçüsü. Panel konumu buna göre hesaplanıyor. */
const GENISLIK = 160;
const YUKSEKLIK = 112;
const KENAR = 15;
/**
 * Denemede tuvalin sağ alt köşesinde "Hesap Aç" şeridi duruyor ve harita tam
 * onun altında kalıyordu. Şerit kapladığı yüksekliği `--deneme-seridi`
 * değişkenine yazıyor (bkz. DenemeSeridi); harita o kadar yukarı çıkıyor.
 * Sabit bir sayı yazılmadı: şerit dile göre iki ya da üç satır oluyor.
 */
const SERIT_PAYI = 'var(--deneme-seridi, 0px) + 8px';

/**
 * Tuvalin sağ alt köşesindeki küçük harita.
 *
 * Eskiden 192 pikselik bir daireydi ve kapatılamıyordu: dar ekranda çalışmanın
 * üstüne biniyor, yuvarlak olduğu için de kenardaki kutuları kırpıyordu.
 * Artık daha küçük, dikdörtgen (içerik kırpılmıyor) ve bir düğmeyle
 * kapatılabiliyor. Tercih bu tarayıcıda hatırlanıyor.
 *
 * Dar ekranda hem harita hem düğmesi gizli: orada zaten yer yok ve alt orta
 * kutu ekleme düğmesiyle çakışıyorlar.
 */
export default function CanvasMiniMap({
  nodeColor,
  maskColor,
}: {
  nodeColor?: string | ((node: Node) => string);
  maskColor?: string;
}) {
  const { t } = useTranslation();
  const acik = useUIStore((s) => s.minimapOpen);
  const setAcik = useUIStore((s) => s.setMinimapOpen);
  // Denemede şeridin payı ekleniyor; hesaplı ekranda böyle bir şerit yok.
  const altKenar = (piksel: number) =>
    denemeKipindeMi() ? `calc(${piksel}px + ${SERIT_PAYI})` : piksel;

  return (
    <>
      {acik && (
        <MiniMap
          position="bottom-right"
          zoomable
          pannable
          nodeColor={nodeColor as any}
          maskColor={maskColor}
          className="!hidden !rounded-xl border-2 border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:!block"
          style={{ width: GENISLIK, height: YUKSEKLIK, marginBottom: altKenar(KENAR) }}
        />
      )}

      <Panel
        position="bottom-right"
        className="hidden sm:block"
        // Harita açıkken düğme onun üstüne çıkıyor; kapalıyken köşeye iniyor.
        style={{ marginBottom: acik ? altKenar(KENAR + YUKSEKLIK + 8) : altKenar(KENAR) }}
      >
        <button
          type="button"
          onClick={() => setAcik(!acik)}
          title={acik ? t('minimap_hide') : t('minimap_show')}
          aria-label={acik ? t('minimap_hide') : t('minimap_show')}
          aria-pressed={acik}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          {acik ? <X size={15} /> : <MapIcon size={15} />}
        </button>
      </Panel>
    </>
  );
}

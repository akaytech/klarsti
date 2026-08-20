import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore, getActiveVsmMap } from '../store/useRoadmapStore';
import type { VsmNodeTuru, VsmEdgeTuru } from '../store/slices/createVsmSlice';
import { Play, Factory, Triangle, X, ArrowRight, RefreshCw, Zap, ClipboardList, Truck, Store, ListOrdered, Radio } from 'lucide-react';
import { useClampedPosition } from '../utils/useClampedPosition';
import { MenuPortal } from '../utils/MenuPortal';
import { vsmKutuGenislik } from '../utils/vsmHesap';

export type VsmMenuHedefi =
  | { tur: 'node'; id: string }
  | { tur: 'edge'; id: string }
  | { tur: 'pane'; konum: { x: number; y: number } };

interface VsmContextMenuProps {
  hedef: VsmMenuHedefi;
  top: number;
  left: number;
  onClose: () => void;
  onRequestDeleteNode: (id: string) => void;
}

const KUTU_TIPLERI: { tip: VsmNodeTuru; anahtar: string; Simge: typeof Play; renk: string }[] = [
  { tip: 'vsmProcess', anahtar: 'vsm_add_process', Simge: Play, renk: 'text-indigo-500' },
  { tip: 'vsmInventory', anahtar: 'vsm_add_inventory', Simge: Triangle, renk: 'text-amber-500' },
  { tip: 'vsmSupermarket', anahtar: 'vsm_add_supermarket', Simge: Store, renk: 'text-teal-500' },
  { tip: 'vsmSupplierCustomer', anahtar: 'vsm_add_supplier', Simge: Factory, renk: 'text-slate-500' },
  { tip: 'vsmProductionControl', anahtar: 'vsm_add_production_control', Simge: ClipboardList, renk: 'text-slate-500' },
  { tip: 'vsmShipment', anahtar: 'vsm_add_shipment', Simge: Truck, renk: 'text-slate-500' },
  { tip: 'vsmKaizen', anahtar: 'vsm_add_kaizen', Simge: Zap, renk: 'text-rose-500' },
];

const OK_TIPLERI: { tip: VsmEdgeTuru; anahtar: string; Simge: typeof ArrowRight; renk: string }[] = [
  { tip: 'vsmPush', anahtar: 'vsm_edge_push', Simge: ArrowRight, renk: 'text-slate-600' },
  { tip: 'vsmPull', anahtar: 'vsm_edge_pull', Simge: RefreshCw, renk: 'text-sky-500' },
  { tip: 'vsmFifo', anahtar: 'vsm_edge_fifo', Simge: ListOrdered, renk: 'text-slate-600' },
  { tip: 'vsmInfo', anahtar: 'vsm_edge_info', Simge: Zap, renk: 'text-rose-500' },
  { tip: 'vsmInfoElectronic', anahtar: 'vsm_edge_info_electronic', Simge: Radio, renk: 'text-rose-500' },
];

export default function VsmContextMenu({ hedef, top, left, onClose, onRequestDeleteNode }: VsmContextMenuProps) {
  const { t } = useTranslation();
  const addVsmNode = useRoadmapStore((s) => s.addVsmNode);
  const updateVsmEdge = useRoadmapStore((s) => s.updateVsmEdge);
  const deleteVsmEdge = useRoadmapStore((s) => s.deleteVsmEdge);
  const harita = useRoadmapStore((s) => getActiveVsmMap(s));
  const { ref: menuRef, style: menuStyle } = useClampedPosition(left, top);

  const mevcutKutu = hedef.tur === 'node' ? harita?.nodes.find((n) => n.id === hedef.id) : undefined;
  const mevcutOk = hedef.tur === 'edge' ? harita?.edges.find((e) => e.id === hedef.id) : undefined;

  useEffect(() => {
    const kapat = () => onClose();
    document.addEventListener('click', kapat);
    document.addEventListener('close-menus', kapat);
    return () => {
      document.removeEventListener('click', kapat);
      document.removeEventListener('close-menus', kapat);
    };
  }, [onClose]);

  const kutuEkle = (tip: VsmNodeTuru) => {
    const varsayilanAd = t(KUTU_TIPLERI.find((k) => k.tip === tip)!.anahtar);
    if (hedef.tur === 'pane') {
      addVsmNode(tip, varsayilanAd, hedef.konum);
    } else if (mevcutKutu) {
      // Yeni kutu, tıklanan kutunun sağına: akış soldan sağa okunur.
      addVsmNode(tip, varsayilanAd, {
        x: mevcutKutu.position.x + vsmKutuGenislik(mevcutKutu.type) + 80,
        y: mevcutKutu.position.y,
      });
    }
    onClose();
  };

  const sil = () => {
    if (hedef.tur === 'node') onRequestDeleteNode(hedef.id);
    else if (hedef.tur === 'edge') deleteVsmEdge(hedef.id);
    onClose();
  };

  return (
    <MenuPortal>
      <div
        ref={menuRef}
        style={menuStyle}
        className="fixed z-50 w-60 animate-in fade-in zoom-in-95 rounded-lg border border-slate-200 bg-white py-2 shadow-xl duration-100 dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between border-b border-slate-100 px-3 pb-2 text-xs font-semibold text-slate-500 dark:border-slate-700/50 dark:text-slate-400">
          {hedef.tur === 'edge' ? t('vsm_flow_type') : t('actions', { defaultValue: 'Actions' })}
          <button onClick={onClose} className="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            title={t('close', { defaultValue: 'Close' })} aria-label={t('close', { defaultValue: 'Close' })}>
            <X size={14} />
          </button>
        </div>

        {hedef.tur === 'edge' ? (
          OK_TIPLERI.map(({ tip, anahtar, Simge, renk }) => (
            <button
              key={tip}
              onClick={() => { updateVsmEdge(hedef.id, { type: tip }); onClose(); }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-start text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                mevcutOk?.type === tip ? 'font-bold text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Simge size={16} className={renk} /> {t(anahtar)}
            </button>
          ))
        ) : (
          KUTU_TIPLERI.map(({ tip, anahtar, Simge, renk }) => (
            <button
              key={tip}
              onClick={() => kutuEkle(tip)}
              className="flex w-full items-center gap-2 px-4 py-2 text-start text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
            >
              <Simge size={16} className={renk} /> {t(anahtar)}
            </button>
          ))
        )}

        {hedef.tur !== 'pane' && (
          <>
            <div className="my-1 border-t border-slate-100 dark:border-slate-700/50" />
            <button
              onClick={sil}
              className="flex w-full items-center gap-2 px-4 py-2 text-start text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <X size={16} />
              {t('delete', { defaultValue: 'Delete' })}
            </button>
          </>
        )}
      </div>
    </MenuPortal>
  );
}

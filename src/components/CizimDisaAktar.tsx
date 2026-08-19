import { useState, useEffect, useCallback } from 'react';
import { getNodesBounds, getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/useUIStore';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useTheme } from '../theme';
import { gorseliIndir } from '../utils/gorselIndir';
import DisaAktarDugmesi from './DisaAktarDugmesi';

/**
 * Çizim tuvallerinin görsel dışa aktarması.
 *
 * Neden ayrı dosya: burası React Flow'un bağlamını okuyor ve çizim
 * kütüphanesini içe aktarıyor. Tek düğmenin içinde dursaydı kütüphane
 * uygulama kabuğuna bağlanır, SWOT ya da ajanda açan kullanıcı da onu
 * indirirdi. Bu bileşen yalnızca çizim araçlarında ve gecikmeli yükleniyor
 * (bkz. GlobalExportButton, config/tools.ts CIZIM_ARACLARI).
 */
export default function CizimDisaAktar() {
  const { t } = useTranslation();
  const temaRenkleri = useTheme();
  const [calisiyor, setCalisiyor] = useState(false);
  const activeTool = useRoadmapStore((s) => s.activeTool);
  const { getNodes } = useReactFlow();
  const setTriggerExport = useUIStore((s) => s.setTriggerExport);

  const aktar = useCallback(async () => {
    if (calisiyor) return;
    setCalisiyor(true);
    try {
      const kutular = getNodes();
      if (kutular.length === 0) {
        toast.error(t('export_empty', { defaultValue: 'Nothing to export' }));
        return;
      }

      const sinirlar = getNodesBounds(kutular);
      const bosluk = 50;
      sinirlar.x -= bosluk;
      sinirlar.y -= bosluk;
      sinirlar.width += bosluk * 2;
      sinirlar.height += bosluk * 2;

      const gorus = getViewportForBounds(sinirlar, sinirlar.width, sinirlar.height, 0.5, 2, 0);
      const eleman = document.querySelector('.react-flow__viewport') as HTMLElement | null;
      if (!eleman) throw new Error('ReactFlow viewport not found');

      await gorseliIndir(eleman, String(activeTool), temaRenkleri.exportBg, {
        width: sinirlar.width,
        height: sinirlar.height,
        style: {
          width: `${sinirlar.width}px`,
          height: `${sinirlar.height}px`,
          transform: `translate(${gorus.x}px, ${gorus.y}px) scale(${gorus.zoom})`,
        },
      });
    } catch (hata) {
      console.error('Export failed:', hata);
      toast.error(t('export_failed', { defaultValue: 'Export failed' }));
    } finally {
      setCalisiyor(false);
    }
  }, [activeTool, calisiyor, getNodes, t, temaRenkleri.exportBg]);

  useEffect(() => {
    setTriggerExport(aktar);
    return () => setTriggerExport(() => {});
  }, [aktar, setTriggerExport]);

  return <DisaAktarDugmesi calisiyor={calisiyor} onTikla={aktar} />;
}

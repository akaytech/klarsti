import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/useUIStore';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useTheme } from '../theme';
import { denemeKipindeMi } from '../utils/denemeKipi';
import { cizimAraciMi } from '../config/tools';
import { gecikmeliEkran } from '../utils/surumTazeleme';
import DisaAktarDugmesi from './DisaAktarDugmesi';

/**
 * Görsel dışa aktarma. İki yol var ve ayrı durmaları bilinçli:
 *
 * - Çizim tuvalleri (kırılım ağacı, zihin haritası, akış şeması...) React
 *   Flow'un görüş alanını çekiyor. O kod ayrı bir dosyada ve GECİKMELİ
 *   yükleniyor; burada dursaydı 174 KB'lık çizim kütüphanesi uygulama
 *   kabuğuna bağlanır, SWOT ya da ajanda açan kullanıcı da onu indirirdi.
 * - Listeye dayalı araçlar (SWOT, PUKÖ, Pareto...) sayfanın kendisini
 *   çekiyor. Aşağıdaki yol bu; çizim kütüphanesine hiç dokunmuyor.
 */
const CizimDisaAktar = gecikmeliEkran(() => import('./CizimDisaAktar'));

const GlobalExportButton: React.FC = () => {
  const { t } = useTranslation();
  const temaRenkleri = useTheme();
  const [calisiyor, setCalisiyor] = useState(false);
  const activeTool = useRoadmapStore((s) => s.activeTool);
  const setTriggerExport = useUIStore((s) => s.setTriggerExport);
  const cizim = cizimAraciMi(activeTool);

  const aktar = useCallback(async () => {
    if (calisiyor) return;
    setCalisiyor(true);
    try {
      const eleman = document.querySelector('.flex-1.overflow-auto') as HTMLElement | null;
      if (!eleman) {
        toast.error(t('export_empty', { defaultValue: 'Nothing to export' }));
        return;
      }

      // Çekim sırasında kaydırma çubuğu ve kırpılmış içerik kalmasın.
      const eskiTasma = eleman.style.overflow;
      const eskiYukseklik = eleman.style.height;
      eleman.style.overflow = 'visible';
      eleman.style.height = 'auto';

      try {
        await gorseliIndirGetir(eleman, String(activeTool), temaRenkleri.exportBg);
      } finally {
        eleman.style.overflow = eskiTasma;
        eleman.style.height = eskiYukseklik;
      }
    } catch (hata) {
      console.error('Export failed:', hata);
      toast.error(t('export_failed', { defaultValue: 'Export failed' }));
    } finally {
      setCalisiyor(false);
    }
  }, [activeTool, calisiyor, t, temaRenkleri.exportBg]);

  useEffect(() => {
    // Çizim araçlarında tetikleyiciyi CizimDisaAktar kuruyor; iki taraf
    // birbirinin üstüne yazmasın.
    if (cizim) return;
    setTriggerExport(aktar);
    return () => setTriggerExport(() => {});
  }, [aktar, cizim, setTriggerExport]);

  // Ajanda görsel olarak dışa aktarılmıyor: kişisel bir günlük, kanvas değil.
  if (!activeTool || activeTool === 'notepad') return null;
  // Hesapsız denemede dışa aktarma yok. Ziyaretçi tuvali görsün diye deneme
  // açık; işini bitirip çıktısını alıp gitmesi için değil. Çıktı hesaba bağlı.
  if (denemeKipindeMi()) return null;

  if (cizim) return <CizimDisaAktar />;

  return <DisaAktarDugmesi calisiyor={calisiyor} onTikla={aktar} />;
};

/** html-to-image ağır; ancak dışa aktarıma basılınca iniyor. */
async function gorseliIndirGetir(eleman: HTMLElement, ad: string, zemin: string) {
  const { gorseliIndir } = await import('../utils/gorselIndir');
  await gorseliIndir(eleman, ad, zemin, { style: { margin: '0' } });
}

export default GlobalExportButton;

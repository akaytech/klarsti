import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../config/tools';
import type { ToolId } from '../store/useRoadmapStore';

/**
 * Uygulama içindeyken sekme başlığını açık olan araca göre yazar.
 *
 * Neden gerekti: uygulamanın kendi başlığı hiç yoktu. Başlığı yalnızca herkese
 * açık sayfalar (araç tanıtımları, yasal metinler, hakkımızda) değiştiriyordu.
 * Giriş sayfasından oturum açıldığında yeni bir HTML inmediği için sekmede
 * "Sign In | Klarsti" asılı kalıyordu; bir araç tanıtım sayfasından uygulamaya
 * geçildiğinde de o sayfanın başlığı kalıyordu.
 *
 * Araç adları on bir dilde zaten çevrili, o yüzden ayrı bir başlık listesi
 * tutulmuyor: araç satırındaki etiketin ta kendisi yazılıyor. Hiçbir araç açık
 * değilken tek bir kelimeye düşülüyor (app_tab_title).
 *
 * Herkese açık bir sayfaya geçildiğinde bu bileşen sökülüyor ve başlığı o
 * sayfa devralıyor; geri dönüldüğünde burası yeniden yazıyor.
 */
const MARKA = 'Klarsti';

export function useSekmeBasligi(arac: ToolId | null) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const kayit = arac ? TOOLS.find((x) => x.id === arac) : undefined;
    const ad = kayit ? t(kayit.labelKey) : t('app_tab_title');
    document.title = `${ad} | ${MARKA}`;
  }, [arac, t, i18n.language]);
}

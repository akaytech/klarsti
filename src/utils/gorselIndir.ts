import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import i18n from '../i18n';

/**
 * Bir HTML parçasını PNG'ye çevirip indirir.
 *
 * İki dışa aktarıcının ortak kuyruğu: çizim tuvalleri görüş alanını, listeye
 * dayalı araçlar sayfanın kendisini veriyor; sonrasında yapılan iş aynı.
 */
export async function gorseliIndir(
  eleman: HTMLElement,
  dosyaAdi: string,
  zemin: string,
  ekAyarlar: Parameters<typeof toPng>[1] = {},
) {
  // Görsellerin yüklenmesini ve yerleşimin oturmasını bekle.
  await new Promise((coz) => setTimeout(coz, 200));

  const veri = await toPng(eleman, { cacheBust: true, backgroundColor: zemin, ...ekAyarlar });

  const bag = document.createElement('a');
  bag.download = `${dosyaAdi}-export.png`;
  bag.href = veri;
  bag.click();
  toast.success(i18n.t('export_success', { defaultValue: 'Exported successfully' }));
}

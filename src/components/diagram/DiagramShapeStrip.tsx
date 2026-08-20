import { useTranslation } from 'react-i18next';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';

/**
 * Kutu şekillerinin dizildiği şerit.
 *
 * Eskiden yeni kutunun şekli sağ tık menüsündeki uzun bir listeden
 * seçiliyordu; aynı menüde "şeklini değiştir" listesi de durduğu için hangi
 * listenin ne yaptığı anlaşılmıyordu. Ekleme işi menüden çıkıp kutunun altına
 * taşındı: şekillere tek tıkla yeni kutu iniyor.
 *
 * `nodrag nopan` şart: şerit React Flow'un tuvalinin içinde duruyor ve fare
 * tuşuna basmak tuval kaydırma hareketini başlatıyor. Kaydırma başlayınca
 * kanvas bütün menüleri kapatıyor, şerit de tıklama tamamlanmadan ekrandan
 * kalkıyordu — düğmelere basmak hiçbir şey yapmıyor gibi görünüyordu.
 */
export default function DiagramShapeStrip({
  kind,
  chartType,
  onSec,
}: {
  kind: DiagramKind;
  chartType: string | undefined;
  /** Seçilen şekil ve o şekle ait varsayılan kutu adı. */
  onSec: (shape: string, label: string) => void;
}) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const sekiller = k.getType(chartType).shapes;

  return (
    <div
      className="nodrag nopan flex max-w-[352px] flex-wrap justify-center gap-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {sekiller.map((bicim) => {
        const Ikon = bicim.icon;
        return (
          <button
            key={bicim.id}
            type="button"
            title={t(bicim.addLabelKey)}
            aria-label={t(bicim.addLabelKey)}
            onClick={(e) => {
              e.stopPropagation();
              onSec(bicim.id, t(bicim.newLabelKey));
            }}
            className={`flex w-[80px] flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${bicim.menuClass}`}
          >
            <Ikon size={24} />
            <span className="text-[11px] font-bold leading-tight text-center">{t(bicim.nameKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

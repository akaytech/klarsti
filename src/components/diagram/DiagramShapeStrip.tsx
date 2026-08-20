import { useTranslation } from 'react-i18next';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';

/**
 * Kutu şekillerinin yan yana dizildiği şerit.
 *
 * Eskiden yeni kutunun şekli sağ tık menüsündeki uzun bir listeden
 * seçiliyordu; aynı menüde "şeklini değiştir" listesi de durduğu için hangi
 * listenin ne yaptığı anlaşılmıyordu. Ekleme işi menüden çıkıp kutunun altına
 * taşındı: ikonlara tek tıkla yeni kutu iniyor.
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
    <div className="flex items-center gap-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-1 shadow-xl">
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
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${bicim.menuClass}`}
          >
            <Ikon size={17} />
          </button>
        );
      })}
    </div>
  );
}

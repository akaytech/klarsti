import { Trash2, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DiagramNode, DiagramNodeData } from '../../store/slices/diagramOps';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useActiveChart } from './useDiagram';
import { useClampedPosition } from '../../utils/useClampedPosition';
import { MenuPortal } from '../../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../../utils/menuKapatma';

interface DiagramContextMenuProps {
  kind: DiagramKind;
  x: number;
  y: number;
  node: DiagramNode;
  onClose: () => void;
  onAddNode: (shape: string, label: string) => void;
  onUpdate: (data: Partial<DiagramNodeData>) => void;
  onDelete: () => void;
  /** Adı kutunun içinde yazmaya açar (bkz. DiagramNode). */
  onEdit: () => void;
}

export default function DiagramContextMenu({ kind, x, y, node, onClose, onAddNode, onUpdate, onDelete, onEdit }: DiagramContextMenuProps) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);

  const k = getDiagramKind(kind);
  const tur = k.getType(useActiveChart(kind)?.type);

  useBaglamMenusuKapat(onClose);

  // Kutunun türünü değiştirir: yazı ve bağlantılar durur, yalnızca şekil
  // değişir. Aynı türden şemada kullanılabilen bütün kutular listeleniyor.
  const turDegistir = (shape: string) => {
    onUpdate({ shape });
    onClose();
  };

  const digerBicimler = tur.shapes.filter((b) => b.id !== node.data.shape);

  return (
    <MenuPortal>
    <div
      ref={menuRef}
      className="context-menu fixed z-50 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      style={menuStyle}
    >
        <div className="py-1 max-h-80 overflow-y-auto custom-scrollbar">
          <button onClick={onEdit} className="w-full px-4 py-2 text-start text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors">
            <Edit3 size={16} className="text-slate-400" /> {t(k.text.edit)}
          </button>

          <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>

          {/* Kutunun türünü değiştirme. Yanlış kutuyu ekleyen kullanıcı eskiden
              kutuyu silip yenisini çizmek zorundaydı; bağlantıları da gidiyordu. */}
          {digerBicimler.length > 0 && (
            <>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t(k.text.changeShape)}</div>
              {digerBicimler.map((bicim) => {
                const Ikon = bicim.icon;
                return (
                  <button
                    key={`tur-${bicim.id}`}
                    onClick={() => turDegistir(bicim.id)}
                    className={`w-full px-4 py-1.5 text-start text-sm flex items-center gap-2 transition-colors ${bicim.menuClass}`}
                  >
                    <Ikon size={16} /> {t(bicim.nameKey)}
                  </button>
                );
              })}

              <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>
            </>
          )}

          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t(k.text.addBox)}</div>

          {/* Eklenebilecek kutular şema türüne göre değişiyor; liste katalogdan
              geliyor, burada tür başına ayrı blok yok. */}
          {tur.shapes.map((bicim) => {
            const Ikon = bicim.icon;
            return (
              <button
                key={bicim.id}
                onClick={() => onAddNode(bicim.id, t(bicim.newLabelKey))}
                className={`w-full px-4 py-1.5 text-start text-sm flex items-center gap-2 transition-colors ${bicim.menuClass}`}
              >
                <Ikon size={16} /> {t(bicim.addLabelKey)}
              </button>
            );
          })}

          <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>

          <button onClick={onDelete} className="w-full px-4 py-2 text-start text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
            <Trash2 size={16} /> {t(k.text.deleteNode)}
          </button>
        </div>
    </div>
    </MenuPortal>
  );
}

import { useTranslation } from 'react-i18next';
import { CornerDownRight, Plus, Pencil, Trash2, Minus, AlignLeft, CheckSquare, Square, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useClampedPosition } from '../utils/useClampedPosition';
import { MenuPortal } from '../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../utils/menuKapatma';

interface Props {
  x: number;
  y: number;
  nodeId: string;
  kok: boolean;
  cocukVar: boolean;
  daraltilmis: boolean;
  bitti: boolean;
  /** Doğrudan altında tiklenmiş bir dal var mı. */
  bitmisCocukVar: boolean;
  bitenGizli: boolean;
  /** Haritada elle taşınmış kutu var mı; yoksa sıfırlama satırı çizilmiyor. */
  elleTasinmisVar: boolean;
  onClose: () => void;
  onAltDal: () => void;
  onKardes: () => void;
  onDuzenle: () => void;
  onAciklama: () => void;
  onTikle: () => void;
  onDaralt: () => void;
  onBiteniGizle: () => void;
  onYerlesimiSifirla: () => void;
  onSil: () => void;
}

export default function MindmapContextMenu({ x, y, kok, cocukVar, daraltilmis, bitti, bitmisCocukVar, bitenGizli, elleTasinmisVar, onClose, onAltDal, onKardes, onDuzenle, onAciklama, onTikle, onDaralt, onBiteniGizle, onYerlesimiSifirla, onSil }: Props) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);

  useBaglamMenusuKapat(onClose);

  const satir = "w-full px-4 py-2 text-start text-sm flex items-center gap-3 transition-colors";

  return (
    <MenuPortal>
      <div
        ref={menuRef}
        style={menuStyle}
        className="context-menu fixed z-50 w-56 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-xl"
      >
        <button onClick={onAltDal} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
          <Plus size={16} className="text-slate-400" />
          <span className="flex-1">{t('mindmap_add_child')}</span>
          <kbd className="text-[10px] font-bold text-slate-400">Tab</kbd>
        </button>

        {!kok && (
          <button onClick={onKardes} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
            <CornerDownRight size={16} className="text-slate-400" />
            <span className="flex-1">{t('mindmap_add_sibling')}</span>
            <kbd className="text-[10px] font-bold text-slate-400">Enter</kbd>
          </button>
        )}

        <button onClick={onDuzenle} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
          <Pencil size={16} className="text-slate-400" />
          <span className="flex-1">{t('mindmap_rename')}</span>
          <kbd className="text-[10px] font-bold text-slate-400">F2</kbd>
        </button>

        <button onClick={onAciklama} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
          <AlignLeft size={16} className="text-slate-400" />
          <span className="flex-1">{t('mindmap_description')}</span>
        </button>

        {!kok && (
          <button onClick={onTikle} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
            {bitti ? <CheckSquare size={16} className="text-slate-400" /> : <Square size={16} className="text-slate-400" />}
            <span className="flex-1">{bitti ? t('mindmap_mark_undone') : t('mindmap_mark_done')}</span>
          </button>
        )}

        {cocukVar && (
          <button onClick={onDaralt} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
            <Minus size={16} className="text-slate-400" />
            {daraltilmis ? t('mindmap_expand') : t('mindmap_collapse')}
          </button>
        )}

        {bitmisCocukVar && (
          <button onClick={onBiteniGizle} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
            {bitenGizli ? <Eye size={16} className="text-slate-400" /> : <EyeOff size={16} className="text-slate-400" />}
            <span className="flex-1">{bitenGizli ? t('mindmap_show_done') : t('mindmap_hide_done')}</span>
          </button>
        )}

        {elleTasinmisVar && (
          <button onClick={onYerlesimiSifirla} className={`${satir} text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
            <RotateCcw size={16} className="text-slate-400" />
            <span className="flex-1">{t('mindmap_reset_layout')}</span>
          </button>
        )}

        {!kok && (
          <>
            <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />
            <button onClick={onSil} className={`${satir} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`}>
              <Trash2 size={16} />
              <span className="flex-1">{t('mindmap_delete')}</span>
              <kbd className="text-[10px] font-bold text-slate-400">Del</kbd>
            </button>
          </>
        )}
      </div>
    </MenuPortal>
  );
}

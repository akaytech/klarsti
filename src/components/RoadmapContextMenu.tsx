import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, CornerDownRight, Heading, Minus, Pencil, Plus, PanelRight, Trash2, GitBranch } from 'lucide-react';
import clsx from 'clsx';
import { useClampedPosition } from '../utils/useClampedPosition';
import { MenuPortal } from '../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../utils/menuKapatma';
import { ROADMAP_DURUMLARI } from '../config/roadmapDurum';
import type { RoadmapDurum, RoadmapNodeData, RoadmapYon } from '../store/slices/createRoadmapSlice';

interface Props {
  x: number;
  y: number;
  veri: RoadmapNodeData;
  /** Hattaki tek durak silinemez; harita bütün bütün boşalırdı. */
  sonHatKutusu: boolean;
  ilkHatKutusu: boolean;
  cocukVar: boolean;
  yon: RoadmapYon;
  onClose: () => void;
  onDurum: (durum: RoadmapDurum) => void;
  onSonrakiDurak: () => void;
  onBolum: () => void;
  onYanKonu: () => void;
  onTasi: (yon: -1 | 1) => void;
  onDuzenle: () => void;
  onDetay: () => void;
  onSecmeli: () => void;
  onDaralt: () => void;
  onSil: () => void;
}

export default function RoadmapContextMenu({
  x, y, veri, sonHatKutusu, ilkHatKutusu, cocukVar, yon,
  onClose, onDurum, onSonrakiDurak, onBolum, onYanKonu, onTasi,
  onDuzenle, onDetay, onSecmeli, onDaralt, onSil
}: Props) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);

  useBaglamMenusuKapat(onClose);

  const satir = 'w-full px-4 py-2 text-start text-sm flex items-center gap-3 transition-colors';
  const sade = 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50';
  const hatta = veri.tur !== 'konu';
  const bolum = veri.tur === 'bolum';
  const dikey = yon === 'dikey';

  return (
    <MenuPortal>
      <div
        ref={menuRef}
        style={menuStyle}
        className="context-menu fixed z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        {/* Durum sırası menünün başında: en sık yapılan iş bu. */}
        {!bolum && (
          <>
            <div className="flex gap-1 px-2 py-1.5">
              {ROADMAP_DURUMLARI.map(({ durum, etiket, icon: Icon, metin, secili }) => {
                const acik = (veri.durum || 'bekliyor') === durum;
                return (
                  <button
                    key={durum}
                    onClick={() => onDurum(durum)}
                    title={t(etiket)}
                    aria-label={t(etiket)}
                    className={clsx(
                      'flex h-8 flex-1 items-center justify-center rounded-lg transition-colors',
                      acik ? secili : `${metin} hover:bg-slate-100 dark:hover:bg-slate-700/50`
                    )}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
            <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />
          </>
        )}

        {hatta && (
          <button onClick={onSonrakiDurak} className={`${satir} ${sade}`}>
            <Plus size={16} className="text-slate-400" />
            <span className="flex-1">{t('roadmap_add_step')}</span>
            <kbd className="text-[10px] font-bold text-slate-400">Enter</kbd>
          </button>
        )}

        {!bolum && (
          <button onClick={onYanKonu} className={`${satir} ${sade}`}>
            <CornerDownRight size={16} className="text-slate-400" />
            <span className="flex-1">{t('roadmap_add_topic')}</span>
            <kbd className="text-[10px] font-bold text-slate-400">Tab</kbd>
          </button>
        )}

        {hatta && (
          <button onClick={onBolum} className={`${satir} ${sade}`}>
            <Heading size={16} className="text-slate-400" />
            <span className="flex-1">{t('roadmap_add_section')}</span>
          </button>
        )}

        <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />

        <button onClick={onDuzenle} className={`${satir} ${sade}`}>
          <Pencil size={16} className="text-slate-400" />
          <span className="flex-1">{t('roadmap_rename')}</span>
          <kbd className="text-[10px] font-bold text-slate-400">F2</kbd>
        </button>

        <button onClick={onDetay} className={`${satir} ${sade}`}>
          <PanelRight size={16} className="text-slate-400" />
          <span className="flex-1">{t('roadmap_details')}</span>
        </button>

        {veri.tur === 'konu' && (
          <button onClick={onSecmeli} className={`${satir} ${sade}`}>
            <GitBranch size={16} className="text-slate-400" />
            <span className="flex-1">{veri.secmeli ? t('roadmap_make_required') : t('roadmap_make_optional')}</span>
          </button>
        )}

        {hatta && !ilkHatKutusu && (
          <button onClick={() => onTasi(-1)} className={`${satir} ${sade}`}>
            <ArrowUp size={16} className="text-slate-400" />
            <span className="flex-1">{t(dikey ? 'roadmap_move_up' : 'roadmap_move_back')}</span>
          </button>
        )}

        {hatta && !sonHatKutusu && (
          <button onClick={() => onTasi(1)} className={`${satir} ${sade}`}>
            <ArrowDown size={16} className="text-slate-400" />
            <span className="flex-1">{t(dikey ? 'roadmap_move_down' : 'roadmap_move_forward')}</span>
          </button>
        )}

        {cocukVar && (
          <button onClick={onDaralt} className={`${satir} ${sade}`}>
            <Minus size={16} className="text-slate-400" />
            <span className="flex-1">{veri.collapsed ? t('roadmap_expand') : t('roadmap_collapse')}</span>
          </button>
        )}

        {/* Hattaki son kutu silinmiyor: harita tamamen boşalırsa kullanıcının
            tutunacağı hiçbir kutu kalmıyor. */}
        {!(hatta && ilkHatKutusu && sonHatKutusu) && (
          <>
            <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />
            <button onClick={onSil} className={`${satir} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}>
              <Trash2 size={16} />
              <span className="flex-1">{t('delete')}</span>
              <kbd className="text-[10px] font-bold text-slate-400">Del</kbd>
            </button>
          </>
        )}
      </div>
    </MenuPortal>
  );
}

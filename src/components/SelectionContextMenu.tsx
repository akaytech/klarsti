import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Trash2, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import type { GoalStatus } from '../store/useRoadmapStore';
import { useClampedPosition } from '../utils/useClampedPosition';
import { MenuPortal } from '../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../utils/menuKapatma';

/**
 * Birden fazla kutu seçiliyken açılan menü.
 *
 * Üçüncü bir menü gerekti: sağ tık şimdiye kadar yalnızca "kutuya mı geldi,
 * boşluğa mı" diye bakıyordu. Toplu seçimin içindeki boşluğa tıklamak boş
 * kanvasa tıklamak sayılıyor ve kutu ekleme menüsü açılıyordu.
 *
 * Buradaki her işlem tek adım olarak kaydediliyor (bkz. WbsCanvas):
 * yedi kutunun durumu değiştirilip geri alındığında yedisi birden dönüyor.
 */
export default function SelectionContextMenu({
  x,
  y,
  sayi,
  onClose,
  onStatus,
  onExpand,
  onCollapse,
  onDelete,
}: {
  x: number;
  y: number;
  /** Kaç kutu seçili. Yanlışlıkla fazla seçim başlıkta görünsün diye. */
  sayi: number;
  onClose: () => void;
  onStatus: (status: GoalStatus) => void;
  onExpand: () => void;
  onCollapse: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);
  const ilkDugmeRef = useRef<HTMLButtonElement>(null);

  useBaglamMenusuKapat(onClose);

  // Diğer menülerdeki gibi: açılır açılmaz odak ilk seçeneğe geçsin.
  useEffect(() => {
    const zamanlayici = setTimeout(() => ilkDugmeRef.current?.focus(), 10);
    return () => clearTimeout(zamanlayici);
  }, []);

  const satir = 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors';

  return (
    <MenuPortal>
      <div
        ref={menuRef}
        role="menu"
        style={menuStyle}
        className="context-menu fixed z-50 w-60 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xl transition-all"
      >
        <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {/* `count` yerine kendi değişkenimiz: i18next `count` görünce çoğul
              kurallarına giriyor ve dile göre _one/_two/_few gibi ayrı
              anahtarlar arıyor. Arapçanın altı biçimi var; hepsini yazmak
              yerine sayı düz bir değer olarak geçiliyor. */}
          {t('bulk_selected_count', { adet: sayi, count: sayi })}
        </div>

        <div className="px-3 pb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t('change_status')}
        </div>

        <button
          ref={ilkDugmeRef}
          onClick={() => { onStatus('To Do'); onClose(); }}
          className={`${satir} hover:bg-slate-50 dark:hover:bg-slate-700`}
        >
          <CheckCircle size={18} className="text-slate-400 dark:text-slate-500" /> {t('todo_status')}
        </button>
        <button
          onClick={() => { onStatus('In Progress'); onClose(); }}
          className={`${satir} hover:bg-emerald-50 dark:hover:bg-emerald-900/30`}
        >
          <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" /> {t('in_progress_status')}
        </button>
        <button
          onClick={() => { onStatus('Done'); onClose(); }}
          className={`${satir} hover:bg-indigo-50 dark:hover:bg-indigo-900/30`}
        >
          <CheckCircle size={18} className="text-indigo-500 dark:text-indigo-400" /> {t('done_status')}
        </button>
        <button
          onClick={() => { onStatus('Failed'); onClose(); }}
          className={`${satir} hover:bg-red-50 dark:hover:bg-red-900/30`}
        >
          <XCircle size={18} className="text-red-500 dark:text-red-400" /> {t('failed_status')}
        </button>

        <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

        {/* Aç ve kapat ayrı iki seçenek, tek bir "ters çevir" değil: seçimdeki
            kutuların kimi açık kimi kapalıysa ters çevirmek karışık bir sonuç
            veriyor, kullanıcı hepsinin aynı hale gelmesini bekliyor. */}
        <button onClick={() => { onExpand(); onClose(); }} className={`${satir} hover:bg-slate-50 dark:hover:bg-slate-700`}>
          <ChevronsUpDown size={18} className="text-slate-400 dark:text-slate-500" /> {t('bulk_expand', { defaultValue: 'Expand children' })}
        </button>
        <button onClick={() => { onCollapse(); onClose(); }} className={`${satir} hover:bg-slate-50 dark:hover:bg-slate-700`}>
          <ChevronsDownUp size={18} className="text-slate-400 dark:text-slate-500" /> {t('bulk_collapse', { defaultValue: 'Collapse children' })}
        </button>

        <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

        <button
          onClick={() => { onDelete(); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          <Trash2 size={18} /> {t('bulk_delete', { defaultValue: 'Delete selected' })}
        </button>

        <div className="mt-2 text-center">
          <button onClick={onClose} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest">
            {t('close')}
          </button>
        </div>
      </div>
    </MenuPortal>
  );
}

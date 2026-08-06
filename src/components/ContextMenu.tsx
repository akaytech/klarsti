import { useCallback, useEffect, useRef, useState } from 'react';
import type { GoalNodeData, GoalNode } from '../store/useRoadmapStore';
import { Plus, Trash2, CheckCircle, Calendar, Type, FileText, XCircle, Search, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomTimeSelect from './CustomTimeSelect';
import { addOneHour } from '../utils/timeRange';
import { useKenardanIceriAl } from '../utils/useKenardanIceriAl';

type ContextMenuProps = {
  node: GoalNode;
  onClose: () => void;
  onAddSubGoal: () => void;
  onUpdate: (data: Partial<GoalNodeData>) => void;
  onOpenDescription: () => void;
  onDelete: () => void;
  onAnalyzeRootCause?: () => void;
  onAddToAgenda?: () => void;
};

export default function ContextMenu({
  node,
  onClose,
  onAddSubGoal,
  onUpdate,
  onOpenDescription,
  onDelete,
  onAnalyzeRootCause,
  onAddToAgenda,
}: ContextMenuProps) {
  const { t } = useTranslation();
  const hasDescription = !!node.data.description && node.data.description.trim().length > 0;

  const [labelValue, setLabelValue] = useState(node.data.label);
  const [dateValue, setDateValue] = useState(node.data.targetDate || '');
  const [timeValue, setTimeValue] = useState(node.data.targetTime || '');
  const [endTimeValue, setEndTimeValue] = useState(node.data.targetEndTime || '');

  // Menü açıkken düğümün verisi dışarıdan da değişebiliyor (uzak senkron,
  // ajandadan gelen tamamlanma). Eskiden bu etki yalnızca node.id'ye bağlıydı,
  // yani menü eski değeri göstermeye devam ediyor ve aşağıdaki kaydetme etkisi
  // onu geri yazabiliyordu. Artık dışarıdaki değişiklik izleniyor; ama sadece
  // KAYNAKTA değişen alan tazeleniyor, böylece kullanıcının yazmakta olduğu
  // metin ezilmiyor.
  const sonGorulen = useRef({
    id: node.id,
    label: node.data.label,
    targetDate: node.data.targetDate || '',
    targetTime: node.data.targetTime || '',
    targetEndTime: node.data.targetEndTime || ''
  });

  useEffect(() => {
    const gelen = {
      id: node.id,
      label: node.data.label,
      targetDate: node.data.targetDate || '',
      targetTime: node.data.targetTime || '',
      targetEndTime: node.data.targetEndTime || ''
    };
    const onceki = sonGorulen.current;
    sonGorulen.current = gelen;

    if (gelen.id !== onceki.id) {
      setLabelValue(gelen.label);
      setDateValue(gelen.targetDate);
      setTimeValue(gelen.targetTime);
      setEndTimeValue(gelen.targetEndTime);
      return;
    }

    if (gelen.label !== onceki.label) setLabelValue(gelen.label);
    if (gelen.targetDate !== onceki.targetDate) setDateValue(gelen.targetDate);
    if (gelen.targetTime !== onceki.targetTime) setTimeValue(gelen.targetTime);
    if (gelen.targetEndTime !== onceki.targetEndTime) setEndTimeValue(gelen.targetEndTime);
  }, [node.id, node.data.label, node.data.targetDate, node.data.targetTime, node.data.targetEndTime]);

  const handleLabelSave = () => {
    if (labelValue.trim() && labelValue.trim() !== node.data.label) {
      onUpdate({ label: labelValue.trim() });
    }
  };

  const handleStartTimeChange = (val: string) => {
    setTimeValue(val);
    // Başlangıç kaldırıldıysa bitiş tek başına anlamsız kalır.
    if (val === '') {
      setEndTimeValue('');
      return;
    }
    if (endTimeValue && endTimeValue <= val) {
      setEndTimeValue(addOneHour(val));
    }
  };

  // onUpdate çağıran taraftan çoğunlukla satır içi fonksiyon olarak geliyor,
  // yani her render'da kimliği değişiyor. Ref'te tutulursa handleDateSave'in
  // kimliği gereksiz yere değişmez ve aşağıdaki etki her render'da çalışmaz.
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const handleDateSave = useCallback(() => {
    const updates: Partial<GoalNodeData> = {};
    if (dateValue !== (node.data.targetDate || '')) updates.targetDate = dateValue;
    if (timeValue !== (node.data.targetTime || '')) updates.targetTime = timeValue;
    if (endTimeValue !== (node.data.targetEndTime || '')) updates.targetEndTime = endTimeValue;

    if (Object.keys(updates).length > 0) {
      onUpdateRef.current(updates);
    }
  }, [dateValue, timeValue, endTimeValue, node.data.targetDate, node.data.targetTime, node.data.targetEndTime]);

  useEffect(() => {
    handleDateSave();
  }, [handleDateSave]);

  // Kenardaki düğümlerde menü kanvasın dışına taşıyordu; ortak yardımcı
  // ölçüp içeri alıyor. (Yatayda taraf değişimini GoalNode yapıyor.)
  const menuRef = useRef<HTMLDivElement>(null);
  const { sarmalayiciStil, enFazlaBoy } = useKenardanIceriAl(menuRef);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.context-menu')) return;
      onClose();
    };
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKey);
    document.addEventListener('close-menus', onClose);

    const timer = setTimeout(() => {
      menuRef.current?.querySelector('input')?.focus();
    }, 10);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalKey);
      document.removeEventListener('close-menus', onClose);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={sarmalayiciStil}
    >
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{ maxHeight: enFazlaBoy }}
      className="context-menu nodrag nopan nowheel z-50 w-64 overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xl"
    >
      {/* İsim ve Tarih Düzenleme Alanları */}
      <div className="mb-2 space-y-2">
         <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2 border border-slate-100 dark:border-slate-700 transition-colors focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/10">
           <Type size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
           <input 
             type="text" 
             value={labelValue}
             onChange={(e) => setLabelValue(e.target.value)}
             onBlur={handleLabelSave}
             onKeyDown={(e) => { if (e.key === 'Enter') { handleLabelSave(); onClose(); } }}
             placeholder={t('goal_name')}
             className="w-full bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none placeholder:font-normal"
           />
         </div>
         
         <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2 border border-slate-100 dark:border-slate-700 transition-colors focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/10">
           <Calendar size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
           <input
             type="date"
             value={dateValue}
             onChange={(e) => setDateValue(e.target.value)}
             aria-label={t('goal_due_date')}
             className="w-full bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none"
           />
           {/* Tarayıcının kendi tarih kutusunda güvenilir bir temizleme yolu yok,
               bu yüzden ayrı düğme. Tarihsiz bir saat anlamsız kaldığından
               tarih silinince saatler de siliniyor. */}
           {(dateValue || timeValue || endTimeValue) && (
             <button
               type="button"
               onClick={() => {
                 setDateValue('');
                 setTimeValue('');
                 setEndTimeValue('');
               }}
               title={t('goal_clear_date')}
               aria-label={t('goal_clear_date')}
               className="shrink-0 rounded-lg p-0.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
             >
               <XCircle size={16} />
             </button>
           )}
         </div>

         <div className="flex items-center gap-2">
           <CustomTimeSelect
             value={timeValue}
             onChange={handleStartTimeChange}
             placeholder="09:00"
           />
           <span className="text-slate-400"><ArrowRight size={14} /></span>
           <CustomTimeSelect
             value={endTimeValue}
             onChange={setEndTimeValue}
             minTime={timeValue}
             placeholder="10:00"
           />
         </div>
      </div>

      <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

      <button
        onClick={() => { onOpenDescription(); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <FileText size={18} className={hasDescription ? "text-indigo-500" : ""} /> 
        {hasDescription ? t('read_edit_desc') : t('add_desc')}
      </button>

      {onAddToAgenda && (
        <button
          onClick={() => { onAddToAgenda(); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Calendar size={18} />
          {t('add_to_agenda', { defaultValue: 'Ajandaya Planla' })}
        </button>
      )}

      <button
        onClick={() => { onAddSubGoal(); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Plus size={18} /> {t('add_subgoal')}
      </button>
      
      <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />
      
      <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('change_status')}</div>
      
      <button
        onClick={() => { onUpdate({ status: 'To Do' }); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <CheckCircle size={18} className="text-slate-400 dark:text-slate-500" /> {t('todo_status')}
      </button>
      <button
        onClick={() => { onUpdate({ status: 'In Progress' }); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
      >
        <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" /> {t('in_progress_status')}
      </button>
      <button
        onClick={() => { onUpdate({ status: 'Done' }); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
      >
        <CheckCircle size={18} className="text-indigo-500 dark:text-indigo-400" /> {t('done_status')}
      </button>
      <button
        onClick={() => { onUpdate({ status: 'Failed' }); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
      >
        <XCircle size={18} className="text-red-500 dark:text-red-400" /> {t('failed_status')}
      </button>

      {node.data.status === 'Failed' && onAnalyzeRootCause && (
        <button
          onClick={() => { onAnalyzeRootCause(); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 mt-1 text-start text-sm font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
        >
          <Search size={18} className="text-orange-500 dark:text-orange-400" /> {t('analyze_root_cause')}
        </button>
      )}
      
      <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />
      
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        <Trash2 size={18} /> {t('delete_goal')}
      </button>
    </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useKenardanIceriAl } from '../utils/useKenardanIceriAl';

// Kırılım ağacı ve zihin haritası aynı açıklama kutusunu kullanıyor, o yüzden
// bileşen bir düğüm değil sadece metni alıyor.
type InlineDescriptionMenuProps = {
  description?: string;
  onClose: () => void;
  onSave: (text: string) => void;
};

export default function InlineDescriptionMenu({
  description,
  onClose,
  onSave,
}: InlineDescriptionMenuProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(description || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Bağlam menüsündeki gibi: kenardaki düğümlerde kanvasın dışına taşmasın.
  const sarmalayiciRef = useRef<HTMLDivElement>(null);
  const { sarmalayiciStil, enFazlaBoy } = useKenardanIceriAl(sarmalayiciRef);

  // En son kaydedilen değer. Aynı metni iki kez yazmayı önlüyor: hem alandan
  // çıkarken hem de pencere kapanırken kaydediliyor.
  const sonKaydedilen = useRef(description || '');
  // Kapanış temizliğinde okunacak güncel değerler. Temizlik yalnızca bir kez
  // bağlandığı için ilk render'ın kopyalarını görürdü.
  const metinRef = useRef(text);
  metinRef.current = text;
  const kaydetRef = useRef(onSave);
  kaydetRef.current = onSave;

  const kaydet = (deger: string) => {
    if (deger === sonKaydedilen.current) return;
    sonKaydedilen.current = deger;
    kaydetRef.current(deger);
  };

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, []);

  /**
   * Pencere hangi yolla kapanırsa kapansın yazılan kaydediliyor.
   *
   * Neden gerekli: yazı alanının `onBlur`u kanvasa tıklandığında çalışmıyor.
   * Kanvasın kaydırma mekanizması fare basışında `preventDefault` çağırıyor,
   * yani odak hiç değişmiyor; hemen ardından pencere kapatıldığı için alan
   * sökülüyor ve "çıkarken kaydet" adımı hiç gerçekleşmiyordu. Kullanıcının
   * yazdığı açıklama, sağ üstteki tike basmadıkça kayboluyordu.
   *
   * Escape de artık kaydediyor. Eskiden sessizce atıyordu; ekranda "vazgeç"
   * diye bir düğme olmadığı için bunu kimse bilerek kullanmıyordu ve iki
   * çıkış yolunun zıt anlama gelmesi tuzaktı.
   */
  useEffect(() => {
    return () => {
      if (metinRef.current === sonKaydedilen.current) return;
      sonKaydedilen.current = metinRef.current;
      kaydetRef.current(metinRef.current);
    };
  }, []);

  const handleSaveAndClose = () => {
    kaydet(text);
    onClose();
  };

  return (
    <div ref={sarmalayiciRef} style={sarmalayiciStil}>
    <div
      style={{ maxHeight: enFazlaBoy }}
      className="nodrag nopan nowheel w-72 overflow-y-auto custom-scrollbar rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xl flex flex-col cursor-auto"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('desc_task')}</span>
        <button 
          onClick={handleSaveAndClose}
          aria-label={t('desc_save', { defaultValue: 'Save description' })}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors"
        >
          <Check size={14} />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => kaydet(text)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        placeholder={t('desc_placeholder')}
        className="nodrag nopan nowheel w-full min-h-[280px] resize-none rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-colors focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10 custom-scrollbar"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      />
    </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useClampedPosition } from '../../utils/useClampedPosition';
import { MenuPortal } from '../../utils/MenuPortal';
import { useBaglamMenusuKapat } from '../../utils/menuKapatma';

/**
 * Çizginin menüsü: üstündeki yazı ve bağlantıyı sökme.
 *
 * Çizgiye çift tıklayınca ya da sağ tıklayınca açılıyor. Yazı serbest: karar
 * kutusundan çıkan dallara "Evet"/"Hayır" yazan da olur, "olur"/"olmaz",
 * "gider"/"gitmez" yazan da. Hazır seçenek konmuyor, kimse kendi diline
 * uymayan bir kelimeyi silmek zorunda kalmasın.
 */
interface DiagramEdgeMenuProps {
  x: number;
  y: number;
  /** Çizginin şu anki yazısı */
  label: string;
  onKaydet: (yazi: string) => void;
  onSil: () => void;
  onClose: () => void;
}

export default function DiagramEdgeMenu({ x, y, label, onKaydet, onSil, onClose }: DiagramEdgeMenuProps) {
  const { t } = useTranslation();
  const { ref: menuRef, style: menuStyle } = useClampedPosition(x, y);
  const [taslak, setTaslak] = useState(label);
  const girdiRef = useRef<HTMLInputElement>(null);

  useBaglamMenusuKapat(onClose);

  // Menü açılır açılmaz yazmaya başlanabiliyor; varolan yazı seçili geliyor ki
  // değiştirmek isteyen elle silmesin.
  useEffect(() => {
    girdiRef.current?.focus();
    girdiRef.current?.select();
  }, []);

  const kaydet = () => {
    onKaydet(taslak.trim());
    onClose();
  };

  return (
    <MenuPortal>
      <div
        ref={menuRef}
        className="context-menu fixed z-50 w-60 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl"
        style={menuStyle}
      >
        <div className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t('diagram_edge_label')}
        </div>

        <div className="flex items-center gap-1">
          <input
            ref={girdiRef}
            value={taslak}
            onChange={(e) => setTaslak(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                kaydet();
              }
            }}
            placeholder={t('diagram_edge_label_placeholder')}
            aria-label={t('diagram_edge_label')}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={kaydet}
            title={t('save')}
            aria-label={t('save')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700"
          >
            <Check size={16} />
          </button>
        </div>

        <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-700/50" />

        <button
          type="button"
          onClick={() => {
            onSil();
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} /> {t('diagram_edge_delete')}
        </button>
      </div>
    </MenuPortal>
  );
}

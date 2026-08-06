import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useDiagram } from './useDiagram';

// Tür seçim ekranı. İki yerde kullanılıyor: projede hiç şema yokken tam ekran,
// menüden "yeni şema" denince kanvasın üstünde kapatılabilir bir katman olarak.
export default function DiagramTypePicker({ kind, onKapat }: { kind: DiagramKind; onKapat?: () => void }) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const { charts, add } = useDiagram(kind);

  const sec = (id: string) => {
    const tur = k.getType(id);
    const bicim = k.getShape(tur.startShape);
    // "Yeni Başlangıç" yerine düpedüz "Başlangıç" daha doğal duruyor.
    const etiket = tur.startShape === 'start' ? t('flowchart_start') : t(bicim.newLabelKey);

    // Şema adı türün adıdır; aynısı varsa sonuna sayı gelir.
    const temelAd = t(tur.labelKey);
    let ad = temelAd;
    let sira = 2;
    while (charts.some((s) => s.name === ad)) ad = `${temelAd} ${sira++}`;

    add(id, ad, etiket);
    onKapat?.();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 p-6">
      <div className="relative w-full max-w-3xl py-10">
        {onKapat && (
          <button
            onClick={onKapat}
            aria-label={t('cancel')}
            className="absolute top-8 end-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2 pe-12">
          {t(k.text.typeTitle)}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {t(k.text.typeSubtitle)}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {k.types.map((tur) => {
            const Ikon = tur.icon;
            return (
              <button
                key={tur.id}
                onClick={() => sec(tur.id)}
                className={`group flex flex-col items-start rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 text-start transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${tur.cardClass}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100 ${tur.iconClass}`}>
                  <Ikon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-slate-100">{t(tur.labelKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t(tur.descKey)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

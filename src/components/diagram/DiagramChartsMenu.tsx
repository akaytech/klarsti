import { useTranslation } from 'react-i18next';
import type { DiagramChart } from '../../store/slices/diagramOps';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useDiagram } from './useDiagram';
import CalismaMenusu from '../CalismaMenusu';

// Kanvasın sol üstündeki şema menüsü: projedeki şemalar arasında geçiş,
// yeni şema, ad değiştirme, silme ve sıralama. Gövdesi CalismaMenusu'nda;
// buraya özel olan, her şemanın kendi tür simgesini taşıması ve türün
// menünün altında yazması.
export default function DiagramChartsMenu({ kind, aktif, onYeniSema }: { kind: DiagramKind; aktif: DiagramChart; onYeniSema: () => void }) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const { charts, setActive, rename, remove, moveTo } = useDiagram(kind);

  const tur = k.getType(aktif.type);
  const Ikon = tur.icon;

  return (
    <CalismaMenusu
      Simge={Ikon}
      aktifId={aktif.id}
      ogeler={charts.map((sema) => ({ id: sema.id, name: sema.name, Simge: k.getType(sema.type).icon }))}
      onSec={setActive}
      onEkle={onYeniSema}
      onYenidenAdlandir={rename}
      onSil={remove}
      onSirala={moveTo}
      altBolum={
        <>
          {/* Şemanın türü yalnızca GÖSTERİLİYOR, değiştirilemiyor.
              Buradan tür değiştirilebiliyordu ve bu bir tuzaktı: türler
              birbirinden farklı kutu şekilleri ve kuralları taşıyor, açılmış
              bir şemanın türünü değiştirmek çizilmiş işi başka bir yöntemin
              kalıbına zorluyordu. Başka bir tür isteyen yeni şema açar; tür
              seçimi orada, işe başlamadan önce yapılıyor. */}
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t(k.text.chartType)}
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Ikon size={16} className="shrink-0 text-slate-400" />
            {t(tur.labelKey)}
          </div>
          <p className="px-3 pb-2 pt-1 text-xs text-slate-400 dark:text-slate-500">
            {t(k.text.typeLockedHint)}
          </p>
          <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700" />
        </>
      }
      metinler={{
        baslik: t(k.text.charts),
        yeni: t(k.text.newChart),
        yenidenAdlandir: t(k.text.renameChart),
        ad: t(k.text.chartName),
        sil: t(k.text.deleteChart),
        silMesaji: k.text.deleteChartMsg
      }}
    />
  );
}

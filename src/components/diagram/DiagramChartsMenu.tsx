import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check } from 'lucide-react';
import type { DiagramChart } from '../../store/slices/diagramOps';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useDiagram } from './useDiagram';
import ConfirmModal from '../ConfirmModal';

// Kanvasın sol üstündeki şema menüsü: projedeki şemalar arasında geçiş,
// yeni şema, ad değiştirme, tür değiştirme ve silme.
export default function DiagramChartsMenu({ kind, aktif, onYeniSema }: { kind: DiagramKind; aktif: DiagramChart; onYeniSema: () => void }) {
  const { t } = useTranslation();
  const k = getDiagramKind(kind);
  const { charts, setActive, rename, remove, changeType } = useDiagram(kind);

  const [acik, setAcik] = useState(false);
  const [adDuzenleniyor, setAdDuzenleniyor] = useState(false);
  const [ad, setAd] = useState(aktif.name);
  const [silmeOnayi, setSilmeOnayi] = useState(false);
  const adRef = useRef<HTMLInputElement>(null);

  const tur = k.getType(aktif.type);
  const Ikon = tur.icon;

  useEffect(() => {
    const kapat = () => { setAcik(false); setAdDuzenleniyor(false); };
    document.addEventListener('close-menus', kapat);
    return () => document.removeEventListener('close-menus', kapat);
  }, []);

  useEffect(() => {
    setAd(aktif.name);
  }, [aktif.id, aktif.name]);

  useEffect(() => {
    if (adDuzenleniyor) adRef.current?.select();
  }, [adDuzenleniyor]);

  const adiKaydet = () => {
    const temiz = ad.trim();
    if (temiz && temiz !== aktif.name) rename(aktif.id, temiz);
    else setAd(aktif.name);
    setAdDuzenleniyor(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors max-w-[240px]"
      >
        <Ikon size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute top-12 start-0 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-2xl">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t(k.text.charts)}
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {charts.map((sema) => {
              const SemaIkon = k.getType(sema.type).icon;
              const secili = sema.id === aktif.id;
              return (
                <button
                  key={sema.id}
                  onClick={() => { setActive(sema.id); setAcik(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                    secili
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <SemaIkon size={16} className="shrink-0 text-slate-400" />
                  <span className="truncate flex-1">{sema.name}</span>
                  {secili && <Check size={14} className="shrink-0 text-indigo-500" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setAcik(false); onYeniSema(); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <Plus size={16} className="shrink-0" />
            {t(k.text.newChart)}
          </button>

          <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

          {/* Aşağısı yalnızca açık şema için */}
          {adDuzenleniyor ? (
            <div className="px-1 pb-1">
              <input
                ref={adRef}
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                onBlur={adiKaydet}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') adiKaydet();
                  if (e.key === 'Escape') { setAd(aktif.name); setAdDuzenleniyor(false); }
                }}
                aria-label={t(k.text.chartName)}
                className="w-full rounded-xl border border-indigo-300 dark:border-indigo-500 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          ) : (
            <button
              onClick={() => setAdDuzenleniyor(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Pencil size={16} className="shrink-0 text-slate-400" />
              {t(k.text.renameChart)}
            </button>
          )}

          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t(k.text.changeType)}
          </div>
          {k.types.map((secenek) => {
            const SecenekIkon = secenek.icon;
            const secili = secenek.id === aktif.type;
            return (
              <button
                key={secenek.id}
                onClick={() => {
                  if (!secili) changeType(aktif.id, secenek.id);
                  setAcik(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                  secili
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <SecenekIkon size={16} className="shrink-0 text-slate-400" />
                {t(secenek.labelKey)}
              </button>
            );
          })}
          <p className="px-3 pt-1 pb-2 text-xs text-slate-400 dark:text-slate-500">
            {t(k.text.changeTypeHint)}
          </p>

          <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700" />

          <button
            onClick={() => { setAcik(false); setSilmeOnayi(true); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={16} className="shrink-0" />
            {t(k.text.deleteChart)}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => { remove(aktif.id); setSilmeOnayi(false); }}
        title={t(k.text.deleteChart)}
        message={t(k.text.deleteChartMsg, { ad: aktif.name })}
      />
    </div>
  );
}

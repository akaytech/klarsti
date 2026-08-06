import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export interface AnalizOgesi {
  id: string;
  name: string;
  /** Listede sağda görünen küçük sayaç (kutu sayısı). */
  sayac?: number;
}

interface AnalysisMenuProps {
  Simge: LucideIcon;
  aktifId: string;
  ogeler: AnalizOgesi[];
  onSec: (id: string) => void;
  onEkle: () => void;
  onYenidenAdlandir: (id: string, ad: string) => void;
  onSil: (id: string) => void;
  metinler: {
    baslik: string;
    yeni: string;
    yenidenAdlandir: string;
    ad: string;
    sil: string;
    silMesaji: string;
  };
}

/**
 * Kanvasın sol üstündeki analiz menüsü: aynı projedeki analizler arasında
 * geçiş, yeni analiz, ad değiştirme ve silme.
 *
 * Zihin haritası ve değer akışı kendi menülerini taşıyor (birinde harita türü,
 * diğerinde gelecek durum kopyası gibi araca özel şeyler var). 5 Neden ile Hata
 * Ağacı'nın ihtiyacı ise birebir aynı olduğu için tek bileşende toplandı.
 */
export default function AnalysisMenu({ Simge, aktifId, ogeler, onSec, onEkle, onYenidenAdlandir, onSil, metinler }: AnalysisMenuProps) {
  const { t } = useTranslation();
  const aktif = ogeler.find((o) => o.id === aktifId);

  const [acik, setAcik] = useState(false);
  const [adDuzenleniyor, setAdDuzenleniyor] = useState(false);
  const [ad, setAd] = useState(aktif?.name ?? '');
  const [silmeOnayi, setSilmeOnayi] = useState(false);
  const adRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const kapat = () => { setAcik(false); setAdDuzenleniyor(false); };
    document.addEventListener('close-menus', kapat);
    return () => document.removeEventListener('close-menus', kapat);
  }, []);

  useEffect(() => { setAd(aktif?.name ?? ''); }, [aktif?.id, aktif?.name]);
  useEffect(() => { if (adDuzenleniyor) adRef.current?.select(); }, [adDuzenleniyor]);

  if (!aktif) return null;

  const adiKaydet = () => {
    const temiz = ad.trim();
    if (temiz && temiz !== aktif.name) onYenidenAdlandir(aktif.id, temiz);
    else setAd(aktif.name);
    setAdDuzenleniyor(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex max-w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <Simge size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute start-0 top-12 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{metinler.baslik}</div>

          <div className="custom-scrollbar max-h-48 overflow-y-auto">
            {ogeler.map((oge) => {
              const secili = oge.id === aktif.id;
              return (
                <button
                  key={oge.id}
                  onClick={() => { onSec(oge.id); setAcik(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                    secili
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Simge size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{oge.name}</span>
                  {oge.sayac !== undefined && <span className="shrink-0 text-[11px] font-bold text-slate-400">{oge.sayac}</span>}
                  {secili && <Check size={14} className="shrink-0 text-indigo-500" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { onEkle(); setAcik(false); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Plus size={16} className="shrink-0" />
            {metinler.yeni}
          </button>

          <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

          {adDuzenleniyor ? (
            <div className="px-1 pb-1">
              <input
                ref={adRef}
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                onBlur={adiKaydet}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') adiKaydet();
                  if (e.key === 'Escape') { setAd(aktif.name); setAdDuzenleniyor(false); }
                }}
                aria-label={metinler.ad}
                className="w-full rounded-xl border border-indigo-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none dark:border-indigo-500 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          ) : (
            <button
              onClick={() => setAdDuzenleniyor(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
            >
              <Pencil size={16} className="shrink-0 text-slate-400" />
              {metinler.yenidenAdlandir}
            </button>
          )}

          <button
            onClick={() => { setAcik(false); setSilmeOnayi(true); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="shrink-0" />
            {metinler.sil}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => { onSil(aktif.id); setSilmeOnayi(false); }}
        title={metinler.sil}
        message={t(metinler.silMesaji, { ad: aktif.name })}
      />
    </div>
  );
}

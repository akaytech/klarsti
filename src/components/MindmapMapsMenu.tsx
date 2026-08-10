import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check, Brain } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { Mindmap } from '../store/useRoadmapStore';
import ConfirmModal from './ConfirmModal';
import { useKapatmaYayini } from '../utils/menuKapatma';

// Kanvasın sol üstündeki harita menüsü: projedeki zihin haritaları arasında
// geçiş, yeni harita, ad değiştirme ve silme. Akış şemasındaki menünün
// eşi; orada bir de tür seçimi var, zihin haritasının türü yok.
export default function MindmapMapsMenu({ aktif }: { aktif: Mindmap }) {
  const { t } = useTranslation();
  const { mindmaps, setActiveMindmap, addMindmap, renameMindmap, deleteMindmap } = useRoadmapStore(useShallow((s) => ({
    mindmaps: s.mindmaps,
    setActiveMindmap: s.setActiveMindmap,
    addMindmap: s.addMindmap,
    renameMindmap: s.renameMindmap,
    deleteMindmap: s.deleteMindmap
  })));

  const [acik, setAcik] = useState(false);
  const [adDuzenleniyor, setAdDuzenleniyor] = useState(false);
  const [ad, setAd] = useState(aktif.name);
  const [silmeOnayi, setSilmeOnayi] = useState(false);
  const adRef = useRef<HTMLInputElement>(null);

  useKapatmaYayini(() => { setAcik(false); setAdDuzenleniyor(false); });

  useEffect(() => {
    setAd(aktif.name);
  }, [aktif.id, aktif.name]);

  useEffect(() => {
    if (adDuzenleniyor) adRef.current?.select();
  }, [adDuzenleniyor]);

  const adiKaydet = () => {
    const temiz = ad.trim();
    if (temiz && temiz !== aktif.name) renameMindmap(aktif.id, temiz);
    else setAd(aktif.name);
    setAdDuzenleniyor(false);
  };

  const yeniHarita = () => {
    // Adlar "Zihin Haritası 2", "Zihin Haritası 3"... diye ilerliyor.
    addMindmap(t('mindmap_map_name_n', { sira: mindmaps.length + 1 }), t('mindmap_root'));
    setAcik(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors max-w-[240px]"
      >
        <Brain size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute top-12 start-0 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-2xl">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('mindmap_maps')}
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {mindmaps.map((harita) => {
              const secili = harita.id === aktif.id;
              // Kök tek başına duruyorsa harita boştur; listede belli olsun.
              const dalSayisi = Math.max(0, harita.nodes.length - 1);
              return (
                <button
                  key={harita.id}
                  onClick={() => { setActiveMindmap(harita.id); setAcik(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                    secili
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Brain size={16} className="shrink-0 text-slate-400" />
                  <span className="truncate flex-1">{harita.name}</span>
                  <span className="shrink-0 text-[11px] font-bold text-slate-400">{dalSayisi}</span>
                  {secili && <Check size={14} className="shrink-0 text-indigo-500" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={yeniHarita}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <Plus size={16} className="shrink-0" />
            {t('mindmap_new_map')}
          </button>

          <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

          {/* Aşağısı yalnızca açık harita için */}
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
                aria-label={t('mindmap_map_name')}
                className="w-full rounded-xl border border-indigo-300 dark:border-indigo-500 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          ) : (
            <button
              onClick={() => setAdDuzenleniyor(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Pencil size={16} className="shrink-0 text-slate-400" />
              {t('mindmap_rename_map')}
            </button>
          )}

          <button
            onClick={() => { setAcik(false); setSilmeOnayi(true); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={16} className="shrink-0" />
            {t('mindmap_delete_map')}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => { deleteMindmap(aktif.id); setSilmeOnayi(false); }}
        title={t('mindmap_delete_map')}
        message={t('mindmap_delete_map_msg', { ad: aktif.name })}
      />
    </div>
  );
}

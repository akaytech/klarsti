import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check, Route } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { Roadmap } from '../store/slices/createRoadmapSlice';
import { roadmapIlerleme } from '../store/slices/createRoadmapSlice';
import ConfirmModal from './ConfirmModal';
import { useKapatmaYayini } from '../utils/menuKapatma';

/**
 * Kanvasın sol üstündeki harita menüsü: projedeki yol haritaları arasında
 * geçiş, yeni harita, ad değiştirme ve silme. Zihin haritasındaki menünün
 * eşi; farkı, listede her haritanın ilerleme yüzdesini göstermesi.
 */
export default function RoadmapMapsMenu({ aktif }: { aktif: Roadmap }) {
  const { t } = useTranslation();
  const { roadmaps, setActiveRoadmap, addRoadmap, renameRoadmap, deleteRoadmap } = useRoadmapStore(useShallow((s) => ({
    roadmaps: s.roadmaps,
    setActiveRoadmap: s.setActiveRoadmap,
    addRoadmap: s.addRoadmap,
    renameRoadmap: s.renameRoadmap,
    deleteRoadmap: s.deleteRoadmap
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
    if (temiz && temiz !== aktif.name) renameRoadmap(aktif.id, temiz);
    else setAd(aktif.name);
    setAdDuzenleniyor(false);
  };

  const yeniHarita = () => {
    addRoadmap(t('roadmap_map_name_n', { sira: roadmaps.length + 1 }), t('roadmap_first_step'));
    setAcik(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex max-w-[240px] items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <Route size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute top-12 start-0 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('roadmap_maps')}
          </div>

          <div className="custom-scrollbar max-h-48 overflow-y-auto">
            {roadmaps.map((harita) => {
              const secili = harita.id === aktif.id;
              const { yuzde } = roadmapIlerleme(harita.nodes);
              return (
                <button
                  key={harita.id}
                  onClick={() => { setActiveRoadmap(harita.id); setAcik(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                    secili
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Route size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{harita.name}</span>
                  <span className="shrink-0 text-[11px] font-bold text-slate-400">{t('roadmap_percent', { yuzde })}</span>
                  {secili && <Check size={14} className="shrink-0 text-lime-600" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={yeniHarita}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-lime-700 transition-colors hover:bg-lime-50 dark:text-lime-400 dark:hover:bg-lime-900/20"
          >
            <Plus size={16} className="shrink-0" />
            {t('roadmap_new_map')}
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
                aria-label={t('roadmap_map_name')}
                className="w-full rounded-xl border border-lime-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none dark:border-lime-500 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          ) : (
            <button
              onClick={() => setAdDuzenleniyor(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
            >
              <Pencil size={16} className="shrink-0 text-slate-400" />
              {t('roadmap_rename_map')}
            </button>
          )}

          <button
            onClick={() => { setAcik(false); setSilmeOnayi(true); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="shrink-0" />
            {t('roadmap_delete_map')}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => { deleteRoadmap(aktif.id); setSilmeOnayi(false); }}
        title={t('roadmap_delete_map')}
        message={t('roadmap_delete_map_msg', { ad: aktif.name })}
      />
    </div>
  );
}

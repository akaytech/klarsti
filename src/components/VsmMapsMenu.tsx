import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check, GitBranch, CopyPlus } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { VsmHarita } from '../store/useRoadmapStore';
import ConfirmModal from './ConfirmModal';
import { useKapatmaYayini } from '../utils/menuKapatma';

/**
 * Kanvasın sol üstündeki harita menüsü. Zihin haritasındakinin eşi; farkı,
 * haritanın bir türü olması (mevcut/gelecek durum) ve mevcut durumdan gelecek
 * durum kopyası çıkarma kısayolu. VSM'in asıl kullanımı bu ikili kıyas.
 */
export default function VsmMapsMenu({ aktif }: { aktif: VsmHarita }) {
  const { t } = useTranslation();
  const { vsmMaps, setActiveVsmMap, addVsmMap, renameVsmMap, deleteVsmMap, copyVsmMap } = useRoadmapStore(useShallow((s) => ({
    vsmMaps: s.vsmMaps,
    setActiveVsmMap: s.setActiveVsmMap,
    addVsmMap: s.addVsmMap,
    renameVsmMap: s.renameVsmMap,
    deleteVsmMap: s.deleteVsmMap,
    copyVsmMap: s.copyVsmMap,
  })));

  const [acik, setAcik] = useState(false);
  const [adDuzenleniyor, setAdDuzenleniyor] = useState(false);
  const [ad, setAd] = useState(aktif.name);
  const [silmeOnayi, setSilmeOnayi] = useState(false);
  const adRef = useRef<HTMLInputElement>(null);

  useKapatmaYayini(() => { setAcik(false); setAdDuzenleniyor(false); });

  useEffect(() => { setAd(aktif.name); }, [aktif.id, aktif.name]);
  useEffect(() => { if (adDuzenleniyor) adRef.current?.select(); }, [adDuzenleniyor]);

  const adiKaydet = () => {
    const temiz = ad.trim();
    if (temiz && temiz !== aktif.name) renameVsmMap(aktif.id, temiz);
    else setAd(aktif.name);
    setAdDuzenleniyor(false);
  };

  const turEtiketi = (tur: VsmHarita['tur']) => (tur === 'gelecek' ? t('vsm_state_future') : t('vsm_state_current'));

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex max-w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <GitBranch size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
          aktif.tur === 'gelecek'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        }`}>
          {turEtiketi(aktif.tur)}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute start-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('vsm_maps')}</div>

          <div className="custom-scrollbar max-h-48 overflow-y-auto">
            {vsmMaps.map((harita) => {
              const secili = harita.id === aktif.id;
              return (
                <button
                  key={harita.id}
                  onClick={() => { setActiveVsmMap(harita.id); setAcik(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold transition-colors ${
                    secili
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <GitBranch size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{harita.name}</span>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400">{turEtiketi(harita.tur)}</span>
                  {secili && <Check size={14} className="shrink-0 text-indigo-500" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { addVsmMap(t('vsm_map_name_n', { sira: vsmMaps.length + 1 }), 'mevcut'); setAcik(false); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Plus size={16} className="shrink-0" />
            {t('vsm_new_map')}
          </button>

          {/* İyileştirmenin başlangıcı: mevcut durumu kopyalayıp üstünde oyna. */}
          <button
            onClick={() => { copyVsmMap(aktif.id, t('vsm_future_of', { ad: aktif.name }), 'gelecek'); setAcik(false); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          >
            <CopyPlus size={16} className="shrink-0" />
            {t('vsm_copy_as_future')}
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
                aria-label={t('vsm_map_name')}
                className="w-full rounded-xl border border-indigo-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none dark:border-indigo-500 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          ) : (
            <button
              onClick={() => setAdDuzenleniyor(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
            >
              <Pencil size={16} className="shrink-0 text-slate-400" />
              {t('vsm_rename_map')}
            </button>
          )}

          <button
            onClick={() => { setAcik(false); setSilmeOnayi(true); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="shrink-0" />
            {t('vsm_delete_map')}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => { deleteVsmMap(aktif.id); setSilmeOnayi(false); }}
        title={t('vsm_delete_map')}
        message={t('vsm_delete_map_msg', { ad: aktif.name })}
      />
    </div>
  );
}

import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { IshikawaCategory } from '../store/useRoadmapStore';
import { Fish, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolHeader from './ToolHeader';
import ConfirmModal from './ConfirmModal';
import { useAnalizFormu } from '../utils/analizFormu';
import { OlusturSatiri, BosDurum, KayitBasligi, KalemKarti, KalemEkleSatiri } from './AnalizParcalari';

export default function IshikawaCanvas() {
  const { t } = useTranslation();

  const CATEGORIES: { id: IshikawaCategory; title: string; color: string; bg: string; border: string; buttonBg: string }[] = [
    { id: 'Manpower', title: t('manpower'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-900/50', buttonBg: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'Machine', title: t('machine'), color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-900/50', buttonBg: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'Material', title: t('material'), color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-900/50', buttonBg: 'bg-teal-500 hover:bg-teal-600' },
    { id: 'Method', title: t('method'), color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-900/50', buttonBg: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'Measurement', title: t('measurement'), color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-900/50', buttonBg: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'Milieu', title: t('milieu'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-900/50', buttonBg: 'bg-emerald-500 hover:bg-emerald-600' },
  ];

  const {  ishikawa, addIshikawa, updateIshikawaProblem, deleteIshikawa, addIshikawaItem, updateIshikawaItem, deleteIshikawaItem  } = useRoadmapStore(useShallow((state) => ({
      ishikawa: state.ishikawa,
      addIshikawa: state.addIshikawa,
      updateIshikawaProblem: state.updateIshikawaProblem,
      deleteIshikawa: state.deleteIshikawa,
      addIshikawaItem: state.addIshikawaItem,
      updateIshikawaItem: state.updateIshikawaItem,
      deleteIshikawaItem: state.deleteIshikawaItem
    })));
  const form = useAnalizFormu<IshikawaCategory>(addIshikawa, addIshikawaItem);

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
      <ToolHeader title={t('ishi_title')} subtitle={t('ishi_subtitle')} icon={<Fish />} iconColor="text-cyan-500" dividerOnTop={true} />

      <div className="flex-1 overflow-auto p-6 md:p-8 space-y-12">
        {/* Create Form */}
        <div className="mx-auto max-w-3xl">
          <OlusturSatiri
            deger={form.yeniAd}
            onDegisti={form.setYeniAd}
            onGonder={form.kayitGonder}
            ipucu={t('ishi_placeholder')}
            dugmeYazisi={t('start')}
            renk="cyan"
          />
        </div>

        {/* Analyses List */}
        <div className="mx-auto max-w-7xl space-y-16">
          {ishikawa.map((analysis) => (
            <div key={analysis.id} className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-10 shadow-xl">

              {/* Problem Head (The Fish Head) */}
              <KayitBasligi
                disSinif="mb-12 pb-8"
                simgeKutusu="h-16 w-16 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                simge={<Fish size={32} />}
                ad={analysis.problemStatement}
                onAdKaydet={(value) => updateIshikawaProblem(analysis.id, value)}
                adSinifi="text-3xl font-black"
                adEtiketi={t('ishi_problem_statement_label')}
                onSil={() => form.setSilinecekId(analysis.id)}
              />

              {/* 6M Grid (The Bones) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">

                {/* Central Spine visual element (visible on large screens) */}
                <div className="hidden lg:block absolute top-1/2 start-0 w-full h-2 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full z-0 opacity-50"></div>

                {CATEGORIES.map((cat) => {
                  const items = analysis.items.filter(i => i.category === cat.id);

                  return (
                    <div key={cat.id} className={`relative z-10 flex flex-col rounded-2xl border-2 ${cat.border} ${cat.bg} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-sm`}>
                      <div className="p-4 border-b border-white/20 dark:border-black/20 bg-white/40 dark:bg-black/20 flex justify-between items-center">
                        <h4 className={`font-bold ${cat.color}`}>{cat.title}</h4>
                      </div>

                      <div className="flex-1 p-4 space-y-3 min-h-[150px] max-h-[300px] overflow-y-auto">
                        {items.map(item => (
                          <KalemKarti
                            key={item.id}
                            sinif="gap-2 bg-white dark:bg-slate-800 p-3 border-slate-100 dark:border-slate-700"
                            basta={<ArrowRight size={14} className={`mt-1 shrink-0 ${cat.color} opacity-50`} />}
                            metin={item.text}
                            onKaydet={(value) => updateIshikawaItem(analysis.id, item.id, value)}
                            alanSinifi="text-slate-700 dark:text-slate-200 text-sm"
                            onSil={() => deleteIshikawaItem(analysis.id, item.id)}
                            silSinifi="transition-opacity"
                            silSimgesi={14}
                          />
                        ))}
                      </div>

                      <div className="p-3 bg-white/40 dark:bg-black/20 border-t border-white/20 dark:border-black/20">
                        <KalemEkleSatiri
                          deger={form.kalemMetni(analysis.id, cat.id)}
                          onDegisti={(deger) => form.kalemYaz(analysis.id, cat.id, deger)}
                          onGonder={(e) => form.kalemGonder(e, analysis.id, cat.id)}
                          ipucu={t('ishi_add_reason')}
                          girdiSinifi="rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5"
                          dugmeSinifi={`w-8 rounded-lg transition-colors ${cat.buttonBg}`}
                          artiBoyutu={16}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {ishikawa.length === 0 && (
            <BosDurum simge={<Fish size={18} className="shrink-0 opacity-40" />} metin={t('ishi_empty')} />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={form.silinecekId !== null}
        onClose={() => form.setSilinecekId(null)}
        onConfirm={() => { if (form.silinecekId) deleteIshikawa(form.silinecekId); }}
        title={t('delete_analysis_title')}
        message={t('delete_ishikawa_msg')}
      />
    </div>
  );
}

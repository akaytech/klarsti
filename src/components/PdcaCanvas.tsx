import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { PdcaPhase } from '../store/useRoadmapStore';
import { RefreshCcw, CheckCircle2, Circle, Target, Activity, Search, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ToolHeader from './ToolHeader';
import ConfirmModal from './ConfirmModal';
import { useAnalizFormu } from '../utils/analizFormu';
import { OlusturSatiri, BosDurum, KayitBasligi, KalemKarti, KalemEkleSatiri, EKLE_DUGMESI } from './AnalizParcalari';

export default function PdcaCanvas() {
  const { t } = useTranslation();

  const PHASES: { id: PdcaPhase; title: string; icon: LucideIcon; color: string; bg: string; border: string; desc: string; buttonBg: string }[] = [
    { id: 'Plan', title: t('plan'), icon: Target, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-900/50', desc: t('plan_desc'), buttonBg: 'bg-indigo-600 hover:bg-indigo-700' },
    { id: 'Do', title: t('do'), icon: Activity, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-900/50', desc: t('do_desc'), buttonBg: 'bg-rose-600 hover:bg-rose-700' },
    { id: 'Check', title: t('check'), icon: Search, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-900/50', desc: t('check_desc'), buttonBg: 'bg-amber-600 hover:bg-amber-700' },
    { id: 'Act', title: t('act'), icon: Settings, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-900/50', desc: t('act_desc'), buttonBg: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  const {  pdca, addPdcaCycle, updatePdcaGoal, deletePdcaCycle, addPdcaItem, updatePdcaItem, deletePdcaItem, togglePdcaItemStatus  } = useRoadmapStore(useShallow((state) => ({
      pdca: state.pdca,
      addPdcaCycle: state.addPdcaCycle,
      updatePdcaGoal: state.updatePdcaGoal,
      deletePdcaCycle: state.deletePdcaCycle,
      addPdcaItem: state.addPdcaItem,
      updatePdcaItem: state.updatePdcaItem,
      deletePdcaItem: state.deletePdcaItem,
      togglePdcaItemStatus: state.togglePdcaItemStatus
    })));
  const form = useAnalizFormu<PdcaPhase>(addPdcaCycle, addPdcaItem);

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
      <ToolHeader title={t('pdca_title')} subtitle={t('pdca_subtitle')} icon={<RefreshCcw />} iconColor="text-indigo-500" dividerOnTop={true} />

      <div className="flex-1 overflow-auto p-6 md:p-8 space-y-12">
        <div className="mx-auto max-w-3xl">
          <OlusturSatiri
            deger={form.yeniAd}
            onDegisti={form.setYeniAd}
            onGonder={form.kayitGonder}
            ipucu={t('pdca_placeholder')}
            dugmeYazisi={t('start')}
            renk="indigo"
          />
        </div>

        <div className="mx-auto max-w-6xl space-y-16">
          {pdca.map((cycle) => (
            <div key={cycle.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-xl">

              <KayitBasligi
                disSinif="mb-8 pb-6"
                simgeKutusu="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                simge={<RefreshCcw size={24} />}
                ad={cycle.goal}
                onAdKaydet={(value) => updatePdcaGoal(cycle.id, value)}
                adSinifi="text-2xl font-bold"
                adEtiketi={t('pdca_goal_label')}
                onSil={() => form.setSilinecekId(cycle.id)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {PHASES.map((phase) => {
                  const items = cycle.items.filter(i => i.phase === phase.id);

                  return (
                    <div key={phase.id} className={`flex flex-col rounded-2xl border-2 ${phase.border} ${phase.bg} shadow-sm overflow-hidden`}>
                      <div className="p-4 flex flex-col border-b border-white/20 dark:border-black/20 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                        <h4 className={`text-lg font-bold ${phase.color}`}>{phase.title}</h4>
                        <span className={`text-xs opacity-70 ${phase.color}`}>{phase.desc}</span>
                      </div>

                      <div className="flex-1 p-4 space-y-3 min-h-[200px] max-h-[350px] overflow-y-auto">
                        {items.map(item => (
                          <KalemKarti
                            key={item.id}
                            sinif="gap-3 bg-white dark:bg-slate-800 p-3 border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                            basta={
                              <button
                                onClick={() => togglePdcaItemStatus(cycle.id, item.id)}
                                className={clsx(
                                  "mt-1 shrink-0 transition-colors",
                                  item.status === 'completed' ? "text-emerald-500" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                                )}
                              >
                                {item.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                              </button>
                            }
                            metin={item.text}
                            onKaydet={(value) => updatePdcaItem(cycle.id, item.id, value)}
                            alanSinifi={clsx(
                              "text-sm transition-all",
                              item.status === 'completed' ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
                            )}
                            onSil={() => deletePdcaItem(cycle.id, item.id)}
                            silSinifi="transition-opacity bg-white dark:bg-slate-800 shadow-sm"
                            silSimgesi={14}
                          />
                        ))}
                      </div>

                      <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-white/20 dark:border-black/20">
                        <KalemEkleSatiri
                          deger={form.kalemMetni(cycle.id, phase.id)}
                          onDegisti={(deger) => form.kalemYaz(cycle.id, phase.id, deger)}
                          onGonder={(e) => form.kalemGonder(e, cycle.id, phase.id)}
                          ipucu={t('pdca_add_item')}
                          girdiSinifi="rounded-xl bg-white dark:bg-slate-800 px-4 py-2"
                          dugmeSinifi={`${EKLE_DUGMESI} ${phase.buttonBg}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {pdca.length === 0 && (
            <BosDurum simge={<RefreshCcw size={18} className="shrink-0 opacity-40" />} metin={t('pdca_empty')} />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={form.silinecekId !== null}
        onClose={() => form.setSilinecekId(null)}
        onConfirm={() => { if (form.silinecekId) deletePdcaCycle(form.silinecekId); }}
        title={t('delete_pdca_title')}
        message={t('delete_pdca_msg')}
      />
    </div>
  );
}

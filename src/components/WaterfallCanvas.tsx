import { useState } from 'react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { WaterfallPhase } from '../store/useRoadmapStore';
import { ArrowDownRight, Layers, BookOpen, PenTool, Code, CheckSquare, Shield, Lock, CheckCircle2, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ToolHeader from './ToolHeader';
import ConfirmModal from './ConfirmModal';
import { useAnalizFormu } from '../utils/analizFormu';
import { OlusturSatiri, BosDurum, KayitBasligi, KalemKarti, KalemEkleSatiri, EKLE_DUGMESI } from './AnalizParcalari';

export default function WaterfallCanvas() {
  const { t } = useTranslation();

  const PHASES: { id: WaterfallPhase; title: string; icon: LucideIcon; color: string; bg: string; border: string; buttonBg: string; desc: string; indent: string }[] = [
    { id: 'Requirements', title: t('req'), icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-900/50', buttonBg: 'bg-indigo-600 hover:bg-indigo-700', desc: t('req_desc'), indent: 'ms-0' },
    { id: 'High-Level Design', title: t('wf_hld'), icon: PenTool, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-900/50', buttonBg: 'bg-purple-600 hover:bg-purple-700', desc: t('wf_hld_desc'), indent: 'ms-0 md:ms-12' },
    { id: 'Low-Level Design', title: t('wf_lld'), icon: Server, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-900/50', buttonBg: 'bg-cyan-600 hover:bg-cyan-700', desc: t('wf_lld_desc'), indent: 'ms-0 md:ms-24' },
    { id: 'Implementation', title: t('imp'), icon: Code, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-900/50', buttonBg: 'bg-blue-600 hover:bg-blue-700', desc: t('imp_desc'), indent: 'ms-0 md:ms-36' },
    { id: 'Verification', title: t('ver'), icon: CheckSquare, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-900/50', buttonBg: 'bg-amber-600 hover:bg-amber-700', desc: t('ver_desc'), indent: 'ms-0 md:ms-48' },
    { id: 'Maintenance', title: t('mai'), icon: Shield, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-900/50', buttonBg: 'bg-emerald-600 hover:bg-emerald-700', desc: t('mai_desc'), indent: 'ms-0 md:ms-60' },
  ];

  const {  waterfall, addWaterfallProject, updateWaterfallProjectName, deleteWaterfallProject, addWaterfallItem, updateWaterfallItem, deleteWaterfallItem, advanceWaterfallPhase  } = useRoadmapStore(useShallow((state) => ({
      waterfall: state.waterfall,
      addWaterfallProject: state.addWaterfallProject,
      updateWaterfallProjectName: state.updateWaterfallProjectName,
      deleteWaterfallProject: state.deleteWaterfallProject,
      addWaterfallItem: state.addWaterfallItem,
      updateWaterfallItem: state.updateWaterfallItem,
      deleteWaterfallItem: state.deleteWaterfallItem,
      advanceWaterfallPhase: state.advanceWaterfallPhase
    })));
  const form = useAnalizFormu<WaterfallPhase>(addWaterfallProject, addWaterfallItem);
  // Şelaleye özgü: aşama tamamlama onayı. Diğer üç araçta karşılığı yok.
  const [advanceTargetId, setAdvanceTargetId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
      <ToolHeader title={t('wf_title')} subtitle={t('wf_subtitle')} icon={<Layers />} iconColor="text-blue-500" dividerOnTop={true} />

      <div className="flex-1 overflow-auto p-6 md:p-8 space-y-12">
        <div className="mx-auto max-w-4xl">
          <OlusturSatiri
            deger={form.yeniAd}
            onDegisti={form.setYeniAd}
            onGonder={form.kayitGonder}
            ipucu={t('wf_placeholder')}
            dugmeYazisi={t('start')}
            renk="blue"
          />
        </div>

        <div className="mx-auto max-w-5xl space-y-16">
          {waterfall.map((project) => (
            <div key={project.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-10 shadow-xl relative overflow-hidden">

              <KayitBasligi
                disSinif="mb-12 pb-6 relative z-10"
                simgeKutusu="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                simge={<Layers size={28} />}
                ad={project.name}
                onAdKaydet={(value) => updateWaterfallProjectName(project.id, value)}
                adSinifi="text-3xl font-black"
                adEtiketi={t('project_name')}
                onSil={() => form.setSilinecekId(project.id)}
              />

              <div className="space-y-6 relative z-10 pb-10">
                {PHASES.map((phase, index) => {
                  // Array.isArray şart: 'items' alanı okuma sırasında bir
                  // dönüştürücü tarafından hep diziye çevriliyordu, o kod
                  // silindi (bkz. useRoadmapStore parseDoc). Bozuk tek bir
                  // kayıt bütün ekranı çökertmesin.
                  const items = (Array.isArray(project.items) ? project.items : [])
                    .filter(i => i.phase === phase.id);
                  const isCompleted = index < (project.currentPhaseIndex ?? 0);
                  const isLocked = index > (project.currentPhaseIndex ?? 0);
                  const isActive = index === (project.currentPhaseIndex ?? 0);

                  return (
                    <div key={phase.id} className={clsx("flex flex-col relative", phase.indent)}>

                      {/* Connection Line to next phase */}
                      {index < PHASES.length - 1 && (
                        <div className="hidden md:block absolute start-8 top-full h-12 w-12 border-s-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-es-3xl -z-10 translate-y-[-10px]">
                           <ArrowDownRight size={24} className="absolute -bottom-3 -end-3 text-slate-300 dark:text-slate-700 rtl:-scale-x-100" />
                        </div>
                      )}

                      <div className={clsx(
                        "flex flex-col rounded-2xl border-2 shadow-md overflow-hidden w-full md:w-[600px] bg-opacity-90 backdrop-blur-sm transition-all duration-300",
                        phase.border, phase.bg,
                        isLocked && "opacity-50 grayscale"
                      )}>
                        <div className="p-5 flex items-center justify-between border-b border-white/20 dark:border-black/20 bg-white/60 dark:bg-black/30">
                          <div className="flex flex-col">
                            <h4 className={`text-xl font-black ${phase.color} flex items-center gap-2`}>
                              <phase.icon size={24} />
                              {phase.title}
                            </h4>
                            <span className={`text-sm opacity-80 mt-1 ${phase.color}`}>{phase.desc}</span>
                          </div>
                          {isCompleted && <CheckCircle2 size={24} className="text-emerald-500" />}
                          {isLocked && <Lock size={24} className="text-slate-400" />}
                        </div>

                        <div className="p-4 space-y-3">
                          {isLocked ? (
                            <div className="flex flex-col items-center justify-center p-6 text-slate-500 text-sm font-medium">
                              <Lock size={32} className="mb-2 opacity-50" />
                              {t('wf_phase_locked')}
                            </div>
                          ) : (
                            <>
                              {items.map(item => (
                                <KalemKarti
                                  key={item.id}
                                  sinif={clsx(
                                    "gap-3 p-4 transition-shadow",
                                    isCompleted
                                      ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md"
                                  )}
                                  metin={item.text}
                                  onKaydet={(value) => updateWaterfallItem(project.id, item.id, value)}
                                  alanKapali={isCompleted}
                                  alanSinifi="text-slate-700 dark:text-slate-200 disabled:opacity-80"
                                  onSil={isCompleted ? undefined : () => deleteWaterfallItem(project.id, item.id)}
                                  silSinifi="transition-opacity bg-white dark:bg-slate-800 shadow-sm"
                                />
                              ))}

                              {!isCompleted && (
                                <KalemEkleSatiri
                                  deger={form.kalemMetni(project.id, phase.id)}
                                  onDegisti={(deger) => form.kalemYaz(project.id, phase.id, deger)}
                                  onGonder={(e) => form.kalemGonder(e, project.id, phase.id)}
                                  ipucu={t('pdca_add_item')}
                                  formSinifi="mt-2"
                                  girdiSinifi="rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2"
                                  dugmeSinifi={`${EKLE_DUGMESI} ${phase.buttonBg}`}
                                />
                              )}

                              {isActive && index < PHASES.length - 1 && (
                                <div className="pt-4 mt-4 border-t border-white/20 dark:border-black/20">
                                  <button
                                    onClick={() => setAdvanceTargetId(project.id)}
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95"
                                  >
                                    <CheckSquare size={20} />
                                    {t('wf_complete_phase')}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {waterfall.length === 0 && (
            <BosDurum simge={<Layers size={18} className="shrink-0 opacity-40" />} metin={t('wf_empty')} />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={form.silinecekId !== null}
        onClose={() => form.setSilinecekId(null)}
        onConfirm={() => { if (form.silinecekId) deleteWaterfallProject(form.silinecekId); }}
        title={t('delete_waterfall_title')}
        message={t('delete_waterfall_msg')}
      />

      <ConfirmModal
        isOpen={advanceTargetId !== null}
        onClose={() => setAdvanceTargetId(null)}
        onConfirm={() => { if (advanceTargetId) advanceWaterfallPhase(advanceTargetId); }}
        title={t('wf_advance_confirm_title')}
        message={t('wf_advance_confirm_msg')}
        confirmText={t('wf_complete_phase')}
      />
    </div>
  );
}

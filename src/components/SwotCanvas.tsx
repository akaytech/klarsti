import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { SwotType, SwotItem, SwotAnalysis } from '../store/useRoadmapStore';
import { Trash2, Shield, Target, Zap, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolHeader from './ToolHeader';
import ConfirmModal from './ConfirmModal';
import DebouncedField from './DebouncedField';
import { useAnalizFormu } from '../utils/analizFormu';
import { OlusturSatiri, BosDurum, KalemKarti, KalemEkleSatiri, EKLE_DUGMESI } from './AnalizParcalari';

export default function SwotCanvas() {
  const { t } = useTranslation();

  const QUADRANTS: { type: SwotType; title: string; color: string; icon: LucideIcon; bg: string; border: string; dugmeBg: string }[] = [
    { type: 'S', title: t('swot_s'), color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-900/50', icon: Shield, dugmeBg: 'bg-indigo-500' },
    { type: 'W', title: t('swot_w'), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-900/50', icon: AlertTriangle, dugmeBg: 'bg-rose-500' },
    { type: 'O', title: t('swot_o'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-900/50', icon: Zap, dugmeBg: 'bg-emerald-500' },
    { type: 'T', title: t('swot_t'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-900/50', icon: Target, dugmeBg: 'bg-amber-500' },
  ];

  const {  swot, addSwot, updateSwotTitle, deleteSwot, addSwotItem, updateSwotItem, deleteSwotItem  } = useRoadmapStore(useShallow((state) => ({
      swot: state.swot,
      addSwot: state.addSwot,
      updateSwotTitle: state.updateSwotTitle,
      deleteSwot: state.deleteSwot,
      addSwotItem: state.addSwotItem,
      updateSwotItem: state.updateSwotItem,
      deleteSwotItem: state.deleteSwotItem
    })));
  const form = useAnalizFormu<SwotType>(addSwot, addSwotItem);

  /**
   * Örnek şablonu yükler. Eskiden bu kod, boş ekranda duran ayrı bir kartın
   * içindeydi; kart oluşturma satırıyla aynı şeyi soruyor ve iki yerden iki
   * ayrı çağrı yapıyordu. Kart kalktı, iş buraya taşındı.
   *
   * `addSwot` kimliği kendi üretiyor ve geri döndürmüyor; maddeleri eklemek
   * için depodaki en yeni analizi okumak gerekiyor, o yüzden kısa bir
   * beklemeyle devam ediliyor.
   */
  const ornekYukle = () => {
    useRoadmapStore.getState().addSwot(t('swot_example_title'));
    setTimeout(() => {
      const sonSwot = useRoadmapStore.getState().swot[0];
      if (!sonSwot) return;
      const { addSwotItem } = useRoadmapStore.getState();
      const maddeler: Array<['S' | 'W' | 'O' | 'T', string]> = [
        ['S', 'swot_example_s1'], ['S', 'swot_example_s2'],
        ['W', 'swot_example_w1'], ['W', 'swot_example_w2'],
        ['O', 'swot_example_o1'], ['O', 'swot_example_o2'],
        ['T', 'swot_example_t1'], ['T', 'swot_example_t2']
      ];
      for (const [tur, anahtar] of maddeler) addSwotItem(sonSwot.id, tur, t(anahtar));
    }, 50);
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
      <ToolHeader title={t('tool_swot')} subtitle={t('swot_subtitle')} icon={<Target />} iconColor="text-amber-500" dividerOnTop={true} />

      <div className="flex-1 overflow-auto p-6 md:p-8 space-y-12">
        {/* Create Form */}
        <div className="mx-auto max-w-3xl">
          <OlusturSatiri
            deger={form.yeniAd}
            onDegisti={form.setYeniAd}
            onGonder={form.kayitGonder}
            ipucu={t('swot_name_placeholder')}
            dugmeYazisi={t('btn_create')}
            renk="indigo"
          />
          {/* Örnek şablon burada, oluşturma satırının hemen altında. Eskiden
              sayfanın altında ayrı bir kartın içindeydi ve aynı soruyu ikinci
              kez soruyordu. Yalnız hiç analiz yokken görünüyor. */}
          {swot.length === 0 && (
            <button
              onClick={ornekYukle}
              className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Zap size={15} />
              {t('load_example')}
            </button>
          )}
        </div>

        <div className="mx-auto max-w-7xl space-y-16">
        {swot.map((analysis: SwotAnalysis) => {
          const safeItems = analysis.items;
          const safeTitle = analysis.title;
          const safeId = analysis.id;

          return (
          <div key={safeId} className="mx-auto max-w-6xl flex flex-col gap-6">
            {/* Başlık burada ortak KayitBasligi'nı kullanmıyor: kılçık/PUKÖ/
                şelalenin aksine simgesiz, ince ve sil düğmesi yazısız. */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <DebouncedField
                initialValue={safeTitle}
                onCommit={(value) => updateSwotTitle(safeId, value)}
                className="text-xl font-bold bg-transparent outline-none border-none text-slate-800 dark:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 px-2 py-1 rounded-lg transition-colors flex-1 me-4"
                ariaLabel={t('analysis_title_label')}
              />
              <button
                onClick={() => form.setSilinecekId(safeId)}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                title={t('delete')} aria-label={t('delete')}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[500px]">
              {QUADRANTS.map((quadrant) => {
                const Icon = quadrant.icon;
                const items = safeItems.filter((item) => item.type === quadrant.type);

                return (
                  <div key={quadrant.type} className={`flex flex-col rounded-3xl border-2 ${quadrant.border} ${quadrant.bg} shadow-sm overflow-hidden`}>
                    <div className="p-4 flex items-center gap-3 border-b border-white/20 dark:border-black/20 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                      <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${quadrant.color}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className={`text-lg font-bold ${quadrant.color}`}>{quadrant.title}</h3>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[150px]">
                      {items.map((item: SwotItem) => (
                        <KalemKarti
                          key={item.id}
                          sinif="gap-3 bg-white dark:bg-slate-800 p-4 border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                          metin={item.text}
                          onKaydet={(value) => updateSwotItem(safeId, item.id, value)}
                          alanSinifi="text-slate-700 dark:text-slate-200 text-sm"
                          onSil={() => deleteSwotItem(safeId, item.id)}
                          silSinifi="hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                        />
                      ))}
                      {items.length === 0 && (
                        <div className="flex h-32 items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium opacity-50">
                          {t('swot_empty')}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-white/20 dark:border-black/20">
                      <KalemEkleSatiri
                        deger={form.kalemMetni(safeId, quadrant.type)}
                        onDegisti={(deger) => form.kalemYaz(safeId, quadrant.type, deger)}
                        onGonder={(e) => form.kalemGonder(e, safeId, quadrant.type)}
                        ipucu={t('swot_add')}
                        girdiSinifi="rounded-xl bg-white dark:bg-slate-800 px-4 py-2 dark:focus:border-slate-500"
                        dugmeSinifi={`${EKLE_DUGMESI} ${quadrant.dugmeBg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )})}
        </div>

        {/* Boş durum tek satır. Eskiden 64 piksellik simge, iki kat boşluk ve
            altında ayrı bir kart vardı; toplamı 500 pikseli aşıyor ve ekranı
            oluşturma satırından uzaklaştırıyordu. */}
        {swot.length === 0 && (
          <BosDurum simge={<Target size={18} className="shrink-0 opacity-40" />} metin={t('swot_no_analysis')} />
        )}
      </div>

      <ConfirmModal
        isOpen={form.silinecekId !== null}
        onClose={() => form.setSilinecekId(null)}
        onConfirm={() => { if (form.silinecekId) deleteSwot(form.silinecekId); }}
        title={t('delete_analysis_title')}
        message={t('delete_swot_msg')}
      />
    </div>
  );
}

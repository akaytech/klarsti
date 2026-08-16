import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import {
  CalendarRange, ChevronDown, ChevronRight, Diamond, Indent, Outdent,
  Link2, Plus, Trash2, X
} from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import type { GanttDurum, GanttGorev } from '../store/slices/createGanttSlice';
import { ozetHesapla, siraliGorevler, ustGorevMu } from '../store/slices/createGanttSlice';
import {
  araligiHesapla, ayEtiketi, ayinIlkiMi, bugununMetni, gunEkle, gunEtiketi,
  gunFarki, gunSayisi, haftaBasiMi, haftaSonuMu, tariheCevir
} from '../utils/ganttTarih';
import AnalysisMenu from './AnalysisMenu';
import CanvasKarsilama from './CanvasKarsilama';
import ConfirmModal from './ConfirmModal';

/**
 * Zaman çizelgesi (Gantt).
 *
 * Ekran tek bir kaydırma alanı: solda görev sütunları, sağda takvim. İkisi
 * ayrı ayrı kaydırılmıyor — sol sütunlar `sticky` ile yerinde duruyor, başlık
 * şeridi de öyle. Ayrı kaydırıcılarla kurulsaydı satırların hizası tarayıcıdan
 * tarayıcıya kayardı.
 *
 * Genişlik gün başına piksel üzerinden hesaplanıyor (GUN_GENISLIK). Çubuğun
 * yeri = (görev başlangıcı − takvim başlangıcı) × gün genişliği. Sürükleme de
 * aynı hesabın tersi: kaç piksel gittiyse o kadar güne çevriliyor, yani çubuk
 * her zaman tam güne oturuyor.
 */

type Yakinlik = 'gun' | 'hafta' | 'ay';

/** Gün başına piksel. Ay görünümünde bir gün 4 piksel: bir yıl ~1500 piksel. */
const GUN_GENISLIK: Record<Yakinlik, number> = { gun: 30, hafta: 11, ay: 4 };
const SATIR_YUKSEKLIK = 38;
const BASLIK_YUKSEKLIK = 52;

/**
 * Çubuğun zemini, dolgusu ve çerçevesi.
 *
 * Koyu temada zemin için önce rengin 900 tonu, sonra soluk hali denendi;
 * ikisi de turuncuda kahverengi çıkıyor ve çubuk kirli duruyordu. Zemin artık
 * nötr gri: "bu kadarı daha yapılmadı" demek. Durum bilgisi çerçevede duruyor,
 * böylece ilerlemesi sıfır olan bir işin de bekliyor mu riskli mi olduğu
 * çubuğa bakınca anlaşılıyor.
 */
const DURUM_STILI: Record<GanttDurum, { cubuk: string; cerceve: string; ilerleme: string; nokta: string }> = {
  bekliyor: { cubuk: 'bg-slate-200 dark:bg-slate-700', cerceve: 'ring-slate-400/60', ilerleme: 'bg-slate-400', nokta: 'bg-slate-400' },
  devam: { cubuk: 'bg-slate-200 dark:bg-slate-700', cerceve: 'ring-amber-500/70', ilerleme: 'bg-amber-500', nokta: 'bg-amber-500' },
  bitti: { cubuk: 'bg-slate-200 dark:bg-slate-700', cerceve: 'ring-emerald-500/70', ilerleme: 'bg-emerald-500', nokta: 'bg-emerald-500' },
  riskli: { cubuk: 'bg-slate-200 dark:bg-slate-700', cerceve: 'ring-rose-500/80', ilerleme: 'bg-rose-500', nokta: 'bg-rose-500' }
};

const DURUMLAR: GanttDurum[] = ['bekliyor', 'devam', 'bitti', 'riskli'];

export default function GanttCanvas() {
  const { t, i18n } = useTranslation();
  const {
    ganttPlans, activeGanttId, setActiveGantt, addGanttPlan, renameGanttPlan, deleteGanttPlan,
    addGanttGorev, updateGanttGorev, deleteGanttGorev, ganttGoreviIcerial, ganttGoreviDisarial,
    ganttGoreviTasi, ganttGoreviKapat, ganttBagimlilikDegistir, loadGanttExample
  } = useRoadmapStore(useShallow((s) => ({
    ganttPlans: s.ganttPlans,
    activeGanttId: s.activeGanttId,
    setActiveGantt: s.setActiveGantt,
    addGanttPlan: s.addGanttPlan,
    renameGanttPlan: s.renameGanttPlan,
    deleteGanttPlan: s.deleteGanttPlan,
    addGanttGorev: s.addGanttGorev,
    updateGanttGorev: s.updateGanttGorev,
    deleteGanttGorev: s.deleteGanttGorev,
    ganttGoreviIcerial: s.ganttGoreviIcerial,
    ganttGoreviDisarial: s.ganttGoreviDisarial,
    ganttGoreviTasi: s.ganttGoreviTasi,
    ganttGoreviKapat: s.ganttGoreviKapat,
    ganttBagimlilikDegistir: s.ganttBagimlilikDegistir,
    loadGanttExample: s.loadGanttExample
  })));

  const [yakinlik, setYakinlik] = useState<Yakinlik>('gun');
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [yeniPlanAdi, setYeniPlanAdi] = useState('');
  const [karsilamaKapandi, setKarsilamaKapandi] = useState(false);
  const [silinecek, setSilinecek] = useState<GanttGorev | null>(null);
  const [bagimlilikPaneli, setBagimlilikPaneli] = useState(false);
  const kaydirmaRef = useRef<HTMLDivElement>(null);
  const bugunKaydirildi = useRef(false);

  const planlar = ganttPlans || [];
  const plan = planlar.find((p) => p.id === activeGanttId) || planlar[0] || null;

  // Açık plan silinirse ya da paylaşımdan yeni bir plan gelirse seçim boşta
  // kalmasın.
  useEffect(() => {
    if (plan && plan.id !== activeGanttId) setActiveGantt(plan.id);
  }, [plan, activeGanttId, setActiveGantt]);

  const gorevler = plan?.gorevler || [];
  const bugun = bugununMetni();

  const ozetler = useMemo(() => {
    const harita = new Map<string, { baslangic: string; bitis: string; ilerleme: number }>();
    gorevler.forEach((g) => harita.set(g.id, ozetHesapla(gorevler, g)));
    return harita;
  }, [gorevler]);

  const aralik = useMemo(
    () => araligiHesapla(Array.from(ozetler.values()), bugun),
    [ozetler, bugun]
  );

  const toplamGun = gunSayisi(aralik.basla, aralik.bit);
  const gunGenislik = GUN_GENISLIK[yakinlik];
  const takvimGenislik = toplamGun * gunGenislik;
  const satirlar = useMemo(() => siraliGorevler(gorevler), [gorevler]);

  // Çizelge açılınca bugüne kaydır: uzun bir planda kullanıcı en başa, çoktan
  // bitmiş işlerin oraya bakıyordu.
  useEffect(() => {
    if (bugunKaydirildi.current || !kaydirmaRef.current || satirlar.length === 0) return;
    const x = gunFarki(aralik.basla, bugun) * gunGenislik;
    kaydirmaRef.current.scrollLeft = Math.max(0, x - 180);
    bugunKaydirildi.current = true;
  }, [aralik.basla, bugun, gunGenislik, satirlar.length]);

  const secili = gorevler.find((g) => g.id === seciliId) || null;

  const gunuKonumla = (tarih: string) => gunFarki(aralik.basla, tarih) * gunGenislik;

  /* ---------------- Sürükleme: çubuğu taşı ya da ucundan uzat ------------- */

  const surukleBaslat = (
    olay: React.PointerEvent,
    gorev: GanttGorev,
    kip: 'tasi' | 'basi' | 'sonu'
  ) => {
    // Üst görevin tarihi alt görevlerinden geliyor; elle taşınamaz.
    if (ustGorevMu(gorevler, gorev.id) || !plan) return;
    olay.preventDefault();
    olay.stopPropagation();
    const baslangicX = olay.clientX;
    const ilkBaslangic = gorev.baslangic;
    const ilkBitis = gorev.bitis;
    const hedef = olay.currentTarget as HTMLElement;
    hedef.setPointerCapture(olay.pointerId);

    const hareket = (e: PointerEvent) => {
      const kayanGun = Math.round((e.clientX - baslangicX) / gunGenislik);
      if (kayanGun === 0) return;
      if (kip === 'tasi') {
        updateGanttGorev(plan.id, gorev.id, {
          baslangic: gunEkle(ilkBaslangic, kayanGun),
          bitis: gunEkle(ilkBitis, kayanGun)
        });
      } else if (kip === 'basi') {
        const yeni = gunEkle(ilkBaslangic, kayanGun);
        if (yeni <= ilkBitis) updateGanttGorev(plan.id, gorev.id, { baslangic: yeni });
      } else {
        const yeni = gunEkle(ilkBitis, kayanGun);
        if (yeni >= ilkBaslangic) updateGanttGorev(plan.id, gorev.id, { bitis: yeni });
      }
    };
    const birak = () => {
      hedef.removeEventListener('pointermove', hareket);
      hedef.removeEventListener('pointerup', birak);
    };
    hedef.addEventListener('pointermove', hareket);
    hedef.addEventListener('pointerup', birak);
  };

  /* ------------------------------ Boş durumlar --------------------------- */

  if (!plan) {
    return (
      <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900">
        <div className="h-16 w-full flex-none border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-100">
            <CalendarRange size={20} className="text-orange-500" />
            {t('gantt_title')}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('gantt_first_hint')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addGanttPlan(yeniPlanAdi.trim() || t('gantt_default_plan_name'));
              setYeniPlanAdi('');
            }}
            className="mt-4 flex flex-col gap-2"
          >
            <input
              value={yeniPlanAdi}
              onChange={(e) => setYeniPlanAdi(e.target.value)}
              placeholder={t('gantt_new_plan_placeholder')}
              aria-label={t('gantt_new_plan_placeholder')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-700"
            >
              {t('btn_create')}
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  const bosPlan = gorevler.length === 0;

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Üstteki gezinme düğmeleri (geri al, kılavuz, paylaş, dışa aktar,
          çalışmalarım, hesap) tuvalin ÜSTÜNDE, havada duruyor. Çizelgenin ilk
          satırları onların altında kalıyordu. Bu boşluk onlara yer açıyor,
          alt kenarındaki çizgi de düğmelerle aracı birbirinden ayırıyor.
          Diğer tablo tabanlı araçlarda da aynı ölçü var (bkz. ToolHeader,
          dividerOnTop). */}
      <div className="h-16 w-full flex-none border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />

      {/* Üst şerit: plan seçimi, yakınlık ve görev ekleme.

          z-50 şart: çizelgenin sol sütunu ve başlık şeridi `sticky` ve kendi
          z değerleri var. Bu şerit onlardan önce çizildiği için çizelge menüsü
          açıldığında sütunların ALTINDA kalıyor, kullanıcı listeyi göremiyordu. */}
      <div className="relative z-50 flex flex-none flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:px-4">
        <AnalysisMenu
          Simge={CalendarRange}
          aktifId={plan.id}
          ogeler={planlar.map((p) => ({ id: p.id, name: p.name, sayac: p.gorevler.length }))}
          onSec={setActiveGantt}
          onEkle={() => addGanttPlan(t('gantt_default_plan_name'))}
          onYenidenAdlandir={renameGanttPlan}
          onSil={deleteGanttPlan}
          metinler={{
            baslik: t('gantt_plans'),
            yeni: t('gantt_new_plan'),
            yenidenAdlandir: t('rename_title'),
            ad: t('gantt_plan_name'),
            sil: t('delete'),
            silMesaji: t('gantt_delete_plan_confirm')
          }}
        />

        <div className="ms-auto flex items-center gap-2">
          {/* Yakınlık: gün / hafta / ay. Aynı çizelge, farklı gün genişliği. */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {(['gun', 'hafta', 'ay'] as Yakinlik[]).map((y) => (
              <button
                key={y}
                onClick={() => setYakinlik(y)}
                aria-pressed={yakinlik === y}
                className={clsx(
                  'px-2.5 py-1.5 text-xs font-bold transition-colors',
                  yakinlik === y
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                )}
              >
                {t(`gantt_zoom_${y}`)}
              </button>
            ))}
          </div>
          <button
            onClick={() => addGanttGorev(plan.id, secili?.ustId ?? null, secili?.id ?? null)}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-700"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{t('gantt_add_task')}</span>
          </button>
        </div>
      </div>

      {bosPlan && !karsilamaKapandi && (
        <div className="flex flex-1 items-start justify-center overflow-auto p-6">
          <CanvasKarsilama
            simge={<CalendarRange size={18} />}
            baslik={t('gantt_empty')}
            aciklama={t('gantt_empty_hint')}
            birincil={{ etiket: t('gantt_add_task'), onClick: () => addGanttGorev(plan.id, null, null) }}
            ikincil={{ etiket: t('load_example'), onClick: () => loadGanttExample(plan.id) }}
            onKapat={() => setKarsilamaKapandi(true)}
          />
        </div>
      )}

      {(!bosPlan || karsilamaKapandi) && (
        <div ref={kaydirmaRef} className="flex-1 overflow-auto custom-scrollbar">
          <div className="relative" style={{ width: `calc(var(--gantt-sol) + ${takvimGenislik}px)` }}>
            {/* Başlık şeridi: üstte ay, altında gün/hafta. */}
            <div
              className="sticky top-0 z-30 flex bg-white dark:bg-slate-900"
              style={{ height: BASLIK_YUKSEKLIK }}
            >
              <div className="sticky start-0 z-40 flex items-end border-b border-e border-slate-200 bg-white px-3 pb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 gantt-sol">
                {t('gantt_task')}
              </div>
              <div className="relative border-b border-slate-200 dark:border-slate-800" style={{ width: takvimGenislik }}>
                <TakvimBasligi
                  basla={aralik.basla}
                  toplamGun={toplamGun}
                  gunGenislik={gunGenislik}
                  yakinlik={yakinlik}
                  dil={i18n.language}
                />
              </div>
            </div>

            {/* Bağımlılık okları: satırların altında, sol sütunun üstünde değil. */}
            <BagimlilikOklari
              satirlar={satirlar}
              ozetler={ozetler}
              gunuKonumla={gunuKonumla}
              gunGenislik={gunGenislik}
            />

            {satirlar.map(({ gorev, derinlik }, sira) => {
              const ozet = ozetler.get(gorev.id)!;
              const ust = ustGorevMu(gorevler, gorev.id);
              const stil = DURUM_STILI[gorev.durum];
              const sol = gunuKonumla(ozet.baslangic);
              const genislik = gunSayisi(ozet.baslangic, ozet.bitis) * gunGenislik;
              const gecikti = gorev.durum !== 'bitti' && ozet.bitis < bugun;

              return (
                <div
                  key={gorev.id}
                  onClick={() => setSeciliId(gorev.id)}
                  className={clsx(
                    'flex cursor-pointer border-b border-slate-100 transition-colors dark:border-slate-800/70',
                    seciliId === gorev.id
                      ? 'bg-orange-50 dark:bg-orange-900/20'
                      : sira % 2 === 1
                      ? 'bg-slate-50/60 dark:bg-slate-800/20'
                      : 'bg-transparent'
                  )}
                  style={{ height: SATIR_YUKSEKLIK }}
                >
                  {/* Sol sütun: girinti, aç/kapat, ad. */}
                  <div
                    className={clsx(
                      'sticky start-0 z-20 flex items-center gap-1 border-e border-slate-200 pe-2 dark:border-slate-800 gantt-sol',
                      seciliId === gorev.id
                        ? 'bg-orange-50 dark:bg-orange-950'
                        : 'bg-white dark:bg-slate-900'
                    )}
                    style={{ paddingInlineStart: 8 + derinlik * 14 }}
                  >
                    {ust ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); ganttGoreviKapat(plan.id, gorev.id); }}
                        aria-label={gorev.kapali ? t('gantt_expand') : t('gantt_collapse')}
                        className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                      >
                        {gorev.kapali ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      </button>
                    ) : (
                      <span className="w-[19px] shrink-0" aria-hidden />
                    )}
                    {gorev.kilometreTasi && <Diamond size={12} className="shrink-0 text-orange-500" aria-hidden />}
                    {duzenlenenId === gorev.id ? (
                      <input
                        autoFocus
                        defaultValue={gorev.ad}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v) updateGanttGorev(plan.id, gorev.id, { ad: v });
                          setDuzenlenenId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                          if (e.key === 'Escape') setDuzenlenenId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-lg bg-slate-100 px-2 py-1 text-[13px] font-semibold outline-none ring-1 ring-slate-300 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-slate-600"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => setDuzenlenenId(gorev.id)}
                        title={t('double_click_edit')}
                        className={clsx(
                          'min-w-0 flex-1 truncate text-[13px] leading-snug',
                          ust ? 'font-bold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {gorev.ad}
                      </span>
                    )}
                    <span className="hidden shrink-0 text-[11px] tabular-nums text-slate-400 md:inline">
                      {gunEtiketi(ozet.baslangic, i18n.language)}
                    </span>
                    {/* İki tarih bitişik duruyordu, tek bir tarihmiş gibi
                        okunuyordu. Aradaki ok hangisinin başlangıç olduğunu
                        söylüyor. */}
                    <span className="hidden shrink-0 text-[10px] text-slate-300 md:inline dark:text-slate-600" aria-hidden>
                      →
                    </span>
                    <span className={clsx('hidden shrink-0 text-[11px] tabular-nums md:inline', gecikti ? 'font-bold text-rose-500' : 'text-slate-400')}>
                      {gunEtiketi(ozet.bitis, i18n.language)}
                    </span>
                    <span className="hidden w-9 shrink-0 text-end text-[11px] font-semibold tabular-nums text-slate-500 lg:inline dark:text-slate-400">
                      %{ozet.ilerleme}
                    </span>
                  </div>

                  {/* Takvim: çubuk ya da kilometre taşı. */}
                  <div className="relative" style={{ width: takvimGenislik }}>
                    {gorev.kilometreTasi ? (
                      <div
                        onPointerDown={(e) => surukleBaslat(e, gorev, 'tasi')}
                        title={`${gorev.ad} · ${gunEtiketi(gorev.baslangic, i18n.language)}`}
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 cursor-grab touch-none rounded-[2px] bg-orange-500 shadow-sm"
                        style={{ insetInlineStart: sol + gunGenislik / 2 - 7 }}
                      />
                    ) : (
                      <div
                        onPointerDown={(e) => !ust && surukleBaslat(e, gorev, 'tasi')}
                        title={`${gorev.ad} · %${ozet.ilerleme}`}
                        className={clsx(
                          'group absolute top-1/2 -translate-y-1/2 touch-none overflow-hidden rounded-md ring-1 ring-inset',
                          ust ? 'h-3 cursor-default' : 'h-5 cursor-grab',
                          stil.cubuk,
                          // Geciken iş kalın kırmızı çerçeveyle ayrılıyor.
                          gecikti ? 'ring-2 ring-rose-500' : stil.cerceve
                        )}
                        style={{ insetInlineStart: sol, width: Math.max(genislik, 6) }}
                      >
                        {/* İlerleme dolgusu: çubuğun içinde koyu bölüm. */}
                        <div
                          className={clsx('h-full rounded-s-md', stil.ilerleme)}
                          style={{ width: `${ozet.ilerleme}%` }}
                        />
                        {!ust && genislik > 26 && (
                          <>
                            <span
                              onPointerDown={(e) => surukleBaslat(e, gorev, 'basi')}
                              className="absolute inset-y-0 start-0 w-2 cursor-ew-resize rounded-s-md opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-black/20"
                            />
                            <span
                              onPointerDown={(e) => surukleBaslat(e, gorev, 'sonu')}
                              className="absolute inset-y-0 end-0 w-2 cursor-ew-resize rounded-e-md opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-black/20"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bugün çizgisi: başlıktan aşağı iner. */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 z-10 w-px bg-rose-500/70"
              style={{
                insetInlineStart: `calc(var(--gantt-sol) + ${gunuKonumla(bugun) + gunGenislik / 2}px)`,
                height: BASLIK_YUKSEKLIK + satirlar.length * SATIR_YUKSEKLIK
              }}
            />
          </div>
        </div>
      )}

      {/* Seçili görevin ayrıntı şeridi. Tarih, ilerleme, durum ve bağımlılık
          burada; satırın içine sıkıştırılsaydı telefonda hiçbiri sığmazdı. */}
      {secili && (
        <div className="flex-none border-t border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:px-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="max-w-[40%] truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {secili.ad}
            </span>

            <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {t('gantt_start')}
              <input
                type="date"
                value={secili.baslangic}
                onChange={(e) => e.target.value && updateGanttGorev(plan.id, secili.id, { baslangic: e.target.value })}
                disabled={ustGorevMu(gorevler, secili.id)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </label>

            {!secili.kilometreTasi && (
              <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                {t('gantt_end')}
                <input
                  type="date"
                  value={secili.bitis}
                  min={secili.baslangic}
                  onChange={(e) => e.target.value && updateGanttGorev(plan.id, secili.id, { bitis: e.target.value })}
                  disabled={ustGorevMu(gorevler, secili.id)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </label>
            )}

            {!ustGorevMu(gorevler, secili.id) && (
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {t('gantt_progress')}
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={secili.ilerleme}
                  onChange={(e) => updateGanttGorev(plan.id, secili.id, { ilerleme: Number(e.target.value) })}
                  className="w-24 accent-orange-500"
                />
                <span className="w-9 tabular-nums font-semibold">%{secili.ilerleme}</span>
              </label>
            )}

            <div className="flex items-center gap-1">
              {DURUMLAR.map((d) => (
                <button
                  key={d}
                  onClick={() => updateGanttGorev(plan.id, secili.id, { durum: d })}
                  aria-pressed={secili.durum === d}
                  title={t(`gantt_status_${d}`)}
                  className={clsx(
                    'flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors',
                    secili.durum === d
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  )}
                >
                  <span className={clsx('h-2 w-2 rounded-full', DURUM_STILI[d].nokta)} aria-hidden />
                  <span className="hidden sm:inline">{t(`gantt_status_${d}`)}</span>
                </button>
              ))}
            </div>

            <div className="ms-auto flex items-center gap-1">
              <IkonDugme
                etiket={t('gantt_milestone')}
                etkin={!!secili.kilometreTasi}
                onClick={() => updateGanttGorev(plan.id, secili.id, { kilometreTasi: !secili.kilometreTasi })}
              >
                <Diamond size={15} />
              </IkonDugme>
              <IkonDugme
                etiket={t('gantt_dependencies')}
                etkin={bagimlilikPaneli}
                onClick={() => setBagimlilikPaneli((a) => !a)}
              >
                <Link2 size={15} />
              </IkonDugme>
              <IkonDugme etiket={t('gantt_outdent')} onClick={() => ganttGoreviDisarial(plan.id, secili.id)}>
                <Outdent size={15} />
              </IkonDugme>
              <IkonDugme etiket={t('gantt_indent')} onClick={() => ganttGoreviIcerial(plan.id, secili.id)}>
                <Indent size={15} />
              </IkonDugme>
              <IkonDugme etiket={t('gantt_move_up')} onClick={() => ganttGoreviTasi(plan.id, secili.id, -1)}>
                <span className="text-sm leading-none">↑</span>
              </IkonDugme>
              <IkonDugme etiket={t('gantt_move_down')} onClick={() => ganttGoreviTasi(plan.id, secili.id, 1)}>
                <span className="text-sm leading-none">↓</span>
              </IkonDugme>
              <IkonDugme etiket={t('delete')} tehlike onClick={() => setSilinecek(secili)}>
                <Trash2 size={15} />
              </IkonDugme>
              <IkonDugme etiket={t('close')} onClick={() => { setSeciliId(null); setBagimlilikPaneli(false); }}>
                <X size={15} />
              </IkonDugme>
            </div>
          </div>

          {/* Bağımlılık seçimi: "bu görev şunlar bitmeden başlamaz". */}
          {bagimlilikPaneli && (
            <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-800">
              <span className="me-1 text-xs text-slate-500 dark:text-slate-400">{t('gantt_depends_on')}</span>
              {gorevler.filter((g) => g.id !== secili.id && !ustGorevMu(gorevler, g.id)).map((g) => {
                const bagli = (secili.oncekiler || []).includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => ganttBagimlilikDegistir(plan.id, secili.id, g.id)}
                    className={clsx(
                      'max-w-[220px] truncate rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors',
                      bagli
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    )}
                  >
                    {g.ad}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!silinecek}
        title={t('delete')}
        message={t('gantt_delete_task_confirm', { ad: silinecek?.ad ?? '' })}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={() => {
          if (!silinecek) return;
          deleteGanttGorev(plan.id, silinecek.id);
          if (seciliId === silinecek.id) setSeciliId(null);
          setSilinecek(null);
        }}
        onClose={() => setSilinecek(null)}
      />
    </div>
  );
}

function IkonDugme({
  children, etiket, onClick, etkin, tehlike
}: {
  children: React.ReactNode;
  etiket: string;
  onClick: () => void;
  etkin?: boolean;
  tehlike?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={etiket}
      aria-label={etiket}
      aria-pressed={etkin}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        etkin
          ? 'bg-orange-600 text-white'
          : tehlike
          ? 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
      )}
    >
      {children}
    </button>
  );
}

/** Takvimin üst şeridi: ay adları ve altında gün/hafta işaretleri. */
function TakvimBasligi({
  basla, toplamGun, gunGenislik, yakinlik, dil
}: {
  basla: string;
  toplamGun: number;
  gunGenislik: number;
  yakinlik: Yakinlik;
  dil: string;
}) {
  const gunler = useMemo(
    () => Array.from({ length: toplamGun }, (_, i) => gunEkle(basla, i)),
    [basla, toplamGun]
  );

  // Ay etiketleri ayın ilk gününe konuyor; ilk ay için de takvimin başına.
  const aylar = gunler
    .map((g, i) => ({ g, i }))
    .filter(({ g, i }) => i === 0 || ayinIlkiMi(g));

  return (
    <>
      <div className="relative h-6 border-b border-slate-100 dark:border-slate-800">
        {aylar.map(({ g, i }) => (
          <span
            key={g}
            className="absolute top-0 whitespace-nowrap ps-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400"
            style={{ insetInlineStart: i * gunGenislik }}
          >
            {ayEtiketi(g, dil)}
          </span>
        ))}
      </div>
      <div className="relative h-[26px]">
        {gunler.map((g, i) => {
          // Gün görünümünde her gün yazılıyor; hafta görünümünde yalnız
          // pazartesiler; ay görünümünde hiçbiri (yer yok, ay şeridi yeter).
          const gunGorunumu = yakinlik === 'gun';
          const yaz = gunGorunumu || (yakinlik === 'hafta' && haftaBasiMi(g));
          // Gün görünümünde hafta sonları yazısız da olsa çiziliyor: gri
          // zeminleri takvimi haftalara bölen tek işaret.
          if (!yaz && !(gunGorunumu && haftaSonuMu(g))) return null;
          return (
            <span
              key={g}
              className={clsx(
                'absolute top-0 flex h-full items-center justify-center text-[10px] tabular-nums',
                haftaSonuMu(g)
                  ? 'bg-slate-100 font-semibold text-slate-400 dark:bg-slate-800/60 dark:text-slate-500'
                  : 'text-slate-400 dark:text-slate-500'
              )}
              style={{ insetInlineStart: i * gunGenislik, width: gunGenislik }}
            >
              {yaz ? tariheCevir(g).getDate() : ''}
            </span>
          );
        })}
      </div>
    </>
  );
}

/**
 * Bağımlılık okları. Önceki görevin bitişinden sonrakinin başlangıcına
 * dirsekli bir çizgi çiziliyor; klasik "bitiş → başlangıç" bağı.
 *
 * Yalnız ikisi de ekranda görünen (kapatılmamış) görevler için çiziliyor:
 * gizli bir satıra giden ok boşluğa gider.
 */
function BagimlilikOklari({
  satirlar, ozetler, gunuKonumla, gunGenislik
}: {
  satirlar: { gorev: GanttGorev; derinlik: number }[];
  ozetler: Map<string, { baslangic: string; bitis: string; ilerleme: number }>;
  gunuKonumla: (tarih: string) => number;
  gunGenislik: number;
}) {
  const sira = new Map(satirlar.map((s, i) => [s.gorev.id, i]));

  const yollar: string[] = [];
  satirlar.forEach(({ gorev }) => {
    (gorev.oncekiler || []).forEach((oncekiId) => {
      const oncekiSira = sira.get(oncekiId);
      const buSira = sira.get(gorev.id);
      if (oncekiSira === undefined || buSira === undefined) return;
      const onceki = ozetler.get(oncekiId);
      const bu = ozetler.get(gorev.id);
      if (!onceki || !bu) return;

      const x1 = gunuKonumla(onceki.bitis) + gunGenislik;
      const y1 = BASLIK_YUKSEKLIK + oncekiSira * SATIR_YUKSEKLIK + SATIR_YUKSEKLIK / 2;
      const x2 = gunuKonumla(bu.baslangic);
      const y2 = BASLIK_YUKSEKLIK + buSira * SATIR_YUKSEKLIK + SATIR_YUKSEKLIK / 2;
      const ara = x2 - 8 > x1 + 8 ? x2 - 8 : x1 + 8;
      yollar.push(`M ${x1} ${y1} H ${ara} V ${y2} H ${x2}`);
    });
  });

  if (yollar.length === 0) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-0 z-10 overflow-visible"
      style={{ insetInlineStart: 'var(--gantt-sol)' }}
      width="100%"
      height="100%"
    >
      <defs>
        <marker id="gantt-ok" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
      {yollar.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          strokeWidth={1.5}
          markerEnd="url(#gantt-ok)"
          className="stroke-slate-400 dark:stroke-slate-500"
        />
      ))}
    </svg>
  );
}

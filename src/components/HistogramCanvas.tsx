import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { Plus, Trash2, BarChart, Edit2, AlertTriangle, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ConfirmModal from './ConfirmModal';
import DebouncedField from './DebouncedField';
import {
  histogramHesapla,
  normalEgriNoktalari,
  olcumleriAyristir,
  olcumleriMetneCevir,
  sturgesKutuSayisi,
  sayiBicimle,
} from '../utils/histogramHesap';

/** Sayısal ayar kutusu; boş bırakılırsa ayar kaldırılır. */
function AyarAlani({ etiket, deger, onCommit, ipucu }: {
  etiket: string;
  deger: number | undefined;
  onCommit: (sayi: number | undefined) => void;
  ipucu?: string;
}) {
  const [metin, setMetin] = useState(deger === undefined ? '' : String(deger));
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{etiket}</span>
      <input
        type="text"
        inputMode="decimal"
        value={metin}
        placeholder={ipucu}
        onChange={(e) => setMetin(e.target.value)}
        onBlur={() => {
          const temiz = metin.replace(',', '.').trim();
          if (temiz === '') return onCommit(undefined);
          const sayi = parseFloat(temiz);
          if (Number.isFinite(sayi)) onCommit(sayi);
          else setMetin(deger === undefined ? '' : String(deger));
        }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        aria-label={etiket}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold tabular-nums text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </label>
  );
}

/** Alt bardaki tek bir istatistik. */
function Istatistik({ baslik, deger, renk }: { baslik: string; deger: string; renk?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{baslik}</div>
      <div className={`text-lg font-bold tabular-nums ${renk ?? 'text-slate-800 dark:text-slate-100'}`}>{deger}</div>
    </div>
  );
}

export default function HistogramCanvas() {
  const { t } = useTranslation();
  const {
    currentProjectId, histogram, addHistogramProject, setHistogramOlcumler,
    updateHistogramAyarlar, updateHistogramTitle, deleteHistogramProject, clearHistogramEskiKalemler,
  } = useRoadmapStore(useShallow((state) => ({
    currentProjectId: state.currentProjectId,
    histogram: state.histogram,
    addHistogramProject: state.addHistogramProject,
    setHistogramOlcumler: state.setHistogramOlcumler,
    updateHistogramAyarlar: state.updateHistogramAyarlar,
    updateHistogramTitle: state.updateHistogramTitle,
    deleteHistogramProject: state.deleteHistogramProject,
    clearHistogramEskiKalemler: state.clearHistogramEskiKalemler,
  })));

  const liste = histogram || [];
  const [aktifId, setAktifId] = useState<string | null>(liste.length > 0 ? liste[0].id : null);
  const [adDuzenleniyor, setAdDuzenleniyor] = useState(false);
  const [silmeOnayi, setSilmeOnayi] = useState(false);

  // Proje değişince önceki projenin analiz kimliğinde takılı kalmayalım.
  useEffect(() => { setAktifId(null); }, [currentProjectId]);

  const aktif = liste.find((h) => h.id === aktifId);
  const sonuc = useMemo(() => (aktif ? histogramHesapla(aktif.olcumler, aktif.ayarlar) : null), [aktif]);
  const egri = useMemo(() => (sonuc ? normalEgriNoktalari(sonuc) : []), [sonuc]);

  const yeniAnaliz = () => {
    if (!currentProjectId) return;
    const id = uuidv4();
    addHistogramProject(currentProjectId, id, t('default_histogram_title'));
    setAktifId(id);
  };

  if (!currentProjectId) return null;

  if (liste.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-8 dark:bg-slate-900">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <BarChart size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">{t('tool_histogram')}</h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400">{t('histogram_desc')}</p>
          <button onClick={yeniAnaliz} className="mx-auto flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700">
            <Plus size={20} />
            {t('histogram_add_analysis')}
          </button>
        </div>
      </div>
    );
  }

  if (!aktifId && liste.length > 0) {
    setAktifId(liste[0].id);
    return null;
  }

  // --- Grafik ölçüleri ---
  const g = 820, y = 420;
  const kenar = { ust: 30, sag: 30, alt: 64, sol: 56 };
  const alanG = g - kenar.sol - kenar.sag;
  const alanY = y - kenar.ust - kenar.alt;

  const enBuyukSiklik = sonuc ? Math.max(1, ...sonuc.kutular.map((k) => k.sayi), ...egri.map((n) => n.y)) : 1;
  const ySkala = (deger: number) => kenar.ust + alanY * (1 - deger / enBuyukSiklik);
  const xBas = sonuc ? sonuc.kutular[0].alt : 0;
  const xSon = sonuc ? sonuc.kutular[sonuc.kutular.length - 1].ust : 1;
  const xSkala = (deger: number) => kenar.sol + ((deger - xBas) / (xSon - xBas || 1)) * alanG;

  const birim = aktif?.ayarlar.birim ? ` ${aktif.ayarlar.birim}` : '';
  const cizgi = (deger: number | undefined, renk: string, etiket: string) => {
    if (typeof deger !== 'number' || !Number.isFinite(deger) || deger < xBas || deger > xSon) return null;
    const x = xSkala(deger);
    return (
      <g key={etiket}>
        <line x1={x} y1={kenar.ust} x2={x} y2={y - kenar.alt} stroke={renk} strokeWidth="2" strokeDasharray="6 4" />
        <text x={x} y={kenar.ust - 8} textAnchor="middle" fontSize="11" fontWeight="bold" fill={renk}>{etiket}</text>
      </g>
    );
  };

  return (
    // Dar ekranda yan yana durmuyor: sol panelin 320 piksellik tabanı telefon
    // ekranının tamamına yakınını yiyor, grafiğe avuç içi kadar yer kalıyordu.
    // Telefonda panel üstte, grafik altında; panelin boyu da sınırlı ki grafik
    // bir parmak kaydırmayla görünsün.
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-slate-50 pt-16 dark:bg-slate-900 md:flex-row md:pt-20">
      {/* SOL: veri girişi ve ayarlar */}
      <div className="flex max-h-[45vh] w-full shrink-0 flex-col overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/50 md:max-h-none md:w-1/3 md:min-w-[320px] md:border-b-0 md:border-e">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          {adDuzenleniyor && aktif ? (
            <DebouncedField
              autoFocus
              initialValue={aktif.title}
              onCommit={(v) => updateHistogramTitle(currentProjectId, aktif.id, v)}
              onBlur={() => setAdDuzenleniyor(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              className="me-2 min-w-0 flex-1 border-b border-indigo-500 bg-transparent text-lg font-bold text-slate-800 focus:outline-none dark:text-slate-100"
              ariaLabel={t('analysis_title_label')}
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <select
                className="max-w-[70%] cursor-pointer truncate bg-transparent text-lg font-bold text-slate-800 focus:outline-none dark:text-slate-100"
                value={aktifId || ''}
                onChange={(e) => setAktifId(e.target.value)}
                aria-label={t('analysis_title_label')}
              >
                {liste.map((h) => <option key={h.id} value={h.id}>{h.title}</option>)}
              </select>
              {aktif && (
                <>
                  <button onClick={() => setAdDuzenleniyor(true)} className="shrink-0 p-2 text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400" title={t('rename_title')} aria-label={t('rename_title')}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setSilmeOnayi(true)} className="shrink-0 p-2 text-slate-400 transition-colors hover:text-red-500" title={t('delete_histogram_title')} aria-label={t('delete_histogram_title')}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          )}
          <button onClick={yeniAnaliz} className="shrink-0 rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30" title={t('histogram_add_analysis')} aria-label={t('histogram_add_analysis')}>
            <Plus size={20} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
          {/* Taşınamamış eski sınıf kayıtları kaybolmasın. */}
          {aktif?.eskiKalemler && aktif.eskiKalemler.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/60 dark:bg-amber-500/10">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{t('histogram_legacy_note')}</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-amber-700 dark:text-amber-400">
                    {aktif.eskiKalemler.map((k) => <li key={k.id}>{k.category} — {k.frequency}</li>)}
                  </ul>
                </div>
                <button onClick={() => clearHistogramEskiKalemler(currentProjectId, aktif.id)} className="shrink-0 text-amber-600 hover:text-amber-800 dark:text-amber-400" title={t('close_modal', { defaultValue: 'Close' })} aria-label={t('close_modal', { defaultValue: 'Close' })}>
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="olcumler">
            {t('histogram_measurements')}
          </label>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t('histogram_measurements_hint')}</p>
          {aktif && (
            <DebouncedField
              key={aktif.id}
              multiline
              rows={12}
              initialValue={olcumleriMetneCevir(aktif.olcumler)}
              onCommit={(v) => setHistogramOlcumler(currentProjectId, aktif.id, olcumleriAyristir(v))}
              className="custom-scrollbar w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm tabular-nums text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              ariaLabel={t('histogram_measurements')}
              placeholder={'12,4\n12,8\n13,1'}
            />
          )}
          <div className="mt-1 text-end text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('histogram_count', { sayi: aktif?.olcumler.length ?? 0 })}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('histogram_settings')}</h4>
            <div className="grid grid-cols-2 gap-3">
              {aktif && (
                <>
                  <AyarAlani key={`${aktif.id}-alt`} etiket={t('histogram_lsl')} deger={aktif.ayarlar.altSinir} onCommit={(v) => updateHistogramAyarlar(currentProjectId, aktif.id, { altSinir: v })} />
                  <AyarAlani key={`${aktif.id}-ust`} etiket={t('histogram_usl')} deger={aktif.ayarlar.ustSinir} onCommit={(v) => updateHistogramAyarlar(currentProjectId, aktif.id, { ustSinir: v })} />
                  <AyarAlani key={`${aktif.id}-hedef`} etiket={t('histogram_target')} deger={aktif.ayarlar.hedef} onCommit={(v) => updateHistogramAyarlar(currentProjectId, aktif.id, { hedef: v })} />
                  <AyarAlani
                    key={`${aktif.id}-kutu`}
                    etiket={t('histogram_bins')}
                    deger={aktif.ayarlar.kutuSayisi}
                    ipucu={String(sturgesKutuSayisi(aktif.olcumler.length))}
                    onCommit={(v) => updateHistogramAyarlar(currentProjectId, aktif.id, { kutuSayisi: v })}
                  />
                  <label className="col-span-2 flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('histogram_unit')}</span>
                    <DebouncedField
                      key={`${aktif.id}-birim`}
                      initialValue={aktif.ayarlar.birim ?? ''}
                      onCommit={(v) => updateHistogramAyarlar(currentProjectId, aktif.id, { birim: v.trim() || undefined })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      ariaLabel={t('histogram_unit')}
                      placeholder="mm"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ: grafik ve istatistikler */}
      <div className="flex flex-1 flex-col items-center overflow-auto bg-slate-50 p-4 dark:bg-slate-900 sm:p-6">
        <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
            <BarChart className="text-blue-500" />
            {t('histogram_chart')}
          </h3>

          {sonuc ? (
            <>
              <svg viewBox={`0 0 ${g} ${y}`} className="w-full overflow-visible font-sans" role="img" aria-label={t('histogram_chart')}>
                {[0, 0.25, 0.5, 0.75, 1].map((oran) => {
                  const cy = kenar.ust + alanY * (1 - oran);
                  return (
                    <g key={oran}>
                      <line x1={kenar.sol} y1={cy} x2={g - kenar.sag} y2={cy} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4 4" />
                      <text x={kenar.sol - 10} y={cy} textAnchor="end" alignmentBaseline="middle" className="fill-slate-500 text-xs dark:fill-slate-400">
                        {Math.round(enBuyukSiklik * oran)}
                      </text>
                    </g>
                  );
                })}

                {/* Sınıf sütunları */}
                {sonuc.kutular.map((kutu, i) => {
                  const x1 = xSkala(kutu.alt);
                  const x2 = xSkala(kutu.ust);
                  const yust = ySkala(kutu.sayi);
                  const disarida = (typeof aktif?.ayarlar.altSinir === 'number' && kutu.ust <= aktif.ayarlar.altSinir)
                    || (typeof aktif?.ayarlar.ustSinir === 'number' && kutu.alt >= aktif.ayarlar.ustSinir);
                  return (
                    <g key={i} className="group/bar">
                      <rect
                        x={x1 + 0.5}
                        y={yust}
                        width={Math.max(1, x2 - x1 - 1)}
                        height={y - kenar.alt - yust}
                        className={disarida ? 'fill-rose-500/80 dark:fill-rose-600/80' : 'fill-blue-500 dark:fill-blue-600'}
                      />
                      <text x={(x1 + x2) / 2} y={yust - 6} textAnchor="middle" className="fill-blue-700 text-xs font-bold opacity-0 transition-opacity group-hover/bar:opacity-100 dark:fill-blue-300">
                        {kutu.sayi}
                      </text>
                    </g>
                  );
                })}

                {/* Normal dağılım eğrisi: şekli kıyaslamak için */}
                {egri.length > 1 && (
                  <path
                    d={egri.map((n, i) => `${i === 0 ? 'M' : 'L'} ${xSkala(n.x)} ${ySkala(n.y)}`).join(' ')}
                    fill="none"
                    className="stroke-slate-500 dark:stroke-slate-300"
                    strokeWidth="2"
                  />
                )}

                {cizgi(sonuc.ortalama, '#6366f1', t('histogram_mean_short'))}
                {cizgi(aktif?.ayarlar.hedef, '#10b981', t('histogram_target_short'))}
                {cizgi(aktif?.ayarlar.altSinir, '#e11d48', t('histogram_lsl_short'))}
                {cizgi(aktif?.ayarlar.ustSinir, '#e11d48', t('histogram_usl_short'))}

                <line x1={kenar.sol} y1={y - kenar.alt} x2={g - kenar.sag} y2={y - kenar.alt} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
                <line x1={kenar.sol} y1={kenar.ust} x2={kenar.sol} y2={y - kenar.alt} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

                {/* Sınıf sınırları: kalabalık olmasın diye seyreltilir. */}
                {sonuc.kutular.map((kutu, i) => {
                  const atla = Math.ceil(sonuc.kutular.length / 10);
                  if (i % atla !== 0) return null;
                  return (
                    <text key={`e-${i}`} x={xSkala(kutu.alt)} y={y - kenar.alt + 18} textAnchor="middle" className="fill-slate-600 text-[10px] font-medium dark:fill-slate-400">
                      {sayiBicimle(kutu.alt)}
                    </text>
                  );
                })}
                <text x={g - kenar.sag} y={y - kenar.alt + 18} textAnchor="end" className="fill-slate-600 text-[10px] font-medium dark:fill-slate-400">
                  {sayiBicimle(xSon)}{birim}
                </text>
              </svg>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Istatistik baslik={t('histogram_n')} deger={String(sonuc.n)} />
                <Istatistik baslik={t('histogram_mean')} deger={`${sayiBicimle(sonuc.ortalama)}${birim}`} />
                <Istatistik baslik={t('histogram_stdev')} deger={`${sayiBicimle(sonuc.standartSapma)}${birim}`} />
                <Istatistik baslik={t('histogram_range')} deger={`${sayiBicimle(sonuc.enKucuk)} – ${sayiBicimle(sonuc.enBuyuk)}${birim}`} />
              </div>

              {(sonuc.cp !== undefined || sonuc.cpk !== undefined) && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {sonuc.cp !== undefined && (
                    <Istatistik baslik="Cp" deger={sayiBicimle(sonuc.cp)} renk={sonuc.cp >= 1.33 ? 'text-emerald-600 dark:text-emerald-400' : sonuc.cp >= 1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'} />
                  )}
                  {sonuc.cpk !== undefined && (
                    <Istatistik baslik="Cpk" deger={sayiBicimle(sonuc.cpk)} renk={sonuc.cpk >= 1.33 ? 'text-emerald-600 dark:text-emerald-400' : sonuc.cpk >= 1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'} />
                  )}
                  <Istatistik
                    baslik={t('histogram_out_of_spec')}
                    deger={`${sonuc.sinirDisi} (%${sayiBicimle(sonuc.sinirDisiYuzde, 1)})`}
                    renk={sonuc.sinirDisi > 0 ? 'text-rose-600 dark:text-rose-400' : undefined}
                  />
                </div>
              )}

              {sonuc.cp === undefined && sonuc.cpk === undefined && (
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('histogram_spec_hint')}</p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <BarChart size={48} className="mb-4 opacity-20" />
              <p>{t('histogram_empty')}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={silmeOnayi}
        onClose={() => setSilmeOnayi(false)}
        onConfirm={() => {
          if (currentProjectId && aktif) {
            deleteHistogramProject(currentProjectId, aktif.id);
            setAktifId(null);
          }
        }}
        title={t('delete_histogram_title')}
        message={t('delete_histogram_msg')}
      />
    </div>
  );
}

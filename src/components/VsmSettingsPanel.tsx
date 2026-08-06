import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Timer, ChevronDown } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import type { VsmHarita } from '../store/useRoadmapStore';
import { taktSaniye, gunlukCalismaSaniyesi, saniyeBicimle } from '../utils/vsmHesap';

function Alan({ etiket, deger, onCommit }: { etiket: string; deger: number; onCommit: (sayi: number) => void }) {
  const [metin, setMetin] = useState(String(deger));
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{etiket}</span>
      <input
        type="text"
        inputMode="numeric"
        value={metin}
        onChange={(e) => setMetin(e.target.value)}
        onBlur={() => {
          const sayi = parseFloat(metin.replace(',', '.'));
          if (Number.isFinite(sayi) && sayi >= 0) onCommit(sayi);
          else setMetin(String(deger));
        }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        aria-label={etiket}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold tabular-nums text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </label>
  );
}

/**
 * Takt zamanının çıktığı yer. Bu panel olmadan araç "talebe yetişiyor muyuz"
 * sorusunu hiç soramıyordu; VSM'in varlık sebebi bu soru.
 */
export default function VsmSettingsPanel({ harita }: { harita: VsmHarita }) {
  const { t } = useTranslation();
  const updateVsmAyarlar = useRoadmapStore((s) => s.updateVsmAyarlar);
  const [acik, setAcik] = useState(false);

  const takt = taktSaniye(harita.ayarlar);
  const calisma = gunlukCalismaSaniyesi(harita.ayarlar);
  const birimler = { sec: t('vsm_time_unit_sec'), min: t('vsm_time_unit_min'), hr: t('vsm_time_unit_hr') };

  return (
    <div className="w-64 rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95">
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
      >
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
          <Timer size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('vsm_takt_time')}</div>
          <div className="truncate text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {takt > 0 ? saniyeBicimle(takt, birimler) : '—'}
          </div>
        </div>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="border-t border-slate-100 p-3 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-2">
            <Alan key={`${harita.id}-talep`} etiket={t('vsm_daily_demand')} deger={harita.ayarlar.gunlukTalep} onCommit={(v) => updateVsmAyarlar({ gunlukTalep: v })} />
            <Alan key={`${harita.id}-vardiya`} etiket={t('vsm_shifts')} deger={harita.ayarlar.vardiyaSayisi} onCommit={(v) => updateVsmAyarlar({ vardiyaSayisi: v })} />
            <Alan key={`${harita.id}-dakika`} etiket={t('vsm_shift_minutes')} deger={harita.ayarlar.vardiyaDakika} onCommit={(v) => updateVsmAyarlar({ vardiyaDakika: v })} />
            <Alan key={`${harita.id}-mola`} etiket={t('vsm_break_minutes')} deger={harita.ayarlar.molaDakika} onCommit={(v) => updateVsmAyarlar({ molaDakika: v })} />
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">{t('vsm_available_time')}</span>
              <span className="font-bold tabular-nums text-slate-700 dark:text-slate-200">{saniyeBicimle(calisma, birimler)}</span>
            </div>
            {takt <= 0 && (
              <p className="mt-2 text-[11px] font-medium text-amber-600 dark:text-amber-400">{t('vsm_no_demand_hint')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

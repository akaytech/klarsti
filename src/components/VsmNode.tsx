import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Handle, Position } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useRoadmapStore, getActiveVsmMap } from '../store/useRoadmapStore';
import type { VsmSure, VsmBirim } from '../store/useRoadmapStore';
import { Factory, Triangle, Plus, X, AlertTriangle, ClipboardList, Truck, Zap, Users } from 'lucide-react';
import DebouncedField from './DebouncedField';
import { VSM_KUTU_GENISLIK, taktSaniye, sureyiUretimSaniyesineCevir, gunlukCalismaSaniyesi } from '../utils/vsmHesap';

const gsl = (tip: string) => ({ width: VSM_KUTU_GENISLIK[tip] });

/**
 * Sayı alanı. Yazarken değil odak kaybında store'a yazar; yoksa her tuş
 * vuruşunda bir kaydetme turu başlıyor, "1." gibi yarım yazımlar da anında
 * sayıya çevrilip siliniyordu.
 */
function SayiAlani({ deger, onCommit, className, ariaLabel, placeholder }: {
  deger: number | undefined;
  onCommit: (sayi: number | undefined) => void;
  className?: string;
  ariaLabel: string;
  placeholder?: string;
}) {
  const [metin, setMetin] = useState(deger === undefined ? '' : String(deger));

  const yaz = () => {
    const temiz = metin.replace(',', '.').trim();
    if (temiz === '') return onCommit(undefined);
    const sayi = parseFloat(temiz);
    onCommit(Number.isFinite(sayi) ? sayi : undefined);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={metin}
      onChange={(e) => setMetin(e.target.value)}
      onBlur={yaz}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      aria-label={ariaLabel}
      placeholder={placeholder}
      className={className}
    />
  );
}

/** Sayı + birim ikilisi. Süreler artık birimsiz tutulmuyor. */
function SureAlani({ sure, onCommit, ariaLabel }: { sure?: VsmSure; onCommit: (s: VsmSure) => void; ariaLabel: string }) {
  const { t } = useTranslation();
  const birim = sure?.birim ?? 'sec';

  return (
    <div className="flex items-center gap-0.5">
      <SayiAlani
        deger={sure?.deger}
        onCommit={(sayi) => onCommit({ deger: sayi ?? 0, birim })}
        ariaLabel={ariaLabel}
        className="min-w-0 flex-1 rounded border border-slate-200 bg-slate-50 px-1 text-end tabular-nums dark:border-slate-700 dark:bg-slate-900"
      />
      <select
        value={birim}
        onChange={(e) => onCommit({ deger: sure?.deger ?? 0, birim: e.target.value as VsmBirim })}
        aria-label={`${ariaLabel} — ${t('vsm_unit')}`}
        className="nodrag rounded border border-slate-200 bg-slate-50 px-0.5 text-[10px] dark:border-slate-700 dark:bg-slate-900"
      >
        <option value="sec">{t('vsm_time_unit_sec')}</option>
        <option value="min">{t('vsm_time_unit_min')}</option>
        <option value="hr">{t('vsm_time_unit_hr')}</option>
        <option value="day">{t('vsm_time_unit_day')}</option>
      </select>
    </div>
  );
}

function Tutamaklar({ renk }: { renk: string }) {
  return (
    <>
      <Handle type="target" position={Position.Left} className={renk} />
      <Handle type="target" position={Position.Top} id="top" className={renk} />
      <Handle type="source" position={Position.Right} className={renk} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={renk} />
    </>
  );
}

/** Kutunun kendi takt kıyasını yapabilmesi için açık haritanın ayarları. */
function useTakt() {
  const ayarlar = useRoadmapStore((s) => getActiveVsmMap(s)?.ayarlar);
  return {
    takt: ayarlar ? taktSaniye(ayarlar) : 0,
    calisma: ayarlar ? gunlukCalismaSaniyesi(ayarlar) : 0,
  };
}

export function VsmProcessNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);
  const { takt, calisma } = useTakt();

  const cevrim = sureyiUretimSaniyesineCevir(data.cycleTime, calisma);
  const taktiAsiyor = takt > 0 && cevrim > takt;

  const customFields = data.customFields || [];
  const alanEkle = () => updateVsmNode(id, {
    customFields: [...customFields, { id: uuidv4(), name: t('vsm_metric'), value: '0' }],
  });
  const alanGuncelle = (fieldId: string, patch: Partial<{ name: string; value: string }>) =>
    updateVsmNode(id, { customFields: customFields.map((f: any) => (f.id === fieldId ? { ...f, ...patch } : f)) });
  const alanSil = (fieldId: string) =>
    updateVsmNode(id, { customFields: customFields.filter((f: any) => f.id !== fieldId) });

  return (
    <div
      style={gsl('vsmProcess')}
      className={clsx(
        'group rounded-sm border-2 bg-white shadow-sm dark:bg-slate-800',
        taktiAsiyor ? 'border-rose-500 dark:border-rose-400' : 'border-indigo-500 dark:border-indigo-400'
      )}
    >
      <Tutamaklar renk="!bg-indigo-500" />

      <div className={clsx('flex items-center gap-1 px-2 py-1 text-center text-sm font-bold text-white', taktiAsiyor ? 'bg-rose-500' : 'bg-indigo-500')}>
        <DebouncedField
          initialValue={data.label}
          onCommit={(value) => updateVsmNode(id, { label: value })}
          className="w-full min-w-0 border-none bg-transparent text-center placeholder-white/60 focus:outline-none"
          placeholder={t('vsm_process_name')}
        />
        {/* Darboğaz: çevrim süresi takt'ı aşıyor. VSM'in asıl aradığı şey bu. */}
        {taktiAsiyor && <AlertTriangle size={14} className="shrink-0" aria-label={t('vsm_takt_exceeded')} />}
      </div>

      <div className="p-1 text-[11px]">
        <div className="grid grid-cols-[auto_1fr] items-center gap-1 border-b border-slate-200 py-0.5 dark:border-slate-700">
          <span className="px-1 font-semibold text-slate-600 dark:text-slate-300">{t('vsm_cycle_time')}</span>
          <SureAlani sure={data.cycleTime} onCommit={(s) => updateVsmNode(id, { cycleTime: s })} ariaLabel={t('vsm_cycle_time')} />
        </div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-1 border-b border-slate-200 py-0.5 dark:border-slate-700">
          <span className="px-1 font-semibold text-slate-600 dark:text-slate-300">{t('vsm_changeover_time')}</span>
          <SureAlani sure={data.changeoverTime} onCommit={(s) => updateVsmNode(id, { changeoverTime: s })} ariaLabel={t('vsm_changeover_time')} />
        </div>
        <div className="grid grid-cols-3 gap-1 border-b border-slate-200 py-0.5 dark:border-slate-700">
          <label className="flex flex-col px-0.5">
            <span className="text-[9px] font-semibold uppercase text-slate-500">{t('vsm_uptime')}</span>
            <SayiAlani deger={data.uptime} onCommit={(v) => updateVsmNode(id, { uptime: v })} ariaLabel={t('vsm_uptime')}
              className="w-full rounded border border-slate-200 bg-slate-50 px-1 text-end tabular-nums dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="flex flex-col px-0.5">
            <span className="text-[9px] font-semibold uppercase text-slate-500">{t('vsm_fpy')}</span>
            <SayiAlani deger={data.fpy} onCommit={(v) => updateVsmNode(id, { fpy: v })} ariaLabel={t('vsm_fpy')}
              className="w-full rounded border border-slate-200 bg-slate-50 px-1 text-end tabular-nums dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="flex flex-col px-0.5">
            <span className="flex items-center gap-0.5 text-[9px] font-semibold uppercase text-slate-500"><Users size={9} />{t('vsm_operators')}</span>
            <SayiAlani deger={data.operatorSayisi} onCommit={(v) => updateVsmNode(id, { operatorSayisi: v })} ariaLabel={t('vsm_operators')}
              className="w-full rounded border border-slate-200 bg-slate-50 px-1 text-end tabular-nums dark:border-slate-700 dark:bg-slate-900" />
          </label>
        </div>

        {customFields.map((field: any) => (
          <div key={field.id} className="group/field grid grid-cols-[1fr_1fr_auto] items-center gap-1 border-b border-slate-200 py-0.5 dark:border-slate-700">
            <DebouncedField initialValue={field.name} onCommit={(v) => alanGuncelle(field.id, { name: v })}
              className="w-full min-w-0 rounded border-none bg-transparent px-1 font-semibold text-slate-600 focus:bg-slate-100 focus:outline-none dark:text-slate-300 dark:focus:bg-slate-900" />
            <DebouncedField initialValue={field.value} onCommit={(v) => alanGuncelle(field.id, { value: v })}
              className="w-full min-w-0 rounded border border-slate-200 bg-slate-50 px-1 text-end dark:border-slate-700 dark:bg-slate-900" />
            <button onClick={() => alanSil(field.id)} className="text-slate-400 opacity-100 hover:text-rose-500 md:opacity-0 md:group-hover/field:opacity-100"
              title={t('delete')} aria-label={t('delete')}><X size={11} /></button>
          </div>
        ))}

        <button onClick={alanEkle}
          className="mt-0.5 flex w-full items-center justify-center gap-1 rounded py-0.5 text-indigo-500 opacity-100 transition-opacity hover:bg-indigo-50 md:opacity-0 md:group-hover:opacity-100 dark:hover:bg-indigo-500/20">
          <Plus size={11} /> {t('vsm_add_metric')}
        </button>
      </div>
    </div>
  );
}

export function VsmSupplierCustomerNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);
  const musteri = data.rol === 'musteri';

  return (
    <div style={gsl('vsmSupplierCustomer')} className="group relative flex flex-col items-center">
      <Tutamaklar renk="!bg-slate-500" />

      {/* Fabrika çatısı */}
      <div className="flex h-6 w-full items-end justify-between px-1">
        {[15, 20, 15].map((h, i) => (
          <div key={i} className="h-0 w-0 border-x-[10px] border-x-transparent border-b-slate-600 dark:border-b-slate-400"
            style={{ borderBottomWidth: h }} />
        ))}
      </div>

      <div className="relative z-10 flex w-full flex-col items-center border-2 border-slate-600 bg-white px-1 py-1.5 shadow-sm dark:border-slate-400 dark:bg-slate-800">
        <Factory className="mb-0.5 h-5 w-5 text-slate-500" />
        <DebouncedField
          initialValue={data.label}
          onCommit={(value) => updateVsmNode(id, { label: value })}
          className="w-full border-none bg-transparent text-center text-sm font-bold text-slate-800 focus:outline-none dark:text-slate-100"
          placeholder={musteri ? t('vsm_add_customer') : t('vsm_add_supplier')}
        />
        {/* Rol, bilgi oklarının yönünü okumayı kolaylaştırıyor. */}
        <button
          onClick={() => updateVsmNode(id, { rol: musteri ? 'tedarikci' : 'musteri' })}
          className="nodrag mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          {musteri ? t('vsm_role_customer') : t('vsm_role_supplier')}
        </button>
      </div>
    </div>
  );
}

export function VsmInventoryNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);
  // Süre elle girilmişse adet alanı devre dışı; ikisi birden hesaba girmez.
  const sureVar = data.beklemeSuresi !== undefined;

  return (
    <div style={gsl('vsmInventory')} className="relative flex flex-col items-center">
      <Tutamaklar renk="!bg-amber-500" />

      <Triangle size={40} className="fill-amber-100 text-amber-500 dark:fill-amber-900/40" strokeWidth={1.5} />
      <DebouncedField
        initialValue={data.label}
        onCommit={(value) => updateVsmNode(id, { label: value })}
        className="-mt-1 w-full border-none bg-transparent text-center text-[11px] font-bold text-amber-700 focus:outline-none dark:text-amber-400"
        placeholder="I"
      />

      <div className="mt-0.5 w-full rounded border border-amber-300 bg-white px-1 py-0.5 text-[10px] shadow-sm dark:border-amber-600 dark:bg-slate-800">
        <label className="flex items-center justify-between gap-1">
          <span className="text-slate-500">{t('vsm_pieces')}</span>
          <SayiAlani
            deger={data.adet}
            onCommit={(v) => updateVsmNode(id, { adet: v })}
            ariaLabel={t('vsm_inventory_pieces')}
            className={clsx('w-10 rounded bg-transparent text-end tabular-nums focus:outline-none', sureVar && 'text-slate-300 dark:text-slate-600')}
          />
        </label>
      </div>

      {/* Sayım yoksa süre doğrudan girilebilsin. */}
      <div className="mt-0.5 w-full">
        {sureVar ? (
          <div className="flex items-center gap-0.5">
            <SureAlani sure={data.beklemeSuresi} onCommit={(s) => updateVsmNode(id, { beklemeSuresi: s })} ariaLabel={t('vsm_wait_time')} />
            <button onClick={() => updateVsmNode(id, { beklemeSuresi: undefined })} className="nodrag text-slate-400 hover:text-rose-500"
              title={t('vsm_use_pieces')} aria-label={t('vsm_use_pieces')}><X size={11} /></button>
          </div>
        ) : (
          <button
            onClick={() => updateVsmNode(id, { beklemeSuresi: { deger: 0, birim: 'day' } })}
            className="nodrag w-full rounded py-0.5 text-[10px] text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
          >
            {t('vsm_enter_wait_time')}
          </button>
        )}
      </div>
    </div>
  );
}

export function VsmSupermarketNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);

  return (
    <div style={gsl('vsmSupermarket')} className="relative">
      <Tutamaklar renk="!bg-teal-500" />
      {/* Süpermarket: sağa açık üç raf. */}
      <div className="border-2 border-teal-500 bg-white dark:bg-slate-800">
        <div className="border-b-2 border-teal-500 py-0.5 text-center">
          <DebouncedField
            initialValue={data.label}
            onCommit={(value) => updateVsmNode(id, { label: value })}
            className="w-full border-none bg-transparent text-center text-xs font-bold text-teal-700 focus:outline-none dark:text-teal-300"
            placeholder={t('vsm_add_supermarket')}
          />
        </div>
        <div className="flex flex-col gap-px py-0.5 ps-0">
          {[0, 1].map((i) => <div key={i} className="h-1.5 w-2/3 border-y border-e border-teal-400" />)}
        </div>
        <label className="flex items-center justify-between gap-1 border-t border-teal-200 px-1 py-0.5 text-[10px] dark:border-teal-800">
          <span className="text-slate-500">{t('vsm_pieces')}</span>
          <SayiAlani deger={data.adet} onCommit={(v) => updateVsmNode(id, { adet: v })} ariaLabel={t('vsm_inventory_pieces')}
            className="w-10 rounded bg-transparent text-end tabular-nums focus:outline-none" />
        </label>
      </div>
    </div>
  );
}

export function VsmProductionControlNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);

  return (
    <div style={gsl('vsmProductionControl')} className="relative border-2 border-slate-600 bg-white shadow-sm dark:border-slate-400 dark:bg-slate-800">
      <Tutamaklar renk="!bg-slate-500" />
      <div className="flex items-center gap-1 border-b border-slate-200 px-2 py-1 dark:border-slate-700">
        <ClipboardList size={14} className="shrink-0 text-slate-500" />
        <DebouncedField
          initialValue={data.label}
          onCommit={(value) => updateVsmNode(id, { label: value })}
          className="w-full min-w-0 border-none bg-transparent text-sm font-bold text-slate-800 focus:outline-none dark:text-slate-100"
          placeholder={t('vsm_add_production_control')}
        />
      </div>
      <div className="px-2 py-1">
        <DebouncedField
          initialValue={data.sistem ?? ''}
          onCommit={(value) => updateVsmNode(id, { sistem: value })}
          className="w-full border-none bg-transparent text-[11px] text-slate-500 focus:outline-none dark:text-slate-400"
          placeholder={t('vsm_control_system')}
        />
      </div>
    </div>
  );
}

export function VsmShipmentNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);

  return (
    <div style={gsl('vsmShipment')} className="relative flex flex-col items-center border-2 border-slate-500 bg-white py-1 shadow-sm dark:bg-slate-800">
      <Tutamaklar renk="!bg-slate-500" />
      <Truck size={20} className="text-slate-500" />
      <DebouncedField
        initialValue={data.label}
        onCommit={(value) => updateVsmNode(id, { label: value })}
        className="w-full border-none bg-transparent text-center text-xs font-bold text-slate-700 focus:outline-none dark:text-slate-200"
        placeholder={t('vsm_add_shipment')}
      />
      <DebouncedField
        initialValue={data.siklik ?? ''}
        onCommit={(value) => updateVsmNode(id, { siklik: value })}
        className="w-full border-none bg-transparent text-center text-[10px] text-slate-500 focus:outline-none"
        placeholder={t('vsm_shipment_frequency')}
      />
    </div>
  );
}

export function VsmKaizenNode({ data, id }: any) {
  const { t } = useTranslation();
  const updateVsmNode = useRoadmapStore((s) => s.updateVsmNode);

  return (
    <div style={gsl('vsmKaizen')} className="relative">
      <Tutamaklar renk="!bg-rose-500" />
      {/* Kaizen patlaması: iyileştirme yapılacak noktanın standart işareti. */}
      <div
        className="flex min-h-[76px] flex-col items-center justify-center bg-rose-100 px-3 py-2 text-center dark:bg-rose-500/20"
        style={{ clipPath: 'polygon(50% 0%, 61% 18%, 80% 10%, 78% 31%, 98% 35%, 84% 50%, 98% 65%, 78% 69%, 80% 90%, 61% 82%, 50% 100%, 39% 82%, 20% 90%, 22% 69%, 2% 65%, 16% 50%, 2% 35%, 22% 31%, 20% 10%, 39% 18%)' }}
      >
        <Zap size={14} className="text-rose-600 dark:text-rose-300" />
        <DebouncedField
          initialValue={data.label}
          onCommit={(value) => updateVsmNode(id, { label: value })}
          className="w-full border-none bg-transparent text-center text-[11px] font-bold text-rose-700 focus:outline-none dark:text-rose-200"
          placeholder={t('vsm_kaizen_placeholder')}
          multiline
          rows={2}
        />
      </div>
    </div>
  );
}

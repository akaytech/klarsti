import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, ExternalLink, Link2, Clock, GitBranch } from 'lucide-react';
import clsx from 'clsx';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { RoadmapKaynakTuru, RoadmapNode } from '../store/slices/createRoadmapSlice';
import { ROADMAP_DURUMLARI, KAYNAK_TURLERI, guvenliAdres } from '../config/roadmapDurum';
import DebouncedField from './DebouncedField';

/**
 * Bir kutunun ayrıntısı: durumu, süresi, notu ve kaynak bağlantıları.
 *
 * Neden ayrı bir panel: roadmap.sh'te bir konuya tıklayınca açılan kutunun
 * asıl işi kaynakları göstermek. Bunlar kutunun içine sığmaz; kutu kısa
 * kalmalı ki harita okunabilsin, ayrıntı ise yanda dursun.
 */
export default function RoadmapDetayPaneli({ node, onClose }: { node: RoadmapNode; onClose: () => void }) {
  const { t } = useTranslation();
  const {
    updateRoadmapNode, setRoadmapStatus, toggleRoadmapSecmeli,
    addRoadmapKaynak, updateRoadmapKaynak, deleteRoadmapKaynak
  } = useRoadmapStore(useShallow((s) => ({
    updateRoadmapNode: s.updateRoadmapNode,
    setRoadmapStatus: s.setRoadmapStatus,
    toggleRoadmapSecmeli: s.toggleRoadmapSecmeli,
    addRoadmapKaynak: s.addRoadmapKaynak,
    updateRoadmapKaynak: s.updateRoadmapKaynak,
    deleteRoadmapKaynak: s.deleteRoadmapKaynak
  })));

  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniUrl, setYeniUrl] = useState('');
  const [yeniTur, setYeniTur] = useState<RoadmapKaynakTuru>('yazi');
  const [adresHatasi, setAdresHatasi] = useState(false);

  const veri = node.data;
  const bolum = veri.tur === 'bolum';
  const kaynaklar = veri.kaynaklar || [];

  const kaynakEkle = () => {
    const baslik = yeniBaslik.trim();
    const adres = guvenliAdres(yeniUrl);
    if (!adres) { setAdresHatasi(true); return; }
    addRoadmapKaynak(node.id, { baslik: baslik || adres, url: adres, tur: yeniTur });
    setYeniBaslik('');
    setYeniUrl('');
    setAdresHatasi(false);
  };

  const alanSinifi = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-lime-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

  return (
    <aside
      // nowheel: panelin içinde tekerlek tuvali yakınlaştırmasın, listeyi kaydırsın.
      //
      // Üstten 68 piksel boşluk: paylaş / dışa aktar / kılavuz düğmeleri
      // tuvalin sağ üstünde duruyor ve panel tepeden başlarsa onların altında
      // kalıyor (bkz. Workspace). Panel biraz aşağıdan başlayınca ikisi de
      // görünür kalıyor.
      className="nowheel absolute end-0 top-[68px] z-[60] flex h-[calc(100%-68px)] w-[min(92vw,360px)] flex-col rounded-ss-2xl border-s border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-start gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t(veri.tur === 'bolum' ? 'roadmap_kind_bolum' : veri.tur === 'adim' ? 'roadmap_kind_adim' : 'roadmap_kind_konu')}
          </p>
          <DebouncedField
            key={node.id}
            initialValue={veri.label}
            onCommit={(deger) => { const temiz = deger.trim(); if (temiz) updateRoadmapNode(node.id, { label: temiz }); }}
            ariaLabel={t('roadmap_node_name')}
            className="mt-0.5 w-full bg-transparent text-base font-bold text-slate-800 outline-none dark:text-slate-100"
          />
        </div>
        <button
          onClick={onClose}
          aria-label={t('close')}
          className="-me-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </header>

      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {/* Bölüm başlığı bir iş değil; durumu, süresi ve seçmeliliği yok. */}
        {!bolum && (
          <>
            <section>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('roadmap_status')}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ROADMAP_DURUMLARI.map(({ durum, etiket, icon: Icon, metin, secili }) => {
                  const acik = (veri.durum || 'bekliyor') === durum;
                  return (
                    <button
                      key={durum}
                      onClick={() => setRoadmapStatus(node.id, durum)}
                      className={clsx(
                        'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors',
                        acik ? secili : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                      )}
                    >
                      <Icon size={14} className={acik ? undefined : metin} />
                      {t(etiket)}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex items-center gap-3">
              <label className="flex flex-1 items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Clock size={14} className="shrink-0" />
                {t('roadmap_duration')}
                <DebouncedField
                  key={`sure-${node.id}`}
                  type="number"
                  min="0"
                  initialValue={veri.sure ? String(veri.sure) : ''}
                  onCommit={(deger) => {
                    const sayi = Number(deger);
                    updateRoadmapNode(node.id, { sure: Number.isFinite(sayi) && sayi > 0 ? sayi : undefined });
                  }}
                  ariaLabel={t('roadmap_duration')}
                  placeholder="0"
                  className={clsx(alanSinifi, 'w-20 py-1.5 text-center')}
                />
              </label>
            </section>

            {veri.tur === 'konu' && (
              <section>
                <button
                  onClick={() => toggleRoadmapSecmeli(node.id)}
                  className={clsx(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors',
                    veri.secmeli
                      ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                  )}
                >
                  <GitBranch size={14} className="shrink-0" />
                  <span className="flex-1 text-start">{veri.secmeli ? t('roadmap_is_optional') : t('roadmap_make_optional')}</span>
                </button>
                <p className="mt-1.5 px-1 text-[11px] leading-relaxed text-slate-400">{t('roadmap_optional_hint')}</p>
              </section>
            )}
          </>
        )}

        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('roadmap_note')}</p>
          <DebouncedField
            key={`not-${node.id}`}
            multiline
            rows={4}
            initialValue={veri.description || ''}
            onCommit={(deger) => updateRoadmapNode(node.id, { description: deger.trim() || undefined })}
            placeholder={t('roadmap_note_placeholder')}
            ariaLabel={t('roadmap_note')}
            className={clsx(alanSinifi, 'resize-none leading-relaxed')}
          />
        </section>

        {!bolum && (
          <section>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('roadmap_resources')}</p>

            <div className="space-y-1.5">
              {kaynaklar.map((kaynak) => {
                const adres = guvenliAdres(kaynak.url);
                return (
                  <div
                    key={kaynak.id}
                    className="group flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700"
                  >
                    <Link2 size={13} className="mt-1 shrink-0 text-sky-500" />
                    <div className="min-w-0 flex-1">
                      <DebouncedField
                        key={`kb-${kaynak.id}`}
                        initialValue={kaynak.baslik}
                        onCommit={(deger) => updateRoadmapKaynak(node.id, kaynak.id, { baslik: deger.trim() || kaynak.url })}
                        ariaLabel={t('roadmap_resource_title')}
                        className="w-full bg-transparent text-[13px] font-bold text-slate-700 outline-none dark:text-slate-200"
                      />
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          {t(KAYNAK_TURLERI.find((k) => k.tur === kaynak.tur)?.etiket || 'roadmap_res_diger')}
                        </span>
                        {kaynak.ucretli && (
                          <span className="rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            {t('roadmap_res_paid')}
                          </span>
                        )}
                      </div>
                    </div>
                    {adres && (
                      <a
                        href={adres}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={t('roadmap_open_link')}
                        title={adres}
                        className="mt-0.5 shrink-0 text-slate-400 transition-colors hover:text-sky-600"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => deleteRoadmapKaynak(node.id, kaynak.id)}
                      aria-label={t('roadmap_delete_resource')}
                      className="mt-0.5 shrink-0 text-slate-300 transition-colors hover:text-red-500 dark:text-slate-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 space-y-1.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/50">
              <input
                value={yeniBaslik}
                onChange={(e) => setYeniBaslik(e.target.value)}
                placeholder={t('roadmap_resource_title')}
                aria-label={t('roadmap_resource_title')}
                className={clsx(alanSinifi, 'py-1.5 text-[13px]')}
              />
              <input
                value={yeniUrl}
                onChange={(e) => { setYeniUrl(e.target.value); setAdresHatasi(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') kaynakEkle(); }}
                placeholder="https://..."
                aria-label={t('roadmap_resource_url')}
                dir="ltr"
                className={clsx(alanSinifi, 'py-1.5 text-[13px]', adresHatasi && 'border-red-400 dark:border-red-500')}
              />
              {adresHatasi && <p className="px-1 text-[11px] font-semibold text-red-500">{t('roadmap_resource_url_invalid')}</p>}
              <div className="flex gap-1.5">
                <select
                  value={yeniTur}
                  onChange={(e) => setYeniTur(e.target.value as RoadmapKaynakTuru)}
                  aria-label={t('roadmap_resource_type')}
                  className={clsx(alanSinifi, 'flex-1 py-1.5 text-[13px]')}
                >
                  {KAYNAK_TURLERI.map((k) => (
                    <option key={k.tur} value={k.tur}>{t(k.etiket)}</option>
                  ))}
                </select>
                <button
                  onClick={kaynakEkle}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-lime-600 px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-lime-700"
                >
                  <Plus size={14} />
                  {t('roadmap_add_resource')}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

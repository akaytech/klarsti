import type { FormEvent, ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import DebouncedField from './DebouncedField';

/**
 * SWOT, balık kılçığı, PUKÖ ve şelale ekranlarının ortak parçaları.
 *
 * Dördü de aynı iskelette: üstte "yeni kayıt aç" satırı, altında kayıtlar,
 * her kaydın içinde kategorilere ayrılmış kalemler. Depo tarafı zaten ortak
 * (bkz. store/slices/kategoriliListe.ts); ekran tarafı dört ayrı kopyaydı.
 * Bir hatayı düzeltince üçü eski kalıyor, bir özellik eklemek dört kez
 * yazmak demek oluyordu.
 *
 * Burası yalnızca dördünde HARFİ HARFİNE aynı olan parçaları topluyor.
 * Araçların kendi düzeni dışarıda kaldı ve kalmalı: SWOT'un dörtlü kutusu,
 * kılçığın orta omurgası, PUKÖ'nün işaret kutucuğu, şelalenin kilit/aşama
 * mantığı birbirine benzemiyor; tek şablona zorlamak görünümü bozar.
 *
 * Sınıf isimleri parça parça birleştirilmiyor, bütün halinde geçiriliyor:
 * Tailwind derleme sırasında kaynakta yazılı sınıfları tarıyor, `bg-${renk}`
 * gibi kurulan bir isim çıktıya hiç girmiyor.
 */

/* ------------------------------------------------------------------ */
/* Yeni kayıt açma satırı                                             */
/* ------------------------------------------------------------------ */

const OLUSTUR_RENGI = {
  indigo: {
    odak: 'focus:border-indigo-500 dark:focus:border-indigo-500',
    dugme: 'bg-indigo-600 hover:bg-indigo-700',
  },
  cyan: {
    odak: 'focus:border-cyan-500 dark:focus:border-cyan-500',
    dugme: 'bg-cyan-600 hover:bg-cyan-700',
  },
  blue: {
    odak: 'focus:border-blue-500 dark:focus:border-blue-500',
    dugme: 'bg-blue-600 hover:bg-blue-700',
  },
} as const;

interface OlusturSatiriProps {
  deger: string;
  onDegisti: (deger: string) => void;
  onGonder: (e: FormEvent) => void;
  ipucu: string;
  dugmeYazisi: string;
  renk: keyof typeof OLUSTUR_RENGI;
}

/**
 * Dar ekranda alt alta: yan yanayken metin kutusu küçülmüyor ve düğme
 * ekranın dışında kalıyordu, telefonda ilk kayıt açılamıyordu.
 */
export function OlusturSatiri({ deger, onDegisti, onGonder, ipucu, dugmeYazisi, renk }: OlusturSatiriProps) {
  const { odak, dugme } = OLUSTUR_RENGI[renk];
  return (
    <form onSubmit={onGonder} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={deger}
        onChange={(e) => onDegisti(e.target.value)}
        placeholder={ipucu}
        className={clsx(
          'min-w-0 flex-1 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 text-lg outline-none shadow-sm text-slate-800 dark:text-slate-100',
          odak,
        )}
      />
      <button
        type="submit"
        disabled={!deger.trim()}
        className={clsx(
          'flex shrink-0 items-center justify-center gap-2 rounded-2xl px-8 py-4 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50',
          dugme,
        )}
      >
        <Plus size={24} />
        <span className="font-bold">{dugmeYazisi}</span>
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Hiç kayıt yokken görünen satır                                     */
/* ------------------------------------------------------------------ */

/**
 * Tek satır: eskiden 64 piksellik simge ve iki kat boşluk vardı, ekranı
 * oluşturma satırından uzaklaştırıyordu.
 */
export function BosDurum({ simge, metin }: { simge: ReactNode; metin: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-10 text-slate-400 dark:text-slate-500">
      {simge}
      <p className="text-sm">{metin}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kayıt başlığı: simge + düzenlenebilir ad + sil düğmesi             */
/* ------------------------------------------------------------------ */

interface KayitBasligiProps {
  /** Kaydın kendi ölçüsü: alt boşluk, z sırası gibi araca özgü sınıflar. */
  disSinif?: string;
  /** Simge kutusunun ölçüsü ve rengi. */
  simgeKutusu: string;
  simge: ReactNode;
  ad: string;
  onAdKaydet: (deger: string) => void;
  /** Ad alanının yazı ölçüsü/kalınlığı. */
  adSinifi: string;
  adEtiketi: string;
  onSil: () => void;
}

/**
 * Kılçık, PUKÖ ve şelalenin kayıt başlığı. SWOT bunu kullanmıyor: onun
 * başlığı ince, simgesiz ve sil düğmesi yazısız — ayrı bir görünüm.
 */
export function KayitBasligi({
  disSinif,
  simgeKutusu,
  simge,
  ad,
  onAdKaydet,
  adSinifi,
  adEtiketi,
  onSil,
}: KayitBasligiProps) {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800',
        disSinif,
      )}
    >
      <div className="flex-1 flex items-center gap-4">
        <div className={clsx('flex shrink-0 items-center justify-center shadow-inner', simgeKutusu)}>{simge}</div>
        <DebouncedField
          initialValue={ad}
          onCommit={onAdKaydet}
          className={clsx(
            'flex-1 bg-transparent text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-300',
            adSinifi,
          )}
          ariaLabel={adEtiketi}
        />
      </div>
      <button
        onClick={onSil}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
      >
        <Trash2 size={18} />
        {t('delete')}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tek kalem kartı                                                     */
/* ------------------------------------------------------------------ */

interface KalemKartiProps {
  /** Kartın zemini, kenarlığı, boşluğu: araca göre değişiyor. */
  sinif: string;
  /** Metnin solunda duran şey — kılçığın oku, PUKÖ'nün işaret kutucuğu. */
  basta?: ReactNode;
  metin: string;
  onKaydet: (deger: string) => void;
  alanSinifi: string;
  /** Şelalede tamamlanmış aşamanın kalemleri düzenlenemiyor. */
  alanKapali?: boolean;
  /** Verilmezse sil düğmesi hiç çizilmiyor. */
  onSil?: () => void;
  silSinifi?: string;
  silSimgesi?: number;
}

export function KalemKarti({
  sinif,
  basta,
  metin,
  onKaydet,
  alanSinifi,
  alanKapali,
  onSil,
  silSinifi,
  silSimgesi = 16,
}: KalemKartiProps) {
  const { t } = useTranslation();
  return (
    <div className={clsx('group relative flex items-start rounded-xl border shadow-sm', sinif)}>
      {basta}
      <DebouncedField
        multiline
        initialValue={metin}
        onCommit={onKaydet}
        disabled={alanKapali}
        className={clsx('flex-1 resize-none bg-transparent outline-none', alanSinifi)}
        rows={2}
        ariaLabel={t('item_text_label')}
      />
      {onSil && (
        <button
          onClick={onSil}
          aria-label={t('delete')}
          className={clsx(
            'absolute end-2 top-2 p-2 text-slate-400 hover:text-red-500 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100',
            silSinifi,
          )}
        >
          <Trash2 size={silSimgesi} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kalem ekleme satırı                                                 */
/* ------------------------------------------------------------------ */

/** Üç araçta ortak olan artı düğmesi ölçüsü. Kılçığınki daha küçük. */
export const EKLE_DUGMESI =
  'h-10 w-10 shrink-0 rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100';

interface KalemEkleSatiriProps {
  deger: string;
  onDegisti: (deger: string) => void;
  onGonder: (e: FormEvent) => void;
  ipucu: string;
  formSinifi?: string;
  girdiSinifi: string;
  /** Düğmenin ölçüsü ve rengi; kategoriye göre değişiyor. */
  dugmeSinifi: string;
  artiBoyutu?: number;
}

export function KalemEkleSatiri({
  deger,
  onDegisti,
  onGonder,
  ipucu,
  formSinifi,
  girdiSinifi,
  dugmeSinifi,
  artiBoyutu = 20,
}: KalemEkleSatiriProps) {
  return (
    <form onSubmit={onGonder} className={clsx('flex gap-2', formSinifi)}>
      <input
        type="text"
        value={deger}
        onChange={(e) => onDegisti(e.target.value)}
        placeholder={ipucu}
        className={clsx(
          'flex-1 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-slate-400 text-slate-800 dark:text-slate-100',
          girdiSinifi,
        )}
      />
      <button
        type="submit"
        disabled={!deger.trim()}
        aria-label={ipucu}
        className={clsx('flex items-center justify-center text-white shadow-sm disabled:opacity-50', dugmeSinifi)}
      >
        <Plus size={artiBoyutu} />
      </button>
    </form>
  );
}

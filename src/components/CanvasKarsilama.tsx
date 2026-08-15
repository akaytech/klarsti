import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Boş tuvalde çıkan karşılama şeridi.
 *
 * Eskiden her tuval kendi panelini yazıyordu ve beşi de birbirinden biraz
 * farklıydı. Ortak hale getirilmesinin sebebi tekrar değil, boyuttu: panel
 * 448×402 pikseldi, 800 piksellik ekranın yarısını kaplıyor ve tam ortada
 * durup tuvalin kendisini gizliyordu. Küçülten üç karar:
 *
 *   - 64 piksellik dekoratif simge kutusu gitti. Hiçbir şey anlatmıyordu;
 *     yerine başlığın yanında 18 piksellik simge var.
 *   - Üç düğme alt alta tam genişlikte duruyordu. Artık tek satır: asıl
 *     eylem dolu düğme, örnek şablon sade bir bağlantı. İkisi de aynı
 *     ağırlıkta olunca göz hangisine basacağını seçemiyordu.
 *   - "Nasıl çalışır?" düğmesi kalktı. Kılavuz zaten sağ üstteki düğmede
 *     duruyor ve araç ilk açıldığında kendiliğinden açılıyor
 *     (bkz. Workspace); aynı şey üçüncü kez tekrar ediliyordu.
 *
 * Kapatma işareti yeni: eskiden paneli kaldırmanın tek yolu düğmelerden
 * birine basmaktı, sadece tuvale bakmak isteyen kullanıcı sıkışıyordu.
 */

/** Tema sınıfları burada tam yazılıyor; Tailwind ancak böyle görüp üretiyor. */
const TEMALAR = {
  indigo: {
    simge: 'text-indigo-500 dark:text-indigo-400',
    dugme: 'bg-indigo-600 hover:bg-indigo-700',
    baglanti: 'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
  },
  purple: {
    simge: 'text-purple-500 dark:text-purple-400',
    dugme: 'bg-purple-600 hover:bg-purple-700',
    baglanti: 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
  }
} as const;

export type KarsilamaTemasi = keyof typeof TEMALAR;

interface Eylem {
  etiket: string;
  onClick: () => void;
}

export default function CanvasKarsilama({
  simge,
  baslik,
  aciklama,
  birincil,
  ikincil,
  tema = 'indigo',
  onKapat
}: {
  simge: ReactNode;
  /** Kısa hallerde (zihin haritası, değer akışı) yalnız açıklama var. */
  baslik?: string;
  aciklama: string;
  birincil: Eylem;
  ikincil?: Eylem;
  tema?: KarsilamaTemasi;
  onKapat?: () => void;
}) {
  const { t } = useTranslation();
  const renk = TEMALAR[tema];

  return (
    // Genişlik dar ekranda daralıyor: sabit 420 piksel telefonda taşıyordu.
    <div className="w-[min(88vw,420px)] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 shrink-0 ${renk.simge}`} aria-hidden>
          {simge}
        </span>
        <div className="min-w-0 flex-1">
          {baslik && (
            <p className="text-sm font-bold leading-snug text-slate-800 dark:text-slate-100">{baslik}</p>
          )}
          <p className={`text-xs leading-relaxed text-slate-500 dark:text-slate-400 ${baslik ? 'mt-0.5' : ''}`}>
            {aciklama}
          </p>
        </div>
        {onKapat && (
          <button
            onClick={onKapat}
            aria-label={t('close')}
            className="-me-1.5 -mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          onClick={birincil.onClick}
          className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors ${renk.dugme}`}
        >
          {birincil.etiket}
        </button>
        {ikincil && (
          <button
            onClick={ikincil.onClick}
            className={`text-sm font-semibold transition-colors ${renk.baglanti}`}
          >
            {ikincil.etiket}
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import ConfirmModal from './ConfirmModal';
import { useDisariTiklama } from '../utils/menuKapatma';
import { MenuPortal } from '../utils/MenuPortal';
import { useSiraSurukleme } from '../utils/siraSurukleme';

/** Listenin genişliği; satır menüsü buna göre sıkıştırılıyor. */
const GENISLIKLER = { dar: 288, genis: 320 };
const SATIR_MENUSU_GENISLIGI = 190;

export interface CalismaOgesi {
  id: string;
  name: string;
  /** Satırın kendi simgesi; verilmezse menünün simgesi kullanılır. */
  Simge?: LucideIcon;
  /** Sağda görünen küçük not: kutu sayısı, yüzde, durum etiketi. */
  rozet?: ReactNode;
}

export interface CalismaMenusuMetinleri {
  /** Listenin üstündeki başlık. */
  baslik: string;
  /** "Yeni ..." düğmesi. */
  yeni: string;
  /** "... adını değiştir" düğmesi. */
  yenidenAdlandir: string;
  /** Ad kutusunun erişilebilirlik etiketi. */
  ad: string;
  /** Silme düğmesi ve onay penceresinin başlığı. */
  sil: string;
  /** Onay penceresinin metni; `{{ad}}` ile çeviri anahtarı. */
  silMesaji: string;
}

interface Props {
  Simge: LucideIcon;
  aktifId: string;
  ogeler: CalismaOgesi[];
  onSec: (id: string) => void;
  onEkle: () => void;
  onYenidenAdlandir: (id: string, ad: string) => void;
  onSil: (id: string) => void;
  /**
   * Sıralama. Verilmezse ne sürükleme ne de taşıma maddeleri çıkar; henüz
   * sıralama eylemi olmayan bir araç menüyü yine de kullanabilsin diye
   * isteğe bağlı.
   */
  onSirala?: (id: string, hedefIndex: number) => void;
  /** false dönerse o çalışma silinemez (kırılım ağacının son ağacı gibi). */
  silinebilirMi?: (id: string) => boolean;
  /** Tetik düğmesinde adın yanına eklenen rozet. */
  tetikEki?: ReactNode;
  /** "Yeni" düğmesinin altına eklenen araca özel eylemler. */
  ekEylemler?: (kapat: () => void) => ReactNode;
  /** Silme düğmesinin üstüne eklenen bölüm (akış şemasının tür bilgisi). */
  altBolum?: ReactNode;
  /** Değer akışının tür etiketi dar listeye sığmıyor. */
  genis?: boolean;
  /** Aracın vurgu rengi. Tailwind sınıfları tam yazılmalı, o yüzden iki hazır set. */
  tema?: 'indigo' | 'lime';
  metinler: CalismaMenusuMetinleri;
}

const TEMALAR = {
  indigo: {
    yeni: 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20',
    isaret: 'text-indigo-500',
    kutu: 'border-indigo-300 dark:border-indigo-500'
  },
  lime: {
    yeni: 'text-lime-700 hover:bg-lime-50 dark:text-lime-400 dark:hover:bg-lime-900/20',
    isaret: 'text-lime-600',
    kutu: 'border-lime-400 dark:border-lime-500'
  }
} as const;

/**
 * Kanvasların sol üstündeki çalışma menüsü: aynı klasördeki çalışmalar
 * arasında geçiş, yeni çalışma, ad değiştirme, silme ve sıralama.
 *
 * Altı araç bunun kendi kopyasını taşıyordu (kırılım ağacı, zihin haritası,
 * değer akışı, şema motoru, yol haritası, 5 neden/hata ağacı/zaman çizelgesi
 * için AnalysisMenu). Kopyalar birbirinden çoktan ayrılmıştı: kimi dışarı
 * tıklamayla kapanıyordu kimi kapanmıyordu, hiçbirinde satır menüsü ya da
 * sıralama yoktu. Araca özel olan ne varsa artık prop olarak geliyor.
 */
export default function CalismaMenusu({
  Simge, aktifId, ogeler, onSec, onEkle, onYenidenAdlandir, onSil, onSirala,
  silinebilirMi, tetikEki, ekEylemler, altBolum, genis, tema = 'indigo', metinler
}: Props) {
  const { t } = useTranslation();
  const aktif = ogeler.find((o) => o.id === aktifId) ?? ogeler[0];

  const [acik, setAcik] = useState(false);
  /** Adı düzenlenen çalışma. */
  const [adDuzenlenen, setAdDuzenlenen] = useState<string | null>(null);
  const [ad, setAd] = useState('');
  const [silinecek, setSilinecek] = useState<CalismaOgesi | null>(null);
  /** Satır menüsünün, kabın sol üst köşesine göre konumu. */
  const [satirMenusu, setSatirMenusu] = useState<{ id: string; top: number; left: number } | null>(null);

  const kapRef = useRef<HTMLDivElement>(null);
  const listeRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLInputElement>(null);

  const surukleme = useSiraSurukleme(listeRef, onSirala, acik);

  // Menü dışarı tıklanınca kapanıyor: kanvasa, kutuya, üst bara, nereye olursa.
  // Eskiden yalnızca kanvasın "hepsini kapat" yayınını dinliyordu; o yayını
  // göndermeyen araçlarda (zihin haritası, yol haritası, zaman çizelgesi) menü
  // açık kalıyordu. Açma düğmesi de kabın içinde; ona basmak "dışarı"
  // sayılmıyor, yoksa menü kapanıp aynı tıklamayla yeniden açılırdı.
  useDisariTiklama(kapRef, () => {
    setAcik(false);
    setAdDuzenlenen(null);
    setSatirMenusu(null);
  });

  useEffect(() => {
    if (adDuzenlenen) adRef.current?.select();
  }, [adDuzenlenen]);

  if (!aktif) return null;

  const renk = TEMALAR[tema];
  const listeGenisligi = genis ? GENISLIKLER.genis : GENISLIKLER.dar;

  const adaBasla = (oge: CalismaOgesi) => {
    setSatirMenusu(null);
    setAd(oge.name);
    setAdDuzenlenen(oge.id);
  };

  const adiKaydet = () => {
    if (!adDuzenlenen) return;
    const temiz = ad.trim();
    const oge = ogeler.find((o) => o.id === adDuzenlenen);
    if (temiz && oge && temiz !== oge.name) onYenidenAdlandir(adDuzenlenen, temiz);
    setAdDuzenlenen(null);
  };

  const satirTiklandi = (id: string) => {
    if (surukleme.tiklamaYutuldu()) return;
    onSec(id);
    setAcik(false);
  };

  const satirMenusuAc = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const kap = kapRef.current?.getBoundingClientRect();
    if (!kap) return;
    setAdDuzenlenen(null);
    // Menü kabın İÇİNDE duruyor, konumu da kaba göre. Ekranın üstüne portalla
    // taşınsaydı, menüye yapılan tıklama "listenin dışına tıklandı" sayılır ve
    // liste tam da adını değiştirmek için bastığın anda kapanırdı.
    setSatirMenusu({
      id,
      top: Math.max(4, e.clientY - kap.top),
      left: Math.min(Math.max(4, e.clientX - kap.left), listeGenisligi - SATIR_MENUSU_GENISLIGI)
    });
  };

  const menuOgesi = satirMenusu ? ogeler.find((o) => o.id === satirMenusu.id) : undefined;
  const menuSirasi = menuOgesi ? ogeler.findIndex((o) => o.id === menuOgesi.id) : -1;
  const menuSatiri = 'flex w-full items-center gap-3 px-3 py-2 text-start text-sm transition-colors';
  const menuSade = 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50';
  const silinebilir = (id: string) => (silinebilirMi ? silinebilirMi(id) : true);

  const adKutusu = (
    <input
      ref={adRef}
      value={ad}
      onChange={(e) => setAd(e.target.value)}
      onBlur={adiKaydet}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') adiKaydet();
        if (e.key === 'Escape') setAdDuzenlenen(null);
      }}
      aria-label={metinler.ad}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none dark:bg-slate-900 dark:text-slate-100 ${renk.kutu}`}
    />
  );

  return (
    <div className="relative" ref={kapRef}>
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex max-w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <Simge size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        {tetikEki}
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div
          className="absolute start-0 top-12 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          style={{ width: listeGenisligi }}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {metinler.baslik}
          </div>

          <div ref={listeRef} className="custom-scrollbar max-h-48 overflow-y-auto">
            {ogeler.map((oge, sira) => {
              const secili = oge.id === aktif.id;
              const SatirSimgesi = oge.Simge ?? Simge;

              if (adDuzenlenen === oge.id) {
                return <div key={oge.id} className="px-1 py-1">{adKutusu}</div>;
              }

              return (
                <button
                  key={oge.id}
                  data-sira-satiri=""
                  style={surukleme.satirStili(sira)}
                  onClick={() => satirTiklandi(oge.id)}
                  onContextMenu={(e) => satirMenusuAc(e, oge.id)}
                  onPointerDown={(e) => { if (!adDuzenlenen) surukleme.onPointerDown(e, oge.id, sira); }}
                  onPointerMove={surukleme.onPointerMove}
                  onPointerUp={surukleme.onPointerUp}
                  onPointerCancel={surukleme.onPointerUp}
                  className={clsx(
                    'group flex w-full items-center gap-2 rounded-xl py-2 text-start text-sm font-semibold transition-colors',
                    onSirala ? 'px-2' : 'px-3',
                    secili
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50',
                    surukleme.suruklenenId === oge.id && 'shadow-lg ring-2 ring-slate-300 dark:ring-slate-500'
                  )}
                >
                  {/* Tutamak yalnızca imleç satırın üstündeyken beliriyor:
                      satırın sürüklenebildiğini söylüyor ama listeyi kalabalık
                      etmiyor. Sürükleme satırın her yerinden başlıyor. */}
                  {onSirala && (
                    <GripVertical
                      size={14}
                      className="shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500"
                    />
                  )}
                  <SatirSimgesi size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{oge.name}</span>
                  {oge.rozet !== undefined && (
                    <span className="shrink-0 text-[11px] font-bold text-slate-400">{oge.rozet}</span>
                  )}
                  {secili && <Check size={14} className={`shrink-0 ${renk.isaret}`} />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { onEkle(); setAcik(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold transition-colors ${renk.yeni}`}
          >
            <Plus size={16} className="shrink-0" />
            {metinler.yeni}
          </button>

          {ekEylemler?.(() => setAcik(false))}

          <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

          {/* Aşağısı açık çalışma için; listedeki ötekilere sağ tık menüsünden
              erişiliyor. Ad kutusu buraya değil, yukarıdaki KENDİ SATIRINA
              açılıyor: iki yerde birden çizilince aynı ref'i paylaşan iki
              kutu oluyor ve yazılan yazı ikisine birden düşüyordu. */}
          <button
            onClick={() => adaBasla(aktif)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <Pencil size={16} className="shrink-0 text-slate-400" />
            {metinler.yenidenAdlandir}
          </button>

          {altBolum}

          {silinebilir(aktif.id) && (
            <button
              onClick={() => { setAcik(false); setSilinecek(aktif); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} className="shrink-0" />
              {metinler.sil}
            </button>
          )}
        </div>
      )}

      {satirMenusu && menuOgesi && (
        <div
          className="context-menu absolute z-10 w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
          style={{ top: satirMenusu.top, insetInlineStart: satirMenusu.left }}
        >
          <button onClick={() => adaBasla(menuOgesi)} className={`${menuSatiri} ${menuSade}`}>
            <Pencil size={15} className="text-slate-400" />
            {t('rename_title')}
          </button>

          {onSirala && menuSirasi > 0 && (
            <button
              onClick={() => { onSirala(menuOgesi.id, menuSirasi - 1); setSatirMenusu(null); }}
              className={`${menuSatiri} ${menuSade}`}
            >
              <ArrowUp size={15} className="text-slate-400" />
              {t('menu_move_up')}
            </button>
          )}

          {onSirala && menuSirasi >= 0 && menuSirasi < ogeler.length - 1 && (
            <button
              onClick={() => { onSirala(menuOgesi.id, menuSirasi + 1); setSatirMenusu(null); }}
              className={`${menuSatiri} ${menuSade}`}
            >
              <ArrowDown size={15} className="text-slate-400" />
              {t('menu_move_down')}
            </button>
          )}

          {silinebilir(menuOgesi.id) && (
            <>
              <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />
              <button
                onClick={() => { setSatirMenusu(null); setAcik(false); setSilinecek(menuOgesi); }}
                className={`${menuSatiri} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}
              >
                <Trash2 size={15} />
                {t('delete')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Onay penceresi body'ye taşınıyor: bu menü React Flow'un panelinin
          içinde duruyor ve panelin kendi katmanı, sağ üstteki düğmelerin
          altında kalıyor. Portalsız pencere perdesiyle birlikte o düğmelerin
          arkasına düşüyordu. */}
      <MenuPortal>
        <ConfirmModal
          isOpen={!!silinecek}
          onClose={() => setSilinecek(null)}
          onConfirm={() => { if (silinecek) onSil(silinecek.id); setSilinecek(null); }}
          title={metinler.sil}
          message={t(metinler.silMesaji, { ad: silinecek?.name ?? '' })}
        />
      </MenuPortal>
    </div>
  );
}

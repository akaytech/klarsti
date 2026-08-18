import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Pencil, Trash2, Check, Route, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { Roadmap } from '../store/slices/createRoadmapSlice';
import { roadmapIlerleme } from '../store/slices/createRoadmapSlice';
import ConfirmModal from './ConfirmModal';
import { useDisariTiklama } from '../utils/menuKapatma';
import { MenuPortal } from '../utils/MenuPortal';

/** Sürükleme sayılması için gereken en küçük hareket. */
const SURUKLEME_ESIGI = 5;

/** Açılır listenin genişliği; satır menüsü buna göre sıkıştırılıyor. */
const LISTE_GENISLIGI = 288;
const SATIR_MENUSU_GENISLIGI = 190;

/** Diziden bir öğeyi alıp başka bir sıraya koyar. */
function siraDegistir<T>(liste: T[], kaynak: number, hedef: number): T[] {
  const yeni = [...liste];
  const [tasinan] = yeni.splice(kaynak, 1);
  yeni.splice(hedef, 0, tasinan);
  return yeni;
}

/**
 * Kanvasın sol üstündeki harita menüsü: projedeki yol haritaları arasında
 * geçiş, yeni harita, ad değiştirme, silme ve sıralama.
 *
 * Zihin haritasındaki menünün eşi ama üç farkı var:
 *  - Listede her haritanın ilerleme yüzdesi görünüyor.
 *  - Bir satıra sağ tıklayınca (dokunmatikte basılı tutunca) o haritaya özel
 *    menü açılıyor. Alttaki düğmeler yalnızca AÇIK haritaya işliyor; listedeki
 *    başka bir haritayı silmek için önce ona geçmek gerekiyordu.
 *  - Satırlar fareyle sürüklenerek sıralanabiliyor. Sıra dizinin kendi sırası,
 *    yani buluta da öyle gidiyor (bkz. moveRoadmapTo).
 */
export default function RoadmapMapsMenu({ aktif }: { aktif: Roadmap }) {
  const { t } = useTranslation();
  const { roadmaps, setActiveRoadmap, addRoadmap, renameRoadmap, deleteRoadmap, moveRoadmapTo } = useRoadmapStore(useShallow((s) => ({
    roadmaps: s.roadmaps,
    setActiveRoadmap: s.setActiveRoadmap,
    addRoadmap: s.addRoadmap,
    renameRoadmap: s.renameRoadmap,
    deleteRoadmap: s.deleteRoadmap,
    moveRoadmapTo: s.moveRoadmapTo
  })));

  const [acik, setAcik] = useState(false);
  /** Adı düzenlenen haritanın kimliği. */
  const [adDuzenlenen, setAdDuzenlenen] = useState<string | null>(null);
  const [ad, setAd] = useState('');
  const [silinecek, setSilinecek] = useState<Roadmap | null>(null);
  /** Satır menüsünün, kabın sol üst köşesine göre konumu. */
  const [satirMenusu, setSatirMenusu] = useState<{ id: string; top: number; left: number } | null>(null);

  const kapRef = useRef<HTMLDivElement>(null);
  const listeRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLInputElement>(null);

  // Menü dışarı tıklanınca kapanıyor: kanvasa, kutuya, üst bara, nereye olursa.
  // Eskiden yalnızca kanvasın "hepsini kapat" yayınını dinliyordu ve yol
  // haritası kanvası o yayını hiç göndermediği için menü açık kalıyordu.
  // Açma düğmesi de kabın içinde; ona basmak "dışarı" sayılmıyor, yoksa menü
  // kapanıp aynı tıklamayla yeniden açılırdı.
  useDisariTiklama(kapRef, () => {
    setAcik(false);
    setAdDuzenlenen(null);
    setSatirMenusu(null);
  });

  useEffect(() => {
    if (adDuzenlenen) adRef.current?.select();
  }, [adDuzenlenen]);

  const adaBasla = (harita: Roadmap) => {
    setSatirMenusu(null);
    setAd(harita.name);
    setAdDuzenlenen(harita.id);
  };

  const adiKaydet = () => {
    if (!adDuzenlenen) return;
    const temiz = ad.trim();
    const harita = roadmaps.find((h) => h.id === adDuzenlenen);
    if (temiz && harita && temiz !== harita.name) renameRoadmap(adDuzenlenen, temiz);
    setAdDuzenlenen(null);
  };

  const yeniHarita = () => {
    addRoadmap(t('roadmap_map_name_n', { sira: roadmaps.length + 1 }), t('roadmap_first_step'));
    setAcik(false);
  };

  // --- Sürükleyerek sıralama -------------------------------------------------
  //
  // `hedef` sürüklenen haritanın ÖNİZLEMEDEKİ sırası; liste o sıraya göre
  // çiziliyor ve imleç bir komşunun üstüne gelince ikisi yer değiştiriyor.
  // Ölçüm hep ekranda duran satırlardan yapıldığı için sıra kaymıyor.
  const [surukle, setSurukle] = useState<{ id: string; kaynak: number; hedef: number; basladi: boolean; baslangicY: number } | null>(null);
  // Sürükleme bittiğinde gelen tıklamayı yutmak için: yoksa harita bırakıldığı
  // anda bir de o haritaya geçilirdi.
  const suruklendi = useRef(false);

  const gosterilen = surukle?.basladi
    ? siraDegistir(roadmaps, surukle.kaynak, surukle.hedef)
    : roadmaps;

  const surukleBasla = (e: React.PointerEvent, id: string, index: number) => {
    // Yalnızca sol tuş ve fare/kalem. Dokunmatikte parmakla sürüklemek listeyi
    // kaydırmalı; sıralamaya orada basılı tutunca çıkan menüden giriliyor.
    if (e.button !== 0 || e.pointerType === 'touch') return;
    if (adDuzenlenen) return;
    setSurukle({ id, kaynak: index, hedef: index, basladi: false, baslangicY: e.clientY });
    // Yakalama, imleç listenin dışına taşsa da hareketin gelmeye devam etmesi
    // için. Tarayıcı reddederse (sentetik olay, kaybolmuş imleç kimliği)
    // sürükleme yine çalışır: hareket bu kez altındaki satırdan gelir, hepsi
    // aynı işleyiciye bağlı.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* önemsiz */ }
  };

  const surukleHareket = (e: React.PointerEvent) => {
    if (!surukle) return;
    if (!surukle.basladi && Math.abs(e.clientY - surukle.baslangicY) < SURUKLEME_ESIGI) return;

    const satirlar = Array.from(listeRef.current?.querySelectorAll<HTMLElement>('[data-harita-satiri]') ?? []);
    if (satirlar.length === 0) return;

    let hedef = surukle.hedef;
    const ilk = satirlar[0].getBoundingClientRect();
    const son = satirlar[satirlar.length - 1].getBoundingClientRect();
    if (e.clientY <= ilk.top) hedef = 0;
    else if (e.clientY >= son.bottom) hedef = satirlar.length - 1;
    else {
      const bulunan = satirlar.findIndex((el) => {
        const r = el.getBoundingClientRect();
        return e.clientY >= r.top && e.clientY <= r.bottom;
      });
      if (bulunan >= 0) hedef = bulunan;
    }

    if (surukle.basladi && hedef === surukle.hedef) return;
    setSurukle({ ...surukle, basladi: true, hedef });
  };

  const surukleBitir = () => {
    if (!surukle) return;
    if (surukle.basladi && surukle.hedef !== surukle.kaynak) {
      suruklendi.current = true;
      moveRoadmapTo(surukle.id, surukle.hedef);
    }
    setSurukle(null);
  };

  const surukleBitirRef = useRef(surukleBitir);
  surukleBitirRef.current = surukleBitir;

  // İmleç listenin dışında bırakılırsa satırların pointerup'ı hiç gelmez ve
  // sürükleme asılı kalırdı; son sözü pencere söylüyor.
  useEffect(() => {
    if (!surukle) return;
    const birak = () => surukleBitirRef.current();
    window.addEventListener('pointerup', birak);
    window.addEventListener('pointercancel', birak);
    return () => {
      window.removeEventListener('pointerup', birak);
      window.removeEventListener('pointercancel', birak);
    };
  }, [surukle]);

  const satirTiklandi = (id: string) => {
    if (suruklendi.current) { suruklendi.current = false; return; }
    setActiveRoadmap(id);
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
      left: Math.min(Math.max(4, e.clientX - kap.left), LISTE_GENISLIGI - SATIR_MENUSU_GENISLIGI)
    });
  };

  const menuHaritasi = satirMenusu ? roadmaps.find((h) => h.id === satirMenusu.id) : undefined;
  const menuSirasi = menuHaritasi ? roadmaps.findIndex((h) => h.id === menuHaritasi.id) : -1;
  const menuSatiri = 'flex w-full items-center gap-3 px-3 py-2 text-start text-sm transition-colors';
  const menuSade = 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50';

  return (
    <div className="relative" ref={kapRef}>
      <button
        onClick={() => setAcik((a) => !a)}
        className="flex max-w-[240px] items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <Route size={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{aktif.name}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div className="absolute top-12 start-0 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('roadmap_maps')}
          </div>

          <div ref={listeRef} className="custom-scrollbar max-h-48 overflow-y-auto">
            {gosterilen.map((harita) => {
              const secili = harita.id === aktif.id;
              const gercekSira = roadmaps.findIndex((h) => h.id === harita.id);
              const { yuzde } = roadmapIlerleme(harita.nodes);
              const tasiniyor = surukle?.basladi && surukle.id === harita.id;

              if (adDuzenlenen === harita.id) {
                return (
                  <div key={harita.id} className="px-1 py-1">
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
                      aria-label={t('roadmap_map_name')}
                      className="w-full rounded-xl border border-lime-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none dark:border-lime-500 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                );
              }

              return (
                <button
                  key={harita.id}
                  data-harita-satiri=""
                  onClick={() => satirTiklandi(harita.id)}
                  onContextMenu={(e) => satirMenusuAc(e, harita.id)}
                  onPointerDown={(e) => surukleBasla(e, harita.id, gercekSira)}
                  onPointerMove={surukleHareket}
                  onPointerUp={surukleBitir}
                  onPointerCancel={surukleBitir}
                  className={clsx(
                    'group flex w-full items-center gap-2 rounded-xl px-2 py-2 text-start text-sm font-semibold transition-colors',
                    secili
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50',
                    tasiniyor && 'ring-2 ring-lime-500'
                  )}
                >
                  {/* Tutamak yalnızca imleç satırın üstündeyken beliriyor:
                      satırın sürüklenebildiğini söylüyor ama listeyi kalabalık
                      etmiyor. Sürükleme satırın her yerinden başlıyor. */}
                  <GripVertical
                    size={14}
                    className="shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500"
                  />
                  <Route size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{harita.name}</span>
                  <span className="shrink-0 text-[11px] font-bold text-slate-400">{t('roadmap_percent', { yuzde })}</span>
                  {secili && <Check size={14} className="shrink-0 text-lime-600" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={yeniHarita}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-lime-700 transition-colors hover:bg-lime-50 dark:text-lime-400 dark:hover:bg-lime-900/20"
          >
            <Plus size={16} className="shrink-0" />
            {t('roadmap_new_map')}
          </button>

          <div className="my-2 h-px w-full bg-slate-100 dark:bg-slate-700" />

          {/* Aşağısı açık harita için; listedeki ötekilere sağ tık menüsünden
              erişiliyor. */}
          <button
            onClick={() => adaBasla(aktif)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <Pencil size={16} className="shrink-0 text-slate-400" />
            {t('roadmap_rename_map')}
          </button>

          <button
            onClick={() => { setAcik(false); setSilinecek(aktif); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="shrink-0" />
            {t('roadmap_delete_map')}
          </button>
        </div>
      )}

      {satirMenusu && menuHaritasi && (
        <div
          className="context-menu absolute z-10 w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
          style={{ top: satirMenusu.top, insetInlineStart: satirMenusu.left }}
        >
          <button onClick={() => adaBasla(menuHaritasi)} className={`${menuSatiri} ${menuSade}`}>
            <Pencil size={15} className="text-slate-400" />
            {t('roadmap_rename')}
          </button>

          {menuSirasi > 0 && (
            <button
              onClick={() => { moveRoadmapTo(menuHaritasi.id, menuSirasi - 1); setSatirMenusu(null); }}
              className={`${menuSatiri} ${menuSade}`}
            >
              <ArrowUp size={15} className="text-slate-400" />
              {t('roadmap_move_up')}
            </button>
          )}

          {menuSirasi >= 0 && menuSirasi < roadmaps.length - 1 && (
            <button
              onClick={() => { moveRoadmapTo(menuHaritasi.id, menuSirasi + 1); setSatirMenusu(null); }}
              className={`${menuSatiri} ${menuSade}`}
            >
              <ArrowDown size={15} className="text-slate-400" />
              {t('roadmap_move_down')}
            </button>
          )}

          <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-700/50" />

          <button
            onClick={() => { setSatirMenusu(null); setAcik(false); setSilinecek(menuHaritasi); }}
            className={`${menuSatiri} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}
          >
            <Trash2 size={15} />
            {t('roadmap_delete_map')}
          </button>
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
          onConfirm={() => { if (silinecek) deleteRoadmap(silinecek.id); setSilinecek(null); }}
          title={t('roadmap_delete_map')}
          message={t('roadmap_delete_map_msg', { ad: silinecek?.name ?? '' })}
        />
      </MenuPortal>
    </div>
  );
}

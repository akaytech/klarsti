import { useMemo, useState, useRef, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useRoadmapStore, type ToolId } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import { ChevronRight, ChevronLeft, Search, X } from 'lucide-react';
import { tumCalismalar } from '../utils/calismaListesi';
import clsx from 'clsx';
import packageJson from '../../package.json';
import { useTranslation } from 'react-i18next';
import { CATEGORY_ORDER, PROJECT_TOOLS } from '../config/tools';
import { useDisariTiklama } from '../utils/menuKapatma';
import { aracAdresiBul, hedefKlasorBul } from '../utils/aracAdresi';

const NAVBAR_THEME: Record<ToolId, { activeBtn: string; iconBg: string }> = {
  wbs: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
  '5whys': { activeBtn: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
  swot: { activeBtn: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  gantt: { activeBtn: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400" },
  ishikawa: { activeBtn: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400", iconBg: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400" },
  pdca: { activeBtn: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400" },
  waterfall: { activeBtn: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  fta: { activeBtn: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  decision: { activeBtn: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400" },
  flowchart: { activeBtn: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  orgchart: { activeBtn: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400", iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400" },
  pareto: { activeBtn: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  histogram: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
  mindmap: { activeBtn: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" },
  notepad: { activeBtn: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400", iconBg: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/50 dark:text-fuchsia-400" },
  vsm: { activeBtn: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
};

/** Menünün üstünde kaç tane "son kullandığın" araç gösterilecek. */
const SON_ARAC_SAYISI = 3;

/**
 * Tıklama tarayıcıya mı bırakılmalı?
 *
 * Sol tıkta uygulamanın kendi mantığı çalışıyor (sayfa yenilenmesin, depo
 * korunsun). Ama sağ tık, orta tık ve Ctrl/Cmd/Shift+tık tarayıcının işi:
 * kullanıcı aracı yeni sekmede ya da yeni pencerede açabilmeli. Burada
 * `preventDefault` çağrılırsa tarayıcı o menüyü hiç açmıyor.
 */
function tarayiciyaBirak(e: MouseEvent) {
  return e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

/**
 * Listedeki tek bir araç satırı. Üç yerde birden çiziliyor: arama sonucu,
 * son kullandıkların ve kategoriler.
 *
 * Düğme değil link: düğmenin adresi olmadığı için tarayıcı "yeni sekmede aç"
 * diyemiyordu. Kullanıcının hiç klasörü olmadığı durumun da artık bir adresi
 * var (bkz. aracAdresi.ts), yani istisnasız hepsi link.
 *
 * Navbar'ın İÇİNDE tanımlanmamalı: aramaya her harf yazıldığında bileşen
 * yeniden üretilir, React de bütün satırları söküp yeniden kurardı.
 */
function AracDugmesi({ tool, aktif, etiket, adres, onClick }: {
  tool: (typeof PROJECT_TOOLS)[number];
  aktif: boolean;
  etiket: string;
  adres: string;
  onClick: () => void;
}) {
  const Icon = tool.icon;
  const theme = NAVBAR_THEME[tool.id];
  const sinif = clsx(
    // text-start şart: tarayıcı düğme içindeki yazıyı varsayılan olarak
    // ortalar. Türkçede araç adları tek satıra sığdığı için görünmüyordu,
    // ama İngilizcede "Work Breakdown Structure" iki satıra taşıyor ve
    // satırlar ortalanmış duruyordu.
    'flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-start text-sm font-semibold transition-colors',
    aktif ? theme.activeBtn : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
  );

  const icerik = (
    <>
      <div className={clsx('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', theme.iconBg)}>
        <Icon size={14} />
      </div>
      <span>{etiket}</span>
    </>
  );

  return (
    <Link
      to={adres}
      onClick={(e) => {
        if (tarayiciyaBirak(e)) return;
        // Sol tık: adresi Link değil, aşağıdaki mantık değiştiriyor. İkisi
        // birden yönlendirirse geçmişe iki kayıt düşüyor ve geri düğmesi bir
        // adımda çalışmıyor.
        e.preventDefault();
        onClick();
      }}
      className={sinif}
    >
      {icerik}
    </Link>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const {  activeTool, setActiveTool, projects, works, loadProject, currentProjectId  } = useRoadmapStore(useShallow((state) => ({
      activeTool: state.activeTool,
      setActiveTool: state.setActiveTool,
      projects: state.projects,
      works: state.works,
      loadProject: state.loadProject,
      currentProjectId: state.currentProjectId
    })));
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [arama, setArama] = useState('');

  const kucult = (metin: string) => metin.toLocaleLowerCase(i18n.language);

  // Aramada araç adı da açıklaması da taranıyor: kullanıcı "kök neden" yazıp
  // Kılçık'ı bulabilmeli, aracın adını bilmek zorunda değil.
  const aramaSonucu = useMemo(() => {
    const q = kucult(arama.trim());
    if (!q) return null;
    return PROJECT_TOOLS.filter(
      (tool) => kucult(t(tool.labelKey)).includes(q) || kucult(t(tool.descKey)).includes(q)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arama, i18n.language, t]);

  // Son kullandıkların: ayrı bir kayıt tutulmuyor, en son dokunulan
  // çalışmaların araçlarından çıkarılıyor. Hiç çalışması olmayan kullanıcıda
  // bölüm hiç çizilmiyor.
  const sonAraclar = useMemo(() => {
    const sirali = tumCalismalar(projects, works).sort((a, b) => b.guncellendi - a.guncellendi);
    const gorulen: ToolId[] = [];
    for (const calisma of sirali) {
      if (gorulen.includes(calisma.tool)) continue;
      if (!PROJECT_TOOLS.some((x) => x.id === calisma.tool)) continue;
      gorulen.push(calisma.tool);
      if (gorulen.length === SON_ARAC_SAYISI) break;
    }
    return gorulen.map((id) => PROJECT_TOOLS.find((x) => x.id === id)!);
  }, [projects, works]);



  // Aracın açılacağı klasör: açık klasör varsa o, yoksa en son dokunulan.
  // Hiç klasör yoksa null ve adres /new/{arac} oluyor; klasörün adını soran
  // pencereyi AuthenticatedApp o adresi görünce açıyor.
  //
  // Hem linkin adresi hem de tıklama bu tek değerden besleniyor: ikisi ayrı
  // hesaplansaydı sağ tıkla açılan sekme, sol tıkla açılandan başka bir
  // klasöre gidebilirdi.
  const hedefKlasorId = useMemo(
    () => hedefKlasorBul(projects, currentProjectId),
    [currentProjectId, projects]
  );

  const handleToolClick = (tool: ToolId) => {
    setIsExpanded(false);
    // Menü kapanırken arama da sıfırlanıyor; yoksa bir dahaki açılışta
    // filtrelenmiş liste karşılıyor ve araçların yarısı yok sanılıyor.
    setArama('');

    if (!hedefKlasorId) {
      // Klasör yok: adrese gidiliyor, gerisini adres çözücü hallediyor.
      navigate(aracAdresiBul(tool, null));
      return;
    }

    if (hedefKlasorId !== currentProjectId) loadProject(hedefKlasorId);
    setActiveTool(tool);
  };

  // Kanvasın "hepsini kapat" yayını bilerek dinlenmiyor: kanvas o yayını
  // tekerlekle yakınlaştırma/kaydırma başlar başlamaz da gönderiyor ve menü
  // kullanıcı daha hiçbir şey seçmeden kapanıyordu. Kanvasa tıklamak yine
  // kapatıyor, o dışarı tıklama olarak yakalanıyor.
  useDisariTiklama(menuRef, () => setIsExpanded(false), { kanvasYayini: false });



  return (
    <>
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
      <div
        ref={menuRef}
        className={clsx(
          "flex h-full flex-col bg-white dark:bg-slate-900 transition-all duration-300 z-50",
          "max-md:fixed max-md:inset-y-0 max-md:start-0 md:relative",
          isExpanded ? "w-72 max-w-[85vw] border-e border-slate-200 dark:border-slate-800" : "w-0 border-0"
        )}
      >
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isExpanded) setArama('');
          setIsExpanded(!isExpanded);
        }}
        aria-label={t(isExpanded ? 'collapse_sidebar' : 'expand_sidebar', { defaultValue: 'Toggle sidebar' })}
        aria-expanded={isExpanded}
        className={clsx(
          "absolute top-1/2 -translate-y-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 z-10 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95 rtl:rotate-180",
          isExpanded ? "-end-5" : "start-4"
        )}
      >
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div className={clsx("flex h-full flex-col w-72 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 pointer-events-none")}>
      {/* Logo Area */}
      {/* Logo kare kutuda değil, kendi geniş oranında: "klarsti" yazısı
          56 piksellik karede okunmuyordu. Logonun kendi zemini ve yuvarlak
          köşeleri olduğu için etrafına ayrıca çerçeve çizilmiyor. */}
      {/* Düğme değil link. Düğmeyken sağ tık menüsünde "yeni sekmede aç"
          yoktu; tarayıcı içeride yalnızca bir resim gördüğü için "resmi
          farklı kaydet" çıkıyordu. */}
      <div className="flex p-4 items-center justify-center shrink-0">
        <Link
          to="/"
          onClick={(e) => {
            if (tarayiciyaBirak(e)) return;
            e.preventDefault();
            setActiveTool(null);
            setIsExpanded(false);
          }}
          className="shrink-0 rounded-xl transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Klarsti"
        >
          <img
            src={`${import.meta.env.BASE_URL}klarsti-yazi-logo.png`}
            alt="Klarsti"
            width={282}
            height={120}
            className="h-11 w-auto"
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col py-2 px-3 gap-1 overflow-y-auto custom-scrollbar">
        {/* Arama kutusu. 15 araç listeye sığmıyor, alttakileri görmek için
            kaydırmak gerekiyordu. Kutu kaydırırken de yerinde kalsın diye
            yapışkan. */}
        <div className="sticky top-0 z-10 -mx-3 mb-1 bg-white px-3 pb-2 dark:bg-slate-900">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setArama(''); }}
              placeholder={t('nav_search_placeholder')}
              aria-label={t('nav_search_placeholder')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 ps-9 pe-8 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-800"
            />
            {arama && (
              <button
                onClick={() => setArama('')}
                aria-label={t('nav_search_clear')}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {aramaSonucu ? (
          aramaSonucu.length > 0 ? (
            aramaSonucu.map((tool) => <AracDugmesi key={tool.id} tool={tool} aktif={activeTool === tool.id} etiket={t(tool.labelKey)} adres={aracAdresiBul(tool.id, hedefKlasorId)} onClick={() => handleToolClick(tool.id)} />)
          ) : (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">{t('nav_search_empty')}</p>
          )
        ) : (
          <>
            {/* Son kullandıkların: ayrı bir kayıt tutulmuyor, en son
                dokunulan çalışmaların araçlarından çıkarılıyor. */}
            {sonAraclar.length > 0 && (
              <>
                <div className="mb-1 mt-2 px-3 shrink-0">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t('nav_recent_tools')}</h3>
                </div>
                {sonAraclar.map((tool) => <AracDugmesi key={'son-' + tool.id} tool={tool} aktif={activeTool === tool.id} etiket={t(tool.labelKey)} adres={aracAdresiBul(tool.id, hedefKlasorId)} onClick={() => handleToolClick(tool.id)} />)}
              </>
            )}

            {CATEGORY_ORDER.map((cat, index) => {
              const catTools = PROJECT_TOOLS.filter(t => t.category === cat);
              if (catTools.length === 0) return null;

              return (
                <div key={cat} className="contents">
                  <div className={`mb-1 px-3 shrink-0 ${index > 0 || sonAraclar.length > 0 ? 'mt-4' : 'mt-2'}`}>
                    {/* Renkler ölçüldü: eski hali (açıkta slate-400, koyuda
                        slate-500) beyaz zeminde 2,6'ya düşüyordu; okunabilir
                        sayılmak için 4,5 gerekiyor. Açık temalarda slate-600
                        (5,3–7,6), koyu temalarda slate-400 (6,4–7,7). */}
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t(cat)}</h3>
                  </div>

                  {catTools.map((tool) => <AracDugmesi key={tool.id} tool={tool} aktif={activeTool === tool.id} etiket={t(tool.labelKey)} adres={aracAdresiBul(tool.id, hedefKlasorId)} onClick={() => handleToolClick(tool.id)} />)}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Version Info */}
      {/* Sürüm numarasının altında bir de "Geliştirme Aşamasında" yazıyordu.
          Aynı mesaj tanıtım sayfasının üst barında zaten var; uygulamanın
          içindeki kullanıcı ürünü kullanmaya çoktan başlamış oluyor ve
          hatırlatmayı ikinci kez okuyordu. */}
      <div className="py-3 text-center opacity-50 flex flex-col items-center shrink-0">
        <span className={clsx("font-bold text-slate-400 dark:text-slate-500", isExpanded ? "text-[10px]" : "text-[8px]")}>
          v{packageJson.version}
        </span>
      </div>
      </div>
    </div>
    </>
  );
}

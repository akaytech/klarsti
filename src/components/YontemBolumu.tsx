import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { toolTheme } from '../config/toolTheme';
import { toolPageAdresi } from '../config/toolPages';
import { loadToolGuides } from '../content/toolGuides';
import { useKaydirincaBelir } from '../utils/kaydirincaBelir';
// DİKKAT: `import type` olarak kalmalı. Yan etkili import olur ve tüm store'u
// (Firestore, zundo, bütün slice'lar) tanıtım sayfasına yükler.
import type { ToolId } from '../store/useRoadmapStore';

/**
 * Ana sayfadaki "yöntem" bölümü.
 *
 * Neden var: ziyaretçi araç listesini görüyor ama Klarsti'nin bu yöntemleri
 * gerçekten bilerek mi uyguladığını, yoksa kutu çizdiren bir tuval mi olduğunu
 * anlayamıyordu.
 *
 * Metin burada yazılmıyor: aracın kılavuzundaki özetin ta kendisi okunuyor
 * (src/content/toolGuides). Aynı metin on bir dilde zaten yazılmış durumda ve
 * araç sayfalarında da bu görünüyor; iki yerde ayrı metin tutulsaydı
 * kaçınılmaz olarak birbirinden ayrılırdı.
 *
 * DİKKAT: Tanıtım sayfasının içinde, yani siteyi ilk açan herkese iniyor.
 * Buraya depo ya da tuval kodu girmemeli. Kılavuz paketi ayrı bir parça ve
 * yalnızca burada indiriliyor (bkz. toolGuides/index.ts).
 */

// Dört yöntem: her biri kendi disiplininin standart aracı ve dördü dört ayrı
// soruya bakıyor (işi böl, kök nedene in, nedenleri tara, durumu oku).
const YONTEMLER: ToolId[] = ['wbs', '5whys', 'ishikawa', 'swot'];

export default function YontemBolumu() {
  const { t, i18n } = useTranslation();
  const ref = useKaydirincaBelir<HTMLElement>();
  const [ozetler, setOzetler] = useState<Partial<Record<ToolId, string>>>({});

  useEffect(() => {
    let iptal = false;
    loadToolGuides(i18n.language)
      .then((paket) => {
        if (iptal) return;
        const yeni: Partial<Record<ToolId, string>> = {};
        for (const id of YONTEMLER) {
          const ozet = paket[id]?.summary;
          if (ozet) yeni[id] = ozet;
        }
        setOzetler(yeni);
      })
      // Kılavuz inemezse bölüm boş kalmıyor: kartlarda ana dil paketindeki
      // kısa açıklama duruyor, o da her zaman hazır.
      .catch(() => {});
    return () => {
      iptal = true;
    };
  }, [i18n.language]);

  const kartlar = YONTEMLER.map((id) => {
    const arac = TOOLS.find((x) => x.id === id)!;
    const tema = toolTheme[id];
    return {
      id,
      Ikon: arac.icon,
      baslik: t(arac.labelKey),
      metin: ozetler[id] ?? t(arac.descKey),
      renk: tema.text,
      zemin: tema.bg,
      adres: toolPageAdresi(id)
    };
  });

  return (
    <section
      ref={ref}
      className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{t('landing_method_heading')}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('landing_method_subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {kartlar.map((kart) => (
            <div
              key={kart.id}
              className="flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className={`h-14 w-14 shrink-0 rounded-2xl ${kart.zemin} flex items-center justify-center`}>
                  <kart.Ikon size={28} className={kart.renk} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{kart.baslik}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{kart.metin}</p>
              {kart.adres && (
                <Link
                  to={kart.adres}
                  className="group mt-auto pt-6 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {t('landing_method_cta')}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 rtl:rotate-180" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

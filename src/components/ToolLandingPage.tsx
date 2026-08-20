import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronRight, Compass, ListOrdered, Keyboard, Lightbulb } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { toolTheme } from '../config/toolTheme';
import { toolPageAdresi, type ToolPage } from '../config/toolPages';
import { loadToolGuides, type ToolGuide } from '../content/toolGuides';
import { sayfaMetaAyarla, sayfaMetaSifirla } from '../utils/sayfaMeta';
import { dilliYol } from '../utils/dilYolu';
import { useAuthStore } from '../store/useAuthStore';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Herkese açık araç sayfası: klarsti.com/wbs, klarsti.com/swot ...
//
// İçerik uydurulmuyor, uygulama içindeki kılavuzun ta kendisi okunuyor
// (src/content/toolGuides). Aynı metin on dilde zaten yazılmıştı ve yalnızca
// giriş yapmış kullanıcıya gösteriliyordu.
//
// DİKKAT: Bu sayfa giriş gerektirmiyor, yani ilk açılışta inen paketin içinde.
// Buraya `useRoadmapStore` ya da `@xyflow/react` girerse Firestore ve tuval
// kodu bütün ziyaretçilere inmeye başlar. useAuthStore ayrı ve hafif, sorun
// değil; kayıt çağrısını giriş durumuna göre değiştirmek için gerekiyor.

// macOS'ta Ctrl diye yazmak yanlış olur; `Mod` simgesi platforma göre çizilir.
const macMi = () => {
  if (typeof navigator === 'undefined') return false;
  const kaynak = (navigator as any).userAgentData?.platform || navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(kaynak);
};

function Tus({ deger }: { deger: string }) {
  const metin = deger === 'Mod' ? (macMi() ? '⌘' : 'Ctrl') : deger;
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
      {metin}
    </kbd>
  );
}

function Bolum({ baslik, ikon, children }: { baslik: string; ikon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="mb-5 flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
          {ikon}
        </span>
        {baslik}
      </h2>
      {children}
    </section>
  );
}

export default function ToolLandingPage({ sayfa }: { sayfa: ToolPage }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [kilavuz, setKilavuz] = useState<ToolGuide | null>(null);
  // Kılavuz isteği sonuçlandı mı. `kilavuz`un dolu olmasına bakmak yetmiyor:
  // metin inemediğinde de sonuçlanmış sayılıyor (bkz. hazır sayfayı kaldıran
  // effect); yoksa indirme başarısız olunca katman ekranda asılı kalıyordu.
  const [kilavuzSonuclandi, setKilavuzSonuclandi] = useState(false);

  const arac = TOOLS.find((x) => x.id === sayfa.toolId);
  const tema = toolTheme[sayfa.toolId] || toolTheme.wbs;
  const Ikon = arac?.icon;
  // Kılavuz henüz inmemişken de sayfa boş görünmesin: araç adı ve kısa
  // açıklaması ana dil paketinde, anında hazır.
  const baslik = arac ? t(arac.labelKey) : sayfa.toolId;
  const kisaAciklama = arac ? t(arac.descKey) : '';

  useEffect(() => {
    // Statik HTML dile göre üretiliyor (bkz. scripts/staticPages.mjs); uygulama
    // içi gezinmede de aynı metin görünsün diye başlık ve açıklama İngilizce
    // JSON'dan değil aktif dilden alınıyor. İngilizcede JSON'daki elle yazılmış
    // metin daha iyi, orada o kalıyor.
    const ingilizce = i18n.language.startsWith('en');
    sayfaMetaAyarla({
      title: ingilizce ? sayfa.title : `${baslik} | Klarsti`,
      description: ingilizce ? sayfa.description : kisaAciklama || sayfa.description,
      canonical: `https://klarsti.com${dilliYol(i18n.language, sayfa.slug)}`
    });
    // Kullanıcı buradan tanıtım sayfasına ya da uygulamaya geçtiğinde sekme
    // başlığı bu araçta takılı kalmasın.
    return () => sayfaMetaSifirla();
  }, [sayfa, i18n.language, baslik, kisaAciklama]);

  useEffect(() => {
    let iptal = false;
    setKilavuzSonuclandi(false);
    loadToolGuides(i18n.language)
      .then((paket) => {
        if (iptal) return;
        setKilavuz(paket[sayfa.toolId] ?? null);
        setKilavuzSonuclandi(true);
      })
      .catch(() => {
        if (iptal) return;
        setKilavuz(null);
        setKilavuzSonuclandi(true);
      });
    return () => {
      iptal = true;
    };
  }, [sayfa.toolId, i18n.language]);

  // Build sırasında dosyaya gömülen hazır sayfayı kaldır.
  //
  // O katman arama motorları için var (bkz. scripts/staticPages.mjs): sunucudan
  // gelen dosyanın gövdesi eskiden bomboştu, bütün yazı burada çiziliyordu ve
  // Google'ın okuyacağı bir şey yoktu. Hazır sayfa ekranı kaplıyor, biz kendi
  // sürümümüzü çizene kadar orada duruyor.
  //
  // Kaldırma anı: kılavuz isteği sonuçlandığında, yani ekranda göstereceğimiz
  // metin hazır olduğunda. Erken kaldırsak sayfa bir an boşalır. Metin
  // inemediyse de kaldırıyoruz: eksik bir sayfa göstermek, uygulamanın önünü
  // kapatan bir katmandan iyi. Kullanıcı beklemeden başka bir sayfaya giderse
  // diye ayrılırken de kaldırılıyor.
  useEffect(() => {
    const kaldir = () => document.getElementById('statik-onizleme')?.remove();
    if (kilavuzSonuclandi) kaldir();
    return kaldir;
  }, [kilavuzSonuclandi]);

  const digerAraclar = TOOLS.filter((x) => x.id !== sayfa.toolId);

  const kayitCagrisi = (
    <button
      onClick={() => navigate(user ? '/' : '/register')}
      className="flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-8 py-4 text-lg font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-2xl active:translate-y-0"
    >
      {user ? t('tool_page_open_app') : t('register')} <ArrowRight size={20} />
    </button>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden pt-14 pb-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-900 dark:to-slate-900"></div>
          {/* Okuma genişliği sınırlı ama sola yaslı: `max-w-4xl` doğrudan
              container'a verilince mx-auto onu ortalıyor ve başlık üst bardaki
              logodan ~190px içeride başlıyordu, sayfa ortalanmış görünüyordu.
              Sınır artık iç katmanda; sol kenar üst barla hizalı. */}
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
            <nav aria-label="breadcrumb" className="mb-10 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Klarsti
              </Link>
              <ChevronRight size={15} className="shrink-0 rtl:rotate-180" aria-hidden />
              <span className="text-slate-800 dark:text-slate-200">{baslik}</span>
            </nav>

            {Ikon && (
              <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl ${tema.bg} shadow-sm`}>
                <Ikon size={40} className={tema.text} />
              </div>
            )}

            <h1 className="mb-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {baslik}
            </h1>

            <p className="mb-10 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-400">
              {kilavuz?.summary || kisaAciklama}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">{kayitCagrisi}</div>
            </div>
          </div>
        </section>

        {/* Kılavuz gövdesi */}
        <section className="pb-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-16">
          <div className="container mx-auto px-6 text-slate-700 dark:text-slate-300">
            <div className="max-w-4xl">
            {kilavuz ? (
              <>
                <Bolum baslik={t('guide_when')} ikon={<Compass size={18} />}>
                  <ul className="space-y-3">
                    {kilavuz.whenToUse.map((satir, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                        <span>{satir}</span>
                      </li>
                    ))}
                  </ul>
                </Bolum>

                <Bolum baslik={t('guide_steps')} ikon={<ListOrdered size={18} />}>
                  <ol className="space-y-4">
                    {kilavuz.steps.map((satir, i) => (
                      <li key={i} className="flex gap-4 leading-relaxed">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-black text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                          {i + 1}
                        </span>
                        <span>{satir}</span>
                      </li>
                    ))}
                  </ol>
                </Bolum>

                {kilavuz.shortcuts && kilavuz.shortcuts.length > 0 && (
                  <Bolum baslik={t('guide_shortcuts')} ikon={<Keyboard size={18} />}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                      {kilavuz.shortcuts.map((kisayol, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0 odd:bg-slate-50/60 dark:border-slate-800/60 dark:odd:bg-slate-900/40"
                        >
                          <span className="leading-snug">{kisayol.desc}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {kisayol.keys.map((tus, j) => (
                              <span key={j} className="flex items-center gap-1">
                                {j > 0 && <span className="text-xs text-slate-400">+</span>}
                                <Tus deger={tus} />
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Bolum>
                )}

                {kilavuz.tips && kilavuz.tips.length > 0 && (
                  <Bolum baslik={t('guide_tips')} ikon={<Lightbulb size={18} />}>
                    <ul className="space-y-3">
                      {kilavuz.tips.map((satir, i) => (
                        <li key={i} className="flex gap-3 leading-relaxed">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          <span>{satir}</span>
                        </li>
                      ))}
                    </ul>
                  </Bolum>
                )}
              </>
            ) : (
              // Kılavuz parçası inerken sayfanın yüksekliği zıplamasın.
              <div className="space-y-4" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" style={{ width: `${90 - i * 8}%` }} />
                ))}
              </div>
            )}
            </div>
          </div>
        </section>

        {/* Diğer araçlar: hem kullanıcı gezinsin hem arama motoru sayfaları
            birbirinden bulabilsin diye gerçek link listesi. */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('tool_page_other_tools')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {digerAraclar.map((x) => {
                const adres = toolPageAdresi(x.id);
                if (!adres) return null;
                const xTema = toolTheme[x.id] || toolTheme.wbs;
                return (
                  <Link
                    key={x.id}
                    to={adres}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-indigo-500/30"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${xTema.bg}`}>
                      <x.icon size={22} className={xTema.text} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{t(x.labelKey)}</span>
                    <ArrowRight size={16} className="ms-auto shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 rtl:rotate-180" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 12px)' }}
          ></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">{t('landing_cta_heading')}</h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">{t('landing_cta_subtitle')}</p>
            <button
              onClick={() => navigate(user ? '/' : '/register')}
              className="rounded-full bg-white px-10 py-5 text-xl font-black text-indigo-600 shadow-2xl transition-transform hover:scale-105 motion-reduce:hover:scale-100 active:scale-95 motion-reduce:active:scale-100"
            >
              {user ? t('tool_page_open_app') : t('landing_cta_button')}
            </button>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

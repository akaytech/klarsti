import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Ana sayfanın altındaki "Fiyat" ve "Sık sorulanlar" bölümü.
 *
 * Neden var: ziyaretçinin ilk iki sorusu "ücretsiz mi?" ve "verilerim ne
 * olacak?" idi; sayfada ikisinin de cevabı yoktu.
 *
 * Cevaplar uydurulmuyor, bugün gerçekten öyle olduğu için yazılıyor:
 * dışa aktarma yalnızca görüntü (PDF yok), kayıt olmadan deneme yok,
 * hesap silme kullanıcının kendi elinde. Bir özellik değişirse buradaki
 * cevap da değişmeli.
 *
 * DİKKAT: Tanıtım sayfasının içinde, yani siteyi ilk açan herkese iniyor.
 * Buraya depo ya da tuval kodu girmemeli. Açılır cevaplar için JavaScript
 * de yok, tarayıcının kendi <details> öğesi kullanılıyor.
 */

const SORULAR = [1, 2, 3, 4, 5, 6];

export default function FiyatVeSorular() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          {/* Fiyat */}
          <h2 className="mb-8 text-center text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('price_heading')}
          </h2>

          <div className="mb-16 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{t('price_title')}</p>
            <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">{t('price_desc')}</p>

            <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-start">
              {['price_item_1', 'price_item_2', 'price_item_3'].map((anahtar) => (
                <li key={anahtar} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden />
                  <span>{t(anahtar)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sık sorulanlar */}
          <h2 className="mb-8 text-center text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('faq_heading')}
          </h2>

          <div className="flex flex-col gap-3">
            {SORULAR.map((no) => (
              <details
                key={no}
                className="group rounded-2xl border border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-slate-900 dark:text-white">
                  {t(`faq_q${no}`)}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden
                  />
                </summary>
                <p className="pb-5 pe-8 leading-relaxed text-slate-600 dark:text-slate-400">{t(`faq_a${no}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

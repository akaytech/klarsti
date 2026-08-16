import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Eye, FilePlus2, Image, Loader2, RefreshCw, Save, Trash2, Video } from 'lucide-react';
import { DESTEKLENEN_DILLER } from '../config/languages';
import { yaziAdresi } from '../config/blogSayfasi';
import {
  slugUret, tumYazilar, yaziyiKaydet, yaziyiSil, type BlogYazisi
} from '../store/blogDeposu';
import { blogMetniCiz } from '../utils/blogMetni';

// Blog yazma paneli. Yönetim ekranının içinde çiziliyor, yani yalnızca
// yoneticiMi() geçen hesap görüyor (bkz. AdminPage).
//
// Neden çeviri anahtarı yok: yönetim ekranının tamamında olduğu gibi, bu
// ekranı tek kişi açıyor. Anahtarları 11 dile çevirmek kimsenin görmeyeceği
// bir iş olurdu.
//
// DİKKAT — RESİM: Bu panelde dosya yükleme YOK, resmin adresi yapıştırılıyor.
// Yükleme Firebase'in dosya deposunu gerektiriyor, o da ücretli plana
// geçmeyi. Karar bilinçli (16 Ağustos 2026); plan değişirse buraya bir
// yükleme alanı eklenir, veri modelinde değişiklik gerekmez.

const BOS: BlogYazisi = {
  slug: '', baslik: '', ozet: '', dil: 'tr', kapak: '', govde: '',
  durum: 'taslak', yayinTarihi: null, guncellendi: 0
};

const YARDIM = `# Büyük başlık
## Orta başlık
### Küçük başlık

Boş satır paragrafları ayırır.

- madde
> alıntı

**kalın**  *eğik*
[yazı](https://adres)
![resim açıklaması](https://resim-adresi.jpg)

Tek başına bir YouTube ya da Vimeo adresi yazarsan oynatıcıya dönüşür.`;

const tarih = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export default function AdminBlogPanel() {
  const [liste, setListe] = useState<BlogYazisi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [secili, setSecili] = useState<BlogYazisi | null>(null);
  /** Düzenlenmekte olan yazının kayıtlı hali; slug değişimini anlamak için. */
  const [eskiSlug, setEskiSlug] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [onizleme, setOnizleme] = useState(false);
  const [durumYazisi, setDurumYazisi] = useState('');
  const govdeRef = useRef<HTMLTextAreaElement>(null);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      setListe(await tumYazilar());
    } catch (e) {
      setHata(e instanceof Error ? e.message : String(e));
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => { yukle(); }, [yukle]);

  const yeniYazi = () => {
    setSecili({ ...BOS });
    setEskiSlug(null);
    setOnizleme(false);
    setDurumYazisi('');
  };

  const duzenle = (yazi: BlogYazisi) => {
    setSecili({ ...yazi });
    setEskiSlug(yazi.slug);
    setOnizleme(false);
    setDurumYazisi('');
  };

  const alanDegistir = (parca: Partial<BlogYazisi>) =>
    setSecili((y) => (y ? { ...y, ...parca } : y));

  /** İmlecin durduğu yere metin sokar; yoksa sonuna ekler. */
  const govdeyeEkle = (metin: string) => {
    const alan = govdeRef.current;
    setSecili((y) => {
      if (!y) return y;
      if (!alan) return { ...y, govde: `${y.govde}\n${metin}\n` };
      const bas = alan.selectionStart ?? y.govde.length;
      const son = alan.selectionEnd ?? bas;
      return { ...y, govde: `${y.govde.slice(0, bas)}${metin}${y.govde.slice(son)}` };
    });
    // Odak geri geliyor: ekledikten sonra yazmaya devam edilebilsin.
    setTimeout(() => alan?.focus(), 0);
  };

  const resimEkle = () => {
    const adres = window.prompt('Resmin adresi (https://... ile başlamalı):');
    if (!adres) return;
    const aciklama = window.prompt('Resmin kısa açıklaması (görme engelliler ve arama motoru için):') || '';
    govdeyeEkle(`\n![${aciklama}](${adres.trim()})\n`);
  };

  const videoEkle = () => {
    const adres = window.prompt('YouTube ya da Vimeo adresi:');
    if (!adres) return;
    govdeyeEkle(`\n${adres.trim()}\n`);
  };

  const kaydet = async (durum: BlogYazisi['durum']) => {
    if (!secili) return;
    const baslik = secili.baslik.trim();
    if (!baslik) { setDurumYazisi('Başlık boş olamaz.'); return; }

    const slug = (secili.slug.trim() || slugUret(baslik));
    if (!slug) { setDurumYazisi('Adres adı üretilemedi, elle yaz.'); return; }

    // Aynı adresi taşıyan başka bir yazı varsa üstüne yazmıyoruz: kaydet
    // demek, o yazıyı sessizce silmek olurdu.
    if (slug !== eskiSlug && liste.some((y) => y.slug === slug)) {
      setDurumYazisi(`"${slug}" adresi zaten kullanılıyor. Adresi değiştir.`);
      return;
    }

    setKaydediliyor(true);
    setDurumYazisi('');
    try {
      const yazi: BlogYazisi = { ...secili, slug, baslik, durum };
      await yaziyiKaydet(yazi);
      // Adres değiştiyse eski kayıt kalmamalı, yoksa yazı iki adreste birden
      // durur ve arama motoru ikisini de görür.
      if (eskiSlug && eskiSlug !== slug) await yaziyiSil(eskiSlug);
      setEskiSlug(slug);
      setSecili({ ...yazi, yayinTarihi: durum === 'yayinda' ? (yazi.yayinTarihi ?? Date.now()) : yazi.yayinTarihi });
      setDurumYazisi(durum === 'yayinda' ? 'Yayınlandı.' : 'Taslak kaydedildi.');
      await yukle();
    } catch (e) {
      setDurumYazisi(`Kaydedilemedi: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setKaydediliyor(false);
    }
  };

  const sil = async (yazi: BlogYazisi) => {
    if (!window.confirm(`"${yazi.baslik}" silinsin mi? Bu geri alınamaz.`)) return;
    try {
      await yaziyiSil(yazi.slug);
      if (eskiSlug === yazi.slug) { setSecili(null); setEskiSlug(null); }
      await yukle();
    } catch (e) {
      setHata(e instanceof Error ? e.message : String(e));
    }
  };

  const girdiSinif =
    'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500';
  const etiketSinif = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5';
  const dugmeSinif =
    'flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60';

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Blog</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Yayınladığın yazı klarsti.com/blog adresinde anında görünür.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={yukle} disabled={yukleniyor} className={dugmeSinif}>
            {yukleniyor ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Yenile
          </button>
          <button onClick={yeniYazi} className={`${dugmeSinif} border-indigo-500 text-indigo-600 dark:text-indigo-400`}>
            <FilePlus2 size={16} />
            Yeni yazı
          </button>
        </div>
      </div>

      {hata && (
        <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
          Yazılar okunamadı: {hata}
        </div>
      )}

      {/* Yazı listesi */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 divide-y divide-slate-100 dark:divide-slate-700/60">
        {liste.length === 0 && !yukleniyor && (
          <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">Henüz yazı yok.</p>
        )}
        {liste.map((yazi) => (
          <div key={yazi.slug} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                yazi.durum === 'yayinda'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {yazi.durum === 'yayinda' ? 'Yayında' : 'Taslak'}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{yazi.baslik || '(başlıksız)'}</span>
            <span className="shrink-0 text-xs uppercase text-slate-400">{yazi.dil}</span>
            <span className="shrink-0 text-xs tabular-nums text-slate-400">{tarih(yazi.guncellendi)}</span>
            <button onClick={() => duzenle(yazi)} className="shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Düzenle
            </button>
            {yazi.durum === 'yayinda' && (
              <a
                href={yaziAdresi(yazi.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Yayındaki hali"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button
              onClick={() => sil(yazi)}
              className="shrink-0 text-slate-400 hover:text-red-600"
              aria-label="Sil"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Düzenleyici */}
      {secili && (
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={etiketSinif} htmlFor="blog-baslik">Başlık</label>
              <input
                id="blog-baslik"
                className={girdiSinif}
                value={secili.baslik}
                onChange={(e) => {
                  const baslik = e.target.value;
                  // Adres adı başlıktan türüyor ama yalnızca yeni yazıda:
                  // yayımlanmış bir yazının adresini değiştirmek, dışarıdaki
                  // linkleri kırar.
                  alanDegistir(eskiSlug ? { baslik } : { baslik, slug: slugUret(baslik) });
                }}
                placeholder="Kök neden analizinde en sık yapılan hata"
              />
            </div>

            <div>
              <label className={etiketSinif} htmlFor="blog-slug">Adres adı</label>
              <input
                id="blog-slug"
                className={girdiSinif}
                value={secili.slug}
                onChange={(e) => alanDegistir({ slug: slugUret(e.target.value) })}
                placeholder="kok-neden-analizi-hatasi"
              />
              <p className="mt-1 text-xs text-slate-400">klarsti.com/blog/{secili.slug || '…'}</p>
            </div>

            <div>
              <label className={etiketSinif} htmlFor="blog-dil">Dil</label>
              <select
                id="blog-dil"
                className={girdiSinif}
                value={secili.dil}
                onChange={(e) => alanDegistir({ dil: e.target.value })}
              >
                {DESTEKLENEN_DILLER.map((d) => (
                  <option key={d.code} value={d.code}>{d.nativeName}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={etiketSinif} htmlFor="blog-ozet">Özet</label>
              <input
                id="blog-ozet"
                className={girdiSinif}
                value={secili.ozet}
                onChange={(e) => alanDegistir({ ozet: e.target.value })}
                placeholder="Listede ve Google sonucunda görünen iki cümle."
              />
            </div>

            <div className="md:col-span-2">
              <label className={etiketSinif} htmlFor="blog-kapak">Kapak resmi adresi</label>
              <input
                id="blog-kapak"
                className={girdiSinif}
                value={secili.kapak}
                onChange={(e) => alanDegistir({ kapak: e.target.value })}
                placeholder="https://... (boş bırakabilirsin)"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button onClick={resimEkle} className={dugmeSinif}><Image size={16} /> Resim ekle</button>
            <button onClick={videoEkle} className={dugmeSinif}><Video size={16} /> Video ekle</button>
            <button onClick={() => setOnizleme((o) => !o)} className={dugmeSinif}>
              <Eye size={16} /> {onizleme ? 'Yazmaya dön' : 'Önizleme'}
            </button>
          </div>

          <div className="mt-4">
            <label className={etiketSinif} htmlFor="blog-govde">Yazı</label>
            {onizleme ? (
              <div className="min-h-[320px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                {blogMetniCiz(secili.govde)}
              </div>
            ) : (
              <textarea
                id="blog-govde"
                ref={govdeRef}
                className={`${girdiSinif} min-h-[320px] resize-y font-mono text-[13px] leading-relaxed`}
                value={secili.govde}
                onChange={(e) => alanDegistir({ govde: e.target.value })}
                placeholder={YARDIM}
              />
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400">
                Yazım kuralları
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-xs text-slate-500 dark:text-slate-400">{YARDIM}</pre>
            </details>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button onClick={() => kaydet('taslak')} disabled={kaydediliyor} className={dugmeSinif}>
              {kaydediliyor ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Taslak kaydet
            </button>
            <button
              onClick={() => kaydet('yayinda')}
              disabled={kaydediliyor}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {kaydediliyor ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Yayınla
            </button>
            <button onClick={() => { setSecili(null); setEskiSlug(null); }} className={dugmeSinif}>
              Kapat
            </button>
            {durumYazisi && <span className="text-sm text-slate-500 dark:text-slate-400">{durumYazisi}</span>}
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Yayın tarihi: {tarih(secili.yayinTarihi)} · Son kayıt: {tarih(secili.guncellendi)}
          </p>
        </div>
      )}
    </section>
  );
}

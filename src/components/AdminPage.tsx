import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  collection, query, where, orderBy, limit, getCountFromServer, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { botKorumasiniBaslat } from '../firebase';

// Yonetim ekrani girisli uygulamanin DISINDA ve Firestore okuyor; korumayi
// kendisi baslatmali.
botKorumasiniBaslat();
import { TOOLS } from '../config/tools';
import { useAuthStore } from '../store/useAuthStore';
import { yoneticiMi } from '../config/yonetici';
import AdminBlogPanel from './AdminBlogPanel';
import { Loader2, RefreshCw, Search, Users, FolderOpen, PenLine, Activity } from 'lucide-react';

// Yönetim ekranı: klarsti.com/admin. Yalnızca yoneticiMi() geçen hesap açar.
//
// NE GÖSTERİR: sayılar, tarihler, araç adları, klasör adları.
// NE GÖSTERMEZ: kullanıcıların içeriği. Not metni, düğüm yazısı, diyagram —
// hiçbiri okunmuyor ve okunmamalı. İnsanların kök neden analizlerine bakmak
// gizlilik politikasıyla çelişir. Buraya alan eklerken bu sınırı koru.
//
// Ajanda ve gün sonu değerlendirmesi ayrıca kural seviyesinde de kapalı:
// users/{uid} kaydına yöneticinin erişimi yok, kimlik satırı bu yüzden ayrı
// bir 'profiles' koleksiyonunda duruyor (bkz. store/kullaniciProfili.ts).
//
// Neden çeviri anahtarı yok: bu ekranı tek kişi açıyor. 19 anahtarı 11 dile
// çevirmek, hiç kimsenin görmeyeceği bir iş olurdu.
//
// Sayımlar getCountFromServer ile: belgeleri indirmeden sayıyor. Kayıt sayısı
// büyüdüğünde "hepsini çek ve say" yaklaşımı hem yavaşlar hem faturayı
// şişirir; bu çağrı her 1000 belge için tek okuma sayılıyor.

interface Sayilar {
  kullanici: number;
  proje: number;
  calisma: number;
  aktif7: number;
}

interface AracSatiri {
  id: string;
  ad: string;
  adet: number;
}

interface SonHareket {
  id: string;
  tool: string;
  projectName: string;
  guncellendi: number | null;
}

interface AramaSonucu {
  bulundu: boolean;
  uid?: string;
  ad?: string;
  eposta?: string;
  ilkGoruldu?: number;
  sonGoruldu?: number;
  projeSayisi?: number;
  calismaSayisi?: number;
  araclar?: string[];
}

const GUN_MS = 24 * 60 * 60 * 1000;

const tarih = (ms?: number | null) => {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export default function AdminPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const yetkili = yoneticiMi(user?.uid);

  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [sayilar, setSayilar] = useState<Sayilar | null>(null);
  const [araclar, setAraclar] = useState<AracSatiri[]>([]);
  const [sonHareket, setSonHareket] = useState<SonHareket[]>([]);

  const [aranan, setAranan] = useState('');
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  const [aramaSonucu, setAramaSonucu] = useState<AramaSonucu | null>(null);

  const aracAdi = useCallback(
    (id: string) => {
      const tanim = TOOLS.find((a) => a.id === id);
      return tanim ? t(tanim.labelKey, { defaultValue: id }) : id;
    },
    [t]
  );

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const yediGunOnce = Date.now() - 7 * GUN_MS;

      // Dört sayı ve 15 araç sayımı birbirinden bağımsız; sırayla beklemek
      // ekranı boş yere geciktirirdi.
      const [kullanici, proje, calisma, aktif7] = await Promise.all([
        getCountFromServer(collection(db, 'profiles')),
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(collection(db, 'works')),
        getCountFromServer(query(collection(db, 'profiles'), where('sonGoruldu', '>=', yediGunOnce))),
      ]);

      setSayilar({
        kullanici: kullanici.data().count,
        proje: proje.data().count,
        calisma: calisma.data().count,
        aktif7: aktif7.data().count,
      });

      const aracSayimlari = await Promise.all(
        TOOLS.map(async (arac) => {
          const sonuc = await getCountFromServer(
            query(collection(db, 'works'), where('tool', '==', arac.id))
          );
          return { id: arac.id, ad: t(arac.labelKey, { defaultValue: arac.id }), adet: sonuc.data().count };
        })
      );
      setAraclar(aracSayimlari.sort((a, b) => b.adet - a.adet));

      const son = await getDocs(
        query(collection(db, 'works'), orderBy('updatedAt', 'desc'), limit(20))
      );
      setSonHareket(
        son.docs.map((d) => ({
          id: d.id,
          tool: d.data().tool ?? '—',
          projectName: d.data().projectName ?? '—',
          guncellendi: d.data().updatedAt ?? null,
        }))
      );
    } catch (err) {
      console.error('Yonetim ekrani yuklenemedi:', err);
      setHata(err instanceof Error ? err.message : 'Veriler okunamadı.');
    } finally {
      setYukleniyor(false);
    }
  }, [t]);

  useEffect(() => {
    if (yetkili) yukle();
  }, [yetkili, yukle]);

  const ara = useCallback(async () => {
    const eposta = aranan.trim().toLowerCase();
    if (!eposta) return;
    setAramaYukleniyor(true);
    setAramaSonucu(null);
    try {
      const kisi = await getDocs(
        query(collection(db, 'profiles'), where('eposta', '==', eposta), limit(1))
      );
      if (kisi.empty) {
        setAramaSonucu({ bulundu: false });
        return;
      }

      const belge = kisi.docs[0];
      const veri = belge.data();
      const uid = belge.id;

      const [projeler, calismalar] = await Promise.all([
        getCountFromServer(query(collection(db, 'projects'), where('userId', '==', uid))),
        getDocs(query(collection(db, 'works'), where('ownerId', '==', uid))),
      ]);

      const kullanilanlar = Array.from(
        new Set(calismalar.docs.map((d) => d.data().tool).filter(Boolean) as string[])
      );

      setAramaSonucu({
        bulundu: true,
        uid,
        ad: veri.ad,
        eposta: veri.eposta,
        ilkGoruldu: veri.ilkGoruldu,
        sonGoruldu: veri.sonGoruldu,
        projeSayisi: projeler.data().count,
        calismaSayisi: calismalar.size,
        araclar: kullanilanlar,
      });
    } catch (err) {
      console.error('Kullanici aranamadi:', err);
      setAramaSonucu({ bulundu: false });
    } finally {
      setAramaYukleniyor(false);
    }
  }, [aranan]);

  // Yetkisiz biri adresi denerse ne olduğunu anlatmıyoruz: "yetkin yok"
  // demek, böyle bir ekranın var olduğunu doğrulamak olurdu.
  if (!yetkili) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">Sayfa bulunamadı.</p>
      </div>
    );
  }

  const enCok = araclar.length ? Math.max(...araclar.map((a) => a.adet), 1) : 1;

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="container mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Yönetim
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sayılar ve tarihler. Kullanıcıların içeriği burada gösterilmiyor.
            </p>
          </div>
          <button
            onClick={yukle}
            disabled={yukleniyor}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
          >
            {yukleniyor ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Yenile
          </button>
        </div>

        {hata && (
          <div className="mt-6 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
            Veriler okunamadı: {hata}
            <p className="mt-2 text-xs opacity-80">
              Kural dosyası yayınlanmadıysa bu beklenen bir hata. firestore.rules içindeki
              yonetici() satırının yayında olduğundan emin ol.
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kutu ikon={<Users size={18} />} baslik="Kullanıcı" deger={sayilar?.kullanici} yukleniyor={yukleniyor} />
          <Kutu ikon={<FolderOpen size={18} />} baslik="Klasör" deger={sayilar?.proje} yukleniyor={yukleniyor} />
          <Kutu ikon={<PenLine size={18} />} baslik="Çalışma" deger={sayilar?.calisma} yukleniyor={yukleniyor} />
          <Kutu ikon={<Activity size={18} />} baslik="Son 7 gün aktif" deger={sayilar?.aktif7} yukleniyor={yukleniyor} />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Araç dağılımı</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Hangi araçtan kaç çalışma açılmış.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 divide-y divide-slate-100 dark:divide-slate-700/60">
            {araclar.map((arac) => (
              <div key={arac.id} className="flex items-center gap-4 px-4 py-2.5">
                <span className="w-40 shrink-0 truncate text-sm font-medium">{arac.ad}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(arac.adet / enCok) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-end text-sm font-bold tabular-nums">{arac.adet}</span>
              </div>
            ))}
            {!araclar.length && !yukleniyor && (
              <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">Henüz çalışma yok.</p>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kullanıcı ara</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            E-posta adresiyle. Kayıt yalnızca kullanıcı en az bir kez giriş yaptıysa var.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              type="email"
              value={aranan}
              onChange={(e) => setAranan(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') ara(); }}
              placeholder="ornek@eposta.com"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              onClick={ara}
              disabled={aramaYukleniyor || !aranan.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {aramaYukleniyor ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Ara
            </button>
          </div>

          {aramaSonucu && !aramaSonucu.bulundu && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Bu adresle bir kayıt bulunamadı.</p>
          )}

          {aramaSonucu?.bulundu && (
            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 text-sm">
              <p className="font-bold text-base">{aramaSonucu.ad || '(adsız)'}</p>
              <p className="text-slate-500 dark:text-slate-400">{aramaSonucu.eposta}</p>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <Satir etiket="İlk görülme" deger={tarih(aramaSonucu.ilkGoruldu)} />
                <Satir etiket="Son görülme" deger={tarih(aramaSonucu.sonGoruldu)} />
                <Satir etiket="Klasör" deger={String(aramaSonucu.projeSayisi ?? 0)} />
                <Satir etiket="Çalışma" deger={String(aramaSonucu.calismaSayisi ?? 0)} />
              </dl>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Kullandığı araçlar:{' '}
                <span className="text-slate-700 dark:text-slate-200">
                  {aramaSonucu.araclar?.length
                    ? aramaSonucu.araclar.map(aracAdi).join(', ')
                    : 'yok'}
                </span>
              </p>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 break-all">
                Hesap no: {aramaSonucu.uid}
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 mb-16">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Son hareket</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            En son güncellenen 20 çalışma.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
            <table className="w-full text-sm">
              <thead className="text-start text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr className="border-b border-slate-100 dark:border-slate-700/60">
                  <th className="px-4 py-3 text-start font-semibold">Araç</th>
                  <th className="px-4 py-3 text-start font-semibold">Klasör</th>
                  <th className="px-4 py-3 text-start font-semibold">Güncellendi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {sonHareket.map((satir) => (
                  <tr key={satir.id}>
                    <td className="px-4 py-2.5 font-medium whitespace-nowrap">{aracAdi(satir.tool)}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 max-w-[16rem] truncate">{satir.projectName}</td>
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{tarih(satir.guncellendi)}</td>
                  </tr>
                ))}
                {!sonHareket.length && !yukleniyor && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-slate-500 dark:text-slate-400">Henüz hareket yok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Blog yazma paneli. Ayrı dosyada: bu ekranın geri kalanı yalnızca
            okuyor, blog paneli ise yazıyor ve siliyor. */}
        <AdminBlogPanel />
      </div>
    </div>
  );
}

function Kutu({ ikon, baslik, deger, yukleniyor }: {
  ikon: React.ReactNode; baslik: string; deger?: number; yukleniyor: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {ikon}
        <span className="text-xs font-semibold uppercase tracking-wide">{baslik}</span>
      </div>
      <p className="mt-2 text-3xl font-black tabular-nums text-slate-900 dark:text-white">
        {yukleniyor && deger === undefined ? '·' : deger ?? 0}
      </p>
    </div>
  );
}

function Satir({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-1.5">
      <dt className="text-slate-500 dark:text-slate-400">{etiket}</dt>
      <dd className="font-medium tabular-nums">{deger}</dd>
    </div>
  );
}

import {
  collection, doc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Blog yazılarının veri katmanı.
 *
 * Belge kimliği yazının adresteki adı (slug). Kullanıcı verisinden tamamen
 * ayrı: burası sitenin kendi içeriği, herkese açık okunuyor ve yalnızca
 * yönetici yazıyor (bkz. firestore.rules).
 *
 * İKİ KOLEKSİYON VAR:
 *   blog          → yayımlanmış yazılar, herkes okuyabilir
 *   blogTaslaklar → taslaklar, yalnızca yönetici
 *
 * Yayınlamak, yazıyı taslaklardan alıp yayına koymak; taslağa çekmek tersi.
 * Tek koleksiyonda tutup okumayı `durum == 'yayinda'` şartına bağlamayı
 * denedik, iki sebeple bırakıldı (bkz. firestore.rules'taki uzun not):
 * liste sorgusu kural yüzünden tamamen reddediliyordu, ve yayımlanmamış bir
 * metnin gizliliği tek bir kural satırına bağlı kalıyordu.
 *
 * DİKKAT: Depoyla (useRoadmapStore) ilgisi yok ve olmamalı. Blog sayfaları
 * giriş gerektirmiyor; oraya proje deposunu sokmak, blog okuyan ziyaretçiye
 * bütün tuval kodunu indirmek olurdu.
 */

export type BlogDurumu = 'taslak' | 'yayinda';

export interface BlogYazisi {
  /** Adresin son parçası: klarsti.com/blog/<slug> */
  slug: string;
  baslik: string;
  /** Liste sayfasında ve arama sonucunda görünen kısa açıklama. */
  ozet: string;
  /** Yazının dili: 'tr', 'en' ... (bkz. config/languages.ts) */
  dil: string;
  /** Kapak resminin adresi. Boş olabilir. */
  kapak: string;
  /** Yazının kendisi, basit işaretlemeli metin (bkz. utils/blogMetni.tsx). */
  govde: string;
  durum: BlogDurumu;
  /** İlk yayımlandığı an. Taslakta null. */
  yayinTarihi: number | null;
  guncellendi: number;
}

const YAYIN = 'blog';
const TASLAK = 'blogTaslaklar';

const koleksiyonAdi = (durum: BlogDurumu) => (durum === 'yayinda' ? YAYIN : TASLAK);

/**
 * Adres için uygun ad üretir: küçük harf, boşluklar tire, Türkçe harfler
 * karşılıklarına. Adres çubuğunda ve arama sonucunda okunur olsun diye
 * kırpılıyor da.
 */
export function slugUret(baslik: string): string {
  const harita: Record<string, string> = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u'
  };
  return baslik
    .split('')
    .map((h) => harita[h] ?? h)
    .join('')
    .toLowerCase()
    // Aksanlı latin harfleri (é, ñ ...) taban harflerine iniyor.
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function belgedenYazi(id: string, veri: Record<string, unknown>, durum: BlogDurumu): BlogYazisi {
  return {
    slug: id,
    baslik: String(veri.baslik ?? ''),
    ozet: String(veri.ozet ?? ''),
    dil: String(veri.dil ?? 'tr'),
    kapak: String(veri.kapak ?? ''),
    govde: String(veri.govde ?? ''),
    // Durum belgenin içinden değil, hangi koleksiyonda durduğundan okunuyor:
    // tek doğru kaynak yer olsun, alan onunla çelişemesin.
    durum,
    yayinTarihi: typeof veri.yayinTarihi === 'number' ? veri.yayinTarihi : null,
    guncellendi: typeof veri.guncellendi === 'number' ? veri.guncellendi : 0
  };
}

/**
 * Yayımlanmış yazılar, yenisi başta.
 *
 * Tek alana göre sıralama: Firestore bunun için kendiliğinden indeks tutuyor,
 * elle bileşik indeks tanımlamaya gerek yok.
 */
export async function yayinlananYazilar(): Promise<BlogYazisi[]> {
  const anlik = await getDocs(query(collection(db, YAYIN), orderBy('yayinTarihi', 'desc')));
  return anlik.docs.map((d) => belgedenYazi(d.id, d.data(), 'yayinda'));
}

/** Tek yayımlanmış yazı. Yoksa null. Taslaklar buradan gelmiyor. */
export async function yaziyiGetir(slug: string): Promise<BlogYazisi | null> {
  const anlik = await getDoc(doc(db, YAYIN, slug));
  return anlik.exists() ? belgedenYazi(anlik.id, anlik.data(), 'yayinda') : null;
}

/** Taslaklar dahil hepsi. Yalnızca yönetici okuyabilir. */
export async function tumYazilar(): Promise<BlogYazisi[]> {
  const [yayin, taslak] = await Promise.all([
    getDocs(collection(db, YAYIN)),
    getDocs(collection(db, TASLAK))
  ]);
  return [
    ...yayin.docs.map((d) => belgedenYazi(d.id, d.data(), 'yayinda')),
    ...taslak.docs.map((d) => belgedenYazi(d.id, d.data(), 'taslak'))
  ].sort((a, b) => b.guncellendi - a.guncellendi);
}

/**
 * Yazıyı kaydeder ve doğru koleksiyona koyar.
 *
 * Yayına ilk alınışında yayın tarihi konuyor; sonraki düzeltmeler tarihi
 * değiştirmiyor, yoksa eski bir yazı her dokunuşta listenin başına çıkardı.
 *
 * Diğer koleksiyondaki kopya siliniyor: yazı taslaktan yayına (ya da tersine)
 * geçtiğinde iki yerde birden durursa, yayından kaldırdığın bir yazı sitede
 * görünmeye devam ederdi.
 */
export async function yaziyiKaydet(yazi: BlogYazisi): Promise<void> {
  const kayit = {
    baslik: yazi.baslik,
    ozet: yazi.ozet,
    dil: yazi.dil,
    kapak: yazi.kapak,
    govde: yazi.govde,
    yayinTarihi:
      yazi.durum === 'yayinda' ? (yazi.yayinTarihi ?? Date.now()) : yazi.yayinTarihi,
    guncellendi: Date.now()
  };
  const hedef = koleksiyonAdi(yazi.durum);
  const oteki = hedef === YAYIN ? TASLAK : YAYIN;

  await setDoc(doc(db, hedef, yazi.slug), kayit);
  await deleteDoc(doc(db, oteki, yazi.slug)).catch(() => {
    // Öteki koleksiyonda kayıt yoksa silme hata vermiyor; yine de kural ya da
    // ağ hatası yutulmasın diye ayrı yakalanıyor: kaydın kendisi başarılı.
  });
}

/** Yazıyı iki koleksiyondan da siler. */
export async function yaziyiSil(slug: string): Promise<void> {
  await Promise.all([
    deleteDoc(doc(db, YAYIN, slug)),
    deleteDoc(doc(db, TASLAK, slug))
  ]);
}

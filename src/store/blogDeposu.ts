import {
  collection, doc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc, where
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Blog yazılarının veri katmanı.
 *
 * Yazılar `blog` koleksiyonunda, belge kimliği yazının adresteki adı (slug).
 * Kullanıcı verisinden tamamen ayrı: burası sitenin kendi içeriği, herkese
 * açık okunuyor ve yalnızca yönetici yazıyor (bkz. firestore.rules).
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

const KOLEKSIYON = 'blog';

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

function belgedenYazi(id: string, veri: Record<string, unknown>): BlogYazisi {
  return {
    slug: id,
    baslik: String(veri.baslik ?? ''),
    ozet: String(veri.ozet ?? ''),
    dil: String(veri.dil ?? 'tr'),
    kapak: String(veri.kapak ?? ''),
    govde: String(veri.govde ?? ''),
    durum: veri.durum === 'yayinda' ? 'yayinda' : 'taslak',
    yayinTarihi: typeof veri.yayinTarihi === 'number' ? veri.yayinTarihi : null,
    guncellendi: typeof veri.guncellendi === 'number' ? veri.guncellendi : 0
  };
}

/**
 * Yayımlanmış yazılar, yenisi başta.
 *
 * `where` şartı şart: kural taslakları kapatıyor ve Firestore, kuralın
 * eleyeceği belge içerebilecek bir sorguyu baştan reddediyor.
 */
export async function yayinlananYazilar(): Promise<BlogYazisi[]> {
  const sorgu = query(
    collection(db, KOLEKSIYON),
    where('durum', '==', 'yayinda'),
    orderBy('yayinTarihi', 'desc')
  );
  const anlik = await getDocs(sorgu);
  return anlik.docs.map((d) => belgedenYazi(d.id, d.data()));
}

/** Tek yazı. Yoksa ya da taslaksa (yönetici değilsek) null. */
export async function yaziyiGetir(slug: string): Promise<BlogYazisi | null> {
  try {
    const anlik = await getDoc(doc(db, KOLEKSIYON, slug));
    if (!anlik.exists()) return null;
    return belgedenYazi(anlik.id, anlik.data());
  } catch {
    // Taslağı okumaya çalışan ziyaretçide kural hatası dönüyor; onun için
    // "yazı yok" ile aynı şey.
    return null;
  }
}

/** Taslaklar dahil hepsi. Yalnızca yönetici okuyabilir. */
export async function tumYazilar(): Promise<BlogYazisi[]> {
  const anlik = await getDocs(collection(db, KOLEKSIYON));
  return anlik.docs
    .map((d) => belgedenYazi(d.id, d.data()))
    .sort((a, b) => b.guncellendi - a.guncellendi);
}

/**
 * Yazıyı kaydeder. Yayına ilk alınışında yayın tarihi konuyor; sonraki
 * düzeltmeler tarihi değiştirmiyor, yoksa eski bir yazı her dokunuşta
 * listenin başına çıkardı.
 */
export async function yaziyiKaydet(yazi: BlogYazisi): Promise<void> {
  const kayit = {
    baslik: yazi.baslik,
    ozet: yazi.ozet,
    dil: yazi.dil,
    kapak: yazi.kapak,
    govde: yazi.govde,
    durum: yazi.durum,
    yayinTarihi:
      yazi.durum === 'yayinda' ? (yazi.yayinTarihi ?? Date.now()) : yazi.yayinTarihi,
    guncellendi: Date.now()
  };
  await setDoc(doc(db, KOLEKSIYON, yazi.slug), kayit);
}

export async function yaziyiSil(slug: string): Promise<void> {
  await deleteDoc(doc(db, KOLEKSIYON, slug));
}

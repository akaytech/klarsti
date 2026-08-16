// Yayımlanmış blog yazılarını build sırasında Firestore'dan okur.
//
// NEDEN SERVİS HESABI GEREKİYOR: Firestore'da App Check zorlaması açık, yani
// düz bir HTTP isteği kural "herkes okuyabilir" dese bile reddediliyor.
// Tarayıcı App Check jetonu üretiyor, derleme sunucusu üretemiyor. Servis
// hesabı kimliğiyle yapılan istek hem App Check'i hem kuralları aşıyor.
//
// Kimlik, GitHub Actions'ta zaten tanımlı olan yayın hesabından geliyor
// (FIREBASE_SERVICE_ACCOUNT_KLARSTI). Kimlik yoksa — yani yerelde
// `npm run build` çalıştırıldığında — hata verilmiyor, boş liste dönüyor:
// yerel derlemenin veritabanına ihtiyacı olmamalı.
//
// DİKKAT: Yalnızca `blog` koleksiyonu okunuyor. Taslaklar ayrı koleksiyonda
// ve buraya hiç girmiyor; yayımlanmamış bir yazı kazara sitede belirmesin.

import crypto from 'node:crypto';

const KOLEKSIYON = 'blog';
const KAPSAM = 'https://www.googleapis.com/auth/datastore';

function kimligiOku() {
  const ham = process.env.FIREBASE_SERVICE_ACCOUNT_KLARSTI;
  if (!ham) return null;
  try {
    const kimlik = JSON.parse(ham);
    if (!kimlik.client_email || !kimlik.private_key) return null;
    return kimlik;
  } catch {
    console.warn('blogCek: servis hesabi okunamadi (gecerli JSON degil).');
    return null;
  }
}

const b64 = (deger) =>
  Buffer.from(typeof deger === 'string' ? deger : JSON.stringify(deger))
    .toString('base64url');

/**
 * Servis hesabı anahtarıyla erişim jetonu alır.
 *
 * Kütüphane eklenmedi: google-auth-library bu iş için onlarca bağımlılık
 * getiriyor, imzalanacak şey ise tek bir JWT. Node'un kendi crypto modülü
 * RS256'yı zaten biliyor.
 */
async function jetonAl(kimlik) {
  const simdi = Math.floor(Date.now() / 1000);
  const baslik = { alg: 'RS256', typ: 'JWT' };
  const govde = {
    iss: kimlik.client_email,
    scope: KAPSAM,
    aud: 'https://oauth2.googleapis.com/token',
    iat: simdi,
    exp: simdi + 3600
  };

  const imzalanacak = `${b64(baslik)}.${b64(govde)}`;
  const imza = crypto
    .createSign('RSA-SHA256')
    .update(imzalanacak)
    .sign(kimlik.private_key.replace(/\\n/g, '\n'), 'base64url');

  const cevap = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${imzalanacak}.${imza}`
    })
  });

  if (!cevap.ok) {
    throw new Error(`jeton alinamadi (${cevap.status}): ${(await cevap.text()).slice(0, 200)}`);
  }
  return (await cevap.json()).access_token;
}

/** Firestore'un alan biçimini düz değere çevirir. */
const deger = (alan) => {
  if (!alan) return undefined;
  if ('stringValue' in alan) return alan.stringValue;
  if ('integerValue' in alan) return Number(alan.integerValue);
  if ('doubleValue' in alan) return alan.doubleValue;
  if ('booleanValue' in alan) return alan.booleanValue;
  if ('nullValue' in alan) return null;
  return undefined;
};

/**
 * Yayımlanmış yazılar, yenisi başta. Kimlik yoksa ya da okuma başarısızsa
 * boş liste; derleme bu yüzden durmuyor.
 */
export async function yayinlananYazilariCek(projeId = 'klarsti') {
  const kimlik = kimligiOku();
  if (!kimlik) {
    console.log('blogCek: servis hesabi yok, blog sayfalari uretilmiyor (yerel derleme icin normal).');
    return [];
  }

  try {
    const jeton = await jetonAl(kimlik);
    const cevap = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projeId}/databases/(default)/documents:runQuery`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: KOLEKSIYON }],
            orderBy: [{ field: { fieldPath: 'yayinTarihi' }, direction: 'DESCENDING' }]
          }
        })
      }
    );

    if (!cevap.ok) {
      // Sessizce geçmiyoruz: yayin akisinda bu satiri gormek, blog
      // sayfalarinin neden uretilmedigini aciklayan tek ipucu.
      console.warn(
        `\nblogCek UYARI: Firestore okunamadi (${cevap.status}). Blog sayfalari URETILMEDI.\n` +
        `  ${(await cevap.text()).slice(0, 200)}\n` +
        `  Muhtemel sebep: servis hesabinin Firestore okuma yetkisi yok.\n` +
        `  Google Cloud Console > IAM > ${kimlik.client_email} > "Cloud Datastore Viewer" rolunu ekle.\n`
      );
      return [];
    }

    const satirlar = await cevap.json();
    // Basarili okuma da yazılıyor: yayin kaydinda "0 yazi" gordugunde bunun
    // sebebi gercekten yazi olmamasi mi, yoksa okumanin hic olmamasi mi —
    // bu satir olmadan ikisi ayirt edilemiyor.
    console.log(`blogCek: Firestore okundu, ${satirlar.filter((s) => s.document).length} yayimlanmis yazi.`);
    return satirlar
      .filter((s) => s.document)
      .map((s) => {
        const alanlar = s.document.fields || {};
        return {
          slug: s.document.name.split('/').pop(),
          baslik: deger(alanlar.baslik) ?? '',
          ozet: deger(alanlar.ozet) ?? '',
          dil: deger(alanlar.dil) ?? 'tr',
          kapak: deger(alanlar.kapak) ?? '',
          govde: deger(alanlar.govde) ?? '',
          yayinTarihi: deger(alanlar.yayinTarihi) ?? null
        };
      })
      .filter((y) => y.slug && y.baslik);
  } catch (hata) {
    console.warn(`\nblogCek UYARI: ${hata.message}\n  Blog sayfalari URETILMEDI.\n`);
    return [];
  }
}

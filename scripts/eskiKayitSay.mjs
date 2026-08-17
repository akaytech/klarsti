// Sunucuda kaç kayıt hâlâ ESKİ biçimde duruyor?
//
// NEDEN VAR: useRoadmapStore.ts içindeki parseDoc, on ayrı eski kayıt biçimini
// okuma anında yenisine çeviriyor. O kod silinecek. Silmeden önce cevabı
// bilinmesi gereken tek soru şu: silersek gerçekten okunamaz hale gelecek bir
// kayıt var mı?
//
// Bu betik HİÇBİR ŞEY YAZMAZ. Yalnızca okur ve sayar.
//
// KULLANIM
//   1. Firebase Console > Proje ayarları > Servis hesapları > "Yeni özel
//      anahtar oluştur". İnen JSON dosyasını proje köküne
//      `klarsti-servis-hesabi.json` adıyla koy (.gitignore'da, repoya girmez).
//   2. node scripts/eskiKayitSay.mjs
//
// Anahtar başka bir yerdeyse: SERVIS_HESABI=/yol/anahtar.json node scripts/...
// GitHub Actions'taki gibi ham JSON da olur: FIREBASE_SERVICE_ACCOUNT_KLARSTI
//
// NEDEN SERVİS HESABI ŞART: Firestore'da App Check zorlaması açık. Düz bir
// HTTP isteği, kural izin verse bile reddediliyor (bkz. blogCek.mjs). Ayrıca
// bütün kullanıcıların projelerini saymak zaten yönetici yetkisi istiyor.

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const PROJE_ID = process.env.FIREBASE_PROJE_ID || 'klarsti';
const KAPSAM = 'https://www.googleapis.com/auth/datastore';
const VARSAYILAN_ANAHTAR = new URL('../klarsti-servis-hesabi.json', import.meta.url);

// useRoadmapStore.ts ile AYNI liste olmalı; parseDoc bu anahtarları belgenin
// kökünden okuyup toolData'nın üzerine yazıyor ve eski kayıtlar tam da kökte
// duruyor.
const TOOL_STATE_KEYS = [
  'wbsTrees', 'fiveWhysAnalyses', 'swot', 'ishikawa',
  'pdca', 'waterfall', 'pareto', 'histogram', 'decision',
  'flowcharts', 'orgcharts', 'mindmaps', 'ftaAnalyses',
  'vsmMaps', 'ganttPlans'
];

/* ------------------------------------------------------------------ kimlik */

function kimligiOku() {
  const ham = process.env.FIREBASE_SERVICE_ACCOUNT_KLARSTI;
  if (ham) return JSON.parse(ham);

  const yol = process.env.SERVIS_HESABI || VARSAYILAN_ANAHTAR;
  try {
    return JSON.parse(readFileSync(yol, 'utf8'));
  } catch {
    console.error(
      '\nServis hesabi anahtari bulunamadi.\n\n' +
      '  Firebase Console > Proje ayarlari > Servis hesaplari >\n' +
      '  "Yeni ozel anahtar olustur" de, inen JSON dosyasini proje kokune\n' +
      '  klarsti-servis-hesabi.json adiyla koy. (.gitignore\'da, repoya girmez.)\n'
    );
    process.exit(1);
  }
}

const b64 = (d) =>
  Buffer.from(typeof d === 'string' ? d : JSON.stringify(d)).toString('base64url');

// Kütüphane yok: imzalanacak şey tek bir JWT, Node'un crypto'su RS256'yı
// zaten biliyor (blogCek.mjs ile aynı gerekçe).
async function jetonAl(kimlik) {
  const simdi = Math.floor(Date.now() / 1000);
  const imzalanacak =
    `${b64({ alg: 'RS256', typ: 'JWT' })}.` +
    b64({
      iss: kimlik.client_email,
      scope: KAPSAM,
      aud: 'https://oauth2.googleapis.com/token',
      iat: simdi,
      exp: simdi + 3600
    });

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
    throw new Error(`jeton alinamadi (${cevap.status}): ${(await cevap.text()).slice(0, 300)}`);
  }
  return (await cevap.json()).access_token;
}

/* -------------------------------------------------------------- okuma */

/** Firestore'un alan biçimini düz JS değerine çevirir (iç içe dahil). */
function coz(alan) {
  if (!alan || typeof alan !== 'object') return undefined;
  if ('nullValue' in alan) return null;
  if ('stringValue' in alan) return alan.stringValue;
  if ('booleanValue' in alan) return alan.booleanValue;
  if ('integerValue' in alan) return Number(alan.integerValue);
  if ('doubleValue' in alan) return alan.doubleValue;
  if ('timestampValue' in alan) return alan.timestampValue;
  if ('arrayValue' in alan) return (alan.arrayValue.values || []).map(coz);
  if ('mapValue' in alan) return cozAlanlar(alan.mapValue.fields || {});
  return undefined;
}

const cozAlanlar = (alanlar) =>
  Object.fromEntries(Object.entries(alanlar).map(([k, v]) => [k, coz(v)]));

/** Bir koleksiyonun tamamı, sayfa sayfa. */
async function koleksiyonuOku(jeton, koleksiyon) {
  const hepsi = [];
  let jetonSayfa;
  do {
    const adres = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJE_ID}/databases/(default)/documents/${koleksiyon}`
    );
    adres.searchParams.set('pageSize', '300');
    if (jetonSayfa) adres.searchParams.set('pageToken', jetonSayfa);

    const cevap = await fetch(adres, { headers: { Authorization: `Bearer ${jeton}` } });
    if (!cevap.ok) {
      throw new Error(`${koleksiyon} okunamadi (${cevap.status}): ${(await cevap.text()).slice(0, 300)}`);
    }
    const govde = await cevap.json();
    (govde.documents || []).forEach((d) =>
      hepsi.push({ id: d.name.split('/').pop(), ...cozAlanlar(d.fields || {}) })
    );
    jetonSayfa = govde.nextPageToken;
  } while (jetonSayfa);

  return hepsi;
}

/* ------------------------------------------------------------- ölçütler */

const dizi = (d) => (Array.isArray(d) ? d : []);

/**
 * parseDoc'un gördüğü toolData: belgenin kendi toolData'sı, üzerine kökteki
 * araç alanları yazılmış hali.
 */
export function toolDataKur(belge) {
  const toolData = { ...(belge.toolData || {}) };
  TOOL_STATE_KEYS.forEach((k) => {
    if (belge[k] !== undefined) toolData[k] = belge[k];
  });
  return toolData;
}

/**
 * Ölçütler parseDoc'takilerle birebir aynı olmak zorunda.
 *
 * DİKKAT — hiç kullanılmamış araç "eski" DEĞİLDİR. Örneğin kırılım ağacına
 * hiç girilmemiş bir projede `wbsTrees` alanı yoktur; parseDoc orada da
 * `!Array.isArray(...)` görür ama dönüştürecek veri bulamadığı için hiçbir şey
 * yapmaz. O yüzden her ölçüt "dönüştürülecek veri gerçekten var mı" diye
 * soruyor. Bu ayrım olmasa her proje eski görünürdü.
 */
export const OLCUTLER = [
  {
    ad: 'Kirilim agaci: tek agacli eski kayit',
    bak: (t, b) => !Array.isArray(t.wbsTrees) && dizi(b.nodes ?? t.nodes).length > 0
  },
  {
    ad: 'Kirilim agaci: kutuda isManuallyPositioned',
    bak: (t, b) =>
      dizi(b.nodes ?? t.nodes).some((n) => n?.data?.isManuallyPositioned !== undefined) ||
      dizi(t.wbsTrees).some((a) =>
        dizi(a?.nodes).some((n) => n?.data?.isManuallyPositioned !== undefined))
  },
  {
    ad: 'Akis semasi: tek semali eski kayit',
    bak: (t, b) =>
      !Array.isArray(t.flowcharts) && dizi(b.flowchartNodes ?? t.flowchartNodes).length > 0
  },
  {
    ad: 'Organizasyon semasi: akis semasi icinde (type: org)',
    bak: (t) => dizi(t.flowcharts).some((s) => s?.type === 'org')
  },
  {
    ad: 'Zihin haritasi: tek haritali eski kayit',
    bak: (t, b) =>
      !Array.isArray(t.mindmaps) && dizi(b.mindmapNodes ?? t.mindmapNodes).length > 0
  },
  {
    ad: 'Deger akisi: tek haritali eski kayit',
    bak: (t, b) => !Array.isArray(t.vsmMaps) && dizi(b.vsmNodes ?? t.vsmNodes).length > 0
  },
  {
    ad: 'Deger akisi: ciplak sure (timeUnit / sayi cycleTime)',
    bak: (t, b) =>
      [...dizi(b.vsmNodes ?? t.vsmNodes), ...dizi(t.vsmMaps).flatMap((h) => dizi(h?.nodes))]
        .some((n) => n?.data?.timeUnit !== undefined || typeof n?.data?.cycleTime === 'number')
  },
  {
    ad: '5 Neden: tek analizli eski kayit',
    bak: (t, b) =>
      !Array.isArray(t.fiveWhysAnalyses) && dizi(b.fiveWhysNodes ?? t.fiveWhysNodes).length > 0
  },
  {
    ad: 'Hata agaci: tek analizli eski kayit',
    bak: (t, b) => !Array.isArray(t.ftaAnalyses) && dizi(b.ftaNodes ?? t.ftaNodes).length > 0
  },
  {
    ad: 'SWOT: duz kalem listesi (analiz sarmalayicisi yok)',
    bak: (t) => {
      const ilk = dizi(t.swot)[0];
      return !!ilk && typeof ilk === 'object' && 'type' in ilk;
    }
  },
  {
    ad: 'Histogram: kategori/siklik kalemleri (olcumler yok)',
    bak: (t) => dizi(t.histogram).some((h) => h && !Array.isArray(h.olcumler))
  },
  {
    ad: 'Selale: eski asama adi (Design)',
    bak: (t) => dizi(t.waterfall).some((p) => dizi(p?.items).some((i) => i?.phase === 'Design'))
  },
  {
    ad: 'Selale: currentPhaseIndex eksik',
    bak: (t) => dizi(t.waterfall).some((p) => p && p.currentPhaseIndex === undefined)
  },
  {
    ad: 'Ajanda: proje icinde kalmis eski kayit',
    bak: (t, b) => b.notepad !== undefined || b.toolData?.notepad !== undefined
  }
];

/* ------------------------------------------------------------------- ana */

// Ölçütler dışarıdan sınanabilsin diye (bkz. scripts/eskiKayitSayDeneme.mjs)
// ana akış yalnızca doğrudan çalıştırıldığında işliyor.
if (!import.meta.main) {
  // içe aktarıldı: yalnızca ölçütler kullanılacak, sunucuya bağlanma.
} else {

const kimlik = kimligiOku();
console.log(`Servis hesabi: ${kimlik.client_email}`);
console.log(`Proje: ${PROJE_ID}\n`);

const jeton = await jetonAl(kimlik);

const projeler = await koleksiyonuOku(jeton, 'projects');
const calismalar = await koleksiyonuOku(jeton, 'works');
const profiller = await koleksiyonuOku(jeton, 'profiles').catch(() => []);

console.log(`Hesap    : ${profiller.length}`);
console.log(`Klasor   : ${projeler.length}`);
console.log(`Calisma  : ${calismalar.length}\n`);

const sayaclar = OLCUTLER.map(() => 0);
const etkilenen = new Set();

projeler.forEach((belge) => {
  const toolData = toolDataKur(belge);
  OLCUTLER.forEach((olcut, i) => {
    let sonuc = false;
    try {
      sonuc = !!olcut.bak(toolData, belge);
    } catch {
      // Bozuk/yarim belge olcutu patlatmasin; sayimin tamami durmasin.
      sonuc = false;
    }
    if (sonuc) {
      sayaclar[i] += 1;
      etkilenen.add(belge.id);
    }
  });
});

const enUzun = Math.max(...OLCUTLER.map((o) => o.ad.length));
console.log('ESKI BICIMDE KALAN KAYITLAR (klasor sayisi)');
console.log('-'.repeat(enUzun + 8));
OLCUTLER.forEach((olcut, i) => {
  const n = sayaclar[i];
  console.log(`${olcut.ad.padEnd(enUzun)}  ${String(n).padStart(4)}${n > 0 ? '  <--' : ''}`);
});
console.log('-'.repeat(enUzun + 8));

if (etkilenen.size === 0) {
  console.log('\nHicbir kayit eski bicimde degil.');
  console.log('parseDoc icindeki donusturuculer guvenle silinebilir.\n');
} else {
  console.log(`\n${etkilenen.size} klasor etkileniyor (toplam ${projeler.length} icinde).`);
  console.log('Kimlikler:');
  Array.from(etkilenen).forEach((id) => console.log(`  ${id}`));
  console.log('\nDonusturucular simdi silinirse bu klasorlerdeki ilgili araclar bos gorunur.');
  console.log('(Veri sunucuda durmaya devam eder, sadece uygulama okumaz.)\n');
}

}

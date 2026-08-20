// Hiçbir yerde kullanılmayan çeviri anahtarlarını bulur.
//
//   node scripts/oluCeviriler.mjs          → raporla
//   node scripts/oluCeviriler.mjs --sil    → on bir dil dosyasından da sil
//
// Nasıl arıyor: kaynakta anahtarın düz metin olarak geçtiği her yer sayılıyor.
// Arama kaba: anahtar bir açıklama satırında geçse bile "kullanılıyor" sayılır.
// Bu bilerek böyle — yanlış tarafa düşerse hiç olmazsa kullanılan bir metni
// silmez, sadece ölü bir anahtarı gözden kaçırır.
//
// Bir de kodda parça parça KURULAN anahtarlar var — t(`faq_q${no}`) gibi.
// Onlar düz aramada bulunamaz; aşağıdaki kalıplar bilerek elde tutuluyor,
// yoksa betik kullanılan anahtarları "ölü" sanardı.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DILLER = path.join(KOK, 'src', 'locales');
const KAYNAK = path.join(KOK, 'src');
const SIL = process.argv.includes('--sil');

/**
 * Kodda birleştirilerek üretilen anahtarlar. Düzenli ifade tuttuğu sürece
 * anahtar kullanılıyor sayılır.
 *
 * Buraya bir kalıp eklerken kaynakta gerçekten öyle kurulduğunu doğrula:
 * yanlış bir kalıp, ölü anahtarı sonsuza kadar canlı gösterir.
 */
const KURULAN = [
  // Sık sorulanlar: t(`faq_q${no}`) / t(`faq_a${no}`) — FiyatVeSorular.tsx
  /^faq_[qa]\d+$/,
  // Gantt görünüm ölçeği: t(`gantt_zoom_${y}`) — GanttCanvas.tsx
  /^gantt_zoom_/,
  // Gantt görev durumları: t(`gantt_status_${d}`) — GanttCanvas.tsx
  /^gantt_status_/,
];

const kaynakDosyalari = async (klasor) => {
  const cikti = [];
  for (const girdi of await readdir(klasor, { withFileTypes: true })) {
    const tam = path.join(klasor, girdi.name);
    if (girdi.isDirectory()) {
      if (girdi.name === 'locales') continue;
      cikti.push(...(await kaynakDosyalari(tam)));
    } else if (/\.(ts|tsx|js|jsx|html)$/.test(girdi.name)) {
      cikti.push(tam);
    }
  }
  return cikti;
};

const dosyalar = [...(await kaynakDosyalari(KAYNAK))];
// Statik sayfa üreticisi ve betikler de çeviri okuyor.
for (const ek of ['scripts/staticPages.mjs', 'index.html']) {
  try {
    dosyalar.push(path.join(KOK, ek));
  } catch {
    /* yoksa boş ver */
  }
}

const govde = (await Promise.all(dosyalar.map((d) => readFile(d, 'utf8').catch(() => '')))).join('\n');

const tr = JSON.parse(await readFile(path.join(DILLER, 'tr.json'), 'utf8'));
const anahtarlar = Object.keys(tr);

// Çoğul biçimleri (works_count_one, _few, _many …) kodda hiç geçmez: çağrı
// taban anahtarı verir, biçimi i18next seçer. Ek atılmadan arandığında hepsi
// "kullanılmıyor" görünüyordu — `--sil` çalıştırılsa bütün çoğul biçimler
// silinirdi.
const COGUL_EKI = /_(zero|one|two|few|many|other)$/;

const olu = [];
const kurulanSayisi = [];
for (const anahtar of anahtarlar) {
  const aranan = anahtar.replace(COGUL_EKI, '');
  if (govde.includes(aranan)) continue;
  if (KURULAN.some((k) => k.test(anahtar))) {
    kurulanSayisi.push(anahtar);
    continue;
  }
  olu.push(anahtar);
}

console.log(`toplam anahtar : ${anahtarlar.length}`);
console.log(`kodda kuruluyor: ${kurulanSayisi.length} (elde tutuldu)`);
console.log(`kullanilmayan  : ${olu.length}`);
if (olu.length) console.log('\n' + olu.map((a) => `  ${a}`).join('\n'));

if (!SIL) {
  if (olu.length) console.log('\nSilmek icin: node scripts/oluCeviriler.mjs --sil');
  process.exit(0);
}

if (!olu.length) process.exit(0);

for (const dosya of await readdir(DILLER)) {
  if (!dosya.endsWith('.json')) continue;
  const yol = path.join(DILLER, dosya);
  const veri = JSON.parse(await readFile(yol, 'utf8'));
  let silinen = 0;
  for (const anahtar of olu) {
    if (anahtar in veri) {
      delete veri[anahtar];
      silinen++;
    }
  }
  await writeFile(yol, JSON.stringify(veri, null, 2) + '\n', 'utf8');
  console.log(`${dosya}: ${silinen} anahtar silindi`);
}

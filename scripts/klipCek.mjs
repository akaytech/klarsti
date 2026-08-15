// Ana sayfadaki tanıtım kliplerini çeker.
//
// Kullanım (önce `npm run dev` açık olmalı):
//   node scripts/klipCek.mjs                 → bütün sahneler, iki tema
//   node scripts/klipCek.mjs pareto          → tek sahne
//   node scripts/klipCek.mjs pareto acik     → tek sahne, tek tema
//
// Nasıl çalışıyor: tarayıcı /demo-cekim/<sahne> adresini açıyor, sayfadaki
// düzenek adımları gerçek uygulamanın üstünde oynatıyor, Chrome'un screencast
// akışı her kareyi gönderiyor, ffmpeg de kareleri videoya çeviriyor.
//
// Çıktılar: public/tanitim/<sahne>-<tema>.mp4 ve -poster.jpg

import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CIKTI = path.join(KOK, 'public', 'tanitim');
// Geliştirme sunucusunda taban adres /klarsti/ (bkz. vite.config.ts).
const ADRES = process.env.DEMO_ADRES || 'http://localhost:5173/klarsti';

// Videonun ölçüsü.
const GENISLIK = 1280;
const YUKSEKLIK = 720;
// Sayfanın kendi ölçüsü daha küçük: uygulama 1024 piksellik bir pencereye
// göre yerleşiyor, görüntü 1280'e büyütülüyor. Böylece küçük bir kutuda
// oynayan klipte yazılar okunabilir kalıyor.
const SAYFA_GENISLIK = 1024;
const SAYFA_YUKSEKLIK = 576;
// Yazılar keskin çıksın diye iki katı çekilip küçültülüyor.
const OLCEK = 2;
const FPS = 30;

const TUM_SAHNELER = ['is-kirilimi', 'bes-neden', 'pareto', 'zihin-haritasi'];
const TUM_TEMALAR = ['acik', 'koyu'];

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
].find((p) => existsSync(p));

const calistir = (komut, argumanlar) =>
  new Promise((cozumle, reddet) => {
    const is = spawn(komut, argumanlar, { stdio: ['ignore', 'ignore', 'pipe'] });
    let hata = '';
    is.stderr.on('data', (p) => {
      hata += p.toString();
    });
    is.on('close', (kod) => (kod === 0 ? cozumle() : reddet(new Error(`${komut} ${kod}\n${hata.slice(-1500)}`))));
  });

async function sahneCek(tarayici, sahne, tema, gecici) {
  const sayfa = await tarayici.newPage({
    viewport: { width: SAYFA_GENISLIK, height: SAYFA_YUKSEKLIK },
    deviceScaleFactor: OLCEK,
  });

  // Çerez şeridi klibe girmesin; kararı verilmiş sayılıyor. Küçük harita da
  // kapalı: 1280 pikselik kadrajda sağdaki kutuların üstüne biniyor.
  await sayfa.addInitScript(() => {
    try {
      localStorage.setItem('klarsti-cerez-izni', 'red');
      localStorage.setItem('klarsti-minimap-acik', '0');
    } catch {
      /* boş */
    }
  });

  const adres = `${ADRES}/demo-cekim/${sahne}?tema=${tema}&dil=tr`;
  await sayfa.goto(adres, { waitUntil: 'domcontentloaded' });
  await sayfa.waitForFunction(() => window.__demoHazir === true, null, { timeout: 90000 });

  // Geliştirme sunucusu bekleyen bir HMR güncellemesi tutuyorsa main.tsx iki
  // kez çalışıyor ve sayfada iki uygulama birden duruyor: ölçülen koordinatlar
  // kayıyor, klip bozuluyor. Böyle bir durumda sayfa bir kez yenileniyor.
  for (let deneme = 0; deneme < 3; deneme++) {
    const agacSayisi = await sayfa.evaluate(() => document.querySelectorAll('#root > div').length);
    if (agacSayisi === 1) break;
    if (deneme === 2) throw new Error(`${sahne}/${tema}: sayfada ${agacSayisi} uygulama var, dev sunucusunu yeniden başlat`);
    await sayfa.reload({ waitUntil: 'domcontentloaded' });
    await sayfa.waitForFunction(() => window.__demoHazir === true, null, { timeout: 90000 });
  }

  const kareler = [];
  const cdp = await sayfa.context().newCDPSession(sayfa);
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    kareler.push({ data, zaman: metadata.timestamp });
    try {
      await cdp.send('Page.screencastFrameAck', { sessionId });
    } catch {
      // Akış kapandıysa onay gitmeyebilir; kaydın sonu zaten geldi.
    }
  });

  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: SAYFA_GENISLIK * OLCEK,
    maxHeight: SAYFA_YUKSEKLIK * OLCEK,
    everyNthFrame: 1,
  });

  await sayfa.evaluate(() => window.__demoBaslat());
  // Son kare de aksın.
  await sayfa.waitForTimeout(400);
  await cdp.send('Page.stopScreencast');
  await sayfa.close();

  if (kareler.length < 10) throw new Error(`${sahne}/${tema}: kare gelmedi (${kareler.length})`);

  // Kareler ve süreleri: screencast yalnızca ekran değiştiğinde kare
  // gönderiyor, o yüzden her karenin ne kadar durduğu zaman damgasından
  // hesaplanıyor.
  const klasor = path.join(gecici, `${sahne}-${tema}`);
  await mkdir(klasor, { recursive: true });
  const satirlar = [];
  for (let i = 0; i < kareler.length; i++) {
    const dosya = path.join(klasor, `k${String(i).padStart(5, '0')}.jpg`);
    await writeFile(dosya, Buffer.from(kareler[i].data, 'base64'));
    const sure = i < kareler.length - 1 ? Math.max(1 / FPS, kareler[i + 1].zaman - kareler[i].zaman) : 1.4;
    satirlar.push(`file '${dosya.replace(/\\/g, '/')}'`, `duration ${sure.toFixed(4)}`);
  }
  // concat demuxer son karenin süresini yok sayıyor; dosyayı bir kez daha yaz.
  satirlar.push(`file '${path.join(klasor, `k${String(kareler.length - 1).padStart(5, '0')}.jpg`).replace(/\\/g, '/')}'`);
  const liste = path.join(klasor, 'liste.txt');
  await writeFile(liste, satirlar.join('\n'));

  const ad = `${sahne}-${tema}`;
  const olcek = `scale=${GENISLIK}:${YUKSEKLIK}:flags=lanczos,fps=${FPS}`;

  await calistir('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', liste, '-vf', olcek,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-an',
    '-movflags', '+faststart', path.join(CIKTI, `${ad}.mp4`)]);

  // Yalnızca mp4 üretiliyor. VP9/webm de denendi: bu içerikte dosyaları
  // h264'ten büyük çıkıyor (kutular düz renk, h264 çok iyi sıkıştırıyor) ve
  // her tarayıcı çözemiyor. h264'ü çözemeyen tarayıcı yok.
  await calistir('ffmpeg', ['-y', '-i', path.join(klasor, 'k00000.jpg'), '-vf', `scale=${GENISLIK}:-2:flags=lanczos`,
    '-q:v', '6', path.join(CIKTI, `${ad}-poster.jpg`)]);

  return kareler.length;
}

async function main() {
  if (!CHROME) throw new Error('Chrome bulunamadı.');
  const [sahneArg, temaArg] = process.argv.slice(2);
  const sahneler = sahneArg ? [sahneArg] : TUM_SAHNELER;
  const temalar = temaArg ? [temaArg] : TUM_TEMALAR;

  await mkdir(CIKTI, { recursive: true });
  const gecici = path.join(os.tmpdir(), `klarsti-klip-${Date.now()}`);
  await mkdir(gecici, { recursive: true });

  const tarayici = await chromium.launch({ executablePath: CHROME, args: ['--hide-scrollbars', '--force-device-scale-factor=1'] });

  try {
    for (const sahne of sahneler) {
      for (const tema of temalar) {
        const basla = Date.now();
        const sayi = await sahneCek(tarayici, sahne, tema, gecici);
        console.log(`${sahne}-${tema}: ${sayi} kare, ${((Date.now() - basla) / 1000).toFixed(1)} sn`);
      }
    }
  } finally {
    await tarayici.close();
    await rm(gecici, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

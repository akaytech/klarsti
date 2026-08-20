// Çeviri dosyalarının denetimi. `npm run i18n:lint` ile ve CI'da çalışır.
//
// Neden var: Ağustos 2026'daki i18n denetiminde bulunan hataların çoğu
// gözle görülür cinstendi ama kimse tek tek 11 dosyayı okumadığı için aylarca
// yayında kaldı — Rusça'da "Агенда" diye olmayan bir kelime, İngilizcede
// "item add...", 55 anahtarda Lorem ipsum, Almanca ekranda karışık "Sie"/"du".
// Bu betik onların geri gelmesini engelliyor.
//
// Kurallar tek tek AÇILIP KAPATILABİLİR (bkz. KURALLAR): bir kural henüz
// temiz değilse `seviye: 'uyari'` bırakılıp sonra 'hata'ya çekiliyor. Böylece
// yeni kural eklemek CI'yı bir anda kırmıyor.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = path.join(KOK, 'src/locales');
const GUIDES = path.join(KOK, 'src/content/toolGuides');

const DILLER = fs
  .readdirSync(LOCALES)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''))
  .sort();
const KAYNAK = 'en';

const ham = Object.fromEntries(
  DILLER.map((d) => [d, fs.readFileSync(path.join(LOCALES, d + '.json'), 'utf8')])
);
const sozluk = Object.fromEntries(DILLER.map((d) => [d, JSON.parse(ham[d])]));

/** Çoğul eki atılmış taban anahtar: works_count_one -> works_count */
const taban = (k) => k.replace(/_(zero|one|two|few|many|other)$/, '');

/** Bir anahtarın herhangi bir çoğul biçimindeki değeri. */
function deger(dil, anahtar) {
  const o = sozluk[dil];
  if (anahtar in o) return o[anahtar];
  for (const ek of ['_other', '_one', '_many']) if (anahtar + ek in o) return o[anahtar + ek];
  return undefined;
}

const bulgular = [];
const bildir = (kural, seviye, dil, anahtar, mesaj) =>
  bulgular.push({ kural, seviye, dil, anahtar, mesaj });

// ---------------------------------------------------------------- kurallar

const KURALLAR = [
  {
    ad: 'anahtar-paritesi',
    seviye: 'hata',
    aciklama: '11 dilde aynı anahtar kümesi',
    calistir() {
      const referans = new Set(Object.keys(sozluk[KAYNAK]).map(taban));
      for (const d of DILLER) {
        const kume = new Set(Object.keys(sozluk[d]).map(taban));
        for (const k of referans) if (!kume.has(k)) bildir(this.ad, this.seviye, d, k, 'eksik');
        for (const k of kume) if (!referans.has(k)) bildir(this.ad, this.seviye, d, k, 'fazla');
      }
    }
  },
  {
    ad: 'placeholder-paritesi',
    seviye: 'hata',
    aciklama: '{{...}} kümesi kaynakla birebir aynı',
    calistir() {
      const al = (s) => [...String(s ?? '').matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort().join(',');
      for (const d of DILLER) {
        if (d === KAYNAK) continue;
        for (const [k, v] of Object.entries(sozluk[d])) {
          const kaynak = deger(KAYNAK, taban(k));
          if (kaynak === undefined) continue;
          // Arapça/Rusça'nın zero, one ve two biçimlerinde sayı yazıyla
          // veriliyor ("قياس واحد" = tek ölçüm), yani o biçimlerde
          // placeholder'ın bir kısmı ya da tamamı olmayabilir. Fazlası hata.
          if (/_(zero|one|two)$/.test(k)) {
            const kaynakKume = new Set(al(kaynak).split(',').filter(Boolean));
            const fazla = al(v).split(',').filter((x) => x && !kaynakKume.has(x));
            if (fazla.length) bildir(this.ad, this.seviye, d, k, `kaynakta olmayan: ${fazla}`);
            continue;
          }
          if (al(kaynak) !== al(v)) {
            bildir(this.ad, this.seviye, d, k, `kaynak [${al(kaynak)}] ≠ [${al(v)}]`);
          }
        }
      }
    }
  },
  {
    ad: 'html-paritesi',
    seviye: 'hata',
    aciklama: 'HTML etiketleri kaynakla aynı',
    calistir() {
      const al = (s) => [...String(s ?? '').matchAll(/<\/?(\w+)/g)].map((m) => m[1]).sort().join(',');
      for (const d of DILLER) {
        if (d === KAYNAK) continue;
        for (const [k, v] of Object.entries(sozluk[d])) {
          const kaynak = deger(KAYNAK, taban(k));
          if (kaynak === undefined) continue;
          if (al(kaynak) !== al(v)) bildir(this.ad, this.seviye, d, k, `etiketler [${al(kaynak)}] ≠ [${al(v)}]`);
        }
      }
    }
  },
  {
    ad: 'gorunmez-karakter',
    seviye: 'hata',
    aciklama: 'sifir genislikli bosluk ve yon isaretleri',
    calistir() {
      // Fransizcada % ve iki nokta oncesindeki kesintisiz bosluk (U+00A0)
      // tipografi kurali, kaza degil. Yalniz o kullanim serbest.
      const frSerbest = / (?=[%:;!?»])|« /g;
      const kotu = /[​-‍﻿ ‪-‮]/;
      for (const d of DILLER) {
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v !== 'string') continue;
          const bakilan = d === 'fr' ? v.replace(frSerbest, '') : v;
          if (kotu.test(bakilan)) {
            bildir(this.ad, this.seviye, d, k, 'metinde gorunmez karakter var');
          }
        }
      }
    }
  },
  {
    ad: 'lorem-ipsum',
    seviye: 'uyari', // /about metinleri hazır olunca 'hata'ya çekilecek
    aciklama: 'yer tutucu Latince metin',
    calistir() {
      for (const d of DILLER) {
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v === 'string' && /lorem ipsum|dolor sit amet/i.test(v)) {
            bildir(this.ad, this.seviye, d, k, 'Lorem ipsum yayında');
          }
        }
      }
    }
  },
  {
    ad: 'cevrilmemis',
    seviye: 'hata',
    aciklama: 'kaynakla birebir aynı kalmış metin',
    calistir() {
      // Marka, kısaltma ve teknik biçimler her dilde aynı kalıyor.
      const serbest = /^[\s\d\p{P}\p{S}]*$/u;
      const beyazListe = new Set([
        'app_name', 'email_placeholder', 'vsm_fpy', 'roadmap_percent', 'roadmap_progress_count',
        'undo', 'redo', 'fta_add_and', 'fta_add_or', 'fta_add_xor', 'histogram_lsl_short',
        'histogram_usl_short', 'tool_swot', 'tool_pdca', 'tool_wbs', 'tool_fta', 'tool_vsm',
        // Kelime o dilde de aynı: "Maintenance", "Score", "Social media", "Roadmap",
        // "System (MRP, ERP…)". Çeviri hatası değil.
        'mai', 'decision_score_label', 'contact_social_title', 'roadmap_map_name_n',
        'vsm_control_system',
        // Lorem ipsum'un kendi kuralı var, iki kere raporlanmasın.
        'landing_about_body', 'about_intro', 'about_story_body', 'about_team_body',
        'about_company_body'
      ]);
      for (const d of DILLER) {
        if (d === KAYNAK) continue;
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v !== 'string' || beyazListe.has(taban(k)) || serbest.test(v)) continue;
          if (v.length < 12) continue; // "Blog", "PDCA" gibi kısa adlar
          if (v === deger(KAYNAK, taban(k))) bildir(this.ad, this.seviye, d, k, 'ingilizce kalmış');
        }
      }
    }
  },
  {
    ad: 'bosluk',
    seviye: 'hata',
    aciklama: 'baş/son boşluk kaynakla aynı, çift boşluk yok',
    calistir() {
      for (const d of DILLER) {
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v !== 'string') continue;
          if (/ {2}/.test(v)) bildir(this.ad, this.seviye, d, k, 'çift boşluk');
          const kaynak = deger(KAYNAK, taban(k));
          if (typeof kaynak !== 'string') continue;
          // CJK'de kelime arası boşluk yok; İngilizcedeki sondaki boşluğun
          // ja/zh'de bulunmaması doğru. (Asıl çözüm <Trans>, bkz. C6f.)
          if (d === 'ja' || d === 'zh') continue;
          const kenar = (s) => [/^\s/.test(s), /\s$/.test(s)].join();
          if (kenar(kaynak) !== kenar(v)) bildir(this.ad, this.seviye, d, k, 'baş/son boşluk kaynaktan farklı');
        }
      }
    }
  },
  {
    ad: 'tirnak-bicimi',
    seviye: 'hata',
    aciklama: 'dil başına tek tırnak biçimi',
    calistir() {
      // Kesme işareti (l'analyse, don't) BURADA YOK: tırnak değil, harf.
      const izin = {
        en: /^["]*$/, tr: /^["]*$/,
        de: /^[„“]*$/, fr: /^[«»]*$/, es: /^[«»]*$/, it: /^[«»]*$/,
        pt: /^[“”]*$/, ru: /^[«»]*$/, ja: /^[「」]*$/, zh: /^[“”]*$/, ar: /^[«»]*$/
      };
      for (const d of DILLER) {
        const kural = izin[d];
        if (!kural) continue;
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v !== 'string' || v.includes('<')) continue;
          const tirnaklar = (v.match(/["„“”«»「」]/g) || []).join('');
          if (tirnaklar && !kural.test(tirnaklar)) {
            bildir(this.ad, this.seviye, d, k, `beklenmeyen tırnak: ${tirnaklar}`);
          }
        }
      }
    }
  },
  {
    ad: 'hitap-bicimi',
    seviye: 'hata',
    aciklama: 'her dilde samimi tekil hitap (bkz. 0.8.31-9)',
    calistir() {
      const yasak = {
        de: /(^|[^\wäöüß])(Sie|Ihre?[nmrs]?|Ihnen)([^\wäöüß]|$)/,
        fr: /(^|[^\wàâçéèêëîïôûùüÿœ'’-])(vous|Vous|votre|Votre|vos|Vos)([^\wàâçéèêëîïôûùüÿœ'’-]|$)/,
        ru: /(^|[^А-Яа-яЁё])(вы|вас|вам|ваш|ваша|ваше|ваши|вашу|вашего|вашему|вашей|вашем|вашим|вами)([^А-Яа-яЁё]|$)/i,
        zh: /您/,
        es: /(^|[^A-Za-zÀ-ÿ])(usted|Usted|ustedes|vosotros|[A-Za-zÀ-ÿ]+(áis|éis))([^A-Za-zÀ-ÿ]|$)/
      };
      // Almancada "Sie" cümle başında "o/onlar" da olabiliyor; bilinen
      // istisnalar burada.
      const istisna = new Set(['leave_shared_msg']);
      for (const [d, re] of Object.entries(yasak)) {
        if (!sozluk[d]) continue;
        for (const [k, v] of Object.entries(sozluk[d])) {
          if (typeof v !== 'string' || istisna.has(taban(k))) continue;
          if (re.test(v)) bildir(this.ad, this.seviye, d, k, 'resmî/çoğul hitap');
        }
      }
    }
  },
  {
    ad: 'pt-lehcesi',
    seviye: 'hata',
    aciklama: 'Portekizce tek lehçe (pt-BR)',
    calistir() {
      const re = /\b(secç[ãa]o|secções|ecrã|equipa|equipas|percentagem|eliminar|Eliminar|acrescentar|Acrescentar|planear|Planear|planeamento|utilizador|ficheiro)\b/;
      for (const [k, v] of Object.entries(sozluk.pt || {})) {
        if (typeof v === 'string' && re.test(v)) bildir(this.ad, this.seviye, 'pt', k, 'Avrupa Portekizcesi');
      }
    }
  },
  {
    ad: 'cogul-kurallari',
    seviye: 'hata',
    aciklama: 'sayı içeren metinlerde Rusça/Arapça çoğul biçimleri',
    calistir() {
      const gerekli = { ru: ['one', 'few', 'many', 'other'], ar: ['zero', 'one', 'two', 'few', 'many', 'other'] };
      // Sabit sayı taşıyan metinler (17 araç, 11 dil) çoğullanmıyor.
      const sabit = new Set(['price_item_1', 'landing_multilang_note', 'landing_step1_desc', 'roadmap_remaining_hours', 'roadmap_progress_count', 'roadmap_percent']);
      for (const [d, bicimler] of Object.entries(gerekli)) {
        if (!sozluk[d]) continue;
        const tabanlar = new Set(Object.keys(sozluk[d]).map(taban));
        for (const t of tabanlar) {
          if (sabit.has(t)) continue;
          const v = deger(KAYNAK, t);
          if (typeof v !== 'string' || !/{{\s*(sayi|adet|toplam)\s*}}/.test(v)) continue;
          for (const b of bicimler) {
            if (!(t + '_' + b in sozluk[d])) bildir(this.ad, this.seviye, d, t, `${b} biçimi yok`);
          }
        }
      }
    }
  },
  {
    ad: 'kilavuz-baslik',
    seviye: 'hata',
    aciklama: 'kılavuz başlığı = araç adı',
    calistir() {
      const esles = {
        mindmap: 'tool_mindmap', wbs: 'tool_wbs', '5whys': 'tool_5whys', flowchart: 'tool_flowchart',
        orgchart: 'tool_org', swot: 'tool_swot', ishikawa: 'tool_ishikawa', pdca: 'tool_pdca',
        waterfall: 'tool_waterfall', fta: 'tool_fta', vsm: 'tool_vsm', pareto: 'tool_pareto',
        histogram: 'tool_histogram', decision: 'tool_decision', notepad: 'tool_notepad',
        gantt: 'tool_gantt', roadmap: 'tool_roadmap'
      };
      for (const d of DILLER) {
        const yol = path.join(GUIDES, d + '.ts');
        if (!fs.existsSync(yol)) continue;
        const kaynak = fs.readFileSync(yol, 'utf8');
        const re = /\n {2}['"]?([a-z0-9]+)['"]?:\s*\{\s*\n\s*title:\s*(['"])((?:\\.|(?!\2).)*)\2/g;
        let m;
        while ((m = re.exec(kaynak))) {
          const anahtar = esles[m[1]];
          if (!anahtar || !sozluk[d][anahtar]) continue;
          const baslik = m[3].replace(/\\'/g, "'").replace(/\\"/g, '"');
          if (baslik !== sozluk[d][anahtar]) {
            bildir(this.ad, this.seviye, d, m[1], `kılavuz "${baslik}" ≠ araç "${sozluk[d][anahtar]}"`);
          }
        }
      }
    }
  },
  {
    ad: 'gecerli-json',
    seviye: 'hata',
    aciklama: 'dosya biçimi: 2 boşluk girinti, satır başına bir anahtar',
    calistir() {
      for (const d of DILLER) {
        const satirlar = ham[d].split(/\r?\n/);
        for (let i = 0; i < satirlar.length; i++) {
          const l = satirlar[i];
          if (!l.trim() || l.trim() === '{' || l.trim() === '}') continue;
          if (!/^ {2}"[^"]+": .*,?$/.test(l)) {
            bildir(this.ad, this.seviye, d, 'satır ' + (i + 1), 'beklenen biçimde değil');
          }
        }
      }
    }
  }
];

// ------------------------------------------------------------------ çalıştır

for (const kural of KURALLAR) kural.calistir();

const hatalar = bulgular.filter((b) => b.seviye === 'hata');
const uyarilar = bulgular.filter((b) => b.seviye === 'uyari');

const grupla = (liste) => {
  const harita = new Map();
  for (const b of liste) {
    if (!harita.has(b.kural)) harita.set(b.kural, []);
    harita.get(b.kural).push(b);
  }
  return harita;
};

for (const [seviye, liste] of [['UYARI', uyarilar], ['HATA', hatalar]]) {
  for (const [kural, bulgu] of grupla(liste)) {
    console.log(`\n${seviye} · ${kural} (${bulgu.length})`);
    for (const b of bulgu.slice(0, 25)) console.log(`   ${b.dil}  ${b.anahtar}  — ${b.mesaj}`);
    if (bulgu.length > 25) console.log(`   … ve ${bulgu.length - 25} tane daha`);
  }
}

const ozet = `i18n-lint: ${DILLER.length} dil, ${Object.keys(sozluk[KAYNAK]).length} anahtar · ${hatalar.length} hata, ${uyarilar.length} uyarı`;
console.log('\n' + ozet);
if (hatalar.length) process.exit(1);

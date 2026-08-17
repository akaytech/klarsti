// eskiKayitSay.mjs içindeki ölçütlerin denemesi.
//
// NEDEN VAR: o betiğin çıktısına bakarak "parseDoc'taki dönüştürücüler
// silinebilir" kararı verilecek. Ölçüt yanlışsa betik "sıfır" der, biz de
// gerçekte okunan veriyi okunamaz hale getiririz. En pahalı yanlış bu.
//
// İki yönlü sınanıyor:
//   - eski biçimdeki belge YAKALANMALI,
//   - yeni biçimdeki ve HİÇ KULLANILMAMIŞ belge yakalanmamalı.
//
// İkincisi daha kritik: aracı hiç açmamış bir projede alan zaten yok ve
// ölçüt dikkatsiz yazılırsa her projeyi "eski" sanar.
//
// Çalıştırmak için: node scripts/eskiKayitSayDeneme.mjs

import { OLCUTLER, toolDataKur } from './eskiKayitSay.mjs';

const bak = (i, belge) => !!OLCUTLER[i].bak(toolDataKur(belge), belge);

/** Her ölçüt için: yakalaması gereken belge, yakalamaması gereken belge. */
const DENEMELER = [
  {
    olcut: 'Kirilim agaci: tek agacli eski kayit',
    eski: { nodes: [{ id: 'k', data: { label: 'Proje' } }], edges: [] },
    yeni: { toolData: { wbsTrees: [{ id: 'a', name: 'Agac', nodes: [{ id: 'k' }], edges: [] }] } }
  },
  {
    olcut: 'Kirilim agaci: kutuda isManuallyPositioned',
    eski: { nodes: [{ id: 'k', data: { label: 'x', isManuallyPositioned: true } }] },
    yeni: { toolData: { wbsTrees: [{ id: 'a', nodes: [{ id: 'k', data: { label: 'x' } }] }] } }
  },
  {
    olcut: 'Akis semasi: tek semali eski kayit',
    eski: { flowchartNodes: [{ id: 'k' }], flowchartType: 'workflow' },
    yeni: { toolData: { flowcharts: [{ id: 's', type: 'workflow', nodes: [{ id: 'k' }] }] } }
  },
  {
    olcut: 'Organizasyon semasi: akis semasi icinde (type: org)',
    eski: { toolData: { flowcharts: [{ id: 's', type: 'org', nodes: [] }] } },
    yeni: { toolData: { orgcharts: [{ id: 'o', type: 'hierarchical', nodes: [] }], flowcharts: [] } }
  },
  {
    olcut: 'Zihin haritasi: tek haritali eski kayit',
    eski: { mindmapNodes: [{ id: 'k' }], mindmapEdges: [] },
    yeni: { toolData: { mindmaps: [{ id: 'h', nodes: [{ id: 'k' }], edges: [] }] } }
  },
  {
    olcut: 'Deger akisi: tek haritali eski kayit',
    eski: { vsmNodes: [{ id: 'k', type: 'vsmProcess', data: {} }], vsmEdges: [] },
    yeni: { toolData: { vsmMaps: [{ id: 'h', nodes: [{ id: 'k', data: {} }], edges: [] }] } }
  },
  {
    olcut: 'Deger akisi: ciplak sure',
    eski: {
      toolData: {
        vsmMaps: [{ id: 'h', nodes: [{ id: 'k', type: 'vsmProcess', data: { cycleTime: 30, timeUnit: 'sec' } }] }]
      }
    },
    yeni: {
      toolData: {
        vsmMaps: [{ id: 'h', nodes: [{ id: 'k', data: { cycleTime: { deger: 30, birim: 'sec' } } }] }]
      }
    }
  },
  {
    olcut: '5 Neden: tek analizli eski kayit',
    eski: { fiveWhysNodes: [{ id: 'k' }], fiveWhysEdges: [] },
    yeni: { toolData: { fiveWhysAnalyses: [{ id: 'a', nodes: [{ id: 'k' }], edges: [] }] } }
  },
  {
    olcut: 'Hata agaci: tek analizli eski kayit',
    eski: { ftaNodes: [{ id: 'k' }], ftaEdges: [] },
    yeni: { toolData: { ftaAnalyses: [{ id: 'a', nodes: [{ id: 'k' }], edges: [] }] } }
  },
  {
    olcut: 'SWOT: duz kalem listesi',
    eski: { toolData: { swot: [{ id: 'i', type: 'S', text: 'Guclu yan' }] } },
    yeni: { toolData: { swot: [{ id: 'a', title: 'Analiz', items: [{ id: 'i', type: 'S', text: 'x' }] }] } }
  },
  {
    olcut: 'Histogram: kategori/siklik kalemleri',
    eski: { toolData: { histogram: [{ id: 'h', title: 'x', items: [{ category: '12', frequency: 3 }] }] } },
    yeni: { toolData: { histogram: [{ id: 'h', title: 'x', olcumler: [12, 12, 12], ayarlar: {} }] } }
  },
  {
    olcut: 'Selale: eski asama adi (Design)',
    eski: { toolData: { waterfall: [{ id: 'p', currentPhaseIndex: 0, items: [{ id: 'i', phase: 'Design' }] }] } },
    yeni: { toolData: { waterfall: [{ id: 'p', currentPhaseIndex: 0, items: [{ id: 'i', phase: 'High-Level Design' }] }] } }
  },
  {
    olcut: 'Selale: currentPhaseIndex eksik',
    eski: { toolData: { waterfall: [{ id: 'p', name: 'Proje', items: [] }] } },
    yeni: { toolData: { waterfall: [{ id: 'p', name: 'Proje', currentPhaseIndex: 0, items: [] }] } }
  },
  {
    olcut: 'Ajanda: proje icinde kalmis eski kayit',
    eski: { notepad: [{ id: 'n', title: 'Not' }] },
    yeni: { toolData: {} }
  }
];

/** Aracı hiç açmamış, bomboş bir klasör. Hiçbir ölçüte takılmamalı. */
const BOS_KLASOR = { id: 'p1', name: 'Yeni Klasor', userId: 'u1', updatedAt: 1, toolData: {} };

/** Bugünün uygulamasının yazdığı, her aracı dolu bir klasör. */
const GUNCEL_KLASOR = {
  id: 'p2',
  name: 'Guncel',
  userId: 'u1',
  updatedAt: 1,
  toolData: {
    wbsTrees: [{ id: 'a', name: 'Agac', nodes: [{ id: 'k', data: { label: 'x' } }], edges: [] }],
    fiveWhysAnalyses: [{ id: 'a', nodes: [{ id: 'k' }], edges: [] }],
    ftaAnalyses: [{ id: 'a', nodes: [{ id: 'k' }], edges: [] }],
    mindmaps: [{ id: 'h', nodes: [{ id: 'k' }], edges: [] }],
    flowcharts: [{ id: 's', type: 'workflow', nodes: [], edges: [] }],
    orgcharts: [{ id: 'o', type: 'hierarchical', nodes: [], edges: [] }],
    vsmMaps: [{ id: 'h', nodes: [{ id: 'k', data: { cycleTime: { deger: 1, birim: 'sec' } } }], edges: [] }],
    swot: [{ id: 'a', title: 'Analiz', items: [], createdAt: 1 }],
    ishikawa: [{ id: 'a', problemStatement: 'x', items: [], createdAt: 1 }],
    pdca: [{ id: 'c', goal: 'x', items: [], createdAt: 1 }],
    waterfall: [{ id: 'p', name: 'x', currentPhaseIndex: 0, items: [], createdAt: 1 }],
    pareto: [{ id: 'p', title: 'x', items: [] }],
    histogram: [{ id: 'h', title: 'x', olcumler: [1, 2], ayarlar: {}, createdAt: 1 }],
    decision: [{ id: 'd', name: 'x', criteria: [], options: [], createdAt: 1 }],
    ganttPlans: [{ id: 'g', name: 'x', gorevler: [] }]
  }
};

/* ------------------------------------------------------------------ kosum */

let gecen = 0;
let kalan = 0;
const hatalar = [];

const sina = (baslik, kosul) => {
  if (kosul) { gecen += 1; return; }
  kalan += 1;
  hatalar.push(baslik);
};

if (DENEMELER.length !== OLCUTLER.length) {
  console.error(
    `\nHATA: ${OLCUTLER.length} olcut var ama ${DENEMELER.length} deneme yazilmis.\n` +
    'Yeni bir olcut eklendiyse denemesi de eklenmeli, yoksa sinanmadan yayina cikar.\n'
  );
  process.exit(1);
}

DENEMELER.forEach((deneme, i) => {
  // Ölçüt ile denemenin aynı sırada olduğundan emin ol; sıra kayarsa
  // denemeler yeşil yanar ama başka bir şeyi sınıyor olur.
  sina(
    `[${i}] siralama: "${deneme.olcut}" != "${OLCUTLER[i].ad}"`,
    OLCUTLER[i].ad.startsWith(deneme.olcut.split(':')[0])
  );
  sina(`[${i}] ${deneme.olcut}: ESKI belge yakalanmali`, bak(i, deneme.eski));
  sina(`[${i}] ${deneme.olcut}: YENI belge yakalanmamali`, !bak(i, deneme.yeni));
});

OLCUTLER.forEach((olcut, i) => {
  sina(`[${i}] ${olcut.ad}: BOS klasor yakalanmamali`, !bak(i, BOS_KLASOR));
  sina(`[${i}] ${olcut.ad}: GUNCEL klasor yakalanmamali`, !bak(i, GUNCEL_KLASOR));
});

console.log(`\nOlcut sayisi : ${OLCUTLER.length}`);
console.log(`Gecen        : ${gecen}`);
console.log(`Kalan        : ${kalan}`);

if (kalan > 0) {
  console.error('\nBASARISIZ:');
  hatalar.forEach((h) => console.error(`  - ${h}`));
  console.error('\nOlcutler duzeltilmeden sayim sonucuna guvenilmemeli.\n');
  process.exit(1);
}

console.log('\nButun olcutler dogru calisiyor. Sayim sonucuna guvenilebilir.\n');

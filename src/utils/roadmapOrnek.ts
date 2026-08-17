import { v4 as uuidv4 } from 'uuid';
import type { Edge } from '@xyflow/react';
import i18n from '../i18n';
import type { RoadmapDurum, RoadmapKutuTuru, RoadmapNode } from '../store/slices/createRoadmapSlice';

/**
 * Boş tuvalde açılan hazır örnek: yeni bir çalışanın ilk üç ayı.
 *
 * Neden bu konu: yol haritası deyince akla önce yazılım öğrenme yolları
 * geliyor ama araç ona bağlı değil. Bir işe alım planı, seviye başlıklarını,
 * zorunlu/seçmeli ayrımını ve süre tahminini tek örnekte gösteriyor ve
 * kimsenin alanına yabancı gelmiyor.
 *
 * Örnek dile bağlı olduğu için depoda değil burada: depo dilden habersiz
 * olmalı, yoksa kullanıcı dil değiştirdiğinde hangi metnin çeviri hangisinin
 * kullanıcı yazısı olduğu ayırt edilemezdi.
 */

interface Tanim {
  anahtar: string;
  tur: RoadmapKutuTuru;
  durum?: RoadmapDurum;
  sure?: number;
  secmeli?: boolean;
  not?: string;
  /** Yan konular; bir seviye derinlik yetiyor. */
  konular?: Tanim[];
}

const HAT: Tanim[] = [
  { anahtar: 'roadmap_ex_month1', tur: 'bolum' },
  {
    anahtar: 'roadmap_ex_meet', tur: 'adim', durum: 'bitti', sure: 8,
    konular: [
      { anahtar: 'roadmap_ex_meet_1on1', tur: 'konu', durum: 'bitti', sure: 4 },
      { anahtar: 'roadmap_ex_meet_product', tur: 'konu', durum: 'bitti', sure: 3 },
      { anahtar: 'roadmap_ex_meet_history', tur: 'konu', secmeli: true, sure: 2 }
    ]
  },
  {
    anahtar: 'roadmap_ex_setup', tur: 'adim', durum: 'bitti', sure: 4,
    konular: [
      { anahtar: 'roadmap_ex_setup_access', tur: 'konu', durum: 'bitti', sure: 2 },
      { anahtar: 'roadmap_ex_setup_rhythm', tur: 'konu', durum: 'bitti', sure: 2 }
    ]
  },
  { anahtar: 'roadmap_ex_month2', tur: 'bolum' },
  {
    anahtar: 'roadmap_ex_first_task', tur: 'adim', durum: 'ogreniyor', sure: 20,
    not: 'roadmap_ex_first_task_note',
    konular: [
      { anahtar: 'roadmap_ex_first_task_end', tur: 'konu', durum: 'ogreniyor', sure: 12 },
      { anahtar: 'roadmap_ex_first_task_feedback', tur: 'konu', sure: 4 }
    ]
  },
  {
    anahtar: 'roadmap_ex_process', tur: 'adim', sure: 10,
    konular: [
      { anahtar: 'roadmap_ex_process_meetings', tur: 'konu', sure: 3 },
      { anahtar: 'roadmap_ex_process_quality', tur: 'konu', secmeli: true, sure: 4 }
    ]
  },
  { anahtar: 'roadmap_ex_month3', tur: 'bolum' },
  {
    anahtar: 'roadmap_ex_solo', tur: 'adim', sure: 30,
    konular: [
      { anahtar: 'roadmap_ex_solo_plan', tur: 'konu', sure: 6 },
      { anahtar: 'roadmap_ex_solo_improve', tur: 'konu', sure: 8 }
    ]
  }
];

const kutu = (tanim: Tanim): RoadmapNode => ({
  id: uuidv4(),
  type: 'roadmapNode',
  position: { x: 0, y: 0 },
  data: {
    label: i18n.t(tanim.anahtar),
    tur: tanim.tur,
    ...(tanim.durum ? { durum: tanim.durum } : {}),
    ...(tanim.sure ? { sure: tanim.sure } : {}),
    ...(tanim.secmeli ? { secmeli: true } : {}),
    ...(tanim.not ? { description: i18n.t(tanim.not) } : {})
  }
});

export function roadmapOrnegi(): { nodes: RoadmapNode[]; edges: Edge[]; ad: string } {
  const nodes: RoadmapNode[] = [];
  const edges: Edge[] = [];
  let onceki: string | null = null;

  HAT.forEach((tanim) => {
    const durak = kutu(tanim);
    nodes.push(durak);
    if (onceki) edges.push({ id: uuidv4(), source: onceki, target: durak.id });
    onceki = durak.id;

    (tanim.konular || []).forEach((konuTanimi) => {
      const konu = kutu(konuTanimi);
      nodes.push(konu);
      edges.push({ id: uuidv4(), source: durak.id, target: konu.id });
    });
  });

  return { nodes, edges, ad: i18n.t('roadmap_ex_name') };
}

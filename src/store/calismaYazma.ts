import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stripUndefined } from '../utils/firestoreSafe';
import { hamCalismalar, calismaAdi, aracAnahtari, TUM_ARACLAR } from '../config/toolWorks';
import type { ToolId, Project } from './useRoadmapStore';

/**
 * Çalışmaların 'works' koleksiyonuna yazılması.
 *
 * Geçiş dönemindeyiz: veri hem eski yerine (projenin toolData'sı) hem de buraya
 * yazılıyor. Okuma hâlâ eski yerden yapılıyor, yani bu dosyanın bir hatası
 * kullanıcıya yansımaz ve eski kopya güncel kalır. Okuma yeni kayıtlara
 * çevrildiğinde geri dönülecek sağlam bir nokta olsun diye böyle.
 */

/**
 * Doküman kimliği proje kimliğiyle önekleniyor. Çalışma kimlikleri normalde
 * benzersiz (uuid) ama eski verinin taşınmasında sabit kimlikler üretilmişti
 * ('migrated-wbs', 'migrated-5whys', 'migrated-fta'). Öneksiz yazsaydık iki
 * ayrı projedeki iki ayrı ağaç aynı dokümanı paylaşır, biri diğerini ezerdi.
 */
export const calismaDokumanId = (projectId: string, workId: string) => `${projectId}__${workId}`;

/** Bir çalışmanın içeriği: her yazmada gönderilen alanlar. */
const icerikGovdesi = (project: Project, tool: ToolId, calisma: Record<string, any>) => ({
  projectName: project.name,
  tool,
  name: calismaAdi(calisma, tool),
  data: calisma,
  updatedAt: Date.now()
});

/**
 * İlk yazmada gönderilen ek alanlar. Kurallar yeni bir çalışmanın erişim
 * listesinin klasörünkiyle AYNI olmasını şart koşuyor; bu hem başkasının
 * ağacına çalışma sokulmasını engelliyor hem de klasör paylaşımının sonradan
 * eklenen çalışmaları kapsamasını sağlıyor.
 *
 * Sonraki yazmalarda gönderilmiyor: gönderseydik, o çalışmaya tek tek davet
 * edilmiş kişiler her kayıtta listeden silinirdi.
 */
const kurulusGovdesi = (project: Project, workId: string) => ({
  ownerId: project.userId,
  projectId: project.id,
  workId,
  readers: project.sharedWith ?? [],
  sharedWith: [],
  members: {}
});

/**
 * Bir projenin çalışmalarını yazar.
 *
 * @param mevcutIdler Sunucuda halihazırda duran çalışma dokümanlarının
 *   kimlikleri. Bilmek şart: ilk yazma ile sonraki yazmanın gövdesi farklı.
 * @param sadeceAraclar Verilirse yalnızca bu araçların çalışmaları yazılır.
 * @param yalnizEksikler Yalnızca sunucuda henüz olmayanları yazar. İlk
 *   doldurmada kullanılıyor: var olanları tekrar yazmak boşuna yazma olurdu.
 */
export function projeninCalismalariniYaz(
  project: Project,
  mevcutIdler: ReadonlySet<string>,
  sadeceAraclar?: ReadonlySet<ToolId>,
  yalnizEksikler = false
): Promise<unknown>[] {
  // Sahibi olmadığımız bir projenin çalışmalarını kurmaya çalışmak kurallara
  // takılır; ortak çalışan yalnızca var olan çalışmaların içeriğini yazabilir.
  const yazmalar: Promise<unknown>[] = [];

  TUM_ARACLAR.forEach((tool) => {
    if (sadeceAraclar && !sadeceAraclar.has(tool)) return;

    hamCalismalar(project.toolData, tool).forEach((calisma) => {
      const dokumanId = calismaDokumanId(project.id, calisma.id);
      const yeni = !mevcutIdler.has(dokumanId);
      if (yalnizEksikler && !yeni) return;
      const govde = yeni
        ? { ...kurulusGovdesi(project, calisma.id), ...icerikGovdesi(project, tool, calisma) }
        : icerikGovdesi(project, tool, calisma);

      yazmalar.push(setDoc(doc(db, 'works', dokumanId), stripUndefined(govde), { merge: true }));
    });
  });

  return yazmalar;
}

/**
 * SyncManager hangi araçların değiştiğini toolData anahtarıyla biliyor
 * ('wbsTrees'), buradaki işlerse araç kimliğiyle yürüyor ('wbs'). Çeviri.
 */
export function anahtarlardanAraclar(anahtarlar: ReadonlySet<string>): Set<ToolId> {
  const sonuc = new Set<ToolId>();
  TUM_ARACLAR.forEach((tool) => {
    const anahtar = aracAnahtari(tool);
    if (anahtar && anahtarlar.has(anahtar)) sonuc.add(tool);
  });
  return sonuc;
}

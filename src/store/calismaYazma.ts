import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stripUndefined } from '../utils/firestoreSafe';
import { hamCalismalar, calismaAdi, calismaDokunulmamis, aracAnahtari, TUM_ARACLAR } from '../config/toolWorks';
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
 * Bir projenin çalışmalarını yeni kayıtlarla eşitler: eksikleri kurar,
 * değişenleri günceller, karşılığı kalmayanları siler.
 *
 * Silme de bu işin parçası: kullanıcı bir çalışmayı sildiğinde eski yerden
 * düşüyor ama yeni kaydı öylece kalırdı. Okuma yeni kayıtlara çevrildiğinde
 * silinen çalışma geri gelmiş gibi görünürdü.
 *
 * @param mevcutKayitlar Bu projenin sunucuda duran çalışma kayıtları. İki
 *   şey için gerekli: ilk yazmanın gövdesi sonrakilerden farklı, ve fazlalık
 *   kayıtları ancak elimizdeki listeyle karşılaştırarak bulabiliyoruz.
 * @param sadeceAraclar Verilirse yalnızca bu araçlara dokunulur; ötekilerin
 *   kayıtları ne yazılır ne silinir.
 * @param yalnizEksikler Var olanları tekrar yazmaz. İlk doldurmada kullanılıyor.
 */
export function projeCalismalariniEsitle(
  project: Project,
  mevcutKayitlar: readonly { id: string; tool: ToolId }[],
  sadeceAraclar?: ReadonlySet<ToolId>,
  yalnizEksikler = false
): Promise<unknown>[] {
  const islemler: Promise<unknown>[] = [];
  const mevcutIdler = new Set(mevcutKayitlar.map((k) => k.id));
  const olmasiGerekenler = new Set<string>();

  TUM_ARACLAR.forEach((tool) => {
    if (sadeceAraclar && !sadeceAraclar.has(tool)) return;

    hamCalismalar(project.toolData, tool).forEach((calisma) => {
      // Hiç başlanmamış çalışma kendi kaydını hak etmiyor (bkz. calismaDokunulmamis).
      if (calismaDokunulmamis(calisma, tool)) return;

      const dokumanId = calismaDokumanId(project.id, calisma.id);
      olmasiGerekenler.add(dokumanId);

      const yeni = !mevcutIdler.has(dokumanId);
      if (yalnizEksikler && !yeni) return;
      const govde = yeni
        ? { ...kurulusGovdesi(project, calisma.id), ...icerikGovdesi(project, tool, calisma) }
        : icerikGovdesi(project, tool, calisma);

      islemler.push(setDoc(doc(db, 'works', dokumanId), stripUndefined(govde), { merge: true }));
    });
  });

  // Fazlalıklar: silinmiş çalışmalar ve artık boş sayılan başlangıç kayıtları.
  mevcutKayitlar.forEach((kayit) => {
    if (sadeceAraclar && !sadeceAraclar.has(kayit.tool)) return;
    if (olmasiGerekenler.has(kayit.id)) return;
    islemler.push(deleteDoc(doc(db, 'works', kayit.id)));
  });

  return islemler;
}

/**
 * Bir projenin bütün çalışma kayıtlarını siler.
 *
 * Proje silinince çağrılmalı. Eskiden çağrılmıyordu: proje kaydı gidiyor ama
 * çalışmaları öylece kalıyordu. Okuma yeni kayıtlara çevrildiğinde silinmiş
 * bir proje geri gelmiş gibi görünürdü.
 */
export function projeninCalismalariniSil(kayitlar: readonly { id: string }[]): Promise<unknown>[] {
  return kayitlar.map((k) => deleteDoc(doc(db, 'works', k.id)));
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

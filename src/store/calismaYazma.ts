import { doc, setDoc, deleteDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { stripUndefined } from '../utils/firestoreSafe';
import { hamCalismalar, calismaAdi, calismaKayitHakEdiyor, aracAnahtari, TUM_ARACLAR } from '../config/toolWorks';
import type { ToolId, Project } from './useRoadmapStore';

/**
 * Çalışmaların 'works' koleksiyonuna yazılması.
 *
 * İçeriğin doğrusu artık burası (bkz. calismaOkuma.ts). Veri bir süre daha
 * eski yerine de (projenin toolData'sı) yazılmaya devam ediyor: yeni yolda bir
 * terslik çıkarsa geri dönülecek bir nokta olsun diye.
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
 */
const kurulusGovdesi = (project: Project, workId: string) => ({
  ownerId: project.userId,
  projectId: project.id,
  workId,
  readers: project.sharedWith ?? [],
  sharedWith: [],
  members: {}
});

/** Sunucuda duran bir çalışma kaydının, yazma tarafını ilgilendiren alanları. */
export interface MevcutKayit {
  id: string;
  tool: ToolId;
  /** Yalnızca bu çalışmaya tek tek davet edilenler. */
  sharedWith?: string[];
  /** Bu çalışmayı görebilenlerin tamamı. */
  readers?: string[];
}

/**
 * Bir çalışmayı görebilecek herkes: klasöre davet edilenler + yalnızca bu
 * çalışmaya davet edilenler.
 *
 * Her yazmada yeniden hesaplanıyor, çünkü klasöre biri katıldığında ya da
 * çıkarıldığında çalışmaların da onu takip etmesi gerekiyor; kayıt kurulurken
 * kopyalanan liste tek başına eskirdi. Sabit bir dizi göndermek yerine birleşim
 * alınması şart: tek tek davet edilenler yoksa her yazmada listeden silinirdi.
 *
 * Yalnızca klasörün sahibi gönderiyor. Kurallar ortak çalışanın bu alana
 * dokunmasını reddediyor; gönderirse bütün yazma reddedilir.
 */
const okuyucular = (project: Project, kayit: MevcutKayit) =>
  Array.from(new Set([...(kayit.sharedWith ?? []), ...(project.sharedWith ?? [])]));

/** İki erişim listesi aynı kişileri mi tutuyor? (Sıra önemsiz.) */
const ayniKisiler = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((uid) => b.includes(uid));

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
 * @param yalnizEksikler İçeriği tekrar yazmaz; eksik kayıtları kurar ve erişim
 *   listelerini tazeler. İlk doldurmada kullanılıyor.
 * @param sahipMi Klasörün sahibi miyiz? Erişim listesini ve silmeyi yalnızca
 *   sahip yapabiliyor (kurallar ortak çalışanın ikisini de reddediyor).
 */
export function projeCalismalariniEsitle(
  project: Project,
  mevcutKayitlar: readonly MevcutKayit[],
  sadeceAraclar?: ReadonlySet<ToolId>,
  yalnizEksikler = false,
  sahipMi = true
): Promise<unknown>[] {
  const islemler: Promise<unknown>[] = [];
  const kayitId = new Map(mevcutKayitlar.map((k) => [k.id, k]));
  const olmasiGerekenler = new Set<string>();

  TUM_ARACLAR.forEach((tool) => {
    if (sadeceAraclar && !sadeceAraclar.has(tool)) return;

    const aractakiler = hamCalismalar(project.toolData, tool);
    aractakiler.forEach((calisma) => {
      // Hiç başlanmamış başlangıç çalışması kendi kaydını hak etmiyor —
      // yalnızca araçtaki tek çalışma oysa (bkz. calismaKayitHakEdiyor).
      // Sıra listesi de aynı ölçütü kullanıyor; ayrışırlarsa listede olup
      // kaydı olmayan çalışmalar çıkardı.
      if (!calismaKayitHakEdiyor(calisma, tool, aractakiler.length)) return;

      const dokumanId = calismaDokumanId(project.id, calisma.id);
      olmasiGerekenler.add(dokumanId);

      const kayit = kayitId.get(dokumanId);
      if (!kayit) {
        islemler.push(setDoc(
          doc(db, 'works', dokumanId),
          stripUndefined({ ...kurulusGovdesi(project, calisma.id), ...icerikGovdesi(project, tool, calisma) }),
          { merge: true }
        ));
        return;
      }

      // Klasöre biri katıldıysa ya da çıkarıldıysa erişim listesi de tazelenir.
      const guncelOkuyucular = sahipMi ? okuyucular(project, kayit) : null;
      const erisimDegisti = guncelOkuyucular !== null && !ayniKisiler(kayit.readers ?? [], guncelOkuyucular);

      if (yalnizEksikler) {
        // İlk doldurmada içerik tekrar yazılmaz; tazelenecek erişim listesi
        // yoksa bu kayda hiç dokunulmaz.
        if (!erisimDegisti) return;
        islemler.push(setDoc(doc(db, 'works', dokumanId), { readers: guncelOkuyucular }, { merge: true }));
        return;
      }

      const govde: Record<string, any> = icerikGovdesi(project, tool, calisma);
      if (erisimDegisti) govde.readers = guncelOkuyucular;
      islemler.push(setDoc(doc(db, 'works', dokumanId), stripUndefined(govde), { merge: true }));
    });
  });

  // Fazlalıklar: silinmiş çalışmalar ve artık boş sayılan başlangıç kayıtları.
  // Silme yalnızca sahibin yapabildiği bir iş; ortak çalışan denerse reddedilir.
  if (sahipMi) {
    mevcutKayitlar.forEach((kayit) => {
      if (sadeceAraclar && !sadeceAraclar.has(kayit.tool)) return;
      if (olmasiGerekenler.has(kayit.id)) return;
      islemler.push(deleteDoc(doc(db, 'works', kayit.id)));
    });
  }

  return islemler;
}

/**
 * Klasöre davet edildiğimiz halde erişim listesinde bizi taşımayan
 * çalışmalara kendimizi ekler.
 *
 * Erişim listesi kayıt kurulurken klasörden kopyalanıyor ve tek başına
 * eskiyor; tazelemeyi klasörün sahibi yapıyor. Sahip çevrimdışıyken klasöre
 * katılan biri, o gelene kadar hiçbir çalışmayı ne okuyabiliyor ne de
 * yazabiliyordu: düzenlemesi yalnızca eski yere gidiyor, sahip döndüğünde
 * kayıttaki eski içerik kazanıyor ve düzenleme sessizce kayboluyordu.
 *
 * Hangi çalışmaların olduğunu klasörün kaydından biliyoruz (bu kişi onu
 * okuyabiliyor), o yüzden sorgu gerekmiyor: doküman kimlikleri hesaplanıp
 * doğrudan yazılıyor.
 *
 * @param elimizdekiler Erişimimizin zaten olduğu kayıtların doküman kimlikleri.
 * @param denenenler Bu oturumda denenmiş kimlikler; aynı kayda tur tur
 *   yazmaya çalışmamak için. Çağıran taraf tutuyor.
 */
export function calismalaraKendiniEkle(
  project: Project,
  elimizdekiler: ReadonlySet<string>,
  uid: string,
  denenenler: Set<string>
): Promise<unknown>[] {
  const islemler: Promise<unknown>[] = [];

  TUM_ARACLAR.forEach((tool) => {
    const aractakiler = hamCalismalar(project.toolData, tool);
    aractakiler.forEach((calisma) => {
      // Kaydı olmayan (ve olmayacak) çalışmaya erişim istenmez.
      if (!calismaKayitHakEdiyor(calisma, tool, aractakiler.length)) return;

      const dokumanId = calismaDokumanId(project.id, calisma.id);
      if (elimizdekiler.has(dokumanId)) return;
      if (denenenler.has(dokumanId)) return;
      denenenler.add(dokumanId);

      islemler.push(setDoc(doc(db, 'works', dokumanId), { readers: arrayUnion(uid) }, { merge: true }));
    });
  });

  return islemler;
}

/**
 * Klasörün adı değişince çalışma kayıtlarındaki kopyayı da tazeler.
 *
 * Ad kayıtların içinde kopya duruyor, çünkü paylaşılan bir çalışma karşı
 * tarafta kendi klasör yolunda görünmeli ve o kişiye klasör kaydını
 * okutamıyoruz; okutsak klasörün paylaşılmamış ayarları ve üye listesi de
 * görünürdü. Kopya olduğu için de tek başına eskiyor.
 */
export function calismalarinKlasorAdiniGuncelle(
  kayitlar: readonly { id: string }[],
  ad: string
): Promise<unknown>[] {
  return kayitlar.map((k) => setDoc(doc(db, 'works', k.id), { projectName: ad }, { merge: true }));
}

/**
 * Ortak çalışan klasörden ayrılırken çalışmalardaki erişimini de bırakır.
 *
 * İki listeden birden çıkılıyor: yalnızca görebilenler listesinden çıkılsa,
 * sahibin bir sonraki tazelemesi kişiyi tek tek davet edilenler listesinden
 * okuyup erişimi geri verirdi.
 */
export function calismalardanAyril(
  kayitlar: readonly { id: string }[],
  uid: string
): Promise<unknown>[] {
  return kayitlar.map((k) => setDoc(
    doc(db, 'works', k.id),
    { readers: arrayRemove(uid), sharedWith: arrayRemove(uid) },
    { merge: true }
  ));
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

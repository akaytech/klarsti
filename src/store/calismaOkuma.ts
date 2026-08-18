import { hamCalismalar, aracAnahtari, TUM_ARACLAR, calismaKayitHakEdiyor } from '../config/toolWorks';
import type { Project, WorkRecord } from './useRoadmapStore';

/**
 * Bir projenin araç verisini, çalışmaların kendi kayıtlarıyla kurar.
 *
 * İçeriğin doğrusu çalışma kaydı; klasör yalnızca "hangi çalışmalar var ve
 * hangi sırayla" diyor (bkz. Project.calismaSirasi). Eskiden içerik klasörün
 * toolData'sında da kopya duruyordu; artık oraya yazılmıyor.
 *
 * Sıranın klasörden gelmesi şart, çünkü bir çalışma kaydını yalnızca sahibi
 * silebiliyor (bkz. firestore.rules). Ortak çalışan bir çalışmayı sildiğinde
 * kaydı sunucuda kalıyor; listeye kayıtlara bakarak karar verseydik sildiği
 * çalışma ekranına geri gelirdi.
 *
 * @param klasorOkunabilir Klasörün kendi kaydını okuyabiliyor muyuz? Tek bir
 *   çalışma paylaşıldığında okuyamıyoruz: sıra listesi diye bir şey yok, ağaç
 *   tamamen kayıtlardan doğuyor.
 */
export function projeyeCalismalariUygula(
  project: Project,
  works: readonly WorkRecord[],
  klasorOkunabilir = true
): Project {
  const projeKayitlari = works.filter((w) => w.projectId === project.id);
  if (projeKayitlari.length === 0) return project;

  const toolData: Record<string, any> = { ...project.toolData };

  TUM_ARACLAR.forEach((tool) => {
    const anahtar = aracAnahtari(tool);
    if (!anahtar) return;

    const kayitlar = projeKayitlari.filter((w) => w.tool === tool && w.data);
    const sira = project.calismaSirasi?.[tool];

    if (kayitlar.length === 0) {
      // Sıra listesi bu aracı BOŞ diye biliyorsa kullanıcı hepsini silmiştir;
      // boş liste yazılmalı, yoksa başlangıç çalışması geri gelirdi. Liste hiç
      // yoksa araca dokunulmaz: kaydı bilerek olmayan başlangıç çalışması
      // silinmiş olurdu.
      if (sira && sira.length === 0) toolData[anahtar] = [];
      return;
    }

    const kayitId = new Map(kayitlar.map((k) => [k.workId, k]));

    if (!klasorOkunabilir) {
      // Klasör bize kapalı: liste yalnızca kayıtlardan, kuruluş sırasıyla.
      toolData[anahtar] = kayitlar
        .slice()
        .sort((a, b) => (a.data?.createdAt ?? a.updatedAt ?? 0) - (b.data?.createdAt ?? b.updatedAt ?? 0))
        .map((k) => k.data);
      return;
    }

    // Klasördeki içerik kopyası: sıra listesine geçmemiş eski projeler için
    // sıranın kaynağı, ve kaydı olmayan bir kimlik için yedek. Sıra listesi
    // yerleştikten sonra bu kopya eskiyor ama zarar vermiyor: kaydı olan her
    // çalışmanın içeriği aşağıda kayıttan geliyor.
    const eskiKopyalar = new Map(
      hamCalismalar(project.toolData, tool).map((c) => [c.id as string, c])
    );

    const dizilim = sira ?? Array.from(eskiKopyalar.keys());

    toolData[anahtar] = dizilim
      .map((id) => kayitId.get(id)?.data ?? eskiKopyalar.get(id))
      .filter((c) => c !== undefined);
  });

  return { ...project, toolData };
}

/**
 * Bir projenin sıra listesini, elimizdeki araç verisinden kurar.
 *
 * Klasör dokümanına yazılan tek araç bilgisi bu. İçerik yok, yalnızca
 * kimlikler.
 *
 * Hiç kullanılmamış araç listeye GİRMEZ (anahtarı hiç yazılmaz): girseydi
 * "kullanıcı hepsini sildi" anlamına gelir ve başlangıç çalışması bir daha
 * kurulmazdı. Kullanıcının boşalttığı araç ise boş diziyle yazılır.
 */
export function calismaSirasiKur(project: Project): Record<string, string[]> {
  const sira: Record<string, string[]> = {};

  TUM_ARACLAR.forEach((tool) => {
    const anahtar = aracAnahtari(tool);
    if (!anahtar) return;
    // Alanın hiç olmaması ile boş olması farklı: ilki "bu araç hiç açılmadı".
    if (project.toolData?.[anahtar] === undefined) return;

    const liste = hamCalismalar(project.toolData, tool);
    const kayitlik = liste.filter((c) => calismaKayitHakEdiyor(c, tool, liste.length));

    // Araçta çalışma VAR ama hiçbiri kayıt hak etmiyorsa (tek başına duran,
    // uygulamanın kendi kurduğu dokunulmamış başlangıç çalışması) anahtar
    // yazılmaz. Boş dizi yazmak "kullanıcı hepsini sildi" demek olurdu ve
    // araç bir daha başlangıç çalışmasıyla açılmazdı — üstelik boş dizi
    // JS'te doğru sayıldığı için loadProject'teki yedek hiç devreye girmez
    // ve kullanıcı aracı bomboş bulurdu.
    if (liste.length > 0 && kayitlik.length === 0) return;

    sira[tool] = kayitlik.map((c) => c.id as string);
  });

  return sira;
}

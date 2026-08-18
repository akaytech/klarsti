import { hamCalismalar, aracAnahtari, TUM_ARACLAR } from '../config/toolWorks';
import type { Project, WorkRecord } from './useRoadmapStore';

/**
 * Bir projenin araç verisini, çalışmaların kendi kayıtlarıyla birleştirir.
 *
 * Neden gerekli: tek bir çalışma paylaşıldığında karşı taraf yalnızca o
 * çalışmanın kaydını görüyor, projenin kaydını değil. Düzenlemesini de ancak
 * oraya yazabiliyor. Bu yüzden içeriğin doğrusu artık çalışma kaydı; projenin
 * toolData'sı ise sırayı ve henüz kaydı olmayan çalışmaları veriyor.
 *
 * "Henüz kaydı olmayan" bilerek var: uygulama beş araç için kendiliğinden bir
 * başlangıç çalışması kuruyor ve bunlar ayrı kayıt almıyor (bkz.
 * calismaDokunulmamis). Onları toolData'dan almazsak araç boş açılırdı.
 *
 * @param klasorOkunabilir Klasörün kendi kaydını okuyabiliyor muyuz? Okuyorsak
 *   listede hangi çalışmaların OLDUĞUNA toolData karar veriyor, kayıtlar
 *   yalnızca içeriği veriyor. Bunun sebebi silme: çalışmayı silen ortak
 *   çalışan kaydı silemiyor (kurallar yalnızca sahibe izin veriyor), kayda
 *   bakılsaydı sildiği çalışma ekranına geri gelirdi. Klasör bize kapalıysa
 *   (tek bir çalışma paylaşılmışsa) toolData diye bir şey yok; ağaç tamamen
 *   kayıtlardan doğuyor.
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
    // Bu araçta hiç kayıt yoksa toolData'ya dokunulmaz. Boş dizi yazmak, kaydı
    // bilerek olmayan başlangıç çalışmasını silmek olurdu.
    if (kayitlar.length === 0) return;

    const kayitId = new Map(kayitlar.map((k) => [k.workId, k]));
    const gorulen = new Set<string>();
    const birlesik = hamCalismalar(project.toolData, tool).map((calisma) => {
      const id = calisma.id as string;
      gorulen.add(id);
      const kayit = kayitId.get(id);
      return kayit ? kayit.data : calisma;
    });

    // Klasör bize kapalıysa liste yalnızca kayıtlardan doğuyor; kuruluş
    // sırasına göre diziliyor.
    if (!klasorOkunabilir) {
      kayitlar
        .filter((k) => !gorulen.has(k.workId))
        .sort((a, b) => (a.data?.createdAt ?? a.updatedAt ?? 0) - (b.data?.createdAt ?? b.updatedAt ?? 0))
        .forEach((k) => birlesik.push(k.data));
    }

    toolData[anahtar] = birlesik;
  });

  return { ...project, toolData };
}

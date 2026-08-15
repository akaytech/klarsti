import { TUM_ARACLAR, aracCalismalari, aracSecimEylemi } from '../config/toolWorks';
import { useRoadmapStore, type Project, type WorkRecord, type ToolId } from '../store/useRoadmapStore';

/**
 * Bütün klasörlerdeki bütün çalışmaların tek düz listesi.
 *
 * Neden ayrı bir dosya: iki ekran aynı listeyi gösteriyor — karşılama
 * ekranındaki "kaldığın yer" şeridi ve tam sayfa çalışma listesi. Üçüncü kat
 * ağacı çıkaran mantık (`aracCalismalari`) araç araç dolaşmak zorunda; iki
 * yerde ayrı ayrı yazılsa biri diğerinden saparadı.
 */
export interface CalismaOzeti {
  /** Liste anahtarı: klasör ve çalışma kimliği birlikte. */
  anahtar: string;
  projectId: string;
  projectName: string;
  tool: ToolId;
  workId: string;
  /** Kullanıcının verdiği ad. Boş olabilir; gösteren taraf yedek metin koyar. */
  ad: string;
  /** Son değişiklik zamanı. Çalışmanın kendi kaydı yoksa klasörünki. */
  guncellendi: number;
}

export function tumCalismalar(
  projects: readonly Project[],
  works: readonly WorkRecord[]
): CalismaOzeti[] {
  // Çalışmanın kendi kaydındaki zaman doğrusu. Kaydı olmayan (hiç
  // dokunulmamış, bu yüzden ayrı kayıt almayan) çalışmalar için klasörün
  // zamanına düşülüyor — onlar listede zaten en altta kalıyor.
  const zamanlar = new Map(works.map((w) => [`${w.projectId}__${w.workId}`, w.updatedAt || 0]));

  const liste: CalismaOzeti[] = [];
  projects.forEach((project) => {
    TUM_ARACLAR.forEach((tool) => {
      aracCalismalari(project.toolData, tool).forEach((calisma) => {
        const anahtar = `${project.id}__${calisma.id}`;
        liste.push({
          anahtar,
          projectId: project.id,
          projectName: project.name,
          tool,
          workId: calisma.id,
          ad: calisma.ad,
          guncellendi: zamanlar.get(anahtar) ?? project.updatedAt ?? 0,
        });
      });
    });
  });
  return liste;
}

/**
 * Bir çalışmayı açar: klasörünü yükler, aracını seçer, o çalışmaya geçer.
 *
 * "Çalışmalarım" menüsündeki açma mantığının aynısı. Adres çubuğunu burada
 * elle güncellemiyoruz; AuthenticatedApp'teki eşitleme durumu görünce yolu
 * kendisi yazıyor.
 */
export function calismayiAc(ozet: CalismaOzeti) {
  const durum = useRoadmapStore.getState();
  if (durum.currentProjectId !== ozet.projectId) durum.loadProject(ozet.projectId);
  durum.setActiveTool(ozet.tool);
  // Bütün çalışmalarını tek sayfada listeleyen araçlarda (SWOT, PDCA...)
  // seçilecek bir şey yok; aracı açmak yeterli.
  const eylem = aracSecimEylemi(ozet.tool);
  if (eylem) (useRoadmapStore.getState() as Record<string, any>)[eylem](ozet.workId);
}

/**
 * Listede gösterilen tarih. Son bir hafta gün adıyla ("dün", "3 gün önce"),
 * öncesi takvim tarihiyle yazılıyor: "17 gün önce" kimsenin kafasında bir
 * güne oturmuyor.
 */
export function tarihEtiketi(zaman: number, dil: string): string {
  if (!zaman) return '';
  const gunBasi = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const gunFarki = Math.round((gunBasi(new Date()) - gunBasi(new Date(zaman))) / 86_400_000);

  if (gunFarki >= 0 && gunFarki < 7) {
    return new Intl.RelativeTimeFormat(dil, { numeric: 'auto' }).format(-gunFarki, 'day');
  }
  return new Intl.DateTimeFormat(dil, { day: 'numeric', month: 'short', year: 'numeric' }).format(zaman);
}

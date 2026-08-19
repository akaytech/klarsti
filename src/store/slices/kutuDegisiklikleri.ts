import type { Edge, Node, NodeChange, EdgeChange, Connection } from '@xyflow/react';

/**
 * React Flow'un üç yardımcı fonksiyonunun yerel kopyası.
 *
 * NEDEN KOPYALANDI: bu üçü depo dilimlerinden çağrılıyordu ve `@xyflow/react`
 * içinden geldikleri için bütün çizim kütüphanesini depoya bağlıyorlardı.
 * Depo dosyasını her araç indiriyor — SWOT açan biri, balık kılçığı açan biri,
 * ajandayı açan biri de. Yani hiç çizim yapmayan sekiz araç, sırf bu üç
 * fonksiyon yüzünden 470 KB'lık çizim kütüphanesini indiriyordu.
 *
 * Üçü de saf: dışarıdan hiçbir şeye bağlı değiller, ekrana dokunmuyorlar,
 * kütüphanenin geri kalanını kullanmıyorlar. Kaynak: @xyflow/react 12.11.2
 * (MIT). Davranışları birebir korundu.
 *
 * GÜVENCE: __testler__/kutuDegisiklikleri.test.ts bu üç fonksiyonu
 * kütüphanenin GERÇEĞİYLE yan yana koşturup sonuçları karşılaştırıyor.
 * Kütüphane sürümü yükseltilip davranış değişirse test kırmızı yanar; kopya
 * sessizce eskimez. (Test dosyası kütüphaneyi içe aktarabilir, testler
 * kullanıcıya gitmiyor.)
 *
 * Çizim tarafı (tuval bileşenleri) kütüphaneyi doğrudan kullanmaya devam
 * ediyor; orada zaten yükleniyor, kopyalamanın anlamı yok.
 */

type Degistirilebilir = Node | Edge;

/** Tek bir değişikliği nesnenin ÜSTÜNE yazar. */
function degisikligiUygula(degisiklik: NodeChange | EdgeChange, nesne: Record<string, unknown>) {
  switch (degisiklik.type) {
    case 'select': {
      nesne.selected = degisiklik.selected;
      break;
    }
    case 'position': {
      if (typeof degisiklik.position !== 'undefined') nesne.position = degisiklik.position;
      if (typeof degisiklik.dragging !== 'undefined') nesne.dragging = degisiklik.dragging;
      break;
    }
    case 'dimensions': {
      if (typeof degisiklik.dimensions !== 'undefined') {
        nesne.measured = { ...degisiklik.dimensions };
        if (degisiklik.setAttributes) {
          if (degisiklik.setAttributes === true || degisiklik.setAttributes === 'width') {
            nesne.width = degisiklik.dimensions.width;
          }
          if (degisiklik.setAttributes === true || degisiklik.setAttributes === 'height') {
            nesne.height = degisiklik.dimensions.height;
          }
        }
      }
      if (typeof degisiklik.resizing === 'boolean') nesne.resizing = degisiklik.resizing;
      break;
    }
  }
}

/**
 * Değişiklikleri sırayla uygular.
 *
 * Bir nesneye ait değişiklik yoksa nesne KOPYALANMADAN geçiyor: referansı
 * korumak React'ın gereksiz yeniden çizimini önlüyor. Değişiklik varsa bir
 * kez sığ kopya alınıp üstüne yazılıyor.
 */
function degisiklikleriUygula<T extends Degistirilebilir>(
  degisiklikler: (NodeChange | EdgeChange)[],
  nesneler: T[],
): T[] {
  const sonuc: T[] = [];
  const haritada = new Map<string, (NodeChange | EdgeChange)[]>();
  const eklenecekler: Extract<NodeChange | EdgeChange, { type: 'add' }>[] = [];

  for (const degisiklik of degisiklikler) {
    if (degisiklik.type === 'add') {
      eklenecekler.push(degisiklik);
      continue;
    }
    if (degisiklik.type === 'remove' || degisiklik.type === 'replace') {
      // Silinecek/değiştirilecek nesnenin sıradaki değişiklikleri boşa gider.
      haritada.set(degisiklik.id, [degisiklik]);
    } else {
      const oncekiler = haritada.get(degisiklik.id);
      if (oncekiler) oncekiler.push(degisiklik);
      else haritada.set(degisiklik.id, [degisiklik]);
    }
  }

  for (const nesne of nesneler) {
    const degisiklikleri = haritada.get(nesne.id);
    if (!degisiklikleri) {
      sonuc.push(nesne);
      continue;
    }
    if (degisiklikleri[0].type === 'remove') continue;
    if (degisiklikleri[0].type === 'replace') {
      sonuc.push({ ...degisiklikleri[0].item } as T);
      continue;
    }
    const guncel = { ...nesne };
    for (const degisiklik of degisiklikleri) {
      degisikligiUygula(degisiklik, guncel as Record<string, unknown>);
    }
    sonuc.push(guncel);
  }

  // Ekleme en sona: araya girecek olanlar doğru sıraya ancak diğerleri
  // yerleştikten sonra oturuyor.
  for (const degisiklik of eklenecekler) {
    if (degisiklik.index !== undefined) sonuc.splice(degisiklik.index, 0, { ...degisiklik.item } as T);
    else sonuc.push({ ...degisiklik.item } as T);
  }

  return sonuc;
}

export function applyNodeChanges<T extends Node>(degisiklikler: NodeChange<T>[], kutular: T[]): T[] {
  return degisiklikleriUygula(degisiklikler as NodeChange[], kutular);
}

export function applyEdgeChanges<T extends Edge>(degisiklikler: EdgeChange<T>[], cizgiler: T[]): T[] {
  return degisiklikleriUygula(degisiklikler as EdgeChange[], cizgiler);
}

const cizgiKimligi = ({ source, sourceHandle, target, targetHandle }: Connection) =>
  `xy-edge__${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;

/** Aynı iki ucu birleştiren bir çizgi zaten var mı? */
const cizgiVarMi = (yeni: Edge, cizgiler: Edge[]) =>
  cizgiler.some(
    (c) =>
      c.source === yeni.source &&
      c.target === yeni.target &&
      (c.sourceHandle === yeni.sourceHandle || (!c.sourceHandle && !yeni.sourceHandle)) &&
      (c.targetHandle === yeni.targetHandle || (!c.targetHandle && !yeni.targetHandle)),
  );

/**
 * Yeni çizgiyi listeye ekler. Uçlardan biri eksikse ya da aynı bağlantı zaten
 * varsa liste olduğu gibi döner — kimlik farklı olsa bile ikinci kez eklenmez.
 */
export function addEdge<T extends Edge>(yeni: T | Connection, cizgiler: T[]): T[] {
  if (!yeni.source || !yeni.target) return cizgiler;

  const cizgiMi = !!yeni && typeof yeni === 'object' && 'id' in yeni && 'source' in yeni && 'target' in yeni;
  const cizgi = (cizgiMi ? { ...yeni } : { ...yeni, id: cizgiKimligi(yeni as Connection) }) as T;

  if (cizgiVarMi(cizgi, cizgiler)) return cizgiler;

  // null tutamaklar siliniyor: kütüphane de böyle yapıyor, yoksa aynı bağlantı
  // bir kez null bir kez tanımsız tutamakla iki farklı çizgi gibi görünüyor.
  if (cizgi.sourceHandle === null) delete cizgi.sourceHandle;
  if (cizgi.targetHandle === null) delete cizgi.targetHandle;

  return cizgiler.concat(cizgi);
}

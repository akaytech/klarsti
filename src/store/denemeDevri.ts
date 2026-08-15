import { toast } from 'sonner';
import i18n from '../i18n';
import { TOOL_KEYS_MAP, useRoadmapStore, type ToolId } from './useRoadmapStore';
import { logAppEvent } from '../firebase';
import { denemeDoluMu, denemeyiOku, denemeyiSil } from './denemeDeposu';

/**
 * Hesapsız denemeyi yeni hesaba taşır.
 *
 * Kullanıcı /dene adresinde çizer, sonra hesap açar. Girişten sonra bir kez
 * çalışıp çizdiklerini "Denemelerim" adlı bir klasöre koyar ve tarayıcıdaki
 * kopyayı siler.
 *
 * Yazma işini SyncManager yapıyor: klasör kurulduktan sonra araç verisi
 * depoya konunca zaten "değişti" sayılıp buluta gidiyor. Buradan doğrudan
 * Firestore'a yazılmıyor.
 *
 * DİKKAT: Bir oturumda yalnızca bir kez çalışmalı. İki kez çalışırsa
 * kullanıcı aynı denemeden iki klasör bulur.
 */

let denendi = false;

/** Kayıtta içi dolu olan ilk aracın kimliği; klasör onunla açılıyor. */
function ilkArac(toolData: Record<string, unknown>): ToolId | null {
  for (const [arac, anahtarlar] of Object.entries(TOOL_KEYS_MAP)) {
    const dolu = anahtarlar.some((k) => Array.isArray(toolData[k]) && (toolData[k] as unknown[]).length > 0);
    if (dolu) return arac as ToolId;
  }
  return null;
}

export function denemeyiHesabaTasi() {
  if (denendi) return;

  const kayit = denemeyiOku();
  if (!denemeDoluMu(kayit)) {
    // Deneme yoksa bir daha bakmaya gerek yok; boş kayıt da temizleniyor.
    denendi = true;
    if (kayit) denemeyiSil();
    return;
  }

  const arac = ilkArac(kayit!.toolData);
  if (!arac) {
    denendi = true;
    denemeyiSil();
    return;
  }

  denendi = true;

  const depo = useRoadmapStore.getState();
  depo.createProject(i18n.t('trial_folder_name'), arac);

  // createProject araç verisini sıfırlıyor (yeni klasör boş başlar); denemenin
  // içeriği hemen ardından konuyor ve SyncManager'ın yazmasına bırakılıyor.
  const guncelleme: Record<string, unknown> = {};
  Object.entries(kayit!.toolData).forEach(([k, deger]) => {
    if (Array.isArray(deger) && deger.length > 0) guncelleme[k] = deger;
  });
  useRoadmapStore.setState(guncelleme as never);

  denemeyiSil();
  logAppEvent('trial_migrated', { tool: arac });
  toast.success(i18n.t('trial_migrated'));
}

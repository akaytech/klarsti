import { useTranslation } from 'react-i18next';
import { GitBranch, CopyPlus } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { VsmHarita } from '../store/useRoadmapStore';
import CalismaMenusu from './CalismaMenusu';

/**
 * Kanvasın sol üstündeki harita menüsü. Gövdesi CalismaMenusu'nda; buraya özel
 * olan iki şey var: haritanın bir türü (mevcut/gelecek durum) ve mevcut
 * durumdan gelecek durum kopyası çıkarma kısayolu. VSM'in asıl kullanımı bu
 * ikili kıyas.
 */
export default function VsmMapsMenu({ aktif }: { aktif: VsmHarita }) {
  const { t } = useTranslation();
  const { vsmMaps, setActiveVsmMap, addVsmMap, renameVsmMap, deleteVsmMap, copyVsmMap, moveVsmMapTo } = useRoadmapStore(useShallow((s) => ({
    vsmMaps: s.vsmMaps,
    setActiveVsmMap: s.setActiveVsmMap,
    addVsmMap: s.addVsmMap,
    renameVsmMap: s.renameVsmMap,
    deleteVsmMap: s.deleteVsmMap,
    copyVsmMap: s.copyVsmMap,
    moveVsmMapTo: s.moveVsmMapTo
  })));

  const turEtiketi = (tur: VsmHarita['tur']) => (tur === 'gelecek' ? t('vsm_state_future') : t('vsm_state_current'));

  return (
    <CalismaMenusu
      Simge={GitBranch}
      aktifId={aktif.id}
      genis
      ogeler={vsmMaps.map((harita) => ({ id: harita.id, name: harita.name, rozet: turEtiketi(harita.tur) }))}
      onSec={setActiveVsmMap}
      onEkle={() => addVsmMap(t('vsm_map_name_n', { sira: vsmMaps.length + 1 }), 'mevcut')}
      onYenidenAdlandir={renameVsmMap}
      onSil={deleteVsmMap}
      onSirala={moveVsmMapTo}
      tetikEki={
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
          aktif.tur === 'gelecek'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        }`}>
          {turEtiketi(aktif.tur)}
        </span>
      }
      // İyileştirmenin başlangıcı: mevcut durumu kopyalayıp üstünde oyna.
      ekEylemler={(kapat) => (
        <button
          onClick={() => { copyVsmMap(aktif.id, t('vsm_future_of', { ad: aktif.name }), 'gelecek'); kapat(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
        >
          <CopyPlus size={16} className="shrink-0" />
          {t('vsm_copy_as_future')}
        </button>
      )}
      metinler={{
        baslik: t('vsm_maps'),
        yeni: t('vsm_new_map'),
        yenidenAdlandir: t('vsm_rename_map'),
        ad: t('vsm_map_name'),
        sil: t('vsm_delete_map'),
        silMesaji: 'vsm_delete_map_msg'
      }}
    />
  );
}

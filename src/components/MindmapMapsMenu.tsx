import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { Mindmap } from '../store/useRoadmapStore';
import CalismaMenusu from './CalismaMenusu';

// Kanvasın sol üstündeki harita menüsü: projedeki zihin haritaları arasında
// geçiş, yeni harita, ad değiştirme, silme ve sıralama. Gövdesi
// CalismaMenusu'nda.
export default function MindmapMapsMenu({ aktif }: { aktif: Mindmap }) {
  const { t } = useTranslation();
  const { mindmaps, setActiveMindmap, addMindmap, renameMindmap, deleteMindmap, moveMindmapTo } = useRoadmapStore(useShallow((s) => ({
    mindmaps: s.mindmaps,
    setActiveMindmap: s.setActiveMindmap,
    addMindmap: s.addMindmap,
    renameMindmap: s.renameMindmap,
    deleteMindmap: s.deleteMindmap,
    moveMindmapTo: s.moveMindmapTo
  })));

  return (
    <CalismaMenusu
      Simge={Brain}
      aktifId={aktif.id}
      // Kök tek başına duruyorsa harita boştur; listede belli olsun.
      ogeler={mindmaps.map((harita) => ({ id: harita.id, name: harita.name, rozet: Math.max(0, harita.nodes.length - 1) }))}
      onSec={setActiveMindmap}
      // Adlar "Zihin Haritası 2", "Zihin Haritası 3"... diye ilerliyor.
      onEkle={() => addMindmap(t('mindmap_map_name_n', { sira: mindmaps.length + 1 }), t('mindmap_root'))}
      onYenidenAdlandir={renameMindmap}
      onSil={deleteMindmap}
      onSirala={moveMindmapTo}
      metinler={{
        baslik: t('mindmap_maps'),
        yeni: t('mindmap_new_map'),
        yenidenAdlandir: t('mindmap_rename_map'),
        ad: t('mindmap_map_name'),
        sil: t('mindmap_delete_map'),
        silMesaji: 'mindmap_delete_map_msg'
      }}
    />
  );
}

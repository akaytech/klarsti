import { useTranslation } from 'react-i18next';
import { Route } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { Roadmap } from '../store/slices/createRoadmapSlice';
import { roadmapIlerleme } from '../store/slices/createRoadmapSlice';
import CalismaMenusu from './CalismaMenusu';

// Kanvasın sol üstündeki harita menüsü: projedeki yol haritaları arasında
// geçiş, yeni harita, ad değiştirme, silme ve sıralama. Gövdesi
// CalismaMenusu'nda; buraya özel olan, listede her haritanın ilerleme
// yüzdesinin görünmesi.
export default function RoadmapMapsMenu({ aktif }: { aktif: Roadmap }) {
  const { t } = useTranslation();
  const { roadmaps, setActiveRoadmap, addRoadmap, renameRoadmap, deleteRoadmap, moveRoadmapTo } = useRoadmapStore(useShallow((s) => ({
    roadmaps: s.roadmaps,
    setActiveRoadmap: s.setActiveRoadmap,
    addRoadmap: s.addRoadmap,
    renameRoadmap: s.renameRoadmap,
    deleteRoadmap: s.deleteRoadmap,
    moveRoadmapTo: s.moveRoadmapTo
  })));

  return (
    <CalismaMenusu
      Simge={Route}
      aktifId={aktif.id}
      tema="lime"
      ogeler={roadmaps.map((harita) => ({
        id: harita.id,
        name: harita.name,
        rozet: t('roadmap_percent', { yuzde: roadmapIlerleme(harita.nodes).yuzde })
      }))}
      onSec={setActiveRoadmap}
      onEkle={() => addRoadmap(t('roadmap_map_name_n', { sira: roadmaps.length + 1 }), t('roadmap_first_step'))}
      onYenidenAdlandir={renameRoadmap}
      onSil={deleteRoadmap}
      onSirala={moveRoadmapTo}
      metinler={{
        baslik: t('roadmap_maps'),
        yeni: t('roadmap_new_map'),
        yenidenAdlandir: t('roadmap_rename_map'),
        ad: t('roadmap_map_name'),
        sil: t('roadmap_delete_map'),
        silMesaji: 'roadmap_delete_map_msg'
      }}
    />
  );
}

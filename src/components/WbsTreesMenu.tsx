import { useTranslation } from 'react-i18next';
import { Network } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useShallow } from 'zustand/react/shallow';
import type { WbsTree } from '../store/useRoadmapStore';
import CalismaMenusu from './CalismaMenusu';

// Kanvasın sol üstündeki ağaç menüsü: projedeki kırılım ağaçları arasında
// geçiş, yeni ağaç, ad değiştirme, silme ve sıralama. Menünün gövdesi
// CalismaMenusu'nda; burada yalnızca kırılım ağacına özel olanlar var.
export default function WbsTreesMenu({ aktif }: { aktif: WbsTree }) {
  const { t } = useTranslation();
  const { wbsTrees, setActiveWbsTree, addWbsTree, renameWbsTree, deleteWbsTree, moveWbsTreeTo } = useRoadmapStore(useShallow((s) => ({
    wbsTrees: s.wbsTrees,
    setActiveWbsTree: s.setActiveWbsTree,
    addWbsTree: s.addWbsTree,
    renameWbsTree: s.renameWbsTree,
    deleteWbsTree: s.deleteWbsTree,
    moveWbsTreeTo: s.moveWbsTreeTo
  })));

  return (
    <CalismaMenusu
      Simge={Network}
      aktifId={aktif.id}
      // Kök tek başına duruyorsa ağaç boştur; listede belli olsun.
      ogeler={wbsTrees.map((agac) => ({ id: agac.id, name: agac.name, rozet: Math.max(0, agac.nodes.length - 1) }))}
      onSec={setActiveWbsTree}
      // Adlar "Kırılım Ağacı 2", "Kırılım Ağacı 3"... diye ilerliyor.
      onEkle={() => addWbsTree(t('wbs_tree_name_n', { sira: wbsTrees.length + 1 }), t('new_project_node'))}
      onYenidenAdlandir={renameWbsTree}
      onSil={deleteWbsTree}
      onSirala={moveWbsTreeTo}
      // Son ağaç silinemez: araç kutusuz kalırsa açılacak bir şey kalmaz.
      silinebilirMi={() => wbsTrees.length > 1}
      metinler={{
        baslik: t('wbs_trees'),
        yeni: t('wbs_new_tree'),
        yenidenAdlandir: t('wbs_rename_tree'),
        ad: t('wbs_tree_name'),
        sil: t('wbs_delete_tree'),
        silMesaji: 'wbs_delete_tree_msg'
      }}
    />
  );
}

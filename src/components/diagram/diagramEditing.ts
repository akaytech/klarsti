import { createContext, useContext } from 'react';

// Adı hangi kutunun içinde yazılıyor? Kutu bunu kendi içinde tutamıyor:
// yeni eklenen kutunun doğrudan yazma kipinde açılması gerekiyor ve o kararı
// kutuyu ekleyen kanvas veriyor (bkz. DiagramCanvas onAddNode).
interface DiagramEditing {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export const DiagramEditingContext = createContext<DiagramEditing>({
  editingId: null,
  setEditingId: () => {},
});

export const useDiagramEditing = () => useContext(DiagramEditingContext);

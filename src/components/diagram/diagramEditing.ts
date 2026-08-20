import { createContext, useContext } from 'react';

// Kutunun kendi içinde halledemediği iki iş kanvasa bırakılıyor: adı hangi
// kutuda yazıyoruz ve altına yeni kutu ekleme. İkisi de kutunun dışını
// ilgilendiriyor (yeni eklenen kutu doğrudan yazma kipinde açılıyor).
interface DiagramEditing {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  /** Verilen kutunun altına yeni kutu ekler ve adını yazmaya açar. */
  kutuEkle: (parentId: string, shape: string, label: string) => void;
}

export const DiagramEditingContext = createContext<DiagramEditing>({
  editingId: null,
  setEditingId: () => {},
  kutuEkle: () => {},
});

export const useDiagramEditing = () => useContext(DiagramEditingContext);

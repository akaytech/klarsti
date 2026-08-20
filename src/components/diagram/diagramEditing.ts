import { createContext, useContext } from 'react';
import type { Yon } from './diagramYonler';

// Kutunun kendi içinde halledemediği iki iş kanvasa bırakılıyor: adı hangi
// kutuda yazıyoruz ve altına yeni kutu ekleme. İkisi de kutunun dışını
// ilgilendiriyor (yeni eklenen kutu doğrudan yazma kipinde açılıyor).
interface DiagramEditing {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  /**
   * Verilen kutunun yanına yeni kutu ekler ve adını yazmaya açar. `yon`,
   * hangi tutamaktaki artıya basıldığı: kutu o yöne iniyor ve çizgi de o
   * tutamaktan çıkıyor.
   */
  kutuEkle: (parentId: string, shape: string, label: string, yon: Yon) => void;
  /**
   * Örnek şablon yüklendi ama kutular daha ölçülüp hizaya sokulmadı. Bu
   * aralıkta kutular saydam duruyor: ölçüldükten sonra yerlerine geçerken
   * ekranda kıpırdadıkları görülüyordu. Yer değiştirme bitince görünüyorlar.
   */
  hazirlaniyor: boolean;
}

export const DiagramEditingContext = createContext<DiagramEditing>({
  editingId: null,
  setEditingId: () => {},
  kutuEkle: () => {},
  hazirlaniyor: false,
});

export const useDiagramEditing = () => useContext(DiagramEditingContext);

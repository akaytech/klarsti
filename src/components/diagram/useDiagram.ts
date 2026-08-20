import { useShallow } from 'zustand/react/shallow';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { DiagramKind } from '../../config/diagramKinds';
import type { DiagramChart, DiagramNodeData } from '../../store/slices/diagramOps';

// Şema motorunun depoya bakan tek yeri. İki aracın dilimleri aynı işleri
// farklı adlarla sunuyor (addFlowchart / addOrgchart gibi); bileşenler bu
// adları bilmesin diye burada tek bir arayüze indiriliyor.

export interface DiagramApi {
  charts: DiagramChart[];
  activeId: string | null;
  setActive: (id: string) => void;
  add: (type: string, name: string, startLabel: string) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  /** Şemayı listede başka bir sıraya taşır. */
  moveTo: (id: string, hedefIndex: number) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  /** Eklenen kutunun kimliğini döndürür (bkz. diagramOps.addNode). */
  addNode: (parentId: string | null, shape: string, label: string, position: { x: number; y: number }) => string;
  updateNode: (id: string, data: Partial<DiagramNodeData>) => void;
  deleteNode: (id: string) => void;
  /**
   * Otomatik hizalama. Seçili kutu yoksa bütün şemayı baştan dizer; seçili
   * kutu varsa yalnızca onu bağlı olduğu kutunun altına oturtur.
   */
  autoLayout: () => void;
}

export function useDiagram(kind: DiagramKind): DiagramApi {
  return useRoadmapStore(useShallow((s): DiagramApi => (
    kind === 'orgchart'
      ? {
          charts: s.orgcharts,
          activeId: s.activeOrgchartId,
          setActive: s.setActiveOrgchart,
          add: s.addOrgchart as DiagramApi['add'],
          rename: s.renameOrgchart,
          remove: s.deleteOrgchart,
          moveTo: s.moveOrgchartTo,
          onNodesChange: s.onOrgchartNodesChange,
          onEdgesChange: s.onOrgchartEdgesChange,
          onConnect: s.onOrgchartConnect,
          addNode: s.addOrgchartNode as DiagramApi['addNode'],
          updateNode: s.updateOrgchartNode,
          deleteNode: s.deleteOrgchartNode,
          autoLayout: s.autoLayoutOrgchart,
        }
      : {
          charts: s.flowcharts,
          activeId: s.activeFlowchartId,
          setActive: s.setActiveFlowchart,
          add: s.addFlowchart as DiagramApi['add'],
          rename: s.renameFlowchart,
          remove: s.deleteFlowchart,
          moveTo: s.moveFlowchartTo,
          onNodesChange: s.onFlowchartNodesChange,
          onEdgesChange: s.onFlowchartEdgesChange,
          onConnect: s.onFlowchartConnect,
          addNode: s.addFlowchartNode as DiagramApi['addNode'],
          updateNode: s.updateFlowchartNode,
          deleteNode: s.deleteFlowchartNode,
          autoLayout: s.autoLayoutFlowchart,
        }
  )));
}

/** Açık şemayı doğrudan depodan okumak isteyen yerler için (kutu numarası vb.) */
export function useActiveChart(kind: DiagramKind): DiagramChart | undefined {
  return useRoadmapStore((s) => {
    const liste = kind === 'orgchart' ? s.orgcharts : s.flowcharts;
    const aktifId = kind === 'orgchart' ? s.activeOrgchartId : s.activeFlowchartId;
    return liste.find((x) => x.id === aktifId) || liste[0];
  });
}

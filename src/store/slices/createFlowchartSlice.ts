import type { StateCreator } from 'zustand';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { getFlowchartType, FLOWCHART_SHAPE_FALLBACKS, type FlowchartShapeId, type FlowchartTypeId } from '../../config/flowchartTypes';
import { createDiagramOps, getActiveChart } from './diagramOps';
import type { DiagramChart, DiagramNode, DiagramNodeData } from './diagramOps';

// Kutu biçimlerinin listesi katalogda (config/flowchartTypes.ts) duruyor.
export type FlowchartNodeType = FlowchartShapeId;
export type FlowchartNodeData = DiagramNodeData;
export type FlowchartNode = DiagramNode;

/**
 * Bir projede birden çok şema olabiliyor: biri iş akışı, biri veri akışı...
 * Her şema kendi türünü, kutularını ve çizgilerini taşır. Liste işlemlerinin
 * gövdesi diagramOps'ta; organizasyon şemaları da aynısını kullanıyor.
 */
export type Flowchart = DiagramChart & { type: FlowchartTypeId };

export interface FlowchartSlice {
  flowcharts: Flowchart[];
  /**
   * Ekranda açık olan şema. Kişisel bir tercih olduğu için projeye
   * kaydedilmez; kaydedilse aynı projede çalışan iki kişi birbirinin
   * sekmesini değiştirirdi.
   */
  activeFlowchartId: string | null;

  setActiveFlowchart: (id: string) => void;
  addFlowchart: (type: FlowchartTypeId, name: string, startLabel: string) => void;
  renameFlowchart: (id: string, name: string) => void;
  /** Şemayı listede başka bir sıraya taşır (bkz. siralama.ts). */
  moveFlowchartTo: (id: string, hedefIndex: number) => void;
  deleteFlowchart: (id: string) => void;

  // Aşağıdakiler hep açık olan şema üzerinde çalışır.
  onFlowchartNodesChange: (changes: NodeChange[]) => void;
  onFlowchartEdgesChange: (changes: EdgeChange[]) => void;
  onFlowchartConnect: (connection: Connection) => void;
  addFlowchartNode: (parentId: string | null, shape: FlowchartNodeType, label: string, position: { x: number, y: number }) => void;
  updateFlowchartNode: (id: string, data: Partial<FlowchartNodeData>) => void;
  deleteFlowchartNode: (id: string) => void;
  /** Kutuları otomatik dizer; seçili kutu varsa yalnızca onu hizalar. */
  autoLayoutFlowchart: () => void;
}

export function getActiveFlowchart(state: { flowcharts: Flowchart[]; activeFlowchartId: string | null }): Flowchart | undefined {
  return getActiveChart(state.flowcharts, state.activeFlowchartId) as Flowchart | undefined;
}

export const createFlowchartSlice: StateCreator<
  RoadmapState,
  [],
  [],
  FlowchartSlice
> = (set) => {
  const ops = createDiagramOps({
    listKey: 'flowcharts',
    activeKey: 'activeFlowchartId',
    nodeType: 'flowchartNode',
    getType: getFlowchartType,
    fallbacks: FLOWCHART_SHAPE_FALLBACKS,
  }, set as any);

  return {
    flowcharts: [],
    activeFlowchartId: null,

    setActiveFlowchart: ops.setActive,
    addFlowchart: ops.add as FlowchartSlice['addFlowchart'],
    renameFlowchart: ops.rename,
    moveFlowchartTo: ops.moveTo,
    deleteFlowchart: ops.remove,

    onFlowchartNodesChange: ops.onNodesChange,
    onFlowchartEdgesChange: ops.onEdgesChange,
    onFlowchartConnect: ops.onConnect,
    addFlowchartNode: ops.addNode as FlowchartSlice['addFlowchartNode'],
    updateFlowchartNode: ops.updateNode,
    deleteFlowchartNode: ops.deleteNode,
    autoLayoutFlowchart: ops.autoLayout,
  };
};

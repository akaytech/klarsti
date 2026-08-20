import type { StateCreator } from 'zustand';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { getFlowchartType, FLOWCHART_SHAPE_FALLBACKS, type FlowchartShapeId, type FlowchartTypeId } from '../../config/flowchartTypes';
import { getFlowchartExample } from '../../config/flowchartExamples';
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
  addFlowchartNode: (parentId: string | null, shape: FlowchartNodeType, label: string, position: { x: number, y: number }, tutamaklar?: { sourceHandle?: string; targetHandle?: string }) => void;
  updateFlowchartNode: (id: string, data: Partial<FlowchartNodeData>) => void;
  deleteFlowchartNode: (id: string) => void;
  /** Çizginin üstündeki yazı; boş verilirse yazı kaldırılır. */
  setFlowchartEdgeLabel: (id: string, label: string) => void;
  deleteFlowchartEdge: (id: string) => void;
  /** Çizginin ucunu başka bir tutamağa taşır. */
  reconnectFlowchartEdge: (id: string, baglanti: Connection) => void;
  /** Kutuları otomatik dizer; seçili kutu varsa yalnızca onu hizalar. */
  autoLayoutFlowchart: () => void;
  /** El değmemiş şemaya türüne uygun örnek şablonu yükler. */
  loadFlowchartExample: () => void;
  /** Kutuları hizaya sokar; geçmişe kayıt düşmez (örnek şablon sonrası). */
  normalizeFlowchartLayout: () => void;
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
    getExample: getFlowchartExample,
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
    setFlowchartEdgeLabel: ops.setEdgeLabel,
    deleteFlowchartEdge: ops.deleteEdge,
    reconnectFlowchartEdge: ops.reconnectEdge,
    autoLayoutFlowchart: ops.autoLayout,
    loadFlowchartExample: ops.loadExample,
    normalizeFlowchartLayout: ops.normalizeLayout,
  };
};

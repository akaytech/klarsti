import type { StateCreator } from 'zustand';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { RoadmapState } from '../useRoadmapStore';
import { getOrgchartType, ORGCHART_SHAPE_FALLBACKS, type OrgchartShapeId, type OrgchartTypeId } from '../../config/orgchartTypes';
import { createDiagramOps, getActiveChart } from './diagramOps';
import type { DiagramChart, DiagramNode, DiagramNodeData } from './diagramOps';

// Organizasyon şemaları. Veri yapısı ve liste işlemleri akış diyagramlarıyla
// birebir aynı (bkz. diagramOps); ayrı bir dilim olmasının sebebi verinin
// projede ayrı bir alanda durması ve kataloğunun farklı olması.

export type OrgchartNodeType = OrgchartShapeId;
export type OrgchartNodeData = DiagramNodeData;
export type OrgchartNode = DiagramNode;

export type Orgchart = DiagramChart & { type: OrgchartTypeId };

export interface OrgchartSlice {
  orgcharts: Orgchart[];
  /** Ekranda açık şema; kişisel tercih olduğu için projeye kaydedilmez. */
  activeOrgchartId: string | null;

  setActiveOrgchart: (id: string) => void;
  addOrgchart: (type: OrgchartTypeId, name: string, startLabel: string) => void;
  renameOrgchart: (id: string, name: string) => void;
  /** Şemayı listede başka bir sıraya taşır (bkz. siralama.ts). */
  moveOrgchartTo: (id: string, hedefIndex: number) => void;
  deleteOrgchart: (id: string) => void;

  onOrgchartNodesChange: (changes: NodeChange[]) => void;
  onOrgchartEdgesChange: (changes: EdgeChange[]) => void;
  onOrgchartConnect: (connection: Connection) => void;
  addOrgchartNode: (parentId: string | null, shape: OrgchartNodeType, label: string, position: { x: number, y: number }, tutamaklar?: { sourceHandle?: string; targetHandle?: string }) => void;
  updateOrgchartNode: (id: string, data: Partial<OrgchartNodeData>) => void;
  deleteOrgchartNode: (id: string) => void;
  /** Çizginin üstündeki yazı; boş verilirse yazı kaldırılır. */
  setOrgchartEdgeLabel: (id: string, label: string) => void;
  deleteOrgchartEdge: (id: string) => void;
  /** Çizginin ucunu başka bir tutamağa taşır. */
  reconnectOrgchartEdge: (id: string, baglanti: Connection) => void;
  /** Kutuları otomatik dizer; seçili kutu varsa yalnızca onu hizalar. */
  autoLayoutOrgchart: () => void;
  /** Kutuları hizaya sokar; geçmişe kayıt düşmez. */
  normalizeOrgchartLayout: () => void;
}

export function getActiveOrgchart(state: { orgcharts: Orgchart[]; activeOrgchartId: string | null }): Orgchart | undefined {
  return getActiveChart(state.orgcharts, state.activeOrgchartId) as Orgchart | undefined;
}

export const createOrgchartSlice: StateCreator<
  RoadmapState,
  [],
  [],
  OrgchartSlice
> = (set) => {
  const ops = createDiagramOps({
    listKey: 'orgcharts',
    activeKey: 'activeOrgchartId',
    nodeType: 'orgchartNode',
    getType: getOrgchartType,
    fallbacks: ORGCHART_SHAPE_FALLBACKS,
  }, set as any);

  return {
    orgcharts: [],
    activeOrgchartId: null,

    setActiveOrgchart: ops.setActive,
    addOrgchart: ops.add as OrgchartSlice['addOrgchart'],
    renameOrgchart: ops.rename,
    moveOrgchartTo: ops.moveTo,
    deleteOrgchart: ops.remove,

    onOrgchartNodesChange: ops.onNodesChange,
    onOrgchartEdgesChange: ops.onEdgesChange,
    onOrgchartConnect: ops.onConnect,
    addOrgchartNode: ops.addNode as OrgchartSlice['addOrgchartNode'],
    updateOrgchartNode: ops.updateNode,
    deleteOrgchartNode: ops.deleteNode,
    setOrgchartEdgeLabel: ops.setEdgeLabel,
    deleteOrgchartEdge: ops.deleteEdge,
    reconnectOrgchartEdge: ops.reconnectEdge,
    autoLayoutOrgchart: ops.autoLayout,
    normalizeOrgchartLayout: ops.normalizeLayout,
  };
};

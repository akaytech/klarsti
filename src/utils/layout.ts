import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

export interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodeSep?: number;
  rankSep?: number;
  /**
   * Function to get the width and height of a node.
   * If not provided, it attempts to use node.width/node.height or fallback to a default.
   */
  getNodeDimensions?: (node: Node) => { width: number; height: number };
}

export const getLayoutedElements = <TNode extends Node, TEdge extends Edge>(
  nodes: TNode[],
  edges: TEdge[],
  options: LayoutOptions = {}
): TNode[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: options.direction || 'TB',
    nodesep: options.nodeSep ?? 50,
    ranksep: options.rankSep ?? 80,
  });

  nodes.forEach((node) => {
    let dim = { width: 250, height: 150 };
    if (options.getNodeDimensions) {
      dim = options.getNodeDimensions(node);
    } else if (node.width && node.height) {
      dim = { width: node.width, height: node.height };
    }
    dagreGraph.setNode(node.id, { width: dim.width, height: dim.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    let dim = { width: 250, height: 150 };
    if (options.getNodeDimensions) {
      dim = options.getNodeDimensions(node);
    } else if (node.width && node.height) {
      dim = { width: node.width, height: node.height };
    }

    // dagre centers the node position.
    // we need to offset it to top-left to match React Flow's coordinate system.
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - dim.width / 2,
        y: nodeWithPosition.y - dim.height / 2,
      },
    };
  });

  return newNodes;
};

export const getDepth = (id: string, edges: Edge[]): number => {
  let depth = 0;
  let curr = id;
  while (curr) {
    const parentEdge = edges.find(e => e.target === curr);
    if (!parentEdge) break;
    curr = parentEdge.source;
    depth++;
  }
  return depth;
};

import { createContext } from 'react';
import type { Edge } from '@xyflow/react';
import type { FtaNode as FtaNodeType } from '../store/useRoadmapStore';

/**
 * Bir FTA düğümünün olasılığını hesaplar. `cache` parametresi, aynı ağaç için
 * yapılan ardışık çağrılar arasında zaten hesaplanmış düğümlerin tekrar
 * hesaplanmasını önler (memoization). Tek bir düğüm için çağrılabileceği gibi,
 * bir ağacın tüm düğümleri için sırayla çağrılırsa toplam karmaşıklık O(N)'e iner.
 */
export const calculateProbability = (
  nodeId: string,
  nodes: FtaNodeType[],
  edges: Edge[],
  cache: Map<string, number | undefined> = new Map()
): number | undefined => {
  if (cache.has(nodeId)) return cache.get(nodeId);

  const node = nodes.find(n => n.id === nodeId);
  if (!node) {
    cache.set(nodeId, undefined);
    return undefined;
  }

  let result: number | undefined;

  if (['basicEvent', 'undevelopedEvent', 'conditioningEvent'].includes(node.data.type)) {
    result = node.data.probability;
  } else {
    const childrenEdges = edges.filter(e => e.source === nodeId);
    if (childrenEdges.length === 0) {
      result = node.data.probability;
    } else {
      const childrenProbs = childrenEdges
        .map(e => calculateProbability(e.target, nodes, edges, cache))
        .filter(p => p !== undefined) as number[];

      if (childrenProbs.length === 0) {
        result = node.data.probability;
      } else if (node.data.type === 'andGate' || node.data.type === 'priorityAndGate' || node.data.type === 'inhibitGate') {
        result = childrenProbs.reduce((acc, p) => acc * p, 1);
      } else if (node.data.type === 'exclusiveOrGate') {
        let sum = 0;
        for (let i = 0; i < childrenProbs.length; i++) {
          let prod = childrenProbs[i];
          for (let j = 0; j < childrenProbs.length; j++) {
            if (i !== j) prod *= (1 - childrenProbs[j]);
          }
          sum += prod;
        }
        result = sum;
      } else {
        // Default to OR for topEvent, event, orGate
        result = 1 - childrenProbs.reduce((acc, p) => acc * (1 - p), 1);
      }
    }
  }

  cache.set(nodeId, result);
  return result;
};

export const FtaProbabilityContext = createContext<Map<string, number | undefined>>(new Map());

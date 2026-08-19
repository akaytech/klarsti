import type { ReactNode } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

/**
 * React Flow'un bağlamını kuran sarmalayıcı.
 *
 * Neden ayrı bir dosya: eskiden `Workspace` bütün araçları doğrudan
 * `ReactFlowProvider` ile sarıyordu. Tek satırdı ama 174 KB'lık çizim
 * kütüphanesini uygulama kabuğuna bağlıyordu — SWOT, PUKÖ, Pareto, ajanda
 * gibi hiç çizim yapmayan dokuz araç da onu indiriyordu.
 *
 * Artık yalnızca çizim araçlarında ve gecikmeli yükleniyor
 * (bkz. config/tools.ts CIZIM_ARACLARI).
 */
export default function CizimSaglayici({ children }: { children: ReactNode }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}

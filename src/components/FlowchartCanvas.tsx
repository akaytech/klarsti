import DiagramCanvas from './diagram/DiagramCanvas';

// Akış diyagramları. Kanvasın kendisi organizasyon şemalarıyla ortak;
// aradaki tek fark hangi kataloğun kullanıldığı (bkz. config/diagramKinds.ts).
export default function FlowchartCanvas() {
  return <DiagramCanvas kind="flowchart" />;
}

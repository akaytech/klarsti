import DiagramCanvas from './diagram/DiagramCanvas';

// Organizasyon şemaları. Akış diyagramlarıyla aynı motoru kullanır; kutular,
// türler ve hazır iskeletler config/orgchartTypes.ts'ten gelir.
export default function OrgchartCanvas() {
  return <DiagramCanvas kind="orgchart" />;
}

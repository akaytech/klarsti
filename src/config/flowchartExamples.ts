import type { DiagramTemplate } from './diagramShared';
import type { FlowchartTypeId } from './flowchartTypes';

/**
 * Akış şemalarının örnek şablonları (boş tuvaldeki "Örnek şablon yükle").
 *
 * Her tür için ayrı bir örnek var, çünkü türler birbirinden kutu çeşitleriyle
 * ayrılıyor: iş akışında karar ve onay kutusu var, süreç akışında taşıma ve
 * bekleme, veri akışında dış varlık ve veri deposu. Tek bir örnek üç türün
 * ikisinde yanlış kutuları gösterirdi.
 *
 * Senaryo SWOT ve kırılım ağacı örnekleriyle aynı: kahve dükkanı.
 *
 * Organizasyon şemalarında buna gerek yok; orada yeni şema zaten türün hazır
 * iskeletiyle açılıyor (bkz. orgchartTypes).
 */

/** İki sıra arası ve yan yana iki kutu arası; dizilimin verdiği ölçüler. */
const SATIR = 112;
const SUTUN = 280;

export const FLOWCHART_EXAMPLES: Record<FlowchartTypeId, DiagramTemplate> = {
  // Kasaya gelen müşteriden teslimata kadar. Ödeme başarısızsa akış karar
  // kutusuna GERİ dönüyor: geri dönen ok akış şemasının en tipik parçası.
  workflow: {
    nodes: [
      { key: 'bas', shape: 'start', labelKey: 'flow_ex_wf_start', x: 0, y: 0 },
      { key: 'siparis', shape: 'process', labelKey: 'flow_ex_wf_order', x: 0, y: SATIR },
      { key: 'odeme', shape: 'decision', labelKey: 'flow_ex_wf_pay', x: 0, y: SATIR * 2 },
      { key: 'hazirla', shape: 'process', labelKey: 'flow_ex_wf_make', x: 0, y: SATIR * 3 },
      { key: 'tekrar', shape: 'process', labelKey: 'flow_ex_wf_retry', x: SUTUN, y: SATIR * 3 },
      { key: 'kontrol', shape: 'approval', labelKey: 'flow_ex_wf_check', x: 0, y: SATIR * 4 },
      { key: 'fis', shape: 'document', labelKey: 'flow_ex_wf_receipt', x: 0, y: SATIR * 5 },
      { key: 'son', shape: 'end', labelKey: 'flow_ex_wf_end', x: 0, y: SATIR * 6 },
    ],
    edges: [
      { source: 'bas', target: 'siparis' },
      { source: 'siparis', target: 'odeme' },
      { source: 'odeme', target: 'hazirla' },
      { source: 'odeme', target: 'tekrar' },
      { source: 'tekrar', target: 'odeme' },
      { source: 'hazirla', target: 'kontrol' },
      { source: 'kontrol', target: 'fis' },
      { source: 'fis', target: 'son' },
    ],
  },

  // Çekirdeğin dükkana girişinden fincana kadar izlediği yol. Düz bir sıra:
  // süreç akışında anlatılmak istenen zaten adımların sırası ve türü.
  process: {
    nodes: [
      { key: 'bas', shape: 'start', labelKey: 'flow_ex_pr_start', x: 0, y: 0 },
      { key: 'kabul', shape: 'inspection', labelKey: 'flow_ex_pr_inspect', x: 0, y: SATIR },
      { key: 'depo', shape: 'storage', labelKey: 'flow_ex_pr_store', x: 0, y: SATIR * 2 },
      { key: 'tasima', shape: 'transport', labelKey: 'flow_ex_pr_move', x: 0, y: SATIR * 3 },
      { key: 'ogut', shape: 'operation', labelKey: 'flow_ex_pr_grind', x: 0, y: SATIR * 4 },
      { key: 'cek', shape: 'operation', labelKey: 'flow_ex_pr_brew', x: 0, y: SATIR * 5 },
      { key: 'bekle', shape: 'delay', labelKey: 'flow_ex_pr_rest', x: 0, y: SATIR * 6 },
      { key: 'tat', shape: 'inspection', labelKey: 'flow_ex_pr_taste', x: 0, y: SATIR * 7 },
      { key: 'son', shape: 'end', labelKey: 'flow_ex_pr_end', x: 0, y: SATIR * 8 },
    ],
    edges: [
      { source: 'bas', target: 'kabul' },
      { source: 'kabul', target: 'depo' },
      { source: 'depo', target: 'tasima' },
      { source: 'tasima', target: 'ogut' },
      { source: 'ogut', target: 'cek' },
      { source: 'cek', target: 'bekle' },
      { source: 'bekle', target: 'tat' },
      { source: 'tat', target: 'son' },
    ],
  },

  // Sipariş bilgisinin nereden gelip nerede saklandığı. Veri akışında kutular
  // adım değil: dış varlık (müşteri, banka), süreç ve veri deposu.
  dfd: {
    nodes: [
      { key: 'musteri', shape: 'externalEntity', labelKey: 'flow_ex_df_customer', x: 140, y: 0 },
      { key: 'al', shape: 'process', labelKey: 'flow_ex_df_take', x: 140, y: SATIR },
      { key: 'kayit', shape: 'dataStore', labelKey: 'flow_ex_df_orders', x: -140, y: SATIR * 2 },
      { key: 'dogrula', shape: 'process', labelKey: 'flow_ex_df_verify', x: 420, y: SATIR * 2 },
      { key: 'banka', shape: 'externalEntity', labelKey: 'flow_ex_df_bank', x: 280, y: SATIR * 3 },
      { key: 'hazirla', shape: 'process', labelKey: 'flow_ex_df_prepare', x: 560, y: SATIR * 3 },
      { key: 'stok', shape: 'dataStore', labelKey: 'flow_ex_df_stock', x: 560, y: SATIR * 4 },
    ],
    edges: [
      { source: 'musteri', target: 'al' },
      { source: 'al', target: 'kayit' },
      { source: 'al', target: 'dogrula' },
      { source: 'dogrula', target: 'banka' },
      { source: 'dogrula', target: 'hazirla' },
      { source: 'hazirla', target: 'stok' },
    ],
  },
};

export const getFlowchartExample = (id: string | null | undefined): DiagramTemplate | undefined =>
  FLOWCHART_EXAMPLES[id as FlowchartTypeId];

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlow, Controls, Panel, useReactFlow } from '@xyflow/react';
import type { NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CanvasBackdrop from './CanvasBackdrop';
import { metinAlaninda } from '../utils/metinAlaninda';
import { useShallow } from 'zustand/react/shallow';
import { useRoadmapStore, getActiveVsmMap } from '../store/useRoadmapStore';
import { islem, islemBasla, islemBitir } from '../store/gecmis';
import {
  VsmProcessNode,
  VsmSupplierCustomerNode,
  VsmInventoryNode,
  VsmSupermarketNode,
  VsmProductionControlNode,
  VsmShipmentNode,
  VsmKaizenNode,
} from './VsmNode';
import {
  VsmPushEdge,
  VsmPullEdge,
  VsmFifoEdge,
  VsmInfoEdge,
  VsmInfoElectronicEdge,
  VsmEdgeMarkers,
} from './VsmEdges';
import VsmContextMenu from './VsmContextMenu';
import type { VsmMenuHedefi } from './VsmContextMenu';
import VsmTimelineOverlay from './VsmTimelineOverlay';
import VsmMapsMenu from './VsmMapsMenu';
import VsmSettingsPanel from './VsmSettingsPanel';
import CanvasAddButton from './CanvasAddButton';
import { useEkranaSigdir } from '../utils/ekranaSigdir';
import ConfirmModal from './ConfirmModal';
import { vsmHesapla, saniyeBicimle, sayiBicimle } from '../utils/vsmHesap';
import { Clock, Gauge, Sparkles, AlertTriangle, Workflow } from 'lucide-react';

const nodeTypes = {
  vsmProcess: VsmProcessNode,
  vsmSupplierCustomer: VsmSupplierCustomerNode,
  vsmInventory: VsmInventoryNode,
  vsmSupermarket: VsmSupermarketNode,
  vsmProductionControl: VsmProductionControlNode,
  vsmShipment: VsmShipmentNode,
  vsmKaizen: VsmKaizenNode,
};

const edgeTypes = {
  vsmPush: VsmPushEdge,
  vsmPull: VsmPullEdge,
  vsmFifo: VsmFifoEdge,
  vsmInfo: VsmInfoEdge,
  vsmInfoElectronic: VsmInfoElectronicEdge,
};

/** Alt bardaki tek bir sayı. */
function Gosterge({ Simge, baslik, deger, renk }: { Simge: typeof Clock; baslik: string; deger: string; renk: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`shrink-0 rounded-xl p-2.5 ${renk}`}>
        <Simge size={20} />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{baslik}</h3>
        <div className="truncate text-xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{deger}</div>
      </div>
    </div>
  );
}

export default function VsmCanvas() {
  const { t } = useTranslation();
  const { screenToFlowPosition } = useReactFlow();

  const {
    vsmMaps, onVsmNodesChange, onVsmEdgesChange, onVsmConnect, addVsmNode, deleteVsmNode, addVsmMap,
  } = useRoadmapStore(useShallow((s) => ({
    vsmMaps: s.vsmMaps,
    onVsmNodesChange: s.onVsmNodesChange,
    onVsmEdgesChange: s.onVsmEdgesChange,
    onVsmConnect: s.onVsmConnect,
    addVsmNode: s.addVsmNode,
    deleteVsmNode: s.deleteVsmNode,
    addVsmMap: s.addVsmMap,
  })));
  const harita = useRoadmapStore((s) => getActiveVsmMap(s));

  const [menu, setMenu] = useState<{ hedef: VsmMenuHedefi; top: number; left: number } | null>(null);
  const [silinecekId, setSilinecekId] = useState<string | null>(null);
  const sarmalayici = useRef<HTMLDivElement>(null);
  // Geçmişte açık bir sürükleme işlemi var mı? (bkz. onNodeDragStart)
  const surukleAcik = useRef(false);

  const hesap = useMemo(
    () => (harita ? vsmHesapla(harita.nodes, harita.edges, harita.ayarlar) : null),
    [harita]
  );

  const onNodeClick: NodeMouseHandler = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
  }, []);

  // Sürükleme tek bir işlem: burada açılıyor, bırakılınca kapanıyor. Kutunun
  // her karede güncellenen konumu geçmişe ayrı ayrı girmiyor; geri alındığında
  // kutu sürüklemeden ÖNCEKİ yerine dönüyor.
  const onNodeDragStart = useCallback(() => {
    islemBasla();
    surukleAcik.current = true;
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (!surukleAcik.current) return;
    surukleAcik.current = false;
    islemBitir();
  }, []);

  // Bırakma olayı hiç gelmeden bileşen sökülürse açık işlem kapatılır; yoksa
  // sonraki bütün yazmaları kendine yutar.
  useEffect(() => () => {
    if (surukleAcik.current) {
      surukleAcik.current = false;
      islemBitir();
    }
  }, []);

  const menuAc = useCallback((event: React.MouseEvent, hedef: VsmMenuHedefi) => {
    // Yazı alanlarında sağ tık tarayıcının kendi menüsüne bırakılıyor:
    // kullanıcı orada Kes/Kopyala/Yapıştır bekliyor, kutu menüsünü değil.
    if (metinAlaninda(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    setMenu({ hedef, top: event.clientY, left: event.clientX });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    const e = event as React.MouseEvent;
    if (metinAlaninda(e.target)) return;
    e.preventDefault();
    setMenu({
      hedef: { tur: 'pane', konum: screenToFlowPosition({ x: e.clientX, y: e.clientY }) },
      top: e.clientY,
      left: e.clientX,
    });
  }, [screenToFlowPosition]);

  const onPaneClick = useCallback(() => {
    document.dispatchEvent(new Event('close-menus'));
    setMenu(null);
  }, []);

  // Harita değişince ya da iskelet kurulunca kamera içeriğe sığdırılıyor.
  useEkranaSigdir(harita?.id, harita?.nodes.length ?? 0, { padding: 0.2, duration: 600 });

  /**
   * Alttaki "kutu ekle" düğmesi. Değer akışında kutunun türü (işlem, stok,
   * müşteri, kaizen...) seçilmek zorunda; düğme boş kanvasa sağ tıklamakla
   * aynı menüyü açıyor. Yeni kutu, kullanıcının o an baktığı yerin ortasına
   * konuyor — düğmenin dibine değil.
   */
  const dugmeIleEkle = useCallback((yer: { x: number; y: number }) => {
    const kutu = sarmalayici.current?.getBoundingClientRect();
    const merkez = kutu
      ? { x: kutu.left + kutu.width / 2, y: kutu.top + kutu.height / 2 }
      : yer;
    document.dispatchEvent(new Event('close-menus'));
    setMenu({
      hedef: { tur: 'pane', konum: screenToFlowPosition(merkez) },
      top: yer.y,
      left: yer.x,
    });
  }, [screenToFlowPosition]);

  /**
   * Boş haritayı iskeletle doldurur: tedarikçi → stok → işlem → stok → müşteri.
   * Eskiden bir useEffect kanvas boşaldıkça tedarikçi kutusunu geri koyuyordu;
   * kullanıcı haritayı boşaltamıyor, boş VSM'i olan proje de gereksiz yere
   * kirleniyordu. Artık başlangıç açık bir tercih.
   */
  const iskeletKur = useCallback(() => islem(() => {
    const tedarikci = addVsmNode('vsmSupplierCustomer', t('vsm_add_supplier'), { x: 0, y: 0 });
    const stok1 = addVsmNode('vsmInventory', 'I', { x: 260, y: 40 });
    // Değişken adı islemKutusu: geçmiş sarmalayıcısı da islem adını taşıyor.
    const islemKutusu = addVsmNode('vsmProcess', t('vsm_untitled_process'), { x: 420, y: 0 });
    const stok2 = addVsmNode('vsmInventory', 'I', { x: 700, y: 40 });
    const musteri = addVsmNode('vsmSupplierCustomer', t('vsm_add_customer'), { x: 860, y: 0 });

    const store = useRoadmapStore.getState();
    if (musteri) store.updateVsmNode(musteri, { rol: 'musteri' });
    [[tedarikci, stok1], [stok1, islemKutusu], [islemKutusu, stok2], [stok2, musteri]].forEach(([a, b]) => {
      if (a && b) store.onVsmConnect({ source: a, target: b, sourceHandle: null, targetHandle: null });
    });
  }), [addVsmNode, t]);

  const birimler = { sec: t('vsm_time_unit_sec'), min: t('vsm_time_unit_min'), hr: t('vsm_time_unit_hr') };

  // Proje henüz yüklenmediyse harita da yok; kullanıcıya boş kanvas göstermek
  // yerine haritayı kurma imkânı veriyoruz.
  if (!harita) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
        <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
            <Workflow size={24} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('vsm_no_map_hint')}</p>
          <button
            onClick={() => addVsmMap(t('vsm_map_name_n', { sira: vsmMaps.length + 1 }), 'mevcut')}
            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
          >
            {t('vsm_new_map')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sarmalayici} className="relative flex h-full w-full flex-1 flex-col bg-slate-50 transition-colors dark:bg-slate-900">
      <div className="relative flex-1">
        <VsmEdgeMarkers />
        <ReactFlow
          nodes={harita.nodes as any}
          edges={harita.edges as any}
          onNodesChange={onVsmNodesChange}
          onEdgesChange={onVsmEdgesChange}
          onConnect={onVsmConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          onNodeContextMenu={(e, node) => menuAc(e, { tur: 'node', id: node.id })}
          onEdgeContextMenu={(e, edge) => menuAc(e, { tur: 'edge', id: edge.id })}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneClick}
          fitView
          deleteKeyCode={['Delete']}
          fitViewOptions={{ duration: 600, padding: 0.2, maxZoom: 1.2 }}
          defaultEdgeOptions={{ type: 'vsmPush' }}
        >
          <CanvasBackdrop gap={20} size={1} />
          <Controls className="!border-slate-200 !bg-white !shadow-md dark:!border-slate-700 dark:!bg-slate-800" />

          <Panel position="top-left" style={{ marginTop: 68 }}>
            <VsmMapsMenu aktif={harita} />
          </Panel>

          <Panel position="top-right" style={{ marginTop: 68 }}>
            <VsmSettingsPanel harita={harita} />
          </Panel>

          <VsmTimelineOverlay />

          {harita.nodes.length > 0 && (
            <CanvasAddButton
              etiket={t('canvas_add_generic')}
              ipucu={t('canvas_add_hint_menu')}
              onClick={dugmeIleEkle}
            />
          )}

          {harita.nodes.length === 0 && (
            <Panel position="top-center" className="mt-28">
              <div className="max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-6 text-center shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                  <Workflow size={24} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('vsm_start_hint')}</p>
                <button
                  onClick={iskeletKur}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                >
                  {t('vsm_start_skeleton')}
                </button>
                <button
                  onClick={() => addVsmNode('vsmProcess', t('vsm_untitled_process'), { x: 0, y: 0 })}
                  className="mt-2 w-full rounded-xl px-5 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  {t('vsm_start_empty')}
                </button>
              </div>
            </Panel>
          )}
        </ReactFlow>

        {menu && (
          <VsmContextMenu
            hedef={menu.hedef}
            top={menu.top}
            left={menu.left}
            onClose={() => setMenu(null)}
            onRequestDeleteNode={setSilinecekId}
          />
        )}
      </div>

      {/* Alt bar: haritanın verdiği cevaplar. */}
      <div className="z-10 shrink-0 border-t border-slate-200 bg-white px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Gosterge
            Simge={Clock}
            baslik={t('vsm_total_lead_time')}
            deger={`${sayiBicimle(hesap?.toplamTeslimGun ?? 0)} ${t('vsm_days')}`}
            renk="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
          />
          <Gosterge
            Simge={Sparkles}
            baslik={t('vsm_total_value_added')}
            deger={saniyeBicimle(hesap?.toplamKatmaDegerSaniye ?? 0, birimler)}
            renk="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          />
          <Gosterge
            Simge={Gauge}
            baslik={t('vsm_flow_efficiency')}
            deger={`%${sayiBicimle(hesap?.akisVerimliligi ?? 0)}`}
            renk="bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
          />

          {/* Zincire bağlanmamış kutular sessizce toplama giriyordu; artık
              toplamların dışında ve kullanıcı bunu görüyor. */}
          {(hesap?.zincirDisiSayisi ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertTriangle size={16} className="shrink-0" />
              {t('vsm_off_chain_warning', { sayi: hesap?.zincirDisiSayisi })}
            </div>
          )}
          {(hesap?.taktiAsanIdler.length ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
              <AlertTriangle size={16} className="shrink-0" />
              {t('vsm_bottleneck_warning', { sayi: hesap?.taktiAsanIdler.length })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={silinecekId !== null}
        onClose={() => setSilinecekId(null)}
        onConfirm={() => { if (silinecekId) deleteVsmNode(silinecekId); }}
        title={t('vsm_delete_node_title')}
        message={t('vsm_delete_node_msg')}
      />
    </div>
  );
}

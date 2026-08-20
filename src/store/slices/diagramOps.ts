import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges, addEdge } from './kutuDegisiklikleri';
import type { NodeChange, EdgeChange, Connection, Edge, Node } from '@xyflow/react';
import i18n from '../../i18n';
import type { DiagramTemplate, DiagramTypeDef } from '../../config/diagramShared';
import { edgeStyle, edgeMarker } from '../../config/diagramShared';
import { islem, tiktaIslem, gecmisiTemizle } from '../gecmis';
import { siraDegistir } from './siralama';
import { altKutular, ebeveyneHizala, semayiDiz } from '../../utils/diagramLayout';

// Akış diyagramları ve organizasyon şemaları aynı veri yapısını kullanıyor:
// projede birden çok şema, her şemanın kendi türü, kutuları ve çizgileri.
// Şema listesini yöneten işlemler burada tek yerde duruyor; iki dilim
// (createFlowchartSlice / createOrgchartSlice) bunları kendi alan adlarına
// bağlıyor.

export type DiagramNodeData = {
  label: string;
  shape: string;
  /** Kutuda ikinci satır: organizasyon şemasında unvan / görev */
  subtitle?: string;
};

export type DiagramNode = Node<DiagramNodeData>;

export type DiagramChart = {
  id: string;
  name: string;
  type: string;
  nodes: DiagramNode[];
  edges: Edge[];
  createdAt: number;
};

/**
 * Açık şema. activeId proje değişince eskimiş olabiliyor, o yüzden her yerde
 * listeye bakarak çözülüyor; bulunamazsa ilk şema açıktır.
 */
export function getActiveChart(charts: DiagramChart[], activeId: string | null): DiagramChart | undefined {
  return charts.find((s) => s.id === activeId) || charts[0];
}

/**
 * Kesik çizgili ikincil bağlantı mı? Kutuların yan tutamaklarından (sağdan
 * çıkıp soldan giren) çekilen çizgiler ikincil sayılıyor: matris şemasında
 * proje yöneticisi hattı, ağ şemasında dış paydaş bağlantısı.
 */
function ikincilMi(sourceHandle?: string | null, targetHandle?: string | null) {
  return sourceHandle === 'right' || targetHandle === 'left';
}

/** Bir çizginin iki ucundaki tutamak adları. Boş olanlar hiç yazılmıyor. */
type Uclar = { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null };

/**
 * Yeni çizgi nesnesi. Üç yerden çağrılıyor: elle bağlama (onConnect), kutunun
 * tutamağındaki artıyla ekleme (addNode) ve hazır şablon. Üçünde de aynı
 * kurallar geçerli olsun diye tek yerde duruyor.
 */
function cizgiKur(tur: DiagramTypeDef, uclar: Uclar, ek?: { label?: string; secondary?: boolean }): Edge {
  const cizgi: Record<string, unknown> = { id: uuidv4(), source: uclar.source, target: uclar.target };
  if (uclar.sourceHandle) cizgi.sourceHandle = uclar.sourceHandle;
  if (uclar.targetHandle) cizgi.targetHandle = uclar.targetHandle;
  if (ek?.label) cizgi.label = ek.label;

  // Yandan yana çekilen çizgi ikincil hat sayılır; türün kesikli stili varsa
  // o uygulanır, yoksa çizgi normal görünür.
  if (tur.secondaryEdge && (ek?.secondary || ikincilMi(uclar.sourceHandle, uclar.targetHandle))) {
    cizgi.type = tur.secondaryEdge.type;
    cizgi.animated = tur.secondaryEdge.animated;
    cizgi.style = edgeStyle(tur.secondaryEdge);
    // Ok başı olağan çizgilere kanvastan veriliyor; kendi rengi olan ikincil
    // hat kendi okunu taşıyor.
    cizgi.markerEnd = edgeMarker(tur.secondaryEdge);
  }

  return cizgi as Edge;
}

interface DiagramOpsConfig {
  /** Şema listesinin state'teki alan adı (ör. 'flowcharts') */
  listKey: string;
  /** Açık şemanın kimliğini tutan alan adı (ör. 'activeFlowchartId') */
  activeKey: string;
  /** React Flow düğüm tipi */
  nodeType: string;
  getType: (id: string | null | undefined) => DiagramTypeDef;
  /** Tür değişiminde kutuların en yakın karşılığı */
  fallbacks: Record<string, string[]>;
  /**
   * Türün örnek şablonu (boş tuvaldeki "Örnek şablon yükle"). Yalnızca akış
   * şemalarında var; organizasyon şeması zaten hazır iskeletle açılıyor.
   */
  getExample?: (typeId: string) => DiagramTemplate | undefined;
}

export function createDiagramOps(cfg: DiagramOpsConfig, set: (fn: (state: any) => any) => void) {
  const listesi = (state: any): DiagramChart[] => state[cfg.listKey] || [];

  /** Açık şemayı değiştirir, diğerlerine dokunmaz. */
  const aktifiGuncelle = (state: any, degistir: (sema: DiagramChart) => DiagramChart) => {
    const aktif = getActiveChart(listesi(state), state[cfg.activeKey]);
    if (!aktif) return state;
    return {
      ...state,
      [cfg.listKey]: listesi(state).map((s) => (s.id === aktif.id ? degistir(s) : s)),
    };
  };

  /**
   * Şablondaki kutu ve çizgileri gerçek kimliklerle kurar. İki yerden
   * çağrılıyor: yeni şemanın hazır iskeleti ve örnek şablon düğmesi.
   */
  const sablonuKur = (sablon: DiagramTemplate, tur: DiagramTypeDef) => {
    const kimlikler: Record<string, string> = {};
    const nodes: DiagramNode[] = sablon.nodes.map((k) => {
      const id = uuidv4();
      kimlikler[k.key] = id;
      return {
        id,
        type: cfg.nodeType,
        position: { x: k.x, y: k.y },
        data: {
          label: i18n.t(k.labelKey),
          shape: k.shape,
          ...(k.subtitleKey ? { subtitle: i18n.t(k.subtitleKey) } : {}),
        },
      };
    });

    const edges: Edge[] = sablon.edges.map((c) => cizgiKur(
      tur,
      {
        source: kimlikler[c.source],
        target: kimlikler[c.target],
        sourceHandle: c.sourceHandle,
        targetHandle: c.targetHandle,
      },
      { secondary: c.secondary, label: c.labelKey ? i18n.t(c.labelKey) : undefined }
    ));

    return { nodes, edges };
  };

  /**
   * Yeni şemanın açılış içeriği. Türün hazır iskeleti varsa o kurulur
   * (organizasyon şemasında türler birbirinden dizilimiyle ayrıldığı için
   * şablon şart), yoksa tek bir başlangıç kutusu atılır.
   */
  const acilisIcerigi = (tur: DiagramTypeDef, startLabel: string) => {
    if (!tur.template) {
      return {
        nodes: [{
          id: uuidv4(),
          type: cfg.nodeType,
          position: { x: 0, y: 0 },
          data: { label: startLabel, shape: tur.startShape },
        }] as DiagramNode[],
        edges: [] as Edge[],
      };
    }
    return sablonuKur(tur.template, tur);
  };

  /**
   * Şemaya el değmemiş mi? Ya bomboş, ya da yalnızca yeni şemayla gelen tek
   * kutu duruyor. Karşılama şeridi ve örnek şablon buna bakıyor.
   */
  const elDegmemis = (sema: DiagramChart) => sema.edges.length === 0 && sema.nodes.length <= 1;

  /**
   * Şemanın türünde kesik çizgili ikincil hat var mı? Varsa (organizasyon
   * şemaları) yandan yana çekilen çizgiler hiyerarşi anlatmıyor ve dizilime
   * karışmıyorlar. Akış şemalarında öyle bir ayrım yok: yan çizgi de akışın
   * bir parçası (bkz. utils/diagramLayout).
   */
  const ikincilHatVar = (sema: DiagramChart) => !!cfg.getType(sema.type).secondaryEdge;

  /** Bütün şemayı yukarıdan aşağıya dizer (bkz. utils/diagramLayout). */
  const semayiYenidenDiz = (sema: DiagramChart): DiagramChart => {
    const yerler = semayiDiz(sema.nodes, sema.edges, ikincilHatVar(sema));
    return {
      ...sema,
      nodes: sema.nodes.map((n) => {
        const yer = yerler.get(n.id);
        return yer ? { ...n, position: yer } : n;
      }),
    };
  };

  return {
    // Geçmiş açık şemaya ait; şema değişince (ya da şema eklenip silinince)
    // kayıtlar ekranda olmayan bir şeye ait olur ve geri tuşu görünürde
    // hiçbir şey yapmazdı.
    setActive: (id: string) => {
      gecmisiTemizle();
      set((state) => ({ ...state, [cfg.activeKey]: id }));
    },

    add: (type: string, name: string, startLabel: string) => {
      gecmisiTemizle();
      set((state) => {
        const { nodes, edges } = acilisIcerigi(cfg.getType(type), startLabel);
        const yeni: DiagramChart = { id: uuidv4(), name, type, nodes, edges, createdAt: Date.now() };
        return { ...state, [cfg.listKey]: [...listesi(state), yeni], [cfg.activeKey]: yeni.id };
      });
    },

    /** Şemayı listede başka bir sıraya taşır (bkz. siralama.ts). */
    moveTo: (id: string, hedefIndex: number) => {
      set((state) => {
        const yeni = siraDegistir(listesi(state), id, hedefIndex);
        return yeni ? { ...state, [cfg.listKey]: yeni } : state;
      });
    },

    rename: (id: string, name: string) => {
      set((state) => ({
        ...state,
        [cfg.listKey]: listesi(state).map((s) => (s.id === id ? { ...s, name } : s)),
      }));
    },

    remove: (id: string) => {
      gecmisiTemizle();
      set((state) => {
        const kalan = listesi(state).filter((s) => s.id !== id);
        return {
          ...state,
          [cfg.listKey]: kalan,
          [cfg.activeKey]: state[cfg.activeKey] === id ? (kalan[0]?.id ?? null) : state[cfg.activeKey],
        };
      });
    },

    // Seçim, ölçüm ve sürükleme ara kareleri geçmişe girmiyor; yalnızca silme
    // gerçek bir işlem. Silinen kutunun çizgileri de aynı işlemde gidiyor:
    // arkadan gelen çizgi silme çağrısı ayrı bir adım olarak görünmesin ve
    // geri alındığında kutu çizgileriyle birlikte dönsün diye.
    onNodesChange: (changes: NodeChange[]) => {
      const silinenler = new Set(
        changes.filter((c) => c.type === 'remove').map((c) => (c as { id: string }).id)
      );
      const uygula = () => set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: applyNodeChanges(changes, sema.nodes) as DiagramNode[],
        edges: silinenler.size > 0
          ? sema.edges.filter((e) => !silinenler.has(e.source) && !silinenler.has(e.target))
          : sema.edges,
      })));
      if (silinenler.size > 0) islem(uygula);
      else uygula();
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const uygula = () => set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        edges: applyEdgeChanges(changes, sema.edges) as Edge[],
      })));
      if (changes.some((c) => c.type === 'remove')) tiktaIslem(uygula);
      else uygula();
    },

    onConnect: (connection: Connection) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        const yeni = cizgiKur(cfg.getType(sema.type), connection);
        return { ...sema, edges: addEdge(yeni as any, sema.edges as any) as Edge[] };
      }));
    }),

    /**
     * Çizginin üstündeki yazı ("Evet", "Hayır", "olmazsa"...). Boş verilirse
     * yazı tamamen kaldırılıyor: boş dizge kalırsa çizginin ortasında boş bir
     * etiket kutusu duruyor.
     */
    setEdgeLabel: (id: string, label: string) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        edges: sema.edges.map((e) => {
          if (e.id !== id) return e;
          const yeni = { ...e };
          if (label) yeni.label = label;
          else delete yeni.label;
          return yeni;
        }),
      })));
    }),

    deleteEdge: (id: string) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        edges: sema.edges.filter((e) => e.id !== id),
      })));
    }),

    /**
     * Çizginin ucunu tutup başka bir tutamağa taşıma (sökme/takma). Yazısı ve
     * stili çizgiyle birlikte geliyor; kullanıcı ucunu oynattı diye "Hayır"
     * yazısını yeniden yazmak zorunda kalmıyor.
     */
    reconnectEdge: (id: string, baglanti: Connection) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        if (!sema.edges.some((e) => e.id === id)) return sema;
        const ayni = (e: Edge) =>
          e.source === baglanti.source &&
          e.target === baglanti.target &&
          (e.sourceHandle ?? null) === (baglanti.sourceHandle ?? null) &&
          (e.targetHandle ?? null) === (baglanti.targetHandle ?? null);
        // Aynı iki tutamağın arasında zaten çizgi varsa ikincisi kurulmuyor;
        // taşınan çizgi eski yerinde kalıyor.
        if (sema.edges.some((e) => e.id !== id && ayni(e))) return sema;
        return {
          ...sema,
          edges: sema.edges.map((e) => {
            if (e.id !== id) return e;
            const yeni = { ...e, source: baglanti.source, target: baglanti.target };
            if (baglanti.sourceHandle) yeni.sourceHandle = baglanti.sourceHandle;
            else delete yeni.sourceHandle;
            if (baglanti.targetHandle) yeni.targetHandle = baglanti.targetHandle;
            else delete yeni.targetHandle;
            return yeni;
          }),
        };
      }));
    }),

    // Yeni kutunun kimliği geri veriliyor: kanvas kutuyu ekler eklemez adını
    // yazma kutusunu onun üstünde açıyor.
    //
    // `tutamaklar`: kutu hangi tutamaktaki artıdan eklendiyse çizgi de oradan
    // çıkıyor. Sağdaki artıdan eklenen kutu sağa iniyor ve çizgi sağdan
    // çıkıp yeni kutunun soluna giriyor; verilmezse alt/üst (eski davranış).
    addNode: (
      parentId: string | null,
      shape: string,
      label: string,
      position: { x: number; y: number },
      tutamaklar?: { sourceHandle?: string; targetHandle?: string }
    ) => islem(() => {
      const yeniId = uuidv4();
      set((state) => aktifiGuncelle(state, (sema) => {
        const newNode: DiagramNode = {
          id: yeniId,
          type: cfg.nodeType,
          position,
          data: { label, shape },
        };
        return {
          ...sema,
          nodes: [...sema.nodes, newNode],
          edges: parentId
            ? [...sema.edges, cizgiKur(cfg.getType(sema.type), {
                source: parentId,
                target: newNode.id,
                sourceHandle: tutamaklar?.sourceHandle,
                targetHandle: tutamaklar?.targetHandle,
              })]
            : sema.edges,
        };
      }));
      return yeniId;
    }),

    updateNode: (id: string, data: Partial<DiagramNodeData>) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: sema.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      })));
    }),

    deleteNode: (id: string) => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => ({
        ...sema,
        nodes: sema.nodes.filter((n) => n.id !== id),
        edges: sema.edges.filter((e) => e.source !== id && e.target !== id),
      })));
    }),

    /**
     * Otomatik hizalama (bkz. utils/diagramLayout.ts).
     *
     * Seçili kutu yoksa bütün şema yukarıdan aşağıya baştan dizilir. Seçili
     * kutu varsa şemanın geri kalanına dokunulmuyor: yalnızca o kutu — ve
     * şekli bozulmasın diye altındaki bacak — bağlı olduğu üst kutunun
     * altındaki yerine oturuyor.
     */
    /**
     * Kutuları bir kez hizaya sokar. Bilerek işlem sınırı YOK: bu, örnek
     * şablon yüklendikten sonra çalışan otomatik bir düzeltme (bkz.
     * DiagramCanvas). Kullanıcının yaptığı bir iş değil, geri alınacak ayrı
     * bir adım olarak görünmemeli — bir geri, şablonun tamamını kaldırmalı.
     */
    normalizeLayout: () => {
      set((state) => aktifiGuncelle(state, semayiYenidenDiz));
    },

    /**
     * Örnek şablon. Yalnızca el değmemiş şemaya yükleniyor: kullanıcının
     * üstünde çalıştığı bir şemayı silmek düğmenin işi değil.
     */
    loadExample: () => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        if (!elDegmemis(sema)) return sema;
        const ornek = cfg.getExample?.(sema.type);
        if (!ornek) return sema;
        // Şablondaki konumlar kabataslak; dizilimden geçiriliyor ki şema daha
        // İLK boyamada hizalı çıksın. Kutular henüz ölçülmediği için burada
        // varsayılan ölçüler kullanılıyor — gerçek enler gelince kanvas
        // dizilimi bir kez daha çalıştırıp ince ayarı yapıyor
        // (bkz. DiagramCanvas, ornekYukle).
        return semayiYenidenDiz({ ...sema, ...sablonuKur(ornek, cfg.getType(sema.type)) });
      }));
    }),

    autoLayout: () => islem(() => {
      set((state) => aktifiGuncelle(state, (sema) => {
        const secililer = sema.nodes.filter((n) => n.selected);

        // Hiçbir kutu seçili değilse de, HEPSİ seçiliyse de aynı iş: bütün
        // şemayı baştan dizmek. Hepsi seçiliyken kutular tek tek ebeveynlerine
        // göre hizalanıyordu ve sonuç bütün şemanın dizilimiyle aynı yere
        // düşmüyordu: zaten dizili bir şemayı hepsini seçip hizalayınca
        // kutular yerlerinden oynuyordu.
        if (secililer.length === 0 || secililer.length === sema.nodes.length) {
          return semayiYenidenDiz(sema);
        }

        // Birden çok kutu seçiliyse sırayla hizalanıyorlar; her biri bir
        // öncekinin bıraktığı hâlin üstüne konuyor.
        const ikincil = ikincilHatVar(sema);
        let nodes = sema.nodes;
        for (const secili of secililer) {
          const hedef = ebeveyneHizala(nodes, sema.edges, secili.id, ikincil);
          if (!hedef) continue;
          const simdiki = nodes.find((n) => n.id === secili.id);
          if (!simdiki) continue;
          const dx = hedef.x - simdiki.position.x;
          const dy = hedef.y - simdiki.position.y;
          if (dx === 0 && dy === 0) continue;
          // Kutunun altındaki bacak da aynı kadar kayıyor; şekli bozulmuyor.
          const tasinacak = altKutular(sema.nodes, sema.edges, secili.id, ikincil);
          tasinacak.add(secili.id);
          nodes = nodes.map((n) => (tasinacak.has(n.id)
            ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
            : n));
        }

        return nodes === sema.nodes ? sema : { ...sema, nodes };
      }));
    }),
  };
}

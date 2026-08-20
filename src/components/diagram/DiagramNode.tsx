import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Handle, NodeToolbar } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { DiagramNodeData } from '../../store/slices/diagramOps';
import { getDiagramKind, type DiagramKind } from '../../config/diagramKinds';
import { useDiagramEditing } from './diagramEditing';
import { POZISYON, YONLER, type Yon } from './diagramYonler';
import DiagramShapeStrip from './DiagramShapeStrip';

interface DiagramNodeProps {
  id: string;
  data: DiagramNodeData;
  selected?: boolean;
  kind: DiagramKind;
}

export default memo(function DiagramNode({ id, data, selected, kind }: DiagramNodeProps) {
  const { t } = useTranslation();
  const { label, shape, subtitle } = data;
  const k = getDiagramKind(kind);
  const bicim = k.getShape(shape);

  // Veri akış şemasında kutular numaralı anılır. Numara veride tutulmuyor,
  // aynı biçimdeki kutular arasındaki sıradan hesaplanıyor.
  const numara = useRoadmapStore((state) => {
    const liste = kind === 'orgchart' ? state.orgcharts : state.flowcharts;
    const aktifId = kind === 'orgchart' ? state.activeOrgchartId : state.activeFlowchartId;
    const sema = liste.find((x) => x.id === aktifId) || liste[0];
    if (!sema) return null;
    const onEk = k.getType(sema.type).numbered?.[bicim.id];
    if (onEk === undefined) return null;
    const sira = sema.nodes.filter((n) => n.data.shape === bicim.id).findIndex((n) => n.id === id);
    return sira < 0 ? null : `${onEk}${sira + 1}`;
  });

  // Ad değiştirme kutunun İÇİNDE oluyor (kırılım ağacındaki gibi): çift
  // tıklayınca yazının yerini bir yazma alanı alıyor. Eskiden imlecin yanında
  // ayrı bir menü kutusu açılıyordu; kullanıcı adını değiştirdiği kutuya
  // bakarken yazıyı bambaşka bir yerde yazıyordu.
  const updateNode = useRoadmapStore((s) => (kind === 'orgchart' ? s.updateOrgchartNode : s.updateFlowchartNode));
  const { editingId, setEditingId, kutuEkle, hazirlaniyor } = useDiagramEditing();
  const duzenleniyor = editingId === id;
  const [taslak, setTaslak] = useState(label);
  // Organizasyon şemasında kutuda ad ve unvan diye iki satır var; ikisi de
  // kutunun içinde yazılıyor.
  const [altTaslak, setAltTaslak] = useState(subtitle || '');
  const girdiRef = useRef<HTMLInputElement>(null);
  const sarmalRef = useRef<HTMLDivElement>(null);
  // Esc ile çıkılınca yazma alanı ekrandan kalkıyor; arkasından gelebilecek
  // blur'un yazılanı kaydetmemesi için.
  const vazgecildi = useRef(false);

  // Yazı hazır seçili geliyor: yeni kutudaki varsayılan ad ("Yeni işlem") ilk
  // tuşta silinsin, kullanıcı elle temizlemesin diye.
  //
  // Odak tek denemede oturmuyor: React Flow yeni eklenen kutuyu ölçene kadar
  // görünmez tutuyor, görünmeyen bir alan da odak alamıyor. Ölçüm bitene
  // kadar her karede yeniden deneniyor; yoksa kutu yazma kipinde açılıyor ama
  // yazdıkların hiçbir yere gitmiyordu.
  useEffect(() => {
    if (!duzenleniyor) return;
    vazgecildi.current = false;
    setTaslak(label);
    setAltTaslak(subtitle || '');

    let kalanDeneme = 30;
    let kare = 0;
    const dene = () => {
      const el = girdiRef.current;
      if (!el) return;
      el.focus();
      if (document.activeElement === el) {
        el.select();
        return;
      }
      if (kalanDeneme-- > 0) kare = requestAnimationFrame(dene);
    };
    dene();
    return () => cancelAnimationFrame(kare);
  }, [duzenleniyor, label, subtitle]);

  const kaydet = () => {
    if (vazgecildi.current) return;
    const degisim: Partial<DiagramNodeData> = {};
    const yeni = taslak.trim();
    if (yeni && yeni !== label) degisim.label = yeni;
    if (bicim.withSubtitle && altTaslak.trim() !== (subtitle || '')) degisim.subtitle = altTaslak.trim();
    if (Object.keys(degisim).length > 0) updateNode(id, degisim);
    setEditingId(null);
  };

  // Ad ve unvan iki ayrı yazma alanı; birinden ötekine geçmek kaydetmeyi
  // tetiklememeli. Odak kutunun içinde kaldıysa hiçbir şey yapılmıyor.
  const alandanCikinca = (olay: React.FocusEvent) => {
    if (sarmalRef.current?.contains(olay.relatedTarget as Node | null)) return;
    kaydet();
  };

  const tusIsle = (olay: React.KeyboardEvent) => {
    if (olay.key === 'Enter') {
      olay.preventDefault();
      kaydet();
    }
    if (olay.key === 'Escape') {
      olay.preventDefault();
      vazgecildi.current = true;
      setEditingId(null);
    }
  };

  // Dört tutamaktaki "+" ve ondan açılan şekil şeridi. Artılar yalnızca
  // üstüne gelince / kutu seçiliyken görünüyor: yedi kutuluk bir şemada hepsi
  // birden dursa ekran düğmeden geçilmiyor.
  const [uzerinde, setUzerinde] = useState(false);
  /** Şerit hangi tutamaktan açıldı? Kapalıysa null. */
  const [seritYon, setSeritYon] = useState<Yon | null>(null);

  // Fare kutudan çıkınca artılar HEMEN kaybolmuyor.
  //
  // Eski hali şuydu: artı kutunun dışında, arada birkaç piksellik boşluk olan
  // ayrı bir katmanda duruyordu. İmleç o boşluğa girer girmez "kutudan çıktı"
  // sayılıp artı kayboluyor, kullanıcı düğmeye varamıyordu. Kutuyu bir kez
  // tıklamak işe yarıyordu ama sebebi bambaşkaydı: seçili kutuda artı zaten
  // sürekli duruyor.
  const gecikme = useRef<number | undefined>(undefined);
  const uzerineGel = () => {
    window.clearTimeout(gecikme.current);
    setUzerinde(true);
  };
  const uzerindenAyril = () => {
    window.clearTimeout(gecikme.current);
    gecikme.current = window.setTimeout(() => setUzerinde(false), 260);
  };
  useEffect(() => () => window.clearTimeout(gecikme.current), []);

  // Tutamağa basılıp SÜRÜKLENDİYSE tıklama sayılmıyor. Basma noktasıyla
  // bırakma noktası arasında birkaç pikselden fazla varsa kullanıcı çizgi
  // çekmeye çalışmıştır; boşa giden çizgiden sonra şekil şeridi açılmamalı.
  const basmaYeri = useRef<{ x: number; y: number } | null>(null);

  // Şeridin hangi şekilleri göstereceği şemanın türüne bağlı. Bütün şemayı
  // değil yalnızca tür bilgisini okuyor: kutular birbirinin taşınmasında
  // yeniden çizilmesin diye.
  const semaTuru = useRoadmapStore((state) => {
    const liste = kind === 'orgchart' ? state.orgcharts : state.flowcharts;
    const aktifId = kind === 'orgchart' ? state.activeOrgchartId : state.activeFlowchartId;
    return (liste.find((x) => x.id === aktifId) || liste[0])?.type;
  });

  // Kanvasta boşluğa tıklamak / kaydırmak açık şeridi kapatır.
  useEffect(() => {
    if (!seritYon) return;
    const kapat = () => setSeritYon(null);
    document.addEventListener('close-menus', kapat);
    return () => document.removeEventListener('close-menus', kapat);
  }, [seritYon]);

  const girdiSinifi = 'nodrag nopan text-center text-inherit bg-white/85 dark:bg-slate-900/80 rounded px-1 outline-none ring-1 ring-indigo-500';

  const Ikon = bicim.icon;

  /**
   * Tutamağın yerini katalog düzeltiyorsa (bkz. karar baklavası) React Flow'un
   * kendi yerleştirmesi tamamen devre dışı bırakılıyor: sağ/alt dayamaları
   * sıfırlanıp tutamak verilen noktaya ortalanıyor.
   */
  const tutamak = (yon: Yon): CSSProperties | undefined => {
    const duzeltme = bicim.handleStyles?.[yon];
    if (!duzeltme) return undefined;
    return { right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', ...duzeltme };
  };

  const artiGorunur = uzerinde || !!selected || seritYon !== null;

  return (
    <div
      // Şablon hizaya sokulana kadar saydam (bkz. diagramEditing.hazirlaniyor).
      className={`relative flex items-center justify-center min-h-[56px] transition-all ${bicim.boxClass} ${selected && !bicim.clipClass ? 'ring-4 ring-indigo-500/30' : ''} ${hazirlaniyor ? 'opacity-0' : ''}`}
      onMouseEnter={uzerineGel}
      onMouseLeave={uzerindenAyril}
    >
      {/* Kırpılarak çizilen şekillerin dolgusu (ok, üçgen). Arkada duruyor ki
          kırpma yazıyı ve bağlantı noktalarını da kesmesin; seçim halkası da
          dörtgen olarak değil şeklin kendi kenarından ışıyarak veriliyor. */}
      {bicim.clipClass && (
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 ${selected ? 'drop-shadow-[0_0_5px_rgba(99,102,241,0.95)]' : ''}`}
        >
          <div className={`h-full w-full ${bicim.clipClass}`} />
        </div>
      )}

      {/* Yeni kutu tutamaklardaki artılardan ekleniyor: artı şekil şeridini
          açıyor, şeritten seçilen kutu o yöne inip aynı tutamaktan bağlanıyor
          ve adı yazma kipinde açılıyor. */}
      <NodeToolbar isVisible={seritYon !== null} position={POZISYON[seritYon ?? 'bottom']} offset={18}>
        <div onMouseEnter={uzerineGel} onMouseLeave={uzerindenAyril}>
          <DiagramShapeStrip
            kind={kind}
            chartType={semaTuru}
            onSec={(sekil, ad) => {
              const yon = seritYon;
              setSeritYon(null);
              if (yon) kutuEkle(id, sekil, ad, yon);
            }}
          />
        </div>
      </NodeToolbar>

      {/* Dört tutamak da hem çıkış hem giriş: hepsi "source" tipinde ve kanvas
          gevşek bağlanma kipinde çalışıyor (bkz. DiagramCanvas). Kütüphane
          çizginin çıkış ucunu yalnız "source" tutamaklar arasında arıyor;
          "target" tipli bir tutamaktan çizgi ÇIKAMIYOR. */}
      {YONLER.map((yon) => (
        <Handle
          key={yon}
          id={yon}
          type="source"
          position={POZISYON[yon]}
          style={tutamak(yon)}
          className="w-3 h-3 bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-800"
          onMouseDown={(e) => { basmaYeri.current = { x: e.clientX, y: e.clientY }; }}
          onClick={(e) => {
            e.stopPropagation();
            const bas = basmaYeri.current;
            basmaYeri.current = null;
            if (bas && Math.hypot(e.clientX - bas.x, e.clientY - bas.y) > 4) return;
            // Aynı artıya ikinci kez basmak şeridi kapatıyor. Karar bu satırda
            // veriliyor: aşağıdaki yayın şeridi zaten kapattığı için "önceki
            // hâle" bakan bir güncelleme her seferinde yeniden açardı.
            const kapansin = seritYon === yon;
            // Açık kalmış başka bir menü (sağ tık menüsü, başka kutunun
            // şeridi) kapanıyor; ikisi birden ekranda durmuyor.
            document.dispatchEvent(new Event('close-menus'));
            setSeritYon(kapansin ? null : yon);
          }}
        >
          {/* Artı, tutamağın İÇİNDE duruyor: tutamak kutunun bir parçası
              olduğu için imleç oraya gidince kutudan çıkılmış sayılmıyor ve
              düğme ayağının altından kaçmıyor. Tutamağın kendi ölçüsü
              değişmiyor; çizgiler hep aynı noktaya bağlanıyor. */}
          <button
            type="button"
            title={t(k.text.addBox)}
            aria-label={t(k.text.addBox)}
            // Görünmezken sıraya girmiyor: her kutuda dört tane var, hepsi
            // sekmede dolaşsaydı klavyeyle şemada gezmek imkânsızdı.
            tabIndex={artiGorunur ? 0 : -1}
            className={`absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-opacity hover:bg-indigo-700 ${artiGorunur ? 'opacity-100' : 'pointer-events-none opacity-0'} ${bicim.innerClass || ''}`}
          >
            <Plus size={12} className="stroke-[3]" />
          </button>
        </Handle>
      ))}

      {/* Yazı boyu ve iç boşluk satır içi stille veriliyor: sınıf olarak
          verilince temel sınıflarla çakışıp hangisinin kazanacağı belirsiz
          kalıyor ve şekillerin dışına taşan yazılar çıkıyordu. */}
      <div
        className={`flex items-center justify-center text-center font-bold outline-none break-words w-full h-full gap-2 ${bicim.innerClass || ''}`}
        style={{ fontSize: 14, lineHeight: 1.25, padding: 8, ...bicim.innerStyle }}
      >
        {bicim.withIcon && <Ikon size={16} className="shrink-0 opacity-70" />}
        <div className="flex flex-col items-center leading-tight" ref={sarmalRef}>
          {numara && <span className="text-[10px] font-black opacity-60">{numara}</span>}
          {duzenleniyor ? (
            <>
              <input
                ref={girdiRef}
                // nodrag/nopan: yazıyı fareyle seçerken kutu sürükleniyor,
                // kanvas kayıyordu.
                // data-kutu-basligi: kanvas tıklamanın yazıya gelip gelmediğine
                // bakıyor (bkz. DiagramCanvas onNodeClick).
                className={`${girdiSinifi} font-bold`}
                data-kutu-basligi
                style={{
                  // Yazma alanı kutuyu şişirmesin diye genişlik yazı kadar,
                  // en fazla kutunun içi kadar (baklava gibi sabit ölçülü
                  // kutularda taşmasın).
                  width: `${Math.max(8, taslak.length + 1)}ch`,
                  maxWidth: '100%',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                }}
                value={taslak}
                onChange={(e) => setTaslak(e.target.value)}
                onBlur={alandanCikinca}
                onKeyDown={tusIsle}
                placeholder={t(k.text.inputPlaceholder)}
                aria-label={t(k.text.inputPlaceholder)}
              />
              {/* Organizasyon şemasında unvan satırı. Kutuda adın altında
                  duruyor, düzenlenirken de orada yazılıyor. */}
              {bicim.withSubtitle && (
                <input
                  className={`${girdiSinifi} text-xs font-medium mt-0.5`}
                  data-kutu-basligi
                  style={{ width: `${Math.max(8, altTaslak.length + 1)}ch`, maxWidth: '100%' }}
                  value={altTaslak}
                  onChange={(e) => setAltTaslak(e.target.value)}
                  onBlur={alandanCikinca}
                  onKeyDown={tusIsle}
                  placeholder={t(k.text.subtitlePlaceholder)}
                  aria-label={t(k.text.subtitlePlaceholder)}
                />
              )}
            </>
          ) : (
            <>
              <span
                data-kutu-basligi
                onDoubleClick={() => setEditingId(id)}
                className="cursor-text"
                title={t('double_click_edit')}
              >
                {label}
              </span>
              {bicim.withSubtitle && subtitle && (
                <span
                  data-kutu-basligi
                  onDoubleClick={() => setEditingId(id)}
                  className="text-xs font-medium opacity-60 mt-0.5 cursor-text"
                  title={t('double_click_edit')}
                >
                  {subtitle}
                </span>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
});

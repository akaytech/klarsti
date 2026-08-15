import { useRoadmapStore } from '../store/useRoadmapStore';
import { getActiveWbsTree } from '../store/slices/createWbsSlice';
import { getActiveFiveWhys } from '../store/slices/createFiveWhysSlice';
import { getActiveMindmap, getMindmapRoot } from '../store/slices/createMindmapSlice';
import { bekle, imlecBaslangic, imlecGit, inputaYaz, odaktanCik, sigdir, tikla, tiklaGorsel, yaz } from './demoAltyapi';

/**
 * Ana sayfadaki klipler. Her sahne önce depoyu kurar (kur), sonra adımları
 * oynatır (oyna). Metinler bilerek tek dilde: klipler Türkçe çekiliyor.
 *
 * Sahnenin içindeki hikâye her araçta aynı: yeni bir kahve dükkânı şubesi
 * açılıyor. Uygulamadaki hazır örnek şablon da bu hikâyeyi anlatıyor.
 */

export type Sahne = {
  /** Dosya adı: public/tanitim/<ad>.mp4 */
  ad: string;
  /** Hangi ekran çizilecek. 'karsilama' tuval değil, giriş ekranının kendisi. */
  arac: 'wbs' | '5whys' | 'pareto' | 'mindmap' | 'karsilama';
  kur: () => void;
  oyna: () => Promise<void>;
};

const depo = () => useRoadmapStore.getState();

/** Tuvalin altındaki "kutu ekle" düğmesi (React Flow'un alt-orta paneli). */
const EKLE_DUGMESI = '.react-flow__panel.bottom.center button';

const yeniId = (once: string[], sonra: string[]) => sonra.find((id) => !once.includes(id));

// --- Kırılım ağacı --------------------------------------------------------

const wbsDugumler = () => getActiveWbsTree(depo())?.nodes ?? [];

const wbsSec = (id: string) => {
  const degisim = wbsDugumler().map((n) => ({ type: 'select' as const, id: n.id, selected: n.id === id }));
  depo().onNodesChange(degisim);
};

/** Seçili kutunun altına düğmeyle kutu ekler, yeni kutunun kimliğini verir. */
const wbsEkle = async (ebeveynId: string) => {
  wbsSec(ebeveynId);
  await bekle(280);
  const once = wbsDugumler().map((n) => n.id);
  await tikla(EKLE_DUGMESI);
  return yeniId(once, wbsDugumler().map((n) => n.id))!;
};

const wbsYaz = (id: string) => (metin: string) => depo().updateGoal(id, { label: metin });

const isKirilimi: Sahne = {
  ad: 'is-kirilimi',
  arac: 'wbs',
  kur: () => {
    const d = depo();
    d.addWbsTree('Kahve Dükkanı Şubesi', 'Yeni Kahve Dükkanı Şubesi Açılışı');
    const kok = wbsDugumler()[0];
    d.addGoal(kok.id, 'Lokasyon ve Sözleşme');
    const faz = wbsDugumler().find((n) => n.id !== kok.id)!;
    d.addGoal(faz.id, 'Bölge ve rakip analizi');
    d.addGoal(faz.id, 'Kira sözleşmesinin imzalanması');
    // İlk faz bitmiş görünsün: kliple birlikte durum renkleri de anlatılıyor.
    wbsDugumler()
      .filter((n) => n.id !== kok.id)
      .forEach((n) => d.updateGoal(n.id, { status: 'Done' }));
    imlecBaslangic(window.innerWidth / 2, window.innerHeight + 40);
  },
  oyna: async () => {
    await bekle(500);
    const kok = wbsDugumler()[0];

    // Projenin altına yeni bir faz
    const faz = await wbsEkle(kok.id);
    await sigdir();
    await imlecGit(`.react-flow__node[data-id="${faz}"]`, 420);
    await yaz(wbsYaz(faz), 'Tadilat ve Ekipman');
    await bekle(300);

    // Fazın altına iki iş paketi
    const is1 = await wbsEkle(faz);
    await sigdir();
    await imlecGit(`.react-flow__node[data-id="${is1}"]`, 380);
    await yaz(wbsYaz(is1), 'Kahve makinesi alımı');
    await bekle(260);

    const is2 = await wbsEkle(faz);
    await sigdir();
    await imlecGit(`.react-flow__node[data-id="${is2}"]`, 380);
    await yaz(wbsYaz(is2), 'Mobilya ve tabela montajı');
    await bekle(500);

    depo().updateGoal(is1, { status: 'In Progress' });
    await bekle(1000);
  },
};

// --- 5 Neden --------------------------------------------------------------

const whysDugumler = () => getActiveFiveWhys(depo())?.nodes ?? [];

const whysSec = (id: string) => {
  depo().onFiveWhysNodesChange(
    whysDugumler().map((n) => ({ type: 'select' as const, id: n.id, selected: n.id === id }))
  );
};

/** Seçili kutunun ardına düğmeyle yeni bir "neden" ekler. */
const whysEkle = async (ebeveynId: string) => {
  whysSec(ebeveynId);
  await bekle(260);
  const once = whysDugumler().map((n) => n.id);
  await tikla(EKLE_DUGMESI);
  return yeniId(once, whysDugumler().map((n) => n.id))!;
};

const whysYaz = (id: string) => (metin: string) => depo().updateFiveWhysNode(id, { label: metin });

const besNeden: Sahne = {
  ad: 'bes-neden',
  arac: '5whys',
  kur: () => {
    depo().addFiveWhysAnalysis('Sabah kuyruğu', 'Sabah saatlerinde kuyruk çok uzun');
    imlecBaslangic(window.innerWidth / 2, window.innerHeight + 40);
  },
  oyna: async () => {
    await bekle(500);
    let ebeveyn = whysDugumler()[0].id;

    // Zincir bilerek kısa: kutular yan yana dizildiği için her yeni kutu
    // görüntüyü biraz daha uzaklaştırıyor, yazılar küçülüyor.
    const zincir = ['Neden? Siparişler yavaş hazırlanıyor', 'Neden? Makinenin bakımı yapılmamış'];

    for (const satir of zincir) {
      const id = await whysEkle(ebeveyn);
      await sigdir(340);
      await imlecGit(`.react-flow__node[data-id="${id}"]`, 380);
      await yaz(whysYaz(id), satir, 26);
      ebeveyn = id;
      await bekle(220);
    }

    // Kök neden çözümü kutusu düğmeden değil, kutu menüsünden ekleniyor;
    // klibi uzatmamak için doğrudan çağrılıyor.
    const once = whysDugumler().map((n) => n.id);
    depo().addFiveWhysNode(ebeveyn, 'solution', '');
    await bekle(240);
    const cozum = yeniId(once, whysDugumler().map((n) => n.id))!;
    await sigdir(340);
    await imlecGit(`.react-flow__node[data-id="${cozum}"]`, 380);
    await yaz(whysYaz(cozum), 'Çözüm: Bakımı takvime bağla', 26);
    await bekle(1000);
  },
};

// --- Pareto ---------------------------------------------------------------

const PARETO_ID = 'demo-pareto';
const PARETO_EKLE = 'table + button';
/** Tablonun son satırındaki iki alan: kategori ve sıklık. */
const paretoAlan = (sutun: 1 | 2) => `tbody tr:last-child td:nth-child(${sutun}) input`;

const pareto: Sahne = {
  ad: 'pareto',
  arac: 'pareto',
  kur: () => {
    depo().addParetoProject('demo', PARETO_ID, 'Müşteri Şikâyetleri');
    depo().addParetoItem('demo', PARETO_ID, 'Uzun bekleme süresi', 48);
    depo().addParetoItem('demo', PARETO_ID, 'Sipariş yanlış hazırlandı', 21);
    imlecBaslangic(window.innerWidth / 2, window.innerHeight + 40);
  },
  oyna: async () => {
    await bekle(500);

    const satirlar: { ad: string; sayi: string }[] = [
      { ad: 'Kahve soğuk geldi', sayi: '12' },
      { ad: 'Masalar temiz değil', sayi: '7' },
    ];

    for (const satir of satirlar) {
      // "Satır ekle" düğmesi tablonun hemen altında.
      await tikla(PARETO_EKLE);
      await bekle(160);

      const ad = paretoAlan(1);
      await imlecGit(ad, 420);
      await tiklaGorsel();
      await inputaYaz(ad, satir.ad, 28);
      await odaktanCik(ad);

      const sayi = paretoAlan(2);
      await imlecGit(sayi, 320);
      await tiklaGorsel();
      await inputaYaz(sayi, satir.sayi, 90);
      await odaktanCik(sayi);
      await bekle(500);
    }

    await bekle(1200);
  },
};

// --- Zihin haritası -------------------------------------------------------

const zihinDugumler = () => getActiveMindmap(depo())?.nodes ?? [];
const zihinKenarlar = () => getActiveMindmap(depo())?.edges ?? [];

const zihinYaz = (id: string) => (metin: string) => depo().updateMindmapNode(id, { label: metin });

const zihinHarita: Sahne = {
  ad: 'zihin-haritasi',
  arac: 'mindmap',
  kur: () => {
    depo().addMindmap('Açılış Kampanyası', 'Açılış Kampanyası');
    imlecBaslangic(window.innerWidth / 2, window.innerHeight + 40);
  },
  oyna: async () => {
    await bekle(700);
    const kok = getMindmapRoot(zihinDugumler(), zihinKenarlar())!;

    const dallar = ['Sosyal medya', 'Mahalle esnafı', 'Açılış indirimi'];
    const eklenen: string[] = [];

    for (const dal of dallar) {
      const id = depo().addMindmapChild(kok.id, '')!;
      eklenen.push(id);
      await bekle(220);
      await sigdir(360);
      await imlecGit(`.react-flow__node[data-id="${id}"]`, 430);
      await yaz(zihinYaz(id), dal, 38);
      await bekle(260);
    }

    // Bir dalın altına iki alt dal: haritanın nasıl büyüdüğü görünsün.
    for (const alt of ['Kahve ikramı', 'Sadakat kartı']) {
      const id = depo().addMindmapChild(eklenen[2], '')!;
      await bekle(220);
      await sigdir(360);
      await imlecGit(`.react-flow__node[data-id="${id}"]`, 400);
      await yaz(zihinYaz(id), alt, 38);
      await bekle(240);
    }

    await bekle(1100);
  },
};

// --- Karşılama ekranı ------------------------------------------------------

/**
 * Klip çekmek için değil, ölçmek için: giriş ekranı yalnızca oturum açmış
 * kullanıcıya görünüyor, o yüzden yerleşimi (ekrana sığıyor mu, kaydırma
 * gerekiyor mu) yerelde başka türlü kontrol edilemiyor.
 */
const karsilama: Sahne = {
  ad: 'karsilama',
  arac: 'karsilama',
  kur: () => {
    const d = depo();
    // Birkaç çalışma: "Kaldığın Yer" şeridi ve "son kullandıkların" ancak
    // çalışma varken çiziliyor, ekranın en uzun hâli bu.
    d.addWbsTree('Kahve Dükkanı Şubesi', 'Yeni Kahve Dükkanı Şubesi Açılışı');
    d.addFiveWhysAnalysis('Sabah kuyruğu', 'Sabah saatlerinde kuyruk çok uzun');
    d.addMindmap('Açılış Kampanyası', 'Açılış Kampanyası');
    d.addSwot('Yeni Şube');

    // "Kaldığın Yer" şeridi klasörün toolData'sını okuyor; gerçek uygulamada
    // oraya SyncManager yazıyor, burada elle kuruluyor. Yoksa ekranın en uzun
    // hâli ölçülemiyor.
    const s = depo();
    useRoadmapStore.setState({
      projects: [
        {
          id: 'demo',
          name: 'Kahve Dükkanı',
          toolData: {
            wbsTrees: s.wbsTrees,
            fiveWhysAnalyses: s.fiveWhysAnalyses,
            mindmaps: s.mindmaps,
            swot: s.swot,
          },
          updatedAt: Date.now(),
        } as never,
      ],
    });
  },
  oyna: async () => {
    await bekle(600);
  },
};

export const SAHNELER: Sahne[] = [isKirilimi, besNeden, pareto, zihinHarita, karsilama];

export const sahneBul = (ad: string) => SAHNELER.find((s) => s.ad === ad);

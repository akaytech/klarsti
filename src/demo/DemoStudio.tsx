import { useEffect, useRef, useState } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import i18n from '../i18n';
import { setTheme } from '../theme';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { sigdirKaydet } from './demoAltyapi';
import DemoImlec from './DemoImlec';
import { sahneBul } from './demoSahneleri';

import WbsCanvas from '../components/WbsCanvas';
import FiveWhysCanvas from '../components/FiveWhysCanvas';
import ParetoCanvas from '../components/ParetoCanvas';
import MindmapCanvas from '../components/MindmapCanvas';
import WelcomeScreen from '../components/WelcomeScreen';

/**
 * Tanıtım kliplerinin çekildiği ekran: /demo-cekim/<sahne>?tema=acik
 *
 * Yalnızca geliştirme kipinde açılıyor (bkz. App.tsx). Uygulamanın gerçek
 * tuvalini çiziyor; üst bar, sol menü ve araç başlığı yok ki klipte yalnızca
 * işin kendisi görünsün.
 *
 * `scripts/klipCek.mjs` şu sırayı bekliyor:
 *   window.__demoHazir === true  →  window.__demoBaslat()  →  söz çözülünce bitti.
 */

const TUVALLER = {
  wbs: () => <WbsCanvas onNodeSelect={() => {}} />,
  '5whys': FiveWhysCanvas,
  pareto: ParetoCanvas,
  mindmap: MindmapCanvas,
  // Tuval değil: giriş ekranının kendisi. Oturum açmadan görünmediği için
  // yerleşimini yerelde ancak buradan ölçebiliyoruz.
  karsilama: WelcomeScreen,
} as const;

declare global {
  interface Window {
    __demoHazir?: boolean;
    __demoBaslat?: () => Promise<void>;
  }
}

/** React Flow örneğini sahnelerin kullanabileceği yere bırakır. */
function SigdirKopru() {
  const rf = useReactFlow();
  useEffect(() => {
    sigdirKaydet(() => rf.fitView({ duration: 400, padding: 0.22, maxZoom: 1.2 }));
    return () => sigdirKaydet(null);
  }, [rf]);
  return null;
}

export default function DemoStudio({ ad }: { ad: string }) {
  const [hazir, setHazir] = useState(false);
  const kuruldu = useRef(false);
  const sahne = sahneBul(ad);

  useEffect(() => {
    if (!sahne || kuruldu.current) return;
    kuruldu.current = true;

    const parametre = new URLSearchParams(window.location.search);
    setTheme(parametre.get('tema') === 'koyu' ? 'deep-night' : 'light');
    const dil = parametre.get('dil') || 'tr';

    const kur = () => {
      // Depo boş bir projeyle başlatılıyor: tuvaller açık bir proje bekliyor,
      // ama hiçbir yere kaydedilmiyor — SyncManager bu ekranda yok.
      useRoadmapStore.setState({
        projects: [{ id: 'demo', name: 'Demo', ownerId: 'demo', toolData: {} } as never],
        currentProjectId: 'demo',
        projectsLoaded: true,
        // Karşılama ekranı "hiçbir araç açık değil" hâli; onun sahnesinde
        // activeTool boş kalıyor.
        activeTool: sahne.arac === 'karsilama' ? null : sahne.arac,
        wbsTrees: [],
        activeWbsTreeId: null,
        fiveWhysAnalyses: [],
        activeFiveWhysId: null,
        pareto: [],
        mindmaps: [],
        activeMindmapId: null,
      });
      sahne.kur();
      setHazir(true);
      // Tuvalin ilk çizimi ve ekrana sığdırması bitsin.
      setTimeout(() => {
        window.__demoHazir = true;
      }, 900);
    };

    if (i18n.language === dil) kur();
    else i18n.changeLanguage(dil).then(kur);

    window.__demoBaslat = () => sahne.oyna();
  }, [sahne]);

  if (!sahne) {
    return <div className="p-10 font-mono text-sm">Sahne yok: {ad}</div>;
  }

  const Tuval = TUVALLER[sahne.arac];

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
        <SigdirKopru />
        {hazir && <Tuval />}
        <DemoImlec />
      </div>
    </ReactFlowProvider>
  );
}

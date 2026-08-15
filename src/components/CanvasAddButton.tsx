import { Panel } from '@xyflow/react';
import { Plus } from 'lucide-react';

/**
 * Tuvalin altındaki "kutu ekle" düğmesi.
 *
 * Neden var: kutu eklemenin tek yolu Ctrl+tık ve sağ tıktı. İkisi de ekranda
 * hiçbir iz bırakmıyor; kılavuzu açmayan kullanıcı boş tuvale bakıp kalıyordu.
 * Kısayollar duruyor, bu düğme onların görünen karşılığı.
 *
 * Yeri bilerek alt orta: sağ altta küçük harita, sol altta React Flow'un kendi
 * yakınlaştırma kutusu, üstte araç menüleri var. Alt orta bütün araçlarda boş
 * ve dokunmatik ekranda başparmağın düştüğü yer.
 */
export default function CanvasAddButton({
  etiket,
  ipucu,
  pasif = false,
  onClick,
}: {
  etiket: string;
  ipucu?: string;
  pasif?: boolean;
  /** Düğmenin ekrandaki yeri de veriliyor: menü açan araçlar menüyü oraya koyuyor. */
  onClick: (yer: { x: number; y: number }) => void;
}) {
  return (
    // React Flow'un kendi .react-flow__panel kuralı margin: 15px veriyor ve
    // Tailwind'in mb-* sınıfını eziyor; satır içi stil ikisini de geçer.
    <Panel position="bottom-center" style={{ marginBottom: 22 }}>
      <button
        type="button"
        disabled={pasif}
        title={ipucu}
        aria-label={ipucu ? `${etiket} — ${ipucu}` : etiket}
        onClick={(e) => {
          const kutu = e.currentTarget.getBoundingClientRect();
          onClick({ x: kutu.left + kutu.width / 2, y: kutu.top });
        }}
        className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 motion-reduce:hover:translate-y-0 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0 dark:disabled:bg-slate-600"
      >
        <Plus size={18} />
        <span>{etiket}</span>
      </button>
    </Panel>
  );
}

import { Controls } from '@xyflow/react';

/**
 * Tuvalin yakınlaştırma kutusu: yaklaş, uzaklaş, ekrana sığdır.
 *
 * Neden ortak bir bileşen: bu kutu yalnızca değer akışı ve şema tuvallerinde
 * vardı, iş kırılımı / 5 neden / hata ağacı / zihin haritasında hiç yoktu.
 * Aynı üründe iki farklı davranış oluyordu ve düğmesi olmayan araçlarda
 * kullanıcının görüntüyü toparlamak için tek yolu fare tekerleğiydi.
 *
 * Kilit düğmesi kapalı: React Flow'un "etkileşimi kilitle" düğmesi uygulamanın
 * hiçbir yerinde karşılığı olmayan bir kavram, basan kullanıcı tuvalin neden
 * donduğunu anlamıyordu.
 */
export default function CanvasControls() {
  return (
    <Controls
      showInteractive={false}
      className="!shadow-xl [&>button]:!border-slate-200 [&>button]:!bg-white [&>button]:!fill-slate-600 hover:[&>button]:!bg-slate-100 dark:[&>button]:!border-slate-700 dark:[&>button]:!bg-slate-800 dark:[&>button]:!fill-slate-300 dark:hover:[&>button]:!bg-slate-700"
    />
  );
}

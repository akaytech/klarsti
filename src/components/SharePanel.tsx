import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Check, Copy, Loader2, ShieldOff, UserMinus, Users, X } from 'lucide-react';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useAuthStore } from '../store/useAuthStore';
import { MenuPortal } from '../utils/MenuPortal';

// Paylaşım penceresi. Eskiden "Paylaş" düğmesi tek tıkla projeyi kalıcı olarak
// herkese açıyor ve linki panoya kopyalıyordu; geri almanın ya da katılanları
// görmenin hiçbir yolu yoktu. Artık paylaşımın durumu burada görünüyor,
// kapatılabiliyor ve katılanlar tek tek çıkarılabiliyor.

interface Props {
  onClose: () => void;
  /**
   * Hangi projenin paylaşımı. Verilmezse açık olan proje. "Çalışmalarım"
   * menüsündeki paylaş düğmesi, açık olmayan bir projeyi de paylaşabilmek
   * için burayı dolduruyor.
   */
  projectId?: string;
}

export default function SharePanel({ onClose, projectId: istenenProje }: Props) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const acikProjeId = useRoadmapStore((s) => s.currentProjectId);
  const activeTool = useRoadmapStore((s) => s.activeTool);
  const projects = useRoadmapStore((s) => s.projects);
  const setProjectPublic = useRoadmapStore((s) => s.setProjectPublic);
  const removeProjectMember = useRoadmapStore((s) => s.removeProjectMember);

  const currentProjectId = istenenProje ?? acikProjeId;
  const project = projects.find((p) => p.id === currentProjectId);
  const isOwner = Boolean(project && user && project.userId === user.uid);
  const isPublic = Boolean(project?.isPublic);

  const [isBusy, setIsBusy] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // Çıkarılmak üzere onay bekleyen kişi. Onay satırın içinde soruluyor:
  // pencerenin üstüne ikinci bir pencere açmak hem katmanları karıştırıyor
  // hem de listedeki hangi kişiden bahsedildiğini gizliyor.
  const [onayBekleyen, setOnayBekleyen] = useState<string | null>(null);
  const kapatDugmesi = useRef<HTMLButtonElement>(null);

  const url = useMemo(() => {
    if (!currentProjectId) return '';
    const taban = import.meta.env.BASE_URL.replace(/\/$/, '');
    // Açık projeyi paylaşırken link açık aracı da taşıyor: karşı taraf senin
    // baktığın yere düşsün. Menüden başka bir proje paylaşılıyorsa öyle bir
    // "şu an bakılan araç" yok, link projenin köküne gider.
    const aracEki = currentProjectId === acikProjeId && activeTool ? `/${activeTool}` : '';
    return `${window.location.origin}${taban}/project/${currentProjectId}${aracEki}`;
  }, [currentProjectId, acikProjeId, activeTool]);

  // Sahip listede yer almaz; katılanlar erişim listesinden okunuyor.
  // Bu değişiklikten önce katılmış olanların adı kayıtlı değil: onlar da
  // listede görünmeli, yoksa sahibi çıkaramaz.
  const katilanlar = useMemo(() => {
    const uidler = project?.sharedWith ?? [];
    return uidler
      .filter((uid) => uid !== project?.userId)
      .map((uid) => ({ uid, bilgi: project?.members?.[uid] }));
  }, [project?.sharedWith, project?.members, project?.userId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    const timer = setTimeout(() => kapatDugmesi.current?.focus(), 10);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timer);
    };
  }, [onClose]);

  const kopyala = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Pano izni yoksa link zaten ekranda duruyor; kullanıcı elle seçebilsin.
      toast.error(t('share_copy_failed', { defaultValue: 'Could not copy, select the link manually' }));
    }
  }, [url, t]);

  const paylasimiBaslat = async () => {
    if (!currentProjectId) return;
    setIsBusy(true);
    // Kopyalama yalnızca paylaşım gerçekten açıldıysa yapılır: eskiden yazma
    // hata verse bile link kopyalanıyor ve "Kopyalandı" yazıyordu, kullanıcı
    // çalışmayan bir linki karşı tarafa gönderiyordu.
    const ok = await setProjectPublic(currentProjectId, true);
    if (ok) await kopyala();
    setIsBusy(false);
  };

  const paylasimiDurdur = async () => {
    if (!currentProjectId) return;
    setIsBusy(true);
    const ok = await setProjectPublic(currentProjectId, false);
    if (ok) toast.success(t('share_stopped', { defaultValue: 'Sharing stopped' }));
    setIsBusy(false);
  };

  const cikar = async (uid: string) => {
    if (!currentProjectId) return;
    setIsBusy(true);
    const ok = await removeProjectMember(currentProjectId, uid);
    if (ok) toast.success(t('share_member_removed', { defaultValue: 'Removed from the project' }));
    setOnayBekleyen(null);
    setIsBusy(false);
  };

  if (!project) return null;

  // Portal şart: düğmeyi taşıyan küme, kılavuz paneli açıkken transform
  // alıyor. Transform'lu bir ata, içindeki position:fixed öğenin referansını
  // değiştirir; pencere ekranın ortası yerine 400px sola kayardı.
  return (
    <MenuPortal>
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-panel-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 id="share-panel-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t('share_panel_title', { defaultValue: 'Share' })}
          </h2>
          <button
            ref={kapatDugmesi}
            onClick={onClose}
            aria-label={t('close_modal')}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {isPublic
              ? t('share_status_on', { defaultValue: 'Anyone with the link can open and edit this project.' })
              : t('share_status_off', { defaultValue: 'This project is not shared right now.' })}
          </p>

          {isPublic ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label={t('share_link_label', { defaultValue: 'Share link' })}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />
                <button
                  onClick={kopyala}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="hidden sm:inline">{isCopied ? t('copied') : t('copy_link', { defaultValue: 'Copy' })}</span>
                </button>
              </div>

              {isOwner && (
                <button
                  onClick={paylasimiDurdur}
                  disabled={isBusy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  {isBusy ? <Loader2 size={16} className="animate-spin" /> : <ShieldOff size={16} />}
                  {t('share_stop', { defaultValue: 'Stop sharing' })}
                </button>
              )}
            </>
          ) : (
            isOwner && (
              <button
                onClick={paylasimiBaslat}
                disabled={isBusy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
                {t('share_start', { defaultValue: 'Share and copy the link' })}
              </button>
            )
          )}

          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Users size={16} className="text-slate-400" />
              {t('share_members_title', { defaultValue: 'People in this project' })}
              <span className="text-slate-400">({katilanlar.length})</span>
            </div>

            {katilanlar.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('share_members_empty', { defaultValue: 'No one has joined yet.' })}
              </p>
            ) : (
              <ul className="-mx-1 max-h-52 space-y-1 overflow-y-auto">
                {katilanlar.map(({ uid, bilgi }) => (
                  <li
                    key={uid}
                    className="flex items-center gap-2 rounded-xl px-1 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {bilgi?.name || bilgi?.email || t('share_member_unknown', { defaultValue: 'Unnamed user' })}
                      </div>
                      {bilgi?.email && bilgi.name ? (
                        <div className="truncate text-xs text-slate-400">{bilgi.email}</div>
                      ) : null}
                    </div>

                    {isOwner &&
                      (onayBekleyen === uid ? (
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => cikar(uid)}
                            disabled={isBusy}
                            className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                          >
                            {t('share_remove_confirm', { defaultValue: 'Remove' })}
                          </button>
                          <button
                            onClick={() => setOnayBekleyen(null)}
                            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            {t('cancel_btn')}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOnayBekleyen(uid)}
                          aria-label={t('share_remove_member', { defaultValue: 'Remove from project' })}
                          title={t('share_remove_member', { defaultValue: 'Remove from project' })}
                          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <UserMinus size={16} />
                        </button>
                      ))}
                  </li>
                ))}
              </ul>
            )}

            {/* Paylaşımı kapatmak, halihazırda katılmış olanları dışarı atmıyor.
                Sahip bunu bilmezse projeyi kapattığını sanıp içeride birini
                bırakabilir. */}
            {isOwner && katilanlar.length > 0 && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {t('share_members_hint', {
                  defaultValue: 'Stopping the link does not remove people who already joined. Remove them one by one.'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </MenuPortal>
  );
}

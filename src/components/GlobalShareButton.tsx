import React, { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '../store/useUIStore';
import { Link } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRoadmapStore } from '../store/useRoadmapStore';
import SharePanel from './SharePanel';
import { denemeKipindeMi } from '../utils/denemeKipi';

// Düğme artık tek tıkla paylaşmıyor, paylaşım penceresini açıyor. Eskiden bir
// tık projeyi kalıcı olarak herkese açıyordu ve geri alma yolu yoktu; kararı
// pencerede görünür hale getirmek bunun önüne geçiyor (bkz. SharePanel).
const GlobalShareButton: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const setTriggerShare = useUIStore(s => s.setTriggerShare);
  const currentProjectId = useRoadmapStore(s => s.currentProjectId);
  const activeTool = useRoadmapStore(s => s.activeTool);
  const isPublic = useRoadmapStore(s => s.projects.find(p => p.id === s.currentProjectId)?.isPublic);

  const handleShare = useCallback(() => {
    if (!currentProjectId || !activeTool) return;
    setIsOpen(true);
  }, [currentProjectId, activeTool]);

  // Dar ekrandaki üç nokta menüsü de aynı pencereyi açar.
  useEffect(() => {
    setTriggerShare(handleShare);
    return () => setTriggerShare(() => {});
  }, [handleShare, setTriggerShare]);

  // Ajanda kişiseldir, paylaşılmaz.
  if (!currentProjectId || !activeTool || activeTool === 'notepad') return null;
  // Hesapsız denemede paylaşım yok: paylaşılan çalışma bir hesaba ait olmak
  // zorunda. Düğmeyi pasif göstermek yerine hiç göstermiyoruz.
  if (denemeKipindeMi()) return null;

  return (
    <>
      <button
        onClick={handleShare}
        className="hidden sm:flex items-center gap-2 bg-indigo-50/90 dark:bg-indigo-900/40 backdrop-blur-md px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 shadow-sm transition-colors text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium text-sm"
        title={t('share')} aria-label={t('share')}
      >
        <Link size={18} />
        <span className="hidden sm:inline">{t('share')}</span>
        {/* Paylaşımın açık olduğu düğmeden de belli olsun: pencereyi açmadan
            "bu proje şu an paylaşımda mı" sorusunun cevabı görünmüyordu. */}
        {isPublic && (
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-500"
          />
        )}
      </button>

      {isOpen && <SharePanel onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default GlobalShareButton;

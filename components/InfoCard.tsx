import React, { useState, useEffect, useCallback } from 'react';
import { HistoricalEvent, EventDetails } from '../types';
import { CloseIcon, WikipediaIcon, BaiduBaikeIcon, WebSearchIcon, SparklesIcon } from './icons';
import { fetchEventDetails } from '../services/gemini';
import { useAppContext } from '../AppContext';
import { useTranslation } from '../translation';
import Chat from '../Chat';

interface InfoCardProps {
  event: HistoricalEvent;
  onClose: () => void;
  onEdit: (event: HistoricalEvent) => void;
}

const AIGeneratedContent: React.FC<{ event: HistoricalEvent, styles: any }> = ({ event, styles }) => {
    const { settings, language, activeAIProvider } = useAppContext();
    const { t } = useTranslation();
    const [data, setData] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [abortController, setAbortController] = useState(new AbortController());

    const getDetails = useCallback(async (signal: AbortSignal) => {
        if (!activeAIProvider || !activeAIProvider.apiKey) {
          setError(t('errorSetAPIKey'));
          setLoading(false);
          return;
        }
        setLoading(true);
        setData(null);
        setError(null);
        setImageError(false);
        try {
          const eventTitle = language === 'zh' ? event.title_zh : event.title;
          const result = await fetchEventDetails(eventTitle, language, activeAIProvider, signal);
          if (!signal.aborted) {
            setData(result);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError(t('errorFetchDetails'));
            console.error(err);
          }
        } finally {
          if (!signal.aborted) {
            setLoading(false);
          }
        }
    }, [event, language, activeAIProvider, t]);

    useEffect(() => {
        const controller = new AbortController();
        setAbortController(controller);
        getDetails(controller.signal);

        return () => {
          controller.abort();
        }
    }, [getDetails]);

    const handleRetry = () => {
      abortController.abort();
      const newController = new AbortController();
      setAbortController(newController);
      getDetails(newController.signal);
    }
    
    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-48 bg-white/10 rounded-lg mb-6"></div>
            <div className="h-6 w-full bg-white/10 rounded mb-3"></div>
            <div className="h-6 w-full bg-white/10 rounded mb-3"></div>
            <div className="h-6 w-2/3 bg-white/10 rounded mb-6"></div>
        </div>
    );
    
    if (loading) return <SkeletonLoader />;
    if (error) return (
      <div className="px-6 pb-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
            onClick={handleRetry}
            className={`mt-2 px-4 py-2 rounded-lg text-sm transition-colors ${settings.theme === 'Starmap' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200' : 'bg-amber-800/20 hover:bg-amber-800/30 text-amber-900'}`}
        >
            {t('retry')}
        </button>
      </div>
    );
    if (!data) return null;

    const title = language === 'zh' ? event.title_zh : event.title;
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(data.image_query)}`;
    
    return (
        <>
            <div className="relative h-56 overflow-hidden bg-gray-800/50 flex items-center justify-center">
                {!imageError ? (
                    <img 
                      src={imageUrl} 
                      alt={`Artistic representation for ${title}`} 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="text-gray-400 text-sm">{t('errorImageLoad')}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="p-6">
                <p className="text-lg leading-relaxed">{data.summary}</p>
            </div>
            {data.sources && data.sources.length > 0 && (
              <div className="px-6 pb-6">
                <h4 className="font-bold text-sm opacity-80 mb-2 flex items-center gap-1.5"><WebSearchIcon className="w-4 h-4" />{t('sources')}</h4>
                <ul className="space-y-1 text-sm">
                  {data.sources.map((source, index) => (
                    <li key={index} className="truncate">
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className={`transition-colors ${styles.link}`}>
                        {source.title || source.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </>
    );
}

const InfoCard: React.FC<InfoCardProps> = ({ event, onClose }) => {
  const { settings, language } = useAppContext();
  const { t } = useTranslation();
      
  const styles = settings.theme === 'Starmap' 
    ? {
        card: 'bg-gray-900/60 border-cyan-400/50 text-gray-200 backdrop-blur-lg shadow-[0_0_20px_rgba(0,255,255,0.3)]',
        tag: 'bg-cyan-500/20 text-cyan-200',
        link: 'text-cyan-400 hover:text-white',
        closeButton: 'text-white/80 hover:text-white hover:bg-black/30',
        divider: 'border-white/10'
      }
    : {
        card: 'bg-[#fdf6e3]/80 border-amber-800/50 text-amber-950 backdrop-blur-lg shadow-2xl',
        tag: 'bg-amber-800/20 text-amber-900',
        link: 'text-amber-800 hover:text-black',
        closeButton: 'text-amber-950/80 hover:text-black hover:bg-black/10',
        divider: 'border-amber-800/20'
      };
      
  const title = language === 'zh' ? event.title_zh : event.title;
  const wikipediaTitle = language === 'zh' ? event.title_zh : event.title;
  const wikipediaUrl = `https://${language}.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle)}`;
  const baiduBaikeUrl = `https://baike.baidu.com/item/${encodeURIComponent(event.title_zh)}`;
  const webSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}`;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 font-ui-en"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-card-title"
    >
        <div 
            className={`relative max-w-2xl w-full max-h-[90vh] flex flex-col border rounded-xl overflow-hidden transition-all duration-300 animate-fade-in ${styles.card} ${language === 'zh' ? 'font-ui-zh' : 'font-ui-en'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                onClick={onClose}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-50 ${styles.closeButton}`}
                aria-label={t('close')}
            >
                <CloseIcon />
            </button>
            <div className='overflow-y-auto'>
                {/* --- Static Content (Visible Immediately) --- */}
                <div className="p-6">
                    <h2 id="info-card-title" className="text-3xl font-bold mb-2 pr-10">
                        {title}
                    </h2>
                    <p className="text-base opacity-80 mb-6">
                        {t('year')}: {Math.abs(event.year)} {event.year < 0 ? t('bce') : t('ce')}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {event.tags.map(tag => (
                            <span key={tag} className={`px-3 py-1 text-sm rounded-full ${styles.tag}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className={`flex items-center gap-4 text-sm font-bold border-b ${styles.divider} pb-6 mb-6`}>
                        <a href={wikipediaUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${styles.link}`}><WikipediaIcon/> Wikipedia</a>
                        <a href={baiduBaikeUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${styles.link}`}><BaiduBaikeIcon/> {t('baiduBaike')}</a>
                        <a href={webSearchUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${styles.link}`}><WebSearchIcon/> {t('webSearch')}</a>
                    </div>
                </div>

                {/* --- AI Content (Loads Separately) --- */}
                 <div className="border-b border-transparent">
                  <h3 className="px-6 mb-1 text-lg font-bold flex items-center gap-2"><SparklesIcon className="w-5 h-5 opacity-80" /> {t('aiSummary')}</h3>
                  <AIGeneratedContent event={event} styles={styles} />
                </div>


                {/* --- Chat --- */}
                <div className="p-6">
                   <Chat event={event} />
                </div>
            </div>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
            .overflow-y-auto::-webkit-scrollbar { width: 8px; }
            .theme-starmap .overflow-y-auto::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            .theme-starmap .overflow-y-auto::-webkit-scrollbar-thumb { background-color: rgba(0, 255, 255, 0.4); border-radius: 4px; }
            .theme-scroll .overflow-y-auto::-webkit-scrollbar-track { background: rgba(161, 136, 127, 0.2); }
            .theme-scroll .overflow-y-auto::-webkit-scrollbar-thumb { background-color: rgba(93, 64, 55, 0.5); border-radius: 4px; }
        `}</style>
    </div>
  );
};

export default InfoCard;
import React, { useState, useEffect } from 'react';
import { HistoricalEvent, EventDetails } from '../types';
import { useAppContext } from '../AppContext';
import { useTranslation } from '../translation';

interface EventNodeProps {
  event: HistoricalEvent;
  position: number;
  onClick: (event: HistoricalEvent) => void;
  zoomLevel: number;
}

const EventNode: React.FC<EventNodeProps> = ({ event, position, onClick, zoomLevel }) => {
  const { settings, language, fetchAndCacheEventDetails } = useAppContext();
  const { t } = useTranslation();
  const [details, setDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isChinaTrack = event.track === 'China';
  const title = language === 'zh' ? event.title_zh : event.title;

  const ZOOM_THRESHOLD_FOR_IMAGE = 6; // Show images on 'Modern Era' and 'Contemporary'
  const shouldShowImage = zoomLevel >= ZOOM_THRESHOLD_FOR_IMAGE;

  useEffect(() => {
    const controller = new AbortController();
    if (shouldShowImage && !details && !isLoading) {
      setIsLoading(true);
      setImageError(false);
      fetchAndCacheEventDetails(event, controller.signal)
        .then(data => {
          if (data && !controller.signal.aborted) {
            setDetails(data);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Failed to load event image details for node", err);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }
    return () => controller.abort();
  }, [shouldShowImage, event, details, isLoading, fetchAndCacheEventDetails]);

  const imageUrl = details?.image_query && !imageError ? `https://source.unsplash.com/128x128/?${encodeURIComponent(details.image_query)}` : null;

  const starmapStyles = {
    line: 'bg-cyan-400/30 group-hover:bg-cyan-400/60',
    text: 'text-cyan-200/80 group-hover:text-white',
    pin: 'bg-cyan-400',
    pinShadow: 'shadow-[0_0_8px_rgba(0,255,255,0.6)] group-hover:shadow-[0_0_12px_rgba(255,255,255,1)]',
    spinner: 'border-cyan-400/80',
    imageBg: 'bg-gray-800/50'
  };
  
  const scrollStyles = {
    line: 'bg-amber-800/40 group-hover:bg-amber-800/70',
    text: 'text-amber-900/80 group-hover:text-black',
    pin: 'bg-amber-800',
    pinShadow: 'shadow-sm',
    spinner: 'border-amber-800/80',
    imageBg: 'bg-amber-200/50'
  };

  const themeStyles = settings.theme === 'Starmap' ? starmapStyles : scrollStyles;
  
  const getPin = () => {
    const basePinClasses = 'rounded-full transition-all duration-300';
    switch(settings.pinStyle) {
      case 'glow':
        return <div className={`${basePinClasses} w-3 h-3 ${themeStyles.pin} ${themeStyles.pinShadow}`}></div>;
      case 'ring':
        return <div className={`${basePinClasses} w-3.5 h-3.5 border-2 ${settings.theme === 'Starmap' ? 'border-cyan-400' : 'border-amber-800'}`}></div>;
      case 'pin':
      default:
        return <div className={`${basePinClasses} w-2.5 h-2.5 ${themeStyles.pin} group-hover:scale-150`}></div>;
    }
  };

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group flex items-center justify-center z-10"
      style={{ left: `${position}px`, width: '1px' }} // Give it a minimal width
      onClick={() => onClick(event)}
      role="button"
      aria-label={title}
    >
      {/* Container for Line and Text, positioned above or below the center point */}
      <div className={`absolute w-max flex items-center transition-transform duration-300 ease-out group-hover:scale-110 ${
          isChinaTrack 
          ? 'bottom-0 mb-3 flex-col-reverse group-hover:-translate-y-1' 
          : 'top-0 mt-3 flex-col group-hover:translate-y-1'
        }`}>
        
        {shouldShowImage && (
            <div className={`relative w-16 h-16 mb-2 rounded-md overflow-hidden flex items-center justify-center transition-all duration-300 ${themeStyles.imageBg}`}>
                {isLoading && <div className={`w-6 h-6 border-2 border-dashed rounded-full animate-spin ${themeStyles.spinner}`}></div>}
                {!isLoading && imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={() => setImageError(true)} />}
                {!isLoading && !imageUrl && <div className="text-xs opacity-50 text-center p-1">{t('errorImageLoad')}</div>}
            </div>
        )}

        <p className={`px-1.5 py-0.5 text-xs rounded-sm whitespace-nowrap transition-colors duration-300 ${themeStyles.text} ${settings.theme === 'Starmap' ? 'bg-gray-900/50' : 'bg-white/50'}`}>
          {title}
        </p>
        <div className={`w-0.5 h-10 ${themeStyles.line} transition-colors duration-300`}></div>
      </div>
      
      {/* The pin itself, always at the center of the component */}
      {getPin()}
    </div>
  );
};

export default EventNode;
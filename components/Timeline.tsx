import React, { useState, useMemo, useEffect } from 'react';
import { HistoricalEvent } from '../types';
import useTimeline from '../hooks/useTimeline';
import EventNode from './EventNode';
import InfoCard from './InfoCard';
import { useAppContext } from '../AppContext';
import { useTranslation } from '../translation';

interface TimelineProps {
  targetEvent: HistoricalEvent | null;
  onCenterYearChange: (year: number) => void;
  onEventSelect: (event: HistoricalEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ targetEvent, onCenterYearChange }) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const { settings, allEvents, language } = useAppContext();
  const { t } = useTranslation();
  
  const {
    timelineRef,
    scale,
    zoomLevel,
    yearToPx,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    visibleYearRange,
    setTimelineView
  } = useTimeline(1900, 6, onCenterYearChange);

  useEffect(() => {
    if (targetEvent) {
      setTimelineView({ year: targetEvent.year, zoom: 6 });
      setSelectedEvent(targetEvent);
    }
  }, [targetEvent, setTimelineView]);
  
  const handleNodeClick = (event: HistoricalEvent) => {
    setSelectedEvent(event);
  };
  
  const handleCloseInfoCard = () => {
    setSelectedEvent(null);
  }

  const visibleEvents = useMemo(() => {
    const buffer = (visibleYearRange.end - visibleYearRange.start) / 4;
    return allEvents.filter(event => event.year >= visibleYearRange.start - buffer && event.year <= visibleYearRange.end + buffer);
  }, [visibleYearRange, allEvents]);

  const styleConfig = useMemo(() => {
    const isStarmap = settings.theme === 'Starmap';
    return {
      chinaTrack: isStarmap ? 'border-b-[1px] border-cyan-500/30' : 'border-b-[1px] border-[#a1887f]/50',
      worldTrack: '',
      centerLine: isStarmap ? 'bg-cyan-400' : 'bg-[#5d4037]',
      centerLineShadow: isStarmap ? 'shadow-[0_0_8px_rgba(0,255,255,0.7)]' : '',
      centerLineDotted: 'bg-repeat-x bg-center',
      markerLine: isStarmap ? 'bg-cyan-500/50' : 'bg-[#a1887f]/70',
      markerText: isStarmap ? 'text-cyan-400/60' : 'text-amber-950/60',
      trackLabel: isStarmap ? 'text-cyan-400/30' : 'text-amber-950/30',
    };
  }, [settings.theme]);

  const getYearMarkers = () => {
      const markers = [];
      const { start, end } = visibleYearRange;
      const range = end - start;

      let step = 1;
      if (range > 5000000) step = 1000000;
      else if (range > 1000000) step = 200000;
      else if (range > 200000) step = 50000;
      else if (range > 50000) step = 10000;
      else if (range > 10000) step = 2000;
      else if (range > 2000) step = 500;
      else if (range > 500) step = 100;
      else if (range > 100) step = 20;
      else if (range > 20) step = 5;
      
      const firstYear = Math.ceil(start / step) * step;

      for (let year = firstYear; year < end; year += step) {
          markers.push(year);
      }
      return markers;
  }
  
  const YearIndicator: React.FC<{ year: number }> = ({ year }) => {
    const absYear = Math.abs(year);
    const era = year < 0 ? t('bce') : t('ce');
    const displayYear = Math.round(absYear);
    return <>{`${displayYear.toLocaleString()} ${era}`}</>;
  };

  const yearMarkers = useMemo(getYearMarkers, [visibleYearRange, t]);

  return (
    <div className="relative w-full h-full flex flex-col select-none pt-24">
      <div className={`absolute top-28 left-4 z-10 p-2 rounded-lg transition-colors duration-300 ${settings.theme === 'Starmap' ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/5 backdrop-blur-sm'} hidden sm:block`}>
        <p className="text-xs opacity-80">{scale.name} Scale</p>
      </div>
      
      <div 
        ref={timelineRef}
        className="relative w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-full flex flex-col">
            <div className={`relative flex-1 ${styleConfig.chinaTrack}`}>
                <div className={`absolute top-4 right-4 text-2xl font-bold pointer-events-none ${styleConfig.trackLabel}`}>{t('china')}</div>
                {visibleEvents.filter(e => e.track === 'China').map(event => (
                    <EventNode key={event.id} event={event} position={yearToPx(event.year)} onClick={handleNodeClick} zoomLevel={zoomLevel} />
                ))}
            </div>

            <div className={`relative flex-1 ${styleConfig.worldTrack}`}>
                <div className={`absolute bottom-4 right-4 text-2xl font-bold pointer-events-none ${styleConfig.trackLabel}`}>{t('world')}</div>
                {visibleEvents.filter(e => e.track === 'World').map(event => (
                    <EventNode key={event.id} event={event} position={yearToPx(event.year)} onClick={handleNodeClick} zoomLevel={zoomLevel} />
                ))}
            </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div 
                className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 ${styleConfig.centerLine} ${styleConfig.centerLineShadow}`}
                style={ settings.timelineStyle === 'dotted' ? { 
                    backgroundImage: `radial-gradient(${styleConfig.centerLine} 50%, transparent 50%)`,
                    backgroundSize: '10px 2px',
                    backgroundColor: 'transparent'
                 } : {}}
            ></div>
            {yearMarkers.map(year => (
                <div key={year} className="absolute h-full top-0" style={{ left: `${yearToPx(year)}px`}}>
                    <div className={`absolute top-1/2 -translate-y-1/2 w-[1px] h-3 transition-colors duration-500 ${styleConfig.markerLine}`}></div>
                    <div className={`absolute top-1/2 translate-y-4 left-0 -translate-x-1/2 text-sm transition-colors duration-500 ${styleConfig.markerText}`}>
                      <YearIndicator year={year} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      {selectedEvent && (
        <InfoCard 
          event={selectedEvent} 
          onClose={handleCloseInfoCard}
          onEdit={() => {
            // Future feature: open settings to the event editor
          }}
        />
      )}
    </div>
  );
};

export default Timeline;
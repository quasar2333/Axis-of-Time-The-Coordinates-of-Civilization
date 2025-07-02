import { useState, useCallback, useRef, useEffect } from 'react';
import { SCALES } from '../constants';

const useTimeline = (initialYear: number, initialZoom: number, onCenterYearChange: (year: number) => void) => {
  const [centerYear, setCenterYear] = useState(initialYear);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const lastMouseX = useRef(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const scale = SCALES[zoomLevel];

  useEffect(() => {
    onCenterYearChange(centerYear);
  }, [centerYear, onCenterYearChange]);

  const yearToPx = useCallback((year: number) => {
    if (!timelineRef.current) return 0;
    const timelineWidth = timelineRef.current.offsetWidth;
    const pxPerYear = timelineWidth / scale.yearsPer1000Px * 1000;
    return (year - centerYear) * pxPerYear + timelineWidth / 2;
  }, [centerYear, scale]);

  const pxToYear = useCallback((px: number) => {
    if (!timelineRef.current) return 0;
    const timelineWidth = timelineRef.current.offsetWidth;
    const pxPerYear = timelineWidth / scale.yearsPer1000Px * 1000;
    return (px - timelineWidth / 2) / pxPerYear + centerYear;
  }, [centerYear, scale]);

  const setTimelineView = useCallback(({ year, zoom }: { year: number, zoom: number }) => {
    setCenterYear(year);
    setZoomLevel(zoom);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const cursorPx = e.clientX - (timelineRef.current?.getBoundingClientRect().left || 0);
    const yearAtCursor = pxToYear(cursorPx);

    const newZoomLevel = Math.max(0, Math.min(SCALES.length - 1, zoomLevel - Math.sign(e.deltaY)));
    setZoomLevel(newZoomLevel);
    
    // Zoom towards cursor
    const newScale = SCALES[newZoomLevel];
    const newPxPerYear = (timelineRef.current?.offsetWidth || 0) / newScale.yearsPer1000Px * 1000;
    const newCenterYear = yearAtCursor - ((cursorPx - (timelineRef.current?.offsetWidth || 0) / 2) / newPxPerYear);
    setCenterYear(newCenterYear);

  }, [zoomLevel, pxToYear]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    lastMouseX.current = e.clientX;
    if (timelineRef.current) {
        timelineRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !timelineRef.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    const timelineWidth = timelineRef.current.offsetWidth;
    const pxPerYear = timelineWidth / scale.yearsPer1000Px * 1000;
    setCenterYear(prev => prev - deltaX / pxPerYear);
  }, [isPanning, scale]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (timelineRef.current) {
        timelineRef.current.style.cursor = 'grab';
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
    if (timelineRef.current) {
        timelineRef.current.style.cursor = 'grab';
    }
  }, []);

  useEffect(() => {
    if(timelineRef.current) {
        timelineRef.current.style.cursor = 'grab';
    }
  }, []);


  const startYear = pxToYear(0);
  const endYear = pxToYear(timelineRef.current?.offsetWidth || 0);

  return {
    timelineRef,
    centerYear,
    scale,
    zoomLevel,
    yearToPx,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    visibleYearRange: { start: startYear, end: endYear },
    setTimelineView,
  };
};

export default useTimeline;
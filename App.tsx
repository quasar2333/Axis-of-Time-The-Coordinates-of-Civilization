import React, { useState, useEffect, useCallback } from 'react';
import Timeline from './components/Timeline';
import Search from './components/Search';
import Settings from './Settings';
import { HistoricalEvent } from './types';
import { useAppContext } from './AppContext';
import { useTranslation } from './translation';
import { SettingsIcon } from './components/icons';

const App: React.FC = () => {
  const { settings, language, allEvents } = useAppContext();
  const [targetEvent, setTargetEvent] = useState<HistoricalEvent | null>(null);
  const [centerYear, setCenterYear] = useState<number>(1900);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const root = document.querySelector('.theme-root');
    if (!root) return;

    // Apply theme classes
    const theme = settings.theme;
    if (theme === 'Starmap') {
      root.classList.remove('font-scroll', 'theme-scroll');
      root.classList.add('font-starmap', 'theme-starmap', 'dark');
    } else {
      root.classList.remove('font-starmap', 'theme-starmap', 'dark');
      root.classList.add('font-scroll', 'theme-scroll');
    }

    // Apply font/language class
    if (language === 'zh') {
      root.classList.remove('font-ui-en');
      root.classList.add('font-ui-zh');
    } else {
      root.classList.remove('font-ui-zh');
      root.classList.add('font-ui-en');
    }

  }, [settings.theme, language]);
  
  const handleEventSelect = useCallback((event: HistoricalEvent) => {
    setTargetEvent(event);
  }, []);

  const YearIndicator: React.FC<{ year: number }> = ({ year }) => {
    const absYear = Math.abs(year);
    const era = year < 0 ? t('bce') : t('ce');
    const displayYear = Math.round(absYear);
    return <>{`${displayYear.toLocaleString()} ${era}`}</>;
  };

  return (
    <div className={`w-screen h-screen overflow-hidden transition-colors duration-500 flex flex-col ${settings.backgroundStyle}`}>
      {/* Top Control Panel */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between gap-4 bg-transparent">
        <div className="flex-1 min-w-0">
          <Search allEvents={allEvents} onEventSelect={handleEventSelect} />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
           <div className={`hidden sm:block p-2 rounded-lg text-center transition-colors duration-300 ${settings.theme === 'Starmap' ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/5 backdrop-blur-sm'}`}>
            <h2 className="font-bold text-lg leading-tight"><YearIndicator year={centerYear} /></h2>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            aria-label={t('settings')}
            className={`p-2.5 rounded-full transition-colors duration-300 ${settings.theme === 'Starmap' ? 'text-white/80 bg-black/20 hover:bg-cyan-400/30 hover:text-white' : 'text-amber-950/80 bg-black/5 hover:bg-amber-800/20 hover:text-amber-950'}`}
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        <Timeline 
            targetEvent={targetEvent} 
            onCenterYearChange={setCenterYear}
            onEventSelect={handleEventSelect}
        />
      </main>

       <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs opacity-50 pointer-events-none transition-colors duration-300 ${settings.theme === 'Starmap' ? 'text-gray-300' : 'text-amber-950/70'}`}>
        <p>{t('usageHint')}</p>
      </div>
      
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;
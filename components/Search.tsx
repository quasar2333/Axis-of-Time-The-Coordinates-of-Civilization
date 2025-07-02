import React, { useState, useMemo } from 'react';
import { HistoricalEvent } from '../types';
import { SearchIcon, SparklesIcon } from './icons';
import { useAppContext } from '../AppContext';
import { useTranslation } from '../translation';
import { generateEventsFromPrompt } from '../services/gemini';

interface SearchProps {
  allEvents: HistoricalEvent[];
  onEventSelect: (event: HistoricalEvent) => void;
}

const Search: React.FC<SearchProps> = ({ allEvents, onEventSelect }) => {
  const { settings, language, addCustomEvent, activeAIProvider } = useAppContext();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (query.length < 1) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return allEvents
      .filter(event => {
        const title = language === 'zh' ? event.title_zh : event.title;
        return title.toLowerCase().includes(lowerCaseQuery) ||
          String(event.year).includes(lowerCaseQuery) ||
          event.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      })
      .slice(0, 7);
  }, [query, allEvents, language]);

  const handleSelect = (event: HistoricalEvent) => {
    setQuery('');
    onEventSelect(event);
    setIsActive(false);
  };

  const handleAiSearch = async () => {
    if (isAiSearching) return;
    if (!activeAIProvider?.apiKey) {
      setAiError(t('aiSearchNoKey'));
      return;
    }
    setIsAiSearching(true);
    setAiError(null);
    try {
      const newEvents = await generateEventsFromPrompt(query, language, activeAIProvider);
      newEvents.forEach(event => addCustomEvent(event, 'ai_search'));
      // Give feedback by clearing the search and letting new results appear
      setQuery(''); 
    } catch (err) {
      console.error(err);
      setAiError(t('errorGenerateEvents'));
    } finally {
      setIsAiSearching(false);
    }
  };

  const isStarmap = settings.theme === 'Starmap';
  const styles = {
    bg: isStarmap ? 'bg-gray-800/60 backdrop-blur-md' : 'bg-[#f4eade]/80 backdrop-blur-md',
    text: isStarmap ? 'text-gray-200' : 'text-amber-950',
    placeholder: isStarmap ? 'placeholder-gray-400' : 'placeholder-amber-900/50',
    ring: isStarmap ? 'focus:ring-cyan-400' : 'focus:ring-amber-800',
    resultsBg: isStarmap ? 'bg-gray-800/90' : 'bg-[#f4eade]/95',
    resultItemBg: isStarmap ? 'hover:bg-cyan-500/20' : 'hover:bg-amber-800/20',
    iconColor: isStarmap ? 'text-gray-400' : 'text-amber-900/60'
  };

  return (
    <div className={`relative w-full max-w-lg ${language === 'zh' ? 'font-ui-zh' : 'font-ui-en'}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAiError(null);
          }}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 200)}
          placeholder={t('searchPlaceholder')}
          className={`w-full h-11 pl-11 pr-4 py-2 border border-transparent rounded-lg text-base transition-all duration-300 ${styles.bg} ${styles.text} ${styles.placeholder} focus:outline-none focus:ring-2 ${styles.ring}`}
        />
      </div>
      {isActive && (query.length > 0 || aiError) && (
        <ul className={`absolute mt-2 w-full rounded-lg overflow-hidden shadow-lg border ${isStarmap ? 'border-cyan-400/20' : 'border-amber-800/20'} ${styles.resultsBg}`}>
          {filteredEvents.map(event => (
            <li
              key={event.id}
              onMouseDown={() => handleSelect(event)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${styles.resultItemBg}`}
            >
              <p className="font-bold">{language === 'zh' ? event.title_zh : event.title}</p>
              <p className="text-sm opacity-70">
                {Math.abs(event.year)} {event.year < 0 ? t('bce') : t('ce')}
              </p>
            </li>
          ))}
          {query.length > 2 && filteredEvents.length === 0 && (
            <>
              {isAiSearching ? (
                 <li className="px-4 py-3 text-center opacity-70 flex items-center justify-center gap-2">
                    <div className={`w-4 h-4 border-2 border-dashed rounded-full animate-spin ${isStarmap ? 'border-cyan-400' : 'border-amber-800'}`}></div>
                    {t('aiSearchLoading')}
                 </li>
              ) : (
                <li onMouseDown={handleAiSearch} className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${styles.resultItemBg}`}>
                  <div className="flex items-center gap-2 font-bold">
                    <SparklesIcon className={`w-5 h-5 ${isStarmap ? 'text-cyan-400' : 'text-amber-800'}`} />
                    <span>{t('aiSearch', {query})}</span>
                  </div>
                  <p className="text-sm opacity-70 mt-1 pl-7">{t('aiSearchDescription')}</p>
                </li>
              )}
            </>
          )}
           {aiError && <li className="px-4 py-2 text-red-500 text-xs text-center">{aiError}</li>}
        </ul>
      )}
    </div>
  );
};

export default Search;
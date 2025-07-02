import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Language, CustomStyleSettings, AIProvider, HistoricalEvent, EventDetails } from './types';
import { EVENTS } from './constants';
import { fetchEventDetails } from './services/gemini';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: CustomStyleSettings;
  updateSettings: (newSettings: Partial<CustomStyleSettings>) => void;
  aiProviders: AIProvider[];
  addAiProvider: (provider: Omit<AIProvider, 'id'>) => void;
  updateAiProvider: (provider: AIProvider) => void;
  deleteAiProvider: (id: string) => void;
  activeAIProviderId: string | null;
  setActiveAIProviderId: (id: string | null) => void;
  activeAIProvider: AIProvider | null;
  customEvents: HistoricalEvent[];
  addCustomEvent: (event: Omit<HistoricalEvent, 'id' | 'isCustom'>, source?: string) => void;
  updateCustomEvent: (event: HistoricalEvent) => void;
  deleteCustomEvent: (id: string) => void;
  allEvents: HistoricalEvent[];
  eventDetailsCache: React.MutableRefObject<Map<string, EventDetails>>;
  fetchAndCacheEventDetails: (event: HistoricalEvent, signal: AbortSignal) => Promise<EventDetails | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const DEFAULT_SETTINGS: CustomStyleSettings = {
  theme: 'Starmap',
  timelineStyle: 'line',
  pinStyle: 'pin',
  backgroundStyle: 'bg-gray-900',
};

const DEFAULT_AI_PROVIDER: AIProvider = {
    id: 'default-gemini',
    name: 'Google Gemini Flash',
    modelId: 'gemini-2.5-flash-preview-04-17',
    apiKey: '',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('axis-language', 'en');
  const [settings, setSettings] = useLocalStorage<CustomStyleSettings>('axis-settings', DEFAULT_SETTINGS);
  const [aiProviders, setAiProviders] = useLocalStorage<AIProvider[]>('axis-ai-providers', [DEFAULT_AI_PROVIDER]);
  const [activeAIProviderId, setActiveAIProviderId] = useLocalStorage<string | null>('axis-active-ai', 'default-gemini');
  const [customEvents, setCustomEvents] = useLocalStorage<HistoricalEvent[]>('axis-custom-events', []);

  const eventDetailsCache = useRef<Map<string, EventDetails>>(new Map());

  const activeAIProvider = useMemo(() => {
    return aiProviders.find(p => p.id === activeAIProviderId) || null;
  }, [aiProviders, activeAIProviderId]);

  const fetchAndCacheEventDetails = useCallback(async (event: HistoricalEvent, signal: AbortSignal): Promise<EventDetails | null> => {
    if (eventDetailsCache.current.has(event.id)) {
      return eventDetailsCache.current.get(event.id) as EventDetails;
    }

    if (!activeAIProvider || !activeAIProvider.apiKey) {
      console.warn("No active AI provider with API key.");
      return null;
    }

    try {
      const eventTitle = language === 'zh' ? event.title_zh : event.title;
      const details = await fetchEventDetails(eventTitle, language, activeAIProvider, signal);
      if (details && !signal.aborted) {
        eventDetailsCache.current.set(event.id, details);
      }
      return details;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(`Failed to fetch details for ${event.title}:`, err);
      }
      return null;
    }
  }, [activeAIProvider, language]);


  const updateSettings = (newSettings: Partial<CustomStyleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const addAiProvider = (provider: Omit<AIProvider, 'id'>) => {
    setAiProviders(prev => [...prev, { ...provider, id: uuidv4() }]);
  };

  const updateAiProvider = (updatedProvider: AIProvider) => {
    setAiProviders(prev => prev.map(p => p.id === updatedProvider.id ? updatedProvider : p));
  };
  
  const deleteAiProvider = (id: string) => {
    setAiProviders(prev => prev.filter(p => p.id !== id));
    if (activeAIProviderId === id) {
        setActiveAIProviderId(aiProviders[0]?.id || null);
    }
  };

  const addCustomEvent = (event: Omit<HistoricalEvent, 'id' | 'isCustom'>, source: string = 'manual') => {
     // Prevent adding duplicate events from AI search
    if (source === 'ai_search') {
      const exists = allEvents.some(e => e.title.toLowerCase() === event.title.toLowerCase());
      if (exists) return;
    }
    const newEvent = { ...event, id: uuidv4(), isCustom: true };
    setCustomEvents(prev => [...prev, newEvent]);
  }

  const updateCustomEvent = (updatedEvent: HistoricalEvent) => {
    setCustomEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteCustomEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  }
  
  const allEvents = useMemo(() => [...EVENTS, ...customEvents].sort((a,b) => a.year - b.year), [customEvents]);

  const value = {
    language, setLanguage,
    settings, updateSettings,
    aiProviders, addAiProvider, updateAiProvider, deleteAiProvider,
    activeAIProviderId, setActiveAIProviderId, activeAIProvider,
    customEvents, addCustomEvent, updateCustomEvent, deleteCustomEvent,
    allEvents,
    eventDetailsCache,
    fetchAndCacheEventDetails,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
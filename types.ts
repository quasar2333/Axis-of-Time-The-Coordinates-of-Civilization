export type Language = 'en' | 'zh';

export interface HistoricalEvent {
  id: string;
  year: number;
  track: 'China' | 'World';
  title: string; // English title
  title_zh: string; // Chinese title
  summary?: string; // AI generated
  tags: string[];
  isCustom?: boolean;
}

export enum Theme {
  Starmap = 'Starmap',
  Scroll = 'Ancient Scroll',
}

export type TimelineStyle = 'line' | 'dotted';
export type PinStyle = 'pin' | 'glow' | 'ring';
export type BackgroundStyle = 'bg-gray-900' | 'bg-[#0a0f1e]' | 'bg-[#fdf6e3]' | 'bg-[#f5f5f5]';

export interface CustomStyleSettings {
  theme: 'Starmap' | 'Scroll';
  timelineStyle: TimelineStyle;
  pinStyle: PinStyle;
  backgroundStyle: BackgroundStyle;
}

export interface TimelineScale {
  level: number;
  yearsPer1000Px: number;
  name: string;
  minYear: number;
  maxYear: number;
}

export interface AIProvider {
  id: string;
  name: string;
  modelId: string;
  apiKey: string;
  // baseUrl is for OpenAI compatible APIs, not used by GoogleGenAI
  baseUrl?: string; 
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

export interface EventDetails {
  summary: string;
  image_query: string;
  sources?: { uri: string; title: string; }[];
}
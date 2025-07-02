import { useAppContext } from './AppContext';
import { Language } from './types';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App UI
    searchPlaceholder: 'Search events, years, or tags...',
    usageHint: 'Use Mouse Wheel to Zoom, Click and Drag to Pan',
    china: 'China',
    world: 'World',
    bce: 'BCE',
    ce: 'CE',
    close: 'Close',
    settings: 'Settings',

    // InfoCard
    year: 'Year',
    baiduBaike: 'Baidu Baike',
    webSearch: 'Web Search',
    edit: 'Edit',
    aiSummary: 'AI Summary & Details',
    sources: 'Sources',
    interactiveAI: 'Interactive AI Chat',
    aiWelcome: 'Ask me anything about this event!',
    explain: 'Explain this to me',
    askAI: 'Ask AI a question',
    askFollowUp: 'Ask a follow-up question...',
    errorSetAPIKey: 'AI provider API key not set. Please set it in Settings.',
    errorFetchDetails: 'Could not fetch event details. The AI model may be unavailable or the API key is invalid.',
    errorChatResponse: 'Failed to get a response from the AI. Please try again.',
    errorImageLoad: 'Image unavailable.',
    retry: 'Retry',
    
    // AI Search
    aiSearch: 'Search with AI for "{query}"',
    aiSearchDescription: 'Generate new events from the web.',
    aiSearchLoading: 'AI is searching for events...',
    aiSearchNoKey: 'Set your AI API Key in settings to use this feature.',

    // Settings
    appearance: 'Appearance',
    language: 'Language',
    aiSettings: 'AI Settings',
    myEvents: 'My Events',
    theme: 'Theme',
    starmap: 'Starmap',
    ancientScroll: 'Ancient Scroll',
    background: 'Background',
    darkBlue: 'Dark Blue',
    deepSpace: 'Deep Space',
    parchment: 'Parchment',
    light: 'Light',
    timelineStyle: 'Timeline Style',
    line: 'Line',
    dotted: 'Dotted',
    pinStyle: 'Pin Style',
    pin: 'Pin',
    glow: 'Glow',
    ring: 'Ring',
    interfaceLanguage: 'Interface Language',
    activeProvider: 'Active AI Provider',
    addProvider: 'Add AI Provider',
    editProvider: 'Edit AI Provider',
    providerName: 'Provider Name',
    modelId: 'Model ID',
    apiKey: 'API Key',
    baseUrl: 'Base URL (for OpenAI compatible APIs)',
    save: 'Save',
    cancel: 'Cancel',
    addEvent: 'Add Manual Event',
    editEvent: 'Edit Event',
    noCustomEvents: 'No custom events added yet.',
    title_en: 'Title (English)',
    title_zh: 'Title (Chinese)',
    track: 'Track',
    tags: 'Tags (comma separated)',
    explainPrompt: 'Explain this event to me in simple terms.',
    askPrompt: 'What is the long-term significance of this event?',
    generateWithAI: 'Generate with AI',
    generateEventsPrompt: "Enter a topic to generate events (e.g., 'History of Flight')",
    generatingEvents: 'Generating events, please wait...',
    errorGenerateEvents: 'Failed to generate events. Check your AI settings and try again.',
  },
  zh: {
    // App UI
    searchPlaceholder: '搜索事件、年份或标签...',
    usageHint: '使用鼠标滚轮缩放，点击并拖动平移',
    china: '中国',
    world: '世界',
    bce: '公元前',
    ce: '公元',
    close: '关闭',
    settings: '设置',

    // InfoCard
    year: '年份',
    baiduBaike: '百度百科',
    webSearch: '网页搜索',
    edit: '编辑',
    aiSummary: 'AI摘要与详情',
    sources: '资料来源',
    interactiveAI: '互动AI聊天',
    aiWelcome: '向我提问关于此事件的任何问题！',
    explain: '给我解释一下',
    askAI: '问AI一个问题',
    askFollowUp: '问一个后续问题...',
    errorSetAPIKey: 'AI提供商的API密钥未设置。请在设置中配置。',
    errorFetchDetails: '无法获取事件详情。AI模型可能不可用或API密钥无效。',
    errorChatResponse: '未能从AI获取回应。请再试一次。',
    errorImageLoad: '图片不可用。',
    retry: '重试',

    // AI Search
    aiSearch: '使用 AI 搜索 "{query}"',
    aiSearchDescription: '从网络生成新事件。',
    aiSearchLoading: 'AI正在搜索事件...',
    aiSearchNoKey: '请在设置中提供您的AI API密钥以使用此功能。',
    
    // Settings
    appearance: '外观',
    language: '语言',
    aiSettings: 'AI设置',
    myEvents: '我的事件',
    theme: '主题',
    starmap: '星图',
    ancientScroll: '古卷',
    background: '背景',
    darkBlue: '深蓝',
    deepSpace: '深空',
    parchment: '羊皮纸',
    light: '明亮',
    timelineStyle: '时间轴样式',
    line: '实线',
    dotted: '虚线',
    pinStyle: '图钉样式',
    pin: '图钉',
    glow: '辉光',
    ring: '圆环',
    interfaceLanguage: '界面语言',
    activeProvider: '当前AI提供商',
    addProvider: '添加AI提供商',
    editProvider: '编辑AI提供商',
    providerName: '提供商名称',
    modelId: '模型ID',
    apiKey: 'API密钥',
    baseUrl: '基础URL (用于兼容OpenAI的API)',
    save: '保存',
    cancel: '取消',
    addEvent: '手动添加事件',
    editEvent: '编辑事件',
    noCustomEvents: '尚未添加任何自定义事件。',
    title_en: '标题（英文）',
    title_zh: '标题（中文）',
    track: '轨道',
    tags: '标签（用逗号分隔）',
    explainPrompt: '用简单的语言向我解释这个事件。',
    askPrompt: '这个事件的长期意义是什么？',
    generateWithAI: '使用AI生成',
    generateEventsPrompt: "输入一个主题以生成事件 (例如 '飞行史')",
    generatingEvents: '正在生成事件，请稍候...',
    errorGenerateEvents: '生成事件失败。请检查您的AI设置并重试。',
  },
};

export const useTranslation = () => {
  const { language } = useAppContext();
  
  const t = (key: string, options?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, options[optionKey]);
      });
    }
    return translation;
  };

  return { t, language };
};
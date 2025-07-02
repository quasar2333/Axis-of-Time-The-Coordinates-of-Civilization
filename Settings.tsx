import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { useTranslation } from './translation';
import { AIProvider, CustomStyleSettings, HistoricalEvent } from './types';
import { CloseIcon, PlusIcon, TrashIcon, EditIcon, SparklesIcon } from './components/icons';
import { v4 as uuidv4 } from 'uuid';
import { generateEventsFromPrompt } from './services/gemini';

interface SettingsProps {
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const { language } = useAppContext();
    const [activeTab, setActiveTab] = useState('appearance');
    const { t } = useTranslation();
    const { settings } = useAppContext();

    const styles = settings.theme === 'Starmap' 
    ? {
        modal: 'bg-gray-900/80 border-cyan-400/50 text-gray-200 backdrop-blur-lg shadow-[0_0_20px_rgba(0,255,255,0.3)]',
        tab: 'hover:bg-cyan-500/10 text-cyan-300/70',
        tabActive: 'bg-cyan-500/20 text-cyan-200',
        closeButton: 'text-white/80 hover:text-white hover:bg-black/30',
        divider: 'border-white/10'
      }
    : {
        modal: 'bg-[#fdf6e3]/90 border-amber-800/50 text-amber-950 backdrop-blur-lg shadow-2xl',
        tab: 'hover:bg-amber-800/10 text-amber-900/70',
        tabActive: 'bg-amber-800/20 text-amber-950',
        closeButton: 'text-amber-950/80 hover:text-black hover:bg-black/10',
        divider: 'border-amber-800/20'
      };
    
    const tabs = [
        { id: 'appearance', label: t('appearance') },
        { id: 'language', label: t('language') },
        { id: 'ai_settings', label: t('aiSettings') },
        { id: 'my_events', label: t('myEvents') },
    ];
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'appearance': return <AppearanceSettings />;
            case 'language': return <LanguageSettings />;
            case 'ai_settings': return <AIProviderSettings />;
            case 'my_events': return <MyEventsSettings />;
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className={`relative max-w-2xl w-full max-h-[90vh] flex flex-col rounded-xl animate-fade-in ${styles.modal} ${language === 'zh' ? 'font-ui-zh' : 'font-ui-en'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10 ${styles.closeButton}`} aria-label={t('close')}><CloseIcon /></button>
                <div className={`p-6 flex-shrink-0 border-b ${styles.divider}`}>
                    <h2 className="text-2xl font-bold">{t('settings')}</h2>
                </div>
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    <div className={`flex-shrink-0 md:w-48 p-4 border-b md:border-b-0 md:border-r ${styles.divider}`}>
                        <nav className="flex flex-row md:flex-col gap-1">
                           {tabs.map(tab => (
                             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? styles.tabActive : styles.tab}`}>
                                {tab.label}
                             </button>
                           ))}
                        </nav>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppearanceSettings = () => {
    const { settings, updateSettings, t } = useSettingComponents();
    return (
         <div className="space-y-6">
            <RadioGroup label={t('theme')} value={settings.theme} onChange={(v) => updateSettings({ theme: v as 'Starmap' | 'Scroll' })} options={[ {value: 'Starmap', label: t('starmap')}, {value: 'Scroll', label: t('ancientScroll')} ]} />
            <RadioGroup label={t('background')} value={settings.backgroundStyle} onChange={(v) => updateSettings({ backgroundStyle: v as any })} options={[ {value: 'bg-gray-900', label: t('darkBlue')}, {value: 'bg-[#0a0f1e]', label: t('deepSpace')}, {value: 'bg-[#fdf6e3]', label: t('parchment')}, {value: 'bg-[#f5f5f5]', label: t('light')}]} />
            <RadioGroup label={t('timelineStyle')} value={settings.timelineStyle} onChange={(v) => updateSettings({ timelineStyle: v as any })} options={[ {value: 'line', label: t('line')}, {value: 'dotted', label: t('dotted')}]} />
            <RadioGroup label={t('pinStyle')} value={settings.pinStyle} onChange={(v) => updateSettings({ pinStyle: v as any })} options={[ {value: 'pin', label: t('pin')}, {value: 'glow', label: t('glow')}, {value: 'ring', label: t('ring')}]} />
        </div>
    )
}

const LanguageSettings = () => {
    const { language, setLanguage, t } = useSettingComponents();
    return <RadioGroup label={t('interfaceLanguage')} value={language} onChange={(v) => setLanguage(v as 'en' | 'zh')} options={[ {value: 'en', label: 'English'}, {value: 'zh', label: '中文 (Chinese)'} ]} />
}

const AIProviderSettings = () => {
    const { t, aiProviders, addAiProvider, updateAiProvider, deleteAiProvider, activeAIProviderId, setActiveAIProviderId, styles } = useSettingComponents();
    const [editingProvider, setEditingProvider] = useState<Partial<AIProvider> | null>(null);

    const handleSave = () => {
        if (!editingProvider?.name || !editingProvider?.modelId) return;
        if (editingProvider.id) {
            updateAiProvider(editingProvider as AIProvider);
        } else {
            addAiProvider(editingProvider as Omit<AIProvider, 'id'>);
        }
        setEditingProvider(null);
    };

    if (editingProvider) {
        return (
            <div className={`p-4 border rounded-lg mt-4 space-y-4 ${styles.listItem}`}>
                <h4 className="font-bold">{editingProvider.id ? t('editProvider') : t('addProvider')}</h4>
                <InputField label={t('providerName')} value={editingProvider.name || ''} onChange={v => setEditingProvider(p => ({...p, name: v}))} />
                <InputField label={t('modelId')} value={editingProvider.modelId || ''} onChange={v => setEditingProvider(p => ({...p, modelId: v}))} />
                <InputField type="password" label={t('apiKey')} value={editingProvider.apiKey || ''} onChange={v => setEditingProvider(p => ({...p, apiKey: v}))} />
                <InputField type="text" label={t('baseUrl')} value={editingProvider.baseUrl || ''} onChange={v => setEditingProvider(p => ({...p, baseUrl: v}))} placeholder="e.g., https://api.openai.com/v1" />
                <div className="flex gap-2">
                    <button onClick={handleSave} className={`${styles.button} px-4 py-2 rounded-lg text-sm`}>{t('save')}</button>
                    <button onClick={() => setEditingProvider(null)} className={`${styles.secondaryButton} px-4 py-2 rounded-lg text-sm`}>{t('cancel')}</button>
                </div>
            </div>
        );
    }

    return (
        <div>
             <label htmlFor="active-ai-provider" className={`block text-sm font-medium mb-1 ${styles.label}`}>{t('activeProvider')}</label>
            <select id="active-ai-provider" value={activeAIProviderId || ''} onChange={e => setActiveAIProviderId(e.target.value)} className={`w-full p-2 rounded-lg ${styles.select}`}>
                {aiProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <ul className="mt-4 space-y-2">
                {aiProviders.map(provider => (
                    <li key={provider.id} className={`flex justify-between items-center p-2 rounded-lg ${styles.listItem}`}>
                        <span>{provider.name} ({provider.modelId})</span>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingProvider(provider)} className={styles.secondaryButton + " p-1 rounded"}><EditIcon /></button>
                            {provider.id !== 'default-gemini' && <button onClick={() => deleteAiProvider(provider.id)} className={styles.dangerButton + " p-1 rounded"}><TrashIcon /></button>}
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={() => setEditingProvider({apiKey: '', modelId: '', name: '', baseUrl: ''})} className={`mt-4 flex items-center gap-2 ${styles.button} px-4 py-2 rounded-lg text-sm`}><PlusIcon className="w-5 h-5"/> {t('addProvider')}</button>
        </div>
    );
};

const MyEventsSettings = () => {
    const { t, language, customEvents, addCustomEvent, updateCustomEvent, deleteCustomEvent, activeAIProvider, styles } = useSettingComponents();
    const [editingEvent, setEditingEvent] = useState<Partial<HistoricalEvent> | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const handleSave = () => {
        if (!editingEvent || !editingEvent.title || !editingEvent.title_zh || editingEvent.year === undefined || !editingEvent.track) return;
        if(editingEvent.id) {
            updateCustomEvent(editingEvent as HistoricalEvent);
        } else {
            addCustomEvent(editingEvent as Omit<HistoricalEvent, 'id' | 'isCustom'>);
        }
        setEditingEvent(null);
    };

    const handleGenerate = async () => {
        if (!aiPrompt.trim()) return;
        if (!activeAIProvider?.apiKey) {
            setGenerationError(t('errorSetAPIKey'));
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);
        try {
            const newEvents = await generateEventsFromPrompt(aiPrompt, language, activeAIProvider);
            newEvents.forEach(event => addCustomEvent(event));
            setAiPrompt('');
        } catch(e) {
            setGenerationError(t('errorGenerateEvents'));
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div>
            {/* AI Generation */}
            <div className={`p-4 border rounded-lg mb-6 ${styles.listItem}`}>
                <h4 className="font-bold mb-2 flex items-center gap-2"><SparklesIcon/> {t('generateWithAI')}</h4>
                <InputField label={t('generateEventsPrompt')} value={aiPrompt} onChange={setAiPrompt} />
                <button onClick={handleGenerate} disabled={isGenerating} className={`mt-2 flex items-center gap-2 ${styles.button} px-4 py-2 rounded-lg text-sm w-full justify-center`}>
                    {isGenerating ? t('generatingEvents') : t('generateWithAI')}
                </button>
                {generationError && <p className="text-red-500 text-sm mt-2">{generationError}</p>}
            </div>

            <h4 className="font-bold mb-2">{t('myEvents')}</h4>
            {/* Manual Event Editor */}
            {editingEvent && (
                 <div className={`p-4 border rounded-lg mt-4 space-y-4 ${styles.listItem}`}>
                    <h4 className="font-bold">{editingEvent.id ? t('editEvent') : t('addEvent')}</h4>
                    <InputField label={t('title_en')} value={editingEvent.title || ''} onChange={v => setEditingEvent(p => ({...p, title: v}))} />
                    <InputField label={t('title_zh')} value={editingEvent.title_zh || ''} onChange={v => setEditingEvent(p => ({...p, title_zh: v}))} />
                    <InputField label={t('year')} type="number" value={String(editingEvent.year ?? '')} onChange={v => setEditingEvent(p => ({...p, year: v ? parseInt(v, 10) : undefined}))} />
                    <RadioGroup label={t('track')} value={editingEvent.track || 'World'} onChange={v => setEditingEvent(p => ({...p, track: v as any}))} options={[{value: 'China', label: t('china')}, {value: 'World', label: t('world')}]} />
                    <InputField label={t('tags')} value={(editingEvent.tags || []).join(', ')} onChange={v => setEditingEvent(p => ({...p, tags: v.split(',').map(t => t.trim())}))} />
                    <div className="flex gap-2">
                        <button onClick={handleSave} className={`${styles.button} px-4 py-2 rounded-lg text-sm`}>{t('save')}</button>
                        <button onClick={() => setEditingEvent(null)} className={`${styles.secondaryButton} px-4 py-2 rounded-lg text-sm`}>{t('cancel')}</button>
                    </div>
                </div>
            )}
            
            {/* List of custom events */}
            <div className={`border rounded-lg ${styles.listItem}`}>
                <ul className="space-y-0 max-h-64 overflow-y-auto">
                    {customEvents.length === 0 && <li className="p-3 text-center text-sm opacity-60">{t('noCustomEvents')}</li>}
                    {customEvents.map(event => (
                        <li key={event.id} className={`flex justify-between items-center p-3 border-b ${styles.listItem} last:border-b-0`}>
                           <span className="truncate pr-2">{language === 'en' ? event.title : event.title_zh} ({event.year})</span>
                           <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => setEditingEvent(event)} className={styles.secondaryButton + " p-1 rounded"}><EditIcon /></button>
                                <button onClick={() => deleteCustomEvent(event.id)} className={styles.dangerButton + " p-1 rounded"}><TrashIcon /></button>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={() => setEditingEvent({tags: [], track: 'World', year: new Date().getFullYear()})} className={`mt-4 flex items-center gap-2 ${styles.button} px-4 py-2 rounded-lg text-sm`}><PlusIcon className="w-5 h-5"/> {t('addEvent')}</button>
        </div>
    )
};


// Helper hook and components to avoid prop drilling within Settings
const useSettingComponents = () => {
    const context = useAppContext();
    const { t, language } = useTranslation();
    const isStarmap = context.settings.theme === 'Starmap';
    const styles = {
        input: `w-full p-2 rounded-lg border ${isStarmap ? 'bg-gray-800 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500' : 'bg-amber-50 border-amber-300 focus:ring-amber-800 focus:border-amber-800'}`,
        label: `block text-sm font-medium mb-1 ${isStarmap ? 'text-gray-300' : 'text-amber-900/80'}`,
        select: `w-full p-2 rounded-lg ${isStarmap ? 'bg-gray-800 border-gray-700 focus:ring-cyan-500 focus:border-cyan-500' : 'bg-amber-50 border-amber-300 focus:ring-amber-800 focus:border-amber-800'}`,
        button: `bg-cyan-600 hover:bg-cyan-700 text-white ${!isStarmap && 'bg-amber-800 hover:bg-amber-900'}`,
        secondaryButton: `bg-gray-700 hover:bg-gray-600 text-gray-300 ${!isStarmap && 'bg-amber-200 hover:bg-amber-300 text-amber-950'}`,
        dangerButton: `bg-red-600/20 hover:bg-red-600/30 text-red-400 ${!isStarmap && 'bg-red-500/20 hover:bg-red-500/30 text-red-800'}`,
        listItem: isStarmap ? 'border-gray-700' : 'border-amber-800/20',
    };
    return { ...context, t, language, styles };
};

const RadioGroup: React.FC<{label: string, value: string, onChange: (value: string) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => {
    const { settings, t } = useSettingComponents();
    const isStarmap = settings.theme === 'Starmap';
    return (
        <div>
            <label className={`text-base font-medium ${isStarmap ? 'text-gray-300' : 'text-amber-900/80'}`}>{label}</label>
            <div className="mt-2 flex flex-wrap gap-2">
                {options.map(opt => (
                    <button key={opt.value} onClick={() => onChange(opt.value)} className={`px-4 py-2 text-sm rounded-full border transition-colors ${value === opt.value ? (isStarmap ? 'bg-cyan-500/30 border-cyan-400 text-white' : 'bg-amber-800/30 border-amber-800 text-black') : (isStarmap ? 'border-gray-600 hover:bg-gray-700' : 'border-amber-400 hover:bg-amber-200') }`}>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )
};

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string}> = ({ label, value, onChange, type = 'text', placeholder}) => {
    const { styles } = useSettingComponents();
    return (
        <div>
            <label htmlFor={label} className={styles.label}>{label}</label>
            <input id={label} type={type} value={value} onChange={e => onChange(e.target.value)} className={styles.input} placeholder={placeholder} />
        </div>
    )
}

export default Settings;

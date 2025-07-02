import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, HistoricalEvent } from './types';
import { useAppContext } from './AppContext';
import { useTranslation } from './translation';
import { getAiChatResponse } from './services/gemini';
import { SendIcon, SparklesIcon } from './components/icons';

interface ChatProps {
    event: HistoricalEvent;
}

const Chat: React.FC<ChatProps> = ({ event }) => {
    const { settings, language, activeAIProvider } = useAppContext();
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const eventTitle = language === 'zh' ? event.title_zh : event.title;

    useEffect(() => {
        if(chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        if (!activeAIProvider || !activeAIProvider.apiKey) {
            setError(t('errorSetAPIKey'));
            return;
        }

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        const historyBeforeRequest = messages; // History *before* new message

        setMessages(prev => [...prev, userMessage]); // Update UI immediately
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await getAiChatResponse(eventTitle, historyBeforeRequest, messageText, language, activeAIProvider);
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (e) {
            console.error(e);
            setError(t('errorChatResponse'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (action: 'explain' | 'ask') => {
        const prompt = action === 'explain' ? t('explainPrompt') : t('askPrompt');
        handleSendMessage(prompt);
    };

    const isStarmap = settings.theme === 'Starmap';
    const styles = {
        inputBg: isStarmap ? 'bg-gray-800/80' : 'bg-amber-100/80',
        inputText: isStarmap ? 'text-gray-200' : 'text-amber-950',
        placeholder: isStarmap ? 'placeholder-gray-500' : 'placeholder-amber-900/50',
        sendButton: isStarmap ? 'text-cyan-400 hover:text-white' : 'text-amber-800 hover:text-black',
        quickButton: isStarmap ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200' : 'bg-amber-800/10 hover:bg-amber-800/20 text-amber-900',
        userMessage: isStarmap ? 'bg-cyan-500/20' : 'bg-amber-800/20',
        modelMessage: isStarmap ? 'bg-gray-700/60' : 'bg-amber-200/60',
        errorText: 'text-red-500',
    };

    return (
        <div className="border-t border-white/10 pt-4">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><SparklesIcon className="w-5 h-5 opacity-80" /> {t('interactiveAI')}</h3>
            
            <div ref={chatContainerRef} className="h-40 overflow-y-auto pr-2 mb-2 space-y-3 text-base">
                {messages.length === 0 && (
                    <div className="text-center text-sm opacity-60 pt-8">{t('aiWelcome')}</div>
                )}
                {messages.map((msg, index) => (
                     <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user' ? styles.userMessage : styles.modelMessage}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${styles.modelMessage}`}>
                           <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-0"></div>
                               <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
                               <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-300"></div>
                           </div>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className={`text-sm text-center my-2 ${styles.errorText}`}>{error}</p>}
            
            {messages.length === 0 && (
                <div className="flex gap-2 mb-2">
                    <button onClick={() => handleQuickAction('explain')} disabled={isLoading} className={`flex-1 text-sm py-2 px-3 rounded-lg transition-colors ${styles.quickButton}`}>{t('explain')}</button>
                    <button onClick={() => handleQuickAction('ask')} disabled={isLoading} className={`flex-1 text-sm py-2 px-3 rounded-lg transition-colors ${styles.quickButton}`}>{t('askAI')}</button>
                </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('askFollowUp')}
                    disabled={isLoading}
                    className={`w-full h-11 pr-12 pl-4 rounded-lg border-none focus:ring-2 transition-colors ${styles.inputBg} ${styles.inputText} ${styles.placeholder} ${isStarmap ? 'focus:ring-cyan-400' : 'focus:ring-amber-800'}`}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors disabled:opacity-30 ${styles.sendButton}`}>
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default Chat;
import { GoogleGenAI, Chat } from "@google/genai";
import { AIProvider, ChatMessage, Language, HistoricalEvent, EventDetails } from "../types";

// For Google SDK
let googleAI: GoogleGenAI | null = null;
let currentGoogleApiKey: string | null = null;
let googleChat: Chat | null = null;
let googleChatTopic: string | null = null;

function getGoogleAISDK(provider: AIProvider): GoogleGenAI {
  if (googleAI && currentGoogleApiKey === provider.apiKey) {
    return googleAI;
  }
  if (!provider.apiKey) {
    throw new Error("API Key is not set for the Google provider.");
  }
  currentGoogleApiKey = provider.apiKey;
  googleAI = new GoogleGenAI({ apiKey: currentGoogleApiKey });
  googleChat = null; // Reset chat when AI instance changes
  return googleAI;
}

async function fetchWithOpenAICompat(
    prompt: string,
    provider: AIProvider,
    jsonMode: boolean,
    history: { role: string; text: string }[] = [],
    signal?: AbortSignal
): Promise<string> {
    if (!provider.baseUrl || !provider.apiKey) {
        throw new Error("Provider baseUrl or API key is missing.");
    }

    const url = new URL(provider.baseUrl.endsWith('/') ? `${provider.baseUrl}chat/completions` : `${provider.baseUrl}/chat/completions`);

    const messages = history.length > 0
        ? [...history.map(msg => ({ 
            role: msg.role === 'model' ? 'assistant' : msg.role, 
            content: msg.text 
        })), { role: 'user', content: prompt }]
        : [{ role: 'user', content: prompt }];
        
    const body: any = {
        model: provider.modelId,
        messages: messages,
        temperature: 0.5,
    };
    // Removed `response_format` for broader compatibility.
    // Relies on the prompt instructing the model to return JSON.

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI-compatible API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

function cleanAndParseJson(jsonStr: string): any {
    let cleanStr = jsonStr.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanStr.match(fenceRegex);
    if (match && match[2]) {
        cleanStr = match[2].trim();
    }
    return JSON.parse(cleanStr);
}

export async function fetchEventDetails(title: string, lang: Language, provider: AIProvider, signal?: AbortSignal): Promise<EventDetails> {
    const prompt = `You are a history expert providing data for an interactive timeline. The user is asking about the event: "${title}". Your response must be in ${lang === 'zh' ? 'Chinese' : 'English'}. Based on web search results, provide: 1. "summary": A concise, engaging summary of about 50-70 words. 2. "image_query": A simple, effective 2-3 word English keyword phrase for an image search API (e.g., "ancient rome colosseum", "ming dynasty ship"). Respond ONLY with a valid JSON object like this: {"summary": "...", "image_query": "..."}.`;

    try {
        let jsonStr: string;
        let sources: { uri: string; title: string; }[] = [];

        if (provider.baseUrl) {
            jsonStr = await fetchWithOpenAICompat(prompt, provider, true, [], signal);
        } else {
            const genai = getGoogleAISDK(provider);
            const response = await genai.models.generateContent({
                model: provider.modelId || "gemini-2.5-flash-preview-04-17",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.5,
                },
            });
            jsonStr = response.text;
            sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
              ?.map((c: any) => c.web)
              .filter(Boolean) || [];
        }

        const parsedData = cleanAndParseJson(jsonStr) as Omit<EventDetails, 'sources'>;
        if (typeof parsedData.summary === 'string' && typeof parsedData.image_query === 'string') {
            return { ...parsedData, sources };
        } else {
            throw new Error("Invalid JSON structure from API.");
        }
    } catch (e) {
        if (!(e instanceof Error && e.name === 'AbortError')) {
            console.error("Failed to fetch or parse event details from AI:", e);
        }
        throw e;
    }
}

export async function getAiChatResponse(eventTitle: string, history: ChatMessage[], newMessage: string, lang: Language, provider: AIProvider): Promise<string> {
    const systemInstruction = `You are a helpful and knowledgeable history expert. The user is asking about "${eventTitle}". Keep your answers concise and engaging. Respond in ${lang === 'zh' ? 'Chinese' : 'English'}.`;
    
    if (provider.baseUrl) {
        const fullHistory = [{ role: 'system', text: systemInstruction }, ...history];
        return fetchWithOpenAICompat(newMessage, provider, false, fullHistory);
    } else {
        const genai = getGoogleAISDK(provider);
        const modelId = provider.modelId || "gemini-2.5-flash-preview-04-17";
        const topic = `${eventTitle}-${modelId}`;

        if (googleChatTopic !== topic) {
            googleChat = null;
            googleChatTopic = topic;
        }

        if (!googleChat) {
            googleChat = genai.chats.create({
                model: modelId,
                config: { systemInstruction, temperature: 0.7 },
                history: history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }))
            });
        }
        
        try {
            const result = await googleChat.sendMessage({ message: newMessage });
            return result.text;
        } catch (e) {
            console.error("Failed to get chat response from Gemini API:", e);
            googleChat = null; // Reset chat on error
            throw e;
        }
    }
}

export async function generateEventsFromPrompt(userPrompt: string, lang: Language, provider: AIProvider): Promise<Omit<HistoricalEvent, 'id' | 'isCustom'>[]> {
    const prompt = `You are a data generation assistant for a history timeline application. Using Google Search to ensure factual accuracy, generate a list of 5 to 10 significant historical events about: "${userPrompt}". Your response must be in ${lang}. Your response must be ONLY a valid JSON array. Each object in the array must have these exact keys: "year" (number), "track" (string, either "China" or "World"), "title" (string, English title), "title_zh" (string, Chinese title), and "tags" (array of 2-4 relevant string tags). Example: [{"year": 1969, "track": "World", "title": "Apollo 11 Moon Landing", "title_zh": "阿波罗11号登月", "tags": ["space", "technology", "cold war"]}]`;

    try {
        let jsonStr: string;
        if (provider.baseUrl) {
            jsonStr = await fetchWithOpenAICompat(prompt, provider, true);
        } else {
            const genai = getGoogleAISDK(provider);
            const response = await genai.models.generateContent({
                model: provider.modelId || "gemini-2.5-flash-preview-04-17",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.6,
                },
            });
            jsonStr = response.text;
        }

        const parsedData = cleanAndParseJson(jsonStr);
        if (Array.isArray(parsedData)) {
            return parsedData.filter(item => 
                typeof item.year === 'number' &&
                (item.track === 'China' || item.track === 'World') &&
                typeof item.title === 'string' &&
                typeof item.title_zh === 'string' &&
                Array.isArray(item.tags)
            ) as Omit<HistoricalEvent, 'id' | 'isCustom'>[];
        } else {
            throw new Error("API did not return a valid JSON array.");
        }
    } catch(e) {
        console.error("Failed to generate events from AI:", e);
        throw e;
    }
}
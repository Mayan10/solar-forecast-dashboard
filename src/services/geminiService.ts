import { GoogleGenAI } from "@google/genai";
// FIX: Removed file extension from import path to resolve module loading error.
import { SolarPanelConfig, ForecastDataPoint, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatForecastDataForPrompt = (data: ForecastDataPoint[]): string => {
    return data.map(d => `${d.time}: ${d.power} kW`).join('\n');
};

const formatConfigForPrompt = (config: SolarPanelConfig): string => {
    return `
- Location: Latitude ${config.latitude}, Longitude ${config.longitude}
- System Capacity: ${config.capacity} kWp
- Panel Tilt: ${config.tilt}°
- Panel Azimuth: ${config.azimuth}°
- Prediction Model Used: ${config.model}
    `;
}

export const getInitialInsight = async (forecastData: ForecastDataPoint[], config: SolarPanelConfig): Promise<string> => {
    const prompt = `
You are an expert AI Solar Analyst. Your role is to provide clear, concise, and helpful insights into solar energy forecasts.

A 24-hour solar power forecast has been generated with the following configuration:
${formatConfigForPrompt(config)}

Here is the forecast data (Time: Power in kW):
${formatForecastDataForPrompt(forecastData)}

Based on this data, provide an initial analysis. Your response should be structured as follows:

1.  **Forecast Summary:** A brief, one-sentence summary of the day's solar generation.
2.  **Key Metrics:**
    *   **Peak Power:** The maximum power output and the time it occurs.
    *   **Total Energy:** The estimated total energy generated over the 24-hour period (sum of hourly kW).
3.  **Key Observation:** One or two important observations, such as the shape of the generation curve or when power ramps up and down.
4.  **Next Steps:** A concluding sentence encouraging the user to ask more questions.

Format your response using markdown for clarity (e.g., bolding for titles).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error in getInitialInsight:", error);
        return "There was an error generating the initial analysis. Please try again.";
    }
};

export const getChatResponse = async (history: ChatMessage[], forecastData: ForecastDataPoint[], config: SolarPanelConfig): Promise<string> => {
    const chatHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
    
    const prompt = `
You are an expert AI Solar Analyst continuing a conversation with a user.

**System Configuration:**
${formatConfigForPrompt(config)}

**Full 24-Hour Forecast Data (for context):**
${formatForecastDataForPrompt(forecastData)}

**Conversation History:**
${chatHistory}

The user just sent a new message. Based on the entire context (system config, forecast data, and conversation history), provide a helpful and relevant response to the user's latest message. Be concise and stay on topic.
If the user's question is unrelated to the solar forecast, gently guide them back to the topic.

User's new message is the last one in the history. Formulate your AI response now.
AI: 
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error in getChatResponse:", error);
        return "I'm sorry, I encountered an issue trying to respond. Could you please ask again?";
    }
};
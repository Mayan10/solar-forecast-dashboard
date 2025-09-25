
import { GoogleGenAI, Type } from "@google/genai";
import type { AiInsight, ForecastDataPoint } from '../types';

// FIX: Per coding guidelines, the API key must be obtained exclusively from process.env.API_KEY.
// The GoogleGenAI client is initialized once and reused.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// FIX: Removed userApiKey parameter as API key should not be passed from the UI.
export const getInsight = async (forecastData: ForecastDataPoint[]): Promise<AiInsight | null> => {

  const summarizedData = forecastData
    .slice(0, 20) // Use a subset of data to keep the prompt concise
    .map(d => `Time: ${d.timestamp}, Forecast: ${d.pv_estimate.toFixed(2)} kW`)
    .join('\n');

  const prompt = `
    Analyze the following solar PV generation forecast data. Provide a concise, insightful analysis for a homeowner or small business owner.
    Focus on actionable advice.
    
    Data:
    ${summarizedData}

    Based on this data, provide:
    1.  A short, catchy title for the insight (e.g., "Sunny Outlook with Morning Peak").
    2.  A brief explanation of the forecast pattern (e.g., "Expect strong solar generation in the morning, tapering off in the afternoon.").
    3.  A list of 2-3 practical suggestions (e.g., "Run high-energy appliances like the dishwasher around 11 AM," "Charge your electric vehicle between 10 AM and 2 PM.").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, catchy title for the insight."
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of the forecast pattern."
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "A list of practical suggestions."
            }
          },
          required: ["title", "explanation", "suggestions"]
        },
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    if (parsedJson.title && parsedJson.explanation && Array.isArray(parsedJson.suggestions)) {
        return parsedJson as AiInsight;
    } else {
        console.error("Parsed JSON does not match AiInsight structure:", parsedJson);
        return null;
    }
    
  } catch (error) {
    console.error("Error generating insight from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get insights from Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};

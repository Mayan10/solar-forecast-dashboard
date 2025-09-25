
const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenAI, Type } = require('@google/genai');

// Use dotenv for local development to load .env file
// In production (like Elastic Beanstalk), environment variables are set directly
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// --- Pre-flight Checks ---
if (!process.env.API_KEY) {
    console.error("FATAL ERROR: API_KEY environment variable not set.");
    process.exit(1);
}

// --- Gemini AI Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const predictionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            hour: {
                type: Type.INTEGER,
                description: 'The hour of the day for the forecast, from 0 to 23.',
            },
            power_kw: {
                type: Type.NUMBER,
                description: 'The predicted solar power output in kilowatts (kW).',
            },
        },
        required: ['hour', 'power_kw'],
    },
};

const getPromptForConfig = (config) => `
You are an expert solar energy analyst. Your task is to provide a simulated hourly solar power output forecast for the next 24 hours based on the provided photovoltaic (PV) system specifications and location.
You must act as a physics-based model (like PVLib), considering typical weather patterns, sun position (azimuth and elevation) for the given latitude and longitude, and panel orientation.

**System Specifications:**
- Location: Latitude ${config.latitude}, Longitude ${config.longitude}
- Panel Capacity: ${config.capacity} kWp (kilowatt-peak)
- Panel Tilt: ${config.tilt} degrees from horizontal
- Panel Azimuth: ${config.azimuth} degrees from North (180 = South-facing)

**Task:**
Generate an hourly power output forecast in kilowatts (kW) for the next 24 hours, starting from the next full hour. Assume typical, mostly clear-sky conditions for this time of year at the given location. The power output should realistically follow a bell curve, peaking around noon and being zero during nighttime hours. The peak output should not exceed the panel's capacity.

The output must be a valid JSON array of objects, strictly conforming to the provided schema. The array must contain exactly 24 entries, one for each hour from 0 to 23.
`;


// --- Express App Setup ---
const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());


// --- API Route ---
app.post('/api/predict', async (req, res) => {
    const config = req.body;

    if (!config || typeof config.latitude !== 'number' || typeof config.longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid panel configuration provided.' });
    }

    try {
        const prompt = getPromptForConfig(config);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: predictionSchema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }
        
        // No need to check for markdown, the schema guarantees JSON
        const parsedData = JSON.parse(jsonText);
        res.json(parsedData);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to get a valid prediction from the AI. Please try again." });
    }
});


// --- Static File Serving for Production ---
// **CRITICAL FIX**: Serve static files from 'dist' directory BEFORE the catch-all route.
// This ensures that requests for /index.css, /index.js, etc., are handled correctly.
app.use(express.static(path.join(__dirname, 'dist')));

// For any route that is not an API call or a static file, serve the main index.html.
// This is the catch-all for Single Page Application (SPA) routing.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
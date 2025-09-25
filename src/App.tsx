
import React, { useState, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { getInsight } from './services/geminiService';
import type { ForecastDataPoint, AiInsight } from './types';
import Header from './components/Header';
// FIX: Removed ApiKeyInput component as per coding guidelines.
// import ApiKeyInput from './components/ApiKeyInput';
import ForecastChart from './components/ForecastChart';
import InsightCard from './components/InsightCard';
import LoadingSpinner from './components/LoadingSpinner';

// Use environment variable for the backend URL.
// This needs to be configured in the deployment environment (e.g., AWS Beanstalk).
// For local development, you can create a .env file with:
// REACT_APP_API_URL=http://localhost:5000
const API_URL = process.env.REACT_APP_API_URL || '';

function App() {
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  // FIX: Removed apiKey state as it should not be handled by the UI.
  // const [apiKey, setApiKey] = useState(process.env.REACT_APP_GEMINI_API_KEY || '');
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const fetchForecastData = useCallback(async () => {
    setForecastError(null);
    try {
      // Use the configurable API_URL
      const response = await fetch(`${API_URL}/api/forecast`);
      if (!response.ok) {
        throw new Error(`Failed to fetch forecast data. Status: ${response.status}`);
      }
      const csvText = await response.text();
      const data = d3.csvParse(csvText, (d): ForecastDataPoint | undefined => {
        if (d.timestamp && d.pv_estimate) {
          return {
            timestamp: d.timestamp,
            pv_estimate: +d.pv_estimate,
          };
        }
        return undefined;
      });
      // Filter out any undefined entries that might result from parsing errors
      const filteredData = data.filter((d): d is ForecastDataPoint => d !== undefined);
      setForecastData(filteredData);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setForecastError(`Error fetching forecast data: ${e.message}. Make sure the backend server is running and the API URL is configured correctly.`);
      } else {
        setForecastError('An unknown error occurred while fetching forecast data.');
      }
    }
  }, []);

  useEffect(() => {
    fetchForecastData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  const handleGetInsight = async () => {
    // FIX: Removed apiKey from condition.
    if (!forecastData.length) {
      setError('Forecast data is required to generate insights.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      // FIX: Call getInsight without apiKey.
      const result = await getInsight(forecastData);
      setInsight(result);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred while generating insight.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 flex flex-col items-center gap-6">
        {forecastError ? (
          <div className="w-full max-w-4xl bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Could not load Forecast Data</h3>
            <p>{forecastError}</p>
          </div>
        ) : forecastData.length > 0 ? (
          <>
            <ForecastChart forecastData={forecastData} />
            {/* FIX: Replaced ApiKeyInput with a simple button to trigger insight generation, as per coding guidelines. */}
            <div className="w-full max-w-2xl px-4 flex justify-center">
              <button
                onClick={handleGetInsight}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Generating...' : 'Get AI Insight'}
              </button>
            </div>
            {isLoading && <LoadingSpinner />}
            <InsightCard insight={insight} error={error} />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Solar Forecast Dashboard | Built with React, D3, Tremor, and Gemini</p>
      </footer>
    </div>
  );
}

export default App;

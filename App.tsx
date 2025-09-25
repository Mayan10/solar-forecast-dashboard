
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getSolarPrediction } from './services/geminiService';
import type { PanelConfig, PredictionPoint } from './types';

const App: React.FC = () => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    latitude: 34.0522,
    longitude: -118.2437,
    capacity: 5,
    tilt: 20,
    azimuth: 180,
  });
  const [prediction, setPrediction] = useState<PredictionPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const results = await getSolarPrediction(panelConfig);
      // Sort results by hour to ensure correct chart rendering
      const sortedResults = [...results].sort((a, b) => a.hour - b.hour);
      setPrediction(sortedResults);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [panelConfig]);

  const handleFormChange = (newConfig: Partial<PanelConfig>) => {
    setPanelConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PredictionForm 
              config={panelConfig} 
              onConfigChange={handleFormChange}
              onSubmit={handlePrediction} 
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2 bg-slate-800/50 rounded-xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="text-center text-red-400">
                <h3 className="text-xl font-bold mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && !prediction && (
                <div className="text-center text-slate-400">
                    <h3 className="text-2xl font-semibold mb-2">Welcome to Solar Forecaster AI</h3>
                    <p>Enter your PV system details and click "Predict" to see the magic!</p>
                </div>
            )}
            {prediction && <PredictionResult data={prediction} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;

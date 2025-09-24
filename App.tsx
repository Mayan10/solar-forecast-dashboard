import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SolarConfigForm } from './components/SolarConfigForm';
import { ForecastChart } from './components/ForecastChart';
import { SolarPanelConfig, ForecastDataPoint, PredictionModel } from './types';
import { predictSolarOutput } from './services/solarPredictionService';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [config, setConfig] = useState<SolarPanelConfig>({
    latitude: 40.7128,
    longitude: -74.0060,
    capacity: 5,
    tilt: 20,
    azimuth: 180,
    model: PredictionModel.PHYSICS_BASED,
  });
  const [forecastData, setForecastData] = useState<ForecastDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePrediction = useCallback(async () => {
    setIsLoading(true);
    setForecastData(null);
    try {
      const data = await predictSolarOutput(config);
      setForecastData(data);
    } catch (error) {
      console.error("Prediction failed:", error);
      // You could set an error state here to show a message to the user
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4">
          <SolarConfigForm config={config} setConfig={setConfig} onPredict={handlePrediction} isLoading={isLoading} />
        </aside>
        <section className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4">
            {isLoading && (
              <div className="flex-grow flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-xl font-semibold">Generating Forecast...</p>
                <p className="text-gray-400">Simulating solar output based on your parameters.</p>
              </div>
            )}
            {!isLoading && !forecastData && <WelcomeScreen />}
            {!isLoading && forecastData && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-grow">
                    <ForecastChart data={forecastData} />
                </div>
            )}
        </section>
      </main>
    </div>
  );
};

export default App;
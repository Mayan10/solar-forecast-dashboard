
import React from 'react';
import type { PanelConfig } from '../types';

interface PredictionFormProps {
  config: PanelConfig;
  onConfigChange: (newConfig: Partial<PanelConfig>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputField: React.FC<{ label: string; name: keyof PanelConfig; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; step?: string; min?: string; max?: string; unit?: string }> = ({ label, name, value, onChange, type = 'number', step = 'any', min, max, unit }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                step={step}
                min={min}
                max={max}
                className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
            />
            {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-slate-400">{unit}</span>}
        </div>
    </div>
);

export const PredictionForm: React.FC<PredictionFormProps> = ({ config, onConfigChange, onSubmit, isLoading }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ [e.target.name]: parseFloat(e.target.value) });
  };
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onConfigChange({
            latitude: parseFloat(position.coords.latitude.toFixed(4)),
            longitude: parseFloat(position.coords.longitude.toFixed(4)),
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-3">System Configuration</h2>
      
      <div className="space-y-4">
        <InputField label="Latitude" name="latitude" value={config.latitude} onChange={handleChange} step="0.0001" unit="°"/>
        <InputField label="Longitude" name="longitude" value={config.longitude} onChange={handleChange} step="0.0001" unit="°"/>
        <button 
          onClick={handleGetLocation}
          className="w-full text-sm bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          Use My Current Location
        </button>
      </div>

      <div className="space-y-4">
        <InputField label="Panel Capacity (kWp)" name="capacity" value={config.capacity} onChange={handleChange} step="0.1" min="0" unit="kWp" />
        <InputField label="Panel Tilt" name="tilt" value={config.tilt} onChange={handleChange} step="1" min="0" max="90" unit="°"/>
        <InputField label="Panel Azimuth (180=S)" name="azimuth" value={config.azimuth} onChange={handleChange} step="1" min="0" max="360" unit="°"/>
      </div>
      
      <button 
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isLoading ? 'Predicting...' : 'Predict Power Output'}
      </button>
    </div>
  );
};


import React from 'react';
// FIX: Added .ts extension to the import path to resolve the module loading error.
import { SolarPanelConfig, PredictionModel } from '../types.ts';
import { LocationIcon, CapacityIcon, TiltIcon, AzimuthIcon, ModelIcon } from './icons';

interface SolarConfigFormProps {
  config: SolarPanelConfig;
  setConfig: React.Dispatch<React.SetStateAction<SolarPanelConfig>>;
  onPredict: () => void;
  isLoading: boolean;
}

const FormInput = <T,>({ icon, label, id, value, onChange, ...props }: {
    icon: React.ReactNode,
    label: string,
    id: string,
    value: T,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    [key: string]: any
}) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        <input
            id={id}
            value={value as any}
            onChange={onChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            {...props}
        />
    </div>
);

// FIX: Allow passing additional props (like `name`) to the select element to fix a TypeScript error.
const FormSelect = ({ icon, label, id, value, onChange, children, ...props }: {
    icon: React.ReactNode,
    label: string,
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    children: React.ReactNode,
    [key: string]: any
}) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            {...props}
        >
            {children}
        </select>
    </div>
);


export const SolarConfigForm: React.FC<SolarConfigFormProps> = ({ config, setConfig, onPredict, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: name === 'model' ? value : parseFloat(value) || 0 }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onPredict(); }} className="space-y-4 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-center text-white mb-2">System Configuration</h2>
        
        <FormInput 
            icon={<LocationIcon className="w-5 h-5 text-gray-400"/>} 
            label="Latitude" id="latitude" name="latitude" type="number"
            value={config.latitude} onChange={handleChange} step="0.0001" />

        <FormInput
            icon={<LocationIcon className="w-5 h-5 text-gray-400"/>} 
            label="Longitude" id="longitude" name="longitude" type="number"
            value={config.longitude} onChange={handleChange} step="0.0001" />

        <FormInput
            icon={<CapacityIcon className="w-5 h-5 text-gray-400"/>} 
            label="Capacity (kWp)" id="capacity" name="capacity" type="number"
            value={config.capacity} onChange={handleChange} step="0.1" min="0" />

        <FormInput
            icon={<TiltIcon className="w-5 h-5 text-gray-400"/>} 
            label="Panel Tilt (°)" id="tilt" name="tilt" type="number"
            value={config.tilt} onChange={handleChange} min="0" max="90" />
            
        <FormInput
            icon={<AzimuthIcon className="w-5 h-5 text-gray-400"/>} 
            label="Azimuth (°)" id="azimuth" name="azimuth" type="number"
            value={config.azimuth} onChange={handleChange} min="0" max="360" />

        <FormSelect
            icon={<ModelIcon className="w-5 h-5 text-gray-400"/>}
            label="Prediction Model" id="model" name="model"
            value={config.model} onChange={handleChange}>
            {/* FIX: Explicitly type `model` as string to resolve `unknown` type error from Object.values. */}
            {Object.values(PredictionModel).map((model: string) => (
                <option key={model} value={model}>{model}</option>
            ))}
        </FormSelect>

      <div className="flex-grow"></div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : 'Generate Forecast'}
      </button>
    </form>
  );
};
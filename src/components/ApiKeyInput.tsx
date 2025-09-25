
import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, onSubmit, isLoading }) => (
  <div className="w-full max-w-2xl px-4">
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Gemini API Key here"
        className="flex-grow p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !apiKey}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Get AI Insight'}
      </button>
    </div>
  </div>
);

export default ApiKeyInput;

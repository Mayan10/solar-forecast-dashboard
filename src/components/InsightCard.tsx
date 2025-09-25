
import React from 'react';
import type { AiInsight } from '../types';

interface InsightCardProps {
  insight: AiInsight | null;
  error: string | null;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, error }) => {
  if (error) {
    return (
      <div className="w-full max-w-4xl bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Error Generating Insight</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg animate-fade-in">
      <h3 className="text-2xl font-bold text-blue-400 mb-3">{insight.title}</h3>
      <p className="text-gray-300 mb-4">{insight.explanation}</p>
      <div>
        <h4 className="font-semibold text-lg text-gray-200 mb-2">Suggestions:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {insight.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsightCard;

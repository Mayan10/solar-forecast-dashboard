
import React from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <SunIcon />
            <h1 className="text-2xl font-bold tracking-tight text-white">
            Solar Power Forecaster <span className="text-yellow-400">AI</span>
            </h1>
        </div>
      </div>
    </header>
  );
};

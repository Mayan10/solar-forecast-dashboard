import React from 'react';
import { SunIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex items-center border-b border-gray-700 sticky top-0 z-10">
      <SunIcon className="w-8 h-8 text-yellow-400 mr-3" />
      <h1 className="text-2xl font-bold text-white tracking-wider">
        Solar Energy Prediction Dashboard
      </h1>
    </header>
  );
};

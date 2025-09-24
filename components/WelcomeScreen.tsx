
import React from 'react';
import { SunIcon } from './icons';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <SunIcon className="w-24 h-24 text-yellow-400 animate-pulse" />
            <h2 className="mt-6 text-3xl font-bold text-white">Welcome to the Solar Dashboard</h2>
            <p className="mt-2 max-w-lg text-gray-300">
                Enter your solar panel system's configuration on the left to generate a 24-hour power output forecast.
            </p>
            <p className="mt-4 text-sm text-gray-400">
                Our AI Solar Analyst will provide insights and answer your questions about the generated data.
            </p>
        </div>
    );
};

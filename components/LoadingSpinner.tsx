
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div
                className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                </span>
            </div>
            <p className="text-slate-300">AI is forecasting...</p>
        </div>
    );
};

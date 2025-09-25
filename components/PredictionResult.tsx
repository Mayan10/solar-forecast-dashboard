
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { PredictionPoint } from '../types';

interface PredictionResultProps {
  data: PredictionPoint[];
}

// Custom Tooltip for better styling
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-700 p-3 border border-slate-600 rounded-lg shadow-xl">
                <p className="label text-slate-300">{`Hour: ${label}`}</p>
                <p className="intro text-yellow-400 font-semibold">{`Power: ${payload[0].value.toFixed(2)} kW`}</p>
            </div>
        );
    }
    return null;
};

export const PredictionResult: React.FC<PredictionResultProps> = ({ data }) => {
    const totalEnergy = data.reduce((acc, point) => acc + point.power_kw, 0);
    const peakPower = Math.max(...data.map(point => point.power_kw));

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">24-Hour Solar Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-center">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Predicted Energy</p>
                    <p className="text-2xl font-bold text-yellow-400">{totalEnergy.toFixed(2)} kWh</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Peak Power Output</p>
                    <p className="text-2xl font-bold text-yellow-400">{peakPower.toFixed(2)} kW</p>
                </div>
            </div>
            <div className="flex-grow w-full h-[300px] md:h-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                            dataKey="hour" 
                            stroke="#94a3b8" 
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                        <Line type="monotone" dataKey="power_kw" name="Power Output" stroke="#facc15" strokeWidth={2} dot={{ r: 2, fill: '#facc15' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastDataPoint } from '../types';

interface ForecastChartProps {
  data: ForecastDataPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="time" stroke="#A0AEC0" />
        <YAxis label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }} stroke="#A0AEC0" />
        <Tooltip
          contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }}
          labelStyle={{ color: '#E2E8F0' }}
        />
        <Legend wrapperStyle={{color: '#A0AEC0'}}/>
        <Line type="monotone" dataKey="power" stroke="#38B2AC" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 2}} name="Predicted Power"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

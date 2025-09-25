
import React, { useMemo } from 'react';
import { AreaChart, Card, Title } from '@tremor/react';
import type { ForecastDataPoint } from '../types';

const dataFormatter = (value: number) => `${value.toFixed(2)} kW`;

// FIX: Defined props interface for ForecastChart component to resolve missing type error.
interface ForecastChartProps {
  forecastData: ForecastDataPoint[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecastData }) => {
  const chartData = useMemo(() => {
    return forecastData.map(d => ({
      ...d,
      timestamp: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    }));
  }, [forecastData]);

  return (
    <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 ring-0">
      <Title className="text-white">Solar Generation Forecast</Title>
      <AreaChart
        className="mt-6"
        data={chartData}
        index="timestamp"
        categories={['pv_estimate']}
        colors={['yellow']}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        showLegend={false}
      />
    </Card>
  );
};

export default ForecastChart;

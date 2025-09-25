
export interface ForecastDataPoint {
  timestamp: string;
  pv_estimate: number;
}

export interface AiInsight {
  title: string;
  explanation: string;
  suggestions: string[];
}


export interface PanelConfig {
  latitude: number;
  longitude: number;
  capacity: number;
  tilt: number;
  azimuth: number;
}

export interface PredictionPoint {
  hour: number;
  power_kw: number;
}

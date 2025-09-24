
export enum PredictionModel {
    PHYSICS_BASED = 'Physics-based Model',
    ML_STATISTICAL = 'ML Statistical Model',
    DEEP_LEARNING = 'Deep Learning Model',
  }
  
  export interface SolarPanelConfig {
    latitude: number;
    longitude: number;
    capacity: number; // in kW
    tilt: number; // in degrees
    azimuth: number; // in degrees
    model: PredictionModel;
  }
  
  export interface ForecastDataPoint {
    time: string; // e.g., "00:00", "01:00"
    power: number; // in kW
  }
  
  // FIX: Add and export the ChatMessage interface to resolve missing type errors.
  export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
  }
  
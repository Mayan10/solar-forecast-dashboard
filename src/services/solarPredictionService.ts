
// FIX: Removed file extension from import path to resolve module loading error.
import { SolarPanelConfig, ForecastDataPoint, PredictionModel } from '../types';

/**
 * Generates a smooth, idealized solar curve based on a sine wave.
 * This represents a basic physics-based model, good for baseline estimates.
 */
const generatePhysicsModelOutput = (config: SolarPanelConfig): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  const sunriseHour = 6;
  const sunsetHour = 18;
  
  for (let i = 0; i < 24; i++) {
    let power = 0;
    if (i >= sunriseHour && i <= sunsetHour) {
      // Use a sine wave to simulate the sun's arc
      const angle = ((i - sunriseHour) / (sunsetHour - sunriseHour)) * Math.PI;
      power = Math.sin(angle) * config.capacity;
    }

    // Add some minimal noise to make it look more realistic
    const noise = (Math.random() - 0.5) * (config.capacity / 20);
    power = Math.max(0, power + noise);

    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      power: parseFloat(power.toFixed(2)),
    });
  }
  return data;
};


/**
 * Simulates a Statistical/ML model's output by introducing realistic variations.
 * This model accounts for simulated weather data (like cloud cover) that a real
 * XGBoost or Random Forest model would be trained on. The output is less smooth
 * than a pure physics model.
 */
const generateMlModelOutput = (config: SolarPanelConfig): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  const sunriseHour = 6;
  const sunsetHour = 18;

  // Simulate cloud cover events that an ML model would predict from weather data.
  // These create dips in power generation.
  const cloudEvents = [
      { start: 10, end: 11, reduction: 0.4 + Math.random() * 0.2 }, // 40-60% reduction
      { start: 14, end: 15.5, reduction: 0.3 + Math.random() * 0.3 }, // 30-60% reduction
  ];

  for (let i = 0; i < 24; i++) {
    let power = 0;
    if (i >= sunriseHour && i <= sunsetHour) {
      const angle = ((i - sunriseHour) / (sunsetHour - sunriseHour)) * Math.PI;
      power = Math.sin(angle) * config.capacity;

      // Apply cloud cover reduction
      for (const event of cloudEvents) {
          if (i >= event.start && i < event.end) {
              power *= (1 - event.reduction);
          }
      }
    }
    
    // ML models might have slightly more variance based on more input features
    const noise = (Math.random() - 0.5) * (config.capacity / 15);
    power = Math.max(0, power + noise);

    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      power: parseFloat(power.toFixed(2)),
    });
  }
  return data;
};


/**
 * Simulates a deep learning model's output. This model might capture more
 * complex, non-linear relationships, resulting in a more detailed and
 * potentially spikier forecast curve.
 */
const generateDeepLearningModelOutput = (config: SolarPanelConfig): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  const sunriseHour = 6.25; // More precise timing
  const sunsetHour = 17.75;

  // Simulate sharper, more detailed atmospheric events
  const atmosphericEvents = [
      { hour: 9.5, reduction: 0.3, duration: 0.5 },
      { hour: 13, reduction: 0.7, duration: 1 },
      { hour: 16, reduction: 0.2, duration: 0.75 },
  ];

  for (let i = 0; i < 24; i++) {
    let power = 0;
    if (i >= sunriseHour && i <= sunsetHour) {
        const daylightHours = sunsetHour - sunriseHour;
        const hoursPastSunrise = i - sunriseHour;
        const angle = (hoursPastSunrise / daylightHours) * Math.PI;
        // Deep learning might predict a slightly different peak efficiency
        power = Math.sin(angle) * config.capacity * 1.02; 

        // Apply atmospheric event reductions
        for (const event of atmosphericEvents) {
            if (i >= event.hour && i < event.hour + event.duration) {
                power *= (1 - event.reduction);
            }
        }
    }
    
    // Deep learning models might capture finer, high-frequency fluctuations
    const fineDetailFluctuation = Math.sin(i * 2.5 + config.latitude) * (config.capacity / 40);
    power = Math.max(0, power + fineDetailFluctuation);

    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      power: parseFloat(power.toFixed(2)),
    });
  }
  return data;
};


/**
 * Simulates a solar power prediction API call.
 * This function generates a realistic-looking 24-hour solar power curve
 * based on the selected prediction model.
 */
export const predictSolarOutput = (config: SolarPanelConfig): Promise<ForecastDataPoint[]> => {
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
      let data: ForecastDataPoint[];
      switch (config.model) {
        case PredictionModel.ML_STATISTICAL:
          data = generateMlModelOutput(config);
          break;
        case PredictionModel.DEEP_LEARNING:
          data = generateDeepLearningModelOutput(config);
          break;
        case PredictionModel.PHYSICS_BASED:
        default:
          data = generatePhysicsModelOutput(config);
          break;
      }
      resolve(data);
    }, 1500);
  });
};
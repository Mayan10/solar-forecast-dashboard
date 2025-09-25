import type { PanelConfig, PredictionPoint } from '../types';

export async function getSolarPrediction(config: PanelConfig): Promise<PredictionPoint[]> {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      // Try to parse the error message from the backend
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // The response was not JSON, stick with the status text
      }
      throw new Error(errorMessage);
    }

    const data: PredictionPoint[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching prediction from backend:", error);
    // Re-throw the error so the UI component can catch it
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
}

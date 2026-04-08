export interface HourlyPrice {
  hour: string; // "00-01", "01-02", etc.
  price: number; // €/kWh
  isCapped?: boolean;
}

export interface ElectricityData {
  date: string;
  now: number;
  average: number;
  min: { price: number; time: string };
  max: { price: number; time: string };
  hourly: HourlyPrice[];
  source?: string;
  updatedAt?: string;
}

export async function getElectricityPrices(): Promise<ElectricityData> {
  try {
    const response = await fetch('/api/precios-luz', {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const apiData = await response.json();

    if (apiData.error) {
      throw new Error(apiData.error);
    }

    return {
      date: apiData.date,
      now: apiData.now,
      average: apiData.average,
      min: apiData.min,
      max: apiData.max,
      hourly: apiData.hourly,
      source: apiData.source,
      updatedAt: apiData.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching electricity prices:', error);
    
    // Fallback to sample data if API fails
    const prices: number[] = [
      0.07960, 0.08957, 0.08616, 0.07926, 0.08678, 0.10176, 0.11121, 0.13404,
      0.15049, 0.12427, 0.17237, 0.15534, 0.15686, 0.15317, 0.08561, 0.08754,
      0.09796, 0.13033, 0.24084, 0.28096, 0.27663, 0.25874, 0.18902, 0.17891
    ];

    const hourly: HourlyPrice[] = prices.map((p, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00 - ${(i + 1).toString().padStart(2, '0')}:00`,
      price: p
    }));

    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
      date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      now: prices[new Date().getHours()] || prices[0],
      average,
      min: { price: Math.min(...prices), time: '00:00 - 01:00' },
      max: { price: Math.max(...prices), time: '20:00 - 21:00' },
      hourly,
      source: 'fallback',
    };
  }
}

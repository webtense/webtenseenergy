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
}

/**
 * Fetches electricity price data.
 * For this demo/future date (2026), it returns the specific data from the reference screenshot.
 * In a real scenario, this would call ESIOS or preciodelaluz.org API.
 */
export async function getElectricityPrices(_dateStr: string = "2026-03-20"): Promise<ElectricityData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Screenshot Data for 2026-03-20
  const prices: number[] = [
    0.07960, 0.08957, 0.08616, 0.07926, 0.08678, 0.10176, 0.11121, 0.13404, // 00-08
    0.15049, 0.12427, 0.17237, 0.15534, 0.15686, 0.15317, 0.08561, 0.08754, // 08-16
    0.09796, 0.13033, 0.24084, 0.28096, 0.27663, 0.25874, 0.18902, 0.17891  // 16-00
  ];

  const hourly: HourlyPrice[] = prices.map((p, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00 - ${(i + 1).toString().padStart(2, '0')}:00`,
    price: p
  }));

  // Current hour for "now" (simulating 12:41 as per system time)
  const currentHour = 12;
  const now = prices[currentHour];

  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  let minPrice = prices[0];
  let minTime = "00:00 - 01:00";
  let maxPrice = prices[0];
  let maxTime = "00:00 - 01:00";

  prices.forEach((p, i) => {
    if (p < minPrice) {
      minPrice = p;
      minTime = `${i.toString().padStart(2, '0')}:00 y las ${(i + 1).toString().padStart(2, '0')}:00`;
    }
    if (p > maxPrice) {
      maxPrice = p;
      maxTime = `${i.toString().padStart(2, '0')}:00 y las ${(i + 1).toString().padStart(2, '0')}:00`;
    }
  });

  return {
    date: "Viernes, 20 de marzo de 2026",
    now,
    average,
    min: { price: minPrice, time: minTime },
    max: { price: maxPrice, time: maxTime },
    hourly
  };
}

"use client";

import { useEffect, useState } from 'react';
import styles from './ElectricityDashboard.module.css';
import { getElectricityPrices, ElectricityData } from '@/lib/electricity-api';

export default function ElectricityDashboard() {
  const [data, setData] = useState<ElectricityData | null>(null);
  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getElectricityPrices();
        setData(result);
      } catch (error) {
        console.error("Error fetching electricity prices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Tax multiplier (approx 25% for Spain standard: 21% VAT + 5% IEE approx)
  const taxMultiplier = includeTaxes ? 1.25 : 1;

  const formatPrice = (p: number) => {
    return (p * taxMultiplier).toFixed(5);
  };

  const morning = data.hourly.slice(8, 16);
  const afternoon = data.hourly.slice(16, 24);
  const night = [...data.hourly.slice(0, 8)];

  // Night slice correction: the screenshot shows "Por la noche" starting at 00:00.
  // Morning: 08:00 - 16:00
  // Afternoon: 16:00 - 00:00 (which is 24:00)
  // Night: 00:00 - 08:00

  const getPriceColor = (price: number) => {
    if (price === data.min.price) return styles.priceGreen;
    if (price === data.max.price) return styles.priceRed;
    if (price < data.average) return styles.priceGreen;
    if (price > data.average * 1.2) return styles.priceRed;
    return '';
  };

  // Special Iberdrola message logic
  // "Aprovecha entre las 16:00 y las 21:00..."
  const lowHoursStart = 16;
  const lowHoursEnd = 21;
  const tipMessage = `Aprovecha entre las ${lowHoursStart}:00 y las ${lowHoursEnd}:00 para cocinar y utilizar tus electrodomésticos ya que el precio de la luz es ligeramente más bajo.`;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.dateTitle}>{data.date}</h1>
        
        <div className={styles.toggleContainer}>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={includeTaxes} 
              onChange={(e) => setIncludeTaxes(e.target.checked)} 
            />
            <span className={styles.slider}></span>
          </label>
          <span>Incluir impuestos</span>
        </div>
      </header>

      <div className={styles.alertBox}>
        <span className="text-xl">ℹ</span>
        <p>{tipMessage}</p>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.cardTitle}>Precio ahora mismo</span>
          <span className={styles.cardPrice}>{formatPrice(data.now)}€/kWh</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.cardTitle}>Precio medio del día</span>
          <span className={styles.cardPrice}>{formatPrice(data.average)}€/kWh</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.cardTitle}>Precio más bajo del día</span>
          <span className={`${styles.cardPrice} ${styles.priceGreen}`}>
            ▾ {formatPrice(data.min.price)}€/kWh
          </span>
          <span className={styles.cardDetail}>Entre las {data.min.time}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.cardTitle}>Precio más alto del día</span>
          <span className={`${styles.cardPrice} ${styles.priceRed}`}>
            ▴ {formatPrice(data.max.price)}€/kWh
          </span>
          <span className={styles.cardDetail}>Entre las {data.max.time}</span>
        </div>
      </div>

      <div className={styles.detailGrid}>
        {/* Morning Column */}
        <div className={styles.periodColumn}>
          <h2 className={styles.periodTitle}>Por la mañana</h2>
          <div className="space-y-1">
            {morning.map((h, i) => (
              <div key={i} className={styles.priceRow}>
                <span className={styles.hour}>{h.hour}</span>
                <span className={`${styles.price} ${getPriceColor(h.price)}`}>{formatPrice(h.price)}€/kWh</span>
              </div>
            ))}
          </div>
        </div>

        {/* Afternoon Column */}
        <div className={styles.periodColumn}>
          <h2 className={styles.periodTitle}>Por la tarde</h2>
          <div className="space-y-1">
            {afternoon.map((h, i) => (
              <div key={i} className={styles.priceRow}>
                <span className={styles.hour}>{h.hour}</span>
                <span className={`${styles.price} ${getPriceColor(h.price)}`}>{formatPrice(h.price)}€/kWh</span>
              </div>
            ))}
          </div>
        </div>

        {/* Night Column */}
        <div className={styles.periodColumn}>
          <h2 className={styles.periodTitle}>Por la noche</h2>
          <div className="space-y-1">
            {night.map((h, i) => (
              <div key={i} className={styles.priceRow}>
                <span className={styles.hour}>{h.hour}</span>
                <span className={`${styles.price} ${getPriceColor(h.price)}`}>{formatPrice(h.price)}€/kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

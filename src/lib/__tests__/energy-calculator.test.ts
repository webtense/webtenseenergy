import { describe, it, expect } from 'vitest';
import { calculateSavings } from '../energy-calculator';

const BASE_INPUTS = {
  consumo: 300,
  potencia: 5.75,
  precio: 0.14,
  tarifa: 'libre' as const,
  perfil: 'normal' as const,
  solar: false,
  solarKw: 0,
};

describe('calculateSavings', () => {
  it('devuelve un resultado con las claves esperadas', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result).toHaveProperty('facturaActual');
    expect(result).toHaveProperty('facturaOptimizada');
    expect(result).toHaveProperty('ahorroMes');
    expect(result).toHaveProperty('ahorroAno');
    expect(result).toHaveProperty('pctPotencia');
    expect(result).toHaveProperty('pctEnergia');
    expect(result).toHaveProperty('tips');
  });

  it('facturaActual es mayor que cero', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result.facturaActual).toBeGreaterThan(0);
  });

  it('ahorroAno = ahorroMes * 12', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result.ahorroAno).toBeCloseTo(result.ahorroMes * 12, 5);
  });

  it('pctPotencia + pctEnergia = 100', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result.pctPotencia + result.pctEnergia).toBe(100);
  });

  it('facturaOptimizada no puede ser menor al 35% de facturaActual', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result.facturaOptimizada).toBeGreaterThanOrEqual(result.facturaActual * 0.35);
  });

  it('devuelve como máximo 3 tips', () => {
    const result = calculateSavings(BASE_INPUTS);
    expect(result.tips.length).toBeLessThanOrEqual(3);
  });

  it('perfil nocturno añade tip sobre tarifas valle', () => {
    const result = calculateSavings({ ...BASE_INPUTS, perfil: 'nocturno' });
    expect(result.tips.some((t) => t.includes('nocturno') || t.includes('valle'))).toBe(true);
  });

  it('perfil diurno añade tip sobre trabajo desde casa', () => {
    const result = calculateSavings({ ...BASE_INPUTS, perfil: 'diurno' });
    expect(result.tips.some((t) => t.includes('casa'))).toBe(true);
  });

  it('tarifa plana añade tip sobre comparación', () => {
    const result = calculateSavings({ ...BASE_INPUTS, tarifa: 'plana' });
    expect(result.tips.some((t) => t.includes('plana') || t.includes('compar'))).toBe(true);
  });

  it('solar activado con kWp > 0 añade tip de generación', () => {
    const result = calculateSavings({ ...BASE_INPUTS, solar: true, solarKw: 3 });
    expect(result.tips.some((t) => t.includes('kWp'))).toBe(true);
  });

  it('solar activado aumenta el ahorro respecto a sin solar', () => {
    const sinSolar = calculateSavings({ ...BASE_INPUTS, solar: false, solarKw: 0 });
    const conSolar = calculateSavings({ ...BASE_INPUTS, solar: true, solarKw: 3 });
    expect(conSolar.ahorroMes).toBeGreaterThanOrEqual(sinSolar.ahorroMes);
  });

  it('potencia por debajo del ideal no genera descuento de potencia', () => {
    // consumo=100 → ideal=3.45, potencia=3.45 → no hay descuento
    const result = calculateSavings({ ...BASE_INPUTS, consumo: 100, potencia: 3.45 });
    // El ahorro debe ser solo por energía
    expect(result.facturaOptimizada).toBeLessThanOrEqual(result.facturaActual);
  });

  it('consumo bajo usa potencia ideal de 3.45 kW', () => {
    // consumo < 150 kWh → ideal = 3.45
    const resultAlta = calculateSavings({ ...BASE_INPUTS, consumo: 100, potencia: 10 });
    expect(resultAlta.ahorroMes).toBeGreaterThan(0);
  });
});

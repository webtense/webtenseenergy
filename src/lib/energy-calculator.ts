import type { CalculadoraInputs, CalculadoraResultado, PerfilConsumo } from "@/types/energy";

const PRECIO_POTENCIA_DIA = 0.115478;
const IMPUESTO_ELECTRICO = 0.0511269;
const ALQUILER_CONTADOR = 0.026855;
const IVA = 0.21;
const DIAS_MES = 30;

const DESCUENTO_PERFIL: Record<PerfilConsumo, number> = {
  normal: 0.07,
  diurno: 0.05,
  nocturno: 0.14,
  fin: 0.1,
};

export function calculateSavings(inputs: CalculadoraInputs): CalculadoraResultado {
  const { consumo, potencia, precio, tarifa, perfil, solar, solarKw } = inputs;
  const terminoPotencia = potencia * PRECIO_POTENCIA_DIA * DIAS_MES;
  const terminoEnergia = consumo * precio;
  const impuestoElectricidad = (terminoPotencia + terminoEnergia) * IMPUESTO_ELECTRICO;
  const alquilerContador = ALQUILER_CONTADOR * DIAS_MES;
  const baseIva = terminoPotencia + terminoEnergia + impuestoElectricidad + alquilerContador;
  const iva = baseIva * IVA;
  const facturaActual = baseIva + iva;

  const totalBase = terminoPotencia + terminoEnergia;
  const pctPotencia = Math.round((terminoPotencia / totalBase) * 100);
  const pctEnergia = 100 - pctPotencia;

  let descPotencia = 0;
  let descEnergia = 0;
  let descSolar = 0;
  const tips: string[] = [];

  const potenciaIdeal = consumo < 150 ? 3.45 : consumo < 300 ? 4.6 : 5.75;
  if (potencia > potenciaIdeal + 0.5) {
    descPotencia =
      (potencia - potenciaIdeal) * PRECIO_POTENCIA_DIA * DIAS_MES * (1 + IMPUESTO_ELECTRICO) * (1 + IVA);
    tips.push(`Bajar la potencia a ${potenciaIdeal} kW puede recortar el fijo mensual.`);
  }

  const descPerfilUnit = DESCUENTO_PERFIL[perfil];
  descEnergia = consumo * descPerfilUnit * (1 + IMPUESTO_ELECTRICO) * (1 + IVA);

  if (perfil === "nocturno") {
    tips.push("Tu perfil nocturno encaja bien con tarifas donde el tramo valle marque la diferencia.");
  } else if (perfil === "diurno") {
    tips.push("Si trabajas desde casa, conviene estudiar tarifas más estables y optimizar equipos en segundo plano.");
  } else if (perfil === "fin") {
    tips.push("Si concentras consumo los fines de semana, merece la pena revisar discriminación horaria real.");
  } else {
    tips.push("Mover lavadora, lavavajillas y ACS a horas valle suele ser la mejora más rápida.");
  }

  if (tarifa === "plana") {
    descEnergia += consumo * 0.03 * (1 + IVA);
    tips.push("Las tarifas planas suelen esconder margen; merece la pena compararlas con consumo real.");
  }

  if (solar && solarKw > 0) {
    const genMensual = Math.min(solarKw * 120, consumo * 0.85);
    descSolar = genMensual * precio * (1 + IVA);
    tips.push(`Tus ${solarKw.toFixed(1)} kWp pueden reducir una parte importante del término variable.`);
  }

  const totalDesc = descPotencia + descEnergia + descSolar;
  const facturaOptimizada = Math.max(facturaActual - totalDesc, facturaActual * 0.35);
  const ahorroMes = facturaActual - facturaOptimizada;

  return {
    facturaActual,
    facturaOptimizada,
    ahorroMes,
    ahorroAno: ahorroMes * 12,
    pctPotencia,
    pctEnergia,
    tips: tips.slice(0, 3),
  };
}

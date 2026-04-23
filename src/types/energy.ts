export type TarifaMode = 'regulada' | 'libre' | 'plana';

export type PerfilConsumo = 'normal' | 'diurno' | 'nocturno' | 'fin';

export interface CalculadoraInputs {
  consumo: number;
  potencia: number;
  precio: number;
  tarifa: TarifaMode;
  perfil: PerfilConsumo;
  solar: boolean;
  solarKw: number;
}

export interface CalculadoraResultado {
  facturaActual: number;
  facturaOptimizada: number;
  ahorroMes: number;
  ahorroAno: number;
  pctPotencia: number;
  pctEnergia: number;
  tips: string[];
}

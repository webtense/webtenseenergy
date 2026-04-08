import { db } from "@/lib/db";

const DEFAULT_FLAGS = [
  { key: "blog", enabled: true, description: "Activa el modulo de blog publico." },
  { key: "ofertas", enabled: true, description: "Activa la pagina y gestion de ofertas." },
  { key: "newsletter", enabled: false, description: "Activa suscripcion y campanas de newsletter." },
  { key: "telegram", enabled: false, description: "Activa publicacion de deals en Telegram." },
];

const DEFAULT_SETTINGS: Array<{ key: string; value: string; locale: "ES" | "CA" }> = [
  {
    key: "home.hero.title",
    locale: "ES",
    value: "Eficiencia y control para tu negocio y hogar",
  },
  {
    key: "home.hero.subtitle",
    locale: "ES",
    value:
      "Soluciones energeticas personalizadas. Desde auditorias y reduccion de costes B2B, hasta domotica avanzada y ahorro para particulares.",
  },
  {
    key: "home.hero.title",
    locale: "CA",
    value: "Efiencia i control per al teu negoci i llar",
  },
  {
    key: "home.hero.subtitle",
    locale: "CA",
    value:
      "Solucions energetiques personalitzades. Des d'auditories i reduccio de costos B2B, fins a domotica avancada i estalvi per a particulars.",
  },
];

export async function ensureAdminDefaults() {
  for (const flag of DEFAULT_FLAGS) {
    await db.featureFlag.upsert({
      where: { key: flag.key },
      create: flag,
      update: {},
    });
  }

  for (const setting of DEFAULT_SETTINGS) {
    await db.siteSetting.upsert({
      where: { key: `${setting.key}:${setting.locale}` },
      create: {
        key: `${setting.key}:${setting.locale}`,
        locale: setting.locale,
        value: setting.value,
      },
      update: {},
    });
  }
}

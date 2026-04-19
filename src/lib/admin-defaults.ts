import { db } from "@/lib/db";

export const DEFAULT_FLAGS = [
  { key: "blog", enabled: true, description: "Activa el modulo de blog publico." },
  { key: "ofertas", enabled: true, description: "Activa la pagina y gestion de ofertas." },
  { key: "newsletter", enabled: false, description: "Activa suscripcion y campanas de newsletter." },
  { key: "telegram", enabled: false, description: "Activa publicacion de deals en Telegram." },
];

export const DEFAULT_SETTINGS: Array<{ key: string; value: string; locale: "ES" | "CA" }> = [
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
  {
    key: "newsletter.title",
    locale: "ES",
    value: "Boletin Webtense",
  },
  {
    key: "newsletter.subtitle",
    locale: "ES",
    value: "Recibe ideas practicas sobre ahorro, precio de la luz, domotica y recomendaciones seleccionadas.",
  },
  {
    key: "newsletter.legal",
    locale: "ES",
    value: "Acepto recibir comunicaciones de Webtense Energy y puedo darme de baja en cualquier momento.",
  },
  {
    key: "footer.description",
    locale: "ES",
    value: "Transformamos la manera en que hogares y empresas consumen energia. Analisis tecnicos, domotica avanzada y eficiencia energetica real.",
  },
  {
    key: "newsletter.title",
    locale: "CA",
    value: "Butlleti Webtense",
  },
  {
    key: "newsletter.subtitle",
    locale: "CA",
    value: "Rep idees practiques sobre estalvi, preu de la llum, domotica i recomanacions seleccionades.",
  },
  {
    key: "newsletter.legal",
    locale: "CA",
    value: "Accepto rebre comunicacions de Webtense Energy i puc donar-me de baixa en qualsevol moment.",
  },
  {
    key: "footer.description",
    locale: "CA",
    value: "Transformem la manera com llars i empreses consumeixen energia. Analisi tecnica, domotica avancada i eficiencia real.",
  },
];

export function getDefaultSettingValue(key: string, locale: "ES" | "CA") {
  return DEFAULT_SETTINGS.find((setting) => setting.key === key && setting.locale === locale)?.value || "";
}

export function getDefaultSettingRecord(key: string, locale: "ES" | "CA") {
  return {
    key: `${key}:${locale}`,
    locale,
    value: getDefaultSettingValue(key, locale),
  };
}

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

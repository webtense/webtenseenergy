import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL no configurado");
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@webtenseenergy.com").toLowerCase();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const DEFAULT_FLAGS = [
  { key: "blog", enabled: true, description: "Activa el modulo de blog publico." },
  { key: "ofertas", enabled: true, description: "Activa la pagina y gestion de ofertas." },
  { key: "newsletter", enabled: false, description: "Activa suscripcion y campanas de newsletter." },
  { key: "telegram", enabled: false, description: "Activa publicacion de deals en Telegram." },
];

const DEFAULT_SETTINGS = [
  {
    key: "home.hero.title:ES",
    locale: "ES",
    value: "Eficiencia y control para tu negocio y hogar",
  },
  {
    key: "home.hero.subtitle:ES",
    locale: "ES",
    value:
      "Soluciones energeticas personalizadas. Desde auditorias y reduccion de costes B2B, hasta domotica avanzada y ahorro para particulares.",
  },
  {
    key: "home.hero.title:CA",
    locale: "CA",
    value: "Efiencia i control per al teu negoci i llar",
  },
  {
    key: "home.hero.subtitle:CA",
    locale: "CA",
    value:
      "Solucions energetiques personalitzades. Des d'auditories i reduccio de costos B2B, fins a domotica avancada i estalvi per a particulars.",
  },
];

if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD no configurado");
}

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const user = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    update: {
      username: ADMIN_USERNAME,
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  for (const flag of DEFAULT_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      create: flag,
      update: {
        description: flag.description,
      },
    });
  }

  for (const setting of DEFAULT_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: {
        value: setting.value,
        locale: setting.locale,
      },
    });
  }

  console.log(`Admin listo: ${user.email}`);
  console.log(`Feature flags base: ${DEFAULT_FLAGS.length}`);
  console.log(`Site settings base: ${DEFAULT_SETTINGS.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

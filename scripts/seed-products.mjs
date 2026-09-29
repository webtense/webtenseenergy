import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const AFFILIATE_TAG = "semillasdet02-21"; // Tu Amazon affiliate tag

const products = [
  {
    title: "Panel Solar Monocristalino 400W JA Solar",
    asin: "B0CXYZ12345",
    categoryId: "paneles-solares",
    rating: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/71MzJy3TGPL._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0CXYZ12345?tag=${AFFILIATE_TAG}`,
    pros: [
      "Eficiencia 22%+",
      "Garantía 25 años",
      "Instalación simple",
      "Certificado IEC",
    ],
    cons: [
      "Peso: 22kg por unidad",
      "Requiere estructura de montaje",
    ],
    price: 189.99,
    description:
      "Panel solar de alta eficiencia perfecto para instalaciones residenciales y pequeñas comerciales.",
  },
  {
    title: "Inversor Solar Fronius Primo 5.0 (5kW)",
    asin: "B0D1ABC45678",
    categoryId: "inversores",
    rating: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/91ABCDEF1234._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0D1ABC45678?tag=${AFFILIATE_TAG}`,
    pros: [
      "WiFi integrado",
      "Monitorización por app",
      "Garantía 10 años",
      "Rendimiento 98%",
    ],
    cons: [
      "Instalación profesional recomendada",
      "Precio elevado",
    ],
    price: 2499.0,
    description:
      "Inversor trifásico inteligente con monitorización en tiempo real y conectividad total.",
  },
  {
    title: "Batería Solar LiFePO4 10kWh Growatt",
    asin: "B0D2XYZ78901",
    categoryId: "baterias",
    rating: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/81GROWATT123._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0D2XYZ78901?tag=${AFFILIATE_TAG}`,
    pros: [
      "Batería de ciclo completo",
      "Garantía 10 años",
      "Compatible con múltiples inversores",
      "Eficiencia de carga 95%",
    ],
    cons: [
      "Instalación eléctrica compleja",
      "Requiere BMS profesional",
    ],
    price: 3999.0,
    description:
      "Batería LiFePO4 de alta capacidad para almacenamiento solar residencial.",
  },
  {
    title: "Medidor Smart Shelly EM3 (100A)",
    asin: "B0D3SHELLY12",
    categoryId: "monitoreo",
    rating: 4,
    imageUrl:
      "https://m.media-amazon.com/images/I/61SHELLY1234._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0D3SHELLY12?tag=${AFFILIATE_TAG}`,
    pros: [
      "WiFi nativo",
      "Integración Home Assistant",
      "Precisión ±1%",
      "Hasta 3 fases",
      "Precio muy competitivo",
    ],
    cons: [
      "Instalación requiere electricista",
      "Documentación limitada en español",
    ],
    price: 89.99,
    description:
      "Medidor inteligente de tres fases perfecto para monitorizar el consumo energético.",
  },
  {
    title: "Estructura de Montaje Solar 6 Placas",
    asin: "B0D4ESTRUCTU",
    categoryId: "accesorios",
    rating: 4,
    imageUrl:
      "https://m.media-amazon.com/images/I/71ESTRUCTURA._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0D4ESTRUCTU?tag=${AFFILIATE_TAG}`,
    pros: [
      "Aluminio anodizado",
      "Ángulo ajustable",
      "Fácil instalación",
      "Soporta hasta 150kg",
    ],
    cons: [
      "Requiere taladros en techo",
      "Tornillería no incluida",
    ],
    price: 249.99,
    description:
      "Soporte profesional para 6 paneles solares con sistema de anclaje seguro.",
  },
  {
    title: "Cables Solares 6mm² (50m Rojo + 50m Negro)",
    asin: "B0D5CABLES6",
    categoryId: "accesorios",
    rating: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/81CABLES1234._SX679_.jpg",
    affiliateUrl: `https://amazon.es/dp/B0D5CABLES6?tag=${AFFILIATE_TAG}`,
    pros: [
      "Certificado TÜV",
      "Protección UV",
      "Flexible",
      "Conectores MC4 incluidos",
    ],
    cons: [
      "Longitud única (100m total)",
    ],
    price: 79.99,
    description:
      "Cable solar certificado de calidad industrial con conectores MC4.",
  },
];

async function main() {
  console.log("🌱 Iniciando seed de productos...");

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      const existing = await db.productReview.findUnique({
        where: { asin: product.asin },
      });

      if (existing) {
        console.log(`⏭️  Saltando ${product.title} (ya existe)`);
        skipped++;
        continue;
      }

      await db.productReview.create({
        data: product,
      });

      console.log(`✅ Creado: ${product.title}`);
      created++;
    } catch (error) {
      console.error(`❌ Error con ${product.title}:`, error);
    }
  }

  console.log(
    `\n📊 Seed completado: ${created} creados, ${skipped} saltados`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

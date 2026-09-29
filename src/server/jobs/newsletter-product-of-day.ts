import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'info@webtenseenergy.com';
const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'semillasdet02-21';

export async function sendProductOfDayNewsletter() {
  try {
    // 1. Obtener producto aleatorio
    const productCount = await db.productReview.count();
    if (productCount === 0) {
      console.warn('No hay productos registrados para enviar');
      return;
    }

    const randomIndex = Math.floor(Math.random() * productCount);
    const product = await db.productReview.findFirst({
      skip: randomIndex,
      take: 1,
    });

    if (!product) return;

    // 2. Obtener suscriptores activos
    const subscribers = await db.subscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      console.log('Sin suscriptores activos');
      return;
    }

    // 3. Crear transporter SMTP
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 4. Renderizar HTML
    const prosHtml = product.pros
      .slice(0, 3)
      .map((p) => `<li>${p}</li>`)
      .join('');

    const consHtml = product.cons
      .slice(0, 2)
      .map((c) => `<li>${c}</li>`)
      .join('');

    const starsHtml = '⭐'.repeat(product.rating);

    const affiliateUrl = new URL(product.affiliateUrl);
    affiliateUrl.searchParams.set('utm_source', 'newsletter');
    affiliateUrl.searchParams.set('utm_campaign', 'product-of-day');
    affiliateUrl.searchParams.set('utm_medium', 'email');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1ab775 0%, #3b76f6 100%); color: white; padding: 30px 20px; border-radius: 8px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .content { padding: 30px 0; }
    .product-title { font-size: 22px; font-weight: bold; margin-bottom: 10px; }
    .rating { font-size: 18px; margin: 10px 0; }
    .price { font-size: 24px; font-weight: bold; color: #1ab775; margin: 10px 0; }
    .pros, .cons { margin: 15px 0; }
    .pros h4, .cons h4 { margin: 10px 0 5px 0; font-size: 14px; font-weight: bold; }
    .pros h4 { color: #16a34a; }
    .cons h4 { color: #dc2626; }
    ul { margin: 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .cta-button { display: inline-block; background: #1ab775; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .cta-button:hover { background: #129d5c; }
    .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☀️ Producto del Día</h1>
      <p>Tu recomendación diaria para optimizar tu energía</p>
    </div>

    <div class="content">
      <p>Hola,</p>
      <p>Hoy te recomendamos este producto que te ayudará en tu transición energética:</p>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div class="product-title">${product.title}</div>
        <div class="rating">${starsHtml} (${product.rating}/5)</div>
        ${product.price ? `<div class="price">€${product.price.toFixed(2)}</div>` : ''}

        ${
          product.pros.length > 0
            ? `<div class="pros">
          <h4>✓ Ventajas principales:</h4>
          <ul>${prosHtml}</ul>
        </div>`
            : ''
        }

        ${
          product.cons.length > 0
            ? `<div class="cons">
          <h4>⚠️ Consideraciones:</h4>
          <ul>${consHtml}</ul>
        </div>`
            : ''
        }
      </div>

      <a href="${affiliateUrl.toString()}" class="cta-button">Ver en Amazon</a>

      <p style="font-size: 14px; color: #666;">
        <strong>Nota:</strong> Este enlace incluye nuestro identificador de afiliado de Amazon.
        No tiene coste adicional para ti, pero nos ayuda a financiar este newsletter.
      </p>

      <p>¿Quieres que recomendemos otros productos? Responde a este email o contáctanos en nuestro sitio.</p>

      <p>Un saludo,<br/>Equipo WebTense Energy</p>
    </div>

    <div class="footer">
      <p>© 2026 WebTense Energy. Todos los derechos reservados.</p>
      <p><a href="https://webtenseenergy.com/privacidad" style="color: #666;">Privacidad</a> |
         <a href="https://webtenseenergy.com" style="color: #666;">Sitio Web</a></p>
    </div>
  </div>
</body>
</html>
`;

    // 5. Enviar a todos los suscriptores
    let sentCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: EMAIL_FROM,
          to: subscriber.email,
          subject: `☀️ Producto del Día: ${product.title}`,
          html,
          replyTo: EMAIL_FROM,
        });
        sentCount++;
      } catch (err) {
        console.error(`Error enviando a ${subscriber.email}:`, err);
        errorCount++;
      }
    }

    // 6. Registrar envío
    await db.emailLog.create({
      data: {
        channel: 'newsletter',
        destination: `${sentCount} subscribers`,
        subject: `Product of Day: ${product.title}`,
        status: errorCount === 0 ? 'SENT' : 'PARTIAL_ERROR',
        entityType: 'ProductReview',
        entityId: product.id,
        error: errorCount > 0 ? `${errorCount} failed` : null,
        sentAt: new Date(),
      },
    });

    console.log(
      `✅ Producto del Día enviado a ${sentCount} suscriptores (${errorCount} errores)`
    );
    return { sentCount, errorCount, productId: product.id };
  } catch (error) {
    console.error('Error en sendProductOfDayNewsletter:', error);
    throw error;
  }
}

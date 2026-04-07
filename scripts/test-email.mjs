import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('🔄 Conectando con SMTP...');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: '✅ Prueba de envío - WEBTENSE ENERGY',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ab775;">¡Prueba de envío exitosa!</h2>
          <p>El sistema de envío de emails está funcionando correctamente.</p>
          <hr style="margin: 20px 0;">
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Desde:</strong> ${process.env.EMAIL_FROM}</p>
          <p><strong>Hacia:</strong> ${process.env.SMTP_USER}</p>
        </div>
      `,
    });

    console.log('✅ ¡Email enviado correctamente!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error al enviar:', error.message);
    process.exit(1);
  }
}

testEmail();

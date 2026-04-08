import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit, escapeHtml, getClientIp, hashIdentifier, isValidEmail, normalizeEmail } from '@/lib/security';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    const rate = checkRateLimit({
      key: `contacto:${hashIdentifier(getClientIp(request))}`,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes, prueba en unos minutos.' }, { status: 429 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const safeEmail = normalizeEmail(email);
    if (!isValidEmail(safeEmail)) {
      return NextResponse.json({ error: 'Email no valido' }, { status: 400 });
    }

    const safeName = escapeHtml(String(name).trim().slice(0, 120));
    const safeSubject = escapeHtml(String(subject || '').replace(/[\r\n]/g, ' ').trim().slice(0, 160));
    const safePhone = escapeHtml(String(phone || '').trim().slice(0, 40));
    const safeMessage = escapeHtml(String(message).trim().slice(0, 5000));

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      replyTo: safeEmail,
      to: process.env.EMAIL_FROM || 'info@webtenseenergy.com',
      subject: `Nuevo mensaje web: ${safeSubject || 'Sin asunto'} de ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ab775;">Nueva solicitud desde WebtenseEnergy</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeEmail}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safePhone || 'No indicado'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Asunto:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeSubject || 'Sin asunto'}</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <h3>Mensaje:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn('SMTP no configurado. Simulando envío:', { name: safeName, email: safeEmail, subject: safeSubject });
    }

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error procesando el formulario:', error);
    return NextResponse.json({ error: 'Hubo un error al enviar el correo' }, { status: 500 });
  }
}

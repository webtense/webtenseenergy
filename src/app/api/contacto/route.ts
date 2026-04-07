import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      replyTo: email,
      to: process.env.EMAIL_FROM || 'info@webtenseenergy.com',
      subject: `Nuevo mensaje web: ${subject} de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ab775;">Nueva solicitud desde WebtenseEnergy</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone || 'No indicado'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Asunto:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject}</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <h3>Mensaje:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        </div>
      `,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn('SMTP no configurado. Simulando envío:', { name, email, subject });
    }

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error procesando el formulario:', error);
    return NextResponse.json({ error: 'Hubo un error al enviar el correo' }, { status: 500 });
  }
}

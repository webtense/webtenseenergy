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

interface AuditData {
  method: 'upload' | 'manual';
  fileName?: string;
  kwConsumed?: string;
  habits: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

const HABIT_LABELS: Record<string, string> = {
  trabajo_casa: 'Trabajo desde casa',
  consumo_noche: 'Consumo principal de noche',
  cocina_electrica: 'Cocina y horno eléctrico',
  coche_electrico: 'Coche eléctrico enchufable',
  aerotermia: 'Tengo Aerotermia o Bomba de calor',
  frigorificos_extra: 'Más de un frigorífico/congelador',
};

export async function POST(request: Request) {
  try {
    const data: AuditData = await request.json();

    if (!data.contact?.name || !data.contact?.email) {
      return NextResponse.json({ error: 'Faltan datos de contacto obligatorios' }, { status: 400 });
    }

    const habitsText = data.habits.length > 0
      ? data.habits.map(h => HABIT_LABELS[h] || h).join(', ')
      : 'Ninguno';

    const analysisMethod = data.method === 'upload'
      ? `Subida de factura: ${data.fileName || 'Archivo'}`
      : `Consumo manual: ${data.kwConsumed || 'No especificado'} kWh`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      replyTo: data.contact.email,
      to: process.env.EMAIL_FROM || 'info@webtenseenergy.com',
      subject: `Nueva solicitud estudio energético: ${data.contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ab775;">Nueva Solicitud de Estudio Energético</h2>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h3 style="margin-top: 20px; color: #0f935d;">Datos de Contacto</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.contact.name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.contact.email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.contact.phone || 'No indicado'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Compañía actual:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.contact.company || 'No indicada'}</td></tr>
          </table>

          <h3 style="margin-top: 20px; color: #0f935d;">Análisis Solicitado</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Método:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${analysisMethod}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Hábitos seleccionados:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${habitsText}</td></tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #effdf5; border-radius: 8px;">
            <p style="margin: 0; color: #0f935d;"><strong>⏰ Prioridad:</strong> Responder en menos de 24 horas</p>
          </div>
        </div>
      `,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn('SMTP no configurado. Simulando envío de estudio:', data.contact);
    }

    return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Error procesando estudio energético:', error);
    return NextResponse.json({ error: 'Hubo un error al procesar la solicitud' }, { status: 500 });
  }
}

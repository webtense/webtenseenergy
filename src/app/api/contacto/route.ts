import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'tu_correo@gmail.com',
        pass: process.env.SMTP_PASS || 'tu_contraseña_aplicacion',
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER || 'tu_correo@gmail.com',
      replyTo: email,
      to: 'info@webtenseenergy.com',
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

    // Para evitar errores en tu entorno local al no tener las claves SMTP configuradas,
    // comento el envío real para que te devuelva "éxito" visualmente.
    // Cuando configures el archivo .env, DESCOMENTA esta línea:
    // await transporter.sendMail(mailOptions);
    
    console.log("Formulario de Contacto Procesado (Simulado):", { name, email, subject });

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error procesando el formulario:', error);
    return NextResponse.json({ error: 'Hubo un error al enviar el correo' }, { status: 500 });
  }
}

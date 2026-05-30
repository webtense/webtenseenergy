import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { escapeHtml, normalizeEmail } from '@/lib/security';
import {
  getRequestIpHash,
  getRequestLocale,
  getRequestOriginPath,
  getRequestUserAgent,
} from '@/server/services/public-form-context';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type SubmitStudyInput = {
  request: Request;
  method: string;
  kwConsumed: string;
  habits: string[];
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType?: string;
  city?: string;
  preferredTime?: string;
  invoiceFile?: {
    name: string;
    type: string;
    size: number;
    buffer: Buffer;
  } | null;
  habitsText: string;
  analysisMethod: string;
};

export async function submitStudyRequest(input: SubmitStudyInput) {
  const locale = getRequestLocale(input.request);
  const originPath = getRequestOriginPath(input.request);
  const ipHash = getRequestIpHash(input.request);
  const userAgent = getRequestUserAgent(input.request);
  const normalizedEmail = normalizeEmail(input.email);
  const safeName = escapeHtml(input.name.trim().slice(0, 120));
  const safePhone = escapeHtml(input.phone.trim().slice(0, 40));
  const safeCompany = escapeHtml(input.company.trim().slice(0, 120));
  const safeKwConsumed = escapeHtml(input.kwConsumed.slice(0, 20));
  const safeBusinessType = escapeHtml((input.businessType ?? '').slice(0, 80));
  const safeCity = escapeHtml((input.city ?? '').slice(0, 120));
  const preferredTimeLabels: Record<string, string> = {
    morning: 'Mañana 9-13h',
    afternoon: 'Tarde 15-19h',
    anytime: 'Cualquier hora',
  };
  const preferredTimeLabel =
    preferredTimeLabels[input.preferredTime ?? 'anytime'] ?? 'Cualquier hora';

  const study = await db.studyRequest.create({
    data: {
      method: input.method,
      fileName: input.invoiceFile?.name || null,
      fileMimeType: input.invoiceFile?.type || null,
      fileSizeBytes: input.invoiceFile?.size || null,
      kwConsumed: safeKwConsumed || null,
      habits: JSON.stringify(input.habits),
      name: safeName,
      email: normalizedEmail,
      phone: safePhone || null,
      company: safeCompany || null,
      source: 'estudio',
      locale,
      originPath,
      ipHash,
      userAgent,
    },
  });

  const attachments: nodemailer.SendMailOptions['attachments'] = [];
  if (input.invoiceFile) {
    attachments.push({
      filename: input.invoiceFile.name,
      content: input.invoiceFile.buffer,
      contentType: input.invoiceFile.type,
    });
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    replyTo: normalizedEmail,
    to: process.env.EMAIL_FROM || 'info@webtenseenergy.com',
    subject: `Nueva solicitud estudio energetico: ${safeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1ab775;">Nueva Solicitud de Estudio Energetico</h2>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>

        <h3 style="margin-top: 20px; color: #0f935d;">Datos de Contacto</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${normalizedEmail}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telefono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${safePhone || 'No indicado'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Compania actual:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeCompany || 'No indicada'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tipo de negocio:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeBusinessType || 'No indicado'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Ciudad / Provincia:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${safeCity || 'No indicada'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Horario preferido:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${preferredTimeLabel}</td></tr>
        </table>

        <h3 style="margin-top: 20px; color: #0f935d;">Analisis solicitado</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Metodo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${input.analysisMethod}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Habitos seleccionados:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${input.habitsText}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Factura adjunta:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${input.invoiceFile ? 'Si' : 'No'}</td></tr>
        </table>
      </div>
    `,
    attachments,
  };

  let status = 'skipped';
  let error: string | null = null;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      await transporter.sendMail(mailOptions);
      status = 'sent';
    } catch (sendError) {
      status = 'failed';
      error = sendError instanceof Error ? sendError.message : 'SMTP error';
      throw sendError;
    } finally {
      await db.emailLog.create({
        data: {
          channel: 'smtp',
          destination: String(mailOptions.to),
          subject: String(mailOptions.subject),
          status,
          entityType: 'StudyRequest',
          entityId: study.id,
          error,
          payload: JSON.stringify({ source: 'estudio', hasInvoice: Boolean(input.invoiceFile) }),
          sentAt: status === 'sent' ? new Date() : null,
        },
      });
    }
  } else {
    await db.emailLog.create({
      data: {
        channel: 'smtp',
        destination: String(mailOptions.to),
        subject: String(mailOptions.subject),
        status,
        entityType: 'StudyRequest',
        entityId: study.id,
        payload: JSON.stringify({
          source: 'estudio',
          simulated: true,
          hasInvoice: Boolean(input.invoiceFile),
        }),
      },
    });
  }

  return { study };
}

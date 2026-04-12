import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { escapeHtml, normalizeEmail } from "@/lib/security";
import { getRequestIpHash, getRequestLocale, getRequestOriginPath, getRequestUserAgent } from "@/server/services/public-form-context";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export async function submitContactRequest(request: Request, payload: ContactPayload) {
  const safeEmail = normalizeEmail(payload.email);
  const safeName = escapeHtml(String(payload.name).trim().slice(0, 120));
  const safeSubject = escapeHtml(String(payload.subject || "").replace(/[\r\n]/g, " ").trim().slice(0, 160));
  const safePhone = escapeHtml(String(payload.phone || "").trim().slice(0, 40));
  const safeMessage = escapeHtml(String(payload.message).trim().slice(0, 5000));
  const locale = getRequestLocale(request);
  const originPath = getRequestOriginPath(request);
  const ipHash = getRequestIpHash(request);
  const userAgent = getRequestUserAgent(request);

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    replyTo: safeEmail,
    to: process.env.EMAIL_FROM || "info@webtenseenergy.com",
    subject: `Nuevo mensaje web: ${safeSubject || "Sin asunto"} de ${safeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1ab775;">Nueva solicitud desde WebtenseEnergy</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeEmail}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Telefono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safePhone || "No indicado"}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Asunto:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeSubject || "Sin asunto"}</td></tr>
        </table>
        <div style="margin-top: 20px;">
          <h3>Mensaje:</h3>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    `,
  };

  const lead = await db.lead.create({
    data: {
      name: safeName,
      email: safeEmail,
      phone: safePhone || null,
      subject: safeSubject || null,
      message: safeMessage,
      source: "contacto",
      locale,
      originPath,
      ipHash,
      userAgent,
    },
  });

  let status = "skipped";
  let error: string | null = null;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      await transporter.sendMail(mailOptions);
      status = "sent";
    } catch (sendError) {
      status = "failed";
      error = sendError instanceof Error ? sendError.message : "SMTP error";
      throw sendError;
    } finally {
      await db.emailLog.create({
        data: {
          channel: "smtp",
          destination: String(mailOptions.to),
          subject: String(mailOptions.subject),
          status,
          entityType: "Lead",
          entityId: lead.id,
          error,
          payload: JSON.stringify({ replyTo: safeEmail, source: "contacto" }),
          sentAt: status === "sent" ? new Date() : null,
        },
      });
    }
  } else {
    await db.emailLog.create({
      data: {
        channel: "smtp",
        destination: String(mailOptions.to),
        subject: String(mailOptions.subject),
        status,
        entityType: "Lead",
        entityId: lead.id,
        payload: JSON.stringify({ replyTo: safeEmail, source: "contacto", simulated: true }),
      },
    });
  }

  return { lead };
}

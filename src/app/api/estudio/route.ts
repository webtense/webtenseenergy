import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  hashIdentifier,
  isValidEmail,
  normalizeEmail,
} from "@/lib/security";
import { scanFile } from "@/lib/antivirus";

export const runtime = "nodejs";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const HABIT_LABELS: Record<string, string> = {
  trabajo_casa: "Trabajo desde casa",
  consumo_noche: "Consumo principal de noche",
  cocina_electrica: "Cocina y horno electrico",
  coche_electrico: "Coche electrico enchufable",
  aerotermia: "Tengo Aerotermia o Bomba de calor",
  frigorificos_extra: "Mas de un frigorifico/congelador",
};

function parseHabits(rawHabits: string | null): string[] {
  if (!rawHabits) return [];

  try {
    const parsed = JSON.parse(rawHabits);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }

  return [];
}

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit({
      key: `estudio:${hashIdentifier(getClientIp(request))}`,
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes, prueba de nuevo en unos minutos." },
        { status: 429 },
      );
    }

    const form = await request.formData();

    const method = String(form.get("method") || "manual");
    const kwConsumed = String(form.get("kwConsumed") || "");
    const habits = parseHabits(String(form.get("habits") || "[]"));
    const name = escapeHtml(String(form.get("name") || "").trim().slice(0, 120));
    const email = normalizeEmail(String(form.get("email") || "").trim());
    const phone = escapeHtml(String(form.get("phone") || "").trim().slice(0, 40));
    const company = escapeHtml(String(form.get("company") || "").trim().slice(0, 120));
    const invoiceFile = form.get("invoice");

    if (!name || !email) {
      return NextResponse.json(
        { error: "Faltan datos de contacto obligatorios" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email no valido" }, { status: 400 });
    }

    const habitsText = habits.length > 0 ? habits.map((h) => HABIT_LABELS[h] || h).join(", ") : "Ninguno";
    const hasInvoice = invoiceFile instanceof File && invoiceFile.size > 0;
    const safeKwConsumed = escapeHtml(String(kwConsumed || "").slice(0, 20));
    const analysisMethod =
      method === "upload"
        ? `Subida de factura: ${hasInvoice ? escapeHtml(invoiceFile.name) : "No se adjunto archivo"}`
        : `Consumo manual: ${safeKwConsumed || "No especificado"} kWh`;

    const attachments: nodemailer.SendMailOptions["attachments"] = [];

    if (hasInvoice && invoiceFile instanceof File) {
      const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedMimeTypes.includes(invoiceFile.type)) {
        return NextResponse.json(
          { error: "Formato de factura no permitido. Usa PDF, PNG o JPG." },
          { status: 400 },
        );
      }

      if (invoiceFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "La factura supera 5MB. Reduce el tamano e intentalo de nuevo." },
          { status: 400 },
        );
      }

      const arrayBuffer = await invoiceFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const scanResult = await scanFile(fileBuffer, invoiceFile.name);

      if (!scanResult.safe) {
        return NextResponse.json(
          { error: `Archivo no seguro: ${scanResult.threat}` },
          { status: 400 },
        );
      }

      attachments.push({
        filename: invoiceFile.name,
        content: fileBuffer,
        contentType: invoiceFile.type,
      });
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      replyTo: email,
      to: process.env.EMAIL_FROM || "info@webtenseenergy.com",
      subject: `Nueva solicitud estudio energetico: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ab775;">Nueva Solicitud de Estudio Energetico</h2>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>

          <h3 style="margin-top: 20px; color: #0f935d;">Datos de Contacto</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telefono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || "No indicado"}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Compania actual:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${company || "No indicada"}</td></tr>
          </table>

          <h3 style="margin-top: 20px; color: #0f935d;">Analisis solicitado</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Metodo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${analysisMethod}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Habitos seleccionados:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${habitsText}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Factura adjunta:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${hasInvoice ? "Si" : "No"}</td></tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #effdf5; border-radius: 8px;">
            <p style="margin: 0; color: #0f935d;"><strong>Prioridad:</strong> Responder en menos de 24 horas.</p>
          </div>
        </div>
      `,
      attachments,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP no configurado. Simulando envio de estudio:", {
        name,
        email,
        method,
        hasInvoice,
      });
    }

    return NextResponse.json({ success: true, message: "Solicitud enviada correctamente" });
  } catch (error) {
    console.error("Error procesando estudio energetico:", error);
    return NextResponse.json({ error: "Hubo un error al procesar la solicitud" }, { status: 500 });
  }
}

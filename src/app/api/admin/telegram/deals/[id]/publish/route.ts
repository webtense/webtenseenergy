import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";

interface Props {
  params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

async function sendToTelegram(channelId: string, botToken: string, caption: string) {
  const endpoint = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  const filePath = path.join(process.cwd(), "public", "images", "hero_home.png");
  const buffer = await readFile(filePath);
  const formData = new FormData();
  formData.append("chat_id", channelId);
  formData.append("caption", caption.slice(0, 1024));
  formData.append("parse_mode", "HTML");
  formData.append("photo", new Blob([buffer], { type: "image/png" }), "webtenseenergy.png");

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Telegram API error");
  }
}

export async function POST(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  if (!botToken || !channelId) {
    return NextResponse.json({ message: "Configura TELEGRAM_BOT_TOKEN y TELEGRAM_CHANNEL_ID en producción." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const deal = await db.telegramDeal.findUnique({ where: { id } });
    if (!deal) {
      return NextResponse.json({ message: "Borrador no encontrado." }, { status: 404 });
    }

    await sendToTelegram(channelId, botToken, deal.message);

    const updated = await db.telegramDeal.update({
      where: { id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });

    await db.telegramLog.create({
      data: {
        adminUserId: auth.user.id,
        action: "published",
        status: "ok",
        detail: `deal:${updated.id}`,
      },
    });

    return NextResponse.json({ ok: true, deal: updated });
  } catch (error) {
    console.error("Error publicando en Telegram:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "No se pudo publicar en Telegram." }, { status: 500 });
  }
}

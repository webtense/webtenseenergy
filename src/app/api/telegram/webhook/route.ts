import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scrapeAmazon } from '@/lib/amazon-scraper';
import { generateDealImage } from '@/lib/deal-image';

export const runtime = 'nodejs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID ?? '';
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? '';
// ID de Telegram del usuario administrador (quién puede enviar URLs al bot)
const ADMIN_TELEGRAM_ID = process.env.TELEGRAM_ADMIN_USER_ID ?? '';

async function reply(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendPhoto(chatId: string, imageBuffer: Buffer, caption: string) {
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('caption', caption.slice(0, 1024));
  form.append('parse_mode', 'HTML');
  form.append(
    'photo',
    new Blob([imageBuffer.buffer as ArrayBuffer], { type: 'image/jpeg' }),
    'deal.jpg'
  );
  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: form,
  });
  if (!r.ok) throw new Error(await r.text());
}

function buildCaption(product: Awaited<ReturnType<typeof scrapeAmazon>>) {
  if (!product) return '';
  const lines: string[] = [];

  if (product.discountPercent) {
    lines.push(`🔥 <b>-${product.discountPercent}%</b> — ¡Mínimo histórico!`);
  }

  lines.push(`\n<b>${product.title}</b>`);

  if (product.currentPrice) {
    const curr = product.currentPrice.toFixed(2).replace('.', ',');
    if (product.originalPrice) {
      const orig = product.originalPrice.toFixed(2).replace('.', ',');
      lines.push(`\n💰 <s>${orig} €</s>  →  <b>${curr} €</b>`);
    } else {
      lines.push(`\n💰 <b>${curr} €</b>`);
    }
  }

  lines.push(`\n🔗 <a href="${product.url}">Ver en Amazon</a>`);
  lines.push(`\n#chollo #domótica #energía`);

  return lines.join('\n');
}

async function processAmazonUrl(url: string, chatId: number) {
  try {
    await reply(chatId, '⏳ Scrapeando Amazon...');

    const product = await scrapeAmazon(url);
    if (!product) {
      await reply(chatId, '❌ No pude extraer el producto. ¿Es una URL válida de Amazon?');
      return;
    }

    await reply(
      chatId,
      `✅ Producto: ${product.title.slice(0, 80)}\n💶 Precio: ${product.currentPrice ?? '?'} €\nGenerando imagen...`
    );

    const imageBuffer = await generateDealImage(product);
    const caption = buildCaption(product);

    // Publica en el canal
    await sendPhoto(CHANNEL_ID, imageBuffer, caption);

    // Guarda en BD
    await db.telegramDeal.create({
      data: {
        title: product.title.slice(0, 250),
        message: caption,
        url: product.url,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    await reply(chatId, `🚀 Publicado en el canal @webtenseenergy`);
  } catch (err) {
    logger.error({ err }, 'Error procesando URL Amazon');
    await reply(chatId, `❌ Error: ${err instanceof Error ? err.message : 'desconocido'}`);
  }
}

export async function POST(req: NextRequest) {
  // Verificar secret del webhook
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = body?.message as Record<string, unknown> | undefined;
  if (!message?.text) return NextResponse.json({ ok: true });

  const text = message.text as string;
  const chatId = (message.chat as Record<string, unknown>)?.id as number;
  const fromId = String((message.from as Record<string, unknown>)?.id ?? '');

  // Solo el admin puede disparar publicaciones
  if (ADMIN_TELEGRAM_ID && fromId !== ADMIN_TELEGRAM_ID) {
    await reply(chatId, '⛔ No autorizado.');
    return NextResponse.json({ ok: true });
  }

  const amazonMatch = text.match(/https?:\/\/(?:www\.)?amazon\.(?:es|com|co\.uk|de|fr)[^\s]+/);
  if (!amazonMatch) return NextResponse.json({ ok: true });

  // Procesar en background (no bloquear la respuesta al webhook)
  void processAmazonUrl(amazonMatch[0], chatId);

  return NextResponse.json({ ok: true });
}

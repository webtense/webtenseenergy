import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import type { Campaign, CampaignBlock, Subscriber } from '@prisma/client';
import { db } from '@/lib/db';
import { createAuditLog } from '@/server/services/audit-log';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EditableCampaign = Campaign & {
  blocks: CampaignBlock[];
};

type CampaignBlockInput = {
  id?: string;
  sortOrder: number;
  type: string;
  content: string;
};

type AudienceRules = {
  locale: 'ALL' | 'ES' | 'CA';
  sources: string[];
  requireConsent: boolean;
  activeWithinDays: number | null;
};

const DEFAULT_AUDIENCE_RULES: AudienceRules = {
  locale: 'ALL',
  sources: [],
  requireConsent: true,
  activeWithinDays: null,
};

function getBaseUrl() {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://127.0.0.1:${process.env.PORT || '3010'}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeAudienceRules(value: unknown): AudienceRules {
  const parsed = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const locale = parsed.locale === 'ES' || parsed.locale === 'CA' ? parsed.locale : 'ALL';
  const sources = Array.isArray(parsed.sources)
    ? parsed.sources.map((entry) => String(entry).trim()).filter(Boolean)
    : [];
  const requireConsent = parsed.requireConsent !== false;
  const activeWithinDays =
    typeof parsed.activeWithinDays === 'number' &&
    Number.isFinite(parsed.activeWithinDays) &&
    parsed.activeWithinDays > 0
      ? parsed.activeWithinDays
      : null;

  return { locale, sources, requireConsent, activeWithinDays };
}

function parseAudienceRules(blocks: CampaignBlock[]): AudienceRules {
  const block = blocks.find((item) => item.type === 'audience');
  if (!block) return DEFAULT_AUDIENCE_RULES;
  return normalizeAudienceRules(parseJsonObject(block.content));
}

function matchesAudienceRules(params: {
  subscriber: Subscriber & { events?: Array<{ createdAt: Date }> };
  rules: AudienceRules;
}) {
  const { subscriber, rules } = params;

  if (rules.locale !== 'ALL' && subscriber.locale !== rules.locale) {
    return false;
  }

  if (rules.sources.length > 0 && !rules.sources.includes(subscriber.source)) {
    return false;
  }

  if (rules.requireConsent && !subscriber.consentedAt) {
    return false;
  }

  if (rules.activeWithinDays) {
    const threshold = Date.now() - rules.activeWithinDays * 24 * 60 * 60 * 1000;
    const lastEventAt = subscriber.events?.[0]?.createdAt?.getTime() || 0;
    const createdAt = subscriber.createdAt.getTime();
    if (Math.max(lastEventAt, createdAt) < threshold) {
      return false;
    }
  }

  return true;
}

async function renderCampaignBlocks(blocks: CampaignBlock[]) {
  const baseUrl = getBaseUrl();
  const sortedBlocks = [...blocks].sort((left, right) => left.sortOrder - right.sortOrder);
  const sections: string[] = [];

  for (const block of sortedBlocks) {
    if (block.type === 'audience') {
      continue;
    }

    if (block.type === 'intro' || block.type === 'text') {
      const safeContent = sanitizeHtml(block.content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li'],
        allowedAttributes: { a: ['href', 'rel'] },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
      });
      sections.push(
        `<section style="margin:0 0 24px;"><p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">${safeContent.replace(/\n/g, '<br />')}</p></section>`
      );
      continue;
    }

    if (block.type === 'cta') {
      const parsed = parseJsonObject(block.content) as { label?: string; url?: string } | null;
      const label = parsed?.label || 'Abrir Webtense Energy';
      const url = parsed?.url || baseUrl;
      sections.push(
        `<section style="margin:0 0 28px;"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f935d;color:#fff;font-weight:700;text-decoration:none;">${escapeHtml(label)}</a></section>`
      );
      continue;
    }

    if (block.type === 'posts') {
      const slugs = parseJsonArray(block.content);
      const posts = await db.post.findMany({
        where: slugs.length ? { slug: { in: slugs } } : { status: 'PUBLISHED' },
        include: {
          translations: true,
          categories: { include: { category: true } },
        },
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        take: slugs.length || 3,
      });

      const items = posts
        .map((post) => {
          const translation =
            post.translations.find((entry) => entry.locale === post.locale) || post.translations[0];
          return `<article style="margin:0 0 16px;padding:18px;border:1px solid #d7dee7;border-radius:16px;"><p style="margin:0 0 6px;color:#64748b;font-size:12px;">${escapeHtml(post.categories[0]?.category.name || 'Blog')}</p><h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">${escapeHtml(translation?.title || post.slug)}</h2><p style="margin:0 0 12px;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(translation?.excerpt || 'Nuevo articulo disponible en Webtense Energy.')}</p><a href="${baseUrl}/blog/${post.slug}" style="color:#0f935d;font-weight:700;text-decoration:none;">Leer articulo</a></article>`;
        })
        .join('');

      sections.push(
        `<section style="margin:0 0 28px;"><h2 style="margin:0 0 12px;font-size:22px;color:#0f172a;">Articulos destacados</h2>${items || '<p style="color:#475569;">No hay articulos seleccionados.</p>'}</section>`
      );
      continue;
    }

    if (block.type === 'offers') {
      const offerIds = parseJsonArray(block.content);
      const offers = await db.offer.findMany({
        where: offerIds.length ? { id: { in: offerIds } } : { locale: 'ES' },
        orderBy: [{ updatedAt: 'desc' }],
        take: offerIds.length || 4,
      });

      const items = offers
        .map(
          (offer) =>
            `<li style="margin:0 0 14px;color:#334155;"><strong>${escapeHtml(offer.title)}</strong> · ${escapeHtml(offer.price)}${offer.oldPrice ? ` <span style="color:#64748b;">antes ${escapeHtml(offer.oldPrice)}</span>` : ''}${offer.discount ? ` <span style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:#dcfce7;color:#166534;font-size:12px;">${escapeHtml(offer.discount)}</span>` : ''}<br /><a href="${escapeHtml(offer.url)}" style="color:#0f935d;font-weight:700;text-decoration:none;">Ver oferta</a></li>`
        )
        .join('');

      sections.push(
        `<section style="margin:0 0 28px;"><h2 style="margin:0 0 12px;font-size:22px;color:#0f172a;">Ofertas seleccionadas</h2><ul style="padding-left:20px;margin:0;">${items || '<li>Sin ofertas disponibles.</li>'}</ul></section>`
      );
      continue;
    }

    sections.push(
      `<section style="margin:0 0 24px;"><pre style="white-space:pre-wrap;font-family:inherit;color:#334155;">${escapeHtml(block.content)}</pre></section>`
    );
  }

  return sections.join('');
}

export async function renderCampaignHtml(campaign: EditableCampaign) {
  const content = await renderCampaignBlocks(campaign.blocks);
  return `<div style="background:#f4f7fb;padding:24px;font-family:Arial,sans-serif;color:#0f172a;"><div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;"><p style="margin:0 0 8px;color:#0f935d;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Webtense Energy</p><h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;">${escapeHtml(campaign.subject)}</h1><p style="margin:0 0 24px;color:#64748b;font-size:14px;">${escapeHtml(campaign.preheader || 'Actualizacion de contenidos, automatizacion y ofertas seleccionadas.')}</p>${content}<p style="margin:32px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">Recibes este correo porque te suscribiste a Webtense Energy.</p></div></div>`;
}

async function sendOneCampaignEmail(params: {
  subscriber: Subscriber;
  campaign: EditableCampaign;
  html: string;
  sendJobId?: string;
}) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('Configuracion SMTP incompleta');
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: params.subscriber.email,
      subject: params.campaign.subject,
      html: params.html,
    });

    if (params.sendJobId) {
      await db.sendEvent.create({
        data: {
          sendJobId: params.sendJobId,
          subscriberId: params.subscriber.id,
          eventType: 'sent',
        },
      });
    }

    await db.emailLog.create({
      data: {
        channel: 'smtp',
        destination: params.subscriber.email,
        subject: params.campaign.subject,
        status: 'sent',
        entityType: 'Campaign',
        entityId: params.campaign.id,
        providerMessageId: info.messageId,
        payload: JSON.stringify({
          subscriberId: params.subscriber.id,
          sendJobId: params.sendJobId || null,
        }),
        sentAt: new Date(),
      },
    });

    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown';
    await db.emailLog.create({
      data: {
        channel: 'smtp',
        destination: params.subscriber.email,
        subject: params.campaign.subject,
        status: 'failed',
        entityType: 'Campaign',
        entityId: params.campaign.id,
        error: message,
        payload: JSON.stringify({
          subscriberId: params.subscriber.id,
          sendJobId: params.sendJobId || null,
        }),
      },
    });

    if (params.sendJobId) {
      await db.sendEvent.create({
        data: {
          sendJobId: params.sendJobId,
          subscriberId: params.subscriber.id,
          eventType: 'failed',
        },
      });
    }

    return { ok: false as const, error: message };
  }
}

export async function saveCampaignWithBlocks(params: {
  campaignId?: string;
  name: string;
  locale: 'ES' | 'CA';
  subject: string;
  preheader?: string | null;
  status: Campaign['status'];
  scheduleType?: Campaign['scheduleType'] | null;
  scheduledFor?: Date | null;
  authorId?: string | null;
  blocks: CampaignBlockInput[];
}) {
  const normalizedBlocks = params.blocks
    .map((block, index) => ({
      id: block.id,
      sortOrder: Number.isFinite(block.sortOrder) ? block.sortOrder : index + 1,
      type: block.type.trim() || 'text',
      content: block.content.trim(),
    }))
    .filter((block) => block.content);

  if (!normalizedBlocks.length) {
    throw new Error('La campana necesita al menos un bloque con contenido');
  }

  if (params.campaignId) {
    await db.campaignBlock.deleteMany({ where: { campaignId: params.campaignId } });
    return db.campaign.update({
      where: { id: params.campaignId },
      data: {
        name: params.name,
        locale: params.locale,
        subject: params.subject,
        preheader: params.preheader || null,
        status: params.status,
        scheduleType: params.scheduleType || null,
        scheduledFor: params.scheduledFor || null,
        blocks: {
          create: normalizedBlocks.map((block) => ({
            sortOrder: block.sortOrder,
            type: block.type,
            content: block.content,
          })),
        },
      },
      include: { blocks: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  return db.campaign.create({
    data: {
      name: params.name,
      locale: params.locale,
      subject: params.subject,
      preheader: params.preheader || null,
      status: params.status,
      scheduleType: params.scheduleType || null,
      scheduledFor: params.scheduledFor || null,
      authorId: params.authorId || null,
      blocks: {
        create: normalizedBlocks.map((block) => ({
          sortOrder: block.sortOrder,
          type: block.type,
          content: block.content,
        })),
      },
    },
    include: { blocks: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function sendCampaignTest(params: {
  campaignId: string;
  testEmail: string;
  adminUserId?: string | null;
}) {
  const campaign = await db.campaign.findUnique({
    where: { id: params.campaignId },
    include: { blocks: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!campaign) {
    throw new Error('Campana no encontrada');
  }

  const html = await renderCampaignHtml(campaign);
  const tempSubscriber = {
    id: 'test',
    email: params.testEmail,
    fullName: null,
    locale: campaign.locale,
    isActive: true,
    source: 'admin_test',
    consentedAt: null,
    unsubscribedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies Subscriber;

  const result = await sendOneCampaignEmail({ subscriber: tempSubscriber, campaign, html });
  await createAuditLog({
    adminUserId: params.adminUserId || null,
    action: 'campaign_test_sent',
    entityType: 'Campaign',
    entityId: campaign.id,
    status: result.ok ? 'ok' : 'failed',
    metadata: JSON.stringify({ destination: params.testEmail }),
  });

  if (!result.ok) {
    throw new Error(result.error || 'No se pudo enviar la prueba');
  }

  return { ok: true as const };
}

export async function sendCampaignNow(params: { campaignId: string; adminUserId?: string | null }) {
  const campaign = await db.campaign.findUnique({
    where: { id: params.campaignId },
    include: { blocks: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!campaign) {
    throw new Error('Campana no encontrada');
  }

  const audience = parseAudienceRules(campaign.blocks);

  const subscribers = await db.subscriber.findMany({
    where: { isActive: true },
    include: {
      events: {
        orderBy: [{ createdAt: 'desc' }],
        take: 1,
      },
    },
    orderBy: [{ createdAt: 'asc' }],
  });
  const targetSubscribers = subscribers.filter((subscriber) =>
    matchesAudienceRules({ subscriber, rules: audience })
  );
  if (!targetSubscribers.length) {
    throw new Error('No hay suscriptores que encajen con el segmento seleccionado');
  }

  const html = await renderCampaignHtml(campaign);

  await db.campaign.update({
    where: { id: campaign.id },
    data: {
      status: 'SENDING',
      sentAt: null,
    },
  });

  const job = await db.sendJob.create({
    data: {
      campaignId: campaign.id,
      status: 'running',
      runAt: new Date(),
    },
  });

  let delivered = 0;
  let failed = 0;
  for (const subscriber of targetSubscribers) {
    const result = await sendOneCampaignEmail({ subscriber, campaign, html, sendJobId: job.id });
    if (result.ok) {
      delivered += 1;
    } else {
      failed += 1;
    }
  }

  await db.sendJob.update({
    where: { id: job.id },
    data: {
      status: failed > 0 ? 'completed_with_errors' : 'sent',
      finishedAt: new Date(),
      error: failed > 0 ? `${failed} envios fallidos` : null,
    },
  });

  await db.campaign.update({
    where: { id: campaign.id },
    data: {
      status: delivered > 0 ? 'SENT' : 'FAILED',
      sentAt: delivered > 0 ? new Date() : null,
    },
  });

  await createAuditLog({
    adminUserId: params.adminUserId || null,
    action: 'campaign_sent',
    entityType: 'Campaign',
    entityId: campaign.id,
    status: delivered > 0 ? 'ok' : 'failed',
    metadata: JSON.stringify({ delivered, failed, sendJobId: job.id, audience }),
  });

  return { delivered, failed, sendJobId: job.id, selected: targetSubscribers.length, audience };
}

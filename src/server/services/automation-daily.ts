import nodemailer from 'nodemailer';
import type { Offer, Post, Subscriber, StudyRequest, Lead } from '@prisma/client';
import { db } from '@/lib/db';
import { buildOfferCatalogFromDatabase, writeOfferCatalog } from '@/lib/offers-cache';
import { buildBlogDraft, buildOfferSlug, buildTelegramMessage, type ParsedDeal } from '@/lib/deals';
import { getSiteUrl } from '@/lib/seo';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type AutomationOptions = {
  dryRun?: boolean;
  forceNewsletter?: boolean;
};

type OfferProcessingSummary = {
  refreshedCount: number;
  catalogSource: string;
  candidates: number;
  createdDeals: number;
  createdPosts: number;
  sentToTelegram: number;
  skippedExisting: number;
  previews: Array<{ title: string; slug: string }>;
};

type NewsletterSummary = {
  attempted: boolean;
  sent: boolean;
  reason: string | null;
  recipients: number;
  delivered: number;
  failed: number;
  subject: string | null;
  campaignId: string | null;
};

type BlogTelegramSummary = {
  candidates: number;
  sentToTelegram: number;
  skippedExisting: number;
  previews: Array<{ title: string; slug: string }>;
};

type LeadStudySummary = {
  newLeads: number;
  newStudies: number;
  notified: boolean;
};

type EnergyPriceSummary = {
  snapshotsCreated: number;
  dailySummaryUpdated: boolean;
  source: string;
};

export type DailyAutomationSummary = {
  ok: true;
  dryRun: boolean;
  ranAt: string;
  offers: OfferProcessingSummary;
  blog: BlogTelegramSummary;
  newsletter: NewsletterSummary;
  pipeline: LeadStudySummary;
  energy: EnergyPriceSummary;
};

function getNumberEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw?.trim()) return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getAutomationConfig() {
  return {
    timezone: process.env.AUTOMATION_TIMEZONE || 'Europe/Madrid',
    offerLookbackHours: getNumberEnv('AUTOMATION_OFFER_LOOKBACK_HOURS', 24),
    blogLookbackHours: getNumberEnv('AUTOMATION_BLOG_LOOKBACK_HOURS', 24),
    offerMinDiscountPct: getNumberEnv('AUTOMATION_OFFER_MIN_DISCOUNT_PCT', 15),
    offerMaxPerRun: getNumberEnv('AUTOMATION_OFFER_MAX_PER_RUN', 5),
    newsletterWeekday: getNumberEnv('AUTOMATION_NEWSLETTER_WEEKDAY', 1),
    newsletterMaxPosts: getNumberEnv('AUTOMATION_NEWSLETTER_MAX_POSTS', 3),
    newsletterMaxOffers: getNumberEnv('AUTOMATION_NEWSLETTER_MAX_OFFERS', 3),
    leadLookbackHours: getNumberEnv('AUTOMATION_LEAD_LOOKBACK_HOURS', 24),
  };
}

function parsePriceAmount(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.replace(/[€\s]/g, '').replace(/\./g, '').replace(/,/g, '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDiscountPct(value: string | null | undefined) {
  if (!value) return null;
  const match = value.match(/-?(\d+(?:[.,]\d+)?)\s*%/);
  if (!match) return null;

  const parsed = Number(match[1].replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function getOfferDiscountPct(offer: Offer) {
  const explicit = parseDiscountPct(offer.discount);
  if (explicit !== null) return explicit;

  const current = parsePriceAmount(offer.price);
  const previous = parsePriceAmount(offer.oldPrice);
  if (!current || !previous || previous <= current) return 0;

  return Number((((previous - current) / previous) * 100).toFixed(2));
}

function formatAutomationDate(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date);
}

function buildOfferDeal(offer: Offer): ParsedDeal {
  return {
    title: offer.title,
    currentPrice: offer.price,
    previousPrice: offer.oldPrice || null,
    coupon: null,
    sourceUrl: offer.url,
    affiliateUrl: offer.url,
    hashtags: ['#WebtenseEnergy', '#Oferta'],
  };
}

function startOfCurrentWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getInternalBaseUrl() {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://127.0.0.1:${process.env.PORT || '3010'}`;
}

async function sendTelegramMessage(text: string, dryRun: boolean) {
  if (dryRun) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!botToken || !chatId) {
    throw new Error('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHANNEL_ID');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || 'Telegram API error');
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildBlogTelegramMessage(
  post: Post & {
    translations: Array<{
      locale: 'ES' | 'CA';
      title: string;
      excerpt: string | null;
      content: string;
    }>;
    categories: Array<{ category: { name: string } }>;
  }
) {
  const translation =
    post.translations.find((item) => item.locale === 'ES') || post.translations[0];
  const title = translation?.title || post.slug;
  const excerptSource = translation?.excerpt || stripHtml(translation?.content || '');
  const excerpt =
    excerptSource.length > 220 ? `${excerptSource.slice(0, 217).trim()}...` : excerptSource;
  const category = post.categories[0]?.category.name || 'Blog';
  const articleUrl = `${getSiteUrl()}/blog/${post.slug}`;

  return [
    '<b>Nuevo artículo en WEBTENSE ENERGY</b>',
    '',
    `<b>${escapeHtml(title)}</b>`,
    `<i>${escapeHtml(category)}</i>`,
    '',
    escapeHtml(excerpt || 'Ya tienes una nueva guía publicada en el blog.'),
    '',
    `<a href=\"${articleUrl}\">Leer artículo</a>`,
  ].join('\n');
}

async function sendCampaignEmail(params: {
  subscriber: Subscriber;
  subject: string;
  html: string;
  campaignId: string;
  sendJobId: string;
  dryRun: boolean;
}) {
  if (params.dryRun) {
    return { status: 'sent' as const, error: null };
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return { status: 'failed' as const, error: 'SMTP no configurado' };
  }

  try {
    await transporter.sendMail({
      from,
      to: params.subscriber.email,
      subject: params.subject,
      html: params.html,
      replyTo: process.env.NEWSLETTER_REPLY_TO || from,
    });

    await db.sendEvent.create({
      data: {
        sendJobId: params.sendJobId,
        subscriberId: params.subscriber.id,
        eventType: 'sent',
      },
    });

    await db.emailLog.create({
      data: {
        channel: 'smtp',
        destination: params.subscriber.email,
        subject: params.subject,
        status: 'sent',
        payload: JSON.stringify({ campaignId: params.campaignId, sendJobId: params.sendJobId }),
      },
    });

    return { status: 'sent' as const, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SMTP error';
    await db.sendEvent.create({
      data: {
        sendJobId: params.sendJobId,
        subscriberId: params.subscriber.id,
        eventType: 'failed',
      },
    });

    await db.emailLog.create({
      data: {
        channel: 'smtp',
        destination: params.subscriber.email,
        subject: params.subject,
        status: 'failed',
        error: message,
        payload: JSON.stringify({ campaignId: params.campaignId, sendJobId: params.sendJobId }),
      },
    });

    return { status: 'failed' as const, error: message };
  }
}

function buildNewsletterHtml(params: {
  preheader: string;
  cta: string;
  timezone: string;
  posts: Array<
    Post & {
      translations: Array<{
        locale: 'ES' | 'CA';
        title: string;
        excerpt: string | null;
        content: string;
      }>;
      categories: Array<{ category: { name: string } }>;
    }
  >;
  offers: Offer[];
}) {
  const postsHtml = params.posts
    .map((post) => {
      const translation =
        post.translations.find((item) => item.locale === 'ES') || post.translations[0];
      return `
        <article style="margin-bottom:24px;padding:20px;border:1px solid #dce8e0;border-radius:14px;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">${post.categories[0]?.category.name || 'Blog'}</p>
          <h2 style="font-size:20px;margin:0 0 8px;">${translation?.title || post.slug}</h2>
          <p style="margin:0 0 12px;color:#444;">${translation?.excerpt || 'Nuevo contenido en Webtense Energy.'}</p>
          <p style="margin:0;"><a href="${getInternalBaseUrl()}/blog/${post.slug}" style="color:#0f935d;font-weight:700;">${params.cta}</a></p>
        </article>
      `.trim();
    })
    .join('');

  const offersHtml = params.offers
    .map((offer) =>
      `
        <li style="margin-bottom:16px;">
          <strong>${offer.title}</strong> · ${offer.price}${offer.oldPrice ? ` <span style="color:#666;"> antes ${offer.oldPrice}</span>` : ''}
          ${offer.discount ? `<span style="display:inline-block;margin-left:8px;padding:2px 8px;background:#e6f7ee;color:#0f935d;border-radius:999px;font-size:12px;">${offer.discount}</span>` : ''}
          <br />
          <a href="${offer.url}" style="color:#0f935d;font-weight:700;">Ver oferta</a>
        </li>
      `.trim()
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;background:#f4f7f5;padding:24px;color:#122019;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">${params.preheader}</p>
        <h1 style="margin:0 0 16px;font-size:28px;">Resumen semanal Webtense Energy</h1>
        <p style="margin:0 0 8px;">Seleccion de contenidos y ofertas para ahorro energetico, domotica y eficiencia.</p>
        <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Preparado el ${formatAutomationDate(new Date(), params.timezone)}</p>
        ${postsHtml || '<p>No hay nuevos articulos esta semana.</p>'}
        <h2 style="margin:32px 0 12px;font-size:22px;">Ofertas destacadas</h2>
        <ul style="padding-left:20px;">${offersHtml || '<li>Sin ofertas destacadas esta semana.</li>'}</ul>
        <p style="margin-top:32px;font-size:12px;color:#6b7280;">Recibes este correo porque te suscribiste en Webtense Energy.</p>
      </div>
    </div>
  `.trim();
}

async function buildNewsletterSuggestion(topic: string) {
  try {
    const response = await fetch(`${getInternalBaseUrl()}/api/ai/newsletter-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, locale: 'es' }),
    });

    if (!response.ok) {
      throw new Error(`newsletter-suggest returned ${response.status}`);
    }

    return (await response.json()) as { subject?: string; preheader?: string; cta?: string };
  } catch {
    return {
      subject: `Resumen semanal Webtense Energy: ${topic}`,
      preheader: 'Posts, ofertas y alertas comerciales de la semana.',
      cta: 'Ver novedades',
    };
  }
}

async function processOffers(now: Date, dryRun: boolean): Promise<OfferProcessingSummary> {
  const config = getAutomationConfig();
  const catalog = await buildOfferCatalogFromDatabase();
  if (!dryRun) {
    await writeOfferCatalog(catalog);
  }

  const since = new Date(now);
  since.setHours(since.getHours() - config.offerLookbackHours);

  const rows = await db.offer.findMany({
    where: {
      locale: 'ES',
      updatedAt: { gte: since },
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: Math.max(config.offerMaxPerRun * 3, config.offerMaxPerRun),
  });

  const filteredRows = rows
    .map((row) => ({ row, discountPct: getOfferDiscountPct(row) }))
    .filter(({ discountPct }) => discountPct >= config.offerMinDiscountPct)
    .sort((left, right) => right.discountPct - left.discountPct)
    .slice(0, config.offerMaxPerRun)
    .map(({ row }) => row);

  let createdDeals = 0;
  let createdPosts = 0;
  let sentToTelegram = 0;
  let skippedExisting = 0;
  const previews: Array<{ title: string; slug: string }> = [];

  let categoryId: string | null = null;
  if (filteredRows.length && !dryRun) {
    const category = await db.category.upsert({
      where: { slug: 'ofertas' },
      create: { slug: 'ofertas', name: 'Ofertas', locale: 'ES' },
      update: { name: 'Ofertas', locale: 'ES' },
    });
    categoryId = category.id;
  }

  for (const row of filteredRows) {
    const existing = await db.telegramDeal.findFirst({ where: { offerId: row.id } });
    if (existing) {
      skippedExisting += 1;
      continue;
    }

    const parsedDeal = buildOfferDeal(row);
    const blogDraft = await buildBlogDraft(parsedDeal);
    const message = buildTelegramMessage(parsedDeal);

    const slugBase = buildOfferSlug(parsedDeal.title);
    let slug = slugBase;
    let counter = 1;
    while (await db.post.findUnique({ where: { slug } })) {
      counter += 1;
      slug = `${slugBase}-${counter}`;
    }

    previews.push({ title: row.title, slug });

    if (dryRun) {
      createdDeals += 1;
      createdPosts += 1;
      sentToTelegram += 1;
      continue;
    }

    const post = await db.post.create({
      data: {
        slug,
        status: 'REVIEW',
        locale: 'ES',
        seoTitle: blogDraft.title,
        seoDescription: blogDraft.excerpt,
        translations: {
          create: {
            locale: 'ES',
            title: blogDraft.title,
            excerpt: blogDraft.excerpt,
            content: blogDraft.content,
          },
        },
        ...(categoryId
          ? {
              categories: {
                create: {
                  categoryId,
                },
              },
            }
          : {}),
      },
    });

    const deal = await db.telegramDeal.create({
      data: {
        offerId: row.id,
        title: row.title,
        message,
        url: row.url,
        status: 'draft',
      },
    });

    createdDeals += 1;
    createdPosts += 1;

    try {
      await sendTelegramMessage(message, false);
      sentToTelegram += 1;
      await db.telegramDeal.update({
        where: { id: deal.id },
        data: { status: 'sent', sentAt: new Date() },
      });
      await db.telegramLog.create({
        data: {
          action: 'automation_offer_sent',
          status: 'ok',
          detail: `offer:${row.id};post:${post.id};deal:${deal.id}`,
        },
      });
    } catch (error) {
      await db.telegramLog.create({
        data: {
          action: 'automation_offer_sent',
          status: 'failed',
          detail: `offer:${row.id};deal:${deal.id};error:${error instanceof Error ? error.message : 'unknown'}`,
        },
      });
    }
  }

  return {
    refreshedCount: catalog.offers.length,
    catalogSource: catalog.source,
    candidates: filteredRows.length,
    createdDeals,
    createdPosts,
    sentToTelegram,
    skippedExisting,
    previews,
  };
}

async function processNewsletter(
  now: Date,
  dryRun: boolean,
  forceNewsletter = false
): Promise<NewsletterSummary> {
  const config = getAutomationConfig();
  if (!forceNewsletter && now.getDay() !== config.newsletterWeekday) {
    return {
      attempted: false,
      sent: false,
      reason: `Solo se envia el dia ${config.newsletterWeekday} en la ejecucion diaria.`,
      recipients: 0,
      delivered: 0,
      failed: 0,
      subject: null,
      campaignId: null,
    };
  }

  const weekStart = startOfCurrentWeek(now);
  const existingCampaign = await db.campaign.findFirst({
    where: {
      scheduleType: 'WEEKLY',
      sentAt: { gte: weekStart },
      status: 'SENT',
    },
  });

  if (existingCampaign) {
    return {
      attempted: false,
      sent: false,
      reason: 'Ya existe una campana semanal enviada esta semana.',
      recipients: 0,
      delivered: 0,
      failed: 0,
      subject: existingCampaign.subject,
      campaignId: existingCampaign.id,
    };
  }

  const [subscribers, posts, offers] = await Promise.all([
    db.subscriber.findMany({ where: { isActive: true }, orderBy: [{ createdAt: 'asc' }] }),
    db.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: weekStart },
      },
      include: {
        translations: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ publishedAt: 'desc' }],
      take: config.newsletterMaxPosts,
    }),
    db.offer.findMany({
      where: { locale: 'ES' },
      orderBy: [{ updatedAt: 'desc' }],
      take: config.newsletterMaxOffers,
    }),
  ]);

  if (!subscribers.length) {
    return {
      attempted: false,
      sent: false,
      reason: 'No hay suscriptores activos.',
      recipients: 0,
      delivered: 0,
      failed: 0,
      subject: null,
      campaignId: null,
    };
  }

  if (!posts.length && !offers.length) {
    return {
      attempted: false,
      sent: false,
      reason: 'No hay contenido suficiente para la newsletter semanal.',
      recipients: subscribers.length,
      delivered: 0,
      failed: 0,
      subject: null,
      campaignId: null,
    };
  }

  const topic = posts[0]?.translations[0]?.title || offers[0]?.title || 'ahorro energetico';
  const suggestion = await buildNewsletterSuggestion(topic);
  const subject = suggestion.subject || `Resumen semanal Webtense Energy: ${topic}`;
  const preheader = suggestion.preheader || 'Posts y ofertas seleccionadas por Webtense Energy.';
  const html = buildNewsletterHtml({
    preheader,
    cta: suggestion.cta || 'Ver novedades',
    timezone: config.timezone,
    posts,
    offers,
  });

  if (dryRun) {
    return {
      attempted: true,
      sent: true,
      reason: null,
      recipients: subscribers.length,
      delivered: subscribers.length,
      failed: 0,
      subject,
      campaignId: null,
    };
  }

  const campaign = await db.campaign.create({
    data: {
      name: `Digest semanal ${weekStart.toISOString().slice(0, 10)}`,
      locale: 'ES',
      subject,
      preheader,
      status: 'SENDING',
      scheduleType: 'WEEKLY',
      scheduledFor: weekStart,
      blocks: {
        create: [
          { sortOrder: 1, type: 'intro', content: preheader },
          { sortOrder: 2, type: 'posts', content: JSON.stringify(posts.map((post) => post.slug)) },
          {
            sortOrder: 3,
            type: 'offers',
            content: JSON.stringify(offers.map((offer) => offer.id)),
          },
        ],
      },
    },
  });

  const sendJob = await db.sendJob.create({
    data: {
      campaignId: campaign.id,
      status: 'running',
      runAt: now,
    },
  });

  let delivered = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const result = await sendCampaignEmail({
      subscriber,
      subject,
      html,
      campaignId: campaign.id,
      sendJobId: sendJob.id,
      dryRun: false,
    });

    if (result.status === 'sent') {
      delivered += 1;
    } else {
      failed += 1;
    }
  }

  await db.sendJob.update({
    where: { id: sendJob.id },
    data: {
      status: failed > 0 ? 'completed_with_errors' : 'sent',
      finishedAt: new Date(),
      error: failed > 0 ? `${failed} envios fallidos` : null,
    },
  });

  await db.campaign.update({
    where: { id: campaign.id },
    data: {
      status: failed === subscribers.length ? 'FAILED' : 'SENT',
      sentAt: failed === subscribers.length ? null : new Date(),
    },
  });

  return {
    attempted: true,
    sent: delivered > 0,
    reason: failed ? `${failed} envios fallidos` : null,
    recipients: subscribers.length,
    delivered,
    failed,
    subject,
    campaignId: campaign.id,
  };
}

async function processBlogPosts(now: Date, dryRun: boolean): Promise<BlogTelegramSummary> {
  const config = getAutomationConfig();
  const since = new Date(now);
  since.setHours(since.getHours() - config.blogLookbackHours);

  const posts = await db.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        gte: since,
      },
      categories: {
        none: {
          category: {
            slug: 'ofertas',
          },
        },
      },
    },
    include: {
      translations: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ publishedAt: 'desc' }],
    take: 10,
  });

  let sentToTelegram = 0;
  let skippedExisting = 0;
  const previews: Array<{ title: string; slug: string }> = [];

  for (const post of posts) {
    const alreadySent = await db.telegramLog.findFirst({
      where: {
        action: 'automation_blog_post_sent',
        status: 'ok',
        detail: {
          contains: `post:${post.id};`,
        },
      },
    });

    if (alreadySent) {
      skippedExisting += 1;
      continue;
    }

    const translation =
      post.translations.find((item) => item.locale === 'ES') || post.translations[0];
    previews.push({ title: translation?.title || post.slug, slug: post.slug });

    if (dryRun) {
      sentToTelegram += 1;
      continue;
    }

    try {
      await sendTelegramMessage(buildBlogTelegramMessage(post), false);
      sentToTelegram += 1;
      await db.telegramLog.create({
        data: {
          action: 'automation_blog_post_sent',
          status: 'ok',
          detail: `post:${post.id};slug:${post.slug}`,
        },
      });
    } catch (error) {
      await db.telegramLog.create({
        data: {
          action: 'automation_blog_post_sent',
          status: 'failed',
          detail: `post:${post.id};slug:${post.slug};error:${error instanceof Error ? error.message : 'unknown'}`,
        },
      });
    }
  }

  return {
    candidates: posts.length,
    sentToTelegram,
    skippedExisting,
    previews,
  };
}

function formatLeadSummary(leads: Lead[], studies: StudyRequest[]) {
  const lines = ['<b>Resumen diario Webtense</b>'];

  lines.push(`Leads nuevos: <b>${leads.length}</b>`);
  if (leads.length) {
    lines.push(...leads.slice(0, 5).map((lead) => `- ${lead.name} · ${lead.email}`));
  }

  lines.push('');
  lines.push(`Estudios nuevos: <b>${studies.length}</b>`);
  if (studies.length) {
    lines.push(...studies.slice(0, 5).map((study) => `- ${study.name} · ${study.email}`));
  }

  return lines.join('\n');
}

async function syncEnergyPrices(now: Date, dryRun: boolean): Promise<EnergyPriceSummary> {
  const token = process.env.ESIOS_TOKEN;
  if (!token) {
    return { snapshotsCreated: 0, dailySummaryUpdated: false, source: 'skipped:no_token' };
  }

  const dateStr = now.toISOString().slice(0, 10);

  try {
    const url = `https://api.esios.ree.es/indicators/1001?start_date=${dateStr}T00:00:00&end_date=${dateStr}T23:59:59&time_trunc=hour`;
    const response = await fetch(url, {
      headers: { Authorization: `Token token=${token}`, Accept: 'application/json' },
    });

    if (!response.ok) throw new Error(`ESIOS ${response.status}`);

    const data = (await response.json()) as {
      indicator?: { values?: Array<{ datetime: string; value: number }> };
    };
    const values = data?.indicator?.values || [];
    if (!values.length) return { snapshotsCreated: 0, dailySummaryUpdated: false, source: 'esios:empty' };

    if (dryRun) return { snapshotsCreated: values.length, dailySummaryUpdated: true, source: 'esios:dry_run' };

    const snapshotDate = new Date(`${dateStr}T00:00:00Z`);
    let created = 0;

    for (const entry of values) {
      const hour = new Date(entry.datetime).getUTCHours();
      const price = entry.value / 1000; // MWh → kWh
      await db.energyPriceSnapshot.upsert({
        where: { snapshotDate_hour: { snapshotDate, hour } },
        create: { snapshotDate, hour, price, source: 'esios' },
        update: { price, source: 'esios' },
      });
      created++;
    }

    const prices = values.map((v) => v.value / 1000);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minHour = new Date(values.find((v) => v.value / 1000 === minPrice)!.datetime).getUTCHours();
    const maxHour = new Date(values.find((v) => v.value / 1000 === maxPrice)!.datetime).getUTCHours();
    const currentHour = now.getUTCHours();
    const currentPrice = values.find((v) => new Date(v.datetime).getUTCHours() === currentHour)?.value ?? null;

    await db.energyDailySummary.upsert({
      where: { summaryDate: snapshotDate },
      create: {
        summaryDate: snapshotDate,
        minPrice,
        minHour,
        maxPrice,
        maxHour,
        avgPrice,
        currentPrice: currentPrice !== null ? currentPrice / 1000 : null,
        entriesCount: values.length,
        source: 'esios',
      },
      update: {
        minPrice,
        minHour,
        maxPrice,
        maxHour,
        avgPrice,
        currentPrice: currentPrice !== null ? currentPrice / 1000 : null,
        entriesCount: values.length,
        source: 'esios',
      },
    });

    return { snapshotsCreated: created, dailySummaryUpdated: true, source: 'esios' };
  } catch (error) {
    return {
      snapshotsCreated: 0,
      dailySummaryUpdated: false,
      source: `error:${error instanceof Error ? error.message : 'unknown'}`,
    };
  }
}

async function processLeadStudySummary(now: Date, dryRun: boolean): Promise<LeadStudySummary> {
  const config = getAutomationConfig();
  const since = new Date(now);
  since.setHours(since.getHours() - config.leadLookbackHours);

  const [leads, studies] = await Promise.all([
    db.lead.findMany({ where: { createdAt: { gte: since } }, orderBy: [{ createdAt: 'desc' }] }),
    db.studyRequest.findMany({
      where: { createdAt: { gte: since } },
      orderBy: [{ createdAt: 'desc' }],
    }),
  ]);

  if (!leads.length && !studies.length) {
    return {
      newLeads: 0,
      newStudies: 0,
      notified: false,
    };
  }

  await sendTelegramMessage(formatLeadSummary(leads, studies), dryRun);

  return {
    newLeads: leads.length,
    newStudies: studies.length,
    notified: true,
  };
}

export async function runDailyAutomation(
  options: AutomationOptions = {}
): Promise<DailyAutomationSummary> {
  const now = new Date();
  const dryRun = Boolean(options.dryRun);
  const forceNewsletter = Boolean(options.forceNewsletter);

  const [offers, blog, newsletter, pipeline, energy] = await Promise.all([
    processOffers(now, dryRun),
    processBlogPosts(now, dryRun),
    processNewsletter(now, dryRun, forceNewsletter),
    processLeadStudySummary(now, dryRun),
    syncEnergyPrices(now, dryRun),
  ]);

  return {
    ok: true,
    dryRun,
    ranAt: now.toISOString(),
    offers,
    blog,
    newsletter,
    pipeline,
    energy,
  };
}

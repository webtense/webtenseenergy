import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";
import { buildBlogDraft, buildOfferSlug, buildTelegramMessage, parseDealText } from "@/lib/deals";

export const runtime = "nodejs";

type CreateBody = {
  rawText?: string;
};

function toCategorySlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  const deals = await db.telegramDeal.findMany({ orderBy: [{ updatedAt: "desc" }] });
  return NextResponse.json({ deals });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  try {
    const body = (await request.json()) as CreateBody;
    const rawText = body.rawText?.trim() || "";
    if (!rawText) {
      return NextResponse.json({ message: "Debes pegar el texto de la oferta." }, { status: 400 });
    }

    const parsed = await parseDealText(rawText);
    if (!parsed.affiliateUrl) {
      return NextResponse.json({ message: "No se ha detectado un enlace valido para la oferta." }, { status: 400 });
    }

    const blogDraft = await buildBlogDraft(parsed);
    const category = await db.category.upsert({
      where: { slug: toCategorySlug("Ofertas") },
      create: {
        slug: toCategorySlug("Ofertas"),
        name: "Ofertas",
        locale: "ES",
      },
      update: {
        name: "Ofertas",
        locale: "ES",
      },
    });

    const slugBase = buildOfferSlug(parsed.title);
    let slug = slugBase;
    let counter = 1;
    while (await db.post.findUnique({ where: { slug } })) {
      counter += 1;
      slug = `${slugBase}-${counter}`;
    }

    const post = await db.post.create({
      data: {
        slug,
        status: "REVIEW",
        locale: "ES",
        authorId: auth.user.id,
        seoTitle: blogDraft.title,
        seoDescription: blogDraft.excerpt,
        featuredImage: null,
        translations: {
          create: {
            locale: "ES",
            title: blogDraft.title,
            excerpt: blogDraft.excerpt,
            content: blogDraft.content,
          },
        },
        categories: {
          create: {
            categoryId: category.id,
          },
        },
      },
    });

    const deal = await db.telegramDeal.create({
      data: {
        title: parsed.title,
        message: buildTelegramMessage(parsed),
        url: parsed.affiliateUrl,
        status: "draft",
      },
    });

    await db.telegramLog.create({
      data: {
        adminUserId: auth.user.id,
        action: "draft_created",
        status: "ok",
        detail: `deal:${deal.id};post:${post.slug}`,
      },
    });

    return NextResponse.json({ deal, postSlug: post.slug });
  } catch (error) {
    console.error("Error creando borrador Telegram:", error);
    return NextResponse.json({ message: "No se pudo crear el borrador." }, { status: 500 });
  }
}

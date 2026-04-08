import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";

type PostPayload = {
  id?: string;
  slug?: string;
  locale?: "ES" | "CA";
  title?: string;
  excerpt?: string;
  content?: string;
  status?: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  scheduledFor?: string | null;
  featuredImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function toSlug(value: string) {
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

  const posts = await db.post.findMany({
    include: {
      translations: true,
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  try {
    const body = (await request.json()) as PostPayload;
    const locale = body.locale === "CA" ? "CA" : "ES";
    const title = body.title?.trim() || "";
    const content = body.content?.trim() || "";

    if (!title || !content) {
      return NextResponse.json({ message: "Titulo y contenido son obligatorios." }, { status: 400 });
    }

    const slug = toSlug(body.slug?.trim() || title);
    if (!slug) {
      return NextResponse.json({ message: "Slug invalido." }, { status: 400 });
    }

    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: "El slug ya existe." }, { status: 409 });
    }

    const status = body.status || "DRAFT";
    const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;

    const post = await db.post.create({
      data: {
        slug,
        status,
        scheduledFor: status === "SCHEDULED" ? scheduledFor : null,
        featuredImage: body.featuredImage || null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        locale,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: auth.user.id,
        translations: {
          create: {
            locale,
            title,
            excerpt: body.excerpt || null,
            content,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error creando post:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

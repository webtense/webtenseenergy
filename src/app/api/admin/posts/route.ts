import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { PostCreateSchema } from '@/lib/schemas/admin';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toCategorySlug(value: string) {
  return toSlug(value) || 'general';
}

export async function GET() {
  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  const posts = await db.post.findMany({
    include: {
      translations: true,
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const result = PostCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Datos inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = toSlug(data.slug?.trim() || data.title);
    if (!slug) {
      return NextResponse.json({ message: 'Slug invalido.' }, { status: 400 });
    }

    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: 'El slug ya existe.' }, { status: 409 });
    }

    const categoryName = data.category?.trim() || null;
    const category = categoryName
      ? await db.category.upsert({
          where: { slug: toCategorySlug(categoryName) },
          create: { slug: toCategorySlug(categoryName), name: categoryName, locale: data.locale },
          update: { name: categoryName, locale: data.locale },
        })
      : null;

    const post = await db.post.create({
      data: {
        slug,
        status: data.status,
        scheduledFor: data.status === 'SCHEDULED' && data.scheduledFor ? new Date(data.scheduledFor) : null,
        featuredImage: data.featuredImage || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        locale: data.locale,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        authorId: auth.user.id,
        translations: {
          create: {
            locale: data.locale,
            title: data.title,
            excerpt: data.excerpt || null,
            content: data.content,
          },
        },
        ...(category
          ? { categories: { create: { categoryId: category.id } } }
          : {}),
      },
      include: {
        translations: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    logger.error({ err: error }, 'Error creando post');
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}

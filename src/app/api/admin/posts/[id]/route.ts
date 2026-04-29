import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminApiUser } from '@/lib/admin-guard';
import { isSameOrigin } from '@/lib/security';
import { PostUpdateSchema } from '@/lib/schemas/admin';

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

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await request.json();
    const result = PostUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Datos inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const post = await db.post.findUnique({
      where: { id },
      include: { translations: true, categories: true },
    });
    if (!post) {
      return NextResponse.json({ message: 'Post no encontrado' }, { status: 404 });
    }

    const locale = data.locale ?? post.locale;
    const status = data.status ?? post.status;
    const slug = data.slug ? toSlug(data.slug) : post.slug;

    if (!slug) {
      return NextResponse.json({ message: 'Slug invalido' }, { status: 400 });
    }

    if (slug !== post.slug) {
      const duplicated = await db.post.findUnique({ where: { slug } });
      if (duplicated) {
        return NextResponse.json({ message: 'El slug ya existe' }, { status: 409 });
      }
    }

    const categoryName = data.category?.trim();
    const category = categoryName
      ? await db.category.upsert({
          where: { slug: toCategorySlug(categoryName) },
          create: { slug: toCategorySlug(categoryName), name: categoryName, locale },
          update: { name: categoryName, locale },
        })
      : null;

    await db.post.update({
      where: { id },
      data: {
        slug,
        status,
        scheduledFor: status === 'SCHEDULED' && data.scheduledFor ? new Date(data.scheduledFor) : null,
        featuredImage: data.featuredImage ?? post.featuredImage,
        seoTitle: data.seoTitle ?? post.seoTitle,
        seoDescription: data.seoDescription ?? post.seoDescription,
        locale,
        publishedAt:
          status === 'PUBLISHED'
            ? post.publishedAt || new Date()
            : status === 'ARCHIVED' || status === 'DRAFT'
              ? null
              : post.publishedAt,
        ...(category
          ? { categories: { deleteMany: {}, create: { categoryId: category.id } } }
          : {}),
      },
    });

    const existingTranslation = post.translations.find(
      (item: { locale: string }) => item.locale === locale
    );
    if (existingTranslation) {
      await db.postTranslation.update({
        where: { id: existingTranslation.id },
        data: {
          title: data.title ?? existingTranslation.title,
          excerpt: data.excerpt ?? existingTranslation.excerpt,
          content: data.content ?? existingTranslation.content,
        },
      });
    } else if (data.title && data.content) {
      await db.postTranslation.create({
        data: { postId: id, locale, title: data.title, excerpt: data.excerpt || null, content: data.content },
      });
    }

    const updated = await db.post.findUnique({
      where: { id },
      include: { translations: true, categories: { include: { category: true } } },
    });

    return NextResponse.json({ post: updated });
  } catch (error) {
    logger.error({ err: error }, 'Error actualizando post');
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!isSameOrigin(_request)) {
    return NextResponse.json({ message: 'Origen no permitido' }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ('error' in auth) return auth.error;

  const { id } = await params;

  try {
    await db.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error({ err: error }, 'Error eliminando post');
    return NextResponse.json({ message: 'No se pudo eliminar' }, { status: 500 });
  }
}

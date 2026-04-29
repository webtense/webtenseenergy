/**
 * Migra los posts del archivo src/data/posts.json a la base de datos.
 * Ejecutar una sola vez: node scripts/migrate-json-posts.mjs
 * Idem --dry-run para simular sin escribir.
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

const { PrismaClient } = createRequire(import.meta.url)('@prisma/client');
const db = new PrismaClient();

const postsJson = JSON.parse(
  readFileSync(path.join(__dirname, '../src/data/posts.json'), 'utf8')
);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const posts = Array.isArray(postsJson) ? postsJson : postsJson.posts ?? [];
  console.log(`Posts en JSON: ${posts.length} | dry-run: ${DRY_RUN}`);

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    if (!post.slug || !post.title) {
      console.warn(`  [SKIP] Post sin slug o título`);
      skipped++;
      continue;
    }

    const status =
      post.status === 'publish' || post.status === 'pending' ? 'PUBLISHED' : 'DRAFT';
    const publishedAt = post.date ? new Date(post.date) : new Date();

    if (DRY_RUN) {
      console.log(`  [DRY] ${post.slug} → ${status}`);
      created++;
      continue;
    }

    const existing = await db.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  [SKIP] Ya existe: ${post.slug}`);
      skipped++;
      continue;
    }

    // Upsert de categoría
    const categoryName = post.category || post.categories?.[0] || 'General';
    const categorySlug = slugify(categoryName);
    const category = await db.category.upsert({
      where: { slug: categorySlug },
      create: { slug: categorySlug, name: categoryName },
      update: {},
    });

    await db.post.create({
      data: {
        slug: post.slug,
        status,
        publishedAt,
        featuredImage: post.featuredImage ?? null,
        translations: {
          create: {
            locale: 'ES',
            title: post.title,
            excerpt: post.excerpt ?? '',
            content: post.content ?? '',
          },
        },
        categories: {
          create: { categoryId: category.id },
        },
      },
    });

    console.log(`  [OK] Creado: ${post.slug}`);
    created++;
  }

  console.log(`\nResultado: ${created} creados, ${skipped} omitidos`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

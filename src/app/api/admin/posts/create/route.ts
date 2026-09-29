import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = "wts-admin-secret-2026";

export async function POST(req: NextRequest) {
  try {
    // Validar token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      titulo,
      slug,
      descripcion,
      contenido,
      categoria,
      featured_image,
      fecha,
      generated_by,
    } = body;

    // Validaciones mínimas
    if (!titulo || !slug || !contenido) {
      return NextResponse.json(
        { error: 'Campos requeridos: titulo, slug, contenido' },
        { status: 400 }
      );
    }

    // Aquí guardarías en BD (Prisma, MongoDB, etc.)
    // Por ahora, simulamos éxito
    console.log(`📝 Nuevo post: ${titulo} (${slug}) - ${generated_by}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Post creado exitosamente',
        post: {
          slug,
          titulo,
          categoria,
          published_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/posts/create]', error);
    return NextResponse.json(
      { error: 'Error creando post' },
      { status: 500 }
    );
  }
}

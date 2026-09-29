import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { z } from "zod";

const addProductSchema = z.object({
  productReviewId: z.string().min(1),
  position: z.number().min(1).default(1),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        productReviews: {
          include: { productReview: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      postId: post.id,
      slug: post.slug,
      reviews: post.productReviews,
    });
  } catch (error) {
    console.error("[GET /api/admin/posts/[slug]/product-reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const validatedData = addProductSchema.parse(body);

    // Buscar post
    const post = await db.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    // Verificar que el producto existe
    const product = await db.productReview.findUnique({
      where: { id: validatedData.productReviewId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Crear asociación
    const association = await db.postProductReview.create({
      data: {
        postId: post.id,
        productReviewId: validatedData.productReviewId,
        position: validatedData.position,
      },
      include: { productReview: true },
    });

    return NextResponse.json(association, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validación fallida", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[POST /api/admin/posts/[slug]/product-reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const productReviewId = searchParams.get("productReviewId");

    if (!productReviewId) {
      return NextResponse.json(
        { error: "productReviewId es requerido" },
        { status: 400 }
      );
    }

    const post = await db.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    // Eliminar asociación
    await db.postProductReview.delete({
      where: {
        postId_productReviewId: {
          postId: post.id,
          productReviewId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/posts/[slug]/product-reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

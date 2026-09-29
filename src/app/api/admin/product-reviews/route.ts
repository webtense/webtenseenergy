import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { z } from "zod";

const createProductSchema = z.object({
  title: z.string().min(5, "Título mínimo 5 caracteres"),
  asin: z.string().min(10, "ASIN mínimo 10 caracteres").max(50),
  categoryId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  affiliateUrl: z.string().url("URL de afiliado inválida"),
  rating: z.number().min(1).max(5).default(5),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  price: z.number().positive().optional(),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const where = categoryId ? { categoryId } : undefined;

    const [products, total] = await Promise.all([
      db.productReview.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.productReview.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/product-reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validar input
    const validatedData = createProductSchema.parse(body);

    // Comprobar ASIN único
    const existing = await db.productReview.findUnique({
      where: { asin: validatedData.asin },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Producto con este ASIN ya existe" },
        { status: 409 }
      );
    }

    // Crear producto
    const product = await db.productReview.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validación fallida", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[POST /api/admin/product-reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

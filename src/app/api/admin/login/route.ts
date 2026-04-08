import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createAdminSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, hashIdentifier, isSameOrigin, normalizeEmail } from "@/lib/security";

export const runtime = "nodejs";

interface LoginPayload {
  identifier?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
    }

    const body = (await request.json()) as LoginPayload;
    const identifier = body.identifier?.trim();
    const password = body.password || "";

    if (!identifier || !password) {
      return NextResponse.json({ message: "Credenciales incompletas" }, { status: 400 });
    }

    const rateKey = `admin-login:${hashIdentifier(`${getClientIp(request)}:${identifier}`)}`;
    const rate = checkRateLimit({ key: rateKey, limit: 8, windowMs: 10 * 60 * 1000 });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Demasiados intentos. Intenta de nuevo mas tarde." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
      );
    }

    const normalized = normalizeEmail(identifier);
    const user = await db.adminUser.findFirst({
      where: {
        OR: [{ email: normalized }, { username: identifier }],
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario o clave incorrectos" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Usuario o clave incorrectos" }, { status: 401 });
    }

    const token = createAdminSessionToken(user.id, user.username, user.role);
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Error login admin:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

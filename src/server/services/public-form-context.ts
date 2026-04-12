import { hashIdentifier } from "@/lib/security";

function tryGetPathFromHeader(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).pathname;
  } catch {
    return null;
  }
}

export function getRequestLocale(request: Request): "ES" | "CA" {
  const refererPath = tryGetPathFromHeader(request.headers.get("referer"));
  if (refererPath?.startsWith("/ca")) return "CA";
  return "ES";
}

export function getRequestOriginPath(request: Request) {
  return tryGetPathFromHeader(request.headers.get("referer"));
}

export function getRequestUserAgent(request: Request) {
  return request.headers.get("user-agent");
}

export function getRequestIpHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return hashIdentifier(ip);
}

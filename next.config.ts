import type { NextConfig } from "next";

const imageHosts = (process.env.NEXT_IMAGE_HOSTS || "webtenseenergy.com,images.unsplash.com")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const contentSecurityPolicy = [
  "default-src 'self'",
  // unsafe-inline requerido por Tailwind CSS v4 (estilos inline en runtime).
  // unsafe-eval eliminado para reducir superficie XSS.
  "script-src 'self' 'unsafe-inline' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/tag/:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/como-reducir-factura-luz-2025-energia-solar",
        destination: "/blog/como-reducir-factura-luz-2026-energia-solar",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/ueb", destination: "/ueb/index.html" },
      { source: "/ueb/", destination: "/ueb/index.html" },
      { source: "/ueb/admin", destination: "/ueb/admin/index.html" },
      { source: "/ueb/admin/", destination: "/ueb/admin/index.html" },
    ];
  },
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;

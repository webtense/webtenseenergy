import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { buildOrganizationSchema, buildWebsiteSchema, getSiteUrl, SITE_NAME } from "@/lib/seo";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Eficiencia y Domótica`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Plataforma especializada en eficiencia energética y domótica práctica. Guías, comparativas y herramientas para el ahorro en el hogar.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Eficiencia y Domótica`,
    description:
      "Plataforma especializada en eficiencia energética y domótica práctica. Guías, comparativas y herramientas para el ahorro en el hogar.",
    url: siteUrl,
    siteName: SITE_NAME,
    images: [{ url: new URL("/images/hero_home.png", siteUrl).toString() }],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Eficiencia y Domótica`,
    description:
      "Plataforma especializada en eficiencia energética y domótica práctica. Guías, comparativas y herramientas para el ahorro en el hogar.",
    images: [new URL("/images/hero_home.png", siteUrl).toString()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = JSON.stringify(buildOrganizationSchema());
  const websiteSchema = JSON.stringify(buildWebsiteSchema());

  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary-500/30">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
        <Header />
        <main className="flex-1 pb-28 md:pb-0">{children}</main>
        <MobileBottomNav />
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}

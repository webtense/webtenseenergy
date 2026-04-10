"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/paths";

const labels = {
  es: {
    home: "Inicio",
    blog: "Blog",
    ofertas: "Ofertas",
    estudio: "Estudio",
    contacto: "Contacto",
  },
  ca: {
    home: "Inici",
    blog: "Blog",
    ofertas: "Ofertes",
    estudio: "Estudi",
    contacto: "Contacte",
  },
};

const items = [
  {
    key: "home",
    href: "/",
    icon: "⌂",
  },
  {
    key: "blog",
    href: "/blog",
    icon: "◫",
  },
  {
    key: "ofertas",
    href: "/ofertas",
    icon: "⚡",
  },
  {
    key: "estudio",
    href: "/estudio",
    icon: "▣",
  },
  {
    key: "contacto",
    href: "/contacto",
    icon: "✆",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const locale = pathname.startsWith("/ca") ? "ca" : "es";
  const basePath = pathname.startsWith("/ca") ? "/ca" : pathname.startsWith("/es") ? "/es" : "";
  const localeLabels = labels[locale];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-zinc-950/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 rounded-3xl border border-white/10 bg-black/20 p-1.5 shadow-2xl shadow-black/30">
        {items.map((item) => {
          const href = withBasePath(basePath, item.href);
          const isActive = pathname === href || (href !== withBasePath(basePath, "/") && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex min-h-16 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
                isActive ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25" : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1">{localeLabels[item.key as keyof typeof localeLabels]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

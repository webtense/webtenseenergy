"use client";

import Link from "next/link";
import Image from "next/image";

export interface ProductCardProps {
  id: string;
  title: string;
  asin: string;
  imageUrl?: string | null;
  affiliateUrl: string;
  rating: number;
  pros: string[];
  cons: string[];
  price?: number | null;
}

export function ProductCard({
  title,
  imageUrl,
  affiliateUrl,
  rating,
  pros,
  cons,
  price,
}: ProductCardProps) {
  return (
    <div className="card-feature border-l-4 border-amber-500 bg-white dark:bg-slate-900">
      <div className="grid grid-cols-[100px,1fr] gap-4">
        {/* Imagen */}
        {imageUrl && (
          <div className="relative h-24 bg-gray-100 dark:bg-slate-800 rounded overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Contenido */}
        <div className="space-y-2">
          <h4 className="section-copy font-bold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h4>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < rating
                      ? "text-amber-500 text-lg"
                      : "text-gray-300 dark:text-slate-600 text-lg"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Pros/Cons */}
          <div className="text-xs space-y-1">
            {pros.length > 0 && (
              <div>
                <strong className="text-green-700 dark:text-green-400">
                  ✓ Ventajas:
                </strong>
                <ul className="ml-4 list-disc text-green-700 dark:text-green-400 space-y-0">
                  {pros.slice(0, 2).map((pro, i) => (
                    <li key={i} className="text-xs">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div>
                <strong className="text-red-700 dark:text-red-400">
                  ✗ Consideraciones:
                </strong>
                <ul className="ml-4 list-disc text-red-700 dark:text-red-400 space-y-0">
                  {cons.slice(0, 1).map((con, i) => (
                    <li key={i} className="text-xs">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex justify-between items-end pt-2 border-t border-gray-200 dark:border-slate-700">
            {price && (
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                €{price.toFixed(2)}
              </span>
            )}
            <Link
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Tracking opcional (GA)
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "affiliate_click", {
                    asin: title,
                    source: "product_card",
                  });
                }
              }}
              className="cta-primary cta-sm ml-auto"
            >
              Ver en Amazon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

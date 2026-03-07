import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/mockData";
import FavoriteButton from "./FavoriteButton";

function formatPrice(
  price: number,
  currency: "USD" | "RD$",
  operation: "venta" | "alquiler"
): string {
  const formatted = new Intl.NumberFormat("es-DO").format(price);
  const suffix = operation === "alquiler" ? "/mes" : "";
  return `${currency} ${formatted}${suffix}`;
}

export default function PropertyCard({
  id,
  title,
  price,
  currency,
  operation,
  city,
  sector,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  type,
  isFavorite = false,
}: Property) {
  return (
    <Link
      href={`/propiedad/${id}`}
      className="group block border border-brand-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {type}
        </span>
        {/* Favorite button — Client Component to handle onClick */}
        <FavoriteButton isFavorite={isFavorite} title={title} />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="font-serif text-xl text-primary mb-1">
          {formatPrice(price, currency, operation)}
        </p>

        {/* Operation badge */}
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
            operation === "venta"
              ? "bg-brand-50 text-brand-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          En {operation}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Location */}
        <p className="text-xs text-text-secondary mb-3">
          {sector}, {city}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-brand-100 text-xs text-text-secondary">
          {type !== "Terreno" && (
            <>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {bedrooms} hab
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16M4 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                </svg>
                {bathrooms} baños
              </span>
            </>
          )}
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            {area} m²
          </span>
        </div>
      </div>
    </Link>
  );
}

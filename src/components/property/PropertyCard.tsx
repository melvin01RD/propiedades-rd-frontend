import Image from "next/image";
import Link from "next/link";
import type { PropertyListItem } from "@/lib/api";
import FavoriteButton from "./FavoriteButton";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Apartamento",
  commercial: "Comercial",
  villa: "Villa",
};

function formatPrice(
  price: string,
  currency: "DOP" | "USD",
  operationType: "sale" | "rent"
): string {
  const formatted = new Intl.NumberFormat("es-DO").format(parseFloat(price));
  const currencyLabel = currency === "DOP" ? "RD$" : "USD";
  const suffix = operationType === "rent" ? "/mes" : "";
  return `${currencyLabel} ${formatted}${suffix}`;
}

export default function PropertyCard({
  id,
  title,
  price,
  currency,
  operation_type,
  province,
  sector,
  bedrooms,
  bathrooms,
  area_m2,
  cover_image,
  property_type,
}: PropertyListItem) {
  const typeLabel = PROPERTY_TYPE_LABELS[property_type] ?? property_type;
  const operationLabel = operation_type === "sale" ? "venta" : "alquiler";
  const imageSrc = cover_image ?? `https://picsum.photos/seed/${id}/800/450`;
  const locationLabel = sector ? `${sector.name}, ${province.name}` : province.name;

  return (
    <Link
      href={`/propiedad/${id}`}
      className="group block border border-brand-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {typeLabel}
        </span>
        <FavoriteButton isFavorite={false} title={title} />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-serif text-xl text-primary mb-1">
          {formatPrice(price, currency, operation_type)}
        </p>

        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
            operation_type === "sale"
              ? "bg-brand-50 text-brand-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          En {operationLabel}
        </span>

        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-1">
          {title}
        </h3>

        <p className="text-xs text-text-secondary mb-3">{locationLabel}</p>

        <div className="flex items-center gap-4 pt-3 border-t border-brand-100 text-xs text-text-secondary">
          {bedrooms !== null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {bedrooms} hab
            </span>
          )}
          {bathrooms !== null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M4 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
              </svg>
              {bathrooms} baños
            </span>
          )}
          {area_m2 !== null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {area_m2} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

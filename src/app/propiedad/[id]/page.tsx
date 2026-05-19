import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProperty, getProperties } from "@/services/properties";
import type { AmenityCategory } from "@/lib/api";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyCard from "@/components/property/PropertyCard";
import FavoriteButton from "@/components/FavoriteButton";

// ─── helpers ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Apartamento",
  commercial: "Comercial",
  villa: "Villa",
};

const CATEGORY_LABELS: Record<AmenityCategory, string> = {
  security: "Seguridad",
  recreation: "Recreación",
  services: "Servicios",
  exterior: "Exterior",
};

function formatPrice(price: string, currency: "DOP" | "USD"): string {
  const formatted = new Intl.NumberFormat("es-DO").format(parseFloat(price));
  return `${currency === "DOP" ? "RD$" : "USD"} ${formatted}`;
}

// ─── metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data } = await getProperty(params.id);
  return {
    title: data ? `${data.title} | PropiedadesRD` : "Propiedad | PropiedadesRD",
    description: data?.description?.slice(0, 160) ?? undefined,
  };
}

// ─── agent contact card (no auth required, renders server-side) ─────────────
// TODO: replace placeholder data with GET /properties/{id}/agent when endpoint is available

interface AgentContactCardProps {
  title: string;
  operationType: "sale" | "rent";
}

function AgentContactCard({ title, operationType }: AgentContactCardProps) {
  const whatsappText = encodeURIComponent(
    `Hola, me interesa la propiedad: ${title}`
  );

  return (
    <div className="bg-white border border-brand-100 rounded-2xl p-6">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-5">
        {operationType === "sale" ? "Contactar al vendedor" : "Contactar al arrendador"}
      </p>

      {/* Agent avatar + name */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-sm">PR</span>
        </div>
        <div>
          <p className="font-medium text-text-primary text-sm">Agente PropiedadesRD</p>
          <p className="text-xs text-text-secondary">Agente verificado</p>
        </div>
      </div>

      {/* Contact buttons */}
      <div className="space-y-2.5">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/18295550000?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#128C7E] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        {/* Llamar */}
        <a
          href="tel:+18295550000"
          className="flex items-center justify-center gap-2.5 w-full py-3 bg-white border border-brand-100 text-text-primary text-sm font-medium rounded-xl hover:border-primary hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Llamar
        </a>

        {/* Enviar email */}
        <a
          href="mailto:contacto@propiedadesrd.com"
          className="flex items-center justify-center gap-2.5 w-full py-3 bg-white border border-brand-100 text-text-primary text-sm font-medium rounded-xl hover:border-primary hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Enviar email
        </a>
      </div>

      <p className="text-xs text-text-secondary text-center mt-4">
        Al contactar aceptas los{" "}
        <Link href="/terminos" className="text-primary hover:underline">
          Términos de uso
        </Link>
      </p>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: property } = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  const { data: similarData } = await getProperties({
    province_id: property.province.id,
    limit: 5,
  });

  const similar = (similarData?.items ?? [])
    .filter((p) => p.id !== params.id)
    .slice(0, 4);

  // Group amenities by category
  type AmenityGroup = { category: AmenityCategory; items: typeof property.amenities };
  const amenityGroups = property.amenities.reduce<AmenityGroup[]>((acc, amenity) => {
    const group = acc.find((g) => g.category === amenity.category);
    if (group) {
      group.items.push(amenity);
    } else {
      acc.push({ category: amenity.category, items: [amenity] });
    }
    return acc;
  }, []);

  const typeLabel = PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type;
  const locationParts = [
    property.sector?.name,
    property.city,
    property.province.name,
    property.country,
  ].filter(Boolean);

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-6 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span aria-hidden>/</span>
          <Link href="/propiedades" className="hover:text-primary transition-colors">
            Propiedades
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/propiedades?province_id=${property.province.id}`}
            className="hover:text-primary transition-colors"
          >
            {property.province.name}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-text-primary line-clamp-1 max-w-[200px]">{property.title}</span>
        </nav>

        {/* A. Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* B. Property header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-0">
              {/* Type badge */}
              <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
                {typeLabel}
              </span>
              {/* Title */}
              <h1 className="font-serif text-4xl text-brand-950 leading-tight mb-3">
                {property.title}
              </h1>
              {/* Price + operation */}
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-bold text-2xl text-primary">
                  {formatPrice(property.price, property.currency)}
                </p>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    property.operation_type === "sale"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {property.operation_type === "sale" ? "En venta" : "En alquiler"}
                </span>
              </div>
            </div>

            {/* Favorite button */}
            <FavoriteButton propertyId={property.id} title={property.title} />
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-5 border-t border-brand-100 text-sm text-text-secondary">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1.5">
                🛏{" "}
                <span>
                  <strong className="text-text-primary">{property.bedrooms}</strong>{" "}
                  {property.bedrooms === 1 ? "habitación" : "habitaciones"}
                </span>
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1.5">
                🚿{" "}
                <span>
                  <strong className="text-text-primary">{property.bathrooms}</strong>{" "}
                  {property.bathrooms === 1 ? "baño" : "baños"}
                </span>
              </span>
            )}
            {property.area_m2 !== null && (
              <span className="flex items-center gap-1.5">
                📐{" "}
                <span>
                  <strong className="text-text-primary">{property.area_m2}</strong> m²
                </span>
              </span>
            )}
            {property.parking_spots !== null && property.parking_spots > 0 && (
              <span className="flex items-center gap-1.5">
                🚗{" "}
                <span>
                  <strong className="text-text-primary">{property.parking_spots}</strong>{" "}
                  {property.parking_spots === 1 ? "parqueo" : "parqueos"}
                </span>
              </span>
            )}
            {property.year_built !== null && (
              <span className="flex items-center gap-1.5">
                🏗{" "}
                <span>
                  Construido en{" "}
                  <strong className="text-text-primary">{property.year_built}</strong>
                </span>
              </span>
            )}
          </div>
        </div>

        {/* C. Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Main content — 65% */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Description */}
            {property.description && (
              <section>
                <h2 className="font-serif text-2xl text-brand-950 mb-4">Descripción</h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </section>
            )}

            {/* E. Amenities */}
            {property.amenities.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-brand-950 mb-5">Amenidades</h2>
                {amenityGroups.length > 1 ? (
                  <div className="space-y-6">
                    {amenityGroups.map(({ category, items }) => (
                      <div key={category}>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                          {CATEGORY_LABELS[category]}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {items.map((amenity) => (
                            <span
                              key={amenity.id}
                              className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm px-3 py-1.5 rounded-full border border-brand-100"
                            >
                              {amenity.icon && (
                                <span aria-hidden="true">{amenity.icon}</span>
                              )}
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm px-3 py-1.5 rounded-full border border-brand-100"
                      >
                        {amenity.icon && (
                          <span aria-hidden="true">{amenity.icon}</span>
                        )}
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Location */}
            <section>
              <h2 className="font-serif text-2xl text-brand-950 mb-4">Ubicación</h2>
              <div className="text-text-secondary space-y-1 mb-4">
                {property.address && <p className="font-medium">{property.address}</p>}
                <p>{locationParts.join(", ")}</p>
              </div>
              {/* Map placeholder */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl h-48 flex flex-col items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                <p className="text-sm text-text-secondary">Mapa interactivo próximamente</p>
              </div>
            </section>
          </div>

          {/* D. Sidebar — sticky agent card, 35% */}
          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="lg:sticky lg:top-24">
              <AgentContactCard
                title={property.title}
                operationType={property.operation_type}
              />
            </div>
          </aside>
        </div>

        {/* F. Similar properties */}
        {similar.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-brand-950">
                Propiedades similares en {property.province.name}
              </h2>
              <Link
                href={`/propiedades?province_id=${property.province.id}`}
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors hidden sm:block"
              >
                Ver más →
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
              {similar.map((p) => (
                <div key={p.id} className="w-72 shrink-0">
                  <PropertyCard {...p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

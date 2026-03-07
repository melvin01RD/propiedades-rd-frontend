import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import { mockProperties } from "@/lib/mockData";

const stats = [
  { value: "8,400+", label: "Propiedades activas" },
  { value: "10", label: "Provincias cubiertas" },
  { value: "USD 50K", label: "Precio desde" },
  { value: "Hoy", label: "Última actualización" },
];

export default function HomePage() {
  const featured = mockProperties.slice(0, 6);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-brand-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-base">🇩🇴</span>
            <span className="text-xs font-medium text-text-secondary">
              Plataforma inmobiliaria #1 en República Dominicana
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] text-brand-950 leading-tight max-w-3xl mx-auto">
            Encuentra tu próxima{" "}
            <span className="text-primary">propiedad ideal</span>{" "}
            en República Dominicana
          </h1>

          <p className="mt-5 text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Miles de propiedades en venta y alquiler en todo el país.
            Mapas interactivos, filtros avanzados y estimador de precios.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Ciudad, sector o referencia..."
                className="w-full h-full pl-10 pr-4 py-3.5 text-sm border border-brand-100 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white shadow-sm"
              />
            </div>
            <Link
              href="/propiedades"
              className="px-8 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors text-center shadow-sm shrink-0"
            >
              Buscar
            </Link>
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "Apartamentos en venta",
              "Casas en alquiler",
              "Punta Cana",
              "Santo Domingo",
              "Santiago",
            ].map((tag) => (
              <Link
                key={tag}
                href="/propiedades"
                className="text-xs px-3 py-1.5 bg-white border border-brand-100 rounded-full text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-brand-100 pt-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-2xl text-brand-950">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured properties ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl text-brand-950">
              Propiedades destacadas
            </h2>
            <p className="text-text-secondary mt-1 text-sm">
              Selección editorial actualizada cada semana
            </p>
          </div>
          <Link
            href="/propiedades"
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors hidden sm:inline-flex items-center gap-1"
          >
            Ver todas
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/propiedades"
            className="inline-block px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </section>
    </div>
  );
}

import PropertyCard from "./PropertyCard";
import { mockProperties } from "@/lib/mockData";

export default function PropertyGrid() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-950">
            Propiedades en todo el país
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            En Venta o Alquiler ·{" "}
            <span className="font-medium text-text-primary">121 resultados</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sort */}
          <select className="text-sm border border-brand-100 rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary bg-white">
            <option>Más recientes</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Mayor área</option>
          </select>

          {/* View toggles */}
          <div className="flex border border-brand-100 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label="Vista lista"
              className="p-2 text-text-secondary hover:bg-brand-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Grid compacto"
              className="p-2 bg-brand-50 border-x border-brand-100 text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Grid amplio"
              className="p-2 text-text-secondary hover:bg-brand-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="10" rx="1" /><rect x="3" y="16" width="18" height="5" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-10">
        <button
          type="button"
          className="px-4 py-2 text-sm text-text-secondary border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors"
        >
          Anterior
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            className={`w-9 h-9 text-sm rounded-lg transition-colors ${
              page === 1
                ? "bg-primary text-white"
                : "text-text-secondary border border-brand-100 hover:bg-brand-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="px-4 py-2 text-sm text-text-secondary border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

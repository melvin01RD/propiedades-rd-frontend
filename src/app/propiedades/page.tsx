import FiltersPanel from "@/components/search/FiltersPanel";
import PropertyGrid from "@/components/property/PropertyGrid";

export default function PropiedadesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      {/* Left panel — fixed width, independently scrollable, hidden on mobile */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col overflow-y-auto bg-white border-r border-brand-100">
        <div className="p-5">
          <FiltersPanel />
        </div>
      </aside>

      {/* Right panel — flex-1, independently scrollable */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
          <PropertyGrid />

          {/* Map placeholder */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl h-72 flex flex-col items-center justify-center gap-3 text-center px-6 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
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
            <div>
              <p className="font-serif text-lg text-brand-700">Mapa interactivo</p>
              <p className="text-sm text-text-secondary mt-0.5">
                Próximamente — integración con Mapbox
              </p>
            </div>
          </div>

          {/* Bottom padding so pagination doesn't clip */}
          <div className="h-4" />
        </div>
      </main>
    </div>
  );
}

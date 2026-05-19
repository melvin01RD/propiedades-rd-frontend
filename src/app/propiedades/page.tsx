import { Suspense } from "react";
import Link from "next/link";
import { getProperties } from "@/services/properties";
import { getProvinces } from "@/services/catalogs";
import type { OperationType, PropertyFilters, PropertyType } from "@/lib/api";
import FiltersPanel from "@/components/search/FiltersPanel";
import PropertyGrid from "@/components/property/PropertyGrid";

type RawParams = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  if (!s) return undefined;
  const n = Number(s);
  return isNaN(n) ? undefined : n;
}

const VALID_OPERATION_TYPES = new Set<string>(["sale", "rent"]);
const VALID_PROPERTY_TYPES = new Set<string>(["house", "apartment", "commercial", "villa"]);

function parseFilters(params: RawParams): PropertyFilters {
  const opStr = str(params.operation_type);
  const propStr = str(params.property_type);
  return {
    operation_type: opStr && VALID_OPERATION_TYPES.has(opStr) ? (opStr as OperationType) : undefined,
    property_type: propStr && VALID_PROPERTY_TYPES.has(propStr) ? (propStr as PropertyType) : undefined,
    price_min: num(params.price_min),
    price_max: num(params.price_max),
    province_id: num(params.province_id),
    sector_id: num(params.sector_id),
    bedrooms_min: num(params.bedrooms_min),
    bathrooms_min: num(params.bathrooms_min),
    area_min: num(params.area_min),
    area_max: num(params.area_max),
    page: num(params.page),
  };
}

// FiltersPanel (client component) uses useSearchParams, which requires a Suspense boundary
function FiltersPanelWrapper({
  provinces,
  total,
}: {
  provinces: import("@/lib/api").ProvinceResponse[];
  total: number;
}) {
  return (
    <Suspense
      fallback={
        <div className="bg-white border border-brand-100 rounded-2xl p-5 animate-pulse">
          <div className="h-4 bg-brand-100 rounded w-16 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 bg-brand-50 rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <FiltersPanel provinces={provinces} total={total} />
    </Suspense>
  );
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: RawParams;
}) {
  const filters = parseFilters(searchParams);

  const [propertiesResult, provincesResult] = await Promise.all([
    getProperties(filters),
    getProvinces(),
  ]);

  const provinces = provincesResult.data ?? [];

  // Error state
  if (propertiesResult.error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-surface px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-brand-950 mb-2">
            No pudimos cargar las propiedades
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            {propertiesResult.error.message}
          </p>
          <Link
            href="/propiedades"
            className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Reintentar
          </Link>
        </div>
      </div>
    );
  }

  const propertyData = propertiesResult.data;
  const properties = propertyData?.items ?? [];
  const total = propertyData?.total ?? 0;
  const page = propertyData?.page ?? 1;
  const pages = propertyData?.pages ?? 1;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      {/* Left panel — 40% width, independently scrollable, hidden on mobile */}
      <aside className="hidden lg:flex w-2/5 shrink-0 flex-col overflow-y-auto bg-white border-r border-brand-100">
        <div className="p-5">
          <FiltersPanelWrapper provinces={provinces} total={total} />
        </div>
      </aside>

      {/* Right panel — 60%, independently scrollable */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Results counter */}
          <p className="text-sm text-text-secondary mb-6">
            <span className="font-semibold text-text-primary">{total}</span>{" "}
            propiedades encontradas
          </p>

          {/* Empty state */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
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
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-brand-950 mb-2">
                No encontramos propiedades
              </h2>
              <p className="text-sm text-text-secondary mb-6 max-w-xs">
                Intenta ajustar los filtros para ampliar tu búsqueda.
              </p>
              <Link
                href="/propiedades"
                className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Limpiar filtros
              </Link>
            </div>
          ) : (
            <PropertyGrid
              properties={properties}
              total={total}
              page={page}
              pages={pages}
            />
          )}
        </div>
      </main>
    </div>
  );
}

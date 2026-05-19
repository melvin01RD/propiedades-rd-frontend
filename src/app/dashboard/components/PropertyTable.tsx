import Link from "next/link";
import type { MyPropertyListItem, PropertyStatus } from "@/lib/api";
import { togglePropertyStatusAction } from "../actions";

interface PropertyTableProps {
  items: MyPropertyListItem[];
}

const STATUS_CONFIG: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Activa",
    className: "bg-[#1D9E75] text-white",
  },
  inactive: {
    label: "Pausada",
    className: "bg-[#F59E0B] text-white",
  },
  draft: {
    label: "Pendiente",
    className: "bg-[#4338CA] text-white",
  },
  sold: {
    label: "Vendida",
    className: "bg-gray-400 text-white",
  },
  rented: {
    label: "Alquilada",
    className: "bg-gray-400 text-white",
  },
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Apartamento",
  commercial: "Comercial",
  villa: "Villa",
};

function formatPrice(price: string, currency: "DOP" | "USD"): string {
  const formatted = new Intl.NumberFormat("es-DO").format(parseFloat(price));
  return `${currency === "DOP" ? "RD$" : "USD"} ${formatted}`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl py-16 px-6 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h3 className="font-serif text-xl text-brand-950 mb-2">
        Aún no tienes propiedades publicadas
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
        Comienza a publicar propiedades para administrarlas desde aquí.
      </p>
      <Link
        href="/propiedades/nueva"
        className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
      >
        Publicar tu primera propiedad
      </Link>
    </div>
  );
}

// ─── table ───────────────────────────────────────────────────────────────────

export default function PropertyTable({ items }: PropertyTableProps) {
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Título
              </th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Tipo
              </th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Precio
              </th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Estado
              </th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden md:table-cell">
                Fecha
              </th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((property) => {
              const status = STATUS_CONFIG[property.status];
              const canToggle =
                property.status === "active" || property.status === "inactive";

              return (
                <tr
                  key={property.id}
                  className="hover:bg-brand-50/40 transition-colors"
                >
                  {/* Título */}
                  <td className="py-3.5 px-5">
                    <Link
                      href={`/propiedad/${property.id}`}
                      className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-1 max-w-[200px] block"
                    >
                      {property.title}
                    </Link>
                  </td>

                  {/* Tipo */}
                  <td className="py-3.5 px-4 text-text-secondary">
                    {PROPERTY_TYPE_LABELS[property.property_type] ??
                      property.property_type}
                  </td>

                  {/* Precio */}
                  <td className="py-3.5 px-4 font-medium text-text-primary whitespace-nowrap">
                    {formatPrice(property.price, property.currency)}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="py-3.5 px-4 text-text-secondary hidden md:table-cell whitespace-nowrap">
                    {formatDate(property.created_at)}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {/* Editar — ghost button */}
                      <Link
                        href={`/propiedad/${property.id}/editar`}
                        className="px-3 py-1.5 text-xs font-medium border border-brand-100 text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        Editar
                      </Link>

                      {/* Pausar / Activar — form + server action */}
                      {canToggle && (
                        <form action={togglePropertyStatusAction}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <input
                            type="hidden"
                            name="currentStatus"
                            value={property.status}
                          />
                          <button
                            type="submit"
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              property.status === "active"
                                ? "border border-amber-300 text-amber-700 hover:bg-amber-50"
                                : "border border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {property.status === "active" ? "Pausar" : "Activar"}
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

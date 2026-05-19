import Link from "next/link";
import { getCurrentUser } from "@/services/auth";
import { getMyProperties } from "@/services/properties";
import DashboardSidebar from "./components/DashboardSidebar";
import KPICard from "./components/KPICard";
import PropertyTable from "./components/PropertyTable";

export default async function DashboardPage() {
  // Parallel fetch: user data + property listing
  const [user, propertiesResult] = await Promise.all([
    getCurrentUser(),
    getMyProperties(),
  ]);

  const propertyData = propertiesResult.data;
  const items = propertyData?.items ?? [];

  // KPI counts — derived from current page items
  const kpi = {
    total: propertyData?.total ?? 0,
    active: items.filter((p) => p.status === "active").length,
    paused: items.filter((p) => p.status === "inactive").length,
    pending: items.filter((p) => p.status === "draft").length,
  };

  const greeting = user?.email
    ? user.email.split("@")[0]
    : "Agente";

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* ── Page header ── */}
        <header className="bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between shrink-0 lg:pl-6 pl-16">
          <div>
            <h1 className="font-serif text-2xl text-brand-950">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Bienvenido de vuelta,{" "}
              <span className="font-medium text-text-primary">{greeting}</span>
            </p>
          </div>

          {/* C. CTA Nueva propiedad */}
          <Link
            href="/propiedades/nueva"
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-brand-950 text-sm font-semibold rounded-xl hover:brightness-95 transition-all shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva propiedad
          </Link>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24 lg:pb-6">
          {/* A. KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Total publicaciones"
              value={kpi.total}
              description="Todas las propiedades"
            />
            <KPICard
              label="Activas"
              value={kpi.active}
              description="Visibles al público"
            />
            <KPICard
              label="Pausadas"
              value={kpi.paused}
              description="Temporalmente ocultas"
            />
            <KPICard
              label="Pendientes"
              value={kpi.pending}
              description="En revisión o borrador"
            />
          </div>

          {/* B. Property table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-brand-950">
                Mis propiedades
              </h2>
              {items.length > 0 && (
                <span className="text-xs text-text-secondary">
                  {items.length} de {kpi.total} mostradas
                </span>
              )}
            </div>

            {propertiesResult.error ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-sm text-text-secondary">
                  No se pudo cargar la lista de propiedades.{" "}
                  <span className="text-red-500">
                    {propertiesResult.error.message}
                  </span>
                </p>
              </div>
            ) : (
              <PropertyTable items={items} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

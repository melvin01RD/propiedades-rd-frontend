import Link from "next/link";
import { getFavorites } from "@/services/favorites";
import PropertyCard from "@/components/property/PropertyCard";
import RemoveFavoriteButton from "@/components/RemoveFavoriteButton";

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-brand-950 mb-2">
        No tienes favoritos guardados
      </h2>
      <p className="text-sm text-text-secondary mb-8 max-w-xs">
        Guarda propiedades que te interesen para verlas aquí cuando quieras.
      </p>
      <Link
        href="/propiedades"
        className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
      >
        Explorar propiedades
      </Link>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function FavoritosPage() {
  const { data: favorites, error } = await getFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-brand-950">Mis favoritos</h1>
        {favorites && favorites.length > 0 && (
          <p className="text-sm text-text-secondary mt-1">
            {favorites.length}{" "}
            {favorites.length === 1
              ? "propiedad guardada"
              : "propiedades guardadas"}
          </p>
        )}
      </div>

      {/* Error state */}
      {error ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-text-secondary">
            No se pudo cargar tus favoritos.{" "}
            <span className="text-red-500">{error.message}</span>
          </p>
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <RemoveFavoriteButton
              key={favorite.id}
              propertyId={favorite.property_id}
              savedAt={favorite.created_at}
            >
              <PropertyCard {...favorite.property} />
            </RemoveFavoriteButton>
          ))}
        </div>
      )}
    </div>
  );
}

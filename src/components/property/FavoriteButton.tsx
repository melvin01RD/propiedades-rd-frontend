"use client";

interface FavoriteButtonProps {
  isFavorite: boolean;
  title: string;
}

export default function FavoriteButton({ isFavorite, title }: FavoriteButtonProps) {
  return (
    <button
      aria-label={isFavorite ? `Quitar ${title} de favoritos` : `Agregar ${title} a favoritos`}
      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
      onClick={(e) => e.preventDefault()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#4338CA" : "none"}
        stroke={isFavorite ? "#4338CA" : "#6B7280"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

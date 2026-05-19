"use client";

import { useState, useEffect, useTransition } from "react";
import { checkFavoriteAction, toggleFavoriteAction } from "@/actions/favorites";

interface FavoriteButtonProps {
  propertyId: string;
  title: string;
}

export default function FavoriteButton({ propertyId, title }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Check initial favorite state on mount
  useEffect(() => {
    checkFavoriteAction(propertyId)
      .then((result) => {
        setIsFavorite(result);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [propertyId]);

  function handleToggle() {
    const next = !isFavorite;
    setIsFavorite(next); // optimistic update

    startTransition(async () => {
      const result = await toggleFavoriteAction(propertyId, !next);
      if (!result.success) {
        setIsFavorite(!next); // revert on failure
      } else {
        setIsFavorite(result.isFavorite);
      }
    });
  }

  return (
    <button
      type="button"
      aria-label={
        isFavorite ? `Quitar ${title} de favoritos` : `Agregar ${title} a favoritos`
      }
      disabled={!checked || isPending}
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
        isFavorite
          ? "bg-brand-50 border-primary text-primary"
          : "bg-white border-brand-100 text-text-secondary hover:border-primary hover:text-primary"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#4338CA" : "none"}
        stroke={isFavorite ? "#4338CA" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPending ? "animate-pulse" : ""}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {isFavorite ? "Guardado" : "Guardar"}
    </button>
  );
}

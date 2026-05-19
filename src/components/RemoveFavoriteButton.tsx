"use client";

import { useState, useTransition } from "react";
import { removeFavoriteAction } from "@/actions/favorites";

interface RemoveFavoriteButtonProps {
  propertyId: string;
  savedAt: string;
  children: React.ReactNode;
}

export default function RemoveFavoriteButton({
  propertyId,
  savedAt,
  children,
}: RemoveFavoriteButtonProps) {
  const [removed, setRemoved] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (removed) return null;

  const savedDate = new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(savedAt));

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    setRemoved(true);
    startTransition(async () => {
      try {
        await removeFavoriteAction(propertyId);
      } catch {
        setRemoved(false);
      }
    });
  }

  return (
    <div className="relative">
      {children}

      {/* Overlay button — covers the card's stub FavoriteButton */}
      <button
        type="button"
        aria-label="Quitar de favoritos"
        onClick={handleRemove}
        disabled={isPending}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm disabled:opacity-50 transition-opacity"
      >
        {isPending ? (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4338CA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#4338CA"
            stroke="#4338CA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>

      {/* Saved date badge */}
      <p className="text-xs text-text-secondary mt-1.5 px-1">
        Guardado el {savedDate}
      </p>
    </div>
  );
}

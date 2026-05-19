"use client";

import { useState } from "react";
import Image from "next/image";
import type { PropertyImageEmbed } from "@/lib/api";

interface PropertyGalleryProps {
  images: PropertyImageEmbed[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const cover = sorted.find((img) => img.is_cover) ?? sorted[0];
  const [activeUrl, setActiveUrl] = useState(cover?.cloudinary_url ?? "");

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full bg-brand-50 border border-brand-100 rounded-2xl flex flex-col items-center justify-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366F1"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <p className="text-sm text-text-secondary">Sin imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-brand-50">
        <Image
          src={activeUrl}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 75vw"
          className="object-cover"
        />
        {/* Image counter badge */}
        {sorted.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
            {sorted.findIndex((img) => img.cloudinary_url === activeUrl) + 1} / {sorted.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveUrl(img.cloudinary_url)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                activeUrl === img.cloudinary_url
                  ? "border-primary"
                  : "border-transparent hover:border-brand-100"
              }`}
            >
              <Image
                src={img.cloudinary_url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

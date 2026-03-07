"use client";

import { useState } from "react";

interface CollapseSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapseSection({ title, defaultOpen = true, children }: CollapseSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-100 py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FiltersPanel() {
  return (
    <div className="bg-white border border-brand-100 rounded-2xl p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">Filtros</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Mostrando <span className="font-medium text-primary">24</span> de 121 propiedades
        </p>
      </div>

      {/* Ubicación */}
      <CollapseSection title="Ubicación">
        <div className="space-y-2">
          {["Provincia", "Municipio", "Barrio"].map((label) => (
            <select
              key={label}
              className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary bg-white"
            >
              <option value="">{label}</option>
            </select>
          ))}
        </div>
      </CollapseSection>

      {/* Moneda y Precio */}
      <CollapseSection title="Moneda y Precio">
        <div className="space-y-2.5">
          {["Incluye documentación verificada", "Amueblado"].map((label) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-brand-100 accent-primary"
              />
              <span className="text-sm text-text-secondary">{label}</span>
            </label>
          ))}
        </div>
      </CollapseSection>

      {/* Tipo de propiedad */}
      <CollapseSection title="Tipo de propiedad">
        <div className="grid grid-cols-2 gap-2">
          {["Apartamento", "Casa", "Terreno", "Edificio"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-brand-100 accent-primary"
              />
              <span className="text-sm text-text-secondary">{type}</span>
            </label>
          ))}
        </div>
      </CollapseSection>

      {/* Tipo de transacción */}
      <CollapseSection title="Tipo de transacción">
        <div className="space-y-2.5">
          {["Venta", "Alquiler"].map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="operation"
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-text-secondary">{type}</span>
            </label>
          ))}
        </div>
      </CollapseSection>

      {/* Habitaciones */}
      <CollapseSection title="Habitaciones">
        <div className="flex gap-2">
          {["1", "2", "3", "4+"].map((n) => (
            <button
              key={n}
              type="button"
              className="flex-1 py-1.5 text-sm border border-brand-100 rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Baños */}
      <CollapseSection title="Baños">
        <div className="flex gap-2">
          {["1", "2", "3+"].map((n) => (
            <button
              key={n}
              type="button"
              className="flex-1 py-1.5 text-sm border border-brand-100 rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Área */}
      <CollapseSection title="Área" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín"
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
          <span className="text-text-secondary text-sm shrink-0">—</span>
          <input
            type="number"
            placeholder="Máx"
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
          <span className="text-xs text-text-secondary shrink-0">m²</span>
        </div>
      </CollapseSection>

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <button
          type="button"
          className="flex-1 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          className="flex-1 py-2.5 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-brand-50 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

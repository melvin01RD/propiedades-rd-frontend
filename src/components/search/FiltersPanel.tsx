"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProvinceResponse } from "@/lib/api";

interface FiltersPanelProps {
  provinces: ProvinceResponse[];
  total?: number;
}

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

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Comercial" },
] as const;

const BEDROOM_OPTIONS = ["1", "2", "3", "4"] as const;
const BATHROOM_OPTIONS = ["1", "2", "3"] as const;

export default function FiltersPanel({ provinces, total }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [provinceId, setProvinceId] = useState(searchParams.get("province_id") ?? "");
  const [operationType, setOperationType] = useState(searchParams.get("operation_type") ?? "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") ?? "");
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") ?? "");
  const [bedroomsMin, setBedroomsMin] = useState(searchParams.get("bedrooms_min") ?? "");
  const [bathroomsMin, setBathroomsMin] = useState(searchParams.get("bathrooms_min") ?? "");
  const [areaMin, setAreaMin] = useState(searchParams.get("area_min") ?? "");
  const [areaMax, setAreaMax] = useState(searchParams.get("area_max") ?? "");

  // Sync form state when URL changes (after navigation)
  useEffect(() => {
    setProvinceId(searchParams.get("province_id") ?? "");
    setOperationType(searchParams.get("operation_type") ?? "");
    setPropertyType(searchParams.get("property_type") ?? "");
    setPriceMin(searchParams.get("price_min") ?? "");
    setPriceMax(searchParams.get("price_max") ?? "");
    setBedroomsMin(searchParams.get("bedrooms_min") ?? "");
    setBathroomsMin(searchParams.get("bathrooms_min") ?? "");
    setAreaMin(searchParams.get("area_min") ?? "");
    setAreaMax(searchParams.get("area_max") ?? "");
  }, [searchParams]);

  function buildQuery(overrides: Record<string, string> = {}): string {
    const values: Record<string, string> = {
      operation_type: operationType,
      property_type: propertyType,
      price_min: priceMin,
      price_max: priceMax,
      province_id: provinceId,
      bedrooms_min: bedroomsMin,
      bathrooms_min: bathroomsMin,
      area_min: areaMin,
      area_max: areaMax,
      ...overrides,
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
    }
    return params.toString();
  }

  function handleApply() {
    const query = buildQuery();
    router.push(`/propiedades${query ? `?${query}` : ""}`);
  }

  function handleClear() {
    setProvinceId("");
    setOperationType("");
    setPropertyType("");
    setPriceMin("");
    setPriceMax("");
    setBedroomsMin("");
    setBathroomsMin("");
    setAreaMin("");
    setAreaMax("");
    router.push("/propiedades");
  }

  function handleProvinceChange(value: string) {
    setProvinceId(value);
    // TODO: fetch sectors for this province in next iteration (sector cascade)
    const query = buildQuery({ province_id: value });
    router.push(`/propiedades${query ? `?${query}` : ""}`);
  }

  return (
    <div className="bg-white border border-brand-100 rounded-2xl p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">Filtros</h2>
        {total !== undefined && (
          <p className="text-xs text-text-secondary mt-0.5">
            <span className="font-medium text-primary">{total}</span> propiedades encontradas
          </p>
        )}
      </div>

      {/* Ubicación */}
      <CollapseSection title="Ubicación">
        <div className="space-y-2">
          <select
            value={provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Todas las provincias</option>
            {provinces.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
          {/* TODO: sector cascade — load sectors for selected province in next iteration */}
          <select
            disabled
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 text-text-secondary bg-white opacity-50 cursor-not-allowed"
          >
            <option value="">Sector (selecciona provincia primero)</option>
          </select>
        </div>
      </CollapseSection>

      {/* Precio */}
      <CollapseSection title="Precio">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
          <span className="text-text-secondary text-sm shrink-0">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
        </div>
      </CollapseSection>

      {/* Tipo de propiedad */}
      <CollapseSection title="Tipo de propiedad">
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="property_type"
                value={value}
                checked={propertyType === value}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-text-secondary">{label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer col-span-2">
            <input
              type="radio"
              name="property_type"
              value=""
              checked={propertyType === ""}
              onChange={() => setPropertyType("")}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-secondary">Todos los tipos</span>
          </label>
        </div>
      </CollapseSection>

      {/* Tipo de transacción */}
      <CollapseSection title="Tipo de transacción">
        <div className="space-y-2.5">
          {[
            { value: "", label: "Venta y alquiler" },
            { value: "sale", label: "Venta" },
            { value: "rent", label: "Alquiler" },
          ].map(({ value, label }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="operation_type"
                value={value}
                checked={operationType === value}
                onChange={(e) => setOperationType(e.target.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-text-secondary">{label}</span>
            </label>
          ))}
        </div>
      </CollapseSection>

      {/* Habitaciones */}
      <CollapseSection title="Habitaciones">
        <div className="flex gap-2">
          {BEDROOM_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBedroomsMin(bedroomsMin === n ? "" : n)}
              className={`flex-1 py-1.5 text-sm border rounded-lg transition-colors ${
                bedroomsMin === n
                  ? "bg-primary text-white border-primary"
                  : "border-brand-100 text-text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {n === "4" ? "4+" : n}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Baños */}
      <CollapseSection title="Baños">
        <div className="flex gap-2">
          {BATHROOM_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBathroomsMin(bathroomsMin === n ? "" : n)}
              className={`flex-1 py-1.5 text-sm border rounded-lg transition-colors ${
                bathroomsMin === n
                  ? "bg-primary text-white border-primary"
                  : "border-brand-100 text-text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {n === "3" ? "3+" : n}
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
            value={areaMin}
            onChange={(e) => setAreaMin(e.target.value)}
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
          <span className="text-text-secondary text-sm shrink-0">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={areaMax}
            onChange={(e) => setAreaMax(e.target.value)}
            className="w-full text-sm border border-brand-100 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          />
          <span className="text-xs text-text-secondary shrink-0">m²</span>
        </div>
      </CollapseSection>

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2.5 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-brand-50 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

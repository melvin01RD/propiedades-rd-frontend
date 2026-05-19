"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import type { UserResponse } from "@/lib/api";

interface DashboardSidebarProps {
  user: UserResponse | null;
}

// ─── nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/propiedades",
    label: "Mis propiedades",
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/propiedades/nueva",
    label: "Nueva propiedad",
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    href: "/perfil",
    label: "Mi perfil",
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

const BOTTOM_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: NAV_ITEMS[0].icon },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: NAV_ITEMS[1].icon },
  { href: "/propiedades/nueva", label: "Nueva", icon: NAV_ITEMS[2].icon },
  { href: "/perfil", label: "Perfil", icon: NAV_ITEMS[3].icon },
] as const;

// ─── role label helper ────────────────────────────────────────────────────────

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    agent: "Agente",
    admin: "Admin",
    owner: "Propietario",
  };
  return labels[role] ?? "Usuario";
}

function roleBadgeClass(role: string): string {
  if (role === "admin") return "bg-purple-100 text-purple-700";
  if (role === "owner") return "bg-blue-100 text-blue-700";
  return "bg-brand-50 text-primary"; // agent
}

// ─── avatar initials from email ───────────────────────────────────────────────

function initials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── nav link ────────────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact: boolean;
  pathname: string;
  onClick?: () => void;
}

function NavLink({ href, label, icon, exact, pathname, onClick }: NavLinkProps) {
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "text-text-secondary hover:bg-brand-50 hover:text-text-primary"
      }`}
    >
      <span className={isActive ? "text-white" : "text-text-secondary"}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

// ─── sidebar content (shared between desktop and mobile panel) ───────────────

interface SidebarContentProps {
  user: UserResponse | null;
  pathname: string;
  onNavClick?: () => void;
}

function SidebarContent({ user, pathname, onNavClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-brand-100">
        <Link href="/" className="font-serif text-xl text-primary font-bold">
          PropiedadesRD
        </Link>
      </div>

      {/* User profile */}
      {user && (
        <div className="px-4 py-4 border-b border-brand-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {initials(user.email)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.email}
              </p>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${roleBadgeClass(user.role)}`}
              >
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            exact={item.exact}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-brand-100">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-brand-100 overflow-y-auto">
        <SidebarContent user={user} pathname={pathname} />
      </aside>

      {/* ── Mobile: hamburger button ── */}
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[4.75rem] left-4 z-40 w-9 h-9 flex items-center justify-center bg-white border border-brand-100 rounded-lg shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ── Mobile: slide-in panel + backdrop ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <aside className="relative w-72 bg-white shadow-xl flex flex-col overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <SidebarContent
              user={user}
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Mobile: bottom navigation ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-100 flex">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              <span className={isActive ? "text-primary" : "text-text-secondary"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

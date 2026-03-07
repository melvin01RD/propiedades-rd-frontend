import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-brand-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🏠</span>
          <span className="font-serif text-xl text-brand-950">
            Propiedades<span className="text-primary-light">RD</span>
          </span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/propiedades"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Propiedades
          </Link>
          <Link
            href="/proyectos"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Proyectos nuevos
          </Link>
          <Link
            href="/calculadora"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Calcula tu alquiler
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-brand-50 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <span aria-hidden>+</span>
            Publicar
          </Link>
        </div>
      </div>
    </header>
  );
}

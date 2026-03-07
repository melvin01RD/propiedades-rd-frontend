import Link from "next/link";

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const footerLinks = {
  producto: [
    { label: "Todas las propiedades", href: "/propiedades" },
    { label: "Calcula tu alquiler", href: "/calculadora" },
    { label: "Proyectos nuevos", href: "/proyectos" },
    { label: "Para propietarios y agentes", href: "/propietarios" },
  ],
  servicios: [
    { label: "Fotógrafos profesionales", href: "/servicios/fotografia" },
    { label: "Te ayudamos a encontrar tu propiedad", href: "/servicios/asesoramiento" },
    { label: "Mercado de clientes", href: "/servicios/mercado" },
  ],
  empresa: [
    { label: "Blog", href: "/blog" },
    { label: "Agencias", href: "/agencias" },
    { label: "Asesores inmobiliarios", href: "/asesores" },
    { label: "Proyectos", href: "/proyectos" },
  ],
  otrosEnlaces: [
    { label: "Centro de ayuda", href: "/ayuda" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mapa del sitio", href: "/sitemap" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏠</span>
              <span className="font-serif text-xl">
                Propiedades<span className="text-primary-light">RD</span>
              </span>
            </div>
            <p className="text-sm text-brand-100/70 leading-relaxed mb-6">
              La plataforma inmobiliaria líder en República Dominicana. Encuentra,
              publica y gestiona propiedades con facilidad.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="text-brand-100/60 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="YouTube" className="text-brand-100/60 hover:text-white transition-colors">
                <YouTubeIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-brand-100/60 hover:text-white transition-colors">
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Col 2: Producto */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-100/50 mb-4">
              Producto
            </h3>
            <ul className="space-y-3">
              {footerLinks.producto.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Servicios */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-100/50 mb-4">
              Servicios
            </h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Empresa */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-100/50 mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Otros enlaces */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-100/50 mb-4">
              Otros enlaces
            </h3>
            <ul className="space-y-3">
              {footerLinks.otrosEnlaces.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-100/50">
            © 2026 PropiedadesRD · Todos los derechos reservados
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-100/50">
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Política de Cookies
            </Link>
            <span className="border border-white/20 rounded px-2 py-1 cursor-default select-none">
              🌐 Español
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

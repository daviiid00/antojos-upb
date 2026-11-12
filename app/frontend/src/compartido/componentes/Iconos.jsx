// Íconos de trazo que heredan el color del texto (currentColor).
function Icono({ children }) {
  return (
    <svg
      className="icono"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function IconoVolver() {
  return (
    <Icono>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </Icono>
  )
}

export function IconoPersona() {
  return (
    <Icono>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icono>
  )
}

export function IconoCorreo() {
  return (
    <Icono>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icono>
  )
}

export function IconoCelular() {
  return (
    <Icono>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </Icono>
  )
}

export function IconoCandado() {
  return (
    <Icono>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Icono>
  )
}

export function IconoDesplegar() {
  return (
    <Icono>
      <path d="m6 9 6 6 6-6" />
    </Icono>
  )
}

export function IconoContinuar() {
  return (
    <Icono>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </Icono>
  )
}
export function IconoBuscar() {
  return (
    <Icono>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icono>
  )
}

export function IconoCerrar() {
  return (
    <Icono>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icono>
  )
}
export function IconoDestellos() {
  return (
    <Icono>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 3v4M17 5h4M5 17v4M3 19h4" />
    </Icono>
  )
}

export function IconoEscudo() {
  return (
    <Icono>
      <path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </Icono>
  )
}

export function IconoFiltros() {
  return (
    <Icono>
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3" />
      <path d="M14 2v4M8 10v4M16 18v4" />
    </Icono>
  )
}
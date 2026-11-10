// Íconos de la barra de navegación (trazo, heredan el color del texto).
function Icono({ children }) {
  return (
    <svg
      className="icono"
      viewBox="0 0 24 24"
      width="22"
      height="22"
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

export function IconoInicio() {
  return (
    <Icono>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icono>
  )
}

export function IconoExplorar() {
  return (
    <Icono>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icono>
  )
}

export function IconoMas() {
  return (
    <Icono>
      <path d="M5 12h14M12 5v14" />
    </Icono>
  )
}

export function IconoSolicitudes() {
  return (
    <Icono>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Icono>
  )
}

export function IconoPerfil() {
  return (
    <Icono>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icono>
  )
}
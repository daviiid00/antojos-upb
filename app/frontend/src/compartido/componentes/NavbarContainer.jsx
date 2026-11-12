import { NavLink } from 'react-router'
import {
  IconoExplorar,
  IconoMas,
  IconoPerfil,
  IconoSolicitudes,
} from './IconosNavegacion.jsx'
import './NavbarContainer.css'

// Cada acceso: ruta, texto e ícono. "Publicar" es el botón destacado.
// Inicio no está: esa pantalla pertenece al release 2.
const ACCESOS = [
  { ruta: '/explorar', texto: 'Explorar', Icono: IconoExplorar },
  { ruta: '/publicar', texto: 'Publicar', Icono: IconoMas, destacado: true },
  { ruta: '/solicitudes', texto: 'Solicitudes', Icono: IconoSolicitudes },
  { ruta: '/perfil', texto: 'Perfil', Icono: IconoPerfil },
]

function NavbarContainer() {
  return (
    <nav className="navegacion" aria-label="Navegación principal">
      <ul className="navegacion__lista">
        {ACCESOS.map(({ ruta, texto, Icono, destacado }) => (
          <li key={ruta}>
            {/* NavLink marca solo el acceso de la ruta actual (isActive) */}
            <NavLink
              to={ruta}
              className={({ isActive }) =>
                [
                  'navegacion__enlace',
                  destacado ? 'navegacion__enlace--destacado' : '',
                  isActive ? 'navegacion__enlace--activo' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className="navegacion__icono">
                <Icono />
              </span>
              <span className="navegacion__texto">{texto}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavbarContainer
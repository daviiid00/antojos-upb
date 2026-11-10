import { Outlet } from 'react-router'
import NavbarContainer from './NavbarContainer.jsx'
import UserBadge from './UserBadge.jsx'
import './AppLayout.css'

// Estructura común: nombre del usuario arriba, la pantalla de la ruta (Outlet)
// y la barra de navegación siempre abajo.
function AppLayout() {
  return (
    <div className="layout">
      <UserBadge />
      <Outlet />
      <NavbarContainer />
    </div>
  )
}

export default AppLayout
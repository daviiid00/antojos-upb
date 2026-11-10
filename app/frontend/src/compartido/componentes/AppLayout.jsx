import { Outlet } from 'react-router'
import NavbarContainer from './NavbarContainer.jsx'
import './AppLayout.css'

// Estructura común: la pantalla de la ruta (Outlet) y la barra siempre abajo.
function AppLayout() {
  return (
    <div className="layout">
      <Outlet />
      <NavbarContainer />
    </div>
  )
}

export default AppLayout
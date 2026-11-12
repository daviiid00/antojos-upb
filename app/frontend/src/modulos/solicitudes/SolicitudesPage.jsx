import { Navigate } from 'react-router'
import { haySesion } from '../../compartido/sesion-rutas/sesion.js'
import SolicitudesContainer from './SolicitudesContainer.jsx'
import './SolicitudesPage.css'

// Pantalla /solicitudes: lo que han pedido los compradores de mis productos
function SolicitudesPage() {
  if (!haySesion()) return <Navigate to="/login" replace />

  return (
    <main className="solicitudes">
      <h1 className="solicitudes__titulo">Solicitudes</h1>
      <SolicitudesContainer />
    </main>
  )
}

export default SolicitudesPage
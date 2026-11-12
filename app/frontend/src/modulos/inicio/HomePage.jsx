import { Link, Navigate } from 'react-router'
import BotonCerrarSesion from '../../compartido/componentes/BotonCerrarSesion.jsx'
import { haySesion } from '../../compartido/sesion-rutas/sesion.js'

// Pantalla mínima mientras se construye el inicio real.
function HomePage() {
  if (!haySesion()) return <Navigate to="/welcome" replace />

  return (
    <main>
      <h1>Inicio</h1>
      <BotonCerrarSesion />
      <Link to="/explorar">Explorar productos</Link>
    </main>
  )
}

export default HomePage

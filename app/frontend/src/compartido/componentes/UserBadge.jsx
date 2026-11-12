import { obtenerNombre } from '../sesion-rutas/sesion.js'
import './UserBadge.css'

// Muestra arriba a la derecha el nombre con el que la persona se registró
function UserBadge() {
  const nombre = obtenerNombre()
  if (!nombre) return null

  // Solo el primer nombre y su inicial (el nombre completo queda como "title")
  const primerNombre = nombre.split(' ')[0]
  const inicial = primerNombre.charAt(0).toUpperCase()

  return (
    <div className="usuario" title={nombre}>
      <span className="usuario__inicial" aria-hidden="true">
        {inicial}
      </span>
      <span className="usuario__nombre">{primerNombre}</span>
    </div>
  )
}

export default UserBadge
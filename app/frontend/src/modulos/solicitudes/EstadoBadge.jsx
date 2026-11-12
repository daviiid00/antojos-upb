import { ESTADOS_SOLICITUD } from '../../compartido/constantes/solicitud.js'
import './EstadoBadge.css'

// Etiqueta con el estado actual de la solicitud
function EstadoBadge({ estado }) {
  const datos = ESTADOS_SOLICITUD[estado]
  const variante = datos?.variante ?? 'desconocido'

  return (
    <span className={`estado estado--${variante}`}>
      {datos?.etiqueta ?? estado}
    </span>
  )
}

export default EstadoBadge
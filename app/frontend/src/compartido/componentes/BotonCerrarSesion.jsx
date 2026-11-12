import { useNavigate } from 'react-router'
import { cerrarSesion } from '../sesion-rutas/sesion.js'

function BotonCerrarSesion() {
  const navigate = useNavigate()

  function salir() {
    cerrarSesion()
    navigate('/welcome', { replace: true })
  }

  return (
    <button type="button" onClick={salir}>
      Cerrar sesión
    </button>
  )
}

export default BotonCerrarSesion

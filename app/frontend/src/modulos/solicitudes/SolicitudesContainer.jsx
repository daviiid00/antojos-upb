import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ErrorApi } from '../../compartido/servicios/api.js'
import { obtenerSolicitudes } from '../../compartido/servicios/solicitudes.js'
import SolicitudItemCard from './SolicitudItemCard.jsx'

const MENSAJE_SESION = 'Tu sesión venció.'
const MENSAJE_ERROR = 'No pudimos cargar tus solicitudes. Inténtalo de nuevo.'
const MENSAJE_VACIO = 'Aún no has recibido solicitudes.'

// Consulta las solicitudes del vendedor y decide qué pintar: carga, error, lista vacía o lista
function SolicitudesContainer() {
  const [estado, setEstado] = useState({
    cargando: true,
    solicitudes: [],
    error: null,
  })

  useEffect(() => {
    let vigente = true // evita pintar respuestas viejas
    obtenerSolicitudes()
      .then((datos) => {
        if (!vigente) return
        setEstado({
          cargando: false,
          solicitudes: Array.isArray(datos) ? datos : [],
          error: null,
        })
      })
      .catch((error) => {
        if (!vigente) return
        const sesionVencida = error instanceof ErrorApi && error.estado === 401
        setEstado({
          cargando: false,
          solicitudes: [],
          error: sesionVencida ? 'sesion' : 'general',
        })
      })
    return () => {
      vigente = false
    }
  }, [])

  const { cargando, solicitudes, error } = estado

  if (cargando) return <p className="solicitudes__mensaje">Cargando…</p>

  if (error === 'sesion') {
    return (
      <p className="solicitudes__mensaje" role="alert">
        {MENSAJE_SESION} <Link to="/login">Inicia sesión nuevamente</Link>.
      </p>
    )
  }

  if (error) {
    return (
      <p className="solicitudes__mensaje" role="alert">
        {MENSAJE_ERROR}
      </p>
    )
  }

  if (solicitudes.length === 0) {
    return <p className="solicitudes__mensaje">{MENSAJE_VACIO}</p>
  }

  return (
    <ul className="solicitudes__lista">
      {solicitudes.map((solicitud) => (
        <SolicitudItemCard key={solicitud.id} solicitud={solicitud} />
      ))}
    </ul>
  )
}

export default SolicitudesContainer
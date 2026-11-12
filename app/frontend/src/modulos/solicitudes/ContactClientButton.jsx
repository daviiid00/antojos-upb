import { IconoSolicitudes } from '../../compartido/componentes/IconosNavegacion.jsx'
import './ContactClientButton.css'

const AVISO_SIN_CONTACTO =
  'El comprador no proporcionó una vía de contacto rápida.'

// Abre la conversación con el comprador en otra pestaña.
// Sin enlace válido, el botón queda deshabilitado con un aviso.
function ContactClientButton({ enlace }) {
  if (!enlace) {
    return (
      <div className="contacto">
        <button className="contacto__boton" type="button" disabled>
          <IconoSolicitudes />
          Contactar comprador
        </button>
        <p className="contacto__aviso" role="status">
          {AVISO_SIN_CONTACTO}
        </p>
      </div>
    )
  }

  return (
    <div className="contacto">
      <a
        className="contacto__boton"
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconoSolicitudes />
        Contactar comprador
      </a>
    </div>
  )
}

export default ContactClientButton
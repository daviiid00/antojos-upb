import { IconoSolicitudes } from '../../compartido/componentes/IconosNavegacion.jsx'
import { construirEnlaceWhatsApp } from '../../compartido/utilidades/whatsapp.js'
import './WhatsAppRequestButton.css'

// Botón que abre WhatsApp en otra pestaña con un mensaje listo para el vendedor
function WhatsAppRequestButton({ producto, cantidad = 1 }) {
  const unidades = cantidad === 1 ? 'unidad' : 'unidades'
  const mensaje = `Hola ${producto.seller}, vi tu publicación "${producto.name}" en Antojos UPB y quiero solicitar ${cantidad} ${unidades}. ¿Está disponible?`
  const enlace = construirEnlaceWhatsApp(producto.sellerPhone, mensaje)

  // Criterio: sin número válido, el botón se ve deshabilitado con un aviso
  if (!enlace) {
    return (
      <div className="solicitud">
        <button className="solicitud__boton" type="button" disabled>
          <IconoSolicitudes />
          Solicitar por WhatsApp
        </button>
        <p className="solicitud__aviso" role="status">
          El vendedor no tiene este canal disponible.
        </p>
      </div>
    )
  }

  return (
    <div className="solicitud">
      <a
        className="solicitud__boton"
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconoSolicitudes />
        Solicitar por WhatsApp
      </a>
    </div>
  )
}

export default WhatsAppRequestButton
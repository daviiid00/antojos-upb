import ContactClientButton from './ContactClientButton.jsx'
import EstadoBadge from './EstadoBadge.jsx'
import './SolicitudItemCard.css'

// Una solicitud recibida: producto, cantidad, estado y botón para contactar al comprador
function SolicitudItemCard({ solicitud }) {
  return (
    <li className="solicitud-card">
      <EstadoBadge estado={solicitud.status} />
      <h2 className="solicitud-card__producto">{solicitud.productName}</h2>
      <p className="solicitud-card__dato">
        Cantidad: <strong>{solicitud.quantity}</strong>
      </p>
      <p className="solicitud-card__dato">
        Comprador: <strong>{solicitud.buyerName}</strong>
      </p>
      <ContactClientButton enlace={solicitud.contactLink} />
    </li>
  )
}

export default SolicitudItemCard
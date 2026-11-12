import { Link } from 'react-router'
import './ProductCardGrid.css'

function formatearPrecio(precio) {
  return `$${precio.toLocaleString('es-CO')}`
}

// Flecha del botón de la tarjeta (decorativa: toda la tarjeta es el enlace)
function IconoFlecha() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

// Cuadrícula de tarjetas: imagen, nombre, vendedor y precio de cada producto
function ProductCardGrid({ productos }) {
  return (
    <ul className="cuadricula">
      {productos.map((producto) => (
        <li key={producto.id}>
          {/* Criterio: al hacer clic en la tarjeta se va al detalle del producto */}
          <Link className="tarjeta-producto" to={`/producto/${producto.id}`}>
            {producto.image_url ? (
              <img
                className="tarjeta-producto__imagen"
                src={producto.image_url}
                alt=""
                width="400"
                height="300"
                loading="lazy"
              />
            ) : (
              <div
                className="tarjeta-producto__imagen tarjeta-producto__imagen--vacia"
                aria-hidden="true"
              >
                Sin imagen
              </div>
            )}
            <div className="tarjeta-producto__cuerpo">
              <h2 className="tarjeta-producto__nombre">{producto.name}</h2>
              <p className="tarjeta-producto__vendedor">{producto.seller}</p>
              <div className="tarjeta-producto__pie">
                <p className="tarjeta-producto__precio">
                  {formatearPrecio(producto.price)}
                </p>
                <span className="tarjeta-producto__flecha">
                  <IconoFlecha />
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductCardGrid
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { IconoVolver } from '../../compartido/componentes/Iconos.jsx'
import { ErrorApi } from '../../compartido/servicios/api.js'
import { obtenerProducto } from '../../compartido/servicios/productos.js'
import ProductImageGallery from './ProductImageGallery.jsx'
import ProductInfo from './ProductInfo.jsx'
import WhatsAppRequestButton from './WhatsAppRequestButton.jsx'
import './ProductDetailContainer.css'

const MENSAJE_NO_ENCONTRADO = 'No encontramos este producto.'
const MENSAJE_ERROR = 'No pudimos cargar el producto. Inténtalo de nuevo.'

// Consulta el producto de la ruta /producto/:id y arma la pantalla de detalle
function ProductDetailContainer() {
  const { id } = useParams()
  // El resultado se guarda junto con el id al que pertenece
  const [resultado, setResultado] = useState({
    id: null,
    producto: null,
    mensaje: null,
  })

  useEffect(() => {
    let vigente = true // evita pintar respuestas viejas
    obtenerProducto(id)
      .then((producto) => {
        if (vigente) setResultado({ id, producto, mensaje: null })
      })
      .catch((error) => {
        if (!vigente) return
        const noExiste = error instanceof ErrorApi && error.estado === 404
        setResultado({
          id,
          producto: null,
          mensaje: noExiste ? MENSAJE_NO_ENCONTRADO : MENSAJE_ERROR,
        })
      })
    return () => {
      vigente = false
    }
  }, [id])

  const cargando = resultado.id !== id
  const { producto, mensaje } = resultado

  return (
    <main className="detalle">
      <header className="detalle__barra">
        <Link
          className="detalle__volver"
          to="/explorar"
          aria-label="Volver a Explorar"
        >
          <IconoVolver />
        </Link>
        <p className="detalle__barra-titulo">Detalle del producto</p>
      </header>

      {cargando && <p className="detalle__mensaje">Cargando…</p>}

      {!cargando && mensaje && (
        <p className="detalle__mensaje" role="alert">
          {mensaje}
        </p>
      )}

      {!cargando && producto && (
        <>
          <ProductImageGallery
            imagen={producto.imageUrl}
            nombre={producto.name}
          />
          <ProductInfo producto={producto} />
          <WhatsAppRequestButton producto={producto} />
        </>
      )}
    </main>
  )
}

export default ProductDetailContainer
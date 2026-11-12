import './ProductInfo.css'

// Precio en pesos colombianos, por ejemplo "$ 18.000"
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio)
}

// Nombre, precio, vendedor y descripción completa del producto
function ProductInfo({ producto }) {
  return (
    <section className="info-producto" aria-label="Información del producto">
      <h1 className="info-producto__nombre">{producto.name}</h1>
      <p className="info-producto__precio">{formatearPrecio(producto.price)}</p>
      <p className="info-producto__vendedor">Vendido por {producto.seller}</p>
      <h2 className="info-producto__subtitulo">Descripción</h2>
      <p className="info-producto__descripcion">{producto.description}</p>
    </section>
  )
}

export default ProductInfo
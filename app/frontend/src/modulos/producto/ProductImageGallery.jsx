import './ProductImageGallery.css'

// Imagen principal del producto (si no tiene, se muestra un recuadro)
function ProductImageGallery({ imagen, nombre }) {
  return (
    <div className="galeria">
      {imagen ? (
        <img
          className="galeria__imagen"
          src={imagen}
          alt={`Foto de ${nombre}`}
          width="800"
          height="600"
        />
      ) : (
        <div className="galeria__imagen galeria__imagen--vacia">Sin imagen</div>
      )}
    </div>
  )
}

export default ProductImageGallery
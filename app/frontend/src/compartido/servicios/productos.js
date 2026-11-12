import { llamarApi } from './api.js'

// termino = texto de la barra, tipo = id del chip elegido (vacíos = sin filtrar)
export function buscarProductos(termino, tipo = '') {
  const parametros = new URLSearchParams()
  if (termino) parametros.set('q', termino)
  if (tipo) parametros.set('type', tipo)
  const texto = parametros.toString()
  return llamarApi(texto ? `/products?${texto}` : '/products')
}

// Detalle de un producto: GET /products/:id
export function obtenerProducto(id) {
  return llamarApi(`/products/${encodeURIComponent(id)}`)
}
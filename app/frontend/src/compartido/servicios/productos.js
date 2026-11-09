import { llamarApi } from './api.js'

// TEMPORAL: mientras el backend no tenga el endpoint se usan datos de prueba.
// Poner en false cuando exista GET /products.
const USAR_DATOS_DE_PRUEBA = true

const PRODUCTOS_DE_PRUEBA = [
  { id: 1, name: 'Cheesecake de frutos rojos', description: 'Postre individual con salsa de frutos rojos', seller: 'Valen Repostería · Circular 1', price: 12000 },
  { id: 2, name: 'Rollos de canela x2', description: 'Rollos dulces con glaseado', seller: 'Miga Lab · Bloque 9', price: 15000 },
  { id: 3, name: 'Caja mini brownies', description: 'Caja de brownies de chocolate', seller: 'Dulce Parche · Bloque 10', price: 18000 },
  { id: 4, name: 'Galletas chunky x3', description: 'Galletas grandes con chips de chocolate', seller: 'Cookie Break · Laureles', price: 12000 },
]

// Minúsculas y sin tildes, para que "cafe" encuentre "café"
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

function filtrarDePrueba(termino) {
  const buscado = normalizar(termino)
  // Busca en nombre y descripción, igual que hará el backend
  return PRODUCTOS_DE_PRUEBA.filter((producto) =>
    normalizar(`${producto.name} ${producto.description}`).includes(buscado),
  )
}

// termino vacío = catálogo general
export function buscarProductos(termino) {
  if (USAR_DATOS_DE_PRUEBA) return Promise.resolve(filtrarDePrueba(termino))
  // Sin prefijo /api/v1, igual que POST /auth/register
  if (termino === '') return llamarApi('/products')
  return llamarApi(`/products?q=${encodeURIComponent(termino)}`)
}
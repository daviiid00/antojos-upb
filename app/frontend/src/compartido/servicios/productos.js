import { TIPOS_PRODUCTO } from '../constantes/tipos-producto.js'
import { llamarApi } from './api.js'

// TEMPORAL: mientras el backend no tenga el endpoint se usan datos de prueba.
// Poner en false cuando exista GET /products.
const USAR_DATOS_DE_PRUEBA = true

// TEMPORAL: imagen de prueba (emoji sobre color) hasta que haya fotos reales en Cloudinary
const imagenDePrueba = (emoji, fondo) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="${fondo}"/><text x="50%" y="52%" font-size="120" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`,
  )}`

const PRODUCTOS_DE_PRUEBA = [
  { id: 1, name: 'Cheesecake de frutos rojos', description: 'Postre individual con salsa de frutos rojos', seller: 'Valen Repostería · Circular 1', price: 12000, image_url: imagenDePrueba('🍰', '#fce3de'), stock: 5 },
  { id: 2, name: 'Rollos de canela x2', description: 'Rollos dulces con glaseado', seller: 'Miga Lab · Bloque 9', price: 15000, image_url: imagenDePrueba('🥐', '#ddebf5'), stock: 8 },
  { id: 3, name: 'Caja mini brownies', description: 'Caja de brownies de chocolate', seller: 'Dulce Parche · Bloque 10', price: 18000, image_url: imagenDePrueba('🍫', '#fce3de'), stock: 3 },
  { id: 4, name: 'Galletas chunky x3', description: 'Galletas grandes con chips de chocolate', seller: 'Cookie Break · Laureles', price: 12000, image_url: imagenDePrueba('🍪', '#ddebf5'), stock: 10 },
  { id: 5, name: 'Gomitas enchiladas x10', description: 'Gomitas con chamoy y limón', seller: 'Dulces Chispa · Bloque 5', price: 6000, image_url: imagenDePrueba('🍬', '#fce3de'), stock: 20 },
  { id: 6, name: 'Burrito de pollo', description: 'Burrito relleno de pollo y queso', seller: 'Burritos del Parche · Bloque 3', price: 14000, image_url: imagenDePrueba('🌯', '#ddebf5'), stock: 6 },
  { id: 7, name: 'Papitas artesanales', description: 'Papitas fritas con sal de mar', seller: 'Papas Gold · Circular 2', price: 5000, image_url: imagenDePrueba('🥔', '#fce3de'), stock: 15 },
  { id: 8, name: 'Donas glaseadas x6', description: 'Donas con glaseado de azúcar', seller: 'Donut Lab · Bloque 7', price: 20000, image_url: imagenDePrueba('🍩', '#ddebf5'), stock: 4 },
]

// Minúsculas y sin tildes, para que "cafe" encuentre "café"
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

function filtrarDePrueba(termino, tipo) {
  const buscado = normalizar(termino)
  // Palabras clave del tipo elegido ('' = todos los tipos)
  const palabras = TIPOS_PRODUCTO.find((t) => t.id === tipo)?.palabras ?? []

  return PRODUCTOS_DE_PRUEBA.filter((producto) => {
    const texto = normalizar(`${producto.name} ${producto.description}`)
    // Filtro de tipo (ANTOJOS-39): alguna palabra clave en nombre o descripción
    const coincideTipo =
      palabras.length === 0 || palabras.some((palabra) => texto.includes(palabra))
    // Barra de búsqueda (ANTOJOS-38)
    return texto.includes(buscado) && coincideTipo
  })
}

// termino = texto de la barra, tipo = id del tipo elegido (vacíos = sin filtrar)
export function buscarProductos(termino, tipo = '') {
  if (USAR_DATOS_DE_PRUEBA) {
    return Promise.resolve(filtrarDePrueba(termino, tipo))
  }
  // Sin prefijo /api/v1, igual que POST /auth/register
  const parametros = new URLSearchParams()
  if (termino) parametros.set('q', termino)
  if (tipo) parametros.set('type', tipo)
  const texto = parametros.toString()
  return llamarApi(texto ? `/products?${texto}` : '/products')
}
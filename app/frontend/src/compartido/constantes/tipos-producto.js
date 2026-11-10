// Tipos de producto para el filtro de Explorar.
// id = lo que se envía al backend (GET /products?type=<id>)
// palabras = palabras clave (minúsculas y sin tildes) que se buscan en nombre y descripción
export const TIPOS_PRODUCTO = [
  { id: 'brownies', texto: 'Brownies', palabras: ['brownie'] },
  { id: 'galletas', texto: 'Galletas', palabras: ['galleta'] },
  { id: 'gomitas', texto: 'Gomitas', palabras: ['gomita'] },
  { id: 'burritos', texto: 'Burritos', palabras: ['burrito'] },
  { id: 'papitas', texto: 'Papitas', palabras: ['papita'] },
  { id: 'donas', texto: 'Donas', palabras: ['dona'] },
]
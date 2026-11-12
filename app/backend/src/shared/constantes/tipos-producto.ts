// Copia espejo de app/frontend/src/compartido/constantes/tipos-producto.js.
// Si cambias una lista aquí, cámbiala también allá.
export interface TipoProducto {
  id: string;
  palabras: string[]; // minúsculas y sin tildes
}

export const TIPOS_PRODUCTO: TipoProducto[] = [
  { id: 'brownies', palabras: ['brownie'] },
  { id: 'galletas', palabras: ['galleta'] },
  { id: 'gomitas', palabras: ['gomita'] },
  { id: 'burritos', palabras: ['burrito'] },
  { id: 'papitas', palabras: ['papita'] },
  { id: 'donas', palabras: ['dona'] },
];
import { llamarApi } from './api';

export function obtenerMisProductos() {
  return llamarApi('/users/me/products');
}
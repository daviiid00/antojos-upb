import { llamarApi } from './api';

export function obtenerMisProductos() {
  return llamarApi('/users/me/products');
}

export function eliminarMiProducto(productoId) {
  return llamarApi(`/products/${productoId}`, {
    method: 'DELETE',
  });
}
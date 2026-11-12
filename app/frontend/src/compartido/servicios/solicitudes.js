import { llamarApi } from './api.js'

// Solicitudes que recibió el vendedor con sesión iniciada: GET /requests
export function obtenerSolicitudes() {
  return llamarApi('/requests')
}
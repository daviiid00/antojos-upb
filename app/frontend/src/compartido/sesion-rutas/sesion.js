const CLAVE_TOKEN = 'token'

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function haySesion() {
  return obtenerToken() !== null
}
const CLAVE_NOMBRE = 'nombre'

// Guarda el nombre con el que la persona se registró (para mostrarlo arriba)
export function guardarNombre(nombre) {
  localStorage.setItem(CLAVE_NOMBRE, nombre)
}

export function obtenerNombre() {
  return localStorage.getItem(CLAVE_NOMBRE)
}
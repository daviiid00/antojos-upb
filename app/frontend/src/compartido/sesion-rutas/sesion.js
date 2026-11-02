const CLAVE_TOKEN = 'token'

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function haySesion() {
  return obtenerToken() !== null
}

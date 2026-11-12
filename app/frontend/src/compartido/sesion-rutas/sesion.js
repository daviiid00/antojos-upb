const CLAVE_TOKEN = 'token'

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token)
}

// Solo borra el token: localStorage puede tener datos de otras funciones.
export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN)
}

export function haySesion() {
  return obtenerToken() !== null
}

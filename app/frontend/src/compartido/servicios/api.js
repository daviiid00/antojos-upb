import { obtenerToken } from '../sesion-rutas/sesion.js'

const URL_BASE = import.meta.env.VITE_API_URL

// Error con el código HTTP y el cuerpo que respondió el backend.
export class ErrorApi extends Error {
  constructor(estado, cuerpo) {
    super(`La API respondió con el estado ${estado}`)
    this.estado = estado
    this.cuerpo = cuerpo
  }
}

export async function llamarApi(ruta, { metodo = 'GET', cuerpo } = {}) {
  // Se revisa aquí y no al importar, para que sin .env el resto de la app siga funcionando.
  if (!URL_BASE) {
    const mensaje =
      'Falta VITE_API_URL en app/frontend/.env (guíate por .env.example).'
    console.error(mensaje)
    throw new Error(mensaje)
  }


  const esArchivo = cuerpo instanceof FormData
    const token = obtenerToken()
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: metodo,
           headers: {
         ...(cuerpo && !esArchivo && { 'Content-Type': 'application/json' }),
         ...(token && { Authorization: `Bearer ${token}` }),
       },
    body: !cuerpo ? undefined : esArchivo ? cuerpo : JSON.stringify(cuerpo),

  })
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, datos)
  return datos
}

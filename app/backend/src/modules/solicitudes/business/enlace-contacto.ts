import {
  CELULAR_COLOMBIANO,
  INDICATIVO_COLOMBIA,
} from '../../../shared/constantes/usuario.js';

// users.phone se guarda como "57" + 10 dígitos. Devuelve null si el número
// falta o no tiene ese formato (cuentas anteriores al campo, por ejemplo).
export function construirEnlaceContacto(
  telefono: string | null | undefined,
  mensaje: string,
): string | null {
  if (!telefono?.startsWith(INDICATIVO_COLOMBIA)) return null;
  const celular = telefono.slice(INDICATIVO_COLOMBIA.length);
  if (!CELULAR_COLOMBIANO.test(celular)) return null;
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}
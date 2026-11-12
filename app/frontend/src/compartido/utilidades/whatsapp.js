// Deja solo los dígitos y agrega el indicativo de Colombia (57) a los celulares
// de 10 dígitos. Devuelve null si el número no parece válido.
export function normalizarTelefono(telefono) {
  const digitos = String(telefono ?? '').replace(/\D/g, '')
  if (/^3\d{9}$/.test(digitos)) return `57${digitos}`
  if (digitos.length >= 11 && digitos.length <= 15) return digitos
  return null
}

// Enlace wa.me con el mensaje ya escrito. Devuelve null si no hay número válido.
export function construirEnlaceWhatsApp(telefono, mensaje) {
  const numero = normalizarTelefono(telefono)
  if (!numero) return null
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
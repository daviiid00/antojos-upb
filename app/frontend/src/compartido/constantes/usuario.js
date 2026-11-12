// Copia espejo de app/backend/src/shared/constantes/usuario.ts.
// Mantener igual a la del backend: si cambias una lista aquí, cámbiala también allá.

export const SEDES = ['Medellín']

// Vínculo informativo con la UPB. No es un rol ni da permisos.
export const VINCULOS_UNIVERSITARIOS = ['Estudiante']

// Único dominio de correo aceptado en el registro.
export const DOMINIO_INSTITUCIONAL = '@upb.edu.co'

// Celular colombiano: 10 dígitos que empiezan por 3 (ya sin espacios ni guiones).
export const CELULAR_COLOMBIANO = /^3\d{9}$/
export const MENSAJE_CELULAR = 'El celular debe tener 10 dígitos y empezar por 3.'

// El frontend tiene una copia espejo en src/compartido/constantes/usuario.js.
// Si cambias una lista aquí, cámbiala también allá.

export const SEDES = ['Medellín'] as const;

// Vínculo informativo con la UPB. No es un rol ni da permisos:
// todo usuario puede comprar y vender.
export const VINCULOS_UNIVERSITARIOS = ['Estudiante'] as const;

// Único dominio de correo aceptado en el registro.
export const DOMINIO_INSTITUCIONAL = '@upb.edu.co';

// Celular colombiano: 10 dígitos que empiezan por 3 (ya sin espacios ni guiones).
export const CELULAR_COLOMBIANO = /^3\d{9}$/;
export const MENSAJE_CELULAR =
  'El celular debe tener 10 dígitos y empezar por 3.';

// Indicativo de Colombia: se guarda delante del celular, listo para wa.me.
export const INDICATIVO_COLOMBIA = '57';

export type Sede = (typeof SEDES)[number];
export type VinculoUniversitario = (typeof VINCULOS_UNIVERSITARIOS)[number];

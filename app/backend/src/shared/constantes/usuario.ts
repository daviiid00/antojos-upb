// El frontend tiene una copia espejo en src/compartido/constantes/usuario.js.
// Si cambias una lista aquí, cámbiala también allá.

export const SEDES = ['Medellín'] as const;

// Vínculo informativo con la UPB. No es un rol ni da permisos:
// todo usuario puede comprar y vender.
export const VINCULOS_UNIVERSITARIOS = ['Estudiante'] as const;

export type Sede = (typeof SEDES)[number];
export type VinculoUniversitario = (typeof VINCULOS_UNIVERSITARIOS)[number];

const VARIABLES_OBLIGATORIAS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL',
] as const;

const LONGITUD_MINIMA_JWT_SECRET = 32;

export type Entorno = Record<(typeof VARIABLES_OBLIGATORIAS)[number], string>;

// Solo nombra las variables con problemas, nunca imprime sus valores.
export function validarEntorno(config: Record<string, unknown>): Entorno {
  const faltantes = VARIABLES_OBLIGATORIAS.filter((nombre) => {
    const valor = config[nombre];
    return typeof valor !== 'string' || valor.trim() === '';
  });
  if (faltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno: ${faltantes.join(', ')}. Revisa app/backend/.env (guíate por .env.example).`,
    );
  }
  if (!Number.isInteger(Number(config.DB_PORT))) {
    throw new Error('La variable DB_PORT debe ser un número entero.');
  }
  if ((config.JWT_SECRET as string).length < LONGITUD_MINIMA_JWT_SECRET) {
    throw new Error(
      `La variable JWT_SECRET debe tener al menos ${LONGITUD_MINIMA_JWT_SECRET} caracteres.`,
    );
  }
  return Object.fromEntries(
    VARIABLES_OBLIGATORIAS.map((nombre) => [nombre, config[nombre]]),
  ) as Entorno;
}

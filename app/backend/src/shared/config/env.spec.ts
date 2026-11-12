import { validarEntorno } from './env.js';

const SECRETO_VALIDO = 'secreto-de-prueba-con-32-caracteres!';

const entornoValido = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USER: 'antojos',
  DB_PASSWORD: 'clave-de-prueba',
  DB_NAME: 'antojos_upb',
  JWT_SECRET: SECRETO_VALIDO,
  JWT_EXPIRES_IN: '1d',
  FRONTEND_URL: 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: 'cszwisim',
  CLOUDINARY_API_KEY: '969786913919175',
  CLOUDINARY_API_SECRET: 'oNrZMv31sPcjLhrBBUAuDDtjLaU',
};

describe('validarEntorno', () => {
  it('devuelve solo las variables conocidas cuando todo está completo', () => {
    const entorno = validarEntorno({ ...entornoValido, OTRA: 'x' });

    expect(entorno).toEqual(entornoValido);
  });

  it('falla si falta JWT_SECRET', () => {
    const { JWT_SECRET: _omitido, ...sinSecreto } = entornoValido;

    expect(() => validarEntorno(sinSecreto)).toThrow(
      'Faltan variables de entorno: JWT_SECRET.',
    );
  });

  it('nombra todas las variables vacías o faltantes', () => {
    expect(() =>
      validarEntorno({ ...entornoValido, DB_HOST: '  ', DB_NAME: undefined }),
    ).toThrow('Faltan variables de entorno: DB_HOST, DB_NAME.');
  });

  it('falla si JWT_SECRET tiene menos de 32 caracteres', () => {
    expect(() =>
      validarEntorno({ ...entornoValido, JWT_SECRET: 'a'.repeat(31) }),
    ).toThrow('La variable JWT_SECRET debe tener al menos 32 caracteres.');
  });

  it('falla si DB_PORT no es un número entero', () => {
    expect(() => validarEntorno({ ...entornoValido, DB_PORT: 'abc' })).toThrow(
      'La variable DB_PORT debe ser un número entero.',
    );
  });

  it('nunca incluye valores en el mensaje de error', () => {
    const secretoCorto = 'secreto-corto-que-no-debe-salir';

    expect(() =>
      validarEntorno({ ...entornoValido, JWT_SECRET: secretoCorto }),
    ).toThrow(
      expect.objectContaining({
        message: expect.not.stringContaining(secretoCorto),
      }),
    );
  });
});

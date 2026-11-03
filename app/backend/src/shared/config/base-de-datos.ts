import type { DataSourceOptions } from 'typeorm';
import type { Entorno } from './env.js';

export function opcionesBaseDeDatos(
  leer: (nombre: keyof Entorno) => string,
): DataSourceOptions {
  return {
    type: 'mysql',
    host: leer('DB_HOST'),
    port: Number(leer('DB_PORT')),
    username: leer('DB_USER'),
    password: leer('DB_PASSWORD'),
    database: leer('DB_NAME'),
    charset: 'utf8mb4',
    // Entidades y migraciones se listan una por una, sin comodines.
    entities: [],
    migrations: [],
    synchronize: false,
  };
}

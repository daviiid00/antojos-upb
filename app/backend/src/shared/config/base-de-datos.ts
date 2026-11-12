import type { DataSourceOptions } from 'typeorm';
import { Usuario } from '../../modules/usuarios/data/usuario.entity.js';
import { CrearTablaUsers1793724975476 } from '../migraciones/1793724975476-crear-tabla-users.js';
import { AgregarPhoneAUsers1794456569172 } from '../migraciones/1794456569172-agregar-phone-a-users.js';
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
    entities: [Usuario],
    migrations: [CrearTablaUsers1793724975476, AgregarPhoneAUsers1794456569172],
    synchronize: false,
  };
}

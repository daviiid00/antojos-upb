import type { DataSourceOptions } from 'typeorm';
import { Producto } from '../../modules/productos/data/producto.entity.js';
import { Usuario } from '../../modules/usuarios/data/usuario.entity.js';
import { CrearTablaUsers1793724975476 } from '../migraciones/1793724975476-crear-tabla-users.js';
import { CrearTablaProducts1794200000000 } from '../migraciones/1794200000000-crear-tabla-products.js';
import { AgregarWhatsappAUsers1794300000000 } from '../migraciones/1794300000000-agregar-whatsapp-a-users.js';
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
    entities: [Usuario, Producto],
    migrations: [
      CrearTablaUsers1793724975476,
      CrearTablaProducts1794200000000,
      AgregarWhatsappAUsers1794300000000,
    ],
    synchronize: false,
  };
}
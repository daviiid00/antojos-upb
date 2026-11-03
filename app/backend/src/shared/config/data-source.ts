import { DataSource } from 'typeorm';
import { opcionesBaseDeDatos } from './base-de-datos.js';
import { validarEntorno } from './env.js';

// El CLI corre fuera de Nest; el .env llega con `node --env-file=.env`.
const entorno = validarEntorno(process.env);

export default new DataSource(opcionesBaseDeDatos((nombre) => entorno[nombre]));

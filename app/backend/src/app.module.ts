import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './modules/productos/productos.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { opcionesBaseDeDatos } from './shared/config/base-de-datos.js';
import { type Entorno, validarEntorno } from './shared/config/env.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validarEntorno }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Entorno, true>) =>
        opcionesBaseDeDatos((nombre) => config.get(nombre, { infer: true })),
    }),
    UsuariosModule,
    ProductosModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Entorno } from '../../shared/config/env.js';
import { Producto } from './data/producto.entity.js';
import { ProductosService } from './business/productos.service.js';
import { ProductosController } from './presentation/productos.controller.js';

@Module({
    imports: [
    TypeOrmModule.forFeature([Producto]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Entorno, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
      }),
    }),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
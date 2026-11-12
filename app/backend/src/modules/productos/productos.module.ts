import { Module } from '@nestjs/common';
import { ProductosService } from './business/productos.service.js';
import { ProductosController } from './presentation/productos.controller.js';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
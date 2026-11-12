import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../data/producto.entity.js';
import type { CreateProductDto } from '../presentation/dto/create-product.dto.js';
import type { Entorno } from '../../../shared/config/env.js';

@Injectable()
export class ProductosService {
    constructor(
    config: ConfigService<Entorno, true>,
    @InjectRepository(Producto)
    private readonly productos: Repository<Producto>,
  ) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME', { infer: true }),
      api_key: config.get('CLOUDINARY_API_KEY', { infer: true }),
      api_secret: config.get('CLOUDINARY_API_SECRET', { infer: true }),
    });
  }

  subirImagen(archivo: { buffer: Buffer }): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'antojos-upb/productos' },
          (error, resultado) => {
            if (error || !resultado) {
              return reject(
                error ?? new Error('Cloudinary no devolvió respuesta.'),
              );
            }
            resolve({ url: resultado.secure_url });
          },
        )
        .end(archivo.buffer);
    });
  }

       async crear(datos: CreateProductDto, vendedorId: number): Promise<Producto> {
       return this.productos.save(
         this.productos.create({
           name: datos.name,
           description: datos.description,
           price: datos.price,
           stock: datos.stock,
           imageUrl: datos.imageUrl,
           seller: { id: vendedorId },
         }),
       );
     }
}
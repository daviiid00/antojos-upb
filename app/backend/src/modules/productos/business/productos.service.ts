import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { Entorno } from '../../../shared/config/env.js';

@Injectable()
export class ProductosService {
  constructor(config: ConfigService<Entorno, true>) {
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
}
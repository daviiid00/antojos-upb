import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from '../business/productos.service.js';

const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB
const LIMITE_MEMORIA_BYTES = 10 * 1024 * 1024; // tope de seguridad

const MENSAJE_FORMATO =
  'Formato no válido. Solo se permiten imágenes .jpg, .png o .webp.';
const MENSAJE_TAMANO =
  'La imagen es demasiado pesada. El tamaño máximo es de 5 MB.';
const MENSAJE_SIN_ARCHIVO = 'Debes enviar una imagen en el campo "imagen".';

interface ArchivoSubido {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

@Controller('products')
export class ProductosController {
  constructor(private readonly productos: ProductosService) {}

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('imagen', { limits: { fileSize: LIMITE_MEMORIA_BYTES } }),
  )
  subirImagen(
    @UploadedFile() archivo?: ArchivoSubido,
  ): Promise<{ url: string }> {
    if (!archivo) throw new BadRequestException(MENSAJE_SIN_ARCHIVO);
    if (!FORMATOS_PERMITIDOS.includes(archivo.mimetype)) {
      throw new BadRequestException(MENSAJE_FORMATO);
    }
    if (archivo.size > TAMANO_MAXIMO_BYTES) {
      throw new BadRequestException(MENSAJE_TAMANO);
    }
    return this.productos.subirImagen(archivo);
  }
}
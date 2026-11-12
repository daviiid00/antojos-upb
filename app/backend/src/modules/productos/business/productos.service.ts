import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { Repository } from 'typeorm';
import type { Entorno } from '../../../shared/config/env.js';
import { TIPOS_PRODUCTO } from '../../../shared/constantes/tipos-producto.js';
import { Producto } from '../data/producto.entity.js';
import type { CreateProductDto } from '../presentation/dto/create-product.dto.js';

// Lo que se devuelve al frontend: solo el nombre del vendedor, nunca sus datos privados
export interface ProductoPublico {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  seller: string;
  sellerPhone: string | null;
}

function aPublico(producto: Producto): ProductoPublico {
  return {
    id: producto.id,
    name: producto.name,
    description: producto.description,
    price: producto.price,
    stock: producto.stock,
    imageUrl: producto.imageUrl,
    seller: producto.seller.name,
    sellerPhone: producto.seller.phone ?? null,
  };
}

// Para que "%" y "_" escritos por la persona se busquen como texto normal
const escaparLike = (texto: string) => texto.replace(/[\\%_]/g, '\\$&');

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

  // GET /products?q=texto&type=galletas
  async buscar(q?: string, type?: string): Promise<ProductoPublico[]> {
    const consulta = this.productos
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.seller', 'vendedor')
      .where('producto.status = :estado', { estado: 'ACTIVE' })
      .orderBy('producto.createdAt', 'DESC');

    // Barra de búsqueda: nombre o descripción
    const texto = q?.trim();
    if (texto) {
      consulta.andWhere(
        '(producto.name LIKE :texto OR producto.description LIKE :texto)',
        { texto: `%${escaparLike(texto)}%` },
      );
    }

    // Chip de tipo: alguna palabra clave en nombre o descripción
    const palabras = TIPOS_PRODUCTO.find((tipo) => tipo.id === type)?.palabras;
    if (palabras && palabras.length > 0) {
      const condiciones = palabras.map(
        (_, i) =>
          `(producto.name LIKE :palabra${i} OR producto.description LIKE :palabra${i})`,
      );
      const parametros = Object.fromEntries(
        palabras.map((palabra, i) => [`palabra${i}`, `%${palabra}%`]),
      );
      consulta.andWhere(`(${condiciones.join(' OR ')})`, parametros);
    }

    const productos = await consulta.getMany();
    return productos.map(aPublico);
  }

  // GET /products/:id
  async obtenerPorId(id: number): Promise<ProductoPublico> {
    const producto = await this.productos.findOne({
      where: { id, status: 'ACTIVE' },
      relations: { seller: true },
    });
    if (!producto) throw new NotFoundException('No encontramos este producto.');
    return aPublico(producto);
  }

  listarActivosDe(vendedorId: number): Promise<Producto[]> {
    return this.productos.find({
      where: { seller: { id: vendedorId }, status: 'ACTIVE' },
      order: { createdAt: 'DESC' },
    });
  }

 async eliminarLogico(productoId: number, vendedorId: number): Promise<void> {
    const producto = await this.productos.findOne({
      where: { id: productoId },
      relations: { seller: true },
    });

    if (!producto || producto.status === 'DELETED') {
      throw new NotFoundException('La publicación no existe o ya fue eliminada.');
    }

    if (producto.seller?.id !== vendedorId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación.');
    }

    producto.status = 'DELETED';
    await this.productos.save(producto);
  }
}
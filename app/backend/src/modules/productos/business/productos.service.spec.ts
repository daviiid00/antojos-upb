import { NotFoundException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { Entorno } from '../../../shared/config/env.js';
import type { Producto } from '../data/producto.entity.js';
import { ProductosService } from './productos.service.js';

const config = {
  get: () => 'valor-de-prueba',
} as unknown as ConfigService<Entorno, true>;

const productoGuardado = {
  id: 7,
  name: 'Caja mini brownies',
  description: 'Brownies de chocolate',
  price: 18000,
  stock: 3,
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  seller: {
    id: 1,
    name: 'Laura Gómez',
    email: 'laura@upb.edu.co',
    passwordHash: 'hash-secreto',
    whatsapp: '3001234567',
  },
  createdAt: new Date(),
};

describe('ProductosService.obtenerPorId', () => {
  let repositorio: { findOne: ReturnType<typeof vi.fn> };
  let servicio: ProductosService;

  beforeEach(() => {
    repositorio = { findOne: vi.fn() };
    servicio = new ProductosService(
      config,
      repositorio as unknown as Repository<Producto>,
    );
  });

 it('incluye el celular del vendedor, y null si no tiene', async () => {
  repositorio.findOne.mockResolvedValueOnce(productoGuardado);
  expect((await servicio.obtenerPorId(7)).sellerPhone).toBe('30071344754');

  repositorio.findOne.mockResolvedValueOnce({
    ...productoGuardado,
    seller: { ...productoGuardado.seller, phone: null },
  });
  expect((await servicio.obtenerPorId(7)).sellerPhone).toBeNull();
});


  it('devuelve el producto con solo el nombre del vendedor', async () => {
    repositorio.findOne.mockResolvedValue(productoGuardado);
    const producto = await servicio.obtenerPorId(7);
    expect(producto).toMatchObject({
      id: 7,
      name: 'Caja mini brownies',
      price: 18000,
      stock: 3,
      seller: 'Laura Gómez',
    });
    expect(JSON.stringify(producto)).not.toContain('hash-secreto');
    expect(JSON.stringify(producto)).not.toContain('laura@upb.edu.co');
  });

  it('responde 404 si el producto no existe', async () => {
    repositorio.findOne.mockResolvedValue(null);
    await expect(servicio.obtenerPorId(999)).rejects.toThrow(NotFoundException);
  });
});

  
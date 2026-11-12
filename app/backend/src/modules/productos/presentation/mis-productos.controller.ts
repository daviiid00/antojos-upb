import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductosService } from '../business/productos.service.js';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../../../shared/auth/usuario-actual.decorator.js';

@Controller('users/me')
export class MisProductosController {
  constructor(private readonly productos: ProductosService) {}

  @Get('products')
  @UseGuards(JwtAuthGuard)
  async listar(@UsuarioActual() usuario: UsuarioAutenticado) {
    const lista = await this.productos.listarActivosDe(usuario.id);
    return lista.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image_url: p.imageUrl,
      status: p.status,
    }));
  }
}
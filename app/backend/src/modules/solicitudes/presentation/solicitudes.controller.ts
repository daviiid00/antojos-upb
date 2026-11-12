import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../../../shared/auth/usuario-actual.decorator.js';
import {
  SolicitudesService,
  type SolicitudPublica,
} from '../business/solicitudes.service.js';

@Controller('requests')
export class SolicitudesController {
  constructor(private readonly solicitudes: SolicitudesService) {}

  // GET /requests (requiere sesión): las solicitudes que recibió el vendedor
  @Get()
  @UseGuards(JwtAuthGuard)
  listar(
    @UsuarioActual() usuario: UsuarioAutenticado,
  ): Promise<SolicitudPublica[]> {
    return this.solicitudes.listarDelVendedor(usuario.id);
  }
}
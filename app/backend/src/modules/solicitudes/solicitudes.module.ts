import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { SolicitudesService } from './business/solicitudes.service.js';
import { Solicitud } from './data/solicitud.entity.js';
import { SolicitudesController } from './presentation/solicitudes.controller.js';

@Module({
  // UsuariosModule exporta JwtModule y JwtAuthGuard, que usa el controlador.
  imports: [TypeOrmModule.forFeature([Solicitud]), UsuariosModule],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
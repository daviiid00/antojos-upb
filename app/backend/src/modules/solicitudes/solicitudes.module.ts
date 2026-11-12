import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './data/solicitud.entity.js';
import { SolicitudesService } from './business/solicitudes.service.js';
import { SolicitudesController } from './presentation/solicitudes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}

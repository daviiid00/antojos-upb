import { Controller, Get } from '@nestjs/common';
import { SolicitudesService } from '../business/solicitudes.service.js';
import { Solicitud } from '../data/solicitud.entity.js';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Get()
  async obtenerSolicitudes(): Promise<Solicitud[]> {
    return await this.solicitudesService.obtenerTodas();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from '../data/solicitud.entity.js';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudesRepository: Repository<Solicitud>,
  ) {}

  async obtenerTodas(): Promise<Solicitud[]> {
    return await this.solicitudesRepository.find();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { EstadoSolicitud } from '../../../shared/constantes/solicitud.js';
import { Solicitud } from '../data/solicitud.entity.js';
import { construirEnlaceContacto } from './enlace-contacto.js';

// Lo que ve el vendedor. El celular del comprador nunca sale tal cual:
// solo viaja dentro de contactLink, y únicamente para el vendedor dueño del producto.
export interface SolicitudPublica {
  id: number;
  productName: string;
  quantity: number;
  status: EstadoSolicitud;
  buyerName: string;
  contactLink: string | null;
  createdAt: Date;
}

function mensajeParaElComprador(solicitud: Solicitud): string {
  const unidades = solicitud.quantity === 1 ? 'unidad' : 'unidades';
  return `Hola ${solicitud.buyer.name}, soy ${solicitud.product.seller.name} de Antojos UPB. Te escribo por tu solicitud de ${solicitud.quantity} ${unidades} de "${solicitud.product.name}". ¿Coordinamos los detalles?`;
}

function aPublica(solicitud: Solicitud): SolicitudPublica {
  return {
    id: solicitud.id,
    productName: solicitud.product.name,
    quantity: solicitud.quantity,
    status: solicitud.status,
    buyerName: solicitud.buyer.name,
    contactLink: construirEnlaceContacto(
      solicitud.buyer.phone,
      mensajeParaElComprador(solicitud),
    ),
    createdAt: solicitud.createdAt,
  };
}

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudes: Repository<Solicitud>,
  ) {}

  // GET /requests: solo las solicitudes de productos del vendedor, las más nuevas primero
  async listarDelVendedor(vendedorId: number): Promise<SolicitudPublica[]> {
    const lista = await this.solicitudes.find({
      where: { product: { seller: { id: vendedorId } } },
      relations: { product: { seller: true }, buyer: true },
      order: { createdAt: 'DESC' },
    });
    return lista.map(aPublica);
  }
}
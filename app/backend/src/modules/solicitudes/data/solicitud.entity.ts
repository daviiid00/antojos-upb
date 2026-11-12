import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { EstadoSolicitud } from '../../../shared/constantes/solicitud.js';
import { Producto } from '../../productos/data/producto.entity.js';
import { Usuario } from '../../usuarios/data/usuario.entity.js';

// Solicitud de compra: un comprador pide cierta cantidad de un producto.
// El vendedor es el dueño del producto (product.seller).
@Entity({ name: 'requests' })
export class Solicitud {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Producto;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Usuario;

  @Column({ type: 'int', unsigned: true })
  quantity: number;

  @Column({ type: 'varchar', length: 10, default: 'PENDING' })
  status: EstadoSolicitud;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
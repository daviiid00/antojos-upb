import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/data/usuario.entity.js';

@Entity({ name: 'products' })
export class Producto {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', unsigned: true })
  price: number;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'int', unsigned: true })
  stock: number;

  @Column({ type: 'varchar', length: 10, default: 'ACTIVE' })
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'seller_id' })
  seller: Usuario;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
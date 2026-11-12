import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('solicitudes')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id_solicitud: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_producto: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'varchar', length: 50 })
  estado: string;
}
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type {
  Sede,
  VinculoUniversitario,
} from '../../../shared/constantes/usuario.js';

@Entity({ name: 'users' })
export class Usuario {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index('UQ_users_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  // Con prefijo 57, listo para wa.me. Null en cuentas anteriores al campo.
  @Column({ type: 'varchar', length: 12, nullable: true })
  phone: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 60 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50 })
  campus: Sede;

  @Column({ name: 'university_link', type: 'varchar', length: 50 })
  universityLink: VinculoUniversitario;

  @Column({ name: 'terms_accepted', type: 'boolean' })
  termsAccepted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

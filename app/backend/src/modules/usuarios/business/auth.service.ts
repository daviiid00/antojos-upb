import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../data/usuario.entity.js';
import type { RegistroDto } from '../presentation/dto/registro.dto.js';

const RONDAS_BCRYPT = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    private readonly jwt: JwtService,
  ) {}

  // Correo repetido: hoy el índice único UQ_users_email hace fallar el save
  // y la API responde 500. La respuesta 409 amigable es de ANTOJOS-12.
  async registrar(datos: RegistroDto): Promise<{ token: string }> {
    const passwordHash = await bcrypt.hash(datos.password, RONDAS_BCRYPT);
    const usuario = await this.usuarios.save(
      this.usuarios.create({
        name: datos.name,
        email: datos.email,
        passwordHash,
        campus: datos.campus,
        universityLink: datos.universityLink,
        termsAccepted: datos.termsAccepted,
      }),
    );
    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });
    return { token };
  }
}

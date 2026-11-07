import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { Usuario } from '../data/usuario.entity.js';
import type { RegistroDto } from '../presentation/dto/registro.dto.js';

const RONDAS_BCRYPT = 10;
const CORREO_REPETIDO = 'Este correo ya tiene una cuenta asociada.';

// En users el único índice único (además de la llave primaria) es
// UQ_users_email, así que un ER_DUP_ENTRY al insertar es un correo repetido.
function esCorreoRepetido(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY'
  );
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    private readonly jwt: JwtService,
  ) {}

  async registrar(datos: RegistroDto): Promise<{ token: string }> {
    // Consulta previa: responde 409 sin gastar tiempo en el hash.
    if (await this.usuarios.existsBy({ email: datos.email })) {
      throw new ConflictException(CORREO_REPETIDO);
    }

    const passwordHash = await bcrypt.hash(datos.password, RONDAS_BCRYPT);
    let usuario: Usuario;
    try {
      usuario = await this.usuarios.save(
        this.usuarios.create({
          name: datos.name,
          email: datos.email,
          passwordHash,
          campus: datos.campus,
          universityLink: datos.universityLink,
          termsAccepted: datos.termsAccepted,
        }),
      );
    } catch (error) {
      // Dos registros con el mismo correo al mismo tiempo pasan ambos la
      // consulta previa; el índice único frena al segundo.
      if (esCorreoRepetido(error)) throw new ConflictException(CORREO_REPETIDO);
      throw error;
    }

    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });
    return { token };
  }
}

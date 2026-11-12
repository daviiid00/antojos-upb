import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { SESION_NO_VALIDA } from '../../../shared/auth/jwt-auth.guard.js';
import { Usuario } from '../data/usuario.entity.js';
import type { LoginDto } from '../presentation/dto/login.dto.js';
import type { RegistroDto } from '../presentation/dto/registro.dto.js';

const RONDAS_BCRYPT = 10;
const CORREO_REPETIDO = 'Este correo ya tiene una cuenta asociada.';
const CREDENCIALES_INCORRECTAS = 'Correo o contraseña incorrectos.';
// Hash de un texto aleatorio que nadie conoce. Debe tener las mismas rondas que
// RONDAS_BCRYPT: así un correo inexistente tarda lo mismo que uno real.
const HASH_FALSO =
  '$2b$10$YfBy0a4DvtDeV6L8EdxVsuyqR45uPV4olucGE94COMrHzcpVtEuZO';

export type SesionUsuario = Pick<
  Usuario,
  'id' | 'name' | 'email' | 'campus' | 'universityLink'
>;

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

    return this.firmarToken(usuario);
  }

  async login(datos: LoginDto): Promise<{ token: string }> {
    const usuario = await this.usuarios.findOneBy({ email: datos.email });
    // Sin usuario también se compara (contra el hash falso): si no, responder
    // más rápido delataría qué correos están registrados.
    const coincide = await bcrypt.compare(
      datos.password,
      usuario?.passwordHash ?? HASH_FALSO,
    );
    if (!usuario || !coincide) {
      throw new UnauthorizedException(CREDENCIALES_INCORRECTAS);
    }

    return this.firmarToken(usuario);
  }

  async obtenerSesion(id: number): Promise<SesionUsuario> {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) throw new UnauthorizedException(SESION_NO_VALIDA);

    return {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      campus: usuario.campus,
      universityLink: usuario.universityLink,
    };
  }

  private async firmarToken(usuario: Usuario): Promise<{ token: string }> {
    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });
    return { token };
  }
}

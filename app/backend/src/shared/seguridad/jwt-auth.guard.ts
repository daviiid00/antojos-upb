import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UsuarioAutenticado {
  id: number;
  email: string;
}

interface PeticionConSesion {
  headers: { authorization?: string };
  usuario?: UsuarioAutenticado;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const peticion = contexto.switchToHttp().getRequest<PeticionConSesion>();
    const [tipo, token] = peticion.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Debes iniciar sesión.');
    }
    try {
      const datos = await this.jwt.verifyAsync<{ sub: number; email: string }>(
        token,
      );
      peticion.usuario = { id: datos.sub, email: datos.email };
    } catch {
      throw new UnauthorizedException('Tu sesión no es válida o expiró.');
    }
    return true;
  }
}
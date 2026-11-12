import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UsuarioAutenticado } from './usuario-actual.decorator.js';

export const SESION_NO_VALIDA = 'Sesión no válida o vencida.';

type PeticionConToken = {
  headers: { authorization?: string };
  usuario?: UsuarioAutenticado;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const peticion = contexto.switchToHttp().getRequest<PeticionConToken>();
    const [esquema, token] = peticion.headers.authorization?.split(' ') ?? [];
    if (esquema !== 'Bearer' || !token) {
      throw new UnauthorizedException(SESION_NO_VALIDA);
    }

    try {
      const payload = await this.jwt.verifyAsync<{
        sub: number;
        email: string;
      }>(token);
      peticion.usuario = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      // Token manipulado o vencido: la misma respuesta, sin dar pistas.
      throw new UnauthorizedException(SESION_NO_VALIDA);
    }
  }
}

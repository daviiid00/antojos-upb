import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export type UsuarioAutenticado = { id: number; email: string };

// Entrega el usuario que JwtAuthGuard dejó en la petición.
export const UsuarioActual = createParamDecorator(
  (_datos: unknown, contexto: ExecutionContext): UsuarioAutenticado =>
    contexto.switchToHttp().getRequest<{ usuario: UsuarioAutenticado }>()
      .usuario,
);

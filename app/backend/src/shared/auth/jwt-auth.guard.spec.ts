import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard.js';

const payload = { sub: 7, email: 'david@upb.edu.co' };

describe('JwtAuthGuard', () => {
  const jwt = new JwtService({
    secret: 'x'.repeat(32),
    signOptions: { expiresIn: '1d' },
  });
  const guard = new JwtAuthGuard(jwt);

  const peticionCon = (authorization?: string) => ({
    headers: { authorization },
    usuario: undefined as unknown,
  });
  const contextoDe = (peticion: object) =>
    ({
      switchToHttp: () => ({ getRequest: () => peticion }),
    }) as unknown as ExecutionContext;

  async function esperarRechazo(authorization?: string) {
    const peticion = peticionCon(authorization);

    const resultado = guard.canActivate(contextoDe(peticion));

    await expect(resultado).rejects.toThrow(UnauthorizedException);
    await expect(resultado).rejects.toThrow('Sesión no válida o vencida.');
    expect(peticion.usuario).toBeUndefined();
  }

  it('con un token válido deja { id, email } en request.usuario', async () => {
    const token = await jwt.signAsync(payload);
    const peticion = peticionCon(`Bearer ${token}`);

    await expect(guard.canActivate(contextoDe(peticion))).resolves.toBe(true);

    expect(peticion.usuario).toEqual({ id: 7, email: payload.email });
  });

  it('rechaza una petición sin header Authorization', async () => {
    await esperarRechazo(undefined);
  });

  it('rechaza un esquema distinto de Bearer', async () => {
    const token = await jwt.signAsync(payload);

    await esperarRechazo(`Basic ${token}`);
  });

  it('rechaza un token manipulado', async () => {
    const token = await jwt.signAsync(payload);
    const [cabecera, , firma] = token.split('.');
    const cuerpoFalso = Buffer.from(
      JSON.stringify({ ...payload, sub: 1 }),
    ).toString('base64url');

    await esperarRechazo(`Bearer ${cabecera}.${cuerpoFalso}.${firma}`);
  });

  it('rechaza un token vencido', async () => {
    const token = await jwt.signAsync(payload, { expiresIn: -10 });

    await esperarRechazo(`Bearer ${token}`);
  });
});

import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';
import type { Usuario } from '../data/usuario.entity.js';
import type { RegistroDto } from '../presentation/dto/registro.dto.js';
import { AuthService } from './auth.service.js';

const datos: RegistroDto = {
  name: 'David Anaya',
  email: 'david@upb.edu.co',
  password: 'Antojos2026',
  campus: 'Medellín',
  universityLink: 'Estudiante',
  termsAccepted: true,
};

describe('AuthService.registrar', () => {
  let repositorio: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let jwt: JwtService;
  let servicio: AuthService;

  beforeEach(() => {
    repositorio = {
      create: vi.fn((usuario) => usuario),
      save: vi.fn(async (usuario) => ({ ...usuario, id: 7 })),
    };
    jwt = new JwtService({
      secret: 'x'.repeat(32),
      signOptions: { expiresIn: '1d' },
    });
    servicio = new AuthService(
      repositorio as unknown as Repository<Usuario>,
      jwt,
    );
  });

  it('guarda el hash de bcrypt y nunca la contraseña en texto plano', async () => {
    await servicio.registrar(datos);

    const guardado = repositorio.save.mock.calls[0][0];
    expect(guardado).not.toHaveProperty('password');
    expect(guardado.passwordHash).not.toBe(datos.password);
    expect(await bcrypt.compare(datos.password, guardado.passwordHash)).toBe(
      true,
    );
  });

  it('responde solo con { token }', async () => {
    const respuesta = await servicio.registrar(datos);

    expect(Object.keys(respuesta)).toEqual(['token']);
  });

  it('firma el token con el id y el correo, y expira en 1 día', async () => {
    const { token } = await servicio.registrar(datos);

    const payload = await jwt.verifyAsync(token);
    expect(payload).toMatchObject({ sub: 7, email: datos.email });
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
  });
});

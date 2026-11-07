import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { QueryFailedError, type Repository } from 'typeorm';
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

// Error como el que lanza TypeORM cuando MySQL rechaza el INSERT.
const errorDeMysql = (code: string) =>
  new QueryFailedError(
    'INSERT INTO users ...',
    [],
    Object.assign(new Error(`${code}: falla simulada`), { code }),
  );

describe('AuthService.registrar', () => {
  let repositorio: {
    existsBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let jwt: JwtService;
  let servicio: AuthService;

  beforeEach(() => {
    repositorio = {
      existsBy: vi.fn(async () => false),
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

  it('responde 409 sin guardar si el correo ya existe', async () => {
    repositorio.existsBy.mockResolvedValue(true);

    const registro = servicio.registrar(datos);

    await expect(registro).rejects.toThrow(ConflictException);
    await expect(registro).rejects.toThrow(
      'Este correo ya tiene una cuenta asociada.',
    );
    expect(repositorio.existsBy).toHaveBeenCalledWith({ email: datos.email });
    expect(repositorio.save).not.toHaveBeenCalled();
  });

  it('convierte en 409 el ER_DUP_ENTRY del índice único (registros simultáneos)', async () => {
    repositorio.save.mockRejectedValue(errorDeMysql('ER_DUP_ENTRY'));

    const registro = servicio.registrar(datos);

    await expect(registro).rejects.toThrow(ConflictException);
    await expect(registro).rejects.toThrow(
      'Este correo ya tiene una cuenta asociada.',
    );
  });

  it('deja pasar cualquier otro error de la base de datos', async () => {
    const otroError = errorDeMysql('ER_NO_SUCH_TABLE');
    repositorio.save.mockRejectedValue(otroError);

    await expect(servicio.registrar(datos)).rejects.toBe(otroError);
  });
});

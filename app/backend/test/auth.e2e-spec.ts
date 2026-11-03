import type { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { Usuario } from '../src/modules/usuarios/data/usuario.entity.js';
import { UsuariosModule } from '../src/modules/usuarios/usuarios.module.js';
import { crearValidationPipe } from '../src/shared/config/validacion.js';

const registroValido = {
  name: 'David Anaya',
  email: 'david@upb.edu.co',
  password: 'Antojos2026',
  campus: 'Medellín',
  universityLink: 'Estudiante',
  termsAccepted: true,
};

describe('POST /auth/register (e2e)', () => {
  let app: INestApplication<App>;
  let repositorio: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    repositorio = {
      create: vi.fn((usuario) => usuario),
      save: vi.fn(async (usuario) => ({ ...usuario, id: 1 })),
    };
    const modulo = await Test.createTestingModule({
      imports: [
        // ignoreEnvFile: la prueba nunca lee el .env real.
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ JWT_SECRET: 'x'.repeat(32), JWT_EXPIRES_IN: '1d' })],
        }),
        UsuariosModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue(repositorio)
      .compile();

    app = modulo.createNestApplication();
    app.useGlobalPipes(crearValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const registrar = (cuerpo: object) =>
    request(app.getHttpServer()).post('/auth/register').send(cuerpo);

  it('crea la cuenta y responde 201 solo con el token', async () => {
    const respuesta = await registrar(registroValido).expect(201);

    expect(Object.keys(respuesta.body)).toEqual(['token']);
    expect(repositorio.save).toHaveBeenCalledOnce();
  });

  it('normaliza el correo con trim y minúsculas antes de guardar', async () => {
    await registrar({ ...registroValido, email: '  David@UPB.edu.co ' }).expect(
      201,
    );

    expect(repositorio.save.mock.calls[0][0].email).toBe('david@upb.edu.co');
  });

  it('descarta campos que no están en el DTO, como "rol"', async () => {
    await registrar({ ...registroValido, rol: 'admin' }).expect(201);

    expect(repositorio.save.mock.calls[0][0]).not.toHaveProperty('rol');
  });

  it.each([
    ['términos en false', { termsAccepted: false }],
    ['términos ausentes', { termsAccepted: undefined }],
    ['términos como texto "true"', { termsAccepted: 'true' }],
  ])('rechaza con 400 si %s', async (_caso, cambio) => {
    await registrar({ ...registroValido, ...cambio }).expect(400);

    expect(repositorio.save).not.toHaveBeenCalled();
  });

  it.each([
    ['menos de 8 caracteres', 'Abc1234'],
    ['sin mayúscula', 'antojos2026'],
    ['sin número', 'AntojosUpb'],
    ['de más de 72 caracteres', `A1${'a'.repeat(71)}`],
    // 42 caracteres, pero 83 bytes: cada ñ ocupa 2.
    ['corta en caracteres pero de más de 72 bytes', `Ñ1${'ñ'.repeat(40)}`],
  ])('rechaza con 400 una contraseña %s', async (_caso, password) => {
    await registrar({ ...registroValido, password }).expect(400);

    expect(repositorio.save).not.toHaveBeenCalled();
  });

  it.each([
    ['sede', { campus: 'Bogotá' }],
    ['vínculo con la UPB', { universityLink: 'Profesor' }],
    ['correo', { email: 'no-es-un-correo' }],
    ['nombre vacío', { name: '   ' }],
  ])('rechaza con 400 un valor inválido de %s', async (_caso, cambio) => {
    await registrar({ ...registroValido, ...cambio }).expect(400);

    expect(repositorio.save).not.toHaveBeenCalled();
  });
});

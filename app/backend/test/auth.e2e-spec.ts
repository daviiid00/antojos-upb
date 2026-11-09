import type { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { QueryFailedError } from 'typeorm';
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

type RepositorioSimulado = {
  existsBy: ReturnType<typeof vi.fn>;
  findOneBy: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
};

// Repositorio en memoria: recuerda los usuarios guardados en cada prueba.
function crearRepositorio(): RepositorioSimulado {
  const usuarios: Array<{ id: number; email: string }> = [];
  return {
    existsBy: vi.fn(async ({ email }: { email: string }) =>
      usuarios.some((usuario) => usuario.email === email),
    ),
    findOneBy: vi.fn(
      async (criterio: { id?: number; email?: string }) =>
        usuarios.find((usuario) =>
          criterio.id !== undefined
            ? usuario.id === criterio.id
            : usuario.email === criterio.email,
        ) ?? null,
    ),
    create: vi.fn((usuario) => usuario),
    save: vi.fn(async (usuario) => {
      const guardado = { ...usuario, id: usuarios.length + 1 };
      usuarios.push(guardado);
      return guardado;
    }),
  };
}

async function crearApp(
  repositorio: RepositorioSimulado,
): Promise<INestApplication<App>> {
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

  const app = modulo.createNestApplication<INestApplication<App>>();
  app.useGlobalPipes(crearValidationPipe());
  await app.init();
  return app;
}

describe('POST /auth/register (e2e)', () => {
  let app: INestApplication<App>;
  let repositorio: RepositorioSimulado;

  beforeEach(async () => {
    repositorio = crearRepositorio();
    app = await crearApp(repositorio);
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

  describe('correo institucional', () => {
    it.each([
      ['de otro dominio', 'laura@gmail.com'],
      ['de un subdominio', 'laura@estudiantes.upb.edu.co'],
      ['que solo contiene el dominio', 'laura@upb.edu.co.com'],
      ['parecido al dominio, sin los puntos', 'laura@upbxeduxco'],
    ])('rechaza con 400 un correo %s', async (_caso, email) => {
      const respuesta = await registrar({ ...registroValido, email }).expect(
        400,
      );

      expect(respuesta.body.message).toContain(
        'El correo debe ser institucional (@upb.edu.co).',
      );
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    it('acepta "Laura@UPB.EDU.CO" y lo guarda normalizado', async () => {
      await registrar({ ...registroValido, email: 'Laura@UPB.EDU.CO' }).expect(
        201,
      );

      expect(repositorio.existsBy).toHaveBeenCalledWith({
        email: 'laura@upb.edu.co',
      });
      expect(repositorio.save.mock.calls[0][0].email).toBe('laura@upb.edu.co');
    });
  });

  describe('correo repetido', () => {
    it('responde 409 si el correo ya tiene una cuenta, aunque cambien las mayúsculas', async () => {
      await registrar(registroValido).expect(201);

      const respuesta = await registrar({
        ...registroValido,
        email: 'DAVID@upb.edu.co',
      }).expect(409);

      expect(respuesta.body.message).toBe(
        'Este correo ya tiene una cuenta asociada.',
      );
      expect(respuesta.body).not.toHaveProperty('token');
      expect(repositorio.save).toHaveBeenCalledOnce();
    });

    it('responde 409 si el índice único frena un registro simultáneo', async () => {
      repositorio.save.mockRejectedValueOnce(
        new QueryFailedError(
          'INSERT INTO users ...',
          [],
          Object.assign(new Error('Duplicate entry'), { code: 'ER_DUP_ENTRY' }),
        ),
      );

      const respuesta = await registrar(registroValido).expect(409);

      expect(respuesta.body.message).toBe(
        'Este correo ya tiene una cuenta asociada.',
      );
    });
  });
});

describe('POST /auth/login (e2e)', () => {
  let app: INestApplication<App>;
  let repositorio: RepositorioSimulado;

  beforeEach(async () => {
    repositorio = crearRepositorio();
    app = await crearApp(repositorio);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registroValido)
      .expect(201);
  });

  afterEach(async () => {
    await app.close();
  });

  const iniciarSesion = (cuerpo: object) =>
    request(app.getHttpServer()).post('/auth/login').send(cuerpo);
  const credenciales = {
    email: registroValido.email,
    password: registroValido.password,
  };

  it('responde 200 solo con el token, la misma forma que el registro', async () => {
    const respuesta = await iniciarSesion(credenciales).expect(200);

    expect(Object.keys(respuesta.body)).toEqual(['token']);
  });

  it('responde 401 con un cuerpo idéntico para correo inexistente y contraseña mala', async () => {
    const correoInexistente = await iniciarSesion({
      ...credenciales,
      email: 'nadie@upb.edu.co',
    }).expect(401);
    const contrasenaMala = await iniciarSesion({
      ...credenciales,
      password: 'OtraClave2026',
    }).expect(401);

    expect(correoInexistente.body).toEqual(contrasenaMala.body);
    expect(correoInexistente.body.message).toBe(
      'Correo o contraseña incorrectos.',
    );
  });

  it.each([
    ['cuerpo vacío', {}],
    ['correo faltante', { password: 'Antojos2026' }],
    ['contraseña faltante', { email: 'david@upb.edu.co' }],
    ['correo vacío', { email: '   ', password: 'Antojos2026' }],
    ['contraseña vacía', { email: 'david@upb.edu.co', password: '' }],
    ['correo numérico', { email: 123, password: 'Antojos2026' }],
    [
      'correo como arreglo',
      { email: ['a@upb.edu.co'], password: 'Antojos2026' },
    ],
    ['contraseña numérica', { email: 'david@upb.edu.co', password: 123 }],
    [
      'contraseña como objeto',
      { email: 'david@upb.edu.co', password: { a: 1 } },
    ],
  ])('rechaza con 400 un %s', async (_caso, cuerpo) => {
    await iniciarSesion(cuerpo).expect(400);

    expect(repositorio.findOneBy).not.toHaveBeenCalled();
  });

  it('deja entrar con el correo en mayúsculas y con espacios', async () => {
    await iniciarSesion({
      ...credenciales,
      email: '  DAVID@UPB.edu.co ',
    }).expect(200);

    expect(repositorio.findOneBy).toHaveBeenCalledWith({
      email: 'david@upb.edu.co',
    });
  });
});

import {
  Controller,
  Get,
  type INestApplication,
  Module,
  type Type,
  UseGuards,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { QueryFailedError } from 'typeorm';
import { Usuario } from '../src/modules/usuarios/data/usuario.entity.js';
import { UsuariosModule } from '../src/modules/usuarios/usuarios.module.js';
import { JwtAuthGuard } from '../src/shared/auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../src/shared/auth/usuario-actual.decorator.js';
import { crearValidationPipe } from '../src/shared/config/validacion.js';

const registroValido = {
  name: 'David Anaya',
  email: 'david@upb.edu.co',
  phone: '3001234567',
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
  modulos: Array<Type<unknown>> = [UsuariosModule],
): Promise<INestApplication<App>> {
  const modulo = await Test.createTestingModule({
    imports: [
      // ignoreEnvFile: la prueba nunca lee el .env real.
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        load: [() => ({ JWT_SECRET: 'x'.repeat(32), JWT_EXPIRES_IN: '1d' })],
      }),
      ...modulos,
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

  describe('celular', () => {
    const MENSAJE_CELULAR = 'El celular debe tener 10 dígitos y empezar por 3.';

    it.each([
      ['sin separadores', '3001234567'],
      ['con espacios', '300 123 4567'],
      ['con guiones', '300-123-4567'],
      ['con espacios alrededor', '  300 123-4567 '],
    ])(
      'acepta un celular %s y lo guarda como 57 + 10 dígitos',
      async (_caso, phone) => {
        await registrar({ ...registroValido, phone }).expect(201);

        expect(repositorio.save.mock.calls[0][0].phone).toBe('573001234567');
      },
    );

    it.each([
      ['de 9 dígitos', '300123456'],
      ['de 11 dígitos', '30012345678'],
      ['que no empieza por 3 (fijo)', '6041234567'],
      ['con indicativo +57', '+57 300 123 4567'],
      ['con indicativo 57 sin +', '573001234567'],
      ['con letras', '300abc4567'],
      ['con paréntesis', '(300) 1234567'],
      ['vacío', ''],
      ['numérico en vez de texto', 3001234567],
    ])('rechaza con 400 un celular %s', async (_caso, phone) => {
      const respuesta = await registrar({ ...registroValido, phone }).expect(
        400,
      );

      expect(respuesta.body.message).toContain(MENSAJE_CELULAR);
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    it('rechaza con 400 si falta el celular', async () => {
      const respuesta = await registrar({
        ...registroValido,
        phone: undefined,
      }).expect(400);

      expect(respuesta.body.message).toContain('El celular es obligatorio.');
      expect(repositorio.save).not.toHaveBeenCalled();
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

describe('GET /auth/session (e2e)', () => {
  let app: INestApplication<App>;
  let tokenDeRegistro: string;

  beforeEach(async () => {
    app = await crearApp(crearRepositorio());
    const registro = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registroValido)
      .expect(201);
    tokenDeRegistro = registro.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

  const consultarSesion = (token?: string) => {
    const peticion = request(app.getHttpServer()).get('/auth/session');
    return token ? peticion.set('Authorization', `Bearer ${token}`) : peticion;
  };

  it('con el token de /auth/login responde 200 sin passwordHash ni celular', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registroValido.email,
        password: registroValido.password,
      })
      .expect(200);

    const respuesta = await consultarSesion(login.body.token).expect(200);

    expect(respuesta.body).toEqual({
      id: 1,
      name: registroValido.name,
      email: registroValido.email,
      campus: registroValido.campus,
      universityLink: registroValido.universityLink,
    });
    expect(respuesta.body).not.toHaveProperty('passwordHash');
    expect(respuesta.body).not.toHaveProperty('phone');
  });

  it('acepta el token que devuelve /auth/register', async () => {
    const respuesta = await consultarSesion(tokenDeRegistro).expect(200);

    expect(respuesta.body.email).toBe(registroValido.email);
  });

  it('responde 401 sin token', async () => {
    const respuesta = await consultarSesion().expect(401);

    expect(respuesta.body.message).toBe('Sesión no válida o vencida.');
  });

  it('responde 401 con un token manipulado', async () => {
    const [cabecera, cuerpo, firma] = tokenDeRegistro.split('.');
    const firmaAlterada = `${firma.startsWith('a') ? 'b' : 'a'}${firma.slice(1)}`;

    await consultarSesion(`${cabecera}.${cuerpo}.${firmaAlterada}`).expect(401);
  });

  it('responde 401 con el token de un usuario que ya no existe', async () => {
    const token = await app
      .get(JwtService)
      .signAsync({ sub: 999, email: 'borrado@upb.edu.co' });

    const respuesta = await consultarSesion(token).expect(401);

    expect(respuesta.body.message).toBe('Sesión no válida o vencida.');
  });
});

// Comprueba lo que promete el README: basta con imports: [UsuariosModule].
@Controller('protegida')
class ControladorDeOtroModulo {
  @Get()
  @UseGuards(JwtAuthGuard)
  leer(@UsuarioActual() usuario: UsuarioAutenticado) {
    return usuario;
  }
}

@Module({
  imports: [UsuariosModule],
  controllers: [ControladorDeOtroModulo],
})
class OtroModulo {}

describe('JwtAuthGuard desde otro módulo (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await crearApp(crearRepositorio(), [OtroModulo]);
  });

  afterEach(async () => {
    await app.close();
  });

  it('protege la ruta sin configurar JWT otra vez', async () => {
    const token = await app
      .get(JwtService)
      .signAsync({ sub: 7, email: 'david@upb.edu.co' });

    await request(app.getHttpServer()).get('/protegida').expect(401);
    const respuesta = await request(app.getHttpServer())
      .get('/protegida')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(respuesta.body).toEqual({ id: 7, email: 'david@upb.edu.co' });
  });
});

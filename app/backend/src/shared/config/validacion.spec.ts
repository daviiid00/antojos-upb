import type { ArgumentMetadata } from '@nestjs/common';
import { RegistroDto } from '../../modules/usuarios/presentation/dto/registro.dto.js';
import { crearValidationPipe } from './validacion.js';

const registroValido = {
  name: 'David Anaya',
  email: 'david@upb.edu.co',
  phone: '3001234567',
  password: 'Antojos2026',
  campus: 'Medellín',
  universityLink: 'Estudiante',
  termsAccepted: true,
};

const meta: ArgumentMetadata = { type: 'body', metatype: RegistroDto };

describe('crearValidationPipe', () => {
  const pipe = crearValidationPipe();

  it('transform: entrega una instancia de RegistroDto', async () => {
    expect(await pipe.transform(registroValido, meta)).toBeInstanceOf(
      RegistroDto,
    );
  });

  it('whitelist: elimina campos que no están en el DTO', async () => {
    expect(
      await pipe.transform({ ...registroValido, rol: 'admin' }, meta),
    ).not.toHaveProperty('rol');
  });
});

import { Transform } from 'class-transformer';
import {
  Equals,
  IsByteLength,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DOMINIO_INSTITUCIONAL,
  SEDES,
  type Sede,
  VINCULOS_UNIVERSITARIOS,
  type VinculoUniversitario,
} from '../../../../shared/constantes/usuario.js';

const recortar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Termina exactamente en @upb.edu.co (los puntos escapados para que sean literales).
const CORREO_INSTITUCIONAL = new RegExp(
  `${DOMINIO_INSTITUCIONAL.replaceAll('.', '\\.')}$`,
);

export class RegistroDto {
  @Transform(recortar)
  @IsString({ message: 'El nombre es obligatorio.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres.' })
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El correo no es válido.' })
  // Se valida después del Transform, así que "Laura@UPB.EDU.CO" ya llega en minúsculas.
  @Matches(CORREO_INSTITUCIONAL, {
    message: `El correo debe ser institucional (${DOMINIO_INSTITUCIONAL}).`,
  })
  @MaxLength(255, { message: 'El correo no puede superar 255 caracteres.' })
  email: string;

  @IsString({ message: 'La contraseña es obligatoria.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  // bcrypt solo lee los primeros 72 bytes (una tilde o una ñ ocupan 2).
  @IsByteLength(0, 72, { message: 'La contraseña es demasiado larga.' })
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe tener al menos una mayúscula.',
  })
  @Matches(/\d/, { message: 'La contraseña debe tener al menos un número.' })
  password: string;

  @IsIn(SEDES, { message: 'La sede no es válida.' })
  campus: Sede;

  @IsIn(VINCULOS_UNIVERSITARIOS, {
    message: 'El vínculo con la UPB no es válido.',
  })
  universityLink: VinculoUniversitario;

  @Equals(true, { message: 'Debes aceptar los términos y condiciones.' })
  termsAccepted: boolean;
}

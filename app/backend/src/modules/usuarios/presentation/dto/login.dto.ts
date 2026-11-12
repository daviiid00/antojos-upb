import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

// Sin validar dominio ni complejidad: un dato raro simplemente no coincide
// con ninguna cuenta y responde el mismo 401 de siempre.
export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString({ message: 'El correo es obligatorio.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @IsString({ message: 'La contraseña es obligatoria.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;
}

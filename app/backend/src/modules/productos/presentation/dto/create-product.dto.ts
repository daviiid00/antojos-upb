import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

const recortar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateProductDto {
  @Transform(recortar)
  @IsString({ message: 'El título es obligatorio.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(100, { message: 'El título no puede superar 100 caracteres.' })
  name: string;

  @Transform(recortar)
  @IsString({ message: 'La descripción es obligatoria.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(500, {
    message: 'La descripción no puede superar 500 caracteres.',
  })
  description: string;

  @IsInt({ message: 'El precio debe ser un número entero.' })
  @Min(1, { message: 'El precio debe ser mayor que 0.' })
  price: number;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser de al menos 1.' })
  stock: number;

  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { message: 'La imagen no es válida.' },
  )
  @MaxLength(500, { message: 'El enlace de la imagen es demasiado largo.' })
  imageUrl: string;
}
import { ValidationPipe } from '@nestjs/common';

// whitelist: descarta campos que no estén en el DTO (por ejemplo "rol").
// transform: entrega al controller una instancia del DTO.
export function crearValidationPipe(): ValidationPipe {
  return new ValidationPipe({ whitelist: true, transform: true });
}

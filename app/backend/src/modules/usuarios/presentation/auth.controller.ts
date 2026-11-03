import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../business/auth.service.js';
// Import de valor (no `import type`): el ValidationPipe necesita la clase en runtime.
import { RegistroDto } from './dto/registro.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  registrar(@Body() datos: RegistroDto): Promise<{ token: string }> {
    return this.auth.registrar(datos);
  }
}

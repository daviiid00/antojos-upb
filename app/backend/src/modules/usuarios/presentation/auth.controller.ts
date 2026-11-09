import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../business/auth.service.js';
// Import de valor (no `import type`): el ValidationPipe necesita la clase en runtime.
import { LoginDto } from './dto/login.dto.js';
import { RegistroDto } from './dto/registro.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  registrar(@Body() datos: RegistroDto): Promise<{ token: string }> {
    return this.auth.registrar(datos);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() datos: LoginDto): Promise<{ token: string }> {
    return this.auth.login(datos);
  }
}

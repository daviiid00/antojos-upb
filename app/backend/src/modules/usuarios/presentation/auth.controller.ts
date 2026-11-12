import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../../../shared/auth/usuario-actual.decorator.js';
import { AuthService, type SesionUsuario } from '../business/auth.service.js';
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

  @Get('session')
  @UseGuards(JwtAuthGuard)
  sesion(@UsuarioActual() usuario: UsuarioAutenticado): Promise<SesionUsuario> {
    return this.auth.obtenerSesion(usuario.id);
  }
}

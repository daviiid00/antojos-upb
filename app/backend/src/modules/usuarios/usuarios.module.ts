import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../shared/auth/jwt-auth.guard.js';
import type { Entorno } from '../../shared/config/env.js';
import { AuthService } from './business/auth.service.js';
import { Usuario } from './data/usuario.entity.js';
import { AuthController } from './presentation/auth.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Entorno, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', {
            infer: true,
          }) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  // Con JwtModule exportado, otros módulos usan el guard sin configurar JWT otra vez.
  exports: [JwtModule, JwtAuthGuard],
})
export class UsuariosModule {}

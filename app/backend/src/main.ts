import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Entorno } from './shared/config/env.js';
import { crearValidationPipe } from './shared/config/validacion.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(crearValidationPipe());
  const config = app.get<ConfigService<Entorno, true>>(ConfigService);
  app.enableCors({ origin: config.get('FRONTEND_URL', { infer: true }) });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

# Backend de Antojos UPB

API en NestJS + TypeScript + MySQL. Está organizada por módulos en `src/modules/`
(cada uno con capas `presentation`, `business` y `data`) y lo común va en `src/shared/`.

## Requisitos

- Node.js 24 o superior
- MySQL 8 con una base `antojos_upb` y un usuario `antojos` con permisos sobre ella

## Crear la base de datos (solo la primera vez)

En MySQL, como root:

```sql
CREATE DATABASE antojos_upb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'antojos'@'localhost' IDENTIFIED BY 'TU_CLAVE_AQUI';
GRANT ALL PRIVILEGES ON antojos_upb.* TO 'antojos'@'localhost';
```

Usa en `DB_PASSWORD` del `.env` la misma clave que pusiste en lugar de `TU_CLAVE_AQUI`.

## Instalación

Desde `app/backend`:

```bash
npm install
```

## Variables de entorno

Copia la plantilla y llena los valores (el `.env` nunca se sube a Git):

```bash
cp .env.example .env
```

- `DB_PASSWORD`: la clave del usuario `antojos` en MySQL.
- `JWT_SECRET`: obligatorio, mínimo 32 caracteres aleatorios. Sin él la app no arranca.

## Migraciones

Las tablas se crean con migraciones (`synchronize` está apagado):

```bash
npm run migration:run      # aplica las migraciones pendientes
npm run migration:show     # muestra cuáles están aplicadas ([X]) y cuáles no ([ ])
npm run migration:revert   # deshace la última
```

## Cómo correrlo

```bash
npm run start:dev   # servidor en http://localhost:3000 con recarga automática
npm test            # pruebas unitarias (no necesitan MySQL)
npm run test:e2e    # pruebas de los endpoints con el repositorio simulado
npm run lint
```

## Proteger una ruta con el guard

Agrega `imports: [UsuariosModule]` en el módulo de tu feature (trae JWT ya configurado) y usa:

```ts
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard.js';
import { UsuarioActual, type UsuarioAutenticado } from '../../../shared/auth/usuario-actual.decorator.js';

@Get('mias')
@UseGuards(JwtAuthGuard)
listarMias(@UsuarioActual() usuario: UsuarioAutenticado) {
  return this.productos.listarDe(usuario.id);
}
```

El cliente envía `Authorization: Bearer <token>`; sin un token válido la ruta responde 401.

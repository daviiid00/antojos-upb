# Backend de Antojos UPB

API en NestJS + TypeScript + MySQL. Está organizada por módulos en `src/modules/`
(cada uno con capas `presentation`, `business` y `data`) y lo común va en `src/shared/`.

## Requisitos

- Node.js 24 o superior
- MySQL 8 con una base `antojos_upb` y un usuario `antojos` con permisos sobre ella

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

## Cómo correrlo

```bash
npm run start:dev   # servidor en http://localhost:3000 con recarga automática
npm test            # pruebas unitarias (no necesitan MySQL)
npm run lint
```

# Guía de contribución

Usamos **GitHub Flow**. Cada historia de usuario de Jira se puede rastrear de punta a punta: **historia en Jira → rama → Pull Request**.

## Reglas de oro

1. **`main` solo recibe cambios por Pull Request.** Nunca se hace push directo.
2. **Una rama por historia de usuario**, con la clave de Jira en el nombre.
3. **Todo PR lleva la clave de la historia** en el título.
4. **Nunca subir secretos:** el archivo `.env` no se commitea (solo `.env.example`).

## Nombre de las ramas

```
feat/ANTOJOS-<número>
```

El número es el de la historia en Jira. Ejemplos: `feat/ANTOJOS-5`, `feat/ANTOJOS-11`, `feat/ANTOJOS-29`.

## Paso a paso para trabajar una historia

```bash
# 1. Partir siempre de main actualizada
git checkout main
git pull origin main

# 2. Crear la rama de la historia
git checkout -b feat/ANTOJOS-11

# 3. Trabajar y hacer commits pequeños, con la clave al inicio
git add .
git commit -m "ANTOJOS-11: agrega formulario de registro"

# 4. Subir la rama
git push -u origin feat/ANTOJOS-11
```

5. Abrir un **Pull Request** hacia `main` en GitHub.
   - **Título:** `ANTOJOS-11: Registro de usuario con correo institucional`
   - Llenar la plantilla del PR (qué se hizo, criterios de aceptación cubiertos, cómo probarlo).
6. Pedir revisión a un compañero. Se hace merge cuando esté aprobado.
7. Actualizar el estado de la historia en Jira.

## Estado en Jira

| Momento | Estado de la historia |
|---|---|
| Creo la rama y empiezo a trabajar | **En curso** |
| El PR se fusiona a `main` | **Listo** |

Mantener el tablero al día es parte de la nota: el estado de las historias debe ser coherente con el trabajo real.

## Mensajes de commit

Formato: `ANTOJOS-<número>: descripción corta en presente`.

✅ `ANTOJOS-13: valida credenciales con bcrypt.compare`
❌ `arreglos`, `cambios varios`

## Evitar conflictos

- Haz `git pull origin main` seguido, sobre todo antes de abrir el PR.
- Los archivos donde más chocamos: `package.json` / `package-lock.json` y `src/App.jsx` (rutas) y `src/app.module.ts` (módulos). Si hay conflicto, conserva **ambos** cambios.
- Si necesitas una librería nueva, avísale al equipo antes de agregarla.

## Cómo correr el proyecto

Ver la sección *Guía de instalación y ejecución* del [README](README.md).

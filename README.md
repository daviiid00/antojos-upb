# Antojos UPB

Plataforma web de compra y venta exclusiva para la comunidad de la Universidad Pontificia Bolivariana (UPB), pensada para reemplazar el caos de los grupos de WhatsApp de "antojos" con un catálogo organizado, verificado con correo institucional.

> Proyecto del curso **Ingeniería de Software** · Escuela de Ingenierías · UPB Medellín · 2026
> Docente: María Paula Flórez Vargas

## Descripción general

Antojos UPB conecta a **compradores** y **vendedores** de la comunidad universitaria en un solo lugar:

- Los vendedores publican productos con foto, descripción, precio y disponibilidad.
- Los compradores exploran el catálogo, buscan por nombre o palabra clave, y consultan el detalle de cada producto.
- La compra se concreta por **WhatsApp** (enlace directo `wa.me` con mensaje prellenado); la plataforma **no** procesa pagos ni entregas.
- Solo se puede ingresar con un correo institucional `@upb.edu.co`.

## Contexto del problema y propuesta de solución

**El problema.** En la UPB existen varios grupos de compra y venta donde los emprendedores ofrecen sus productos, pero son desorganizados: llegan cientos de mensajes al día, las publicaciones se pierden, el comprador no encuentra lo que busca y el vendedor pierde visibilidad (y clientes cuando el grupo se llena). Además, coordinar encuentros y disponibilidad es difícil.

**La solución.** Una página web exclusiva para la comunidad UPB que centraliza las publicaciones, permite buscarlas y filtrarlas, y reduce el ruido de los chats. La **hipótesis del producto** es reducir en un 75 % el flujo de mensajes en los grupos de WhatsApp de antojos y compra/venta del campus.

Más detalle en [`docs/`](docs/README.md).

## Estado del proyecto

**Primer release (Sprint 1: 26 oct – 11 nov 2026):** parte priorizada del MVP, organizada en 6 épicas en Jira:

| Épica | Qué cubre |
|---|---|
| Acceder al Sistema | Bienvenida, registro e inicio de sesión con correo institucional |
| Exploración y Búsqueda de Productos | Catálogo, navegación y búsqueda |
| Consulta de Detalle y Contacto de Compra | Detalle del producto y solicitud por WhatsApp |
| Publicación de Productos para la Venta | Carga de imagen y publicación |
| Gestión y Control de Solicitudes de Compra | Panel del vendedor para aceptar o denegar pedidos |
| Administración de Perfil y Publicaciones Propias | Perfil, horario y publicaciones propias |

## Arquitectura y stack

Monolito modular, con backend por capas (`presentation` / `business` / `data`) y frontend organizado por funcionalidad. Detalle de diseño en [`docs/contexto/taller-3-diseno.pdf`](docs/contexto/taller-3-diseno.pdf).

| Componente | Tecnología |
|---|---|
| Frontend | React JS + React Router |
| Backend | NestJS (Node.js + TypeScript) |
| Base de datos | MySQL |
| Autenticación | JWT + bcrypt |
| Imágenes | Cloudinary |
| Contacto | Enlaces `wa.me` de WhatsApp |
| Despliegue previsto | Opcional según la profesora. En este release no se despliega: se ejecuta en local |

## Estructura del repositorio

```
antojos-upb/
├── README.md
├── CONTRIBUTING.md          # flujo de trabajo Git (GitHub Flow)
├── docs/                    # documentación del semestre
│   ├── requisitos/          # documento de requisitos (SRS)
│   ├── casos-de-uso/        # diagrama de casos de uso
│   ├── procesos/            # diagrama de procesos
│   ├── wireframes/          # wireframes y prototipos
│   └── contexto/            # talleres 1, 3 y 5
└── app/                     # código fuente del primer release
    ├── backend/             # API REST (NestJS)
    └── frontend/            # interfaz web (React)
```

## Guía de instalación y ejecución

El proyecto se ejecuta en local con dos programas a la vez: el backend en el puerto 3000 y el frontend en el 5173. Necesitas dos terminales.

### 1. Requisitos

- Node.js 24 o superior (incluye npm)
- MySQL 8 instalado y encendido
- Git

### 2. Clonar el repositorio

```bash
git clone https://github.com/daviiid00/antojos-upb.git
cd antojos-upb
```

### 3. Crear la base de datos (solo la primera vez)

Entra a MySQL como root y crea la base `antojos_upb` y el usuario `antojos`. Inventa una clave y reemplaza `TU_CLAVE_AQUI`:

```sql
CREATE DATABASE antojos_upb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'antojos'@'localhost' IDENTIFIED BY 'TU_CLAVE_AQUI';
GRANT ALL PRIVILEGES ON antojos_upb.* TO 'antojos'@'localhost';
```

Más detalles en [`app/backend/README.md`](app/backend/README.md).

### 4. Backend (primera terminal)

Desde la raíz del repositorio crea el archivo de variables de entorno (el comando `cp` funciona en PowerShell y en Git Bash):

```bash
cd app/backend
cp .env.example .env
```

Abre `app/backend/.env` y llena estos valores:

| Variable | Qué poner |
|---|---|
| `DB_PASSWORD` | La misma clave que usaste en lugar de `TU_CLAVE_AQUI` |
| `JWT_SECRET` | Un texto aleatorio de mínimo 32 caracteres, inventado por ti |
| `FRONTEND_URL` | `http://localhost:5173` (ya viene así) |

Instala las dependencias, crea las tablas y enciende el servidor:

```bash
npm install
npm run migration:run
npm run start:dev
```

Deja esta terminal abierta. El backend queda en <http://localhost:3000>.

### 5. Frontend (segunda terminal)

Desde la raíz del repositorio:

```bash
cd app/frontend
cp .env.example .env
npm install
npm run dev
```

El `.env` del frontend solo tiene `VITE_API_URL=http://localhost:3000` y ya viene listo.

### 6. Abrir la aplicación

Entra a <http://localhost:5173>. Usa `localhost` y no `127.0.0.1`, porque el backend solo acepta peticiones de ese origen.

Para apagar el backend o el frontend, presiona `Ctrl + C` en su terminal.

### 7. Correr las pruebas

No necesitan MySQL ni el `.env`. Desde `app/backend`:

```bash
npm test            # pruebas unitarias
npm run test:e2e    # pruebas de los endpoints con el repositorio simulado
```

### Problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| `Port 5173 is already in use` | Quedó un Vite abierto o colgado | Ejecuta `netstat -ano \| findstr :5173` y cierra ese proceso con `taskkill /PID <número> /F` |
| Error genérico al registrarse ("No pudimos crear tu cuenta") | El backend está apagado o el navegador lo bloquea por CORS | Revisa que el backend esté encendido, que abriste `http://localhost:5173` y que `FRONTEND_URL` sea exactamente ese valor. Si cambiaste el `.env`, reinicia el backend |
| `ER_ACCESS_DENIED_ERROR` al migrar o al arrancar | `DB_PASSWORD` no coincide con la clave del usuario `antojos` | Corrige `DB_PASSWORD` en `app/backend/.env` |
| `La variable JWT_SECRET debe tener al menos 32 caracteres` | `JWT_SECRET` es muy corto | Usa un texto de 32 caracteres o más y vuelve a arrancar |

## Guía básica de uso

Esto es lo que se puede hacer hoy:

1. **Registrarse.** En la bienvenida, elige **Comenzar** y llena el formulario. El correo debe terminar en `@upb.edu.co` y la contraseña necesita mínimo 8 caracteres, una mayúscula y un número. Al crear la cuenta entras directo al inicio.
2. **Iniciar sesión.** En la bienvenida, elige **Inicia sesión** y escribe tu correo y contraseña.
3. **Cerrar sesión.** En la pantalla de inicio, elige **Cerrar sesión**. Vuelves a la bienvenida.
4. **Explorar el catálogo.** Desde el inicio, elige **Explorar productos**. Puedes buscar por nombre y filtrar por tipo. Por ahora muestra datos de prueba, hasta que exista `GET /products`.

**Pendiente en este release:** publicar productos, ver el detalle y solicitar por WhatsApp, gestionar solicitudes de compra y administrar el perfil.

## Gestión del proyecto

- **Tablero de Jira:** <https://upb-team-ndy1qmmc.atlassian.net/jira/software/projects/ANTOJOS/boards/2>
- **Prototipo de media fidelidad (Figma):** [abrir prototipo](https://www.figma.com/proto/gbu90G6NZ7gUsHi2ebiBAu/Prototipo-de-Media-Fidelidad?node-id=5-6488&p=f&t=kt0uc6Ln2LoyDCdp-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=5%3A6488)
- **Prototipo de baja fidelidad (Canva):** <https://canva.link/blvj0qrvqfpnz2x>

## Flujo de trabajo en Git

Usamos **GitHub Flow**: `main` siempre estable y protegida, una rama `feat/ANTOJOS-<número>` por cada historia de usuario, y todo cambio entra por Pull Request. Detalle en [CONTRIBUTING.md](CONTRIBUTING.md).

## Integrantes

- Valentina Vélez Cano
- Samuel Botero Gallo
- Laura Camila Heredia Uribe
- David Anaya Negrete

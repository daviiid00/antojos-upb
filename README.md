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
| Despliegue previsto | Netlify (frontend) y Render (backend) |

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
└── app/                     # (próximamente) código fuente del primer release
    ├── backend/             # API REST (NestJS)
    └── frontend/            # interfaz web (React)
```

> La carpeta `app/` se va agregando historia por historia durante el Sprint 1.

## Guía de instalación y ejecución

> 🚧 **Pendiente.** El código del primer release se agrega historia por historia durante el Sprint 1 (26 oct – 11 nov). Esta sección se completa con los pasos reales de instalación y ejecución (backend, frontend, base de datos MySQL y variables de entorno) cuando exista el código.

**Requisitos previstos:** Node.js 22 (LTS) o superior, npm y MySQL 8.

## Guía básica de uso

> 🚧 Se completa al cerrar el primer release, con el recorrido real de la aplicación (registro → inicio de sesión → publicar → buscar → solicitar por WhatsApp).

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

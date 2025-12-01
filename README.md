# Next App Skeleton

Frontend skeleton para consumir la API `node-ts-api-skeleton`. Construido con Next.js 16, TypeScript y Tailwind CSS.

## Descripción

Este proyecto es un **skeleton/template** que proporciona una base sólida para construir aplicaciones frontend que consumen APIs REST. Incluye arquitectura limpia, componentes reutilizables, y gestión completa de usuarios como ejemplo.

## Arquitectura

```
next-app-skeleton/
├── app/                    # Next.js App Router (páginas)
│   ├── (dashboard)/       # Páginas del dashboard
│   │   ├── users/        # Gestión de usuarios
│   │   └── layout.tsx    # Layout con sidebar
│   ├── layout.tsx        # Layout raíz
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   └── users/            # Componentes de usuarios
├── lib/                   # Utilidades y configuración
│   ├── api/              # Cliente HTTP
│   ├── config.ts         # Configuración (URLs, constantes)
│   └── utils.ts          # Funciones utilitarias
├── services/             # Servicios para consumir API
│   └── user.service.ts   # Servicio de usuarios
├── types/                # Tipos TypeScript
│   └── user.types.ts     # DTOs de usuario
└── hooks/                # Custom hooks
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional)
# Crear .env.local con NEXT_PUBLIC_API_URL si la API no está en localhost:3000

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de Entorno

Crear archivo `.env.local` (opcional):

```env
# URL del servidor API (sin trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Conexión con la API

Este frontend consume `node-ts-api-skeleton`. Asegúrate de:

1. Tener la API corriendo en `http://localhost:3000`
2. Configurar CORS en la API para permitir el origen del frontend
3. El path de la API es `/api/skeleton` (configurable en `lib/config.ts`)

## Scripts

| Script          | Descripción                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Servidor de desarrollo         |
| `npm run build` | Compilar para producción       |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint`  | Ejecutar ESLint                |

## Estructura por Capas

### 1. Lib (`/lib`)

Configuración y utilidades base:

- **config.ts** - URLs y constantes de la aplicación
- **api/client.ts** - Cliente HTTP con manejo de errores
- **utils.ts** - Funciones utilitarias (cn, formatDate)

### 2. Types (`/types`)

Definiciones de TypeScript sincronizadas con la API:

- **user.types.ts** - DTOs de usuario (User, CreateUserDTO, etc.)
- **ApiResponse** - Formato estándar de respuestas

### 3. Services (`/services`)

Capa de comunicación con la API:

- Encapsulan llamadas HTTP
- Retornan datos tipados
- Manejan transformaciones

### 4. Components (`/components`)

Componentes React organizados:

- **ui/** - Componentes base reutilizables (Button, Card, Input, Modal, Alert)
- **users/** - Componentes específicos de dominio (UserTable, UserForm)

### 5. App (`/app`)

Páginas con App Router de Next.js:

- Route groups para organización
- Layouts anidados
- Server y Client Components

## Flujo de Datos

```
Página/Componente
      ↓
   Service (userService.getAll())
      ↓
   API Client (apiClient.get())
      ↓
   API REST (node-ts-api-skeleton)
      ↓
   Respuesta tipada (User[])
```

## Agregar Nuevo Módulo

1. **Crear tipos** en `/types/mi-modulo.types.ts`
2. **Crear servicio** en `/services/mi-modulo.service.ts`
3. **Crear componentes** en `/components/mi-modulo/`
4. **Crear página** en `/app/(dashboard)/mi-modulo/page.tsx`

## Tech Stack

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **React 19** - Biblioteca UI

## Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Autor:** Claudio Navarrete / Líder Técnico  
**Última actualización:** 2025

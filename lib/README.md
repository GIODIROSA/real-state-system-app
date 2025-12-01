# Lib - Utilidades y Configuración

## Descripción

Carpeta que contiene utilidades, configuraciones y el cliente API de la aplicación.

## Estructura

lib/
├── api/
│ └── client.ts # Cliente HTTP para comunicación con la API
├── config.ts # Configuración global (URLs, constantes)
├── utils.ts # Funciones utilitarias (cn, formatDate)
└── README.md

## Archivos

### `config.ts`

Configuración centralizada de la aplicación:

- `API_BASE_URL` - URL base del servidor API
- `API_PATH` - Path de la API (ej: /api/skeleton)
- `API_URL` - URL completa de la API
- `APP_CONFIG` - Metadatos de la aplicación

### `api/client.ts`

Cliente HTTP tipado para consumir la API:

- Manejo automático de JSON
- Errores personalizados (`ApiClientError`)
- Métodos: `get`, `post`, `put`, `delete`

### `utils.ts`

Funciones utilitarias:

- `cn()` - Combina clases de Tailwind
- `formatDate()` - Formatea fechas

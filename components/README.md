# Componentes React

## Descripción

Componentes React reutilizables organizados por tipo y funcionalidad.

## Estructura

```
components/
├── ui/           # Componentes base de UI
│   ├── alert.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   ├── spinner.tsx
│   └── index.ts
├── users/        # Componentes específicos de usuarios
│   ├── user-table.tsx
│   ├── user-form.tsx
│   ├── delete-user-dialog.tsx
│   └── index.ts
└── shared/       # Componentes compartidos (layouts)
    └── header.tsx
```

## Categorías

### UI (`/ui`)

Componentes base reutilizables en toda la aplicación:

- **Button** - Botón con variantes (default, destructive, outline, etc.)
- **Input** - Campo de entrada con soporte para errores
- **Card** - Contenedor con header, content y footer
- **Modal** - Diálogo modal con backdrop
- **Alert** - Mensajes de alerta (success, error, warning)
- **Spinner** - Indicador de carga

### Users (`/users`)

Componentes específicos para gestión de usuarios:

- **UserTable** - Tabla de usuarios con acciones
- **UserForm** - Formulario crear/editar
- **DeleteUserDialog** - Confirmación de eliminación

### Shared (`/shared`)

Componentes de layout compartidos:

- **Header** - Cabecera de la aplicación

## Uso

```tsx
// Importar desde índice
import { Button, Card, Input } from '@/components/ui';
import { UserTable, UserForm } from '@/components/users';
```

# Services - Capa de Servicios

## Descripción

Los **Services** encapsulan la lógica de comunicación con la API. Actúan como intermediarios entre los componentes/páginas y el cliente HTTP.

## Responsabilidades

- Consumir endpoints de la API
- Transformar datos si es necesario
- Manejar la lógica de negocio del frontend
- **NO** manejar estado de UI
- **NO** contener lógica de presentación

## Estructura

```
services/
├── user.service.ts   # Servicio de usuarios
└── README.md
```

## Ejemplo de Uso

```typescript
import { userService } from '@/services/user.service';

// Obtener todos los usuarios
const users = await userService.getAll();

// Crear usuario
const newUser = await userService.create({
  email: 'user@example.com',
  name: 'John Doe',
});

// Actualizar usuario
const updated = await userService.update('user-id', { name: 'Jane' });

// Eliminar usuario
await userService.delete('user-id');
```

## Agregar Nuevo Servicio

1. Crear archivo `mi-recurso.service.ts`
2. Importar el cliente API
3. Definir endpoints
4. Exportar métodos tipados

```typescript
import { apiClient } from '@/lib/api/client';
import { ApiResponse, MiRecurso } from '@/types/mi-recurso.types';

const ENDPOINTS = {
  BASE: '/mi-recurso',
  BY_ID: (id: string) => `/mi-recurso/${id}`,
};

export const miRecursoService = {
  async getAll(): Promise<MiRecurso[]> {
    const response = await apiClient.get<ApiResponse<MiRecurso[]>>(
      ENDPOINTS.BASE
    );
    return response.data;
  },
  // ... más métodos
};
```

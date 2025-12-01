# Types - Tipos TypeScript

## Descripción

Definiciones de tipos e interfaces TypeScript sincronizadas con la API.

## Archivos

### `user.types.ts`

Tipos para el módulo de usuarios:

- **User** - DTO de respuesta de usuario
- **CreateUserDTO** - Datos para crear usuario
- **UpdateUserDTO** - Datos para actualizar usuario
- **ApiResponse<T>** - Respuesta estándar de la API
- **ApiError** - Formato de error de la API

## Sincronización con API

Los tipos deben coincidir con los DTOs del backend (`node-ts-api-skeleton`):

```typescript
// Frontend (types/user.types.ts)
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Backend (interfaces/user/user.types.ts)
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Nota:** Las fechas se reciben como `string` en el frontend (JSON serialization).

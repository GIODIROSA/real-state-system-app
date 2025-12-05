/**
 * @fileoverview Tipos e interfaces para el módulo de usuarios
 * Sincronizado con la API node-ts-api-skeleton
 */

/**
 * DTO de respuesta de usuario desde la API
 */
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDTO {
  email: string;
  name: string;
  password?: string; // Optional for updates, required for creation
}

/**
 * DTO para actualizar un usuario
 */
export interface UpdateUserDTO {
  email?: string;
  name?: string;
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
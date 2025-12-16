export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface UserChamber{
  id: number;
  name: string;
  region: string;
  location?:string;
}

/**
 * DTO de respuesta de usuario desde la API
 */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name?: string;
  phone_number?: string;
  account_status?: string; // ACTIVE, BLOCKED etc..
  roles: UserRole[];
  chambers?: UserChamber[];
  cameras?: UserChamber[]; // opcional
  role?: string; // ej: "Admin"
  permissions?: string[]; // ej: "[user:read]"
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

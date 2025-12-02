import { User } from './user.types';

/**
 * DTO para el formulario de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * DTO para el payload de 2FA
 */
export interface TwoFactorPayload {
  email: string;
  code: string;
}

/**
 * DTO para la respuesta de autenticación
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * DTO para el formulario de cambio de contraseña
 */
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

/**
 * DTO para el formulario de reseteo de contraseña
 */
export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}


/**
 * @fileoverview Servicio de usuarios
 * Consume los endpoints de usuarios de la API
 */

import { apiClient } from '@/lib/api/client';
import {
  ApiResponse,
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from '@/types/user.types';

/**
 * Endpoints de usuarios
 */
const ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_BY_EMAIL: (email: string) => `/users/email/${email}`,
};

/**
 * Servicio para gestión de usuarios
 */
export const userService = {
  /**
   * Obtiene todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(ENDPOINTS.USERS);
    return response.data;
  },

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      ENDPOINTS.USER_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Obtiene un usuario por email
   */
  async getByEmail(email: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      ENDPOINTS.USER_BY_EMAIL(email)
    );
    return response.data;
  },

  /**
   * Crea un nuevo usuario
   */
  async create(data: CreateUserDTO): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      ENDPOINTS.USERS,
      data
    );
    return response.data;
  },

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      ENDPOINTS.USER_BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina un usuario
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(ENDPOINTS.USER_BY_ID(id));
  },
};

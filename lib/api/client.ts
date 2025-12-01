/**
 * @fileoverview Cliente HTTP para comunicación con la API
 * Proporciona métodos tipados para realizar peticiones REST
 */

import { API_URL } from '@/lib/config';

/**
 * Error personalizado para errores de API
 */
export class ApiClientError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Opciones para las peticiones
 */
interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Cliente HTTP base para la API
 * Maneja automáticamente JSON y errores
 */
async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, headers, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(
        data.error?.message || data.message || 'Error en la petición',
        response.status,
        data.error?.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      'Error de conexión con el servidor',
      0,
      'NETWORK_ERROR'
    );
  }
}

/**
 * Cliente API con métodos HTTP
 */
export const apiClient = {
  /**
   * Realiza una petición GET
   */
  get: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * Realiza una petición POST
   */
  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  /**
   * Realiza una petición PUT
   */
  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  /**
   * Realiza una petición DELETE
   */
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;

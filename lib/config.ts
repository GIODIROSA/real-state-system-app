/**
 * @fileoverview Configuración global de la aplicación
 */

/**
 * URL base de la API
 * Configurable via variable de entorno NEXT_PUBLIC_API_URL
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Path base de la API (debe coincidir con API_PATH del backend)
 */
export const API_PATH = '/api/skeleton';

/**
 * URL completa de la API
 */
export const API_URL = `${API_BASE_URL}${API_PATH}`;

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  name: 'Next App Skeleton',
  version: '1.0.0',
  description: 'Frontend skeleton para consumir node-ts-api-skeleton',
};

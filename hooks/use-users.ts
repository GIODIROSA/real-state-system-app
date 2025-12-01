/**
 * @fileoverview Hook para gestión de usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 */

'use client';

import { ApiClientError } from '@/lib/api/client';
import { userService } from '@/services/user.service';
import { CreateUserDTO, UpdateUserDTO, User } from '@/types/user.types';
import { useCallback, useEffect, useState } from 'react';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isSubmitting: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserDTO) => Promise<boolean>;
  updateUser: (id: string, data: UpdateUserDTO) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  clearMessages: () => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Error al cargar usuarios';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (data: CreateUserDTO): Promise<boolean> => {
      try {
        setIsSubmitting(true);
        setError(null);
        await userService.create(data);
        setSuccess('Usuario creado exitosamente');
        await fetchUsers();
        return true;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : 'Error al crear usuario';
        setError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserDTO): Promise<boolean> => {
      try {
        setIsSubmitting(true);
        setError(null);
        await userService.update(id, data);
        setSuccess('Usuario actualizado exitosamente');
        await fetchUsers();
        return true;
      } catch (err) {
        const message =
          err instanceof ApiClientError ? err.message : 'Error al actualizar';
        setError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsSubmitting(true);
        setError(null);
        await userService.delete(id);
        setSuccess('Usuario eliminado exitosamente');
        await fetchUsers();
        return true;
      } catch (err) {
        const message =
          err instanceof ApiClientError ? err.message : 'Error al eliminar';
        setError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers]
  );

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    success,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearMessages,
  };
}

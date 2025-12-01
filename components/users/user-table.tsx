/**
 * @fileoverview Tabla de usuarios
 */

'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { User } from '@/types/user.types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  isLoading,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 opacity-50"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p>No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500">
              Creado
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-zinc-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete(user)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

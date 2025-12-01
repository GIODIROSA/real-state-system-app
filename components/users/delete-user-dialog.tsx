/**
 * @fileoverview Diálogo de confirmación para eliminar usuario
 */

'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { User } from '@/types/user.types';

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteUserDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Usuario">
      <div className="space-y-4">
        <p className="text-zinc-600 dark:text-zinc-400">
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {user.name}
          </span>
          ? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

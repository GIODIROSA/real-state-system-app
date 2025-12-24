"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoadingModal } from '@/components/ui/loading';

/**
 * @fileoverview Página principal de la aplicación.
 * Actúa como un enrutador de entrada, redirigiendo al usuario
 * al login o al dashboard según su estado de autenticación.
 */
export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Si el usuario está autenticado, redirigir al dashboard 
        router.push('/dashboard');
      } else {
        // Si no está autenticado, redirigir al login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Muestra una pantalla de carga mientras se verifica la sesión del usuario
  return (
    <div className="flex min-h-screen items-center justify-center">
     <LoadingModal text="Verificando sesión..." />
    </div>
  );
}


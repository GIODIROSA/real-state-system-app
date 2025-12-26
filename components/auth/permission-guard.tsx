"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingModal } from "@/components/ui/loading";
import { Button } from "@/components/ui";

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallbackUrl?: string;
}

export default function PermissionGuard({
  permission,
  children,
  fallbackUrl = "/dashboard",
}: PermissionGuardProps) {
  const { loading, user } = useAuth();
  const { can } = usePermissions();
  const router = useRouter();
  const hasPermission = can(permission as any);

  useEffect(() => {
    //3. Protección crítica
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission && fallbackUrl) {
      router.push(fallbackUrl);
    }
  }, [hasPermission, loading, user, router, fallbackUrl]);

  //5. Mientras carga
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingModal text="Verificando permisos..." />
      </div>
    );
  }

  // 6. Bloqueo Real
  if (!hasPermission) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
        <p className="text-gray-500">
          No tienes permisos para ver este módulo ({permission}).
        </p>
        <Button
          onClick={() => router.push(fallbackUrl)}
          variant="secondary"
          size="general"
          height="sm"
        >
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

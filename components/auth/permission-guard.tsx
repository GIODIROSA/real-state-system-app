"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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
  const { can } = usePermissions();
  const router = useRouter();
  const hasPermission = can(permission);

  useEffect(() => {
    if (!hasPermission && fallbackUrl) {
      router.push(fallbackUrl);
    }
  }, [hasPermission, router, fallbackUrl]);

  if (!hasPermission) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
        <p className="text-gray-500">
          No tienes permisos para ver este módulo ({permission}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

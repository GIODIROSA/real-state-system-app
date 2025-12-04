"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { APP_CONFIG } from "@/lib/config";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner"; // Asumiendo que tienes un componente Spinner
import { Button } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si la carga ha terminado y no hay usuario, redirigir al login.
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Mientras se carga la sesión, mostrar un spinner o pantalla de carga.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Si no hay usuario, no renderizar nada (la redirección se está procesando).
  if (!user) {
    return null;
  }

  // Si hay usuario, mostrar el layout del dashboard.
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">
     dashboard/layout.tsx
      </h1>
      <p className="mt-4 text-gray-600">
        Has iniciado sesión correctamente con seguridad 2FA.
      </p>

      {/* Aquí irían los indicadores de la HU-039 más adelante */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-900">
          <h3 className="font-bold text-gray-500">Proyectos Vigentes</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <h1>DASHBOARD ----- USTED ESTA AQUÍ</h1>
        {/* Más tarjetas... */}
        <span>prueba</span>
        <Button variant="outlineSecondary">loquesea</Button>
      </div>
    </div>
  );
}

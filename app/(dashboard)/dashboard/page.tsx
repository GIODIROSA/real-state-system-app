"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Home,
  Briefcase,
  Users,
  FileBarChart,
  ArrowRight,
} from "lucide-react"; // Iconos inmobiliarios

// Hooks propios
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";

// Componentes UI
import { LoadingModal } from "@/components/ui/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { can } = usePermissions(); 
  const router = useRouter();

  // Protección de ruta a nivel de cliente
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingModal />
      </div>
    );
  }

  if (!user) return null;

  // console.log("=== DEBUG DASHBOARD ===");
  // console.log("1. Usuario en memoria:", user);
  // console.log("2. Roles detectados:", user.roles);
  // console.log("3. ¿Tiene permiso 'user:read'?:", can("user:read"));
  // console.log("=======================");

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* 1. HEADER DE BIENVENIDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Panel General
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido,{" "}
            <span className="font-semibold text-blue-900">{user.name}</span>.
            Aquí tienes el resumen de tu sede regional.
          </p>
        </div>

        {/* Botón de acción rápida genérica (si aplica) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {/* Opción A: Mostrar solo el primer rol */}
            {user.roles?.[0]?.name || user.role || "Invitado"}
          </span>
        </div>
      </div>

     
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
       
      </div>

      <div className="space-y-4">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* {can("user:read") && (
            <Link href="/users" className="group">
              <Card className="h-full hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white group-hover:ring-1 group-hover:ring-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Users className="h-5 w-5" />
                    Gestión de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Crear, editar y administrar permisos de usuarios por sede
                    regional.
                  </p>
                  <Button variant="secondary" size="sm" className="w-full">
                    Administrar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )} */}

        

          {/* Tarjeta de relleno o información general visible para todos */}
          <Card className="bg-white opacity-70 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full py-8 text-center">
              <p className="text-sm text-gray-400">
                Más módulos próximamente...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

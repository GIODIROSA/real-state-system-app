"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Usamos el nativo de Next.js o tu componente UI
import { LogOut } from "lucide-react"; // Importamos icono para cerrar sesión
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/hooks/use-auth"; // Necesitamos esto para la acción de logout
import { MAIN_NAV } from "@/lib/config/navigation";
import { LogoSEI } from "@/components/ui";

export function Sidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();
  const { logout } = useAuth(); // Hook para cerrar sesión

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      
      {/* --- 1. ZONA DEL LOGO Y TÍTULO --- */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        {/* Logo CChC */}
        <div className="relative h-12 w-40 mb-6">
          <Image
            src="/images/logo-cchc.png"
            alt="Cámara Chilena de la Construcción"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Título del Software (Según la imagen) */}
        <div className="text-center space-y-1">
         <LogoSEI width={266} height={40} />
        </div>
      </div>

      {/* --- 2. NAVEGACIÓN PRINCIPAL --- */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {MAIN_NAV.map((item, index) => {
            // Filtrar por permisos
            if (item.permission && !can(item.permission)) {
              return null;
            }

            const isActive = pathname === item.href;

            return (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-all duration-200",
                    // Estilos Condicionales (Activo vs Inactivo)
                    isActive
                      ? "bg-[#004A98] text-white shadow-md" // Azul institucional CChC
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {/* Icono */}
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  {/* Texto */}
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- 3. FOOTER / CERRAR SESIÓN --- */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
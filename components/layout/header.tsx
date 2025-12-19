"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, ChevronDown, User as UserIcon } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  
  
  const initials = (firstName && lastName)
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : "U";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="absolute right-[24%] w-full max-w-[1108px] flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm z-20">
      
      {/* --- LADO IZQUIERDO: Saludo --- */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Hola, {firstName || "Usuario"}
        </h2>
        <p className="text-xs text-slate-500">
          {user?.role || "Panel de Gestión"}
        </p>
      </div>

      {/* --- LADO DERECHO: Menú de Usuario --- */}
      <div className="relative">
        
        {/* Botón del Perfil */}
        <button
          onClick={toggleMenu}
          className="flex items-center gap-3 rounded-full hover:bg-slate-50 p-1 pr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {/* Avatar Casero (Círculo) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
            {initials}
          </div>
          
          {/* Información (Visible en pantallas medianas+) */}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-slate-700">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-slate-400">
              {user?.email}
            </span>
          </div>

          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* --- EL DROPDOWN (Menú Desplegable) --- */}
        {isMenuOpen && (
          <>
            {/* 1. Fondo invisible para detectar clic fuera y cerrar */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)} 
            />

            {/* 2. El Menú Flotante */}
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-100">
              <div className="py-1">
                {/* Encabezado del menú (Móvil) */}
                <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                  <p className="text-sm font-medium text-slate-900">{firstName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                
                {/* Opción: Perfil (Ejemplo) */}
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                  Mi Perfil
                </button>

                {/* Opción: Cerrar Sesión */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
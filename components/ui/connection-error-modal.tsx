"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui"; 

interface ConnectionErrorModalProps {
  onRetry: () => void;
}

export function ConnectionErrorModal({ onRetry }: ConnectionErrorModalProps) {
  return (
    // 1. OVERLAY: Fondo oscuro que bloquea la pantalla
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-50 backdrop-blur-[2px] p-4 animate-in fade-in">


      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[952px] p-10 flex flex-col items-center text-center gap-4">
        
        {/* ÍCONO ROJO */}
        <div className="mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <TriangleAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* TÍTULO */}
        <h2 className="text-[40px] font-bold font-cchc text-slate-700 mb-4">
          No pudimos establecer conexión
        </h2>

        {/* DESCRIPCIÓN */}
        <p className="text-gray-500 mb-8 leading-relaxed font-body max-w-[550px]">
          Puede ser un problema con tu red o un error temporal en nuestra plataforma. 
          Por favor, intenta nuevamente en unos momentos.
        </p>

        {/* BOTÓN */}
        <Button 
          onClick={onRetry}
          variant="secondary"
          size="general"
          height="sm"
        >
          Regresar al login
        </Button>

      </div>
    </div>
  );
}
"use client";

import { cn } from "@/lib/utils";

interface LoadingModalProps {
  className?: string;
  text?: string;
}

export function LoadingModal({ className, text = "Por favor espera un momento" }: LoadingModalProps) {
  return (
    // 1. OVERLAY: Cubre toda la pantalla (z-50 para estar encima de todo)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-50 backdrop-blur-[2px]">
      
      {/* 2. CARD BLANCA: Diseño limpio y redondeado */}
      <div 
        className={cn(
          "flex flex-col items-center justify-center rounded-[20px] bg-white px-16 py-12 shadow-xl", 
          "w-[90%] max-w-[600px] min-h-[250px]", 
          className
        )}
      >
        {/* TEXTO: Tipografía Serif/Sans elegante y color oscuro */}
        <h2 className="mb-8 text-xl font-semibold font-body text-slate-700 text-center tracking-tight py-5">
          {text}
        </h2>

        {/* 3. PUNTOS ANIMADOS */}
        <div className="flex items-center gap-3">
          {/* Cada punto tiene un retraso (delay) diferente para crear la ola */}
          <div className="h-4 w-4 rounded-full bg-slate-200 animate-wave" style={{ animationDelay: "0ms" }}></div>
          <div className="h-4 w-4 rounded-full bg-slate-200 animate-wave" style={{ animationDelay: "150ms" }}></div>
          <div className="h-4 w-4 rounded-full bg-slate-200 animate-wave" style={{ animationDelay: "300ms" }}></div>
          <div className="h-4 w-4 rounded-full bg-slate-200 animate-wave" style={{ animationDelay: "450ms" }}></div>
        </div>
      </div>

      {/* ESTILOS CSS LOCALES PARA LA ANIMACIÓN */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px); /* Sube 10px */
          }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
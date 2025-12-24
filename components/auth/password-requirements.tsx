"use client";

import { Check, X, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirementsProps {
  password?: string;
}

export function PasswordRequirements({ password = "" }: PasswordRequirementsProps) {
  // Definimos las reglas según tu solicitud
  const requirements = [
    {
      id: 1,
      label: "Mínimo 8 caracteres",
      regex: /.{8,}/,
    },
    {
      id: 2,
      label: "Al menos una letra mayúscula",
      regex: /[A-Z]/,
    },
    {
      id: 3,
      label: "Al menos una letra minúscula",
      regex: /[a-z]/,
    },
    {
      id: 4,
      label: "Un número o carácter especial",
      regex: /[0-9!@#$%^&*(),.?":{}|<>]/,
    },
  ];

  return (
    <div className="space-y-2 rounded-lg bg-gray-50 p-3 border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 mb-2 font-body">
        La contraseña debe contener:
      </p>
      <ul className="space-y-1">
        {requirements.map((req) => {
          // Lógica de Estado
          const isEmpty = password.length === 0;
          const isMet = req.regex.test(password);

          // Determinar color e ícono
          let icon = <Circle className="h-3.5 w-3.5" />; 
          let colorClass = "text-gray-400 font-body";

          if (!isEmpty) {
            if (isMet) {
              // Cumple (Verde)
              icon = <Check className="h-3.5 w-3.5" />;
              colorClass = "text-green-600 font-body";
            } else {
              // No cumple (Rojo)
              icon = <X className="h-3.5 w-3.5" />;
              colorClass = "text-red-500 font-body";
            }
          }

          return (
            <li
              key={req.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors duration-200",
                colorClass
              )}
            >
              <div className="shrink-0">{icon}</div>
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
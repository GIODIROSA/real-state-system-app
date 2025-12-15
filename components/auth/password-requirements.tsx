import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirementsProps {
  password?: string;
}

export function PasswordRequirements({ password = "" }: PasswordRequirementsProps) {
  // Definimos las reglas con sus validaciones
  const requirements = [
    { label: "Mínimo 8 caracteres", pass: password.length >= 8 },
    { label: "Al menos una mayúscula", pass: /[A-Z]/.test(password) },
    { label: "Al menos una minúscula", pass: /[a-z]/.test(password) },
    { label: "Al menos un número", pass: /[0-9]/.test(password) },
    { label: "Al menos un carácter especial", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="rounded-lg bg-gray-50 p-4 space-y-3 border border-gray-100">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Requisitos de seguridad:
      </p>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-sm transition-colors duration-200">
            <div className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border",
              req.pass 
                ? "border-green-500 bg-green-500 text-white" 
                : "border-gray-300 bg-transparent text-transparent"
            )}>
              <Check className="h-3 w-3" />
            </div>
            <span className={cn(
              req.pass ? "text-green-700 font-medium" : "text-gray-500"
            )}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
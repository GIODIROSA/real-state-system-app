"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

// Requisitos de la contraseña
const requirements = [
  { id: "length", text: "8 caracteres mínimo", regex: /.{8,}/ },
  { id: "uppercase", text: "Uso de mayúscula", regex: /[A-Z]/ },
  { id: "lowercase", text: "Uso de minúscula", regex: /[a-z]/ },
  { id: "special", text: "Uso de caracteres especiales", regex: /[^A-Za-z0-9]/ },
];

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  return (
    <ul className="space-y-1 text-sm">
      {requirements.map((req) => {
        const isValid = req.regex.test(password);
        const color = isValid ? "text-green-600" : "text-gray-500";
        const Icon = isValid ? CheckCircle2 : XCircle;

        return (
          <li key={req.id} className={`flex items-center gap-2 ${color}`}>
            <Icon size={16} />
            <span>{req.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

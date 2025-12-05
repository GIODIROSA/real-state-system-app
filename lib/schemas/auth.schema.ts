import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  
  // Políticas de seguridad modernas
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener una mayúscula")
    .regex(/[a-z]/, "Debe contener una minúscula")
    .regex(/[0-9]/, "Debe contener un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener un carácter especial (@$!%*?&)"),
    
  rememberDevice: z.boolean().optional(),
});

export const TwoFactorSchema = z.object({
  code: z.string().length(6, "El código debe ser de 6 dígitos"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type TwoFactorFormValues = z.infer<typeof TwoFactorSchema>;
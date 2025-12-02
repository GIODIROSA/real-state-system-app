import { z } from 'zod';

/**
 * HU-001: Política de contraseñas
 * Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.
 */
const passwordValidation = z.string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
  .regex(/[a-z]/, { message: 'Debe contener al menos una minúscula' })
  .regex(/[0-9]/, { message: 'Debe contener al menos un número' })
  .regex(/[^A-Za-z0-9]/, { message: 'Debe contener al menos un caracter especial' });

/**
 * Esquema para el formulario de Login (Paso 1)
 */
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }), // La validación completa se hace en el backend
  rememberDevice: z.boolean().optional(),
});

/**
 * Esquema para el formulario de Doble Factor (Paso 2)
 */
export const TwoFactorSchema = z.object({
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos' }),
});

/**
 * Esquema para el formulario de "Olvidé mi contraseña"
 */
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido para recuperar tu cuenta' }),
});

/**
 * Esquema para el formulario de "Restablecer Contraseña"
 */
export const ResetPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: passwordValidation,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'], // Error se mostrará en el campo de confirmar contraseña
});

/**
 * Esquema para el formulario de creación de usuario por un administrador
 */
export const CreateUserSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido' }),
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  password: passwordValidation,
});


// Tipos inferidos de los esquemas para usarlos en los formularios
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type TwoFactorFormValues = z.infer<typeof TwoFactorSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
export type CreateUserFormValues = z.infer<typeof CreateUserSchema>;
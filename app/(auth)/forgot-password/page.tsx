
/**
 *  ¿Cuál es su propósito? Iniciar el proceso. Su única misión es permitir que un usuario, que ha olvidado su
     contraseña, se identifique con algo que solo él debería saber: su correo electrónico.
   * ¿Qué hace el usuario aquí? Simplemente introduce su dirección de correo y hace clic en "Enviar Enlace".
   * ¿Qué hace el sistema? En un escenario real, el backend recibiría este correo, generaría un "token" (un código
     secreto, único y de corta duración) y enviaría un email a esa dirección con un enlace especial, que se vería
     así: https://tuapp.com/reset-password?token=ABC123XYZ.
 */


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

import { ForgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      // En un futuro, esto llamaría a un servicio real.
      // await authService.forgotPassword(data.email); 
      console.log("Simulating forgot password for:", data.email);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      setSuccessMessage("Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en breve.");
    } catch (error) {
      // Aunque lo simulemos, preparamos el manejo de errores.
      setErrorMessage("No se pudo procesar la solicitud. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">¿Olvidaste tu Contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos un enlace de recuperación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage ? (
            <div className="text-center p-4 bg-green-50 text-green-800 rounded-md">
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("email")}
                    className="pl-10"
                    placeholder="tu.correo@ejemplo.com"
                    error={form.formState.errors.email?.message}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Enlace"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-900 hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


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
import { getErrorMessage } from "@/lib/utils/utils";
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
    
      // 1. Llamada al servicio
      await authService.forgotPassword(data.email)

      // 2. Mensaje de ÉXITO
      setSuccessMessage("Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en breve.");
      form.reset();

    } catch (error) {

      setErrorMessage(getErrorMessage(error));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-blue-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu correo institucional y te enviaremos las instrucciones.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {successMessage ? (
            // VISTA DE ÉXITO
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                <p className="font-semibold text-lg">¡Solicitud Enviada!</p>
                <p className="text-sm mt-2 text-green-700">{successMessage}</p>
              </div>
              <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                <Link href="/login">Volver al Login</Link>
              </Button>
            </div>
          ) : (
            // VISTA DEL FORMULARIO
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 flex items-center gap-2">
                   <span>⚠️</span> {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("email")}
                    className="pl-10"
                    placeholder="ejemplo@cchc.cl"
                    type="email"
                    disabled={loading} // Bloqueamos input mientras carga
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={loading}>
                {loading ? "Enviando solicitud..." : "Enviar Enlace"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-gray-500 hover:text-blue-900 hover:underline flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

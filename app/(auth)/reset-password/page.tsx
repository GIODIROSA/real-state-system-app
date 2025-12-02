
/**
 * ¿Cuál es su propósito? Completar el cambio de contraseña de forma segura. Esta página solo es útil si llegas a
     ella a través del enlace especial enviado al correo.
   * ¿Qué hace el usuario aquí? El usuario abre su correo, hace clic en el enlace y aterriza en esta página. Ya no
     necesita decir quién es, porque el token en la URL es su "permiso especial". Aquí, el sistema ya confía en que
     es el dueño de la cuenta y simplemente le pide que establezca su nueva contraseña (y la confirme).
   * ¿Qué hace el sistema? Al recibir la nueva contraseña, el sistema primero verifica que el token de la URL sea
     válido y no haya expirado. Si es válido, actualiza la contraseña en la base de datos e invalida el token para
     que no pueda ser usado de nuevo.
 * 
 */


"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";

import { ResetPasswordSchema, ResetPasswordFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { PasswordStrength } from "@/components/auth/PasswordStrength";

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Token de recuperación no encontrado o inválido.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // await authService.resetPassword({ token, newPassword: data.password });
      console.log("Simulating password reset for token:", token);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      setSuccessMessage("¡Tu contraseña ha sido actualizada con éxito! Ahora puedes iniciar sesión.");
      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 3000);

    } catch (error) {
      setErrorMessage("No se pudo restablecer la contraseña. El token puede ser inválido o haber expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Restablecer Contraseña</CardTitle>
          <CardDescription>
            Crea una nueva contraseña segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token || successMessage ? (
            <div className={`text-center p-4 rounded-md ${successMessage ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
              <p>{successMessage || errorMessage}</p>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("password")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                    error={form.formState.errors.password?.message}
                  />
                </div>
                <PasswordStrength password={passwordValue} />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-600 mt-2">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("confirmPassword")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                    error={form.formState.errors.confirmPassword?.message}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading || !token}>
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
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


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  )
}

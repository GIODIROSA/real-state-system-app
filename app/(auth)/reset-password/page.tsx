"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

import { ResetPasswordSchema, ResetPasswordFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Capturamos el token de la URL 
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Validamos que el token exista al cargar
  useEffect(() => {
    if (!token) {
      setErrorGlobal("Enlace inválido o expirado. No se encontró el token de seguridad.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return; // Doble check de seguridad

    setLoading(true);
    setErrorGlobal("");

    try {
      // 2. Llamamos al servicio con el token y la nueva clave
      await authService.resetPassword(token, data.password);
      
      setSuccess(true);
      // Opcional: Redirigir automáticamente después de unos segundos
      setTimeout(() => router.push("/login"), 3000);

    } catch (error) {
      setErrorGlobal(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Si no hay token, bloqueamos la vista o mostramos error
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md border-red-500 border-t-4">
          <CardHeader>
            <CardTitle className="text-red-600">Enlace Inválido</CardTitle>
            <CardDescription>
              El enlace que utilizaste no contiene un token de seguridad válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-900">
              <Link href="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-blue-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Nueva Contraseña
          </CardTitle>
          <CardDescription>
            Crea una contraseña segura para tu cuenta.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="text-center space-y-6 animate-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">¡Contraseña Actualizada!</h3>
                <p className="text-gray-500">
                  Tu contraseña ha sido cambiada exitosamente. Redirigiendo al login...
                </p>
              </div>
              <Button asChild className="w-full bg-blue-900">
                <Link href="/login">Ir al Login ahora</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {errorGlobal && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  ⚠️ {errorGlobal}
                </div>
              )}

              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...form.register("confirmPassword")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={loading}>
                {loading ? "Actualizando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
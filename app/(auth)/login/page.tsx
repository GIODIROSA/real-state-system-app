"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/utils/utils";
import { AxiosError } from "axios";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Hook para guardar estado global
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");

  // Configuración del formulario con Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", rememberDevice: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorGlobal("");

    try {
      // PASO A: Login (Autenticación)
      // Esto validará credenciales y el backend pondrá la Cookie HttpOnly
      const loginResponse = await authService.login(data);

      if (loginResponse.success) {
        // PASO B: Obtener Datos (Autorización)
        // Usamos el email que el usuario acaba de escribir para pedir sus roles
        const userWithRoles = await authService.getUserProfile(data.email);

        // PASO C: Guardar en el Hook (LocalStorage)
        // Guardamos el usuario con su Rol real ("Admin") en el estado global
        login(userWithRoles);

        // PASO D: Redirigir
        router.push("/dashboard");
      } else {
        setErrorGlobal(loginResponse.message || "Credenciales incorrectas");
      }
    } catch (error) {
      // ... manejo de errores (bloqueo 403, etc) ...
      if (error instanceof AxiosError && error.response?.status === 403) {
        setErrorGlobal("⛔ Cuenta bloqueada. Contacte al administrador.");
      } else {
        setErrorGlobal(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-900">
            Sistema Inmobiliario
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales institucionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorGlobal && (
            <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
              {errorGlobal}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="usuario@cchc.cl"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <Input {...form.register("password")} type="password" />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Checkbox HU-001 + Enlace HU-002 */}
            <div className="flex items-center justify-between">

              {/* Lado IZQUIERDO */}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register("rememberDevice")}
                  id="remember"
                  className="rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Recordar este dispositivo
                </label>
              </div>

                {/* Lado DERECHO */}

                <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-blue-900 hover:text-blue-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>

            </div>

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Autenticando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

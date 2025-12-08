"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Image } from "@/components/ui";
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
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Hook para guardar estado global
  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <section className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="relative flex w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        {/* IZQUIERDA IMAGEN */}
        <div className="relative w-full h-64 md:h-auto md:w-1/2 bg-gray-900">
          <Image
            src="/images/imagen-login.jpg"
            alt="Imagen de Edificio"
            fill
            variant="login"
          />
        </div>
        {/* DERECHA LOGIN */}

        <div className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:p-12 lgp-16">
          <div className="w-full mx-auto max-w-[340px] space-y-8">
            <div className="text-center space-y-6">
              {/* ENCABEZADO LOGO */}

              <div className="relative mx-auto h-16 w-48">
                <Image
                  src="/images/logo-cchc.png"
                  alt="logo cchc"
                  fill
                  className="object-contain"
                />
              </div>

              {/* TITULO ENCABEZADO */}

              <div className="space-y-1">
                <p className="text-xs font-body font-semibold tracking-[0.2em] text-gray-500 uppercase">
                  SOFTWARE DE
                </p>
                <h1 className="text-2xl font-body font-bold text-slate-800 md:text-[28px] leading-tight">
                  ENCUESTA INMOBILIARIA
                </h1>
              </div>
            </div>

            {/* ERROR ALERT */}
            {errorGlobal && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
                {errorGlobal}
              </div>
            )}

            {/* FORMULARIO */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-body text-gray-700 ml-1">
                    Correo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Mail className="h-5 w-5" />
                    </div>

                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="Ingresa tu correo"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500 ml-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-body text-gray-600 ml-1">
                    Clave
                  </label>
                  <Input
                    {...form.register("password")}
                    type="password"
                    placeholder="Ingresa tu clave"
                    className="h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-all rounded-lg"
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-500 ml-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <input
                  type="checkbox"
                  {...form.register("rememberDevice")}
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-500 cursor-pointer select-none"
                >
                  Recordar mis datos
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outlinePrimary"
                  size="default"
                  className="w-full text-blue-800 border-blue-800 hover:bg-blue-50 text-sm font-semibold rounded-lg h-12"
                  asChild
                >
                  <Link href="/forgot-password">Recuperar mi clave</Link>
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  className="w-full bg-[#EBF5FF] text-[#0056b3] hover:bg-blue-100 border-none font-bold text-sm rounded-lg h-12"
                  disabled={loading}
                >
                  {loading ? "..." : "Ingresar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

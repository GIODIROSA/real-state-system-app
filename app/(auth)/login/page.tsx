"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Image } from "@/components/ui";
import { StatusAlert } from "@/components/ui";
import { BackendErrorResponse } from "@/types/auth.types";
import { LogoSEI } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/utils/utils";
import { AxiosError } from "axios";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Hook para guardar estado global
  const [loading, setLoading] = useState(false);

  // CONTROLA LA ALERTA Y EL BLOQUEO
  const [alertState, setAlertState] = useState<{
    type: "warning" | "error";
    message: string;
    isBlocked: boolean;
  } | null>(null);

  const [errorGlobal, setErrorGlobal] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Configuración del formulario con Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", rememberDevice: false },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      // limpiamos si No está bloqueado permanentemente
      if (alertState && !alertState.isBlocked) {
        setAlertState(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, alertState]);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorGlobal("");
    setAlertState(null); //limpiamos alertas previas

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
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data as BackendErrorResponse;

        // CASO 1: CUENTA BLOQUEADA (403)
        if (status === 403) {
          setAlertState({
            type: "error", // Rojo
            message:
              "Tu cuenta ha sido bloqueada. Un administrador revisará tu caso y te notificaremos cuando se resuelva la situación.",
            isBlocked: true, // Bloquea inputs y botón recuperar
          });
        }
        // CASO 2: CREDENCIALES INVÁLIDAS (401)
        else if (status === 401 && errorData.errors) {
          const { remainingAttempts } = errorData.errors;

          let msg =
            "Usuario o contraseña incorrectos. Si fallas nuevamente tu cuenta será bloqueada por seguridad.";
          if (remainingAttempts > 0) {
            msg += ` Dispones de ${remainingAttempts} ${
              remainingAttempts === 1 ? "intento más" : "intentos más"
            } antes del bloqueo de tu cuenta.`;
          }

          setAlertState({
            type: "warning", // Amarillo
            message: msg,
            isBlocked: false,
          });
        }
        // CASO 3: OTROS ERRORES
        else {
          setAlertState({
            type: "error",
            message: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
            isBlocked: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-brand-50 p-4">
      <div className="relative flex gap-4 w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        {/* IZQUIERDA IMAGEN */}
        <div className="relative hidden w-full h-64 md:h-auto md:block bg-gray-900">
          <Image
            src="/images/imagen-login.jpg"
            alt="Imagen de Edificio"
            fill
            variant="login"
          />
        </div>
        {/* DERECHA LOGIN */}

        <div className="flex w-full flex-col justify-center bg-white md:w-1/2 md:p-8">
          <div className="w-full mx-auto flex flex-col gap-6 space-y-8">
            <div className="text-center space-y-6 flex flex-col items-center gap-[32px]">
              {/* ENCABEZADO LOGO */}

              <div className="relative mx-auto h-16 w-48">
                <Image
                  src="/images/logo-cchc.png"
                  alt="logo cchc"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* FORMULARIO */}
            <section className="flex justify-center">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full max-w-[396px] mx-auto"
              >
                {/* TITULO ENCABEZADO */}
                <div className="flex justify-center flex-col items-center w-full">
                  <LogoSEI />
                </div>
                {/* FINAL TITULO ENCABEZADO */}

                <section className=" flex justify-center flex-col gap-4 px-4">
                  <div className="flex justify-between flex-col gap-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">
                        Correo
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Mail className="h-4 w-4" />
                        </div>

                        <Input
                          {...form.register("email")}
                          type="email"
                          placeholder="Ingresa tu correo"
                          variant="login"
                          iconPadding="left"
                          disabled={alertState?.isBlocked}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-right font-body text-xs">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-600 ml-1">
                        Clave
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Lock className="h-4 w-4" />
                        </div>

                        <Input
                          {...form.register("password")}
                          type="password"
                          placeholder="Ingresa tu clave"
                          variant="login"
                          iconPadding="left"
                          disabled={alertState?.isBlocked}
                        />

                        {/* BOTÓN OJO */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                          disabled={alertState?.isBlocked}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {form.formState.errors.password && (
                        <p className="text-red-500 text-right font-body text-xs">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RECORDAR */}
                  <div className="flex items-center gap-1.5 space-x-2 ml-1">
                    <input
                      type="checkbox"
                      {...form.register("rememberDevice")}
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-body text-gray-500 cursor-pointer select-none"
                    >
                      Recordar mis datos
                    </label>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <Button
                      type="button"
                      variant="outlineSecondary"
                      size="general"
                      asChild
                    >
                      <Link href="/forgot-password">Recuperar mi clave</Link>
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="general"
                      height="sm"
                      disabled={loading || !form.formState.isValid}
                    >
                      {loading ? "..." : "Ingresar"}
                    </Button>
                  </div>
                </section>
              </form>
            </section>

            {/* ERROR ALERT */}
            {alertState && (
              <StatusAlert variant={alertState.type} size="sm" height="sm">
                {alertState.message}
              </StatusAlert>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

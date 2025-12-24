"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Necesario para el schema local del 2FA
import { useRouter } from "next/navigation";
import { LoginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button, Input, Image, StatusAlert, LogoSEI } from "@/components/ui";
import { BackendErrorResponse, MfaTokenData } from "@/types/auth.types";
import { useAuth } from "@/hooks/use-auth";
import { AxiosError } from "axios";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useGlobalError } from "@/context/global-error-context";

// --- SCHEMA LOCAL PARA 2FA ---
const TwoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
});
type TwoFactorFormValues = z.infer<typeof TwoFactorSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, verify2FA } = useAuth(); // Usamos las funciones del nuevo Hook
  const [loading, setLoading] = useState(false);
  const { triggerGlobalError } = useGlobalError();

  // --- ESTADOS NUEVOS PARA 2FA ---
  const [step, setStep] = useState<"CREDENTIALS" | "MFA">("CREDENTIALS");
  const [mfaData, setMfaData] = useState<MfaTokenData | null>(null);
  const [tempEmail, setTempEmail] = useState<string>("");

  // CONTROLA LA ALERTA Y EL BLOQUEO
  const [alertState, setAlertState] = useState<{
    type: "warning" | "error";
    message: string;
    isBlocked: boolean;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // 1. FORMULARIO CREDENCIALES
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", rememberDevice: false },
    mode: "onChange",
  });

  // 2. FORMULARIO CÓDIGO 2FA
  const otpForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: { code: "" },
  });

  // Limpiar alertas al escribir
  useEffect(() => {
    const subscription = form.watch(() => {
      if (alertState && !alertState.isBlocked) {
        setAlertState(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, alertState]);

  // --- HANDLER PASO 1: LOGIN ---
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setAlertState(null);

    try {
      const response = await login(data);

      if (response.requires_mfa) {
        setTempEmail(data.email);
        // CASO A: REQUIERE 2FA
        setMfaData(response.mfa_token);
        setStep("MFA");
      } else {
        // CASO B: LOGIN DIRECTO

        if (response.user) {
          router.push("/dashboard");
        } else {
          const userWithRoles = await authService.getUserProfile(data.email);
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        triggerGlobalError();
        return;
      }
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER PASO 2: VERIFICAR CÓDIGO ---
  const onOtpSubmit = async (data: TwoFactorFormValues) => {
    setLoading(true);
    setAlertState(null);

    console.log("Intentando verificar 2FA con:", {
      code: data.code,
      email: tempEmail,
    });

    try {

      if (!tempEmail) {
         throw new Error("No se ha detectado el email de sesión. Intenta ingresar nuevamente.");
      }
      await verify2FA(data.code, tempEmail);
      router.push("/dashboard");
    } catch (error) {
      console.error("Fallo 2FA:", error);
      setAlertState({
        type: "error",
        message: "El código ingresado es incorrecto o ha expirado.",
        isBlocked: false,
      });
      otpForm.setValue("code", "");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de errores extraída para reutilizar
  const handleLoginError = (error: any) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorData = error.response?.data as BackendErrorResponse;

      // CASO 1: CUENTA BLOQUEADA (403)
      if (status === 403) {
        let msg =
          "Usuario o contraseña incorrecta. Favor contactar al Administrador.";
        setAlertState({
          type: "error",
          message: msg,
          isBlocked: true,
        });
      }
      // CASO 2: CREDENCIALES INVÁLIDAS (401)
      else if (status === 401 && errorData.errors) {
        // const { remainingAttempts } = errorData.errors;
        // let msg =
        //   "Usuario o contraseña incorrectos. Si fallas nuevamente tu cuenta será bloqueada por seguridad.";
        // if (remainingAttempts > 0) {
        //   msg += ` Dispones de ${remainingAttempts} ${
        //     remainingAttempts === 1 ? "intento más" : "intentos más"
        //   } antes del bloqueo de tu cuenta.`;
        // }
        let msg =
          "Usuario o contraseña incorrecta. Favor contactar al Administrador.";
        setAlertState({
          type: "warning",
          message: msg,
          isBlocked: false,
        });
      }
      // CASO 3: OTROS ERRORES
      else {
        setAlertState({
          type: "error",
          message: errorData?.message || "Ha ocurrido un error inesperado.",
          isBlocked: false,
        });
      }
    } else {
      setAlertState({
        type: "error",
        message: "Error de conexión.",
        isBlocked: false,
      });
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-brand-50 p-4">
      <div className="relative flex gap-4 w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        {/* IZQUIERDA IMAGEN */}
        <div className="relative hidden w-full h-64 md:h-auto md:block bg-gray-900 max-w-[476px]">
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

            {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
            <section className="flex justify-center flex-col items-center w-full max-w-[396px] mx-auto animate-in fade-in duration-300">
              {/* TITULO DINÁMICO */}
              <div className="flex justify-center flex-col items-center w-full mb-6">
                {step === "CREDENTIALS" ? (
                  <LogoSEI />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="bg-green-100 p-3 rounded-full inline-flex">
                      <ShieldCheck className="h-8 w-8 text-green-700" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Verificación 2FA
                    </h2>
                    <p className="text-sm text-gray-500">
                      Ingresa el código enviado a tu correo
                    </p>
                  </div>
                )}
              </div>

              {/* === FORMULARIO 1: CREDENCIALES === */}
              {step === "CREDENTIALS" && (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full pt-[30px]"
                >
                  <section className="flex justify-center flex-col gap-4 px-4 ">
                    {/* INPUT EMAIL */}
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

                    {/* INPUT PASSWORD */}
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu clave"
                          variant="login"
                          iconPadding="left"
                          disabled={alertState?.isBlocked}
                        />
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

                    {/* RECORDAR DATOS */}
                    {/* <div className="flex items-center gap-1.5 space-x-2 ml-1">
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
                    </div> */}

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex flex-col-reverse xl:flex-row xl:justify-between xl:items-center gap-4 pt-2">
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
                        disabled={
                          loading ||
                          !form.formState.isValid ||
                          !!alertState?.isBlocked
                        }
                      >
                        {loading ? "..." : "Ingresar"}
                      </Button>
                    </div>
                  </section>
                </form>
              )}

              {/* === FORMULARIO 2: MFA === */}
              {step === "MFA" && (
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="flex flex-col gap-6 w-full animate-in slide-in-from-right duration-300"
                >
                  <section className="flex justify-center flex-col gap-4 px-4">
                    <div className="space-y-4">
                      {/* INPUT CÓDIGO */}
                      <div className="flex justify-center">
                        <Input
                          {...otpForm.register("code")}
                          placeholder="000000"
                          variant="login"
                          className="text-center text-2xl tracking-[0.5em] font-bold h-14 w-full border-2 focus:border-green-500"
                          maxLength={6}
                          autoFocus
                          autoComplete="one-time-code"
                        />
                      </div>

                      {otpForm.formState.errors.code && (
                        <p className="text-red-500 text-center font-body text-xs">
                          {otpForm.formState.errors.code.message}
                        </p>
                      )}

                      {/* INFO EXPIRACIÓN */}
                      {mfaData && (
                        <p className="text-xs text-center text-gray-400">
                          El código expira a las{" "}
                          {new Date(mfaData.expires_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {/* BOTONES MFA */}
                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="general"
                        height="sm"
                        className="w-full"
                        disabled={loading || !otpForm.formState.isValid}
                      >
                        {loading ? "Verificando..." : "Verificar Código"}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep("CREDENTIALS");
                          setAlertState(null);
                          otpForm.reset();
                        }}
                        className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" /> Volver al login
                      </button>
                    </div>
                  </section>
                </form>
              )}
            </section>

            {/* ERROR ALERT */}
            {alertState && (
              <div className="px-4 max-w-[396px] mx-auto w-full">
                <StatusAlert variant={alertState.type} size="sm" height="sm">
                  {alertState.message}
                </StatusAlert>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

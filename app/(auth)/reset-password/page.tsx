"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

// Imports internos
import { ResetPasswordSchema, ResetPasswordFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/utils/utils";
import { Button, Input, Image, StatusAlert, LogoSEI } from "@/components/ui";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import loginBg from "@/assets/images/imagen-login.jpg";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");
  
  // Estados de visibilidad
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  // OBSERVAR CAMBIOS PARA EL CHECKLIST
  const passwordValue = form.watch("password");

  // Validar token al montar
  useEffect(() => {
    if (!token) {
      setErrorGlobal("Enlace inválido o expirado. No se encontró el token de seguridad.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    setLoading(true);
    setErrorGlobal("");
    
    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
      // Redirección automática
      setTimeout(() => router.push("/login"), 3500);
    } catch (error) {
      setErrorGlobal(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Si no hay token, mostramos la pantalla de error pero DENTRO del diseño bonito
  const isTokenMissing = !token && !!errorGlobal;

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-brand-50 p-4">
      <div className="relative flex w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        
        {/* --- IZQUIERDA: IMAGEN --- */}
        <div className="relative hidden w-full h-64 md:h-auto md:w-1/2 md:block bg-gray-900">
          <Image
            src={loginBg}
            alt="Edificio Corporativo"
            fill
            variant="login"
            className="object-cover opacity-90"
          />
        </div>

        {/* --- DERECHA: CONTENIDO --- */}
        <div className="flex w-full flex-col justify-center bg-white p-6 md:w-1/2 md:p-12 overflow-y-auto">
          <div className="w-full mx-auto flex flex-col gap-4">
            
            {/* ENCABEZADO */}
            <div className="text-center space-y-4 flex flex-col items-center gap-4">
              <div className="relative mx-auto h-14 w-40">
                <Image src="/images/logo-cchc.png" alt="logo cchc" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <LogoSEI />
             
              </div>
              <div className="self-start">
                   {!success && !isTokenMissing && (
                  <p className="text-sm font-body text-gray-500 max-w-xs mx-auto">
                    Crea una nueva contraseña segura para tu cuenta.
                  </p>
                )}
              </div>
            </div>

            {/* CASO 1: ERROR DE TOKEN (Enlace roto) */}
            {isTokenMissing && (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <StatusAlert variant="error" className="w-full">
                  <div className="flex flex-col gap-1 text-center">
                     <span className="font-bold flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Enlace Inválido
                     </span>
                     <span>{errorGlobal}</span>
                  </div>
                </StatusAlert>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/forgot-password">Solicitar nuevo enlace</Link>
                </Button>
              </div>
            )}

            {/* CASO 2: ÉXITO */}
            {success && (
              <StatusAlert variant="success" className="animate-in zoom-in duration-300">
                <div className="flex flex-col gap-1 text-center">
                  <span className="font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" /> ¡Contraseña Actualizada!
                  </span>
                  <span className="text-xs">Redirigiendo al dashboard...</span>
                </div>
              </StatusAlert>
            )}

            {/* CASO 3: FORMULARIO */}
            {!success && !isTokenMissing && (
              <section className="flex justify-center">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full max-w-[396px] mx-auto animate-in fade-in duration-500"
                >
                   {/* Alerta de Error API */}
                   {errorGlobal && (
                      <StatusAlert variant="error" size="sm">
                        {errorGlobal}
                      </StatusAlert>
                   )}

                  <div className="space-y-4">
                    
                    {/* 1. NUEVA CONTRASEÑA */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">Nueva Contraseña</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          {...form.register("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          variant="login"
                          iconPadding="left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {/* === CHECKLIST DE REQUISITOS === */}
                      <div className="py-4">
                        <PasswordRequirements password={passwordValue} />
                      </div>

                    </div>

                    {/* 2. CONFIRMAR CONTRASEÑA */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">Confirmar Contraseña</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <Input
                          {...form.register("confirmPassword")}
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          variant="login"
                          iconPadding="left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-right font-body text-xs">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* BOTÓN */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      size="general"
                      height="sm"
                      className="w-full"
                      disabled={loading || !form.formState.isValid}
                    >
                      {loading ? "Actualizando..." : "Cambiar Contraseña"}
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
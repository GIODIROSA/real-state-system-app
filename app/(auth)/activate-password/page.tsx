"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Lock, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";


import { ActivateAccountSchema, ActivateAccountFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Button, Input, Image, StatusAlert } from "@/components/ui"; 
import { PasswordRequirements } from "@/components/auth/password-requirements"; 
import { getErrorMessage } from "@/lib/utils/utils"; 
import { LogoSEI } from "@/components/ui";

export default function ActivateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  
  // CORRECCIÓN 1: Unificamos el nombre a 'errorGlobal'
  const [errorGlobal, setErrorGlobal] = useState("");
  
  const [success, setSuccess] = useState(false);

  // Estados para visibilidad
  const [showTemp, setShowTemp] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(ActivateAccountSchema),
    defaultValues: { temporalPassword: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    if (!email) {
      setErrorGlobal("Enlace inválido. Falta el correo electrónico.");
    }
  }, [email]);

  const onSubmit = async (data: ActivateAccountFormValues) => {
    if (!email) return;
    setLoading(true);
    setErrorGlobal("");

    try {
      await authService.activateAccount(email, data.temporalPassword, data.password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3500);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setErrorGlobal("La contraseña temporal es incorrecta.");
      } else {
        // CORRECCIÓN 3: Uso seguro de getErrorMessage
        setErrorGlobal(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email && errorGlobal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
        <StatusAlert variant="error" title="Error de Enlace">
          {errorGlobal}
        </StatusAlert>
      </div>
    );
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-brand-50 p-4">
      <div className="relative flex w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        
        {/* IZQUIERDA */}
        <div className="relative w-full h-64 md:h-auto md:w-1/2 bg-gray-900">
          <Image
            src="/images/imagen-login.jpg"
            alt="Edificio Corporativo"
            fill
            variant="login"
          />
        </div>

        {/* DERECHA */}
        <div className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:p-12 lgp-16 overflow-y-auto">
          <div className="w-full mx-auto flex flex-col gap-[24px] space-y-4">
            
            {/* ENCABEZADO */}
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="relative mx-auto h-14 w-40">
                <Image src="/images/logo-cchc.png" alt="logo cchc" fill className="object-contain" />
              </div>
              <div className="space-y-1">
                <LogoSEI />
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Hola <span className="font-semibold text-blue-900">{email}</span>, configura tu acceso definitivo.
                </p>
              </div>
            </div>

            {/* ALERTAS */}
            {success ? (
              <StatusAlert variant="success" className="animate-in zoom-in">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">¡Todo listo!</span>
                  <span>Contraseña actualizada. Redirigiendo al login...</span>
                </div>
              </StatusAlert>
            ) : (
              errorGlobal && (
                <StatusAlert variant="error">
                  {errorGlobal}
                </StatusAlert>
              )
            )}

            {/* FORMULARIO */}
            {!success && (
              <section className="flex justify-center">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full max-w-[396px] mx-auto"
                >
                  <div className="space-y-4">
                    
                    {/* TEMPORAL */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">Clave Temporal</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><KeyRound className="h-4 w-4" /></div>
                        <Input
                          {...form.register("temporalPassword")}
                          type={showTemp ? "text" : "password"}
                          placeholder="Recibida por correo"
                          variant="login"
                          iconPadding="left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTemp(!showTemp)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showTemp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form.formState.errors.temporalPassword && <p className="text-red-500 text-right font-body text-xs">{form.formState.errors.temporalPassword.message}</p>}
                    </div>

                    {/* NUEVA */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">Nueva Clave</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Lock className="h-4 w-4" /></div>
                        <Input
                          {...form.register("password")}
                          type={showNew ? "text" : "password"}
                          placeholder="Crea tu clave segura"
                          variant="login"
                          iconPadding="left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* CHECKLIST */}
                    <PasswordRequirements password={passwordValue} />

                    {/* CONFIRMAR */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">Confirmar Clave</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><CheckCircle className="h-4 w-4" /></div>
                        <Input
                          {...form.register("confirmPassword")}
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repite la nueva clave"
                          variant="login"
                          iconPadding="left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form.formState.errors.confirmPassword && <p className="text-red-500 text-right font-body text-xs">{form.formState.errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  {/* BOTÓN */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      size="general"
                      height="sm"
                      className="w-full bg-[#EBF5FF] text-[#0056b3] hover:bg-blue-100 border-none font-bold text-sm rounded-lg h-12"
                      disabled={loading || !form.formState.isValid}
                    >
                      {loading ? "Activando..." : "Activar Cuenta"}
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


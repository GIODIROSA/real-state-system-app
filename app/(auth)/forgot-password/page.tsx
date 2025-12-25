"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

// Imports de lógica y UI
import { ForgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/utils/utils";
import { Button, Input, Image, StatusAlert, LogoSEI } from "@/components/ui";
import loginBg from "@/assets/images/imagen-login.jpg";

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
      await authService.forgotPassword(data.email);

      // 2. Mensaje de ÉXITO
      setSuccessMessage(
        "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en breve."
      );
      form.reset();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-brand-50 p-4">
      <div className="relative flex gap-4 w-full max-w-[952px] flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl md:h-[793px] md:flex-row">
        
        {/* --- IZQUIERDA: IMAGEN (Igual que Login) --- */}
        <div className="relative hidden w-full h-64 md:h-auto md:block bg-gray-900">
          <Image
            src={loginBg}
            alt="Imagen de Edificio"
            fill
            variant="login"
            className="object-cover opacity-80"
          />
        </div>

        {/* --- DERECHA: FORMULARIO --- */}
        <div className="flex w-full flex-col justify-center bg-white md:w-1/2 md:p-8">
          <div className="w-full mx-auto flex flex-col gap-6 space-y-8">
            
            {/* ENCABEZADO Y LOGO */}
            <div className="text-center space-y-6 flex flex-col items-center gap-[32px]">
              <div className="relative mx-auto h-16 w-48">
                <Image
                  src="/images/logo-cchc.png"
                  alt="logo cchc"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <section className="flex justify-center flex-col items-center w-full max-w-[396px] mx-auto animate-in fade-in duration-300">
              
              {/* TÍTULO */}
              <div className="flex justify-center flex-col items-center w-full mb-6 text-center">
                {!successMessage ? (
                   <>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h2>
                    <p className="text-sm text-gray-500 px-4">
                      Ingresa tu correo institucional y te enviaremos las instrucciones.
                    </p>
                   </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-700" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">¡Solicitud Enviada!</h2>
                  </div>
                )}
              </div>

              {/* LÓGICA CONDICIONAL: ÉXITO vs FORMULARIO */}
              {successMessage ? (
                // --- VISTA DE ÉXITO ---
                <div className="w-full space-y-6 animate-in slide-in-from-right duration-300 px-4">
                  <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200 text-sm text-center">
                    {successMessage}
                  </div>
                  <Button 
                    asChild 
                    className="w-full" 
                    variant="secondary" 
                    size="general"
                    height="sm"
                  >
                    <Link href="/login">Volver al Login</Link>
                  </Button>
                </div>
              ) : (
                // --- VISTA DEL FORMULARIO ---
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 w-full"
                >
                  <section className="flex justify-center flex-col gap-4 px-4">
                    
                    {/* INPUT EMAIL */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-body text-gray-700 ml-1">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input
                          {...form.register("email")}
                          type="email"
                          placeholder="ejemplo@cchc.cl"
                          variant="login"
                          iconPadding="left"
                          disabled={loading}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-right font-body text-xs">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex flex-col gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="general"
                        height="sm"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Enviando..." : "Enviar Enlace"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost" // O un botón simple
                        asChild
                        className="w-full text-gray-500 hover:text-gray-900"
                      >
                        <Link href="/login" className="flex items-center justify-center gap-2">
                           <ArrowLeft className="h-4 w-4" /> Volver al Login
                        </Link>
                      </Button>
                    </div>

                  </section>
                </form>
              )}
            </section>

            {/* ALERTAS DE ERROR */}
            {errorMessage && (
              <div className="px-4 max-w-[396px] mx-auto w-full">
                <StatusAlert variant="error" size="sm" height="sm">
                  {errorMessage}
                </StatusAlert>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
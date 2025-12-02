
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"; // Iconos

// Importamos lo que creamos antes
import { LoginSchema, TwoFactorSchema, LoginFormValues, TwoFactorFormValues } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";

// Importamos tus componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { startSession, user } = useAuth();

  // Redireccionar al dashboard si ya hay una sesión activa.
  // Este efecto se activará después de que startSession actualice el 'user'.
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);
  
  // Estado Visual
  const [step, setStep] = useState<1 | 2>(1); // 1 = Login, 2 = 2FA
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");
  
  // Estado de Datos (Para pasar el email del paso 1 al 2)
  const [tempEmail, setTempEmail] = useState("");

  // --- FORMULARIO PASO 1 (Credenciales) ---
  const formLogin = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", rememberDevice: false }
  });

  // --- FORMULARIO PASO 2 (Código 2FA) ---
  const form2FA = useForm<TwoFactorFormValues>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: { code: "" }
  });

  // --- HANDLER: ENVIAR CREDENCIALES ---
  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setGlobalError("");
    try {
      const response = await authService.login({ 
        email: data.email, 
        password: data.password 
      });

      if (response.requires2FA) {
        setTempEmail(data.email);
        setStep(2);
      }
    } catch (error) {
      setGlobalError("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: ENVIAR CÓDIGO ---
  const onCodeSubmit = async (data: TwoFactorFormValues) => {
    setLoading(true);
    setGlobalError("");
    try {
      const authResponse = await authService.verify2FA({ 
        email: tempEmail, 
        code: data.code 
      });
      
      // Delegamos el manejo de la sesión al hook
      startSession(authResponse);
      
      // El useEffect se encargará de la redirección
    } catch (error) {
      setGlobalError("El código ingresado es incorrecto.");
      setLoading(false); // Asegurarse de parar el loading en caso de error
    }
    // No ponemos finally(setLoading(false)) porque el componente se desmontará al redirigir
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-blue-900">
        
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
            {step === 1 ? <Lock className="w-6 h-6 text-blue-900" /> : <ShieldCheck className="w-6 h-6 text-blue-900" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 1 ? "Acceso Inmobiliario" : "Verificación de Seguridad"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Ingresa tus credenciales institucionales" 
              : `Ingresa el código enviado a ${tempEmail}`
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {globalError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 flex items-center gap-2">
              <span>⚠️</span> {globalError}
            </div>
          )}

          {/* --- VISTA PASO 1 --- */}
          {step === 1 && (
            <form onSubmit={formLogin.handleSubmit(onLoginSubmit)} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input 
                    {...formLogin.register("email")} 
                    className="pl-10" 
                    placeholder="usuario@cchc.cl"
                    error={formLogin.formState.errors.email?.message}
                  />
                </div>
                {formLogin.formState.errors.email && (
                  <p className="text-xs text-red-600">{formLogin.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input 
                    {...formLogin.register("password")} 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    error={formLogin.formState.errors.password?.message}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formLogin.formState.errors.password && (
                  <p className="text-xs text-red-600">{formLogin.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...formLogin.register("rememberDevice")} className="rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                  <span className="text-gray-600">Recordar dispositivo</span>
                </label>
                <a href="/forgot-password" className="text-blue-900 font-medium hover:underline">Recuperar clave</a>
              </div>

              <Button type="submit" className="w-full gap-2 text-black" disabled={loading}>
                {loading ? "Verificando..." : <>Ingresar <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          {/* --- VISTA PASO 2 (2FA) --- */}
          {step === 2 && (
            <form onSubmit={form2FA.handleSubmit(onCodeSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 text-center block">Código de 6 dígitos</label>
                <Input 
                  {...form2FA.register("code")} 
                  className="text-center text-3xl tracking-[0.5em] font-mono h-14" 
                  placeholder="000000"
                  maxLength={6}
                  error={form2FA.formState.errors.code?.message}
                />
                {form2FA.formState.errors.code && (
                  <p className="text-xs text-red-600 text-center">{form2FA.formState.errors.code.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={loading}>
                {loading ? "Validando..." : "Verificar Código"}
              </Button>

              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-center text-sm text-gray-500 hover:text-gray-900"
              >
                ← Volver a ingresar correo
              </button>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
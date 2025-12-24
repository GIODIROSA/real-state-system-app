import { useEffect, useState, useCallback } from "react";
import { User } from "@/types/user.types";
import { useRouter } from "next/navigation";
import {
  LoginCredentials,
  LoginResponse,
  TwoFactorPayload,
} from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { useGlobalError } from "@/context/global-error-context";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { triggerGlobalError } = useGlobalError();

  // Booleano útil para proteger rutas fácilmente
  const isAuthenticated = !!user;

  // 1. Cargar sesión al iniciar (Rehidratación)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUserStr = localStorage.getItem("user");

          if (storedUserStr) {
            const parsedUser= JSON.parse(storedUserStr);
            setUser(parsedUser);
            await authService.getUserProfile(parsedUser.email);
          }
        }
      } catch (error: any) {
        console.error("Error al validar sesión: ", error);
        if (
          error.message === "Network Error" ||
          error.response?.status >= 500
        ) {
          triggerGlobalError();
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleSessionSuccess = useCallback((userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  // 2. Función LOGIN
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        const response = await authService.login(credentials);

        // CASO A: Requiere 2FA
        if (response.requires_mfa) {
          return response;
        }

        // CASO B: Login directo (Éxito y no requiere MFA)
        if (response.success && !response.requires_mfa) {
          handleSessionSuccess(response.user, response.token);
        }

        return response;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    [handleSessionSuccess]
  );

  // 3. Función VERIFICAR 2FA
  const verify2FA = useCallback(
    async (code: string, email: string) => {
      try {
        const payload: TwoFactorPayload = { code };
        const response = await authService.verify2FA(payload);

        if (response.success) {
          const userWithRoles = await authService.getUserProfile(email);

          handleSessionSuccess(userWithRoles);
        }

        return response;
      } catch (error) {
        console.error("Error en verify2FA:", error);
        throw error;
      }
    },
    [handleSessionSuccess]
  );

  // 4. Función LOGOUT
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    verify2FA,
    logout,
  };
}

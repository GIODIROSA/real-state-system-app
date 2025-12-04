import { apiClient } from "@/lib/api/client";
import {
  LoginCredentials,
  TwoFactorPayload,
  AuthResponse,
} from "@/types/auth.types";
import { User } from "@/types/user.types"; 
import { ChangePasswordDTO } from "@/types/auth.types";

export const authService = {
  // --- PASO 1: Enviar Credenciales ---
  async login(
    credentials: LoginCredentials
  ): Promise<{ requires2FA: boolean }> {
    // CUANDO TENGAS EL BACKEND LISTO, DESCOMENTA ESTA LÍNEA:
    // const response = await apiClient.post("/auth/login", credentials);
    // return response.data;

    // --- SIMULACIÓN TEMPORAL (Para probar el Frontend YA) ---
    console.log("Simulando login para:", credentials.email);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulamos que el servidor responde "Todo OK, ahora dame el código 2FA"
        resolve({ requires2FA: true });
      }, 1500); // 1.5 segundos de "carga"
    });
  },

  // --- PASO 2: Verificar Código 2FA ---
  async verify2FA(payload: TwoFactorPayload): Promise<AuthResponse> {
    // CUANDO TENGAS EL BACKEND LISTO, DESCOMENTA:
    // const response = await apiClient.post("/auth/verify-2fa", payload);
    // return response.data;

    // --- SIMULACIÓN TEMPORAL ---
    console.log("Verificando código:", payload.code);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (payload.code === "123456") {
          const mockUser: User = {
            // Ensure mockUser conforms to User type
            id: 1,
            email: payload.email,
            name: "Test User",
            role: "admin",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          resolve({
            token: "fake-jwt-token",
            user: mockUser,
          });
        } else {
          reject(new Error("Código incorrecto (prueba con 123456)"));
        }
      }, 1500);
    });
  },

  // --- Método para cambiar la contraseña (simulado) ---
  async changePassword(data: ChangePasswordDTO): Promise<void> {
    console.log("Simulando cambio de contraseña para:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
};

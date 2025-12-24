import apiClient from "@/lib/api/client";
import {
  LoginCredentials,
  LoginResponse,
  LoginResponseSuccess,
  TwoFactorPayload,
  PermissionsResponse,
  BackendResponse,
} from "@/types/auth.types";
import { User } from "@/types/user.types";
// import { verify } from "crypto";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // 1. INICIAR SESIÓN
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const payloadDePrueba = {
      ...credentials,
      email_test: "gdirosa@flagare.cl",
    };

    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payloadDePrueba
    );

    //   const { data } = await apiClient.post<LoginResponse>(
    //   "/auth/login",
    //   credentials
    // );
    return data;
  },

  // 1.5 Verificar 2FA
  async verify2FA(payload: TwoFactorPayload): Promise<LoginResponseSuccess> {
    const { data } = await apiClient.post<LoginResponseSuccess>(
      "/auth/mfa/validate",
      payload
    );
    console.log("✅ DEBUG - Respuesta de verify2FA:", data);
    return data;
  },

  //2. Obtener perfil y roles
  async getUserProfile(email: string, retries = 3): Promise<User> {
    try {
      console.log("🔍 DEBUG - Preparando petición de Permisos:", {
        email,
      });

      const { data } = await apiClient.get<
        BackendResponse<PermissionsResponse>
      >("/permissions/user", {
        params: { email: email },
        withCredentials: true,
      });

      console.log("✅ DEBUG - Respuesta del servidor:", data);

      if (!data.success || !data.data) {
        throw new Error("Datos de permisos incompletos");
      }

      const userData = data.data;

      // 3.0 Mapea los permisos
      const flattenedPermissions = userData.permissions.map((p) => p.name);

      // 3.1 Construir usuario

      const user: User = {
        id: typeof email === "string" ? parseInt(email) : 0,
        email: email,
        first_name: email.split("@")[0],
        last_name: "",
        name: email.split("@")[0],
        role: userData.roles[0] || "User",
        roles: userData.roles,
        permissions: flattenedPermissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error: any) {
      console.warn(
        `⚠️ Intento fallido obteniendo permisos. Quedan ${retries} intentos.`
      );

      if (
        retries > 0 &&
        (error.response?.status === 500 || error.code === "ERR_NETWORK")
      ) {
        await wait(1000);

        return authService.getUserProfile(email, retries - 1);
      }

      console.error(
        "❌ No se pudo recuperar el usuario real tras varios intentos."
      );
      throw error;
    }
  },

  // 3. LOGOUT
  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      //silent fail
    }
  },

  // 4. FORGOT PASSWORD
  async forgotPassword(email: string) {
    //Endpoint: POST /api/auth/forgot-password
    // Body: {"email": "test@test.com"}

    try {
      const { data } = await apiClient.post<BackendResponse<any>>(
        "/auth/forgot-password",
        {
          email: email,
          email_test: "gdirosa@flagare.cl",
        }
      );

      if (!data.success) {
        throw new Error(data.message || "No se pudo procesar la solicitud.");
      }

      return data;
    } catch (error) {
      console.error("Error en fogortPassword:", error);
      throw error;
    }
  },

  // 5. RESTABLECER CONTRASEÑA
  async resetPassword(token: string, password: string) {
    try {
      const { data } = await apiClient.post<BackendResponse<any>>(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      if (!data.success) {
        throw new Error(data.message || "No se pudo restablecer la contraseña");
      }

      return data;
    } catch (error) {
      console.error("Error en resetPassword:", error);
      throw error;
    }
  },

  // 6. ACTIVAR CUENTA (Primer ingreso)
  async activateAccount(email: string, tempPass: string, newPass: string) {
    try {
      // Body solicitado:
      // { "temporal_password": "...", "password": "...", "email": "..." }
      const { data } = await apiClient.post<BackendResponse<any>>(
        "/auth/activate",
        {
          email: email,
          temporal_password: tempPass,
          password: newPass,
        }
      );

      if (!data.success) {
        throw new Error(data.message || "No se pudo activar la cuenta.");
      }
      return data;
    } catch (error) {
      console.error("Error en activateAccount:", error);
      throw error;
    }
  },
};

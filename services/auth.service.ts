import apiClient from "@/lib/api/client";
import {
  LoginCredentials,
  BackendLoginResponse,
  PermissionsResponse,
} from "@/types/auth.types";
import { User } from "@/types/user.types";
// import { verify } from "crypto";

export const authService = {
  // 1. INICIAR SESIÓN (Setea la cookies)
  async login(credentials: LoginCredentials) {
    const { data } = await apiClient.post<BackendLoginResponse<any>>(
      "/auth/login",
      credentials
    );
    return data;
  },

  //2. Obtener perfil y roles
  async getUserProfile(email: string): Promise<User> {
    try {
      const { data } = await apiClient.get<
        BackendLoginResponse<PermissionsResponse>
      >("/permissions/user", {
        data: { email: email },
      });

      if (!data.success || !data.data) {
        throw new Error("No se pudieron cargar los permisos del usuario");
      }

      // 3. Construir usuario

      const userData = data.data;

      const user: User = {
        id: email,
        email: email,
        name: email.split("@")[0],
        role: userData.roles[0] || "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // opcional guardar los permisos restante.
      };

      return user;
    } catch (error) {
      console.error("Error obtenindo permisos:", error);
      throw error;
    }
  },

  // 3. LOGOUT
  async logout() {
    try {
      await apiClient.post("/autg/logout");
    } catch (error) {
      //silent fail
    }
  },
};

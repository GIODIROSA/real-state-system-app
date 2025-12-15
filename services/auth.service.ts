import apiClient from "@/lib/api/client";
import {
  LoginCredentials,
  BackendLoginResponse,
  PermissionsResponse,
  BackendResponse 
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

      const userData= data.data;

      // 3.0 Mapea los permisos
      const flattenedPermissions = userData.permissions.map(p => p.name);

      // 3.1 Construir usuario

      const user: User = {
        id: email,
        email: email,
        name: email.split("@")[0],
        role: userData.roles[0] || "User",
        permissions: flattenedPermissions,
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

  // 4. FORGOT PASSWORD
  async forgotPassword(email: string){

    //Endpoint: POST /api/auth/forgot-password
    // Body: {"email": "test@test.com"}

    try{
      const {data} = await apiClient.post<BackendResponse<any>>("/auth/forgot-password", {
        email: email,
        email_test: "gdirosa@flagare.cl"
      });

      if(!data.success){
        throw new Error(data.message || "No se pudo procesar la solicitud.");
      }

      return data;

    }catch(error){

      console.error("Error en fogortPassword:", error);
      throw error;

    }
  },

  // 5. RESTABLECER CONTRASEÑA
  async resetPassword(token: string, password: string){
    try {
      const {data} = await apiClient.post<BackendResponse<any>>("/auth/reset-password", {
        token,
        password
      });

      if(!data.success){
        throw new Error(data.message || "No se pudo restablecer la contraseña")
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
      const { data } = await apiClient.post<BackendResponse<any>>("/auth/activate", {
        email: email,
        temporal_password: tempPass,
        password: newPass
      });

      if (!data.success) {
        throw new Error(data.message || "No se pudo activar la cuenta.");
      }
      return data;
    } catch (error) {
      console.error("Error en activateAccount:", error);
      throw error;
    }
  }


};



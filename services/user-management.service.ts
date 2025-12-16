import apiClient from "@/lib/api/client";
import { BackendResponse } from "@/types/auth.types";
import {
  UserManagementItem,
  Role,
  Chamber,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user-management.types";

export const userManagementService = {
  // 1. Obtener todos los usuarios
  async getAllUsers() {
    const { data } = await apiClient.get<
      BackendResponse<{ users: UserManagementItem[] }>
    >("/users/get-all");
    return data.data?.users || [];
  },

  //2. Obtener roles
  async getRoles() {
    const { data } = await apiClient.get<BackendResponse<{ roles: Role[] }>>(
      "/users/utils/roles"
    );
    return data.data?.roles || [];
  },

  //3. Obtener Cámaras
  async getChambers() {
    const { data } = await apiClient.get<
      BackendResponse<{ chambers: Chamber[] }>
    >("/users/utils/chambers");
    return data.data?.chambers || [];
  },

  //4. Crear usuario
  async createUser(payload: CreateUserPayload) {
    const { data } = await apiClient.post<BackendResponse<any>>(
      "/new-user/create",
      payload
    );
    return data;
  },

  //5. Actualizar usuario
  async updateUser(payload: UpdateUserPayload) {
    const response = await apiClient.patch<BackendResponse<any>>(
      "/users/user",
      {
        data: payload,
      }
    );
    return response.data;
  },
};

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Plus,
  Edit,
  Shield,
  Video,
  User as UserIcon,
  Loader2,
  Save,
} from "lucide-react";
import { AxiosError } from "axios";
import { usePermissions } from "@/hooks/use-permissions";

// Imports
import { userManagementService } from "@/services/user-management.service";
import {
  UserManagementItem,
  Role,
  Chamber,
} from "@/types/user-management.types";
import {
  UserFormSchema,
  UserFormValues,
} from "@/lib/schemas/user-management.schema";
import { Button, Input, StatusAlert } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui";
import { Label } from "@/components/ui";
import { NativeSelect } from "@/components/ui";
import PermissionGuard from "@/components/auth/permission-guard";

export default function UserManagementPage() {
  const { can } = usePermissions();

  // Estados de Datos
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingUser, setEditingUser] = useState<UserManagementItem | null>(
    null
  );

  // Abrir modal en modo CREAR
  const handleOpenCreate = () => {
    setEditingUser(null);
    form.reset({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role_ids: [],
      chamber_ids: [],
      account_status: "ACTIVE" as const,
    });
    setIsDialogOpen(true);
  };

  // Abrir el modal en modo EDITAR
  const handleOpenEdit = (user: UserManagementItem) => {
    setEditingUser(user);

    form.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number || "",
      role_ids: user.roles.map((r) => r.id),
      chamber_ids: user.chambers.map((c) => c.id),
      account_status:
        (user.account_status as UserFormValues["account_status"]) || "ACTIVE",
    });

    setIsDialogOpen(true);
  };

  // Hook Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role_ids: [],
      chamber_ids: [],
      account_status: "ACTIVE",
    },
  });

  // 1. CARGA INICIAL DE DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData, chambersData] = await Promise.all([
          userManagementService.getAllUsers(),
          userManagementService.getRoles(),
          userManagementService.getChambers(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setChambers(chambersData);
      } catch (err) {
        setErrorGlobal("Error cargando la lista de usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. MANEJO DEL FORMULARIO (CREAR O EDITAR)
  const onSubmit = async (data: UserFormValues) => {
    setActionLoading(true);
    setErrorGlobal("");
    setSuccessMsg("");

    try {
      if (editingUser) {
        // --- MODO EDICIÓN ---
        await userManagementService.updateUser({
          id: editingUser.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          account_status: data.account_status,
        });
        setSuccessMsg("Usuario actualizado exitosamente.");
      } else {
        // --- MODO CREACIÓN ---
        await userManagementService.createUser({
          ...data,
          profile_picture_url: "",
          // En creación el status lo decide el backend
        });
        setSuccessMsg("Usuario creado exitosamente.");
      }

      setIsDialogOpen(false);
      form.reset();

      // Recargar tabla
      const updatedUsers = await userManagementService.getAllUsers();
      setUsers(updatedUsers);

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorGlobal(
          error.response?.data?.message || "Error al procesar la solicitud."
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Helper para renderizar estado con colores
  const renderStatusBadge = (status: string) => {
    const styles =
      {
        ACTIVE: "bg-green-100 text-green-800 border-green-200",
        BLOCKED: "bg-red-100 text-red-800 border-red-200",
        PENDING_CONFIRMATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
        INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
      }[status] || "bg-gray-100 text-gray-800";

    // Traducción simple para visualización
    const labels = {
      ACTIVE: "Activo",
      BLOCKED: "Bloqueado",
      PENDING_CONFIRMATION: "Pendiente",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles}`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <PermissionGuard permission="user:read">
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="gap-2">
                Volver al Panel
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-500">
              Administra accesos, roles y asignación de cámaras.
            </p>
          </div>

          {/* BOTÓN CREAR (Abre Modal) */}
          {can("user:create") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button
                variant="secondary"
                size="sm"
                height="sm"
                onClick={handleOpenCreate}
              >
                <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </Button>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 pt-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        {...form.register("first_name")}
                        placeholder="Ej: Juan"
                      />
                      {form.formState.errors.first_name && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input
                        {...form.register("last_name")}
                        placeholder="Ej: Pérez"
                      />
                      {form.formState.errors.last_name && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Correo Institucional</Label>
                      <Input
                        {...form.register("email")}
                        placeholder="nombre@cchc.cl"
                        type="email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input
                        {...form.register("phone_number")}
                        placeholder="+569..."
                      />
                      {form.formState.errors.phone_number && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.phone_number.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Estado de la Cuenta</Label>
                      <NativeSelect {...form.register("account_status")}>
                        <option value="ACTIVE">Activo</option>
                        <option value="BLOCKED">Bloqueado</option>
                        <option value="INACTIVE">Inactivo</option>
                        <option value="PENDING_CONFIRMATION">Pendiente</option>
                      </NativeSelect>
                      {form.formState.errors.account_status && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.account_status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SELECCIÓN MÚLTIPLE DE ROLES */}
                  <div className="space-y-3 border p-4 rounded-md bg-slate-50">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Asignar Roles (Acumulativo)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`role-${role.id}`}
                            onCheckedChange={(checked) => {
                              const current = form.getValues("role_ids");
                              if (checked)
                                form.setValue("role_ids", [
                                  ...current,
                                  role.id,
                                ]);
                              else
                                form.setValue(
                                  "role_ids",
                                  current.filter((id) => id !== role.id)
                                );
                            }}
                          />
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="cursor-pointer font-normal"
                          >
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.role_ids && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.role_ids.message}
                      </p>
                    )}
                  </div>

                  {/* SELECCIÓN MÚLTIPLE DE CÁMARAS */}
                  <div className="space-y-3 border p-4 rounded-md bg-slate-50">
                    <Label className="flex items-center gap-2">
                      <Video className="h-4 w-4" /> Asignar Cámaras / Regiones
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {chambers.map((cham) => (
                        <div
                          key={cham.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cam-${cham.id}`}
                            onCheckedChange={(checked) => {
                              const current = form.getValues("chamber_ids");
                              if (checked)
                                form.setValue("chamber_ids", [
                                  ...current,
                                  cham.id,
                                ]);
                              else
                                form.setValue(
                                  "chamber_ids",
                                  current.filter((id) => id !== cham.id)
                                );
                            }}
                          />
                          <Label
                            htmlFor={`cam-${cham.id}`}
                            className="cursor-pointer font-normal truncate text-xs"
                            title={cham.name}
                          >
                            {cham.region}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.chamber_ids && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.chamber_ids.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      variant="secondary"
                      size="sm"
                      height="sm"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {editingUser ? "Actualizar Usuario" : "Guardar Usuario"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* FEEDBACK */}
        {errorGlobal && (
          <StatusAlert variant="error">{errorGlobal}</StatusAlert>
        )}
        {successMsg && (
          <StatusAlert variant="success">{successMsg}</StatusAlert>
        )}

        {/* TABLA DE USUARIOS */}
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Usuario</th>
                  <th className="px-6 py-3">Roles</th>
                  <th className="px-6 py-3">Regiones</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <span
                            key={r.id}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-xs text-gray-500 max-w-[150px] truncate"
                        title={user.chambers.map((c) => c.region).join(", ")}
                      >
                        {user.chambers.length > 0
                          ? user.chambers.map((c) => c.region).join(", ")
                          : "Sin asignar"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(user.account_status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {can("user:update") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenEdit(user)}
                        >
                          <Edit className="h-4 w-4 text-gray-500 hover:text-blue-900" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}

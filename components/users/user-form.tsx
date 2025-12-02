/**
 * @fileoverview Formulario de usuario (crear/editar)
 */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CreateUserSchema, CreateUserFormValues } from "@/lib/schemas/auth.schema";
import { User } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  // Cuando se edita, no validamos la contraseña.
  // Podríamos tener un esquema de edición separado si las reglas fueran diferentes.
  const isEditing = !!user;
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  // Si se pasa un usuario (modo edición), reseteamos los valores del formulario.
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user, form]);

  const handleFormSubmit = (data: CreateUserFormValues) => {
    // Si estamos editando, no queremos enviar una contraseña vacía.
    if (isEditing) {
      const { password, ...updateData } = data;
      onSubmit(updateData as CreateUserFormValues);
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nombre
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Ingresa el nombre"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-600 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
          disabled={isLoading}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-600 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      {!isEditing && (
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...form.register("password")}
              error={form.formState.errors.password?.message}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

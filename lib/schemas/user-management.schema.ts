import { z } from "zod";

export const UserFormSchema = z.object({
  first_name: z.string().min(2, "Nombre requerido"),
  last_name: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Correo inválido"),
  phone_number: z.string().min(8, "Teléfone requerido"),
  account_status: z
    .enum(["ACTIVE", "BLOCKED", "INACTIVE", "PENDING_CONFIRMATION"]),
  role_ids: z.array(z.number()).min(1, "Debe asignar al menos un rol"),
  chamber_ids: z.array(z.number()),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;

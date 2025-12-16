import { z } from "zod";

export const UserFormSchema = z.object({
  first_name: z.string().min(2, "Nombre requerido"),
  last_name: z.string().min(2, "Apellido requerido"),
  email: z.email("Correo inválido"),
  phone_number: z.string().min(8, "Teléfone requerido"),
  role_ids: z.array(z.number()).min(1, "Debe asignar al menos un rol"),
  chamber_ids: z
    .array(z.number())
    .min(1, "Debe asignar al menos una cámara/región"),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;


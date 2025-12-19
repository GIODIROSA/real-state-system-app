export type Permission =
  | "user:read"
  | "user:create"
  | "user:update"
  | "user:delete"
  | "data:view"
  | "data:export"
  | "data:manage"
  | "audit:view"
  | "period:manage"
  | "config:manage"
  | "chamber:manage";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // El SuperAdmin puede hacer todo
  SuperAdmin: [
    "user:read",
    "user:create",
    "user:update",
    "data:view",
    "data:export",
    "audit:view",
    "period:manage",
    "config:manage",
  ],

  //El Admin puede crear y editar
  Admin: ["user:read", "user:create"],

  //El Manager solo puedo leer y editar
  Manager: ["user:read"],

  // El User puede leer usuarios y ver cámaras
  User: ["user:read"],

  Guest: [],

  // El Auditor acceso Logs
  Auditor: [],

  // GestorAplicacion
  GestorAplicacion: ["user:read", "user:create", "user:update", "user:delete"],

  // Gestiona - usuarios de su alcance regional
  AdministradorSede: [
    "user:read",
    "user:create",
    "user:update",
    "data:view",
    "data:export",
    "audit:view",
    "period:manage",
    "config:manage",
  ],

  // Ingresa y gestiona toda la información
  CargaDatos: ["user:read", "data:view", "data:manage"],

  // Solo visualiza y exporta información
  ReporteriaExploracion: ["data:view", "data:export"],
};
